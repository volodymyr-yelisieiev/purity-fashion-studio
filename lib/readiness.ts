import { getPayload } from "payload"

import config from "@payload-config"
import { env } from "@/lib/env"
import { migrationHead } from "@/payload/migration-head"

export async function checkReadiness() {
  if (env.PAYLOAD_ENABLED !== "true") {
    throw new Error("Payload is disabled")
  }

  const payload = await getPayload({ config })
  const [migration, home, settings, pages, media] = await Promise.all([
    payload.count({
      collection: "payload-migrations",
      overrideAccess: true,
      where: { name: { equals: migrationHead } },
    }),
    payload.findGlobal({
      slug: "home",
      draft: false,
      fallbackLocale: false,
      locale: "uk",
      overrideAccess: false,
    }),
    payload.findGlobal({
      slug: "site-settings",
      fallbackLocale: false,
      locale: "uk",
      overrideAccess: false,
    }),
    payload.count({ collection: "pages", overrideAccess: false }),
    payload.find({
      collection: "media",
      depth: 0,
      limit: 1,
      overrideAccess: false,
      pagination: false,
      select: { url: true },
    }),
  ])

  const mediaURL = media.docs[0]?.url
  if (
    migration.totalDocs !== 1 ||
    !home.heroTitle ||
    !settings.brandName ||
    pages.totalDocs === 0 ||
    !mediaURL
  ) {
    throw new Error("Required Payload content is unavailable")
  }

  const response = await fetch(new URL(mediaURL, env.NEXT_PUBLIC_SITE_URL), {
    headers: { Range: "bytes=0-0" },
    signal: AbortSignal.timeout(3000),
  })
  await response.body?.cancel()
  if (!response.ok) throw new Error("Published media is unavailable")
}
