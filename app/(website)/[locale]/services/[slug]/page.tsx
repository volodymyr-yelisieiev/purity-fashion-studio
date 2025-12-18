import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { generateSeoMetadata } from '@/lib/seo'
import type { Metadata } from 'next'
import { getPayload, getServiceBySlug, type Locale } from '@/lib/payload'
import { draftMode } from 'next/headers'

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
  
  return services.docs.flatMap((service) =>
    locales.map((locale) => ({
      locale,
      slug: service.slug,
    }))
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, locale } = await params
  const { isEnabled: isDraft } = await draftMode()
  const service = await getServiceBySlug(slug, locale as Locale, isDraft)

  if (!service) {
    const t = await getTranslations({ locale, namespace: 'services' })
    return generateSeoMetadata({
      title: `${t('serviceNotFound')} | PURITY Fashion Studio`,
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
  
  const service = await getServiceBySlug(slug, locale as Locale, isDraft)

  if (!service) {
    notFound()
  }

  // Format price
  const priceUAH = service.pricing?.uah
  const priceEUR = service.pricing?.eur
  
  let priceDisplay = ''
  if (service.pricing?.priceNote) {
    priceDisplay = service.pricing.priceNote
  } else if (locale === 'en' && priceEUR) {
    priceDisplay = `€${priceEUR}`
  } else if (priceUAH) {
    priceDisplay = `${priceUAH} ₴`
  } else {
    priceDisplay = t('priceOnRequest')
  }
  
  // Fallback if translation key missing or logic fails
  if (priceDisplay === 'services.priceOnRequest') {
     priceDisplay = 'On Request'
  }

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
            </div>
          </div>

          <div className="mt-12">
            <p className="text-lg leading-relaxed text-foreground whitespace-pre-wrap">
              {service.description}
            </p>
          </div>

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
