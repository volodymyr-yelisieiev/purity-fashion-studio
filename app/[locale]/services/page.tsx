import { getTranslations } from 'next-intl/server'
import { HeroSection, ServicesPreview } from '@/components/sections'
import { generateSeoMetadata } from '@/lib/seo'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('services')

  return generateSeoMetadata({
    title: `${t('title')} | PURITY Fashion Studio`,
    description: t('description'),
    path: '/services',
  })
}

// Mock services data - will be replaced with Payload CMS data when DB is connected
const mockServices = [
  {
    id: '1',
    title: 'Personal Styling',
    slug: 'personal-styling',
    description: 'Індивідуальний підбір стилю, який підкреслює вашу унікальність та відповідає вашому способу життя.',
    category: 'styling',
  },
  {
    id: '2',
    title: 'Wardrobe Audit',
    slug: 'wardrobe-audit',
    description: 'Ревізія гардеробу з рекомендаціями щодо оптимізації та оновлення вашої колекції одягу.',
    category: 'styling',
  },
  {
    id: '3',
    title: 'Shopping Accompaniment',
    slug: 'shopping-accompaniment',
    description: 'Супровід під час шопінгу для створення ідеального гардеробу.',
    category: 'styling',
  },
  {
    id: '4',
    title: 'Atelier Services',
    slug: 'atelier-services',
    description: 'Пошив та підгонка одягу за індивідуальними мірками.',
    category: 'atelier',
  },
  {
    id: '5',
    title: 'Event Styling',
    slug: 'event-styling',
    description: 'Створення образів для особливих подій та заходів.',
    category: 'styling',
  },
  {
    id: '6',
    title: 'Image Consultation',
    slug: 'image-consultation',
    description: 'Комплексна консультація з питань стилю та іміджу.',
    category: 'consulting',
  },
]

export default async function ServicesPage() {
  const t = await getTranslations('services')

  // TODO: Replace with actual data fetch when DB is connected
  // const { docs: services } = await getServices(locale)

  return (
    <main>
      <HeroSection
        title={t('title')}
        subtitle={t('description')}
      />
      <ServicesPreview
        services={mockServices}
        viewAllLink={undefined}
      />
    </main>
  )
}
