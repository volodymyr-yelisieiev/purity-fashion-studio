export type BookingEvent =
  "cta_click" | "booking_start" | "booking_submit" | "checkout_start"

export type BookingEventPayload = {
  event: BookingEvent
  serviceSlug?: string
  provider?: string
  currency?: string
}

export function trackBookingEvent(payload: BookingEventPayload) {
  if (process.env.NODE_ENV !== "production") {
    console.info("[purity analytics]", payload)
  }
}
