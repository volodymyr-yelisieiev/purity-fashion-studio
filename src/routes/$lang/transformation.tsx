import { createFileRoute } from '@tanstack/react-router'
import { ListingRhythm, TransformationRows } from '~/components/editorial'
import { buildLocalePath } from '~/lib/i18n'
import { contentQueries } from '~/lib/query'
import { buildSeoHead } from '~/lib/seo'

export const Route = createFileRoute('/$lang/transformation')({
  loader: async ({ context, params }) => {
    const locale = params.lang as 'uk' | 'en' | 'ru'
    const [page, offers, ui] = await Promise.all([
      context.queryClient.ensureQueryData(contentQueries.transformationPage(locale)),
      context.queryClient.ensureQueryData(contentQueries.transformations(locale)),
      context.queryClient.ensureQueryData(contentQueries.ui(locale)),
    ])
    return { locale, page, offers, ui }
  },
  head: ({ loaderData }) =>
    loaderData
      ? buildSeoHead({
          locale: loaderData.locale,
          pathname: buildLocalePath(loaderData.locale, '/transformation'),
          metadata: loaderData.page.seo,
        })
      : {},
  component: TransformationPage,
})

function TransformationPage() {
  const { locale, page, offers, ui } = Route.useLoaderData()
  const heroImage = page.seo.image

  return (
    <ListingRhythm
      page={page}
      locale={locale}
      ui={ui}
      navLabel={ui.nav.transformation}
      image={heroImage}
      processItems={offers.map((offer) => `${offer.format}: ${offer.summary}`)}
    >
      <TransformationRows offers={offers} locale={locale} />
    </ListingRhythm>
  )
}
