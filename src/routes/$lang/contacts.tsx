import { createFileRoute } from '@tanstack/react-router'
import { CompactIntro, ContactsLayout } from '~/components/site-shell'
import { buildLocalePath } from '~/lib/i18n'
import { contentQueries } from '~/lib/query'
import { buildSeoHead } from '~/lib/seo'

export const Route = createFileRoute('/$lang/contacts')({
  loader: async ({ context, params }) => {
    const locale = params.lang as 'uk' | 'en' | 'ru'
    const [page, ui, settings] = await Promise.all([
      context.queryClient.ensureQueryData(contentQueries.contactsPage(locale)),
      context.queryClient.ensureQueryData(contentQueries.ui(locale)),
      context.queryClient.ensureQueryData(contentQueries.studioSettings(locale)),
    ])
    return { locale, page, ui, settings }
  },
  head: ({ loaderData }) =>
    loaderData
      ? buildSeoHead({
          locale: loaderData.locale,
          pathname: buildLocalePath(loaderData.locale, '/contacts'),
          metadata: loaderData.page.seo,
        })
      : {},
  component: ContactsPage,
})

function ContactsPage() {
  const { locale, page, ui, settings } = Route.useLoaderData()

  return (
    <>
      <CompactIntro
        eyebrow={`PURITY / ${ui.nav.contacts}`}
        title={page.title}
        text={page.intro}
        asideEyebrow={ui.labels.client}
        asideTitle={page.corporateTitle}
        asideText={page.corporateText}
        chips={[
          ui.labels.conciergeFollowUp,
          ui.labels.privateInquiries,
          ui.labels.corporateBriefs,
        ]}
        imageSrc="/images/purity_2.jpg"
        imageAlt={page.title}
      />
      <ContactsLayout page={page} settings={settings} locale={locale} ui={ui} />
    </>
  )
}
