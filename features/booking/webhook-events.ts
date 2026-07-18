import type { Payload } from "payload"

import { withAdvisoryLock } from "./advisory-lock"

type WebhookProvider = "stripe" | "liqpay"
type WebhookOutcome = {
  paymentOrder?: string
  status: "processed" | "ignored"
}

function retryAt(attempts: number) {
  const delay = Math.min(60 * 60_000, 5_000 * 2 ** Math.max(0, attempts - 1))
  return new Date(Date.now() + delay).toISOString()
}

export async function processWebhookEvent({
  payload,
  provider,
  providerEventID,
  eventType,
  payloadHash,
  normalizedPayload,
  process,
}: {
  payload: Payload
  provider: WebhookProvider
  providerEventID: string
  eventType: string
  payloadHash: string
  normalizedPayload: Record<string, boolean | number | string | null>
  process: () => Promise<WebhookOutcome>
}) {
  const deduplicationKey = `${provider}:${providerEventID}`
  return withAdvisoryLock(payload, "webhook", deduplicationKey, async () => {
    const found = await payload.find({
      collection: "webhook-events",
      depth: 0,
      limit: 1,
      overrideAccess: true,
      where: { deduplicationKey: { equals: deduplicationKey } },
    })
    const existing = found.docs[0]
    if (
      existing?.processingStatus === "processed" ||
      existing?.processingStatus === "ignored"
    ) {
      return { duplicate: true as const, status: existing.processingStatus }
    }

    const attempts = (existing?.attempts ?? 0) + 1
    const webhook = existing
      ? await payload.update({
          collection: "webhook-events",
          id: existing.id,
          context: { service: `${provider}-webhook` },
          data: {
            attempts,
            eventType,
            lockedAt: new Date().toISOString(),
            nextRetryAt: null,
            normalizedPayload,
            payloadHash,
            processingStatus: "received",
            receivedAt: new Date().toISOString(),
            sanitizedError: null,
          },
          overrideAccess: true,
        })
      : await payload.create({
          collection: "webhook-events",
          context: { service: `${provider}-webhook` },
          data: {
            attempts,
            deduplicationKey,
            eventType,
            lockedAt: new Date().toISOString(),
            normalizedPayload,
            payloadHash,
            processingStatus: "received",
            provider,
            providerEventID,
            receivedAt: new Date().toISOString(),
          },
          overrideAccess: true,
        })

    try {
      const outcome = await process()
      await payload.update({
        collection: "webhook-events",
        id: webhook.id,
        context: { service: `${provider}-webhook` },
        data: {
          lockedAt: null,
          paymentOrder: outcome.paymentOrder,
          processingStatus: outcome.status,
        },
        overrideAccess: true,
      })
      return { duplicate: false as const, status: outcome.status }
    } catch (error) {
      await payload.update({
        collection: "webhook-events",
        id: webhook.id,
        context: { service: `${provider}-webhook` },
        data: {
          lockedAt: null,
          nextRetryAt: retryAt(attempts),
          processingStatus: "failed",
          sanitizedError:
            error instanceof Error
              ? error.message.slice(0, 500)
              : "Processing failed",
        },
        overrideAccess: true,
      })
      throw error
    }
  })
}
