import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { generateSeoMetadata } from '@/lib/seo'
import type { Metadata } from 'next'
import { getAvailableLocales, getPayload, getServiceBySlug, type Locale } from '@/lib/payload'
import { draftMode } from 'next/headers'
import { LanguageFallback, Button } from '@/components/ui'
import { HeroSection } from '@/components/sections'
import { FadeInStagger, FadeInStaggerContainer } from '@/components/animations/FadeInStagger'
import { formatPrice } from '@/lib/utils'

interface PageProps {
  params: Promise<{ slug: string; locale: string }>
}

export async function generateStaticParams() {
  const payload = await getPayload()
  
  let services
  try {
    services = await payload.find({
      collection: 'services',
      limit: 100,
      where: {
        status: { equals: 'published' },
      },
    })
  } catch (err) {
    console.error('generateStaticParams: failed to fetch services —', err)
    return []
  }
  
  const locales = ['en', 'uk', 'ru']
  
  return services.docs
    .filter((service) => service.slug)
    .flatMap((service) =>
      locales.map((locale) => ({
        locale,
        slug: service.slug,
      }))
    )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, locale } = await params
  const { isEnabled: isDraft } = await draftMode()
  const t = await getTranslations({ locale, namespace: 'services' })
  const service = await getServiceBySlug(slug, locale as Locale, isDraft)

  if (!service) {
    const availableLocales = await getAvailableLocales('services', slug, isDraft)
    const title = availableLocales.length > 0 ? t('notAvailable') : t('serviceNotFound')
    return generateSeoMetadata({
      title: `${title} | PURITY Fashion Studio`,
      description: t('serviceNotFoundDescription'),
      locale,
    })
  }

  return generateSeoMetadata({
    title: service.meta?.title || `${service.title} | PURITY Fashion Studio`,
    description: service.meta?.description || service.excerpt || service.description || '',
    path: `/services/${slug}`,
    image: typeof service.meta?.image === 'object' ? service.meta?.image?.url || undefined : undefined,
    locale,
  })
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug, locale } = await params
  const { isEnabled: isDraft } = await draftMode()
  const t = await getTranslations({ locale, namespace: 'services' })
  const tCommon = await getTranslations({ locale, namespace: 'common' })

  const service = await getServiceBySlug(slug, locale as Locale, isDraft)

  if (!service) {
    const availableLocales = await getAvailableLocales('services', slug, isDraft)
    if (availableLocales.length > 0) {
      return (
        <LanguageFallback
          title={t('notAvailable')}
          description={tCommon('viewInAvailableLanguages')}
          availableLocales={availableLocales}
          currentSlug={slug}
          basePath="/services"
          backLink={{ href: '/services', label: t('backToServices') }}
        />
      )
    }
    notFound()
  }

  // Format prices
  const priceUAH = service.pricing?.uah
  const priceEUR = service.pricing?.eur
  const priceNote = service.pricing?.priceNote
  
  const prices = []
  if (priceUAH) prices.push(formatPrice(priceUAH, 'UAH'))
  if (priceEUR) prices.push(formatPrice(priceEUR, 'EUR'))
  
  const priceDisplay = prices.length > 0 ? prices.join(' / ') : t('priceOnRequest')

  return (
    <main className="min-h-screen bg-background">
      {/* Hero - Full Width */}
      <HeroSection
        title={service.title}
        subtitle={service.excerpt || ''}
        backgroundImage={typeof service.heroImage === 'object' ? service.heroImage?.url || '' : ''}
      />
      
      {/* Overview Section - White BG - CENTERED */}
      <section className="py-20 md:py-24 bg-white">
        <div className="container px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <FadeInStaggerContainer>
              <FadeInStagger>
                <h2 className="text-3xl md:text-4xl font-serif mb-8">{tCommon('overview')}</h2>
              </FadeInStagger>
              <FadeInStagger>
                <div className="prose prose-lg max-w-none text-foreground leading-relaxed whitespace-pre-wrap">
                  {service.description}
                </div>
              </FadeInStagger>
            </FadeInStaggerContainer>
          </div>
        </div>
      </section>
      
      {/* Details Grid - Gray BG - CENTERED */}
      <section className="py-20 md:py-24 bg-neutral-50">
        <div className="container px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12">
              {/* Duration */}
              {service.duration && (
                <FadeInStaggerContainer>
                  <FadeInStagger>
                    <h3 className="text-xs md:text-sm uppercase tracking-widest text-muted-foreground mb-3">
                      {t('duration')}
                    </h3>
                    <p className="text-lg md:text-xl font-light">{service.duration}</p>
                  </FadeInStagger>
                </FadeInStaggerContainer>
              )}
              
              {/* Format */}
              {service.format && (
                <FadeInStaggerContainer>
                  <FadeInStagger>
                    <h3 className="text-xs md:text-sm uppercase tracking-widest text-muted-foreground mb-3">
                      {t('format')}
                    </h3>
                    <p className="text-lg md:text-xl font-light">
                      {t(`formats.${service.format}`)}
                    </p>
                  </FadeInStagger>
                </FadeInStaggerContainer>
              )}
              
              {/* Price */}
              {(priceUAH || priceEUR) && (
                <FadeInStaggerContainer>
                  <FadeInStagger>
                    <h3 className="text-xs md:text-sm uppercase tracking-widest text-muted-foreground mb-3">
                      {t('price')}
                    </h3>
                    <p className="text-lg md:text-xl font-light">
                      {priceDisplay}
                    </p>
                    {priceNote && (
                      <p className="text-sm text-muted-foreground italic mt-1">{priceNote}</p>
                    )}
                  </FadeInStagger>
                </FadeInStaggerContainer>
              )}
              
              {/* Category */}
              {service.category && (
                <FadeInStaggerContainer>
                  <FadeInStagger>
                    <h3 className="text-xs md:text-sm uppercase tracking-widest text-muted-foreground mb-3">
                      {t('category')}
                    </h3>
                    <p className="text-lg md:text-xl font-light capitalize">
                      {t(`categories.${service.category}`)}
                    </p>
                  </FadeInStagger>
                </FadeInStaggerContainer>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* What's Included - White BG - CENTERED */}
      {service.includes && service.includes.length > 0 && (
        <section className="py-20 md:py-24 bg-white">
          <div className="container px-4 md:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
            <FadeInStaggerContainer>
              <FadeInStagger>
                <h2 className="text-3xl md:text-4xl font-serif mb-12">{tCommon('whatsIncluded')}</h2>
              </FadeInStagger>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {service.includes.map((item, i) => (
                  <FadeInStagger key={i}>
                    <div className="flex items-start gap-4">
                      <svg className="w-5 h-5 md:w-6 md:h-6 text-foreground shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-base md:text-lg font-light">{item.item}</span>
                    </div>
                  </FadeInStagger>
                ))}
              </div>
            </FadeInStaggerContainer>
            </div>
          </div>
        </section>
      )}
      
      {/* Process/Steps - Gray BG - CENTERED */}
      {service.steps && service.steps.length > 0 && (
        <section className="py-20 md:py-24 bg-neutral-50">
          <div className="container px-4 md:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
            <FadeInStaggerContainer>
              <FadeInStagger>
                <h2 className="text-3xl md:text-4xl font-serif mb-16">{tCommon('process')}</h2>
              </FadeInStagger>
              <div className="space-y-12 md:space-y-16">
                {service.steps.map((step, i) => (
                  <FadeInStagger key={i}>
                    <div className="flex gap-6 md:gap-12">
                      <div className="text-3xl md:text-4xl font-serif font-light text-neutral-200 shrink-0">
                        {String(i + 1).padStart(2, '0')}
                      </div>
                      <div>
                        <h3 className="text-lg md:text-xl font-medium mb-4">{step.title}</h3>
                        <p className="text-base md:text-lg text-muted-foreground leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  </FadeInStagger>
                ))}
              </div>
            </FadeInStaggerContainer>
            </div>
          </div>
        </section>
      )}
      
      {/* CTA - White BG - CENTERED */}
      <section className="py-24 md:py-32 bg-white">
        <div className="container px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <FadeInStaggerContainer>
              <FadeInStagger>
                <h2 className="text-3xl md:text-4xl font-serif mb-6">{tCommon('readyToStart')}</h2>
              </FadeInStagger>
              <FadeInStagger>
                <p className="text-base md:text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
                  {t('bookConsultationDesc') || 'Book a consultation to learn more about this service and how we can help you.'}
                </p>
              </FadeInStagger>
              <FadeInStagger>
                <Button asChild variant="primary" size="lg">
                  <Link href="/contact">
                    {tCommon('bookConsultation')}
                  </Link>
                </Button>
              </FadeInStagger>
            </FadeInStaggerContainer>
          </div>
        </div>
      </section>
    </main>
  )
}
