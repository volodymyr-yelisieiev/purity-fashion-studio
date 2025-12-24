import { getTranslations } from 'next-intl/server'
import { ThreeStageHero, type HeroStage } from '@/components/sections'
import { generateSeoMetadata } from '@/lib/seo'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home' })
  
  return generateSeoMetadata({
    title: `PURITY Fashion Studio | ${t('hero.title')}`,
    description: t('hero.subtitle'),
    path: '/',
    locale,
  })
}

/**
 * Default hero stage images (Unsplash placeholders)
 * These are used until CMS has real images
 */
const defaultStageImages = {
  research: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=2070&auto=format&fit=crop',
  realisation: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2070&auto=format&fit=crop',
  transformation: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop',
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home' })
  const tCommon = await getTranslations({ locale, namespace: 'common' })

  // Define the three transformation stages
  const heroStages: HeroStage[] = [
    {
      key: 'research',
      title: 'Research',
      localizedTitle: t('stages.research.localizedTitle'),
      subtitle: t('stages.research.subtitle'),
      description: t('stages.research.description'),
      backgroundImage: defaultStageImages.research,
      href: '/research',
    },
    {
      key: 'realisation',
      title: 'Realisation',
      localizedTitle: t('stages.realisation.localizedTitle'),
      subtitle: t('stages.realisation.subtitle'),
      description: t('stages.realisation.description'),
      backgroundImage: defaultStageImages.realisation,
      href: '/realisation',
    },
    {
      key: 'transformation',
      title: 'Transformation',
      localizedTitle: t('stages.transformation.localizedTitle'),
      subtitle: t('stages.transformation.subtitle'),
      description: t('stages.transformation.description'),
      backgroundImage: defaultStageImages.transformation,
      href: '/transformation',
    },
  ]

  return (
    <div className="flex flex-col w-full">
      {/* Three Stage Hero */}
      <ThreeStageHero
        headline={t('hero.title')}
        subheadline={t('hero.subtitle')}
        stages={heroStages}
        ctaText={tCommon('bookConsultation')}
        ctaLink="/contact"
        finalCtaTitle={t('cta.title')}
        finalCtaDescription={t('cta.description')}
      />
    </div>
  )
}
