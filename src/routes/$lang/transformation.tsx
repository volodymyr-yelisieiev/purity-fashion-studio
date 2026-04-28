import { createFileRoute } from '@tanstack/react-router'
import { StandardListingPage, TransformationGrid } from '~/components/site-shell'
import { buildLocalePath } from '~/lib/i18n'
import { listingProcessMedia } from '~/lib/media-plan'
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
    <StandardListingPage
      hero={{
        eyebrow: `PURITY / ${ui.nav.transformation}`,
        title: page.title,
        text: page.intro,
        emphasis: 'grand',
        imageSrc: heroImage.src,
        imageAlt: heroImage.alt,
        caption: page.seo.image.caption,
      }}
      quoteTitle={page.title}
      quoteText={page.pullQuote}
      process={{
        eyebrow: ui.labels.approach,
        title: page.pullQuote,
        text: page.intro,
        items: offers.map((offer) => `${offer.format}: ${offer.summary}`).slice(0, 3),
        images: listingProcessMedia.transformation,
      }}
    >
      <TransformationGrid offers={offers} locale={locale} />
    </StandardListingPage>
  )
}
