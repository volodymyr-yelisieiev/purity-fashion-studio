import type { Metadata } from "next"

import { env } from "@/lib/env"

import { locales, localizePath, type Locale } from "../i18n/routing"

function localizedAlternates(locale: Locale, path = "/") {
  return {
    canonical: localizePath(locale, path),
    languages: Object.fromEntries(
      locales.map((alternateLocale) => [
        alternateLocale,
        localizePath(alternateLocale, path),
      ])
    ),
  }
}

export function getLocalizedMetadata({
  locale,
  path = "/",
  title,
  description,
}: {
  locale: Locale
  path?: string
  title: string
  description: string
}): Metadata {
  return {
    metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
    title,
    description,
    alternates: localizedAlternates(locale, path),
    openGraph: {
      title,
      description,
      siteName: "PURITY Fashion Studio",
      locale,
      alternateLocale: locales.filter(
        (alternateLocale) => alternateLocale !== locale
      ),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  }
}
