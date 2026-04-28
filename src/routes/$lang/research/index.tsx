import { createFileRoute } from '@tanstack/react-router'
import { OfferGrid, ServiceCard, StandardListingPage } from '~/components/site-shell'
import { buildLocalePath } from '~/lib/i18n'
import { processImageRefs } from '~/lib/media-refs'
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
  const heroImage = services[0]?.media ?? page.seo.image

  return (
    <StandardListingPage
      hero={{
        eyebrow: `PURITY / ${ui.nav.research}`,
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
        eyebrow: ui.labels.methodology,
        title: page.pullQuote,
        text: page.intro,
        items: services.flatMap((service) => service.process).slice(0, 3),
        images: processImageRefs(page.seo.image, ...services.map((service) => service.media)).slice(0, 3),
      }}
    >
      <OfferGrid title={page.title} subtitle={page.intro}>
        {services.map((service) => (
          <ServiceCard
            key={service.slug}
            item={service}
            locale={locale}
            cta={ui.actions.buyService}
            pricingLabel={ui.labels.pricing}
          />
        ))}
      </OfferGrid>
    </StandardListingPage>
  )
}
