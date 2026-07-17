import { createHash, timingSafeEqual } from "node:crypto"
import { getPayload } from "payload"

import config from "@payload-config"
import { canTransitionPaymentStatus } from "@/features/booking/payment-transitions"
import { sendPaymentStatusNotification } from "@/features/booking/payment-notifications"
import { markPaymentPaid } from "@/features/booking/payment-persistence"
import { createWebhookEventOnce } from "@/features/booking/webhook-events"
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
  const form = await request.formData()
  const data = form.get("data")
  const signature = form.get("signature")
  if (typeof data !== "string" || typeof signature !== "string") {
    return Response.json({ error: "Invalid callback" }, { status: 400 })
  }
  const expected = Buffer.from(liqpaySignature(data))
  const supplied = Buffer.from(signature)
  if (
    expected.length !== supplied.length ||
    !timingSafeEqual(expected, supplied)
  ) {
    return Response.json({ error: "Invalid signature" }, { status: 400 })
  }

  let callback: LiqPayCallback
  try {
    callback = JSON.parse(Buffer.from(data, "base64").toString("utf8"))
  } catch {
    return Response.json({ error: "Invalid data" }, { status: 400 })
  }
  if (!callback.order_id || !callback.status) {
    return Response.json({ error: "Invalid event" }, { status: 400 })
  }

  const providerEventID = `liqpay:${callback.order_id}:${callback.status}:${callback.transaction_id ?? callback.payment_id ?? "none"}`
  const payload = await getPayload({ config })
  const duplicate = await payload.find({
    collection: "webhook-events",
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { providerEventID: { equals: providerEventID } },
  })
  if (duplicate.docs[0]) return Response.json({ received: true })
  const orders = await payload.find({
    collection: "payment-orders",
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { orderUUID: { equals: callback.order_id } },
  })
  const order = orders.docs[0]
  const webhook = await createWebhookEventOnce({
    payload,
    provider: "liqpay",
    providerEventID,
    eventType: callback.status,
    processingStatus: order ? "received" : "ignored",
    paymentOrder: order?.id,
    payloadHash: createHash("sha256").update(data).digest("hex"),
  })
  if (!webhook) return Response.json({ received: true })
  if (!order || order.provider !== "liqpay") {
    return Response.json({ received: true })
  }

  const bookingID =
    typeof order.bookingRequest === "string"
      ? order.bookingRequest
      : order.bookingRequest.id
  const notify = async (status: "paid" | "failed" | "refunded") => {
    const delivery = await sendPaymentStatusNotification({
      payload,
      bookingRequestID: bookingID,
      orderUUID: order.orderUUID,
      status,
    })
    await payload.update({
      collection: "payment-orders",
      id: order.id,
      context: { service: "liqpay-webhook" },
      data: {
        notificationStatus: delivery.sent ? "sent" : "failed",
        notificationError: delivery.sent ? null : delivery.error,
      },
      overrideAccess: true,
    })
  }

  try {
    const amount = Math.round((callback.amount ?? -1) * 100)
    const paid =
      callback.status === "success" ||
      (callback.status === "sandbox" && order.mode === "test")
    if (paid) {
      if (amount !== order.amount || callback.currency !== order.currency) {
        throw new Error("Provider amount or currency mismatch")
      }
      if (canTransitionPaymentStatus(order.status, "paid")) {
        await markPaymentPaid({
          payload,
          order,
          paidAmount: amount,
          providerOrderID: String(
            callback.transaction_id ?? callback.payment_id ?? callback.order_id
          ),
          service: "liqpay-webhook",
        })
        await notify("paid")
      }
    } else if (
      ["failure", "error"].includes(callback.status) &&
      canTransitionPaymentStatus(order.status, "failed")
    ) {
      await payload.update({
        collection: "payment-orders",
        id: order.id,
        data: { status: "failed", safeFailureCode: callback.status },
        overrideAccess: true,
      })
      await notify("failed")
    } else if (["reversed", "refund"].includes(callback.status)) {
      const refundedAmount = amount > 0 ? amount : order.amount
      const nextStatus =
        refundedAmount >= order.amount
          ? ("refunded" as const)
          : ("partially-refunded" as const)
      if (canTransitionPaymentStatus(order.status, nextStatus)) {
        await payload.update({
          collection: "payment-orders",
          id: order.id,
          data: {
            status: nextStatus,
            refundedAmount,
            refundedAt: new Date().toISOString(),
          },
          overrideAccess: true,
        })
        await notify("refunded")
      }
    }
    await payload.update({
      collection: "webhook-events",
      id: webhook.id,
      data: { processingStatus: "processed" },
      overrideAccess: true,
    })
    return Response.json({ received: true })
  } catch (error) {
    await payload.update({
      collection: "webhook-events",
      id: webhook.id,
      data: {
        processingStatus: "failed",
        sanitizedError:
          error instanceof Error
            ? error.message.slice(0, 500)
            : "Processing failed",
      },
      overrideAccess: true,
    })
    return Response.json({ error: "Event processing failed" }, { status: 400 })
  }
}
