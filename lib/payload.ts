import { getPayload as getPayloadInstance } from 'payload'
import configPromise from '@payload-config'
import type { Where, Payload } from 'payload'

export type Locale = 'uk' | 'ru' | 'en'

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
    where,
  })
}

export async function getServiceBySlug(slug: string, locale: Locale = 'uk') {
  const payload = await getPayload()

  const result = await payload.find({
    collection: 'services',
    where: { slug: { equals: slug } },
    locale,
  })

  return result.docs[0] || null
}

export async function getPortfolio(locale: Locale = 'uk', page = 1, limit = 6) {
  const payload = await getPayload()

  return payload.find({
    collection: 'portfolio',
    locale,
    page,
    limit,
  })
}

export async function getCollections(locale: Locale = 'uk', limit = 4) {
  const payload = await getPayload()

  return payload.find({
    collection: 'collections',
    locale,
    limit,
    sort: '-releaseDate',
  })
}

export async function getSiteSettings(locale: Locale = 'uk') {
  const payload = await getPayload()

  return payload.findGlobal({
    slug: 'site-settings',
    locale,
  })
}
