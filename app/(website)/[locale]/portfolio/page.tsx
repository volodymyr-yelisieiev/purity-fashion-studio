import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import type { Media as MediaType, Portfolio as PortfolioType } from '@/payload-types'
import { getPayload } from '@/lib/payload'
import { HeroSection } from '@/components/sections'
import { EmptyState } from '@/components/ui/empty-state'
import { H3 } from '@/components/ui/typography'

export default async function PortfolioPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home.portfolio' })
  const tCommon = await getTranslations({ locale, namespace: 'common' })
  
  const payload = await getPayload()
  const portfolioItems = await payload.find({
    collection: 'portfolio',
    locale: locale as 'en' | 'ru' | 'uk',
    limit: 50,
    sort: '-createdAt',
  })

  if (portfolioItems.docs.length === 0) {
    return (
      <>
        <HeroSection
          title={t('title')}
          subtitle={t('subtitle')}
        />
        <EmptyState
          title={tCommon('noContent')}
          description={tCommon('checkBackSoon')}
          action={{ label: tCommon('backToHome'), href: '/' }}
        />
      </>
    )
  }

  return (
    <>
      <HeroSection
        title={t('title')}
        subtitle={t('subtitle')}
      />
      
      <div className="container mx-auto px-4 py-16">
        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolioItems.docs.map((item) => {
            const portfolio = item as PortfolioType
            // Use afterImage as cover image (transformation result)
            const coverImage = (typeof portfolio.afterImage === 'object' ? portfolio.afterImage : null) as MediaType | null
            
            return (
              <Link
                key={portfolio.id}
                href={`/${locale}/portfolio/${portfolio.slug}`}
                className="group block"
              >
                <article className="bg-card overflow-hidden border transition-shadow hover:shadow-lg">
                  {coverImage?.url && (
                    <div className="aspect-4/5 relative overflow-hidden">
                      <Image
                        src={coverImage.url}
                        alt={portfolio.title || ''}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <H3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {portfolio.title}
                    </H3>
                    {portfolio.category && (
                      <span className="text-sm text-muted-foreground capitalize">
                        {portfolio.category}
                      </span>
                    )}
                  </div>
                </article>
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}
