import { getPayload } from "payload"

import config from "@payload-config"
import { env } from "@/lib/env"

export const dynamic = "force-dynamic"

export async function GET() {
  if (env.PAYLOAD_ENABLED !== "true") {
    return Response.json(
      { status: "ok", content: "seed" },
      { headers: { "Cache-Control": "no-store" } }
    )
  }

  try {
    const payload = await getPayload({ config })
    await payload.count({ collection: "users", overrideAccess: true })
    return Response.json(
      { status: "ok", content: "payload" },
      { headers: { "Cache-Control": "no-store" } }
    )
  } catch {
    return Response.json(
      { status: "unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    )
  }
}
