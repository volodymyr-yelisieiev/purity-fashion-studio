import { createFileRoute, notFound } from '@tanstack/react-router'
import { CollectionGallery } from '~/components/editorial'
import { buildLocalePath } from '~/lib/i18n'
import { contentQueries } from '~/lib/query'
import { buildSeoHead } from '~/lib/seo'

export const Route = createFileRoute('/$lang/collections/$slug')({
  loader: async ({ context, params }) => {
    const locale = params.lang as 'uk' | 'en' | 'ru'
    const [collection, ui] = await Promise.all([
      context.queryClient.ensureQueryData(contentQueries.collection(locale, params.slug)),
      context.queryClient.ensureQueryData(contentQueries.ui(locale)),
    ])

    if (!collection) {
      throw notFound()
    }

    return { locale, collection, ui }
  },
  head: ({ loaderData }) =>
    loaderData
      ? buildSeoHead({
          locale: loaderData.locale,
          pathname: buildLocalePath(loaderData.locale, `/collections/${loaderData.collection.slug}`),
          metadata: loaderData.collection.seo,
        })
      : {},
  component: CollectionDetailPage,
})

function CollectionDetailPage() {
  const { locale, collection, ui } = Route.useLoaderData()

  return <CollectionGallery collection={collection} locale={locale} ui={ui} />
}
