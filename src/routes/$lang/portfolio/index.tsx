import { createFileRoute } from '@tanstack/react-router'
import { PortfolioGrid, StandardListingPage } from '~/components/site-shell'
import { buildLocalePath } from '~/lib/i18n'
import { listingPreviewMedia, plannedImageAt } from '~/lib/media-plan'
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
    <StandardListingPage
      hero={{
        eyebrow: `PURITY / ${ui.labels.portfolio}`,
        title: page.title,
        text: page.intro,
        emphasis: 'grand',
        imageSrc: heroImage.src,
        imageAlt: heroImage.alt,
        caption: page.seo.image.caption,
      }}
      quoteTitle={ui.labels.selectedCases}
      quoteText={page.highlight}
      preview={{
        eyebrow: ui.labels.result,
        title: page.pullQuote,
        items: portfolio.slice(0, 3).map((entry, index) => {
          const media = plannedImageAt(listingPreviewMedia.portfolio, index, entry.heroMedia)

          return {
            title: entry.title,
            subtitle: entry.outcome,
            imageSrc: media.src,
            imageAlt: media.alt,
            to: buildLocalePath(locale, `/portfolio/${entry.slug}`),
          }
        }),
      }}
    >
      <PortfolioGrid cases={portfolio} locale={locale} cta={ui.actions.viewCase} />
    </StandardListingPage>
  )
}
