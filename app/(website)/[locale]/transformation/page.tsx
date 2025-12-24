import { getPayload } from '@/lib/payload'
import { getServices, type Locale } from '@/lib/payload'
import { generateSeoMetadata } from '@/lib/seo'
import { Container, Section, SectionTitle, Paragraph, EmptyState, Grid, ContentCard } from '@/components/ui'
import { HeroSection } from '@/components/sections'
import { FadeInStagger, FadeInStaggerContainer } from '@/components/animations/FadeInStagger'
import { Link } from '@/i18n/navigation'
import { hasContent } from '@/lib/utils'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import type { Service, Media } from '@/payload-types'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'transformationPage' })
  
  return generateSeoMetadata({
    title: t('meta.title'),
    description: t('meta.description'),
    path: '/transformation',
  })
}

/**
 * Transformation Page
 * 
 * Third stage of the PURITY transformation methodology.
 * Shows courses, retreats, photo meditation, and transformation portfolio.
 */
export default async function TransformationPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'transformationPage' })
  const tPages = await getTranslations({ locale, namespace: 'pages' })
  const tCommon = await getTranslations({ locale, namespace: 'common' })

  const payload = await getPayload()

  // Fetch transformation-category services (Photo Meditation, Retreats, etc.)
  const servicesResult = await getServices(locale as Locale)
  const transformationServices = servicesResult.docs.filter(
    (service: Service) => service.category === 'transformation'
  )

  // Fetch courses for transformation section
  const { docs: courses } = await payload.find({
    collection: 'courses',
    locale: locale as 'en' | 'uk' | 'ru',
    fallbackLocale: false,
    where: { status: { equals: 'published' } },
    sort: '-featured,-createdAt',
    limit: 3,
  })

  // Fetch transformation portfolio items (show featured portfolio as examples)
  const { docs: transformations } = await payload.find({
    collection: 'portfolio',
    locale: locale as 'en' | 'uk' | 'ru',
    fallbackLocale: false,
    where: { 
      status: { equals: 'published' }
    },
    sort: '-featured,-createdAt',
    limit: 6,
  })

  // Filter out items without content in current locale
  const filteredTransformations = transformations.filter(item => hasContent(item.title))

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <HeroSection
        title={tPages('transformation.title')}
        subtitle={tPages('transformation.subtitle')}
        backgroundImage="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1920&h=1080&fit=crop&q=85"
      />

      {/* Introduction Section */}
      <Section spacing="lg">
        <Container size="md">
          <FadeInStaggerContainer className="mx-auto max-w-3xl text-center">
            <FadeInStagger>
              <SectionTitle 
                title={t('intro.title')} 
                subtitle={t('intro.subtitle')} 
              />
            </FadeInStagger>
            <FadeInStagger>
              <Paragraph className="text-lg leading-relaxed">
                {t('intro.paragraph1')}
              </Paragraph>
            </FadeInStagger>
          </FadeInStaggerContainer>
        </Container>
      </Section>

      {/* Programs/Services Grid */}
      <Section spacing="lg" variant="muted">
        <Container>
          <SectionTitle 
            title={t('programs.title')} 
            subtitle={t('programs.subtitle')} 
          />
          
          {(transformationServices.length > 0 || courses.length > 0) ? (
            <FadeInStaggerContainer>
              <Grid cols={3} gap="md">
                {/* Services */}
                {transformationServices.map((service: Service) => {
                  const heroImage = typeof service.heroImage === 'object' ? (service.heroImage as Media | null) : null
                  return (
                    <FadeInStagger key={service.id}>
                      <ContentCard
                        title={service.title}
                        description={service.excerpt}
                        image={heroImage?.url ? { url: heroImage.url, alt: heroImage.alt || service.title } : undefined}
                        price={{
                          eur: service.pricing?.eur,
                          uah: service.pricing?.uah,
                          note: service.pricing?.priceNote
                        }}
                        metadata={[
                          ...(service.duration ? [{ label: tCommon('duration') || 'Duration', value: service.duration }] : []),
                          ...(service.format ? [{ label: tCommon('format') || 'Format', value: tCommon(`formats.${service.format}`) }] : [])
                        ]}
                        link={{
                          href: `/services/${service.slug}`,
                          label: tCommon('learnMore')
                        }}
                        variant="service"
                      />
                    </FadeInStagger>
                  )
                })}
                
                {/* Courses */}
                {courses.map((course) => {
                  const coverImage = course.featuredImage as Media | undefined
                  return (
                    <FadeInStagger key={course.id}>
                      <ContentCard
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
                    </FadeInStagger>
                  )
                })}
              </Grid>
            </FadeInStaggerContainer>
          ) : (
            <div className="text-center py-16">
              <Paragraph>{tCommon('noContent')}</Paragraph>
              <Paragraph className="mt-2">{tCommon('checkBackSoon')}</Paragraph>
            </div>
          )}
        </Container>
      </Section>

      {/* Transformation Portfolio */}
      <Section spacing="lg">
        <Container>
          <SectionTitle 
            title={t('portfolio.title')} 
            subtitle={t('portfolio.subtitle')} 
          />
          
          {filteredTransformations.length === 0 ? (
            <EmptyState
              title={t('portfolio.emptyTitle')}
              description={t('portfolio.emptyDescription')}
            />
          ) : (
            <>
              <FadeInStaggerContainer>
                <Grid cols={3} gap="md">
                  {filteredTransformations.map((item) => {
                    const previewImage = item.mainImage as Media | undefined

                    return (
                      <FadeInStagger key={item.id}>
                        <ContentCard
                          title={item.title}
                          description={item.description}
                          category={item.category}
                          image={previewImage?.url ? { url: previewImage.url, alt: previewImage.alt || item.title } : undefined}
                          link={{
                            href: `/portfolio/${item.slug}`,
                            label: tCommon('viewCase')
                          }}
                          variant="portfolio"
                        />
                      </FadeInStagger>
                    )
                  })}
                </Grid>
              </FadeInStaggerContainer>
              
              <div className="mt-12 text-center">
                <Link 
                  href="/portfolio"
                  className="inline-flex items-center gap-2 text-sm font-medium text-foreground border border-foreground px-6 py-3 hover:bg-foreground hover:text-background transition-colors"
                >
                  {tCommon('viewAll')}
                </Link>
              </div>
            </>
          )}
        </Container>
      </Section>
    </div>
  )
}
