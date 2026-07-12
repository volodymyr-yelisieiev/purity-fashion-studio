import type { MetadataRoute } from "next"

import { getContentRoutes } from "@/content/routes"
import { defaultLocale, locales, localizePath } from "@/i18n/routing"
import { env } from "@/lib/env"

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = new Set<string>()

  for (const locale of locales) {
    paths.add(localizePath(locale))

    for (const route of getContentRoutes(locale)) {
      paths.add(route.href)
    }
  }

  return [...paths].sort().map((path) => ({
    url: `${env.NEXT_PUBLIC_SITE_URL}${path}`,
    lastModified: new Date("2026-07-08"),
    alternates: {
      languages: Object.fromEntries(
        locales.map((locale) => [
          locale,
          `${env.NEXT_PUBLIC_SITE_URL}${localizePath(locale, path)}`,
        ])
      ),
    },
    changeFrequency:
      path === localizePath(defaultLocale) ? "weekly" : "monthly",
    priority: path === localizePath(defaultLocale) ? 1 : 0.7,
  }))
}
