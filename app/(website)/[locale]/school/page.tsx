import { getPayload } from '@/lib/payload'
import { HeroSection } from '@/components/sections'
import { EmptyState, Container, Section, Lead, Grid, ContentCard } from '@/components/ui'
import { FadeInStagger, FadeInStaggerContainer } from '@/components/animations/FadeInStagger'
import { getTranslations } from 'next-intl/server'
import { hasContent } from '@/lib/utils'
import type { Media } from '@/payload-types'

export default async function SchoolPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'school' })
  const tPages = await getTranslations({ locale, namespace: 'pages' })
  const tCommon = await getTranslations({ locale, namespace: 'common' })
  
  const payload = await getPayload()
  const { docs: courses } = await payload.find({
    collection: 'courses',
    locale: locale as 'en' | 'uk' | 'ru',
    fallbackLocale: false,
    where: { status: { equals: 'published' } },
    sort: '-featured,-createdAt',
    limit: 100,
  })

  // Filter out items without content in current locale
  const filteredCourses = courses.filter(course => hasContent(course.title))
  
  return (
    <>
      <HeroSection
        title={tPages('school.title')}
        subtitle={tPages('school.subtitle')}
        backgroundImage="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1920&h=1080&fit=crop&q=85"
      />

      {/* Intro Section */}
      <Section spacing="md">
        <Container size="sm" className="text-center">
          <FadeInStaggerContainer>
            <FadeInStagger>
              <Lead className="text-muted-foreground">
                {t('intro') || 'Our courses and programs are designed to help you develop a deep understanding of personal style, color theory, and wardrobe building.'}
              </Lead>
            </FadeInStagger>
          </FadeInStaggerContainer>
        </Container>
      </Section>
      
      {/* Courses Grid */}
      <Section spacing="md" variant="muted">
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
            <Grid cols={3} gap="md">
              {filteredCourses.map((course) => {
                const coverImage = course.featuredImage as Media | undefined

                return (
                  <ContentCard
                    key={course.id}
                    title={course.title}
                    description={course.excerpt}
                    category={course.category?.replace('-', ' ') || 'Course'}
                    image={coverImage?.url ? { url: coverImage.url, alt: coverImage.alt || course.title } : undefined}
                    price={{
                      eur: course.priceEUR || undefined,
                      uah: course.priceUAH || undefined,
                    }}
                    link={{
                      href: `/school/${course.slug}`,
                      label: tCommon('learnMore')
                    }}
                    variant="course"
                  />
                )
              })}
            </Grid>
          )}
        </Container>
      </Section>
    </>
  )
}
