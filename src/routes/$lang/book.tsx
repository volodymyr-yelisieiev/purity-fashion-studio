import { createFileRoute } from '@tanstack/react-router'
import { BookingLayout } from '~/components/site-shell'
import { contentQueries } from '~/lib/query'
import type { ImageAsset, Price } from '~/lib/types'

type BookingSearch = {
  kind?: string
  slug?: string
  area?: string
}

const defaultPrice: Price = {
  eur: '€180',
  uah: '₴7 700',
}

const defaultMedia: ImageAsset = {
  src: '/images/purity_4.jpg',
  alt: 'PURITY booking request',
}

function coverToImageAsset(asset?: { src: string; alt: string }): ImageAsset | undefined {
  if (!asset) {
    return undefined
  }

  return {
    src: asset.src,
    alt: asset.alt,
  }
}

export const Route = createFileRoute('/$lang/book')({
  validateSearch: (search: Record<string, unknown>): BookingSearch => ({
    kind: typeof search.kind === 'string' ? search.kind : undefined,
    slug: typeof search.slug === 'string' ? search.slug : undefined,
    area: typeof search.area === 'string' ? search.area : undefined,
  }),
  loader: async ({ context, params }) => {
    const locale = params.lang as 'uk' | 'en' | 'ru'
    const [ui, researchServices, realisationServices, courses, collections, offers, portfolio] =
      await Promise.all([
        context.queryClient.ensureQueryData(contentQueries.ui(locale)),
        context.queryClient.ensureQueryData(contentQueries.services(locale, 'research')),
        context.queryClient.ensureQueryData(contentQueries.services(locale, 'realisation')),
        context.queryClient.ensureQueryData(contentQueries.courses(locale)),
        context.queryClient.ensureQueryData(contentQueries.collections(locale)),
        context.queryClient.ensureQueryData(contentQueries.transformations(locale)),
        context.queryClient.ensureQueryData(contentQueries.portfolio(locale)),
      ])

    return { locale, ui, researchServices, realisationServices, courses, collections, offers, portfolio }
  },
  component: BookingPage,
})

function BookingPage() {
  const { locale, ui, researchServices, realisationServices, courses, collections, offers, portfolio } =
    Route.useLoaderData()
  const search = Route.useSearch()

  let title = ui.booking.consultationTitle
  let summary = ui.booking.consultationSummary
  let price: Price | undefined = defaultPrice
  let priceNote: string | undefined
  let media = { ...defaultMedia, alt: ui.booking.title }
  let meta = [ui.booking.consultationLabel, ui.booking.studioOrOnline]
  let formats = [
    { id: 'online', label: ui.booking.onlineLabel, detail: ui.booking.onlineDetail },
    { id: 'studio', label: ui.booking.studioLabel, detail: ui.booking.studioDetail },
  ]
  let intentKind: 'service' | 'course' | 'collection' | 'portfolio' | 'transformation' = 'service'
  let intentSlug = 'consultation'

  if (search.kind === 'service' && search.slug) {
    const service = [...researchServices, ...realisationServices].find(
      (entry) =>
        entry.slug === search.slug &&
        (!search.area || entry.area === search.area),
    )
    if (service) {
      title = service.title
      summary = service.summary
      price = service.price
      formats = service.formats
      media = service.media
      meta = [service.eyebrow, service.duration, service.leadTime]
      intentSlug = service.slug
    }
  }

  if (search.kind === 'course' && search.slug) {
    const course = courses.find((entry) => entry.slug === search.slug)
    if (course) {
      title = course.title
      summary = course.summary
      price = course.price
      formats = [{ id: 'online', label: course.format, detail: course.sessions }]
      media = coverToImageAsset(course.media.cover?.asset) ?? coverToImageAsset(course.media.items[0]?.asset) ?? media
      meta = [course.format, course.sessions]
      intentKind = 'course'
      intentSlug = course.slug
    }
  }

  if (search.kind === 'collection' && search.slug) {
    const collection = collections.find((entry) => entry.slug === search.slug)
    if (collection) {
      title = collection.title
      summary = collection.story
      price = undefined
      priceNote = collection.priceNote
      formats = [{ id: 'consultation', label: ui.booking.consultationLabel, detail: collection.priceNote }]
      media = collection.heroMedia
      meta = collection.palette
      intentKind = 'collection'
      intentSlug = collection.slug
    }
  }

  if (search.kind === 'transformation' && search.slug) {
    const offer = offers.find((entry) => entry.slug === search.slug)
    if (offer) {
      title = offer.title
      summary = offer.summary
      price = undefined
      priceNote = offer.cta
      formats = [{ id: 'session', label: offer.format, detail: offer.cta }]
      media = offer.media
      meta = [offer.format]
      intentKind = 'transformation'
      intentSlug = offer.slug
    }
  }

  if (search.kind === 'portfolio' && search.slug) {
    const entry = portfolio.find((item) => item.slug === search.slug)
    if (entry) {
      title = entry.title
      summary = entry.summary
      price = undefined
      priceNote = entry.requestCta
      formats = [{ id: 'case-inquiry', label: ui.booking.consultationLabel, detail: entry.outcome }]
      media = entry.heroMedia
      meta = [entry.category, ...entry.accents]
      intentKind = 'portfolio'
      intentSlug = entry.slug
    }
  }

  return (
    <BookingLayout
      locale={locale}
      ui={ui}
      title={title}
      summary={summary}
      price={price}
      priceNote={priceNote}
      media={media}
      meta={meta}
      formats={formats}
      intentKind={intentKind}
      intentSlug={intentSlug}
    />
  )
}
