import { createFileRoute, redirect } from '@tanstack/react-router'
import { SiteShell } from '~/components/site-shell'
import { assertLocale } from '~/lib/i18n'
import { contentQueries } from '~/lib/query'

export const Route = createFileRoute('/$lang')({
  loader: async ({ context, params }) => {
    const locale = assertLocale(params.lang)

    if (params.lang !== locale) {
      throw redirect({
        to: '/$lang',
        params: { lang: locale },
      })
    }

    const [ui, settings] = await Promise.all([
      context.queryClient.ensureQueryData(contentQueries.ui(locale)),
      context.queryClient.ensureQueryData(contentQueries.studioSettings(locale)),
    ])

    return {
      locale,
      ui,
      settings,
    }
  },
  component: LangLayout,
})

function LangLayout() {
  const { locale, ui, settings } = Route.useLoaderData()

  return <SiteShell locale={locale} ui={ui} settings={settings} />
}
