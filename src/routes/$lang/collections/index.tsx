import { createFileRoute } from '@tanstack/react-router'
import { CollectionLookbookRows, ListingRhythm } from '~/components/editorial'
import { buildLocalePath } from '~/lib/i18n'
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
    <ListingRhythm
      pageKey="collections"
      page={page}
      locale={locale}
      ui={ui}
      navLabel={ui.nav.collections}
      image={heroImage}
    >
      <CollectionLookbookRows collections={collections} locale={locale} ui={ui} />
    </ListingRhythm>
  )
}
