import type { Payload } from "payload"

export async function createWebhookEventOnce({
  payload,
  provider,
  providerEventID,
  eventType,
  payloadHash,
  paymentOrder,
  processingStatus = "received",
}: {
  payload: Payload
  provider: "stripe" | "liqpay"
  providerEventID: string
  eventType: string
  payloadHash: string
  paymentOrder?: string
  processingStatus?: "received" | "ignored"
}) {
  try {
    return await payload.create({
      collection: "webhook-events",
      context: { service: `${provider}-webhook` },
      data: {
        provider,
        providerEventID,
        eventType,
        receivedAt: new Date().toISOString(),
        processingStatus,
        paymentOrder,
        retryCount: 0,
        payloadHash,
      },
      overrideAccess: true,
    })
  } catch (error) {
    const duplicate = await payload.find({
      collection: "webhook-events",
      depth: 0,
      limit: 1,
      overrideAccess: true,
      where: { providerEventID: { equals: providerEventID } },
    })
    if (duplicate.docs[0]) return null
    throw error
  }
}
