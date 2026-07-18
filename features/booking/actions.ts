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
  type Payload,
  type PayloadRequest,
} from "payload"

import config from "@payload-config"
import { defaultLocale, hasLocale, type Locale } from "@/i18n/routing"
import { env } from "@/lib/env"
import type {
  BookingRequest as StoredBookingRequest,
  PaymentOrder as StoredPaymentOrder,
} from "@/payload-types"

import { acquireAdvisoryLock, withAdvisoryLock } from "./advisory-lock"
import { trackBookingEvent } from "./analytics"
import { requestReceivedEmail } from "./email-copy"
import {
  deliverNotificationBatch,
  enqueueNotifications,
} from "./notification-outbox"
import { logOperationError } from "./operation-log"
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

async function ensureBookingNotifications({
  payload,
  bookingRequestID,
  email,
  locale,
  origin,
  req,
  serviceSlug,
}: {
  payload: Payload
  bookingRequestID: string
  email: string
  locale: Locale
  origin: string
  req?: PayloadRequest
  serviceSlug: string
}) {
  const clientEmail = requestReceivedEmail(locale, bookingRequestID)
  await enqueueNotifications({
    payload,
    req,
    messages: [
      {
        bookingRequest: bookingRequestID,
        deduplicationKey: `booking:${bookingRequestID}:received:client`,
        recipient: email,
        recipientType: "client",
        ...clientEmail,
      },
      {
        bookingRequest: bookingRequestID,
        deduplicationKey: `booking:${bookingRequestID}:received:internal`,
        recipient: env.EMAIL_FROM ?? "disabled@invalid.local",
        recipientType: "internal",
        subject: "PURITY — new booking request",
        text: `Booking request ${bookingRequestID} for ${serviceSlug} requires review: ${origin}/admin/collections/booking-requests/${bookingRequestID}`,
      },
    ],
  })
}

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

  const releaseBookingLock = await acquireAdvisoryLock(
    payload,
    "booking",
    idempotencyKey
  )
  if (!releaseBookingLock) {
    return { status: "error", message: "serviceUnavailable" }
  }

  try {
    const existingRequest = await payload.find({
      collection: "booking-requests",
      depth: 0,
      limit: 1,
      overrideAccess: true,
      where: { idempotencyKey: { equals: idempotencyKey } },
    })
    if (existingRequest.docs[0]) {
      const existing = existingRequest.docs[0]
      await ensureBookingNotifications({
        payload,
        bookingRequestID: existing.id,
        email: booking.email.toLowerCase(),
        locale,
        origin,
        serviceSlug: booking.serviceSlug,
      })
      after(() => deliverNotificationBatch(payload, 10))
      const paymentOrderID =
        typeof existing.paymentOrder === "string"
          ? existing.paymentOrder
          : existing.paymentOrder?.id
      let paymentOrder = paymentOrderID
        ? await payload.findByID({
            collection: "payment-orders",
            id: paymentOrderID,
            depth: 0,
            overrideAccess: true,
          })
        : undefined
      if (
        paymentOrder &&
        !paymentOrder.checkoutURL &&
        (paymentOrder.status === "created" ||
          (paymentOrder.status === "failed" &&
            paymentOrder.safeFailureCode === "checkout-creation-failed")) &&
        (paymentOrder.provider === "stripe" ||
          paymentOrder.provider === "liqpay")
      ) {
        try {
          const adapterOrder = await getPaymentAdapter(
            paymentOrder.provider
          ).createOrder({
            amount: paymentOrder.amount,
            booking,
            idempotencyKey: paymentOrder.idempotencyKey,
            origin,
            locale,
            orderUUID: paymentOrder.orderUUID,
            title: paymentOrder.commercialSnapshot.title,
          })
          paymentOrder = await payload.update({
            collection: "payment-orders",
            id: paymentOrder.id,
            context: { service: "public-booking" },
            data: {
              checkoutURL: adapterOrder.checkoutUrl,
              checkoutExpiresAt: adapterOrder.expiresAt,
              nextReconcileAt: new Date().toISOString(),
              providerOrderID: adapterOrder.id,
              safeFailureCode: null,
              status: "pending",
            },
            overrideAccess: true,
          })
        } catch {
          await payload.update({
            collection: "payment-orders",
            id: paymentOrder.id,
            context: { service: "public-booking" },
            data: {
              safeFailureCode: "checkout-creation-failed",
              status: "failed",
            },
            overrideAccess: true,
          })
        }
      }
      const checkoutOrder =
        paymentOrder &&
        ["created", "pending", "requires-action"].includes(paymentOrder.status)
          ? paymentOrder
          : undefined
      return {
        status: "success",
        leadId:
          typeof existing.lead === "string" ? existing.lead : existing.lead.id,
        bookingRequestId: existing.id,
        checkoutUrl: checkoutOrder?.checkoutURL ?? undefined,
        provider:
          checkoutOrder &&
          (checkoutOrder.provider === "stripe" ||
            checkoutOrder.provider === "liqpay")
            ? checkoutOrder.provider
            : undefined,
        currency: checkoutOrder?.currency,
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

    const normalizedEmail = booking.email.trim().toLowerCase()
    const identityKey = `email:${normalizedEmail}`
    const phoneDigits = booking.phone?.replace(/\D/g, "")
    const normalizedPhone = phoneDigits
      ? `${booking.phone?.trim().startsWith("+") ? "+" : ""}${phoneDigits}`
      : undefined
    const phoneIdentityKey = normalizedPhone
      ? `phone:${normalizedPhone}`
      : undefined
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
    const resolveLead = async () => {
      const existingLead = await payload.find({
        collection: "leads",
        depth: 0,
        limit: 2,
        overrideAccess: true,
        where: {
          or: [
            { identityKey: { equals: identityKey } },
            { email: { equals: normalizedEmail } },
            ...(phoneIdentityKey
              ? [
                  { phoneIdentityKey: { equals: phoneIdentityKey } },
                  { phone: { equals: normalizedPhone } },
                ]
              : []),
          ],
        },
      })
      if (existingLead.docs.length > 1) {
        throw new Error("Conflicting lead identities require manual review")
      }
      return existingLead.docs[0]
        ? payload.update({
            collection: "leads",
            id: existingLead.docs[0].id,
            context: { service: "public-booking" },
            data: {
              identityKey,
              phoneIdentityKey,
              name: booking.name,
              phone: normalizedPhone,
              company: booking.company,
              preferredContactMethod: booking.contactMethod,
              locale,
              sourceType,
              lastTouch: touch,
            },
            overrideAccess: true,
          })
        : payload.create({
            collection: "leads",
            context: { service: "public-booking" },
            data: {
              identityKey,
              phoneIdentityKey,
              name: booking.name,
              email: normalizedEmail,
              phone: normalizedPhone,
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
    }
    const lead = phoneIdentityKey
      ? await withAdvisoryLock(payload, "lead-identity", phoneIdentityKey, () =>
          withAdvisoryLock(payload, "lead-identity", identityKey, resolveLead)
        )
      : await withAdvisoryLock(
          payload,
          "lead-identity",
          identityKey,
          resolveLead
        )

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
    const transactionReq = await createLocalReq(
      { context: { service: "public-booking" } },
      payload
    )
    await initTransaction(transactionReq)
    let bookingRequest: StoredBookingRequest
    let paymentOrder: StoredPaymentOrder | undefined
    const provider = requiresPayment
      ? routePaymentProvider(booking.budgetCurrency)
      : undefined
    const orderUUID = requiresPayment ? randomUUID() : undefined
    try {
      bookingRequest = await payload.create({
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
        req: transactionReq,
      })

      if (
        requiresPayment &&
        offer &&
        paymentAmount != null &&
        provider &&
        orderUUID
      ) {
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
            nextReconcileAt: new Date().toISOString(),
            reconciliationAttempts: 0,
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
      }

      await ensureBookingNotifications({
        payload,
        bookingRequestID: bookingRequest.id,
        email: normalizedEmail,
        locale,
        origin,
        req: transactionReq,
        serviceSlug: service.slug,
      })
      await commitTransaction(transactionReq)
    } catch (error) {
      await killTransaction(transactionReq)
      logOperationError({
        payload,
        correlationID: idempotencyKey,
        operation: "public-booking",
        code: "booking-persistence-failed",
        error,
      })
      return { status: "error", message: "serviceUnavailable" }
    }

    let checkout:
      | {
          url: string
          provider: "stripe" | "liqpay"
          currency: PaymentCurrency
        }
      | undefined
    if (
      paymentOrder &&
      provider &&
      orderUUID &&
      offer &&
      paymentAmount != null
    ) {
      let providerCheckoutCreated = false
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
        providerCheckoutCreated = true
        await payload.update({
          collection: "payment-orders",
          id: paymentOrder.id,
          context: { service: "public-booking" },
          data: {
            providerOrderID: adapterOrder.id,
            checkoutURL: adapterOrder.checkoutUrl,
            checkoutExpiresAt: adapterOrder.expiresAt,
            nextReconcileAt: new Date().toISOString(),
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
        if (paymentOrder && !providerCheckoutCreated) {
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

    after(() => deliverNotificationBatch(payload, 10))

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
  } finally {
    await releaseBookingLock()
  }
}
