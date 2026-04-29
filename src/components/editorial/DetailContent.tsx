import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { buildLocalePath } from '~/lib/i18n'
import { optimizedImageSrc } from '~/lib/media-refs'
import type {
  CollectionEntity,
  Locale,
  PortfolioCaseEntity,
  Price,
  ServiceEntity,
  UiCopy,
} from '~/lib/types'
import { cn } from '~/lib/utils'
import { Section, SectionHead } from './Section'

export function CompactIntro({
  eyebrow,
  title,
  text,
  asideEyebrow,
  asideTitle,
  asideText,
  chips,
  imageSrc,
  imageAlt,
}: {
  eyebrow: string
  title: string
  text: string
  asideEyebrow: string
  asideTitle: string
  asideText: string
  chips?: string[]
  imageSrc?: string
  imageAlt?: string
}) {
  return (
    <section className="compact-intro-shell">
      {imageSrc ? (
        <div className="compact-intro-media">
          <img
            src={optimizedImageSrc(imageSrc)}
            alt={imageAlt ?? title}
            className="compact-intro-image"
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
        </div>
      ) : null}

      <div className="site-container compact-intro-grid">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="section-title">{title}</h1>
          <p className="editorial-copy max-w-[42rem]">{text}</p>
        </div>

        <aside className="compact-intro-aside">
          <p className="eyebrow">{asideEyebrow}</p>
          <h2 className="section-subtitle">{asideTitle}</h2>
          <p className="editorial-copy">{asideText}</p>
          {chips?.length ? (
            <div className="micro-tag-row">
              {chips.map((chip) => (
                <span key={chip} className="micro-tag">
                  {chip}
                </span>
              ))}
            </div>
          ) : null}
        </aside>
      </div>
    </section>
  )
}

export function DetailHero({
  eyebrow,
  title,
  summary,
  price,
  duration,
  leadTime,
  locale,
  bookingLabel,
  area,
  slug,
  media,
  labels,
}: {
  eyebrow: string
  title: string
  summary: string
  price: Price
  duration: string
  leadTime: string
  locale: Locale
  bookingLabel: string
  area: string
  slug: string
  media: ServiceEntity['media']
  labels: Pick<UiCopy['labels'], 'timing' | 'pricing'>
}) {
  return (
    <ProductDetailHero
      eyebrow={eyebrow}
      title={title}
      summary={summary}
      media={media}
      chips={[duration, leadTime]}
      action={
        <Link
          to={buildLocalePath(locale, '/book')}
          search={{ kind: 'service', slug, area }}
          className="button-primary"
        >
          {bookingLabel}
        </Link>
      }
      meta={[
        { label: labels.timing, value: duration, detail: leadTime },
        { label: labels.pricing, value: price.eur, detail: price.uah, emphasis: true, large: true },
      ]}
    />
  )
}

function ProductDetailHero({
  eyebrow,
  title,
  summary,
  media,
  chips,
  action,
  meta,
}: {
  eyebrow: string
  title: string
  summary: string
  media: { src: string; alt: string; caption?: string }
  chips?: string[]
  action: ReactNode
  meta: Array<{ label: string; value: string; detail?: string; emphasis?: boolean; large?: boolean }>
}) {
  return (
    <section className="product-detail-hero">
      <div className="site-container product-detail-hero-grid">
        <figure className="product-detail-media">
          <img
            src={optimizedImageSrc(media.src)}
            alt={media.alt}
            className="detail-hero-image"
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
          {media.caption ? <figcaption className="product-detail-caption">{media.caption}</figcaption> : null}
        </figure>

        <div className="product-detail-copy">
          <div className="product-detail-kicker">
            <p className="eyebrow">{eyebrow}</p>
            {chips?.length ? (
              <div className="micro-tag-row">
                {chips.map((chip) => (
                  <span key={chip} className="micro-tag">
                    {chip}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <h1 className="hero-title">{title}</h1>
          <p className="hero-copy product-detail-summary">{summary}</p>

          <div className="product-detail-action">{action}</div>

          <div className="product-detail-meta-grid">
            {meta.map((item) => (
              <div
                key={`${item.label}-${item.value}`}
                className={cn('product-detail-meta', item.emphasis && 'product-detail-meta-emphasis')}
              >
                <p className="eyebrow">{item.label}</p>
                <p className={item.large ? 'price-value' : 'detail-line-title'}>{item.value}</p>
                {item.detail ? <p className="price-secondary">{item.detail}</p> : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function DetailSections({
  formats,
  deliverables,
  process,
  notes,
  labels,
}: {
  formats: Array<{ id: string; label: string; detail: string }>
  deliverables: string[]
  process: string[]
  notes: string[]
  labels: Pick<
    UiCopy['labels'],
    'serviceStructure' | 'serviceStructureTitle' | 'formats' | 'deliverables' | 'process' | 'notes'
  >
}) {
  return (
    <Section className="product-detail-section">
      <SectionHead
        eyebrow={labels.serviceStructure}
        title={labels.serviceStructureTitle}
      />

      <div className="product-modules-grid">
        <article className="product-module">
          <p className="eyebrow">{labels.formats}</p>
          <div className="product-line-list">
            {formats.map((format) => (
              <div key={format.id} className="product-line-item">
                <p className="detail-line-title">{format.label}</p>
                <p className="editorial-copy">{format.detail}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="product-module">
          <p className="eyebrow">{labels.deliverables}</p>
          <ul className="product-list">
            {deliverables.map((item) => (
              <li key={item}>
                <span className="list-index">+</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="product-module product-module-wide">
          <p className="eyebrow">{labels.process}</p>
          <ol className="product-list product-list-ordered">
            {process.map((item, index) => (
              <li key={item}>
                <span className="list-index">{String(index + 1).padStart(2, '0')}</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </article>

        <article className="product-module">
          <p className="eyebrow">{labels.notes}</p>
          <ul className="product-line-list">
            {notes.map((note) => (
              <li key={note} className="product-line-item">
                <p className="editorial-copy">{note}</p>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </Section>
  )
}

export function QuoteBand({
  title,
  text,
  compact = false,
}: {
  title: string
  text: string
  compact?: boolean
}) {
  return (
    <Section>
      <div className={cn('quote-band', compact && 'quote-band-compact')}>
        <p className="eyebrow">{title}</p>
        <p className="quote-copy">{text}</p>
      </div>
    </Section>
  )
}

export function CollectionGallery({
  collection,
  locale,
  ui,
}: {
  collection: CollectionEntity
  locale: Locale
  ui: UiCopy
}) {
  const gallery = productionGallery(collection.heroMedia, collection.gallery)

  return (
    <>
      <ProductDetailHero
        eyebrow={`PURITY / ${ui.labels.collection}`}
        title={collection.title}
        summary={collection.summary}
        media={collection.heroMedia}
        chips={collection.palette}
        action={
          <Link
            to={buildLocalePath(locale, '/book')}
            search={{ kind: 'collection', slug: collection.slug }}
            className="button-primary"
          >
            {collection.requestCta}
          </Link>
        }
        meta={[
          { label: ui.labels.palette, value: collection.palette.slice(0, 2).join(' / '), detail: collection.palette.slice(2).join(' / ') },
          { label: ui.labels.pricing, value: collection.priceNote, emphasis: true },
        ]}
      />

      <Section className="product-detail-section">
        <div className="product-story-layout">
          <div>
            <p className="eyebrow">{ui.labels.collectionStory}</p>
            <h2 className="section-title">{collection.title}</h2>
            <p className="editorial-copy max-w-[44rem]">{collection.story}</p>
          </div>

          <div className="product-modules-grid product-modules-grid-compact">
            <article className="product-module">
              <p className="eyebrow">{ui.labels.materials}</p>
              <TagCluster items={collection.materials} />
            </article>
            <article className="product-module">
              <p className="eyebrow">{ui.labels.silhouettes}</p>
              <TagCluster items={collection.silhouettes} />
            </article>
            <article className="product-module product-module-wide">
              <p className="eyebrow">{ui.labels.notes}</p>
              <ul className="product-line-list">
                {collection.editorialNotes.map((note) => (
                  <li key={note} className="product-line-item">
                    <p className="editorial-copy">{note}</p>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>

        {gallery.length ? <EditorialGallery gallery={gallery} /> : null}
      </Section>

      <Section className="product-detail-section product-detail-final-cta">
        <Link
          to={buildLocalePath(locale, '/book')}
          search={{ kind: 'collection', slug: collection.slug }}
          className="button-primary"
        >
          {collection.requestCta}
        </Link>
      </Section>
    </>
  )
}

function productionGallery<T extends { src: string; alt: string; caption?: string }>(hero: { src: string }, gallery: T[]) {
  return gallery
    .filter((asset) => asset.src !== hero.src)
    .filter((asset) => !/abstract/i.test(`${asset.src} ${asset.alt} ${asset.caption ?? ''}`))
}

function TagCluster({ items }: { items: string[] }) {
  return (
    <div className="micro-tag-row">
      {items.map((item) => (
        <span key={item} className="micro-tag">
          {item}
        </span>
      ))}
    </div>
  )
}

function EditorialGallery({ gallery }: { gallery: Array<{ src: string; alt: string; caption?: string }> }) {
  return (
    <div className="collection-gallery-grid product-gallery-grid">
      {gallery.map((asset, index) => (
        <figure key={asset.src} className={cn('collection-frame', index === 0 && 'collection-frame-large')}>
          <img
            src={optimizedImageSrc(asset.src)}
            alt={asset.alt}
            className="collection-frame-image"
            loading="lazy"
            decoding="async"
          />
          {asset.caption ? <figcaption className="collection-frame-caption">{asset.caption}</figcaption> : null}
        </figure>
      ))}
    </div>
  )
}

function detailSectionNumber(index: number) {
  return String(index + 1).padStart(2, '0')
}

export function PortfolioCaseStory({
  entry,
  locale,
  ui,
}: {
  entry: PortfolioCaseEntity
  locale: Locale
  ui: UiCopy
}) {
  const gallery = productionGallery(entry.heroMedia, entry.gallery)
  const storyModules = [
    { label: ui.labels.challenge, copy: entry.challenge },
    { label: ui.labels.approach, copy: entry.approach },
    { label: ui.labels.result, copy: entry.outcome },
  ]
  const visualSystemNumber = detailSectionNumber(storyModules.length + 1)

  return (
    <>
      <ProductDetailHero
        eyebrow={`PURITY / ${ui.labels.portfolio}`}
        title={entry.title}
        summary={entry.summary}
        media={entry.heroMedia}
        chips={entry.accents}
        action={
          <Link
            to={buildLocalePath(locale, '/book')}
            search={{ kind: 'portfolio', slug: entry.slug }}
            className="button-primary"
          >
            {entry.requestCta}
          </Link>
        }
        meta={[
          { label: ui.labels.client, value: entry.client, detail: entry.context },
          { label: ui.labels.caseContext, value: entry.category, detail: entry.accents.join(' / ') },
        ]}
      />

      <Section className="product-detail-section">
        <div className="product-modules-grid">
          {storyModules.map((module, index) => (
            <article key={module.label} className="product-module">
              <p className="eyebrow">{detailSectionNumber(index)} {module.label}</p>
              <p className="editorial-copy">{module.copy}</p>
            </article>
          ))}
          <article className="product-module">
            <p className="eyebrow">{detailSectionNumber(storyModules.length)} {ui.labels.deliverables}</p>
            <ul className="product-list">
              {entry.deliverables.map((item) => (
                <li key={item}>
                  <span className="list-index">+</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </Section>

      {gallery.length ? (
        <Section className="product-detail-section">
          <SectionHead eyebrow={`${visualSystemNumber} Visual system`} title={entry.title} subtitle={entry.context} />
          <EditorialGallery gallery={gallery} />
        </Section>
      ) : null}

      <Section>
        <div className="stats-grid">
          {entry.metrics.map((metric) => (
            <article key={metric.label} className="stat-block">
              <p className="eyebrow">{metric.label}</p>
              <p className="stat-value">{metric.value}</p>
              <p className="editorial-copy">{entry.category}</p>
            </article>
          ))}
        </div>
      </Section>

      {entry.video ? (
        <Section>
          <div className="quote-band quote-band-compact">
            <p className="eyebrow">{ui.labels.filmNote}</p>
            <p className="quote-copy">{entry.video.title}</p>
            <a className="button-secondary w-fit" href={entry.video.url} target="_blank" rel="noreferrer">
              {entry.video.provider}
            </a>
          </div>
        </Section>
      ) : null}

      <Section className="product-detail-section product-detail-final-cta">
        <Link
          to={buildLocalePath(locale, '/book')}
          search={{ kind: 'portfolio', slug: entry.slug }}
          className="button-primary"
        >
          {entry.requestCta}
        </Link>
      </Section>
    </>
  )
}
