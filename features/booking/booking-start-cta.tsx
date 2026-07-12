"use client"

import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { trackBookingEvent } from "@/features/booking/analytics"

type BookingStartCtaProps = {
  href: string
  label: string
  serviceSlug: string
}

function BookingStartCta({ href, label, serviceSlug }: BookingStartCtaProps) {
  return (
    <Link
      href={href}
      className={cn(buttonVariants({ variant: "default", size: "lg" }))}
      onClick={() => {
        trackBookingEvent({ event: "cta_click", serviceSlug })
        trackBookingEvent({ event: "booking_start", serviceSlug })
      }}
    >
      {label}
    </Link>
  )
}

export { BookingStartCta }
