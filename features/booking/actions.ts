"use server"

import { createHmac, randomUUID } from "node:crypto"
import { headers } from "next/headers"
import { after } from "next/server"
import {
  commitTransaction,
  createLocalReq,
  getPayload,
  initTransaction,
  killTransaction,
} from "payload"

import config from "@payload-config"
import { defaultLocale, hasLocale, type Locale } from "@/i18n/routing"
import { env } from "@/lib/env"
import type { PaymentOrder as StoredPaymentOrder } from "@/payload-types"

import { trackBookingEvent } from "./analytics"
import { requestReceivedEmail } from "./email-copy"
import { getPaymentAdapter } from "./payment"
import {
  bookingSchema,
  createLeadId,
  routePaymentProvider,
  type BookingFieldErrors,
  type BookingResult,
  type BookingValues,
  type PaymentCurrency,
} from "./schema"

const consentVersion = "privacy-booking-v1"

function formValue(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === "string" ? value : undefined
}

function limited(value: string | undefined, maxLength: number) {
  return value?.trim().slice(0, maxLength) || undefined
}

function attribution(formData: FormData) {
  return {
    utmSource: limited(formValue(formData, "utm_source"), 200),
    utmMedium: limited(formValue(formData, "utm_medium"), 200),
    utmCampaign: limited(formValue(formData, "utm_campaign"), 200),
    utmContent: limited(formValue(formData, "utm_content"), 200),
    utmTerm: limited(formValue(formData, "utm_term"), 200),
  }
}

function requestFormat(format: BookingValues["format"]) {
  return format === "atelier" ? "remote-atelier" : format
}

function selectedAmount(
  offer: {
    pricingMode: "fixed" | "from" | "range" | "custom"
    checkoutMode:
      "instant-payment" | "deposit" | "booking-request" | "inquiry" | "waitlist"
    prices?: Array<{
      currency: "EUR" | "UAH"
      amount?: number | null
      minAmount?: number | null
    }> | null
    deposit?: { amount?: number | null; percentage?: number | null }
  },
  currency: PaymentCurrency
) {
  const price = offer.prices?.find((item) => item.currency === currency)
  if (!price) return null

  if (offer.checkoutMode === "instant-payment") {
    return offer.pricingMode === "fixed" ? (price.amount ?? null) : null
  }
  if (offer.checkoutMode !== "deposit") return null
  if (offer.deposit?.amount != null) return offer.deposit.amount
  if (
    offer.deposit?.percentage != null &&
    offer.pricingMode === "fixed" &&
    price.amount != null
  ) {
    return Math.round((price.amount * offer.deposit.percentage) / 100)
  }
  return null
}

async function simulatedDevelopmentBooking(
  booking: BookingValues,
  locale: Locale,
  origin: string
): Promise<BookingResult> {
  const hostname = new URL(origin).hostname
  const isLocalRuntime = hostname === "localhost" || hostname === "127.0.0.1"
  if (env.NODE_ENV === "production" && !isLocalRuntime) {
    return { status: "error", message: "serviceUnavailable" }
  }

  const leadId = createLeadId()
  const provider = routePaymentProvider(booking.budgetCurrency)
  const orderUUID = randomUUID()
  const order = await getPaymentAdapter(provider).createOrder({
    amount: 100,
    booking,
    idempotencyKey: `development:${orderUUID}`,
    origin,
    locale,
    orderUUID,
    title: booking.serviceSlug,
  })
  return {
    status: "success",
    leadId,
    provider,
    currency: order.currency,
    checkoutUrl: order.checkoutUrl,
  }
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
  const rawLocale = formValue(formData, "locale")
  const locale = rawLocale && hasLocale(rawLocale) ? rawLocale : defaultLocale
  const requestHeaders = await headers()
  const host = requestHeaders.get("host") ?? "localhost:3000"
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "http"
  const origin = `${protocol}://${host}`

  if (env.PAYLOAD_ENABLED !== "true") {
    return simulatedDevelopmentBooking(booking, locale, origin)
  }

  if (formValue(formData, "website")) {
    return { status: "success", leadId: createLeadId() }
  }
  const startedAt = Number(formValue(formData, "submissionStartedAt"))
  if (!Number.isFinite(startedAt) || Date.now() - startedAt < 1200) {
    return { status: "success", leadId: createLeadId() }
  }

  const payload = await getPayload({ config })
  const sourcePage =
    limited(formValue(formData, "sourcePage"), 1000) ?? "/booking"
  const referrer = limited(formValue(formData, "referrer"), 1000)
  const touch = { landingPage: sourcePage, referrer, ...attribution(formData) }
  const idempotencyKey = limited(formValue(formData, "idempotencyKey"), 160)
  if (!idempotencyKey) {
    return { status: "error", message: "validation" }
  }

  const existingRequest = await payload.find({
    collection: "booking-requests",
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { idempotencyKey: { equals: idempotencyKey } },
  })
  if (existingRequest.docs[0]) {
    const existing = existingRequest.docs[0]
    const paymentOrderID =
      typeof existing.paymentOrder === "string"
        ? existing.paymentOrder
        : existing.paymentOrder?.id
    const paymentOrder = paymentOrderID
      ? await payload.findByID({
          collection: "payment-orders",
          id: paymentOrderID,
          depth: 0,
          overrideAccess: true,
          select: {
            checkoutURL: true,
            currency: true,
            provider: true,
            status: true,
          },
        })
      : undefined
    const checkoutAvailable =
      paymentOrder &&
      ["created", "pending", "requires-action"].includes(paymentOrder.status)
    return {
      status: "success",
      leadId:
        typeof existing.lead === "string" ? existing.lead : existing.lead.id,
      bookingRequestId: existing.id,
      checkoutUrl: checkoutAvailable
        ? (paymentOrder.checkoutURL ?? undefined)
        : undefined,
      provider:
        checkoutAvailable &&
        (paymentOrder.provider === "stripe" ||
          paymentOrder.provider === "liqpay")
          ? paymentOrder.provider
          : undefined,
      currency: checkoutAvailable ? paymentOrder.currency : undefined,
    }
  }

  const forwardedIP = requestHeaders.get("x-forwarded-for")?.split(",")[0]
  const fingerprint = createHmac("sha256", env.PAYLOAD_SECRET ?? "disabled")
    .update(
      `${forwardedIP ?? "unknown"}|${requestHeaders.get("user-agent") ?? "unknown"}`
    )
    .digest("hex")
  const recent = await payload.count({
    collection: "booking-requests",
    overrideAccess: true,
    where: {
      and: [
        { requestFingerprint: { equals: fingerprint } },
        {
          createdAt: {
            greater_than: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          },
        },
      ],
    },
  })
  if (recent.totalDocs >= 5) {
    return { status: "error", message: "rateLimit" }
  }

  const serviceResult = await payload.find({
    collection: "services",
    depth: 0,
    fallbackLocale: false,
    limit: 1,
    locale,
    overrideAccess: false,
    select: { id: true, slug: true, title: true },
    where: { slug: { equals: booking.serviceSlug } },
  })
  const service = serviceResult.docs[0]
  if (!service) {
    return {
      status: "error",
      message: "validation",
      fieldErrors: { serviceSlug: "required" },
    }
  }

  const requestedOfferID = limited(formValue(formData, "offerId"), 160)
  const offerResult = await payload.find({
    collection: "offers",
    depth: 0,
    fallbackLocale: false,
    limit: 10,
    locale,
    overrideAccess: false,
    sort: "sortOrder",
    where: requestedOfferID
      ? { id: { equals: requestedOfferID } }
      : { service: { equals: service.id } },
  })
  const offer = requestedOfferID
    ? offerResult.docs.find((item) => item.id === requestedOfferID)
    : offerResult.docs.find((item) => item.commercialStatus === "active")
  if (requestedOfferID && !offer) {
    return { status: "error", message: "validation" }
  }
  const relationshipID = (value: unknown) =>
    typeof value === "string"
      ? value
      : value && typeof value === "object" && "id" in value
        ? String(value.id)
        : undefined
  const offerServiceID = relationshipID(offer?.service)
  const offerCourseID = relationshipID(offer?.course)
  const offerCollectionID = relationshipID(offer?.fashionCollection)
  if (
    offer &&
    ((offerServiceID && offerServiceID !== service.id) ||
      (offerCourseID && service.slug !== "wardrobe-management") ||
      (offerCollectionID && service.slug !== "capsule-collection"))
  ) {
    return { status: "error", message: "validation" }
  }

  const normalizedEmail = booking.email.toLowerCase()
  const existingLead = await payload.find({
    collection: "leads",
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { email: { equals: normalizedEmail } },
  })
  const now = new Date().toISOString()
  const sourceType =
    booking.inquiryType === "corporate"
      ? "corporate"
      : offerCourseID
        ? "course"
        : offerCollectionID
          ? "collection"
          : service.slug.includes("atelier")
            ? "atelier"
            : "booking"
  const lead = existingLead.docs[0]
    ? await payload.update({
        collection: "leads",
        id: existingLead.docs[0].id,
        context: { service: "public-booking" },
        data: {
          name: booking.name,
          phone: booking.phone,
          company: booking.company,
          preferredContactMethod: booking.contactMethod,
          locale,
          sourceType,
          lastTouch: touch,
        },
        overrideAccess: true,
      })
    : await payload.create({
        collection: "leads",
        context: { service: "public-booking" },
        data: {
          name: booking.name,
          email: normalizedEmail,
          phone: booking.phone,
          company: booking.company,
          preferredContactMethod: booking.contactMethod,
          locale,
          sourceType,
          consent: { version: consentVersion, acceptedAt: now },
          firstTouch: touch,
          lastTouch: touch,
          duplicateState: "unique",
        },
        overrideAccess: true,
      })

  const preferredDate = booking.preferredAt
    ? new Date(booking.preferredAt)
    : undefined
  const paymentAmount = offer
    ? selectedAmount(offer, booking.budgetCurrency)
    : null
  const requiresPayment = Boolean(
    offer &&
    ["instant-payment", "deposit"].includes(offer.checkoutMode) &&
    paymentAmount != null
  )
  const bookingRequest = await payload.create({
    collection: "booking-requests",
    context: { service: "public-booking" },
    data: {
      idempotencyKey,
      requestFingerprint: fingerprint,
      lead: lead.id,
      service: service.id,
      offer: offer?.id,
      course: offerCourseID,
      fashionCollection: offerCollectionID,
      inquiryType: booking.inquiryType,
      requestMode: offer?.checkoutMode ?? "booking-request",
      format: requestFormat(booking.format),
      preferredDates:
        preferredDate && !Number.isNaN(preferredDate.valueOf())
          ? [{ preferredAt: preferredDate.toISOString() }]
          : [],
      message: booking.message,
      currency: booking.budgetCurrency,
      sourcePage,
      referrer,
      attribution: attribution(formData),
      status: requiresPayment ? "awaiting-payment" : "new",
      consentVersion,
      consentAcceptedAt: now,
      notificationStatus: "pending",
    },
    overrideAccess: true,
  })

  let checkout:
    | {
        url: string
        provider: "stripe" | "liqpay"
        currency: PaymentCurrency
      }
    | undefined
  if (requiresPayment && offer && paymentAmount != null) {
    const provider = routePaymentProvider(booking.budgetCurrency)
    const orderUUID = randomUUID()
    const transactionReq = await createLocalReq(
      { context: { service: "public-booking" } },
      payload
    )
    await initTransaction(transactionReq)
    let paymentOrder: StoredPaymentOrder | undefined
    try {
      paymentOrder = await payload.create({
        collection: "payment-orders",
        context: { service: "public-booking" },
        data: {
          orderUUID,
          bookingRequest: bookingRequest.id,
          commercialSnapshot: {
            offerID: offer.id,
            title: offer.title,
            sku: offer.sku,
            termsVersion: offer.termsVersion,
          },
          provider,
          amount: paymentAmount,
          currency: booking.budgetCurrency,
          mode: env.PAYMENT_MODE,
          status: "created",
          notificationStatus: "pending",
          idempotencyKey: `payment:${idempotencyKey}`,
          auditNote: "Created from verified public booking request.",
        },
        overrideAccess: true,
        req: transactionReq,
      })
      await payload.update({
        collection: "booking-requests",
        id: bookingRequest.id,
        context: { service: "public-booking" },
        data: { paymentOrder: paymentOrder.id },
        overrideAccess: true,
        req: transactionReq,
      })
      await commitTransaction(transactionReq)
    } catch {
      await killTransaction(transactionReq)
    }

    try {
      if (!paymentOrder) throw new Error("Payment order persistence failed")
      const adapterOrder = await getPaymentAdapter(provider).createOrder({
        amount: paymentAmount,
        booking,
        idempotencyKey: `payment:${idempotencyKey}`,
        origin,
        locale,
        orderUUID,
        title: offer.title,
      })
      await payload.update({
        collection: "payment-orders",
        id: paymentOrder.id,
        context: { service: "public-booking" },
        data: {
          providerOrderID: adapterOrder.id,
          checkoutURL: adapterOrder.checkoutUrl,
          checkoutExpiresAt: adapterOrder.expiresAt,
          status: "pending",
        },
        overrideAccess: true,
      })
      checkout = {
        url: adapterOrder.checkoutUrl,
        provider,
        currency: adapterOrder.currency,
      }
    } catch {
      if (paymentOrder) {
        await payload.update({
          collection: "payment-orders",
          id: paymentOrder.id,
          context: { service: "public-booking" },
          data: {
            status: "failed",
            safeFailureCode: "checkout-creation-failed",
            auditNote:
              "Provider checkout creation failed; booking request remains available for manual follow-up.",
          },
          overrideAccess: true,
        })
      }
    }
  }

  // Delivering transactional email must not hold a confirmed booking in the
  // submitting state. Vercel keeps this callback alive after the Server
  // Action response, while Payload retains the eventual delivery outcome.
  after(async () => {
    try {
      const clientEmail = requestReceivedEmail(locale, bookingRequest.id)
      await Promise.all([
        payload.sendEmail({
          to: normalizedEmail,
          ...clientEmail,
        }),
        payload.sendEmail({
          to: env.EMAIL_FROM ?? "disabled@invalid.local",
          subject: "PURITY — new booking request",
          text: `Booking request ${bookingRequest.id} for ${service.slug} requires review: ${origin}/admin/collections/booking-requests/${bookingRequest.id}`,
        }),
      ])
      await payload.update({
        collection: "booking-requests",
        id: bookingRequest.id,
        context: { service: "public-booking" },
        data: { notificationStatus: "sent" },
        overrideAccess: true,
      })
    } catch {
      await payload.update({
        collection: "booking-requests",
        id: bookingRequest.id,
        context: { service: "public-booking" },
        data: {
          notificationStatus: "failed",
          notificationError: "Transactional email delivery failed.",
        },
        overrideAccess: true,
      })
    }
  })

  trackBookingEvent({
    event: "booking_submit",
    serviceSlug: service.slug,
    provider: checkout?.provider,
    currency: booking.budgetCurrency,
  })
  if (checkout) {
    trackBookingEvent({
      event: "checkout_start",
      serviceSlug: service.slug,
      provider: checkout.provider,
      currency: checkout.currency,
    })
  }

  return {
    status: "success",
    leadId: lead.id,
    bookingRequestId: bookingRequest.id,
    checkoutUrl: checkout?.url,
    provider: checkout?.provider,
    currency: checkout?.currency,
  }
}
