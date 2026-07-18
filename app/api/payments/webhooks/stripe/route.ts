import { createHash, createHmac, timingSafeEqual } from "node:crypto"
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

type StripeEvent = {
  id: string
  type: string
  data: {
    object: {
      id?: string
      amount_total?: number | null
      currency?: string | null
      payment_status?: string | null
      payment_intent?: string | null
      amount_refunded?: number | null
      client_reference_id?: string | null
      metadata?: { order_uuid?: string }
    }
  }
}

function verifyStripeSignature(body: string, header: string) {
  if (!env.STRIPE_WEBHOOK_SECRET) return false
  const parts = header.split(",")
  const timestamp = parts.find((part) => part.startsWith("t="))?.slice(2)
  const signatures = parts
    .filter((part) => part.startsWith("v1="))
    .map((part) => part.slice(3))
  if (!timestamp || signatures.length === 0) return false
  const seconds = Number(timestamp)
  if (!Number.isFinite(seconds) || Math.abs(Date.now() / 1000 - seconds) > 300)
    return false
  const expected = createHmac("sha256", env.STRIPE_WEBHOOK_SECRET)
    .update(`${timestamp}.${body}`)
    .digest("hex")
  return signatures.some((signature) => {
    const left = Buffer.from(expected)
    const right = Buffer.from(signature)
    return left.length === right.length && timingSafeEqual(left, right)
  })
}

export async function POST(request: Request) {
  const requestCorrelationID = correlationID(request)
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")
  if (!signature || !verifyStripeSignature(body, signature)) {
    return Response.json(
      { error: "Invalid signature", correlationID: requestCorrelationID },
      { status: 400 }
    )
  }

  let event: StripeEvent
  try {
    event = JSON.parse(body) as StripeEvent
  } catch {
    return Response.json(
      { error: "Invalid payload", correlationID: requestCorrelationID },
      { status: 400 }
    )
  }
  if (!event.id || !event.type || !event.data?.object) {
    return Response.json(
      { error: "Invalid event", correlationID: requestCorrelationID },
      { status: 400 }
    )
  }

  const payload = await getPayload({ config })
  const object = event.data.object
  const orderUUID = object.metadata?.order_uuid ?? object.client_reference_id

  try {
    await processWebhookEvent({
      payload,
      provider: "stripe",
      providerEventID: event.id,
      eventType: event.type,
      payloadHash: createHash("sha256").update(body).digest("hex"),
      normalizedPayload: {
        amount: object.amount_total ?? object.amount_refunded ?? null,
        currency: object.currency?.toUpperCase() ?? null,
        objectID: object.id ?? null,
        orderUUID: orderUUID ?? null,
        paymentIntentID: object.payment_intent ?? null,
        paymentStatus: object.payment_status ?? null,
      },
      process: async () => {
        if (!orderUUID && !object.payment_intent) return { status: "ignored" }
        const result = await payload.find({
          collection: "payment-orders",
          depth: 0,
          limit: 1,
          overrideAccess: true,
          where: orderUUID
            ? { orderUUID: { equals: orderUUID } }
            : { providerPaymentID: { equals: object.payment_intent } },
        })
        const order = result.docs[0]
        if (!order || order.provider !== "stripe") return { status: "ignored" }

        const paymentOrder = order.id
        const paid =
          [
            "checkout.session.completed",
            "checkout.session.async_payment_succeeded",
          ].includes(event.type) && object.payment_status === "paid"
        if (paid) {
          if (
            object.amount_total !== order.amount ||
            object.currency?.toUpperCase() !== order.currency
          ) {
            throw new Error("Provider amount or currency mismatch")
          }
          await transitionPayment({
            payload,
            orderID: order.id,
            service: "stripe-webhook",
            transition: {
              status: "paid",
              paidAmount: object.amount_total,
              providerOrderID: object.id,
              providerPaymentID: object.payment_intent,
            },
            notificationStatus: "paid",
          })
        } else if (
          event.type === "charge.refunded" &&
          object.amount_refunded != null
        ) {
          if (
            object.currency?.toUpperCase() !== order.currency ||
            object.amount_refunded <= 0 ||
            object.amount_refunded > order.amount
          ) {
            throw new Error("Provider refund amount or currency mismatch")
          }
          const status =
            object.amount_refunded === order.amount
              ? ("refunded" as const)
              : ("partially-refunded" as const)
          await transitionPayment({
            payload,
            orderID: order.id,
            service: "stripe-webhook",
            transition: {
              status,
              refundedAmount: object.amount_refunded,
            },
            notificationStatus: "refunded",
            notificationDedupe: `${status}:${object.amount_refunded}`,
          })
        } else if (event.type === "charge.dispute.created") {
          await transitionPayment({
            payload,
            orderID: order.id,
            service: "stripe-webhook",
            transition: { status: "disputed", safeFailureCode: "disputed" },
          })
        } else if (event.type === "checkout.session.expired") {
          await transitionPayment({
            payload,
            orderID: order.id,
            service: "stripe-webhook",
            transition: { status: "expired", safeFailureCode: "expired" },
            notificationStatus: "failed",
            notificationDedupe: "expired",
          })
        } else if (event.type === "checkout.session.async_payment_failed") {
          await transitionPayment({
            payload,
            orderID: order.id,
            service: "stripe-webhook",
            transition: {
              status: "failed",
              safeFailureCode: "async-payment-failed",
            },
            notificationStatus: "failed",
          })
        } else {
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
      operation: "stripe-webhook",
      code: "webhook-processing-failed",
      error,
    })
    return Response.json(
      { error: "Event processing failed", correlationID: requestCorrelationID },
      { status: 500 }
    )
  }
}
