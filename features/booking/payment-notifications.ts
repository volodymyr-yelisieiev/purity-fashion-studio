import type { Payload } from "payload"

import { env } from "@/lib/env"
import { hasLocale } from "@/i18n/routing"

import { paymentStatusEmail } from "./email-copy"

export async function sendPaymentStatusNotification({
  payload,
  bookingRequestID,
  orderUUID,
  status,
}: {
  payload: Payload
  bookingRequestID: string
  orderUUID: string
  status: "paid" | "failed" | "refunded"
}) {
  try {
    const booking = await payload.findByID({
      collection: "booking-requests",
      id: bookingRequestID,
      depth: 1,
      overrideAccess: true,
      select: { lead: true },
    })
    const lead =
      typeof booking.lead === "string"
        ? await payload.findByID({
            collection: "leads",
            id: booking.lead,
            depth: 0,
            overrideAccess: true,
            select: { email: true, locale: true },
          })
        : booking.lead
    if (!lead.email || !hasLocale(lead.locale)) {
      return { sent: false, error: "Lead email or locale is unavailable." }
    }
    const copy = paymentStatusEmail(lead.locale, status, orderUUID)
    await Promise.all([
      payload.sendEmail({ to: lead.email, ...copy }),
      payload.sendEmail({
        to: env.EMAIL_FROM ?? "disabled@invalid.local",
        subject: `PURITY — payment ${status}`,
        text: `Order ${orderUUID} is ${status}. Review the verified record in Payload Admin.`,
      }),
    ])
    return { sent: true as const }
  } catch {
    return {
      sent: false as const,
      error: "Payment notification delivery failed.",
    }
  }
}
