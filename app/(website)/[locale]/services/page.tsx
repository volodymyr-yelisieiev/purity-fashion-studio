import { getTranslations } from 'next-intl/server'
import { HeroSection, ServicesPreview } from '@/components/sections'
import { generateSeoMetadata } from '@/lib/seo'
import { getPayload } from '@/lib/payload'
import { EmptyState } from '@/components/ui'
import { hasContent, formatPrice } from '@/lib/utils'
import type { Service, Media } from '@/payload-types'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const tPages = await getTranslations({ locale, namespace: 'pages' })

  return generateSeoMetadata({
    title: `${tPages('services.title')} | PURITY Fashion Studio`,
    description: tPages('services.subtitle'),
    path: '/services',
    locale,
  })
}

export default async function ServicesPage({ params }: PageProps) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'services' })
  const tPages = await getTranslations({ locale, namespace: 'pages' })
  const tCommon = await getTranslations({ locale, namespace: 'common' })
  
  const payload = await getPayload()
  const { docs: services } = await payload.find({
    collection: 'services',
    locale: locale as 'en' | 'uk' | 'ru',
    fallbackLocale: false,
    limit: 50,
    sort: '-featured,-createdAt',
    depth: 1,
    where: {
      status: { equals: 'published' },
    },
  })

  // Filter out items without content in current locale
  const filteredServices = services.filter(service => hasContent(service.title))

  // Helper function for price display
  const getServicePriceDisplay = (service: Service): string | null => {
    const priceEUR = service.pricing?.eur
    const priceUAH = service.pricing?.uah

    if (locale === 'en' && priceEUR) return formatPrice(priceEUR, 'EUR')
    if (priceUAH) return formatPrice(priceUAH, 'UAH')
    return null
  }

  // Transform Payload data to match component interface with all available fields
  const formattedServices = filteredServices.map((service: Service) => {
    const heroImage = typeof service.heroImage === 'object' ? (service.heroImage as Media | null) : null
    return {
      id: String(service.id),
      title: service.title,
      slug: service.slug || String(service.id),
      description: service.excerpt || service.description || '',
      category: service.category ? t(`categories.${service.category}`) : t('categories.styling'),
      categoryLabel: service.category ? t(`categories.${service.category}`) : t('categories.styling'),
      priceDisplay: getServicePriceDisplay(service),
      pricing: service.pricing,
      duration: service.duration || null,
      format: service.format ? t(`formats.${service.format}`) : null,
      image: heroImage?.url ? { url: heroImage.url, alt: heroImage.alt || service.title } : undefined,
    }
  })

  if (formattedServices.length === 0) {
    return (
      <main>
        <HeroSection
          title={tPages('services.title')}
          subtitle={tPages('services.subtitle')}
        />
        <EmptyState
          title={tCommon('noContent')}
          description={tCommon('checkBackSoon')}
          action={{ label: tCommon('backToHome'), href: '/' }}
        />
      </main>
    )
  }

  return (
    <main>
      <HeroSection
        title={tPages('services.title')}
        subtitle={tPages('services.subtitle')}
      />
      <ServicesPreview
        services={formattedServices}
        viewAllLink={undefined}
      />
    </main>
  )
}
