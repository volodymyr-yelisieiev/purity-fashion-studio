import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { generateSeoMetadata } from '@/lib/seo'
import type { Metadata } from 'next'
import { getAvailableLocales, getPayload, getServiceBySlug, type Locale } from '@/lib/payload'
import { draftMode } from 'next/headers'
import { LanguageFallback } from '@/components/ui/language-fallback'

interface PageProps {
  params: Promise<{ slug: string; locale: string }>
}

export async function generateStaticParams() {
  const payload = await getPayload()
  
  const services = await payload.find({
    collection: 'services',
    limit: 100,
    where: {
      status: { equals: 'published' },
    },
  })
  
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

  const hasContent = (value?: string | null) => Boolean(value && value.toString().trim().length > 0)
  const primaryDescription = service.description || service.excerpt

  if (!hasContent(service.title) || !hasContent(primaryDescription)) {
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

  const hasContent = (value?: string | null) => Boolean(value && value.toString().trim().length > 0)
  const primaryDescription = service.description || service.excerpt

  if (!hasContent(service.title) || !hasContent(primaryDescription)) {
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
  if (priceUAH) prices.push(`${priceUAH} ₴`)
  if (priceEUR) prices.push(`€${priceEUR}`)
  
  const priceDisplay = prices.length > 0 ? prices.join(' / ') : t('priceOnRequest')

  return (
    <main className="min-h-screen bg-background">
      <section className="px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/services"
            className="mb-8 inline-block text-sm uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
          >
            ← {t('backToServices')}
          </Link>

          <span className="mb-4 block text-xs uppercase tracking-widest text-muted-foreground">
            {service.category}
          </span>

          <h1 className="font-serif text-4xl font-light tracking-tight text-foreground md:text-5xl lg:text-6xl">
            {service.title}
          </h1>

          {service.heroImage && typeof service.heroImage === 'object' && service.heroImage.url && (
            <div className="relative mt-10 aspect-4/3 overflow-hidden bg-muted">
              <Image
                src={service.heroImage.url}
                alt={service.heroImage.alt || service.title}
                fill
                className="object-cover"
                sizes="(max-width: 896px) 100vw, 896px"
              />
            </div>
          )}

          <div className="mt-8 flex gap-8 border-b border-border pb-8">
            <div>
              <span className="block text-xs uppercase tracking-widest text-muted-foreground">
                {t('duration')}
              </span>
              <span className="mt-1 block text-base text-foreground">
                {service.duration}
              </span>
            </div>
            <div>
              <span className="block text-xs uppercase tracking-widest text-muted-foreground">
                {t('price')}
              </span>
              <span className="mt-1 block text-base text-foreground">
                {priceDisplay}
              </span>
              {priceNote && (
                <span className="mt-1 block text-xs text-muted-foreground italic">
                  {priceNote}
                </span>
              )}
            </div>
          </div>

          <div className="mt-12">
            <p className="text-lg leading-relaxed text-foreground whitespace-pre-wrap">
              {service.description}
            </p>
          </div>

          {service.steps && service.steps.length > 0 && (
            <div className="mt-16">
              <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-8">
                {t('process')}
              </h2>
              <div className="space-y-12">
                {service.steps.map((step, index) => (
                  <div key={step.id || index} className="flex gap-8">
                    <span className="font-serif text-4xl font-light text-muted-foreground/30">
                      {(index + 1).toString().padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-2">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-16">
            <Link
              href="/contact"
              className="inline-block border border-foreground px-8 py-4 text-sm font-medium uppercase tracking-widest text-foreground transition-colors hover:bg-foreground hover:text-background"
            >
              {t('bookService')}
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
