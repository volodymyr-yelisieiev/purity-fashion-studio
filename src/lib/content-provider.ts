import { locales } from './types'
import type {
  ContentOwner,
  ContentProviderAdapter,
  ContentRevision,
  EntityKind,
  Locale,
  LocalizedDocumentStatus,
  ManagedContentMeta,
  ManagedContentMutationInput,
  ManagedContentMutationResult,
  ManagedContentRecord,
  ManagedContentSummary,
  ManagedOfferDraftFields,
  PublishState,
} from './types'

type AdapterEnv = 'development' | 'staging' | 'production'

interface ContentProviderOptions {
  seedRecords: ManagedContentRecord[]
  overlayRecords?: ManagedContentRecord[]
  appEnv?: AdapterEnv
  writesConfigured?: boolean
  now?: () => string
}

export interface WritableContentProviderAdapter extends ContentProviderAdapter {
  exportOverlayRecords(): ManagedContentRecord[]
}

const overlayOwner: ContentOwner = {
  id: 'content-json-overlay',
  name: 'JSON Content Overlay',
  role: 'system',
}

function recordKey(kind: EntityKind, slug: string) {
  return `${kind}:${slug}`
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9а-яіїєґё]+/giu, '-')
    .replace(/^-+|-+$/g, '')
}

function revision(version: number, note: string, createdAt: string): ContentRevision {
  return {
    id: `json-overlay-${version}`,
    version,
    note,
    createdAt,
    createdBy: overlayOwner,
  }
}

function createMeta(
  kind: EntityKind,
  slug: string,
  state: PublishState,
  timestamp: string,
): ManagedContentMeta {
  return {
    id: `${kind}:${slug}`,
    kind,
    slug,
    owner: overlayOwner,
    lastEditedBy: overlayOwner,
    createdAt: timestamp,
    updatedAt: timestamp,
    lifecycle: {
      state,
      ...(state === 'published' ? { publishedAt: timestamp } : null),
      ...(state === 'archived' ? { archivedAt: timestamp, archivedBy: overlayOwner } : null),
    },
    currentRevision: revision(1, 'Created in JSON overlay', timestamp),
    hasUnpublishedChanges: state !== 'published',
    previewKey: `${kind}-${slug}-json-overlay`,
  }
}

function previewPathFor(kind: EntityKind, slug: string) {
  if (kind === 'page') {
    return slug === 'home' ? '/en' : `/en/${slug}`
  }

  if (kind === 'service') {
    return `/en/research/${slug}`
  }

  if (kind === 'course') {
    return '/en/school'
  }

  if (kind === 'collection') {
    return `/en/collections/${slug}`
  }

  if (kind === 'portfolio') {
    return `/en/portfolio/${slug}`
  }

  if (kind === 'transformation') {
    return '/en/transformation'
  }

  if (kind === 'settings') {
    return '/en/contacts'
  }

  return undefined
}

function fallbackLocalization(locale: Locale, title: string, summary?: string): LocalizedDocumentStatus {
  return {
    locale,
    title,
    summary,
    isComplete: Boolean(title),
  }
}

function mergeLocalization(
  existing: LocalizedDocumentStatus[],
  locale: Locale,
  title: string,
  summary?: string,
) {
  const next = new Map(existing.map((entry) => [entry.locale, entry]))
  const current = next.get(locale)

  next.set(locale, {
    locale,
    title: title || current?.title || '',
    summary: summary || current?.summary,
    isComplete: Boolean(title || current?.title),
  })

  for (const code of locales) {
    if (!next.has(code)) {
      next.set(code, fallbackLocalization(code, '', undefined))
    }
  }

  return locales.map((code) => next.get(code)).filter(Boolean) as LocalizedDocumentStatus[]
}

function localizedTitle(record: ManagedContentRecord, locale: Locale) {
  return (
    record.localizations.find((entry) => entry.locale === locale && entry.title)?.title ||
    record.localizations.find((entry) => entry.title)?.title ||
    record.slug
  )
}

export function managedRecordToSummary(
  record: ManagedContentRecord,
  locale: Locale,
): ManagedContentSummary {
  return {
    id: record.id,
    kind: record.kind,
    slug: record.slug,
    title: localizedTitle(record, locale),
    state: record.meta.lifecycle.state,
    updatedAt: record.meta.updatedAt,
    ownerName: record.meta.owner.name,
    localeCoverage: record.localizations
      .filter((entry) => entry.isComplete)
      .map((entry) => entry.locale),
    mediaCount: countMediaRefs(record.raw),
    to: `/admin/content/${record.kind}/${record.slug}`,
  }
}

function countMediaRefs(value: unknown): number {
  if (!value || typeof value !== 'object') {
    return 0
  }

  const serialized = JSON.stringify(value)
  return (serialized.match(/"kind":"image"|"kind":"video"|"src":/g) ?? []).length
}

function canWrite(appEnv: AdapterEnv, writesConfigured: boolean) {
  return appEnv !== 'production' || writesConfigured
}

function blockedResult(input: ManagedContentMutationInput): ManagedContentMutationResult {
  return {
    status: 'blocked',
    adapter: 'json-overlay',
    message:
      'Production content writes are blocked until CONTENT_STORE_PATH or a real CMS provider is configured.',
    reference: `${input.kind}:${input.slug ?? 'new'}:blocked`,
  }
}

function updateRecord(
  base: ManagedContentRecord,
  input: ManagedContentMutationInput,
  timestamp: string,
): ManagedContentRecord {
  const version = base.meta.currentRevision.version + 1
  const state = input.action === 'archive' ? 'archived' : input.state ?? base.meta.lifecycle.state
  const note =
    input.action === 'archive'
      ? input.reason || 'Archived from admin'
      : input.action === 'create'
        ? 'Created from admin'
        : 'Updated from admin'

  return {
    ...base,
    localizations: mergeLocalization(base.localizations, input.locale, input.title, input.summary),
    workflowNotes:
      input.action === 'archive'
        ? [`Archived in JSON overlay: ${note}`, ...base.workflowNotes]
        : base.workflowNotes,
    raw: {
      ...(base.raw && typeof base.raw === 'object' ? base.raw : {}),
      adminDraft: {
        locale: input.locale,
        title: input.title,
        summary: input.summary,
        reason: input.reason,
        fields: input.fields,
        updatedAt: timestamp,
      },
    },
    meta: {
      ...base.meta,
      updatedAt: timestamp,
      lastEditedBy: overlayOwner,
      lifecycle: {
        ...base.meta.lifecycle,
        state,
        ...(state === 'archived' ? { archivedAt: timestamp, archivedBy: overlayOwner } : null),
      },
      currentRevision: revision(version, note, timestamp),
      hasUnpublishedChanges: state !== 'published',
    },
  }
}

function createRecord(input: ManagedContentMutationInput, slug: string, timestamp: string) {
  const state = input.state ?? 'draft'

  return {
    id: `${input.kind}:${slug}`,
    kind: input.kind,
    slug,
    meta: createMeta(input.kind, slug, state, timestamp),
    localizations: mergeLocalization([], input.locale, input.title, input.summary),
    previewPath: previewPathFor(input.kind, slug),
    workflowNotes: ['Created in the JSON overlay. Publish through the future CMS adapter when connected.'],
    raw: {
      adminDraft: {
        locale: input.locale,
        title: input.title,
        summary: input.summary,
        fields: input.fields,
        createdAt: timestamp,
      },
    },
  } satisfies ManagedContentRecord
}

function pruneDraftFields(fields?: ManagedOfferDraftFields) {
  if (!fields) {
    return undefined
  }

  const entries = Object.entries(fields).filter(([, value]) => typeof value === 'string' && value.trim())
  return entries.length ? Object.fromEntries(entries) as ManagedOfferDraftFields : undefined
}

export function createContentProviderAdapter({
  seedRecords,
  overlayRecords = [],
  appEnv = 'development',
  writesConfigured = true,
  now = () => new Date().toISOString(),
}: ContentProviderOptions): WritableContentProviderAdapter {
  const seed = new Map(seedRecords.map((record) => [recordKey(record.kind, record.slug), record]))
  const overlay = new Map(overlayRecords.map((record) => [recordKey(record.kind, record.slug), record]))

  function mergedRecords() {
    const merged = new Map(seed)
    for (const [key, record] of overlay) {
      merged.set(key, record)
    }
    return [...merged.values()]
  }

  return {
    async listManagedContent(locale, kind) {
      return mergedRecords()
        .filter((record) => (kind ? record.kind === kind : true))
        .map((record) => managedRecordToSummary(record, locale))
        .sort((first, second) => first.kind.localeCompare(second.kind) || first.title.localeCompare(second.title))
    },

    async getManagedContentRecord(_locale, kind, slug) {
      return overlay.get(recordKey(kind, slug)) ?? seed.get(recordKey(kind, slug))
    },

    async upsertManagedContent(input) {
      if (!canWrite(appEnv, writesConfigured)) {
        return blockedResult(input)
      }

      const slug = slugify(input.slug || input.title)
      const key = recordKey(input.kind, slug)
      const timestamp = now()
      const base = overlay.get(key) ?? seed.get(key)
      const normalizedInput = { ...input, fields: pruneDraftFields(input.fields) }
      const record = base
        ? updateRecord(base, normalizedInput, timestamp)
        : createRecord(normalizedInput, slug, timestamp)

      overlay.set(key, record)

      return {
        status: 'queued',
        adapter: 'json-overlay',
        message: `${input.kind} ${slug} saved to the JSON content overlay.`,
        reference: `${input.kind}:${slug}:${record.meta.currentRevision.version}`,
        record,
      }
    },

    async archiveManagedContent(input) {
      if (!canWrite(appEnv, writesConfigured)) {
        return blockedResult(input)
      }

      const slug = slugify(input.slug || input.title)
      const key = recordKey(input.kind, slug)
      const timestamp = now()
      const base = overlay.get(key) ?? seed.get(key)

      if (!base) {
        return {
          status: 'blocked',
          adapter: 'json-overlay',
          message: `${input.kind} ${slug} cannot be archived because it does not exist.`,
          reference: `${input.kind}:${slug}:missing`,
        }
      }

      const record = updateRecord({ ...base }, { ...input, action: 'archive' }, timestamp)
      overlay.set(key, record)

      return {
        status: 'queued',
        adapter: 'json-overlay',
        message: `${input.kind} ${slug} archived in the JSON content overlay.`,
        reference: `${input.kind}:${slug}:${record.meta.currentRevision.version}`,
        record,
      }
    },

    exportOverlayRecords() {
      return [...overlay.values()]
    },
  }
}
