import { createFileRoute } from '@tanstack/react-router'
import { CourseGrid, StandardListingPage } from '~/components/site-shell'
import { buildLocalePath } from '~/lib/i18n'
import { courseCoverAsset, processImageRefs } from '~/lib/media-refs'
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
  const heroImage = courseCoverAsset(courses[0]) ?? page.seo.image

  return (
    <StandardListingPage
      hero={{
        eyebrow: `PURITY / ${ui.nav.school}`,
        title: page.title,
        text: page.intro,
        emphasis: 'grand',
        imageSrc: heroImage.src,
        imageAlt: heroImage.alt,
        caption: page.seo.image.caption,
      }}
      quoteTitle={ui.labels.schoolNote}
      quoteText={page.note}
      process={{
        eyebrow: ui.labels.schoolNote,
        title: page.pullQuote,
        text: page.intro,
        items: courses.flatMap((course) => course.details).slice(0, 3),
        images: processImageRefs(page.seo.image, ...courses.map((course) => courseCoverAsset(course))).slice(0, 3),
      }}
    >
      <CourseGrid courses={courses} locale={locale} cta={ui.actions.bookNow} />
    </StandardListingPage>
  )
}
