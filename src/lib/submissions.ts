import { createServerFn } from '@tanstack/react-start'
import { bookingSubmissionAdapter, inquirySubmissionAdapter } from './adapters'
import { parseServerEnv } from './env'
import { buildSubmissionSignature } from './mock-submission'
import type { BookingRequest, ContactInquiry, LeadSubmission, SubmissionResult } from './types'

const leadDeduplicationWindowMs = 10 * 60 * 1000
const webhookTimeoutMs = 10_000
const locales = ['uk', 'en', 'ru'] as const
const bookingKinds = ['service', 'course', 'collection', 'portfolio', 'transformation'] as const

type LeadCacheEntry = {
  expiresAt: number
  promise?: Promise<SubmissionResult>
  result?: SubmissionResult
}

const leadCache = new Map<string, LeadCacheEntry>()

function nowReference(prefix: string) {
  return `${prefix}-${Date.now()}`
}

function pruneLeadCache(now: number) {
  for (const [key, entry] of leadCache) {
    if (entry.expiresAt <= now) {
      leadCache.delete(key)
    }
  }
}

function leadSignature(submission: LeadSubmission) {
  const payload = submission.payload as unknown as Record<string, string | null | undefined>
  return buildSubmissionSignature({
    channel: submission.channel,
    locale: submission.locale,
    ...payload,
  })
}

async function deliverLead(submission: LeadSubmission, reference: string): Promise<SubmissionResult> {
  const env = parseServerEnv(process.env)

  if (!env.contactWebhookUrl) {
    if (env.appEnv === 'production') {
      return {
        status: 'failure',
        reference,
        message: 'missing-contact-webhook',
        source: 'webhook',
      }
    }

    return submission.channel === 'booking'
      ? bookingSubmissionAdapter.submitBookingRequest(submission.payload as BookingRequest)
      : inquirySubmissionAdapter.submitInquiry(submission.payload as ContactInquiry)
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), webhookTimeoutMs)

  try {
    const response = await fetch(env.contactWebhookUrl, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        ...submission,
        reference,
      }),
    })

    if (!response.ok) {
      return {
        status: 'failure',
        reference,
        message: `webhook-${response.status}`,
        source: 'webhook',
      }
    }

    return {
      status: 'success',
      reference,
      source: 'webhook',
    }
  } catch (error) {
    return {
      status: 'failure',
      reference,
      message: error instanceof Error ? error.message : 'webhook-error',
      source: 'webhook',
    }
  } finally {
    clearTimeout(timeout)
  }
}

async function postLeadToWebhook(submission: LeadSubmission): Promise<SubmissionResult> {
  const reference = nowReference(`${submission.locale.toUpperCase()}-${submission.channel.toUpperCase()}`)
  const signature = leadSignature(submission)
  const now = Date.now()
  pruneLeadCache(now)

  const cached = leadCache.get(signature)
  if (cached && cached.expiresAt > now) {
    if (cached.result) {
      return cached.result
    }

    if (cached.promise) {
      return cached.promise
    }
  }

  const promise = deliverLead(submission, reference)
    .then((result) => {
      leadCache.set(signature, {
        expiresAt: Date.now() + leadDeduplicationWindowMs,
        result,
      })
      return result
    })
    .catch((error) => {
      leadCache.delete(signature)
      throw error
    })

  leadCache.set(signature, {
    expiresAt: now + leadDeduplicationWindowMs,
    promise,
  })

  return promise
}

function requireText(value: unknown, field: string, maxLength = 180) {
  const normalized = typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : ''

  if (!normalized) {
    throw new Error(`missing-${field}`)
  }

  if (normalized.length > maxLength) {
    throw new Error(`invalid-${field}`)
  }

  return normalized
}

function optionalText(value: unknown, maxLength = 600) {
  const normalized = typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : ''

  if (!normalized) {
    return undefined
  }

  if (normalized.length > maxLength) {
    throw new Error('invalid-text')
  }

  return normalized
}

function requireEnum<T extends readonly string[]>(value: unknown, allowed: T, field: string): T[number] {
  if (typeof value === 'string' && allowed.includes(value)) {
    return value
  }

  throw new Error(`invalid-${field}`)
}

function requireEmail(value: unknown) {
  const email = requireText(value, 'email', 180).toLowerCase()

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('invalid-email')
  }

  return email
}

function requirePhone(value: unknown) {
  const phone = requireText(value, 'phone', 60)
  const digits = phone.replace(/\D/g, '')

  if (digits.length < 7 || digits.length > 16) {
    throw new Error('invalid-phone')
  }

  return phone
}

function requireDate(value: unknown) {
  const date = requireText(value, 'date', 10)

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error('invalid-date')
  }

  const today = new Date().toISOString().slice(0, 10)
  if (date < today) {
    throw new Error('past-date')
  }

  return date
}

export function validateContactInquiry(data: ContactInquiry): ContactInquiry {
  return {
    locale: requireEnum(data.locale, locales, 'locale'),
    name: requireText(data.name, 'name', 120),
    email: requireEmail(data.email),
    phone: requirePhone(data.phone),
    interest: optionalText(data.interest, 160),
    message: requireText(data.message, 'message', 1_200),
  }
}

export function validateBookingRequest(data: BookingRequest): BookingRequest {
  return {
    kind: requireEnum(data.kind, bookingKinds, 'kind'),
    slug: requireText(data.slug, 'slug', 120),
    locale: requireEnum(data.locale, locales, 'locale'),
    format: optionalText(data.format, 160),
    preferredDate: requireDate(data.preferredDate),
    name: requireText(data.name, 'name', 120),
    email: requireEmail(data.email),
    phone: requirePhone(data.phone),
    notes: optionalText(data.notes, 1_200),
  }
}

export const submitContactLead = createServerFn({ method: 'POST' })
  .inputValidator(validateContactInquiry)
  .handler(async ({ data }) =>
    postLeadToWebhook({
      channel: 'contact',
      locale: data.locale,
      payload: data,
      submittedAt: new Date().toISOString(),
    }),
  )

export const submitBookingLead = createServerFn({ method: 'POST' })
  .inputValidator(validateBookingRequest)
  .handler(async ({ data }) =>
    postLeadToWebhook({
      channel: 'booking',
      locale: data.locale,
      payload: data,
      submittedAt: new Date().toISOString(),
    }),
  )
