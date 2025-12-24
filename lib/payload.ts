import { getPayload as getPayloadInstance } from 'payload'
import configPromise from '@payload-config'
import type { Where, Payload } from 'payload'

export type Locale = 'uk' | 'ru' | 'en'

type LocalizedCollection = 'services' | 'portfolio' | 'lookbooks' | 'courses'

const supportedLocales: Locale[] = ['en', 'uk', 'ru']

export async function getPayload(): Promise<Payload> {
  return getPayloadInstance({ config: configPromise })
}

export async function getServices(locale: Locale = 'uk', category?: string) {
  const payload = await getPayload()

  const where: Where | undefined = category
    ? { category: { equals: category } }
    : undefined

  return payload.find({
    collection: 'services',
    locale,
    fallbackLocale: false,
    where,
    sort: '-featured,-createdAt',
  })
}

export async function getFeaturedServices(locale: Locale = 'uk') {
  const payload = await getPayload()

  return payload.find({
    collection: 'services',
    locale,
    fallbackLocale: false,
    where: {
      featured: { equals: true },
      status: { equals: 'published' },
    },
    limit: 3,
  })
}

export async function getServiceBySlug(slug: string, locale: Locale = 'uk', draft = false) {
  const payload = await getPayload()

  // Try requested locale first
  const result = await payload.find({
    collection: 'services',
    where: { slug: { equals: slug } },
    locale,
    fallbackLocale: false,
    draft,
  })

  return result.docs[0] || null
}

export async function getPortfolioBySlug(slug: string, locale: Locale = 'uk', draft = false) {
  const payload = await getPayload()

  const result = await payload.find({
    collection: 'portfolio',
    where: { slug: { equals: slug } },
    locale,
    fallbackLocale: false,
    draft,
  })

  return result.docs[0] || null
}

export async function getCollectionBySlug(slug: string, locale: Locale = 'uk', draft = false) {
  const payload = await getPayload()

  const result = await payload.find({
    collection: 'lookbooks',
    where: { slug: { equals: slug } },
    locale,
    fallbackLocale: false,
    draft,
  })

  return result.docs[0] || null
}

export async function getCourseBySlug(slug: string, locale: Locale = 'uk', draft = false) {
  const payload = await getPayload()

  const result = await payload.find({
    collection: 'courses',
    where: { slug: { equals: slug } },
    locale,
    fallbackLocale: false,
    draft,
  })

  return result.docs[0] || null
}

export async function getAvailableLocales(
  collection: LocalizedCollection,
  slug: string,
  draft = false
): Promise<Locale[]> {
  const payload = await getPayload()

  const results = await Promise.all(
    supportedLocales.map((locale) =>
      payload.find({
        collection,
        where: { slug: { equals: slug } },
        locale,
        fallbackLocale: false,
        draft,
        limit: 1,
        select: {
          slug: true,
        },
      })
    )
  )

  return supportedLocales.filter((_, index) => results[index].docs.length > 0)
}

export async function getPortfolio(locale: Locale = 'uk', page = 1, limit = 6) {
  const payload = await getPayload()

  return payload.find({
    collection: 'portfolio',
    locale,
    fallbackLocale: false,
    page,
    limit,
    sort: '-featured,-createdAt',
  })
}

export async function getFeaturedPortfolio(locale: Locale = 'uk') {
  const payload = await getPayload()

  return payload.find({
    collection: 'portfolio',
    locale,
    fallbackLocale: false,
    where: {
      featured: { equals: true },
    },
    limit: 3,
  })
}

export async function getCollections(locale: Locale = 'uk', limit = 4) {
  const payload = await getPayload()

  return payload.find({
    collection: 'lookbooks',
    locale,
    fallbackLocale: false,
    limit,
    sort: '-featured,-createdAt',
  })
}

export async function getSiteSettings(locale: Locale = 'uk') {
  const payload = await getPayload()

  return payload.findGlobal({
    slug: 'site-settings',
    locale,
    fallbackLocale: false,
  })
}
