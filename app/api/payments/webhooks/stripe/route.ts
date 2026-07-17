import { createHash, createHmac, timingSafeEqual } from "node:crypto"
import { getPayload } from "payload"

import config from "@payload-config"
import { canTransitionPaymentStatus } from "@/features/booking/payment-transitions"
import { sendPaymentStatusNotification } from "@/features/booking/payment-notifications"
import { markPaymentPaid } from "@/features/booking/payment-persistence"
import { createWebhookEventOnce } from "@/features/booking/webhook-events"
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
      amount?: number | null
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
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")
  if (!signature || !verifyStripeSignature(body, signature)) {
    return Response.json({ error: "Invalid signature" }, { status: 400 })
  }

  let event: StripeEvent
  try {
    event = JSON.parse(body) as StripeEvent
  } catch {
    return Response.json({ error: "Invalid payload" }, { status: 400 })
  }
  if (!event.id || !event.type || !event.data?.object) {
    return Response.json({ error: "Invalid event" }, { status: 400 })
  }

  const payload = await getPayload({ config })
  const duplicate = await payload.find({
    collection: "webhook-events",
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { providerEventID: { equals: event.id } },
  })
  if (duplicate.docs[0]) return Response.json({ received: true })

  const webhook = await createWebhookEventOnce({
    payload,
    provider: "stripe",
    providerEventID: event.id,
    eventType: event.type,
    payloadHash: createHash("sha256").update(body).digest("hex"),
  })
  if (!webhook) return Response.json({ received: true })
  const object = event.data.object
  const orderUUID = object.metadata?.order_uuid ?? object.client_reference_id
  if (!orderUUID && !object.payment_intent) {
    await payload.update({
      collection: "webhook-events",
      id: webhook.id,
      data: { processingStatus: "ignored" },
      overrideAccess: true,
    })
    return Response.json({ received: true })
  }

  const orders = await payload.find({
    collection: "payment-orders",
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: orderUUID
      ? { orderUUID: { equals: orderUUID } }
      : { providerPaymentID: { equals: object.payment_intent } },
  })
  const order = orders.docs[0]
  if (!order || order.provider !== "stripe") {
    await payload.update({
      collection: "webhook-events",
      id: webhook.id,
      data: { processingStatus: "ignored" },
      overrideAccess: true,
    })
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
      context: { service: "stripe-webhook" },
      data: {
        notificationStatus: delivery.sent ? "sent" : "failed",
        notificationError: delivery.sent ? null : delivery.error,
      },
      overrideAccess: true,
    })
  }

  try {
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
      if (canTransitionPaymentStatus(order.status, "paid")) {
        await markPaymentPaid({
          payload,
          order,
          paidAmount: object.amount_total,
          providerOrderID: object.id,
          providerPaymentID: object.payment_intent,
          service: "stripe-webhook",
        })
        await notify("paid")
      }
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
      const nextStatus =
        object.amount_refunded >= order.amount
          ? ("refunded" as const)
          : ("partially-refunded" as const)
      if (canTransitionPaymentStatus(order.status, nextStatus)) {
        await payload.update({
          collection: "payment-orders",
          id: order.id,
          context: { service: "stripe-webhook" },
          data: {
            status: nextStatus,
            refundedAmount: object.amount_refunded,
            refundedAt: new Date().toISOString(),
          },
          overrideAccess: true,
        })
        await notify("refunded")
      }
    } else if (
      event.type === "checkout.session.expired" &&
      canTransitionPaymentStatus(order.status, "expired")
    ) {
      await payload.update({
        collection: "payment-orders",
        id: order.id,
        data: { status: "expired" },
        overrideAccess: true,
      })
      await notify("failed")
    } else if (
      event.type === "checkout.session.async_payment_failed" &&
      canTransitionPaymentStatus(order.status, "failed")
    ) {
      await payload.update({
        collection: "payment-orders",
        id: order.id,
        data: { status: "failed", safeFailureCode: "async-payment-failed" },
        overrideAccess: true,
      })
      await notify("failed")
    }
    await payload.update({
      collection: "webhook-events",
      id: webhook.id,
      data: { paymentOrder: order.id, processingStatus: "processed" },
      overrideAccess: true,
    })
    return Response.json({ received: true })
  } catch (error) {
    await payload.update({
      collection: "webhook-events",
      id: webhook.id,
      data: {
        paymentOrder: order.id,
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
