import { createFileRoute } from '@tanstack/react-router'
import { CourseRows, ListingRhythm } from '~/components/editorial'
import { buildLocalePath } from '~/lib/i18n'
import { contentQueries } from '~/lib/query'
import { buildSeoHead } from '~/lib/seo'

export const Route = createFileRoute('/$lang/school')({
  loader: async ({ context, params }) => {
    const locale = params.lang as 'uk' | 'en' | 'ru'
    const [page, courses, ui] = await Promise.all([
      context.queryClient.ensureQueryData(contentQueries.schoolPage(locale)),
      context.queryClient.ensureQueryData(contentQueries.courses(locale)),
      context.queryClient.ensureQueryData(contentQueries.ui(locale)),
    ])
    return { locale, page, courses, ui }
  },
  head: ({ loaderData }) =>
    loaderData
      ? buildSeoHead({
          locale: loaderData.locale,
          pathname: buildLocalePath(loaderData.locale, '/school'),
          metadata: loaderData.page.seo,
        })
      : {},
  component: SchoolPage,
})

function SchoolPage() {
  const { locale, page, courses, ui } = Route.useLoaderData()
  const heroImage = page.seo.image

  return (
    <ListingRhythm
      page={{ ...page, pullQuote: page.note }}
      locale={locale}
      ui={ui}
      navLabel={ui.nav.school}
      image={heroImage}
      processItems={courses.flatMap((course) => course.details)}
    >
      <CourseRows courses={courses} locale={locale} ui={ui} />
    </ListingRhythm>
  )
}
