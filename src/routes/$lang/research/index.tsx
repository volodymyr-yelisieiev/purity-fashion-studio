import { createFileRoute } from '@tanstack/react-router'
import { ListingRhythm, ServiceRowsSection } from '~/components/editorial'
import { buildLocalePath } from '~/lib/i18n'
import { contentQueries } from '~/lib/query'
import { buildSeoHead } from '~/lib/seo'

export const Route = createFileRoute('/$lang/research/')({
  loader: async ({ context, params }) => {
    const locale = params.lang as 'uk' | 'en' | 'ru'
    const [page, services, ui] = await Promise.all([
      context.queryClient.ensureQueryData(contentQueries.researchPage(locale)),
      context.queryClient.ensureQueryData(contentQueries.services(locale, 'research')),
      context.queryClient.ensureQueryData(contentQueries.ui(locale)),
    ])
    return { locale, page, services, ui }
  },
  head: ({ loaderData }) =>
    loaderData
      ? buildSeoHead({
          locale: loaderData.locale,
          pathname: buildLocalePath(loaderData.locale, '/research'),
          metadata: loaderData.page.seo,
        })
      : {},
  component: ResearchIndexPage,
})

function ResearchIndexPage() {
  const { locale, page, services, ui } = Route.useLoaderData()
  const heroImage = page.seo.image

  return (
    <ListingRhythm
      page={page}
      locale={locale}
      ui={ui}
      navLabel={ui.nav.research}
      image={heroImage}
      processItems={services.flatMap((service) => service.process)}
    >
      <ServiceRowsSection
        title={page.title}
        subtitle={page.intro}
        services={services}
        locale={locale}
        cta={ui.actions.buyService}
        eyebrow={ui.labels.pricing}
      />
    </ListingRhythm>
  )
}
