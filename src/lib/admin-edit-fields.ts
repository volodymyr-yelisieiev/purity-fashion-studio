import type { EntityKind, ManagedOfferDraftFields } from './types'

export interface AdminDraftFieldSpec {
  name: keyof ManagedOfferDraftFields
  label: string
}

export const editableOfferKinds: EntityKind[] = [
  'service',
  'course',
  'collection',
  'portfolio',
  'transformation',
]

const sharedMediaFields: AdminDraftFieldSpec[] = [
  { name: 'mediaSrc', label: 'Cover image URL' },
  { name: 'mediaAlt', label: 'Cover image alt' },
]

export const adminDraftFieldSpecs: Partial<Record<EntityKind, AdminDraftFieldSpec[]>> = {
  service: [
    { name: 'priceEur', label: 'Price EUR' },
    { name: 'priceUah', label: 'Price UAH' },
    { name: 'eyebrow', label: 'Eyebrow' },
    { name: 'duration', label: 'Duration' },
    { name: 'leadTime', label: 'Lead time' },
    ...sharedMediaFields,
  ],
  course: [
    { name: 'priceEur', label: 'Price EUR' },
    { name: 'priceUah', label: 'Price UAH' },
    { name: 'format', label: 'Format' },
    ...sharedMediaFields,
  ],
  collection: [
    { name: 'priceNote', label: 'Price note' },
    { name: 'requestCta', label: 'Request CTA' },
    ...sharedMediaFields,
  ],
  portfolio: [
    { name: 'category', label: 'Category' },
    { name: 'requestCta', label: 'Request CTA' },
    ...sharedMediaFields,
  ],
  transformation: [
    { name: 'format', label: 'Format' },
    { name: 'cta', label: 'CTA' },
    ...sharedMediaFields,
  ],
}

export function isEditableOfferKind(kind: EntityKind) {
  return editableOfferKinds.includes(kind)
}

export function adminDraftFieldsFromRaw(raw: unknown): ManagedOfferDraftFields {
  if (!raw || typeof raw !== 'object') {
    return {}
  }

  const record = raw as {
    adminDraft?: { fields?: ManagedOfferDraftFields }
    publicEntity?: Record<string, unknown>
  }

  if (record.adminDraft?.fields) {
    return record.adminDraft.fields
  }

  const entity = record.publicEntity
  if (!entity) {
    return {}
  }

  const media = entity.media as { src?: string; alt?: string; cover?: { asset?: { src?: string; alt?: string } } } | undefined
  const heroMedia = entity.heroMedia as { src?: string; alt?: string } | undefined
  const cover = media?.cover?.asset
  const directMedia = media && 'src' in media ? media : undefined
  const price = entity.price as { eur?: string; uah?: string } | undefined

  return {
    priceEur: price?.eur,
    priceUah: price?.uah,
    priceNote: entity.priceNote as string | undefined,
    eyebrow: entity.eyebrow as string | undefined,
    duration: entity.duration as string | undefined,
    leadTime: entity.leadTime as string | undefined,
    format: entity.format as string | undefined,
    category: entity.category as string | undefined,
    requestCta: entity.requestCta as string | undefined,
    cta: entity.cta as string | undefined,
    mediaSrc: directMedia?.src ?? heroMedia?.src ?? cover?.src,
    mediaAlt: directMedia?.alt ?? heroMedia?.alt ?? cover?.alt,
  }
}
