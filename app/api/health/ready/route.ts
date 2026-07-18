import { checkReadiness } from "@/lib/readiness"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    await checkReadiness()
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
