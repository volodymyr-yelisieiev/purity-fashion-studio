import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { courseCoverAsset, optimizedImageSrc } from '~/lib/media-refs'
import {
  homeLayerMedia,
  listingPreviewMedia,
  listingProcessMedia,
  plannedImageAt,
} from '~/lib/media-plan'
import { buildLocalePath } from '~/lib/i18n'
import { LISTING_PAGE_CONFIG, type ListingPageKey } from '~/lib/page-config'
import type {
  CollectionEntity,
  CourseEntity,
  HomePageData,
  ImageAsset,
  ListingPageData,
  Locale,
  PortfolioCaseEntity,
  Price,
  SchoolPageData,
  ServiceEntity,
  TransformationOfferEntity,
  UiCopy,
} from '~/lib/types'
import { cn } from '~/lib/utils'
import { Section, SectionHead } from './Section'

const methodTitles: Record<Locale, [string, string, string]> = {
  uk: ['Дослідження', 'Втілення', 'Трансформація'],
  en: ['Research', 'Realisation', 'Transformation'],
  ru: ['Исследование', 'Воплощение', 'Трансформация'],
}

const finalCtaCopy: Record<Locale, { title: string; text: string; secondary: string }> = {
  uk: {
    title: 'Почати з консультації PURITY',
    text: 'Залиште запит, і студія запропонує формат: lookbook, ревізія, shopping-супровід, atelier або трансформаційний досвід.',
    secondary: 'Написати в студію',
  },
  en: {
    title: 'Start with a PURITY consultation',
    text: 'Leave a request and the studio will suggest the right format: lookbook, wardrobe review, shopping route, atelier, or transformation experience.',
    secondary: 'Write to the studio',
  },
  ru: {
    title: 'Начать с консультации PURITY',
    text: 'Оставьте запрос, и студия предложит формат: lookbook, ревизию, shopping-сопровождение, atelier или трансформационный опыт.',
    secondary: 'Написать в студию',
  },
}

export function PageEditorialHero({
  eyebrow,
  title,
  text,
  image,
  caption,
  compact = false,
}: {
  eyebrow: string
  title: string
  text: string
  image?: ImageAsset
  caption?: string
  compact?: boolean
}) {
  return (
    <section className={cn('editorial-page-hero', compact && 'editorial-page-hero-compact')}>
      <div className="editorial-container editorial-page-hero-grid">
        <div className="editorial-page-hero-copy">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="hero-title hero-title-grand">{title}</h1>
          <p className="hero-copy">{text}</p>
        </div>
        {image ? (
          <figure className="editorial-page-hero-media">
            <img
              src={optimizedImageSrc(image.src)}
              alt={image.alt}
              className="editorial-page-hero-image"
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
            {caption || image.caption ? <figcaption>{caption ?? image.caption}</figcaption> : null}
          </figure>
        ) : null}
      </div>
    </section>
  )
}

export function ThreePartMethod({
  home,
  locale,
  ui,
}: {
  home: HomePageData
  locale: Locale
  ui: UiCopy
}) {
  const titles = methodTitles[locale]
  const methodMedia = [
    homeLayerMedia.patternPaper,
    homeLayerMedia.silkFold,
    homeLayerMedia.mannequinDrape,
  ]

  return (
    <Section>
      <SectionHead eyebrow={ui.labels.methodology} title={home.methodologyTitle} subtitle={home.philosophy} />
      <div className="method-band">
        {home.methodologySteps.slice(0, 3).map((step, index) => {
          const media = methodMedia[index]

          return (
            <article key={step} className="method-column">
              <img src={optimizedImageSrc(media.src)} alt={media.alt} loading="lazy" decoding="async" />
              <div className="method-column-content">
                <span className="list-index">{String(index + 1).padStart(2, '0')}</span>
                <h3>{titles[index]}</h3>
                <p>{step}</p>
                <Link to={buildLocalePath(locale, `/${(['research', 'realisation', 'transformation'] as const)[index]}`)}>
                  {titles[index]} →
                </Link>
              </div>
            </article>
          )
        })}
      </div>
    </Section>
  )
}

function PriceCell({ price }: { price?: Price }) {
  if (!price) {
    return null
  }

  return (
    <div className="editorial-row-price">
      <span>{price.eur}</span>
      <small>{price.uah}</small>
    </div>
  )
}

export function ServiceRow({
  item,
  locale,
  cta,
  index,
}: {
  item: ServiceEntity
  locale: Locale
  cta: string
  index: number
}) {
  return (
    <article className="service-editorial-row">
      <Link to={buildLocalePath(locale, `/${item.area}/${item.slug}`)} className="service-editorial-row-main">
        <span className="list-index">{String(index + 1).padStart(2, '0')}</span>
        <span className="service-editorial-row-title">
          <strong>{item.title}</strong>
          <small>{item.eyebrow}</small>
        </span>
        <span className="service-editorial-row-meta">{item.duration} / {item.leadTime}</span>
        <PriceCell price={item.price} />
      </Link>
      <figure className="service-editorial-row-frame" aria-hidden="true">
        <img
          src={optimizedImageSrc(item.media.src)}
          alt=""
          role="presentation"
          className="service-editorial-row-image"
          loading="lazy"
          decoding="async"
        />
      </figure>
      <Link
        to={buildLocalePath(locale, '/book')}
        search={{ kind: 'service', slug: item.slug, area: item.area }}
        className="service-editorial-row-action"
      >
        {cta} →
      </Link>
    </article>
  )
}

export function ServiceRowsSection({
  title,
  subtitle,
  services,
  locale,
  cta,
  eyebrow,
}: {
  title: string
  subtitle: string
  services: ServiceEntity[]
  locale: Locale
  cta: string
  eyebrow?: string
}) {
  if (!services.length) {
    return null
  }

  return (
    <Section>
      <SectionHead eyebrow={eyebrow} title={title} subtitle={subtitle} />
      <div className="service-editorial-list">
        {services.map((item, index) => (
          <ServiceRow key={item.slug} item={item} locale={locale} cta={cta} index={index} />
        ))}
      </div>
    </Section>
  )
}

export function HomeAtelierBand({
  atelier,
  school,
  collection,
  locale,
  ui,
}: {
  atelier?: ServiceEntity
  school?: CourseEntity
  collection?: CollectionEntity
  locale: Locale
  ui: UiCopy
}) {
  if (!atelier) {
    return null
  }

  return (
    <section className="atelier-black-band">
      <div className="editorial-container atelier-black-grid">
        <div className="atelier-black-copy">
          <p className="eyebrow">{ui.labels.atelierFocus}</p>
          <h2>{atelier.title}</h2>
          <p>{atelier.summary}</p>
          <div className="atelier-black-facts">
            <span>{atelier.heroLabel}</span>
            <span>{atelier.leadTime}</span>
            <span>{atelier.duration}</span>
          </div>
          <Link
            to={buildLocalePath(locale, '/book')}
            search={{ kind: 'service', slug: atelier.slug, area: atelier.area }}
            className="button-secondary atelier-black-cta"
          >
            {ui.actions.bookNow}
          </Link>
        </div>
        <figure className="atelier-black-media">
          <img src={optimizedImageSrc(atelier.media.src)} alt={atelier.media.alt} loading="lazy" decoding="async" />
        </figure>
        <div className="atelier-black-side">
          {school ? (
            <Link to={buildLocalePath(locale, '/school')} className="atelier-black-note">
              <span className="eyebrow">{ui.labels.schoolSpotlight}</span>
              <strong>{school.title}</strong>
              <small>{school.sessions}</small>
            </Link>
          ) : null}
          {collection ? (
            <Link to={buildLocalePath(locale, `/collections/${collection.slug}`)} className="atelier-black-note">
              <span className="eyebrow">{ui.labels.collectionSpotlight}</span>
              <strong>{collection.title}</strong>
              <small>{collection.priceNote}</small>
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export function CollectionsRail({
  collections,
  locale,
  ui,
  title,
}: {
  collections: CollectionEntity[]
  locale: Locale
  ui: UiCopy
  title: string
}) {
  if (!collections.length) {
    return null
  }

  return (
    <Section>
      <SectionHead eyebrow={ui.nav.collections} title={title} subtitle={ui.labels.collectionStory} />
      <div className="collection-rail" aria-label={ui.nav.collections}>
        {collections.slice(0, 4).map((collection, index) => (
          <Link key={collection.slug} to={buildLocalePath(locale, `/collections/${collection.slug}`)} className="collection-rail-item">
            <figure>
              <img src={optimizedImageSrc(collection.heroMedia.src)} alt={collection.heroMedia.alt} loading="lazy" decoding="async" />
            </figure>
            <span className="list-index">{String(index + 1).padStart(2, '0')}</span>
            <strong>{collection.title}</strong>
            <small>{collection.priceNote}</small>
          </Link>
        ))}
      </div>
    </Section>
  )
}

export function PortfolioProof({
  cases,
  locale,
  ui,
}: {
  cases: PortfolioCaseEntity[]
  locale: Locale
  ui: UiCopy
}) {
  if (!cases.length) {
    return null
  }

  const [lead, ...rest] = cases

  return (
    <Section>
      <SectionHead eyebrow={ui.labels.portfolio} title={ui.labels.selectedCases} subtitle={ui.labels.result} />
      <div className="portfolio-proof-grid">
        <Link to={buildLocalePath(locale, `/portfolio/${lead.slug}`)} className="portfolio-proof-lead">
          <img src={optimizedImageSrc(lead.heroMedia.src)} alt={lead.heroMedia.alt} loading="lazy" decoding="async" />
          <span className="list-index">01</span>
          <span className="eyebrow">{lead.category}</span>
          <strong>{lead.title}</strong>
          <p>{lead.outcome}</p>
        </Link>
        <div className="portfolio-proof-stack">
          {rest.slice(0, 2).map((entry, index) => (
            <Link key={entry.slug} to={buildLocalePath(locale, `/portfolio/${entry.slug}`)} className="portfolio-proof-small">
              <span className="list-index">{String(index + 2).padStart(2, '0')}</span>
              <strong>{entry.title}</strong>
              <small>{entry.challenge}</small>
              <span>{entry.outcome}</span>
            </Link>
          ))}
        </div>
      </div>
    </Section>
  )
}

export function SchoolNote({
  course,
  locale,
  ui,
}: {
  course?: CourseEntity
  locale: Locale
  ui: UiCopy
}) {
  if (!course) {
    return null
  }

  return (
    <Section className="school-note-band">
      <div>
        <p className="eyebrow">{ui.labels.schoolSpotlight}</p>
        <h2 className="section-subtitle">{course.title}</h2>
      </div>
      <p className="editorial-copy">{course.summary}</p>
      <Link to={buildLocalePath(locale, '/school')} className="button-secondary">
        {ui.nav.school}
      </Link>
    </Section>
  )
}

export function FinalCta({
  locale,
  ui,
}: {
  locale: Locale
  ui: UiCopy
}) {
  const copy = finalCtaCopy[locale]

  return (
    <Section large>
      <div className="editorial-final-cta">
        <h2>{copy.title}</h2>
        <p>{copy.text}</p>
        <div>
          <Link to={buildLocalePath(locale, '/book')} className="button-primary">
            {ui.actions.requestConsultation}
          </Link>
          <Link to={buildLocalePath(locale, '/contacts')} className="button-secondary">
            {copy.secondary}
          </Link>
        </div>
      </div>
    </Section>
  )
}

export function ListingRhythm({
  pageKey,
  page,
  locale,
  ui,
  navLabel,
  image,
  children,
}: {
  pageKey: ListingPageKey
  page: ListingPageData | SchoolPageData
  locale: Locale
  ui: UiCopy
  navLabel: string
  image?: ImageAsset
  children: ReactNode
}) {
  const rhythm = LISTING_PAGE_CONFIG[pageKey].rhythm[locale]
  const rhythmMedia = pageKey === 'collections' || pageKey === 'portfolio'
    ? listingPreviewMedia[pageKey]
    : listingProcessMedia[pageKey]
  const fallbackImage = image ?? page.seo.image

  return (
    <>
      <PageEditorialHero
        eyebrow={`PURITY / ${navLabel}`}
        title={page.title}
        text={page.intro}
        image={image ?? page.seo.image}
        caption={page.seo.image.caption}
        compact
      />
      <Section>
        <div className="listing-rhythm-grid">
          <p className="quote-copy">{page.pullQuote}</p>
          <ol className="listing-process-list">
            {rhythm.map((step, index) => (
              <li key={`${pageKey}-${step.label}`} className="listing-process-card">
                {(() => {
                  const media = plannedImageAt(rhythmMedia, index, fallbackImage)

                  return <img src={optimizedImageSrc(media.src)} alt={media.alt} loading="lazy" decoding="async" />
                })()}
                <div className="listing-process-card-copy">
                  <span className="list-index">{String(index + 1).padStart(2, '0')}</span>
                  <strong>{step.label}</strong>
                  <p>{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Section>
      {children}
    </>
  )
}

export function TransformationRows({
  offers,
  locale,
}: {
  offers: TransformationOfferEntity[]
  locale: Locale
}) {
  return (
    <Section>
      <div className="editorial-offer-rows">
        {offers.map((offer, index) => (
          <article key={offer.slug} className="editorial-offer-row">
            <span className="list-index">{String(index + 1).padStart(2, '0')}</span>
            <img src={optimizedImageSrc(offer.media.src)} alt={offer.media.alt} loading="lazy" decoding="async" />
            <div>
              <p className="eyebrow">{offer.format}</p>
              <h2>{offer.title}</h2>
              <p>{offer.summary}</p>
            </div>
            <Link to={buildLocalePath(locale, '/book')} search={{ kind: 'transformation', slug: offer.slug }} className="button-secondary">
              {offer.cta}
            </Link>
          </article>
        ))}
      </div>
    </Section>
  )
}

export function CollectionLookbookRows({
  collections,
  locale,
  ui,
}: {
  collections: CollectionEntity[]
  locale: Locale
  ui: UiCopy
}) {
  return (
    <Section>
      <div className="lookbook-row-list">
        {collections.map((collection, index) => (
          <article key={collection.slug} className="lookbook-row">
            <figure>
              <img src={optimizedImageSrc(collection.heroMedia.src)} alt={collection.heroMedia.alt} loading="lazy" decoding="async" />
            </figure>
            <div>
              <span className="list-index">{String(index + 1).padStart(2, '0')}</span>
              <h2>{collection.title}</h2>
              <p>{collection.story}</p>
              <div className="micro-tag-row">
                {collection.palette.slice(0, 4).map((tone) => (
                  <span key={tone} className="micro-tag">{tone}</span>
                ))}
              </div>
              <small>{collection.priceNote}</small>
              <Link to={buildLocalePath(locale, `/collections/${collection.slug}`)} className="button-secondary">
                {ui.actions.viewCollection}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </Section>
  )
}

export function PortfolioCaseRows({
  cases,
  locale,
  ui,
}: {
  cases: PortfolioCaseEntity[]
  locale: Locale
  ui: UiCopy
}) {
  return (
    <Section>
      <div className="case-row-list">
        {cases.map((entry, index) => (
          <article key={entry.slug} className="case-row">
            <span className="list-index">{String(index + 1).padStart(2, '0')}</span>
            <img src={optimizedImageSrc(entry.heroMedia.src)} alt={entry.heroMedia.alt} loading="lazy" decoding="async" />
            <div>
              <p className="eyebrow">{entry.category}</p>
              <h2>{entry.title}</h2>
              <p>{entry.summary}</p>
              <dl>
                <div><dt>{ui.labels.challenge}</dt><dd>{entry.challenge}</dd></div>
                <div><dt>{ui.labels.result}</dt><dd>{entry.outcome}</dd></div>
              </dl>
            </div>
            <Link to={buildLocalePath(locale, `/portfolio/${entry.slug}`)} className="button-secondary">
              {ui.actions.viewCase}
            </Link>
          </article>
        ))}
      </div>
    </Section>
  )
}

export function CourseRows({
  courses,
  locale,
  ui,
}: {
  courses: CourseEntity[]
  locale: Locale
  ui: UiCopy
}) {
  return (
    <Section>
      <div className="course-row-list">
        {courses.map((course, index) => {
          const cover = courseCoverAsset(course)

          return (
            <article key={course.slug} className="course-row">
              <span className="list-index">{String(index + 1).padStart(2, '0')}</span>
              {cover ? <img src={optimizedImageSrc(cover.src)} alt={cover.alt || course.title} loading="lazy" decoding="async" /> : null}
              <div>
                <p className="eyebrow">{course.format}</p>
                <h2>{course.title}</h2>
                <p>{course.summary}</p>
                <ul>
                  {course.details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
              </div>
              <div className="course-row-side">
                <span>{course.sessions}</span>
                <PriceCell price={course.price} />
                <Link to={buildLocalePath(locale, '/book')} search={{ kind: 'course', slug: course.slug }} className="button-primary">
                  {ui.actions.bookNow}
                </Link>
              </div>
            </article>
          )
        })}
      </div>
    </Section>
  )
}

export function EditorialTextureBand() {
  return (
    <div className="editorial-texture-band" aria-hidden="true">
      <img
        src={optimizedImageSrc(homeLayerMedia.threadDetail.src)}
        alt=""
        role="presentation"
        loading="lazy"
        decoding="async"
      />
    </div>
  )
}
