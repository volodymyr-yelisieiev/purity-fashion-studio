import { createFileRoute } from '@tanstack/react-router'
import { CollectionCard, OfferGrid, StandardListingPage } from '~/components/site-shell'
import { buildLocalePath } from '~/lib/i18n'
import { listingPreviewMedia, plannedImageAt } from '~/lib/media-plan'
import { contentQueries } from '~/lib/query'
import { buildSeoHead } from '~/lib/seo'

export const Route = createFileRoute('/$lang/collections/')({
  loader: async ({ context, params }) => {
    const locale = params.lang as 'uk' | 'en' | 'ru'
    const [page, collections, ui] = await Promise.all([
      context.queryClient.ensureQueryData(contentQueries.collectionsPage(locale)),
      context.queryClient.ensureQueryData(contentQueries.collections(locale)),
      context.queryClient.ensureQueryData(contentQueries.ui(locale)),
    ])
    return { locale, page, collections, ui }
  },
  head: ({ loaderData }) =>
    loaderData
      ? buildSeoHead({
          locale: loaderData.locale,
          pathname: buildLocalePath(loaderData.locale, '/collections'),
          metadata: loaderData.page.seo,
        })
      : {},
  component: CollectionsPage,
})

function CollectionsPage() {
  const { locale, page, collections, ui } = Route.useLoaderData()
  const heroImage = page.seo.image

  return (
    <StandardListingPage
      hero={{
        eyebrow: `PURITY / ${ui.nav.collections}`,
        title: page.title,
        text: page.intro,
        emphasis: 'grand',
        imageSrc: heroImage.src,
        imageAlt: heroImage.alt,
        caption: page.seo.image.caption,
      }}
      quoteTitle={ui.labels.collections}
      quoteText={page.pullQuote}
      preview={{
        eyebrow: ui.labels.collectionStory,
        title: page.pullQuote,
        items: collections.slice(0, 3).map((collection, index) => {
          const media = plannedImageAt(listingPreviewMedia.collections, index, collection.heroMedia)

          return {
            title: collection.title,
            subtitle: collection.priceNote,
            imageSrc: media.src,
            imageAlt: media.alt,
            to: buildLocalePath(locale, `/collections/${collection.slug}`),
          }
        }),
      }}
    >
      <OfferGrid title={page.title} subtitle={page.intro}>
        {collections.map((collection) => (
          <CollectionCard
            key={collection.slug}
            item={collection}
            locale={locale}
            cta={ui.actions.viewCollection}
            label={ui.labels.collection}
          />
        ))}
      </OfferGrid>
    </StandardListingPage>
  )
}
