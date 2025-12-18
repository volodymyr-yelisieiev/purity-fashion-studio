import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'
import { HeroSection } from '@/components/sections/HeroSection'
import { generateSeoMetadata } from '@/lib/seo'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home' })
  
  return generateSeoMetadata({
    title: 'PURITY Fashion Studio | Premium Styling & Atelier Services',
    description: t('hero.subtitle'),
    path: '/',
  })
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home' })
  const tCommon = await getTranslations({ locale, namespace: 'common' })

  return (
    <div className="flex flex-col items-center justify-center">
      <HeroSection
        title={t('hero.title')}
        subtitle={t('hero.subtitle')}
        ctaText={tCommon('bookConsultation')}
        ctaLink="/booking"
      />
      
      <div className="mt-10 flex items-center justify-center gap-x-6 pb-20">
        <Link href="/services" className="inline-flex items-center gap-2 text-foreground transition-opacity hover:opacity-70">
          <span className="underline underline-offset-4">{tCommon('viewServices')}</span>
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  )
}
