import { createFileRoute, notFound } from '@tanstack/react-router'
import { PortfolioCaseStory } from '~/components/site-shell'
import { buildLocalePath } from '~/lib/i18n'
import { contentQueries } from '~/lib/query'
import { buildSeoHead } from '~/lib/seo'

export const Route = createFileRoute('/$lang/portfolio/$slug')({
  loader: async ({ context, params }) => {
    const locale = params.lang as 'uk' | 'en' | 'ru'
    const [entry, ui] = await Promise.all([
      context.queryClient.ensureQueryData(contentQueries.portfolioCase(locale, params.slug)),
      context.queryClient.ensureQueryData(contentQueries.ui(locale)),
    ])

    if (!entry) {
      throw notFound()
    }

    return { locale, entry, ui }
  },
  head: ({ loaderData }) =>
    loaderData
      ? buildSeoHead({
          locale: loaderData.locale,
          pathname: buildLocalePath(loaderData.locale, `/portfolio/${loaderData.entry.slug}`),
          metadata: loaderData.entry.seo,
        })
      : {},
  component: PortfolioCasePage,
})

function PortfolioCasePage() {
  const { locale, entry, ui } = Route.useLoaderData()

  return <PortfolioCaseStory entry={entry} locale={locale} ui={ui} />
}
