import { getTranslations } from 'next-intl/server'
import { getServices, type Locale } from '@/lib/payload'
import { generateSeoMetadata } from '@/lib/seo'
import { Container, Section, SectionTitle, Paragraph, Grid, ContentCard } from '@/components/ui'
import { HeroSection, CTASection } from '@/components/sections'
import { FadeInStagger, FadeInStaggerContainer } from '@/components/animations/FadeInStagger'
import type { Metadata } from 'next'
import type { Service, Media } from '@/payload-types'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'research' })
  
  return generateSeoMetadata({
    title: t('meta.title'),
    description: t('meta.description'),
    path: '/research',
  })
}

/**
 * Research Page
 * 
 * First stage of the PURITY transformation methodology.
 * Shows color analysis, silhouette strategy, and wardrobe review services.
 */
export default async function ResearchPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'research' })
  const tPages = await getTranslations({ locale, namespace: 'pages' })
  const tCommon = await getTranslations({ locale, namespace: 'common' })

  // Fetch research-category services
  const servicesResult = await getServices(locale as Locale)
  
  // Filter for research-related services (Personal Lookbook, Wardrobe Audit)
  const researchServices = servicesResult.docs.filter(
    (service: Service) => service.category === 'research'
  )

  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero Section */}
      <HeroSection
        title={tPages('research.title')}
        subtitle={tPages('research.subtitle')}
        backgroundImage="https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=1920&h=1080&fit=crop&q=85"
      />

      {/* 2. WHY SECTION - White background */}
      <Section spacing="lg">
        <Container size="md">
          <FadeInStaggerContainer className="mx-auto max-w-3xl text-center">
            <FadeInStagger>
              <SectionTitle 
                title={t('intro.title')} 
                subtitle={t('intro.subtitle')} 
              />
            </FadeInStagger>
            <FadeInStagger className="space-y-6">
              <Paragraph className="text-lg leading-relaxed">
                {t('intro.paragraph1')}
              </Paragraph>
              <Paragraph className="text-lg leading-relaxed">
                {t('intro.paragraph2')}
              </Paragraph>
            </FadeInStagger>
          </FadeInStaggerContainer>
        </Container>
      </Section>

      {/* 3. RESEARCH PROCESS - Gray background */}
      <Section spacing="lg" variant="muted">
        <Container size="md">
          <SectionTitle 
            title={t('process.title')} 
            subtitle={t('process.subtitle')} 
          />
          
          <FadeInStaggerContainer className="grid gap-8 md:grid-cols-3">
            {[1, 2, 3].map((step) => (
              <FadeInStagger key={step}>
                <div className="text-center">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full border border-border text-lg font-light">
                    {String(step).padStart(2, '0')}
                  </div>
                  <h3 className="font-serif text-xl font-light mb-2">
                    {t(`process.step${step}.title`)}
                  </h3>
                  <Paragraph>
                    {t(`process.step${step}.description`)}
                  </Paragraph>
                </div>
              </FadeInStagger>
            ))}
          </FadeInStaggerContainer>
        </Container>
      </Section>

      {/* 4. RESEARCH SERVICES - White background */}
      <Section spacing="lg">
        <Container>
          <SectionTitle 
            title={t('services.title')} 
            subtitle={t('services.subtitle')} 
          />
          
          {researchServices.length > 0 ? (
            <FadeInStaggerContainer>
              <Grid cols={2} gap="md">
                {researchServices.map((service: Service) => {
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

      {/* 5. CTA SECTION - Gray background */}
      <CTASection
        title={t('cta.title')}
        description={t('cta.description')}
        ctaText={t('cta.button')}
        ctaLink="/realisation"
        variant="muted"
      />
    </div>
  )
}
