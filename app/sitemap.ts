import type { MetadataRoute } from "next"

import {
  getPublishedCourseSlugs,
  getPublishedDirectionSlugs,
  getPublishedFashionCollectionSlugs,
  getPublishedPageSlugs,
  getPublishedPortfolioCaseSlugs,
  getPublishedServiceSlugs,
} from "@/content/public-api"
import { defaultLocale, locales, localizePath } from "@/i18n/routing"
import { env } from "@/lib/env"

export const dynamic = "force-dynamic"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const paths = new Set<string>()
  const [directions, pages, services, courses, collections, portfolioCases] =
    await Promise.all([
      getPublishedDirectionSlugs(),
      getPublishedPageSlugs(),
      getPublishedServiceSlugs(),
      getPublishedCourseSlugs(),
      getPublishedFashionCollectionSlugs(),
      getPublishedPortfolioCaseSlugs(),
    ])

  for (const locale of locales) {
    paths.add(localizePath(locale))
    paths.add(localizePath(locale, "/atelier"))
    directions.forEach((slug) => paths.add(localizePath(locale, `/${slug}`)))
    pages.forEach((slug) => paths.add(localizePath(locale, `/${slug}`)))
    services.forEach((slug) =>
      paths.add(localizePath(locale, `/services/${slug}`))
    )
    courses.forEach((slug) =>
      paths.add(localizePath(locale, `/courses/${slug}`))
    )
    collections.forEach((slug) =>
      paths.add(localizePath(locale, `/collections/${slug}`))
    )
    paths.add(localizePath(locale, "/portfolio"))
    portfolioCases.forEach((slug) =>
      paths.add(localizePath(locale, `/portfolio/${slug}`))
    )
  }

  return [...paths].sort().map((path) => ({
    url: `${env.NEXT_PUBLIC_SITE_URL}${path}`,
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
