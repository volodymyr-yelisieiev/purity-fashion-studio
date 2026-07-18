import { getPayload } from "payload"

import config from "@payload-config"
import { isAuthorizedCron } from "@/features/booking/cron-auth"
import { deliverNotificationBatch } from "@/features/booking/notification-outbox"
import { env } from "@/lib/env"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  if (!isAuthorizedCron(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }
  if (env.PAYLOAD_ENABLED !== "true") {
    return Response.json({ error: "CMS unavailable" }, { status: 503 })
  }

  const payload = await getPayload({ config })
  const counts = await deliverNotificationBatch(payload)
  return Response.json(counts, { headers: { "Cache-Control": "no-store" } })
}

export const GET = POST
