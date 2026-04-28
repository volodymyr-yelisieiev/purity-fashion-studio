import { createFileRoute, notFound } from '@tanstack/react-router'
import { DetailHero, DetailSections, QuoteBand } from '~/components/site-shell'
import { buildLocalePath } from '~/lib/i18n'
import { contentQueries } from '~/lib/query'
import { buildSeoHead } from '~/lib/seo'

export const Route = createFileRoute('/$lang/realisation/$slug')({
  loader: async ({ context, params }) => {
    const locale = params.lang as 'uk' | 'en' | 'ru'
    const [service, ui] = await Promise.all([
      context.queryClient.ensureQueryData(
        contentQueries.service(locale, 'realisation', params.slug),
      ),
      context.queryClient.ensureQueryData(contentQueries.ui(locale)),
    ])

    if (!service) {
      throw notFound()
    }

    return { locale, service, ui }
  },
  head: ({ loaderData }) =>
    loaderData
      ? buildSeoHead({
          locale: loaderData.locale,
          pathname: buildLocalePath(loaderData.locale, `/realisation/${loaderData.service.slug}`),
          metadata: loaderData.service.seo,
        })
      : {},
  component: RealisationDetailPage,
})

function RealisationDetailPage() {
  const { locale, service, ui } = Route.useLoaderData()

  return (
    <>
      <DetailHero
        eyebrow={service.eyebrow}
        title={service.title}
        summary={service.summary}
        price={service.price}
        duration={service.duration}
        leadTime={service.leadTime}
        locale={locale}
        bookingLabel={ui.actions.bookNow}
        area="realisation"
        slug={service.slug}
        media={service.media}
        labels={{ timing: ui.labels.timing, pricing: ui.labels.pricing }}
      />
      <DetailSections
        formats={service.formats}
        deliverables={service.deliverables}
        process={service.process}
        notes={service.notes}
        labels={{
          serviceStructure: ui.labels.serviceStructure,
          serviceStructureTitle: ui.labels.serviceStructureTitle,
          formats: ui.labels.formats,
          deliverables: ui.labels.deliverables,
          process: ui.labels.process,
          notes: ui.labels.notes,
        }}
      />
      <QuoteBand title={ui.labels.atelierMood} text={service.visualMood} compact />
    </>
  )
}
