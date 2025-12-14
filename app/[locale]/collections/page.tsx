import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getLocale } from 'next-intl/server'
import Image from 'next/image'
import Link from 'next/link'
import type { Media as MediaType, Collection as CollectionType } from '@/payload-types'

export default async function CollectionsPage() {
  const locale = await getLocale()
  const payload = await getPayload({ config: configPromise })

  const collections = await payload.find({
    collection: 'collections',
    locale: locale as 'en' | 'ru' | 'uk',
    limit: 50,
    sort: '-createdAt',
  })

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <header className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          {locale === 'uk' ? 'Колекції' : locale === 'ru' ? 'Коллекции' : 'Collections'}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {locale === 'uk'
            ? 'Ексклюзивні капсульні колекції від PURITY'
            : locale === 'ru'
              ? 'Эксклюзивные капсульные коллекции от PURITY'
              : 'Exclusive capsule collections by PURITY'}
        </p>
      </header>

      {/* Collections Grid */}
      {collections.docs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {collections.docs.map((item) => {
            const collection = item as CollectionType
            // Use first image from images array as cover
            const firstImage = collection.images?.[0]
            const coverImage = (typeof firstImage?.image === 'object' ? firstImage.image : null) as MediaType | null
            
            return (
              <Link
                key={collection.id}
                href={`/${locale}/collections/${collection.slug}`}
                className="group block"
              >
                <article className="bg-card rounded-lg overflow-hidden border transition-shadow hover:shadow-lg">
                  {coverImage?.url && (
                    <div className="aspect-[3/2] relative overflow-hidden">
                      <Image
                        src={coverImage.url}
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
                    <h2 className="text-2xl font-semibold mt-2 mb-3 group-hover:text-primary transition-colors">
                      {collection.name}
                    </h2>
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
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">
            {locale === 'uk'
              ? 'Поки що немає колекцій'
              : locale === 'ru'
                ? 'Пока нет коллекций'
                : 'No collections yet'}
          </p>
        </div>
      )}
    </div>
  )
}
