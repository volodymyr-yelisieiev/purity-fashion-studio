import { getTranslations } from 'next-intl/server'
import { HeroSection, PortfolioPreview, FeaturedPosts } from '@/components/sections'
import { getFeaturedPortfolio, type Locale } from '@/lib/payload'
import { getFeaturedPosts } from '@/lib/featuredPosts'
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

  const [featuredPosts, featuredPortfolio] = await Promise.all([
    getFeaturedPosts(locale as Locale, 6),
    getFeaturedPortfolio(locale as Locale),
  ])

  return (
    <div className="flex flex-col w-full">
      <HeroSection
        title={t('hero.title')}
        subtitle={t('hero.subtitle')}
        ctaText={tCommon('bookConsultation')}
        ctaLink="/booking"
      />

      {featuredPosts.length > 0 && (
        <FeaturedPosts
          items={featuredPosts}
          viewAllText={t('featuredPosts.viewAll')}
          viewAllLink={undefined}
        />
      )}

      {featuredPortfolio.docs.length > 0 && (
        <PortfolioPreview 
          items={featuredPortfolio.docs.map(p => ({
            id: String(p.id),
            title: p.title,
            slug: p.slug,
            featuredImage: p.afterImage && typeof p.afterImage === 'object' ? {
              url: p.afterImage.url || '',
              alt: p.afterImage.alt || p.title,
            } : undefined,
          }))}
          title={t('featuredWork')}
        />
      )}
    </div>
  )
}
