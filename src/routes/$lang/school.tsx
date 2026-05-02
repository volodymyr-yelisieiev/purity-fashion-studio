import { createFileRoute } from '@tanstack/react-router'
import { CourseRows, ListingRhythm, Section, SectionHead } from '~/components/editorial'
import { buildLocalePath } from '~/lib/i18n'
import { listingProcessMedia, plannedImageAt } from '~/lib/media-plan'
import { optimizedImageSrc } from '~/lib/media-refs'
import { contentQueries } from '~/lib/query'
import { buildSeoHead } from '~/lib/seo'
import type { Locale } from '~/lib/types'

const schoolAudienceCopy: Record<
  Locale,
  {
    eyebrow: string
    title: string
    subtitle: string
    items: ReadonlyArray<{ title: string; text: string }>
  }
> = {
  uk: {
    eyebrow: 'Для кого',
    title: 'Для тих, хто хоче мислити одягом',
    subtitle: 'Курси працюють для дизайнерів, стилістів і приватних клієнтів, яким потрібна практична система форми.',
    items: [
      {
        title: 'Дизайнери / стилісти',
        text: 'Для тих, хто хоче працювати з тканиною напряму, а не тільки з референсом.',
      },
      {
        title: 'Приватний гардероб',
        text: 'Для клієнток, яким важливо розуміти власний силует, посадку й логіку речей.',
      },
      {
        title: 'Команди / автори',
        text: 'Для тих, хто збирає виріб, капсулу чи wardrobe-system до завершеного результату.',
      },
    ],
  },
  en: {
    eyebrow: 'For whom',
    title: 'For people who want to think through clothes',
    subtitle: 'The courses work for designers, stylists, and private clients who need a practical system of form.',
    items: [
      {
        title: 'Designers / stylists',
        text: 'For those who want to work directly with fabric, not only with references.',
      },
      {
        title: 'Private wardrobe',
        text: 'For clients who want to understand their own silhouette, fit, and garment logic.',
      },
      {
        title: 'Teams / authors',
        text: 'For people assembling a garment, capsule, or wardrobe-system into a finished result.',
      },
    ],
  },
  ru: {
    eyebrow: 'Для кого',
    title: 'Для тех, кто хочет мыслить одеждой',
    subtitle: 'Курсы работают для дизайнеров, стилистов и частных клиентов, которым нужна практическая система формы.',
    items: [
      {
        title: 'Дизайнеры / стилисты',
        text: 'Для тех, кто хочет работать с тканью напрямую, а не только с референсом.',
      },
      {
        title: 'Частный гардероб',
        text: 'Для клиенток, которым важно понимать собственный силуэт, посадку и логику вещей.',
      },
      {
        title: 'Команды / авторы',
        text: 'Для тех, кто собирает изделие, капсулу или wardrobe-system до завершенного результата.',
      },
    ],
  },
}

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
  const audience = schoolAudienceCopy[locale]

  return (
    <ListingRhythm
      pageKey="school"
      page={{ ...page, pullQuote: page.note }}
      locale={locale}
      ui={ui}
      navLabel={ui.nav.school}
      image={heroImage}
    >
      <Section>
        <SectionHead eyebrow={audience.eyebrow} title={audience.title} subtitle={audience.subtitle} />
        <div className="method-band">
          {audience.items.map((item, index) => {
            const media = plannedImageAt(listingProcessMedia.school, index, heroImage)

            return (
              <article key={item.title} className="method-column">
                <img src={optimizedImageSrc(media.src)} alt={media.alt} loading="lazy" decoding="async" />
                <div className="method-column-content">
                  <span className="list-index">{String(index + 1).padStart(2, '0')}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </article>
            )
          })}
        </div>
      </Section>
      <CourseRows courses={courses} locale={locale} ui={ui} />
    </ListingRhythm>
  )
}
