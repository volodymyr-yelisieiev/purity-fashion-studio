import { getTranslations } from 'next-intl/server'
import { HeroSection, ServicesPreview } from '@/components/sections'
import { generateSeoMetadata } from '@/lib/seo'
import { getPayload } from '@/lib/payload'
import { EmptyState } from '@/components/ui/empty-state'
import type { Service } from '@/payload-types'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'services' })

  return generateSeoMetadata({
    title: `${t('title')} | PURITY Fashion Studio`,
    description: t('description'),
    path: '/services',
    locale,
  })
}

export default async function ServicesPage({ params }: PageProps) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'services' })
  const tCommon = await getTranslations({ locale, namespace: 'common' })
  
  const payload = await getPayload()
  const { docs: services } = await payload.find({
    collection: 'services',
    locale: locale as 'en' | 'uk' | 'ru',
    limit: 50,
    sort: 'title',
    where: {
      status: { equals: 'published' },
    },
  })

  // Transform Payload data to match component interface
  // Use excerpt if available, otherwise use description
  const formattedServices = services.map((service: Service) => ({
    id: String(service.id),
    title: service.title,
    slug: service.slug || String(service.id),
    description: service.excerpt || service.description || '',
    category: service.category || 'styling',
  }))

  if (formattedServices.length === 0) {
    return (
      <main>
        <HeroSection
          title={t('title')}
          subtitle={t('description')}
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
        title={t('title')}
        subtitle={t('description')}
      />
      <ServicesPreview
        services={formattedServices}
        viewAllLink={undefined}
      />
    </main>
  )
}
