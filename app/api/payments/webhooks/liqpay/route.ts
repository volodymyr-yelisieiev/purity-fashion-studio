import { createHash, timingSafeEqual } from "node:crypto"
import { after } from "next/server"
import { getPayload } from "payload"

import config from "@payload-config"
import { deliverNotificationBatch } from "@/features/booking/notification-outbox"
import {
  correlationID,
  logOperationError,
} from "@/features/booking/operation-log"
import { transitionPayment } from "@/features/booking/payment-persistence"
import { processWebhookEvent } from "@/features/booking/webhook-events"
import { env } from "@/lib/env"

type LiqPayCallback = {
  order_id?: string
  payment_id?: number
  transaction_id?: number
  status?: string
  amount?: number
  currency?: string
}

function liqpaySignature(data: string) {
  if (!env.LIQPAY_PRIVATE_KEY) return ""
  return createHash("sha3-256")
    .update(`${env.LIQPAY_PRIVATE_KEY}${data}${env.LIQPAY_PRIVATE_KEY}`)
    .digest("base64")
}

export async function POST(request: Request) {
  const requestCorrelationID = correlationID(request)
  const form = await request.formData()
  const data = form.get("data")
  const signature = form.get("signature")
  if (typeof data !== "string" || typeof signature !== "string") {
    return Response.json(
      { error: "Invalid callback", correlationID: requestCorrelationID },
      { status: 400 }
    )
  }
  const expected = Buffer.from(liqpaySignature(data))
  const supplied = Buffer.from(signature)
  if (
    expected.length !== supplied.length ||
    !timingSafeEqual(expected, supplied)
  ) {
    return Response.json(
      { error: "Invalid signature", correlationID: requestCorrelationID },
      { status: 400 }
    )
  }

  let callback: LiqPayCallback
  try {
    callback = JSON.parse(Buffer.from(data, "base64").toString("utf8"))
  } catch {
    return Response.json(
      { error: "Invalid data", correlationID: requestCorrelationID },
      { status: 400 }
    )
  }
  if (!callback.order_id || !callback.status) {
    return Response.json(
      { error: "Invalid event", correlationID: requestCorrelationID },
      { status: 400 }
    )
  }

  const callbackStatus = callback.status
  const providerEventID = `${callback.order_id}:${callbackStatus}:${callback.transaction_id ?? callback.payment_id ?? "none"}`
  const payload = await getPayload({ config })
  const amount = Math.round((callback.amount ?? -1) * 100)

  try {
    await processWebhookEvent({
      payload,
      provider: "liqpay",
      providerEventID,
      eventType: callbackStatus,
      payloadHash: createHash("sha256").update(data).digest("hex"),
      normalizedPayload: {
        amount,
        currency: callback.currency?.toUpperCase() ?? null,
        orderUUID: callback.order_id,
        paymentID: callback.payment_id ?? null,
        status: callbackStatus,
        transactionID: callback.transaction_id ?? null,
      },
      process: async () => {
        const result = await payload.find({
          collection: "payment-orders",
          depth: 0,
          limit: 1,
          overrideAccess: true,
          where: { orderUUID: { equals: callback.order_id } },
        })
        const order = result.docs[0]
        if (!order || order.provider !== "liqpay") return { status: "ignored" }

        const paymentOrder = order.id
        const paid =
          callbackStatus === "success" ||
          (callbackStatus === "sandbox" && order.mode === "test")
        if (paid) {
          if (
            amount !== order.amount ||
            callback.currency?.toUpperCase() !== order.currency
          ) {
            throw new Error("Provider amount or currency mismatch")
          }
          await transitionPayment({
            payload,
            orderID: order.id,
            service: "liqpay-webhook",
            transition: {
              status: "paid",
              paidAmount: amount,
              providerOrderID: String(
                callback.transaction_id ??
                  callback.payment_id ??
                  callback.order_id
              ),
              providerPaymentID:
                callback.payment_id == null
                  ? null
                  : String(callback.payment_id),
            },
            notificationStatus: "paid",
          })
        } else if (["failure", "error"].includes(callbackStatus)) {
          await transitionPayment({
            payload,
            orderID: order.id,
            service: "liqpay-webhook",
            transition: {
              status: "failed",
              safeFailureCode: callbackStatus,
            },
            notificationStatus: "failed",
          })
        } else if (["reversed", "refund"].includes(callbackStatus)) {
          const refundedAmount = amount > 0 ? amount : order.amount
          if (refundedAmount <= 0 || refundedAmount > order.amount) {
            throw new Error("Provider refund amount mismatch")
          }
          const status =
            refundedAmount === order.amount
              ? ("refunded" as const)
              : ("partially-refunded" as const)
          await transitionPayment({
            payload,
            orderID: order.id,
            service: "liqpay-webhook",
            transition: { status, refundedAmount },
            notificationStatus: "refunded",
            notificationDedupe: `${status}:${refundedAmount}`,
          })
        } else if (["expired", "unsubscribed"].includes(callbackStatus)) {
          await transitionPayment({
            payload,
            orderID: order.id,
            service: "liqpay-webhook",
            transition: { status: "expired", safeFailureCode: callbackStatus },
            notificationStatus: "failed",
            notificationDedupe: "expired",
          })
        } else if (["chargeback", "hold_wait"].includes(callbackStatus)) {
          await transitionPayment({
            payload,
            orderID: order.id,
            service: "liqpay-webhook",
            transition: { status: "disputed", safeFailureCode: "disputed" },
          })
        } else if (
          !["wait_secure", "processing", "prepared", "3ds_verify"].includes(
            callbackStatus
          )
        ) {
          return { paymentOrder, status: "ignored" }
        }
        return { paymentOrder, status: "processed" }
      },
    })
    after(() => deliverNotificationBatch(payload, 10))
    return Response.json({
      received: true,
      correlationID: requestCorrelationID,
    })
  } catch (error) {
    logOperationError({
      payload,
      correlationID: requestCorrelationID,
      operation: "liqpay-webhook",
      code: "webhook-processing-failed",
      error,
    })
    return Response.json(
      { error: "Event processing failed", correlationID: requestCorrelationID },
      { status: 500 }
    )
  }
}
