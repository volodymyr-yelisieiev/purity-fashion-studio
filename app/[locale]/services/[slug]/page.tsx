import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { generateSeoMetadata } from '@/lib/seo'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ slug: string }>
}

// Mock services data - will be replaced with Payload CMS data when DB is connected
const mockServices: Record<string, {
  id: string
  title: string
  slug: string
  description: string
  fullDescription: string
  category: string
  duration: string
  price: string
}> = {
  'personal-styling': {
    id: '1',
    title: 'Personal Styling',
    slug: 'personal-styling',
    description: 'Індивідуальний підбір стилю, який підкреслює вашу унікальність.',
    fullDescription: 'Наша послуга персонального стайлінгу — це комплексний підхід до створення вашого унікального образу. Ми враховуємо ваш тип фігури, колоритип, стиль життя та особисті вподобання, щоб створити гардероб, який працює саме на вас.',
    category: 'styling',
    duration: '2-3 години',
    price: 'від 3000 ₴',
  },
  'wardrobe-audit': {
    id: '2',
    title: 'Wardrobe Audit',
    slug: 'wardrobe-audit',
    description: 'Ревізія гардеробу з рекомендаціями щодо оптимізації.',
    fullDescription: 'Під час аудиту гардеробу ми детально аналізуємо кожен елемент вашого одягу, визначаємо що залишити, що додати та як максимально ефективно комбінувати наявні речі.',
    category: 'styling',
    duration: '3-4 години',
    price: 'від 4000 ₴',
  },
  'shopping-accompaniment': {
    id: '3',
    title: 'Shopping Accompaniment',
    slug: 'shopping-accompaniment',
    description: 'Супровід під час шопінгу для створення ідеального гардеробу.',
    fullDescription: 'Разом з вами ми відвідаємо обрані магазини, де я допоможу підібрати речі, які ідеально впишуться у ваш гардероб та стиль життя.',
    category: 'styling',
    duration: '3-5 годин',
    price: 'від 5000 ₴',
  },
  'atelier-services': {
    id: '4',
    title: 'Atelier Services',
    slug: 'atelier-services',
    description: 'Пошив та підгонка одягу за індивідуальними мірками.',
    fullDescription: 'Наше ательє пропонує послуги індивідуального пошиву та підгонки одягу. Ми працюємо з найякіснішими тканинами та приділяємо увагу кожній деталі.',
    category: 'atelier',
    duration: 'індивідуально',
    price: 'за запитом',
  },
  'event-styling': {
    id: '5',
    title: 'Event Styling',
    slug: 'event-styling',
    description: 'Створення образів для особливих подій та заходів.',
    fullDescription: 'Ми допоможемо вам створити незабутній образ для будь-якої особливої події — весілля, корпоративу, фотосесії чи важливої зустрічі.',
    category: 'styling',
    duration: '2-4 години',
    price: 'від 4500 ₴',
  },
  'image-consultation': {
    id: '6',
    title: 'Image Consultation',
    slug: 'image-consultation',
    description: 'Комплексна консультація з питань стилю та іміджу.',
    fullDescription: 'Під час консультації ми визначимо ваш колоритип, тип фігури, стильовий напрямок та створимо персональні рекомендації щодо гардеробу.',
    category: 'consulting',
    duration: '1.5-2 години',
    price: 'від 2500 ₴',
  },
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const service = mockServices[slug]

  if (!service) {
    return generateSeoMetadata({
      title: 'Service Not Found | PURITY Fashion Studio',
      description: 'The requested service could not be found.',
    })
  }

  return generateSeoMetadata({
    title: `${service.title} | PURITY Fashion Studio`,
    description: service.description,
    path: `/services/${slug}`,
  })
}

export function generateStaticParams() {
  return Object.keys(mockServices).map((slug) => ({ slug }))
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params
  const t = await getTranslations('services')

  const service = mockServices[slug]

  if (!service) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-background">
      <section className="px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/services"
            className="mb-8 inline-block text-body-sm uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
          >
            ← {t('backToServices')}
          </Link>

          <span className="mb-4 block text-body-xs uppercase tracking-widest text-muted-foreground">
            {service.category}
          </span>

          <h1 className="font-display text-display-lg font-light tracking-tight text-foreground">
            {service.title}
          </h1>

          <div className="mt-8 flex gap-8 border-b border-border pb-8">
            <div>
              <span className="block text-body-xs uppercase tracking-widest text-muted-foreground">
                {t('duration')}
              </span>
              <span className="mt-1 block text-body-md text-foreground">
                {service.duration}
              </span>
            </div>
            <div>
              <span className="block text-body-xs uppercase tracking-widest text-muted-foreground">
                {t('price')}
              </span>
              <span className="mt-1 block text-body-md text-foreground">
                {service.price}
              </span>
            </div>
          </div>

          <div className="mt-12">
            <p className="text-body-lg leading-relaxed text-foreground">
              {service.fullDescription}
            </p>
          </div>

          <div className="mt-16">
            <Link
              href="/contact"
              className="inline-block border border-foreground px-8 py-4 text-body-sm font-medium uppercase tracking-widest text-foreground transition-colors hover:bg-foreground hover:text-background"
            >
              {t('bookService')}
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
