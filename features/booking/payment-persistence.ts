import {
  commitTransaction,
  createLocalReq,
  initTransaction,
  killTransaction,
  type Payload,
} from "payload"

import type { PaymentOrder } from "@/payload-types"

export async function markPaymentPaid({
  payload,
  order,
  paidAmount,
  providerOrderID,
  providerPaymentID,
  service,
}: {
  payload: Payload
  order: PaymentOrder
  paidAmount: number
  providerOrderID?: string | null
  providerPaymentID?: string | null
  service: "stripe-webhook" | "liqpay-webhook"
}) {
  const req = await createLocalReq({ context: { service } }, payload)
  await initTransaction(req)
  const bookingRequestID =
    typeof order.bookingRequest === "string"
      ? order.bookingRequest
      : order.bookingRequest.id
  try {
    await payload.update({
      collection: "payment-orders",
      id: order.id,
      context: { service },
      data: {
        status: "paid",
        paidAmount,
        paidAt: new Date().toISOString(),
        providerOrderID,
        providerPaymentID,
      },
      overrideAccess: true,
      req,
    })
    await payload.update({
      collection: "booking-requests",
      id: bookingRequestID,
      context: { service },
      data: { status: "confirmed" },
      overrideAccess: true,
      req,
    })
    await commitTransaction(req)
  } catch (error) {
    await killTransaction(req)
    throw error
  }
}
