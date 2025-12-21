import { getPayload } from '@/lib/payload'
import { HeroSection } from '@/components/sections'
import { EmptyState, H3, Paragraph, Container } from '@/components/ui'
import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'
import { hasContent } from '@/lib/utils'
import Image from 'next/image'
import type { Media } from '@/payload-types'

export default async function SchoolPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'school' })
  
  const payload = await getPayload()
  const { docs: courses } = await payload.find({
    collection: 'courses',
    locale: locale as 'en' | 'uk' | 'ru',
    fallbackLocale: false,
    where: { status: { equals: 'published' } },
    sort: '-createdAt',
    limit: 100,
  })

  // Filter out items without content in current locale
  const filteredCourses = courses.filter(course => hasContent(course.title))
  
  return (
    <>
      <HeroSection
        title={t('hero.title')}
        subtitle={t('hero.description')}
      />
      
      <section className="bg-background">
        <Container>
          {filteredCourses.length === 0 ? (
            <EmptyState
              title={t('empty.title')}
              description={t('empty.description')}
              action={{
                label: t('empty.backHome'),
                href: '/'
              }}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course) => {
                 const coverImage = course.featuredImage as Media | undefined
                 const price = course.price as { amount: number; currency: string } | undefined

                 return (
                  <Link
                    key={course.id}
                    href={`/school/${course.slug}`}
                    className="group cursor-pointer block"
                  >
                    <div className="space-y-4">
                      {coverImage?.url && (
                        <div className="relative aspect-4/3 overflow-hidden bg-muted">
                          <Image
                            src={coverImage.url}
                            alt={course.title}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                          />
                        </div>
                      )}
                      <H3 className="group-hover:text-foreground/70 transition-colors">
                        {course.title}
                      </H3>
                      {course.excerpt && (
                        <Paragraph className="line-clamp-2 text-muted-foreground">
                          {course.excerpt}
                        </Paragraph>
                      )}
                      {price && (
                        <p className="text-sm font-semibold">
                          {price.amount} {price.currency}
                        </p>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </Container>
      </section>
    </>
  )
}
