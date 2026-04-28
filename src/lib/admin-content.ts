import { createServerFn } from '@tanstack/react-start'
import {
  getManagedContentIndex as getSeedManagedContentIndex,
  getManagedContentRecord as getSeedManagedContentRecord,
} from './content'
import { createContentProviderAdapter } from './content-provider'
import {
  readContentOverlayRecords,
  writeContentOverlayRecords,
} from './content-overlay-store'
import { parseServerEnv } from './env'
import { readAdminAuthState } from './admin-session'
import { locales } from './types'
import type {
  EntityKind,
  Locale,
  ManagedContentMutationAction,
  ManagedContentMutationInput,
  ManagedContentRecord,
  ManagedOfferDraftFields,
  PublishState,
} from './types'

const mutationActions = ['create', 'update', 'archive'] as const
const entityKinds = ['page', 'service', 'course', 'collection', 'portfolio', 'transformation', 'settings', 'media'] as const
const publishStates = ['draft', 'review', 'published', 'archived'] as const
let contentMutationQueue = Promise.resolve()

function getSeedManagedContentRecords(): ManagedContentRecord[] {
  return getSeedManagedContentIndex('en')
    .map((entry) => getSeedManagedContentRecord('en', entry.kind, entry.slug))
    .filter((entry): entry is ManagedContentRecord => Boolean(entry))
}

async function createRequestProvider() {
  const env = parseServerEnv(process.env)

  return createContentProviderAdapter({
    seedRecords: getSeedManagedContentRecords(),
    overlayRecords: await readContentOverlayRecords(),
    appEnv: env.appEnv,
    writesConfigured: Boolean(env.contentStorePath),
  })
}

function serializeRecord(record: ManagedContentRecord) {
  return JSON.parse(JSON.stringify(record)) as ManagedContentRecord
}

function requireEnum<T extends readonly string[]>(value: unknown, allowed: T, field: string): T[number] {
  if (typeof value === 'string' && allowed.includes(value)) {
    return value
  }

  throw new Error(`invalid-${field}`)
}

function optionalEnum<T extends readonly string[]>(value: unknown, allowed: T): T[number] | undefined {
  return typeof value === 'string' && allowed.includes(value) ? value : undefined
}

async function withContentMutationQueue<T>(task: () => Promise<T>) {
  const queued = contentMutationQueue.then(task, task)
  contentMutationQueue = queued.then(() => undefined, () => undefined)
  return queued
}

function normalizeMutationInput(data: ManagedContentMutationInput): ManagedContentMutationInput {
  return {
    action: requireEnum(data.action, mutationActions, 'action') as ManagedContentMutationAction,
    kind: requireEnum(data.kind, entityKinds, 'kind') as EntityKind,
    slug: typeof data.slug === 'string' ? data.slug.trim() : undefined,
    locale: requireEnum(data.locale, locales, 'locale') as Locale,
    title: typeof data.title === 'string' ? data.title.trim() : '',
    summary: typeof data.summary === 'string' ? data.summary.trim() : undefined,
    reason: typeof data.reason === 'string' ? data.reason.trim() : undefined,
    state: optionalEnum(data.state, publishStates) as PublishState | undefined,
    fields: normalizeDraftFields(data.fields),
  }
}

function normalizeDraftFields(fields: unknown): ManagedOfferDraftFields | undefined {
  if (!fields || typeof fields !== 'object') {
    return undefined
  }

  const source = fields as Record<keyof ManagedOfferDraftFields, unknown>
  const next: ManagedOfferDraftFields = {}
  const keys: Array<keyof ManagedOfferDraftFields> = [
    'priceEur',
    'priceUah',
    'mediaSrc',
    'mediaAlt',
    'eyebrow',
    'duration',
    'leadTime',
    'format',
    'cta',
    'priceNote',
    'category',
    'requestCta',
  ]

  for (const key of keys) {
    const value = source[key]
    if (typeof value === 'string' && value.trim()) {
      next[key] = value.trim()
    }
  }

  return Object.keys(next).length ? next : undefined
}

export const listManagedContent = createServerFn({ method: 'GET' })
  .inputValidator((data: { locale: Locale; kind?: EntityKind }) => ({
    locale: data.locale,
    kind: data.kind,
  }))
  .handler(async ({ data }) => {
    const auth = await readAdminAuthState()

    if (!auth.authenticated) {
      return []
    }

    const provider = await createRequestProvider()
    return provider.listManagedContent(data.locale, data.kind)
  })

export const getManagedContentRecord = createServerFn({ method: 'GET' })
  .inputValidator((data: { locale: Locale; kind: EntityKind; slug: string }) => ({
    locale: data.locale,
    kind: data.kind,
    slug: typeof data.slug === 'string' ? data.slug.trim() : '',
  }))
  .handler(async ({ data }) => {
    const auth = await readAdminAuthState()

    if (!auth.authenticated) {
      return undefined
    }

    const provider = await createRequestProvider()
    const record = await provider.getManagedContentRecord(data.locale, data.kind, data.slug)
    return record ? (serializeRecord(record) as any) : undefined
  })

export const submitManagedContentMutation = createServerFn({ method: 'POST' })
  .inputValidator(normalizeMutationInput)
  .handler(async ({ data }) => withContentMutationQueue(async () => {
    const auth = await readAdminAuthState()

    if (!auth.authenticated) {
      return {
        status: 'blocked' as const,
        adapter: 'json-overlay' as const,
        message: 'Admin session is required before content can be edited.',
        reference: `${data.kind}:${data.slug ?? 'new'}:unauthorized`,
      }
    }

    if (data.action !== 'create' && !data.slug) {
      return {
        status: 'blocked' as const,
        adapter: 'json-overlay' as const,
        message: 'Existing content mutations require a slug.',
        reference: `${data.kind}:missing-slug:blocked`,
      }
    }

    if (data.action !== 'archive' && !data.title) {
      return {
        status: 'blocked' as const,
        adapter: 'json-overlay' as const,
        message: 'A localized title is required before content can be saved.',
        reference: `${data.kind}:${data.slug ?? 'new'}:blocked`,
      }
    }

    const provider = await createRequestProvider()
    const result =
      data.action === 'archive'
        ? await provider.archiveManagedContent(data)
        : await provider.upsertManagedContent(data)

    if (result.status !== 'blocked') {
      await writeContentOverlayRecords(provider.exportOverlayRecords())
    }

    return {
      ...result,
      record: result.record ? serializeRecord(result.record) : undefined,
    } as any
  }))
