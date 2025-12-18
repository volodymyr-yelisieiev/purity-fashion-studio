import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import type { Media as MediaType, Collection as CollectionType } from '@/payload-types'
import { getPayload } from '@/lib/payload'
import { HeroSection } from '@/components/sections'
import { EmptyState } from '@/components/ui/empty-state'
import { H3 } from '@/components/ui/typography'

export default async function CollectionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home.collections' })
  const tCommon = await getTranslations({ locale, namespace: 'common' })
  
  const payload = await getPayload()
  const collections = await payload.find({
    collection: 'collections',
    locale: locale as 'en' | 'ru' | 'uk',
    limit: 50,
    sort: '-createdAt',
  })

  if (collections.docs.length === 0) {
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
        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {collections.docs.map((item) => {
            const collection = item as CollectionType
            // Use first image from images array as cover, or coverImage if available
            const coverImg = collection.coverImage as MediaType | null
            const firstImage = collection.images?.[0]
            const fallbackImage = (typeof firstImage?.image === 'object' ? firstImage.image : null) as MediaType | null
            const displayImage = coverImg || fallbackImage
            
            return (
              <Link
                key={collection.id}
                href={`/${locale}/collections/${collection.slug}`}
                className="group block"
              >
                <article className="bg-card overflow-hidden border transition-shadow hover:shadow-lg">
                  {displayImage?.url && (
                    <div className="aspect-3/2 relative overflow-hidden">
                      <Image
                        src={displayImage.url}
                        alt={collection.name || ''}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-8">
                    {collection.releaseDate && (
                      <span className="text-sm text-muted-foreground uppercase tracking-wider">
                        {new Date(collection.releaseDate).toLocaleDateString(locale, { year: 'numeric', month: 'long' })}
                      </span>
                    )}
                    <H3 className="text-2xl font-semibold mt-2 mb-3 group-hover:text-primary transition-colors">
                      {collection.name}
                    </H3>
                    {collection.description && (
                      <p className="text-muted-foreground line-clamp-2">
                        {collection.description}
                      </p>
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
