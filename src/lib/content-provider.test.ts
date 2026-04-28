import test from 'node:test'
import assert from 'node:assert/strict'

import { createContentProviderAdapter } from './content-provider'
import type { EntityKind, Locale, ManagedContentRecord, PublishState } from './types'

const owner = {
  id: 'test-owner',
  name: 'Test Owner',
  role: 'system' as const,
}

function record({
  kind = 'service',
  slug,
  title,
  locale = 'en',
  state = 'published',
}: {
  kind?: EntityKind
  slug: string
  title: string
  locale?: Locale
  state?: PublishState
}): ManagedContentRecord {
  return {
    id: `${kind}:${slug}`,
    kind,
    slug,
    meta: {
      id: `${kind}:${slug}`,
      kind,
      slug,
      owner,
      lastEditedBy: owner,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      lifecycle: { state, publishedAt: state === 'published' ? '2026-01-01T00:00:00.000Z' : undefined },
      currentRevision: {
        id: 'revision-1',
        version: 1,
        note: 'seed',
        createdAt: '2026-01-01T00:00:00.000Z',
        createdBy: owner,
      },
      hasUnpublishedChanges: state !== 'published',
      previewKey: `${kind}-${slug}`,
    },
    localizations: [{ locale, title, summary: `${title} summary`, isComplete: true }],
    previewPath: `/en/${slug}`,
    workflowNotes: ['seed'],
    raw: { media: [{ src: '/images/test.webp' }] },
  }
}

test('content provider reads seed records and falls back to available locale title', async () => {
  const provider = createContentProviderAdapter({
    seedRecords: [record({ slug: 'atelier', title: 'Atelier service' })],
  })

  const [summary] = await provider.listManagedContent('uk', 'service')

  assert.equal(summary.title, 'Atelier service')
  assert.equal(summary.mediaCount, 1)
})

test('content provider merges overlay records over seed records', async () => {
  const provider = createContentProviderAdapter({
    seedRecords: [record({ slug: 'atelier', title: 'Seed title' })],
    overlayRecords: [record({ slug: 'atelier', title: 'Overlay title', state: 'review' })],
  })

  const [summary] = await provider.listManagedContent('en', 'service')

  assert.equal(summary.title, 'Overlay title')
  assert.equal(summary.state, 'review')
})

test('content provider creates, updates, and archives records in the overlay', async () => {
  const provider = createContentProviderAdapter({
    seedRecords: [],
    now: () => '2026-02-01T00:00:00.000Z',
  })

  const created = await provider.upsertManagedContent({
    action: 'create',
    kind: 'portfolio',
    locale: 'en',
    slug: 'new-case',
    title: 'New case',
    summary: 'Created summary',
  })

  assert.equal(created.status, 'queued')
  assert.equal(created.record?.meta.lifecycle.state, 'draft')

  const updated = await provider.upsertManagedContent({
    action: 'update',
    kind: 'portfolio',
    locale: 'uk',
    slug: 'new-case',
    title: 'Новий кейс',
    summary: 'Оновлений опис',
    state: 'review',
  })

  assert.equal(updated.record?.meta.lifecycle.state, 'review')
  assert.equal(updated.record?.localizations.find((entry) => entry.locale === 'uk')?.title, 'Новий кейс')

  const archived = await provider.archiveManagedContent({
    action: 'archive',
    kind: 'portfolio',
    locale: 'en',
    slug: 'new-case',
    title: 'New case',
    reason: 'Outdated',
  })

  assert.equal(archived.record?.meta.lifecycle.state, 'archived')
  assert.equal(provider.exportOverlayRecords().length, 1)
})

test('content provider blocks production writes without a configured store', async () => {
  const provider = createContentProviderAdapter({
    seedRecords: [],
    appEnv: 'production',
    writesConfigured: false,
  })

  const result = await provider.upsertManagedContent({
    action: 'create',
    kind: 'page',
    locale: 'en',
    slug: 'blocked',
    title: 'Blocked',
  })

  assert.equal(result.status, 'blocked')
})
