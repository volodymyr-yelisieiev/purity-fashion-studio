import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

import publicPostsSeed from '~/content/seed/public-posts.seed.json'
import { courseCoverAsset } from './media-refs'
import {
  homeLayerMedia,
  plannedMediaRefs,
} from './media-plan'
import { getPublicPostSeedMeta, getSeedServices } from './public-content-seed'
import { contentRepository } from './repository'
import type { EntityKind, Locale, ManagedContentRecord } from './types'

const publicPageSlugs = [
  'home',
  'research',
  'realisation',
  'transformation',
  'collections',
  'school',
  'portfolio',
  'contacts',
] as const

test('managed content index covers every public page seed', async () => {
  const index = await contentRepository.getManagedContentIndex('en')
  const ids = new Set(index.map((entry) => `${entry.kind}:${entry.slug}`))

  for (const slug of publicPageSlugs) {
    assert.equal(ids.has(`page:${slug}`), true, `missing managed page record: ${slug}`)
  }
})

test('managed entities expose complete UK/EN/RU localization status where required', async () => {
  const requiredKinds: EntityKind[] = ['page', 'service', 'course', 'collection', 'portfolio', 'transformation']
  const requiredLocales: Locale[] = ['uk', 'en', 'ru']

  for (const kind of requiredKinds) {
    const index = await contentRepository.getManagedContentIndex('en', kind)

    for (const entry of index) {
      const record = await contentRepository.getManagedContentRecord('en', entry.kind, entry.slug)
      if (!record) {
        assert.fail(`missing managed record: ${entry.kind}:${entry.slug}`)
      }

      for (const locale of requiredLocales) {
        const isComplete = record.localizations.some(
          (item) => item.locale === locale && Boolean(item.title) && item.isComplete,
        )
        assert.equal(
          isComplete,
          true,
          `incomplete ${locale} localization: ${entry.kind}:${entry.slug}`,
        )
      }
    }
  }
})

test('transformation cards use explicit managed media references', async () => {
  const offers = await contentRepository.getTransformationOffers('en')

  for (const offer of offers) {
    assert.match(offer.media.src, /^\/images\/generated\/.+\.(webp|png|jpe?g)$/)
    assert.ok(offer.media.alt, `missing media alt: ${offer.slug}`)
  }
})

test('public offer media comes from managed seed records', async () => {
  const [services, courses, collections, portfolio, transformations] = await Promise.all([
    contentRepository.getServices('en'),
    contentRepository.getCourses('en'),
    contentRepository.getCollections('en'),
    contentRepository.getPortfolio('en'),
    contentRepository.getTransformationOffers('en'),
  ])

  const imageRefs = [
    ...services.map((service) => service.media),
    ...courses.map((course) => courseCoverAsset(course)),
    ...collections.flatMap((collection) => [collection.heroMedia, ...collection.gallery]),
    ...portfolio.flatMap((entry) => [entry.heroMedia, ...entry.gallery]),
    ...transformations.map((offer) => offer.media),
  ]

  for (const image of imageRefs) {
    assert.ok(image?.src, 'missing public post image src')
    assert.ok(image.alt, `missing alt text for ${image.src}`)
    assert.match(image.src, /^\/images\/generated\/.+\.(webp|png|jpe?g)$/)
  }
})

test('planned public media uses generated raster assets', () => {
  for (const { owner, image } of plannedMediaRefs()) {
    assert.ok(image.alt.trim(), `missing planned image alt: ${owner}`)
    assert.match(image.src, /^\/images\/generated\/.+\.(webp|png|jpe?g)$/i, `non-generated planned image: ${owner}`)
    assert.doesNotMatch(image.src, /\.svg$/i, `placeholder planned image: ${owner}`)

    const publicPath = join(process.cwd(), 'public', image.src.replace(/^\//, ''))
    assert.equal(existsSync(publicPath), true, `missing planned image file: ${owner} ${image.src}`)
  }
})

test('primary public media references existing non-placeholder assets', async () => {
  const [services, courses, collections, portfolio, transformations] = await Promise.all([
    contentRepository.getServices('en'),
    contentRepository.getCourses('en'),
    contentRepository.getCollections('en'),
    contentRepository.getPortfolio('en'),
    contentRepository.getTransformationOffers('en'),
  ])

  const primaryImages = [
    ...plannedMediaRefs()
      .filter(({ owner }) => owner.startsWith('page:'))
      .map(({ image }) => image),
    ...Object.values(homeLayerMedia),
    ...services.map((service) => service.media),
    ...courses.map((course) => courseCoverAsset(course)),
    ...collections.flatMap((collection) => [collection.heroMedia, ...collection.gallery]),
    ...portfolio.flatMap((entry) => [entry.heroMedia, ...entry.gallery]),
    ...transformations.map((offer) => offer.media),
  ].filter((image): image is { src: string; alt: string } => Boolean(image))

  for (const image of primaryImages) {
    assert.ok(image.alt.trim(), `missing primary image alt: ${image.src}`)
    assert.match(image.src, /^\/images\/generated\/.+\.(webp|png|jpe?g)$/i, `non-generated primary image: ${image.src}`)
    assert.doesNotMatch(image.src, /\.svg$/i, `placeholder primary image: ${image.src}`)

    const publicPath = join(process.cwd(), 'public', image.src.replace(/^\//, ''))
    assert.equal(existsSync(publicPath), true, `missing primary image file: ${image.src}`)
  }
})

test('public posts are sourced from the versioned seed document', async () => {
  const seed = publicPostsSeed as unknown as {
    version: number
    locales: Record<Locale, {
      services: Array<{ slug: string }>
      courses: Array<{ slug: string }>
      transformations: Array<{ slug: string }>
      collections: Array<{ slug: string }>
      portfolio: Array<{ slug: string }>
    }>
  }
  const meta = getPublicPostSeedMeta()

  assert.equal(meta.version, seed.version)

  for (const locale of ['uk', 'en', 'ru'] satisfies Locale[]) {
    assert.deepEqual(
      (await contentRepository.getServices(locale)).map((entry) => entry.slug),
      seed.locales[locale].services.map((entry) => entry.slug),
    )
    assert.deepEqual(
      (await contentRepository.getCourses(locale)).map((entry) => entry.slug),
      seed.locales[locale].courses.map((entry) => entry.slug),
    )
    assert.deepEqual(
      (await contentRepository.getTransformationOffers(locale)).map((entry) => entry.slug),
      seed.locales[locale].transformations.map((entry) => entry.slug),
    )
    assert.deepEqual(
      (await contentRepository.getCollections(locale)).map((entry) => entry.slug),
      seed.locales[locale].collections.map((entry) => entry.slug),
    )
    assert.deepEqual(
      (await contentRepository.getPortfolio(locale)).map((entry) => entry.slug),
      seed.locales[locale].portfolio.map((entry) => entry.slug),
    )
  }
})

test('public post seed applies editable admin overlay fields', () => {
  const overlay = {
    id: 'service:personal-lookbook',
    kind: 'service',
    slug: 'personal-lookbook',
    meta: {
      id: 'service:personal-lookbook',
      kind: 'service',
      slug: 'personal-lookbook',
      owner: { id: 'test', name: 'Test', role: 'system' },
      lastEditedBy: { id: 'test', name: 'Test', role: 'system' },
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      lifecycle: { state: 'published', publishedAt: '2026-01-01T00:00:00.000Z' },
      currentRevision: {
        id: 'revision-2',
        version: 2,
        note: 'overlay',
        createdAt: '2026-01-01T00:00:00.000Z',
        createdBy: { id: 'test', name: 'Test', role: 'system' },
      },
      hasUnpublishedChanges: false,
      previewKey: 'service-personal-lookbook',
    },
    localizations: [
      { locale: 'en', title: 'Edited Lookbook', summary: 'Edited summary', isComplete: true },
    ],
    workflowNotes: [],
    raw: {
      adminDraft: {
        fields: {
          priceEur: '€999',
          priceUah: '₴40 000',
          mediaSrc: '/uploads/legacy-photo.webp',
          mediaAlt: 'Edited cover',
        },
      },
    },
  } satisfies ManagedContentRecord

  const [service] = getSeedServices('en', 'research', [overlay]).filter(
    (entry) => entry.slug === 'personal-lookbook',
  )

  assert.equal(service.title, 'Edited Lookbook')
  assert.equal(service.summary, 'Edited summary')
  assert.equal(service.price.eur, '€999')
  assert.equal(service.price.uah, '₴40 000')
  assert.equal(service.media.src, '/images/generated/purity-service-lookbook.webp')
  assert.equal(service.media.alt, 'Edited cover')

  const review = {
    ...overlay,
    localizations: [
      { locale: 'en' as const, title: 'Review-only Lookbook', summary: 'Review summary', isComplete: true },
    ],
    meta: {
      ...overlay.meta,
      lifecycle: { state: 'review' as const },
    },
  }

  const [reviewService] = getSeedServices('en', 'research', [review]).filter(
    (entry) => entry.slug === 'personal-lookbook',
  )
  assert.notEqual(reviewService.title, 'Review-only Lookbook')

  const archived = {
    ...overlay,
    meta: {
      ...overlay.meta,
      lifecycle: { state: 'archived' as const },
    },
  }

  assert.equal(
    getSeedServices('en', 'research', [archived]).some((entry) => entry.slug === 'personal-lookbook'),
    false,
  )
})
