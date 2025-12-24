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
  const t = await getTranslations({ locale, namespace: 'realisation' })
  
  return generateSeoMetadata({
    title: t('meta.title'),
    description: t('meta.description'),
    path: '/realisation',
  })
}

/**
 * Realisation Page
 * 
 * Second stage of the PURITY transformation methodology.
 * Shows shopping services and atelier services.
 */
export default async function RealisationPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'realisation' })
  const tPages = await getTranslations({ locale, namespace: 'pages' })
  const tCommon = await getTranslations({ locale, namespace: 'common' })

  // Fetch all services
  let servicesResult
  try {
    servicesResult = await getServices(locale as Locale)
  } catch (err) {
    console.error('RealisationPage: failed to fetch services —', err)
    servicesResult = { docs: [] }
  }
  
  // Filter for realisation-related services (Shopping Service, Atelier Service)
  const realisationServices = (servicesResult.docs || []).filter(
    (service: Service) => service.category === 'realisation'
  )

  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero Section */}
      <HeroSection
        title={tPages('realisation.title')}
        subtitle={tPages('realisation.subtitle')}
        backgroundImage="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1920&h=1080&fit=crop&q=85"
      />

      {/* 2. FROM VISION TO REALITY - White background */}
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

      {/* 3. REALISATION SERVICES - Gray background */}
      <Section spacing="lg" variant="muted">
        <Container>
          <SectionTitle 
            title={t('shopping.title')} 
            subtitle={t('shopping.subtitle')} 
          />
          
          {realisationServices.length > 0 ? (
            <FadeInStaggerContainer>
              <Grid cols={2} gap="md">
                {realisationServices.map((service: Service) => {
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
            </div>
          )}
        </Container>
      </Section>

      {/* 4. THE ATELIER PROCESS - White background */}
      <Section spacing="lg">
        <Container size="md">
          <SectionTitle 
            title={t('process.title')} 
            subtitle={t('process.subtitle')} 
          />
          
          <div className="relative">
            {/* Process Timeline */}
            <div className="hidden md:absolute md:left-1/2 md:top-0 md:h-full md:w-px md:-translate-x-1/2 md:bg-border md:block" />
            
            <FadeInStaggerContainer className="space-y-12">
              {[1, 2, 3, 4, 5].map((step) => (
                <FadeInStagger key={step}>
                  <div 
                    className={`flex flex-col md:flex-row ${step % 2 === 0 ? 'md:flex-row-reverse' : ''} items-center gap-8`}
                  >
                    <div className={`flex-1 ${step % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                      <h3 className="font-serif text-xl font-light mb-2">
                        {t(`process.step${step}.title`)}
                      </h3>
                      <Paragraph>
                        {t(`process.step${step}.description`)}
                      </Paragraph>
                    </div>
                    
                    <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-sm font-medium">
                      {String(step).padStart(2, '0')}
                    </div>
                    
                    <div className="flex-1" />
                  </div>
                </FadeInStagger>
              ))}
            </FadeInStaggerContainer>
          </div>
        </Container>
      </Section>

      {/* 5. CTA SECTION - Gray background */}
      <CTASection
        title={t('cta.title')}
        description={t('cta.description')}
        ctaText={t('cta.button')}
        ctaLink="/transformation"
        variant="muted"
      />
    </div>
  )
}
