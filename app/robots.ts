import type { MetadataRoute } from "next"

import { env } from "@/lib/env"

export default function robots(): MetadataRoute.Robots {
  if (env.NEXT_PUBLIC_INDEXING_ENABLED !== "true") {
    return { rules: { userAgent: "*", disallow: "/" } }
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api", "/*/styleguide", "/*/payment"],
    },
    sitemap: `${env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
  }
}
