import publicPostsSeed from '~/content/seed/public-posts.seed.json'
import type {
  CollectionEntity,
  CourseEntity,
  Locale,
  ManagedContentRecord,
  ManagedOfferDraftFields,
  PortfolioCaseEntity,
  ServiceArea,
  ServiceEntity,
  TransformationOfferEntity,
} from './types'

interface PublicPostSeedLocale {
  services: ServiceEntity[]
  courses: CourseEntity[]
  transformations: TransformationOfferEntity[]
  collections: CollectionEntity[]
  portfolio: PortfolioCaseEntity[]
}

interface PublicPostSeedDocument {
  version: number
  source: string
  generatedAt: string
  locales: Record<Locale, PublicPostSeedLocale>
}

const seedDocument = publicPostsSeed as unknown as PublicPostSeedDocument

function cloneSeed<T>(value: T): T {
  if (typeof structuredClone === 'function') {
    return structuredClone(value)
  }

  return JSON.parse(JSON.stringify(value)) as T
}

function localeSeed(locale: Locale) {
  return seedDocument.locales[locale]
}

type PublicPostEntity =
  | ServiceEntity
  | CourseEntity
  | CollectionEntity
  | PortfolioCaseEntity
  | TransformationOfferEntity

function overlayRecord(
  records: ManagedContentRecord[],
  entity: PublicPostEntity,
) {
  return records.find((record) => record.kind === entity.kind && record.slug === entity.slug)
}

function draftFields(record?: ManagedContentRecord): ManagedOfferDraftFields {
  if (!record?.raw || typeof record.raw !== 'object') {
    return {}
  }

  const draft = (record.raw as { adminDraft?: { fields?: ManagedOfferDraftFields } }).adminDraft
  return draft?.fields ?? {}
}

function localizedDraft(record: ManagedContentRecord | undefined, locale: Locale) {
  return record?.localizations.find((entry) => entry.locale === locale)
}

function withImagePatch(image: { src: string; alt: string; caption?: string }, fields: ManagedOfferDraftFields) {
  return {
    ...image,
    src: fields.mediaSrc || image.src,
    alt: fields.mediaAlt || image.alt,
  }
}

function applyTextPatch<T extends PublicPostEntity>(
  entity: T,
  record: ManagedContentRecord | undefined,
  locale: Locale,
) {
  const localization = localizedDraft(record, locale)
  const next = {
    ...entity,
    title: localization?.title || entity.title,
  }

  if ('summary' in next) {
    next.summary = localization?.summary || next.summary
  }

  if ('seo' in next) {
    next.seo = {
      ...next.seo,
      title: localization?.title ? `PURITY | ${localization.title}` : next.seo.title,
      description: localization?.summary || next.seo.description,
    }
  }

  return next
}

function applyRecordPatch<T extends PublicPostEntity>(
  entity: T,
  record: ManagedContentRecord | undefined,
  locale: Locale,
): T | undefined {
  if (!record) {
    return entity
  }

  const state = record.meta.lifecycle.state

  if (state === 'archived') {
    return undefined
  }

  if (state !== 'published') {
    return entity
  }

  const fields = draftFields(record)
  const patched = applyTextPatch(entity, record, locale)

  if (patched.kind === 'service') {
    return {
      ...patched,
      eyebrow: fields.eyebrow || patched.eyebrow,
      duration: fields.duration || patched.duration,
      leadTime: fields.leadTime || patched.leadTime,
      price: {
        eur: fields.priceEur || patched.price.eur,
        uah: fields.priceUah || patched.price.uah,
      },
      media: withImagePatch(patched.media, fields),
    } as T
  }

  if (patched.kind === 'course') {
    const cover = patched.media.cover ?? patched.media.items[0]
    const nextCover = cover
      ? {
          ...cover,
          asset: {
            ...cover.asset,
            src: fields.mediaSrc || cover.asset.src,
            alt: fields.mediaAlt || cover.asset.alt,
          },
        }
      : undefined

    return {
      ...patched,
      format: fields.format || patched.format,
      price: {
        eur: fields.priceEur || patched.price.eur,
        uah: fields.priceUah || patched.price.uah,
      },
      media: {
        ...patched.media,
        cover: nextCover ?? patched.media.cover,
        items: nextCover
          ? patched.media.items.map((item, index) => (index === 0 || item.id === nextCover.id ? nextCover : item))
          : patched.media.items,
      },
    } as T
  }

  if (patched.kind === 'collection') {
    return {
      ...patched,
      priceNote: fields.priceNote || patched.priceNote,
      requestCta: fields.requestCta || patched.requestCta,
      heroMedia: withImagePatch(patched.heroMedia, fields),
      seo: {
        ...patched.seo,
        image: withImagePatch(patched.seo.image, fields),
      },
    } as T
  }

  if (patched.kind === 'portfolio') {
    return {
      ...patched,
      category: fields.category || patched.category,
      requestCta: fields.requestCta || patched.requestCta,
      heroMedia: withImagePatch(patched.heroMedia, fields),
      seo: {
        ...patched.seo,
        image: withImagePatch(patched.seo.image, fields),
      },
    } as T
  }

  if (patched.kind === 'transformation') {
    return {
      ...patched,
      format: fields.format || patched.format,
      cta: fields.cta || patched.cta,
      media: withImagePatch(patched.media, fields),
    } as T
  }

  return patched
}

function applyOverlay<T extends PublicPostEntity>(
  entities: T[],
  locale: Locale,
  overlayRecords: ManagedContentRecord[],
) {
  return entities
    .map((entity) => applyRecordPatch(entity, overlayRecord(overlayRecords, entity), locale))
    .filter((entity): entity is T => Boolean(entity))
}

export function getSeedServices(
  locale: Locale,
  area?: ServiceArea,
  overlayRecords: ManagedContentRecord[] = [],
) {
  const services = cloneSeed(localeSeed(locale).services)
  const patched = applyOverlay(services, locale, overlayRecords)
  return area ? patched.filter((service) => service.area === area) : patched
}

export function getSeedServiceBySlug(
  locale: Locale,
  area: ServiceArea,
  slug: string,
  overlayRecords: ManagedContentRecord[] = [],
) {
  return getSeedServices(locale, area, overlayRecords).find((service) => service.slug === slug)
}

export function getSeedCourses(locale: Locale, overlayRecords: ManagedContentRecord[] = []) {
  return applyOverlay(cloneSeed(localeSeed(locale).courses), locale, overlayRecords)
}

export function getSeedCollections(locale: Locale, overlayRecords: ManagedContentRecord[] = []) {
  return applyOverlay(cloneSeed(localeSeed(locale).collections), locale, overlayRecords)
}

export function getSeedCollectionBySlug(
  locale: Locale,
  slug: string,
  overlayRecords: ManagedContentRecord[] = [],
) {
  return getSeedCollections(locale, overlayRecords).find((collection) => collection.slug === slug)
}

export function getSeedPortfolio(locale: Locale, overlayRecords: ManagedContentRecord[] = []) {
  return applyOverlay(cloneSeed(localeSeed(locale).portfolio), locale, overlayRecords)
}

export function getSeedPortfolioCaseBySlug(
  locale: Locale,
  slug: string,
  overlayRecords: ManagedContentRecord[] = [],
) {
  return getSeedPortfolio(locale, overlayRecords).find((entry) => entry.slug === slug)
}

export function getSeedTransformations(locale: Locale, overlayRecords: ManagedContentRecord[] = []) {
  return applyOverlay(cloneSeed(localeSeed(locale).transformations), locale, overlayRecords)
}

export function getPublicPostSeedMeta() {
  return {
    version: seedDocument.version,
    source: seedDocument.source,
    generatedAt: seedDocument.generatedAt,
  }
}
