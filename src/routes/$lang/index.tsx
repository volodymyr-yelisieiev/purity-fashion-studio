import { createFileRoute } from '@tanstack/react-router'
import {
  CollectionsRail,
  EditorialTextureBand,
  FinalCta,
  HomeAtelierBand,
  LayeredHomeHero,
  PortfolioProof,
  SchoolNote,
  ServiceRowsSection,
  ThreePartMethod,
} from '~/components/editorial'
import { buildLocalePath } from '~/lib/i18n'
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

function HomePage() {
  const { locale, ui, home, research, realisation, collections, courses, portfolio } = Route.useLoaderData()
  const atelier = realisation.find((item) => item.slug === 'atelier-service') ?? realisation[0]
  const school = courses[0]
  const collectionSpotlight = collections[0]

  return (
    <>
      <LayeredHomeHero locale={locale} ui={ui} home={home} />
      <ThreePartMethod home={home} locale={locale} ui={ui} />

      {research.length ? (
        <ServiceRowsSection
          title={ui.nav.research}
          subtitle={home.privateClientsText}
          services={research}
          locale={locale}
          cta={ui.actions.buyService}
          eyebrow={home.privateClientsTitle}
        />
      ) : null}

      {realisation.length ? (
        <ServiceRowsSection
          title={ui.nav.realisation}
          subtitle={home.corporateClientsText}
          services={realisation}
          locale={locale}
          cta={ui.actions.bookNow}
          eyebrow={home.corporateClientsTitle}
        />
      ) : null}

      <HomeAtelierBand atelier={atelier} school={school} collection={collectionSpotlight} locale={locale} ui={ui} />
      <EditorialTextureBand />

      <CollectionsRail collections={collections} locale={locale} ui={ui} title={home.transformationNote} />
      <PortfolioProof cases={portfolio.slice(0, 3)} locale={locale} ui={ui} />
      <SchoolNote course={school} locale={locale} ui={ui} />

      <FinalCta locale={locale} ui={ui} />
    </>
  )
}
