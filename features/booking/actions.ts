"use server"

import { headers } from "next/headers"

import { defaultLocale, hasLocale } from "@/i18n/routing"

import { trackBookingEvent } from "./analytics"
import { getPaymentAdapter } from "./payment"
import {
  bookingSchema,
  createLeadId,
  routePaymentProvider,
  type BookingResult,
  type BookingFieldErrors,
} from "./schema"

function formValue(formData: FormData, key: string) {
  const value = formData.get(key)

  return typeof value === "string" ? value : undefined
}

export async function submitBooking(
  _previousState: BookingResult,
  formData: FormData
): Promise<BookingResult> {
  const parsed = bookingSchema.safeParse({
    inquiryType: formValue(formData, "inquiryType"),
    serviceSlug: formValue(formData, "serviceSlug"),
    name: formValue(formData, "name"),
    email: formValue(formData, "email"),
    phone: formValue(formData, "phone"),
    company: formValue(formData, "company"),
    format: formValue(formData, "format"),
    contactMethod: formValue(formData, "contactMethod"),
    budgetCurrency: formValue(formData, "budgetCurrency"),
    preferredAt: formValue(formData, "preferredAt"),
    message: formValue(formData, "message"),
    consent: formData.get("consent") === "on",
  })

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors

    return {
      status: "error",
      message: "validation",
      fieldErrors: Object.fromEntries(
        Object.entries(errors).map(([key, messages]) => [key, messages?.[0]])
      ) as BookingFieldErrors,
    }
  }

  const booking = parsed.data
  const leadId = createLeadId()
  const provider = routePaymentProvider(booking.budgetCurrency)
  const adapter = getPaymentAdapter(provider)
  const rawLocale = formValue(formData, "locale")
  const locale = rawLocale && hasLocale(rawLocale) ? rawLocale : defaultLocale
  const requestHeaders = await headers()
  const host = requestHeaders.get("host") ?? "localhost:3000"
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "http"
  const origin = `${protocol}://${host}`
  const order = await adapter.createOrder({
    leadId,
    booking,
    origin,
    locale,
  })

  trackBookingEvent({
    event: "booking_submit",
    serviceSlug: booking.serviceSlug,
    provider,
    currency: booking.budgetCurrency,
  })

  trackBookingEvent({
    event: "checkout_start",
    serviceSlug: booking.serviceSlug,
    provider,
    currency: booking.budgetCurrency,
  })

  return {
    status: "success",
    leadId,
    provider,
    currency: order.currency,
    checkoutUrl: order.checkoutUrl,
  }
}
