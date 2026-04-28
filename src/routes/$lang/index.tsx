import { Link, createFileRoute } from '@tanstack/react-router'
import {
  EditorialPreviewStrip,
  HomeDirectionTiles,
  HomeEditorialHero,
  OfferGrid,
  Section,
  SectionHead,
  ServiceCard,
} from '~/components/site-shell'
import { buildLocalePath } from '~/lib/i18n'
import { courseCoverAsset } from '~/lib/media-refs'
import { contentQueries } from '~/lib/query'
import { buildSeoHead } from '~/lib/seo'

export const Route = createFileRoute('/$lang/')({
  loader: async ({ context, params }) => {
    const locale = params.lang as 'uk' | 'en' | 'ru'
    const [ui, home, research, realisation, collections, courses, portfolio] = await Promise.all([
      context.queryClient.ensureQueryData(contentQueries.ui(locale)),
      context.queryClient.ensureQueryData(contentQueries.home(locale)),
      context.queryClient.ensureQueryData(contentQueries.services(locale, 'research')),
      context.queryClient.ensureQueryData(contentQueries.services(locale, 'realisation')),
      context.queryClient.ensureQueryData(contentQueries.collections(locale)),
      context.queryClient.ensureQueryData(contentQueries.courses(locale)),
      context.queryClient.ensureQueryData(contentQueries.portfolio(locale)),
    ])

    return { locale, ui, home, research, realisation, collections, courses, portfolio }
  },
  head: ({ loaderData }) =>
    loaderData
      ? buildSeoHead({
          locale: loaderData.locale,
          pathname: buildLocalePath(loaderData.locale),
          metadata: loaderData.home.seo,
        })
      : {},
  component: HomePage,
})

const atelierHeadings = {
  en: 'Atelier, school, and collection work held inside one editorial rhythm.',
  ru: 'Atelier, школа и коллекции в одном editorial-ритме.',
  uk: 'Atelier, школа й колекції в одному editorial-ритмі.',
} as const

function HomePage() {
  const { locale, ui, home, research, realisation, collections, courses, portfolio } = Route.useLoaderData()
  const atelier = realisation.find((item) => item.slug === 'atelier-service') ?? realisation[0]
  const school = courses[0]
  const collectionSpotlight = collections[0]
  const schoolCover = school ? courseCoverAsset(school) : undefined
  const directionItems = [
    ...(atelier
      ? [{
          eyebrow: ui.labels.atelierFocus,
          title: atelier.title,
          text: atelier.summary,
          linkLabel: ui.actions.bookNow,
          imageSrc: atelier.media.src,
          imageAlt: atelier.media.alt,
          to: buildLocalePath(locale, `/realisation/${atelier.slug}`),
        }]
      : []),
    ...(collectionSpotlight
      ? [{
          eyebrow: ui.labels.collection,
          title: collectionSpotlight.title,
          text: collectionSpotlight.summary,
          linkLabel: ui.actions.viewCollection,
          imageSrc: collectionSpotlight.heroMedia.src,
          imageAlt: collectionSpotlight.heroMedia.alt,
          to: buildLocalePath(locale, '/collections'),
        }]
      : []),
    ...(school
      ? [{
          eyebrow: ui.labels.schoolSpotlight,
          title: school.title,
          text: school.summary,
          linkLabel: ui.nav.school,
          imageSrc: schoolCover?.src ?? school.media.items[0]?.asset.src ?? '/images/purity_1.webp',
          imageAlt: schoolCover?.alt ?? school.title,
          to: buildLocalePath(locale, '/school'),
        }]
      : []),
  ]

  return (
    <>
      <HomeEditorialHero locale={locale} ui={ui} home={home} />

      {directionItems.length ? <HomeDirectionTiles items={directionItems} /> : null}

      {research.length ? (
        <OfferGrid
          title={ui.nav.research}
          subtitle={home.privateClientsText}
        >
          {research.map((item) => (
            <ServiceCard
              key={item.slug}
              item={item}
              locale={locale}
              cta={ui.actions.buyService}
              pricingLabel={ui.labels.pricing}
            />
          ))}
        </OfferGrid>
      ) : null}

      {realisation.length ? (
        <OfferGrid
          title={ui.nav.realisation}
          subtitle={home.corporateClientsText}
        >
          {realisation.map((item) => (
            <ServiceCard
              key={item.slug}
              item={item}
              locale={locale}
              cta={ui.actions.bookNow}
              pricingLabel={ui.labels.pricing}
            />
          ))}
        </OfferGrid>
      ) : null}

      {atelier ? (
        <Section>
          <SectionHead
            title={ui.labels.atelierFocus}
            subtitle={atelierHeadings[locale]}
          />
          <div className="atelier-feature">
            <div className="atelier-feature-image">
              <img
                src={atelier.media.src}
                alt={atelier.media.alt}
                className="editorial-photo-image"
                loading="lazy"
                decoding="async"
              />
            </div>

            <article className="atelier-feature-copy editorial-panel">
              <h2 className="section-subtitle">
                {atelier.title}
              </h2>
              <p className="editorial-copy atelier-feature-text">{atelier.summary}</p>
              <div className="atelier-feature-meta">
                <span className="micro-tag">{atelier.duration}</span>
                <span className="micro-tag">{atelier.leadTime}</span>
                <Link
                  to={buildLocalePath(locale, `/realisation/${atelier.slug}`)}
                  className="button-primary atelier-feature-cta"
                >
                  {ui.actions.bookNow}
                </Link>
              </div>
            </article>

            <div className="atelier-feature-aside">
              {school ? (
                <article className="atelier-feature-secondary editorial-panel editorial-panel-compact">
                  <p className="eyebrow">{ui.labels.schoolSpotlight}</p>
                  <h3 className="section-subtitle">{school.title}</h3>
                  <p className="editorial-copy">{school.summary}</p>
                  <div className="micro-tag-row">
                    <span className="micro-tag">{school.sessions}</span>
                    <span className="micro-tag">{school.format}</span>
                  </div>
                  <Link to={buildLocalePath(locale, '/school')} className="button-secondary">
                    {ui.nav.school}
                  </Link>
                </article>
              ) : null}

              {collectionSpotlight ? (
                <article className="atelier-feature-secondary editorial-panel editorial-panel-compact">
                  <p className="eyebrow">{ui.labels.collectionSpotlight}</p>
                  <h3 className="section-subtitle">{collectionSpotlight.title}</h3>
                  <p className="editorial-copy">{collectionSpotlight.story}</p>
                  <div className="micro-tag-row">
                    {collectionSpotlight.palette.map((tone) => (
                      <span key={tone} className="micro-tag">
                        {tone}
                      </span>
                    ))}
                  </div>
                  <Link
                    to={buildLocalePath(locale, `/collections/${collectionSpotlight.slug}`)}
                    className="button-secondary"
                  >
                    {ui.actions.viewCollection}
                  </Link>
                </article>
              ) : null}
            </div>
          </div>
        </Section>
      ) : null}

      {collections.length ? (
        <EditorialPreviewStrip
          eyebrow={ui.nav.collections}
          title={home.transformationNote}
          items={collections.slice(0, 3).map((item) => ({
            title: item.title,
            subtitle: ui.actions.viewCollection,
            imageSrc: item.heroMedia.src,
            imageAlt: item.heroMedia.alt,
            to: buildLocalePath(locale, `/collections/${item.slug}`),
          }))}
        />
      ) : null}

      {portfolio.length ? (
        <EditorialPreviewStrip
          eyebrow={ui.labels.portfolio}
          title={ui.labels.selectedCases}
          items={portfolio.slice(0, 4).map((item) => ({
            title: item.title,
            subtitle: item.category,
            imageSrc: item.heroMedia.src,
            imageAlt: item.heroMedia.alt,
            to: buildLocalePath(locale, `/portfolio/${item.slug}`),
          }))}
        />
      ) : null}

      <Section className="home-contact-section">
        <div className="home-contact-band">
          <Link to={buildLocalePath(locale, '/contacts')} className="button-primary home-contact-single-cta">
            {ui.actions.sendInquiry}
          </Link>
        </div>
      </Section>
    </>
  )
}
