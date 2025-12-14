import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getLocale } from 'next-intl/server'
import Image from 'next/image'
import Link from 'next/link'
import type { Media as MediaType, Portfolio as PortfolioType } from '@/payload-types'

export default async function PortfolioPage() {
  const locale = await getLocale()
  const payload = await getPayload({ config: configPromise })

  const portfolioItems = await payload.find({
    collection: 'portfolio',
    locale: locale as 'en' | 'ru' | 'uk',
    limit: 50,
    sort: '-createdAt',
  })

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <header className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          {locale === 'uk' ? 'Портфоліо' : locale === 'ru' ? 'Портфолио' : 'Portfolio'}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {locale === 'uk'
            ? 'Наші найкращі проекти та трансформації клієнтів'
            : locale === 'ru'
              ? 'Наши лучшие проекты и трансформации клиентов'
              : 'Our best projects and client transformations'}
        </p>
      </header>

      {/* Portfolio Grid */}
      {portfolioItems.docs.length > 0 ? (
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
                <article className="bg-card rounded-lg overflow-hidden border transition-shadow hover:shadow-lg">
                  {coverImage?.url && (
                    <div className="aspect-[4/5] relative overflow-hidden">
                      <Image
                        src={coverImage.url}
                        alt={portfolio.title || ''}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {portfolio.title}
                    </h2>
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
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">
            {locale === 'uk'
              ? 'Поки що немає проектів'
              : locale === 'ru'
                ? 'Пока нет проектов'
                : 'No projects yet'}
          </p>
        </div>
      )}
    </div>
  )
}
