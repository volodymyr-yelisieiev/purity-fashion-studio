import type { Metadata } from "next"

import { env } from "@/lib/env"

import { mediaAssets, siteSettings } from "./source"
import type { Localized, SeoContent } from "./model"
import { locales, localizePath, type Locale } from "../i18n/routing"

type MetadataSource = {
  title: Localized<string>
  summary: Localized<string>
  seo?: Localized<SeoContent>
}

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
  const image = mediaAssets.find(
    (asset) => asset.id === siteSettings.defaultOgImageId
  )
  const socialImage = image?.src
    ? new URL(image.src, env.NEXT_PUBLIC_SITE_URL).toString()
    : undefined

  return {
    metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
    title,
    description,
    alternates: localizedAlternates(locale, path),
    openGraph: {
      title,
      description,
      siteName: siteSettings.brandName,
      locale,
      alternateLocale: locales.filter(
        (alternateLocale) => alternateLocale !== locale
      ),
      images: socialImage ? [socialImage] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: socialImage ? [socialImage] : undefined,
    },
  }
}

export function getSiteMetadata(locale: Locale) {
  const seo = siteSettings.seo[locale]

  return getLocalizedMetadata({
    locale,
    title: seo.title,
    description: seo.description,
  })
}

export function getEntryMetadata(
  entry: MetadataSource,
  locale: Locale,
  path = "/"
) {
  const seo = entry.seo?.[locale] ?? {
    title: `${entry.title[locale]} | ${siteSettings.brandName}`,
    description: entry.summary[locale],
  }

  return getLocalizedMetadata({
    locale,
    path,
    title: seo.title,
    description: seo.description,
  })
}
