import { buildLocalePath } from './i18n'
import { pageMedia } from './media-plan'
import type { Locale, SeoMetadata } from './types'

const SITE_URL = 'https://purity-fashion.com'

function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString()
}

function normalizeKeywords(keywords?: string[]) {
  return keywords?.length ? keywords.join(', ') : undefined
}

export function buildSeoHead({
  locale,
  pathname,
  metadata,
}: {
  locale: Locale
  pathname: string
  metadata: SeoMetadata
}) {
  const canonical = absoluteUrl(pathname)
  const keywords = normalizeKeywords(metadata.keywords)
  const imageUrl = absoluteUrl(metadata.image.src)
  const alternatePath = pathname.replace(new RegExp(`^/${locale}`), '')
  const links = [
    { rel: 'canonical', href: canonical },
    {
      rel: 'alternate',
      hrefLang: 'x-default',
      href: absoluteUrl(buildLocalePath('uk', alternatePath)),
    },
    ...(['uk', 'en', 'ru'] as const).map((alternateLocale) => ({
      rel: 'alternate',
      hrefLang: alternateLocale,
      href: absoluteUrl(buildLocalePath(alternateLocale, alternatePath)),
    })),
  ]

  return {
    meta: [
      { title: metadata.title },
      { name: 'description', content: metadata.description },
      { name: 'keywords', content: keywords },
      { property: 'og:type', content: metadata.type ?? 'website' },
      { property: 'og:locale', content: locale },
      { property: 'og:title', content: metadata.title },
      { property: 'og:description', content: metadata.description },
      { property: 'og:url', content: canonical },
      { property: 'og:image', content: imageUrl },
      { property: 'og:image:alt', content: metadata.image.alt },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: metadata.title },
      { name: 'twitter:description', content: metadata.description },
      { name: 'twitter:image', content: imageUrl },
      { name: 'twitter:image:alt', content: metadata.image.alt },
    ],
    links,
  }
}

export function buildDefaultSeoHead() {
  return {
    meta: [
      { title: 'PURITY Fashion Studio' },
      {
        name: 'description',
        content:
          'Premium multilingual fashion studio website for styling, atelier services, collections, portfolio, and transformational experiences.',
      },
      {
        name: 'keywords',
        content:
          'fashion studio, personal stylist, atelier, couture, wardrobe review, multilingual fashion website',
      },
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: 'PURITY Fashion Studio' },
      {
        property: 'og:description',
        content:
          'Premium multilingual fashion studio website for styling, atelier services, collections, portfolio, and transformational experiences.',
      },
      { property: 'og:url', content: SITE_URL },
      { property: 'og:image', content: absoluteUrl(pageMedia.home.src) },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'PURITY Fashion Studio' },
      {
        name: 'twitter:description',
        content:
          'Premium multilingual fashion studio website for styling, atelier services, collections, portfolio, and transformational experiences.',
      },
      { name: 'twitter:image', content: absoluteUrl(pageMedia.home.src) },
    ],
    links: [],
  }
}
