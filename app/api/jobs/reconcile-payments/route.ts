import { timingSafeEqual } from "node:crypto"
import { getPayload } from "payload"

import config from "@payload-config"
import { env } from "@/lib/env"
import { getPaymentAdapter } from "@/features/booking/payment"
import { canTransitionPaymentStatus } from "@/features/booking/payment-transitions"
import { markPaymentPaid } from "@/features/booking/payment-persistence"
import { sendPaymentStatusNotification } from "@/features/booking/payment-notifications"

export const dynamic = "force-dynamic"

function authorized(request: Request) {
  const supplied = request.headers.get("authorization")?.replace(/^Bearer /, "")
  if (!env.CRON_SECRET || !supplied) return false
  const expectedBuffer = Buffer.from(env.CRON_SECRET)
  const suppliedBuffer = Buffer.from(supplied)
  return (
    expectedBuffer.length === suppliedBuffer.length &&
    timingSafeEqual(expectedBuffer, suppliedBuffer)
  )
}

export async function POST(request: Request) {
  if (!authorized(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }
  if (env.PAYLOAD_ENABLED !== "true") {
    return Response.json({ error: "CMS unavailable" }, { status: 503 })
  }

  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: "payment-orders",
    depth: 0,
    limit: 100,
    overrideAccess: true,
    pagination: false,
    sort: "createdAt",
    where: { status: { in: ["created", "pending", "requires-action"] } },
  })
  const counts = { checked: 0, paid: 0, failed: 0, pending: 0, errors: 0 }

  for (const order of result.docs) {
    if (order.provider !== "stripe" && order.provider !== "liqpay") continue
    counts.checked += 1
    try {
      const providerStatus = await getPaymentAdapter(
        order.provider
      ).getPaymentStatus({
        amount: order.amount,
        currency: order.currency,
        mode: order.mode,
        orderUUID: order.orderUUID,
        providerOrderID: order.providerOrderID ?? undefined,
      })
      const bookingRequestID =
        typeof order.bookingRequest === "string"
          ? order.bookingRequest
          : order.bookingRequest.id
      if (
        providerStatus.status === "paid" &&
        providerStatus.paidAmount != null &&
        canTransitionPaymentStatus(order.status, "paid")
      ) {
        await markPaymentPaid({
          payload,
          order,
          paidAmount: providerStatus.paidAmount,
          providerOrderID: order.providerOrderID,
          providerPaymentID: order.providerPaymentID,
          service:
            order.provider === "stripe" ? "stripe-webhook" : "liqpay-webhook",
        })
        const delivery = await sendPaymentStatusNotification({
          payload,
          bookingRequestID,
          orderUUID: order.orderUUID,
          status: "paid",
        })
        await payload.update({
          collection: "payment-orders",
          id: order.id,
          context: { service: "payment-reconciliation" },
          data: {
            notificationStatus: delivery.sent ? "sent" : "failed",
            notificationError: delivery.sent ? null : delivery.error,
            auditNote: "Paid status confirmed by reconciliation.",
          },
          overrideAccess: true,
        })
        counts.paid += 1
      } else if (
        (providerStatus.status === "failed" ||
          providerStatus.status === "expired") &&
        canTransitionPaymentStatus(order.status, providerStatus.status)
      ) {
        await payload.update({
          collection: "payment-orders",
          id: order.id,
          context: { service: "payment-reconciliation" },
          data: {
            status: providerStatus.status,
            safeFailureCode: `reconciled-${providerStatus.status}`,
            auditNote: "Provider status confirmed by reconciliation.",
          },
          overrideAccess: true,
        })
        counts.failed += 1
      } else {
        counts.pending += 1
      }
    } catch {
      counts.errors += 1
    }
  }

  return Response.json(counts, { headers: { "Cache-Control": "no-store" } })
}
