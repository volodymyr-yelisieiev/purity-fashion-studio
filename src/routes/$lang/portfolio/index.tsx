import { createFileRoute } from '@tanstack/react-router'
import { ListingRhythm, PortfolioCaseRows } from '~/components/editorial'
import { buildLocalePath } from '~/lib/i18n'
import { contentQueries } from '~/lib/query'
import { buildSeoHead } from '~/lib/seo'

export const Route = createFileRoute('/$lang/portfolio/')({
  loader: async ({ context, params }) => {
    const locale = params.lang as 'uk' | 'en' | 'ru'
    const [page, portfolio, ui] = await Promise.all([
      context.queryClient.ensureQueryData(contentQueries.portfolioPage(locale)),
      context.queryClient.ensureQueryData(contentQueries.portfolio(locale)),
      context.queryClient.ensureQueryData(contentQueries.ui(locale)),
    ])

    return { locale, page, portfolio, ui }
  },
  head: ({ loaderData }) =>
    loaderData
      ? buildSeoHead({
          locale: loaderData.locale,
          pathname: buildLocalePath(loaderData.locale, '/portfolio'),
          metadata: loaderData.page.seo,
        })
      : {},
  component: PortfolioPage,
})

function PortfolioPage() {
  const { locale, page, portfolio, ui } = Route.useLoaderData()
  const heroImage = page.seo.image

  return (
    <ListingRhythm
      page={{ ...page, pullQuote: page.highlight }}
      locale={locale}
      ui={ui}
      navLabel={ui.labels.portfolio}
      image={heroImage}
      processItems={portfolio.map((entry) => `${entry.title}: ${entry.outcome}`)}
    >
      <PortfolioCaseRows cases={portfolio} locale={locale} ui={ui} />
    </ListingRhythm>
  )
}
