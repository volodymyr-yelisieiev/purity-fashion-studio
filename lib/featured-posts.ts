import { getPayload } from '@/lib/payload'
import type { Locale } from '@/lib/payload'
import type { Media, Service, Portfolio, Collection } from '@/payload-types'

export type FeaturedPostItem = {
  id: string
  type: 'service' | 'portfolio' | 'collection'
  title: string
  slug: string
  href: string
  image?: { url: string; alt?: string }
  excerpt?: string
  category?: string | null
  priceDisplay?: string | null
  duration?: string | null
}

function getServicePriceDisplay(service: Service, locale: Locale): string | null {
  const priceNote = service.pricing?.priceNote
  if (priceNote) return priceNote

  const priceEUR = service.pricing?.eur
  const priceUAH = service.pricing?.uah

  if (locale === 'en' && priceEUR) return `€${priceEUR}`
  if (priceUAH) return `${priceUAH} ₴`
  return null
}

export async function getFeaturedPosts(locale: Locale, limit = 6): Promise<FeaturedPostItem[]> {
  const payload = await getPayload()

  const [services, portfolio, collections] = await Promise.all([
    payload.find({
      collection: 'services',
      locale,
      where: { featured: { equals: true }, status: { equals: 'published' } },
      sort: '-updatedAt',
      depth: 1,
      limit,
    }),
    payload.find({
      collection: 'portfolio',
      locale,
      where: { featured: { equals: true }, status: { equals: 'published' } },
      sort: '-updatedAt',
      depth: 1,
      limit,
    }),
    payload.find({
      collection: 'collections',
      locale,
      where: { featured: { equals: true }, status: { equals: 'published' } },
      sort: '-updatedAt',
      depth: 1,
      limit,
    }),
  ])

  const serviceItems: FeaturedPostItem[] = services.docs.map((service) => {
    const hero = typeof service.heroImage === 'object' ? (service.heroImage as Media | null) : null
    return {
      id: String(service.id),
      type: 'service',
      title: service.title,
      slug: service.slug,
      href: `/${locale}/services/${service.slug}`,
      image: hero?.url ? { url: hero.url, alt: hero.alt || service.title } : undefined,
      excerpt: service.excerpt || service.description || '',
      category: service.category,
      priceDisplay: getServicePriceDisplay(service as Service, locale),
      duration: service.duration || null,
    }
  })

  const portfolioItems: FeaturedPostItem[] = portfolio.docs.map((item) => {
    const project = item as Portfolio
    const cover = typeof project.afterImage === 'object' ? (project.afterImage as Media | null) : null
    return {
      id: String(project.id),
      type: 'portfolio',
      title: project.title,
      slug: project.slug,
      href: `/${locale}/portfolio/${project.slug}`,
      image: cover?.url ? { url: cover.url, alt: cover.alt || project.title } : undefined,
      excerpt: project.description || '',
      category: project.category,
      priceDisplay: null,
      duration: null,
    }
  })

  const collectionItems: FeaturedPostItem[] = collections.docs.map((item) => {
    const collection = item as Collection
    const cover = typeof collection.coverImage === 'object' ? (collection.coverImage as Media | null) : null
    return {
      id: String(collection.id),
      type: 'collection',
      title: collection.name,
      slug: collection.slug,
      href: `/${locale}/collections/${collection.slug}`,
      image: cover?.url ? { url: cover.url, alt: cover.alt || collection.name } : undefined,
      excerpt: collection.description || '',
      category: collection.season,
      priceDisplay: null,
      duration: null,
    }
  })

  const combined = [...serviceItems, ...portfolioItems, ...collectionItems]

  combined.sort((a, b) => a.title.localeCompare(b.title))

  return combined.slice(0, limit)
}
