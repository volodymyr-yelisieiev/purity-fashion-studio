import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import type { Media as MediaType, Collection as CollectionType, Product } from '@/payload-types'
import { Metadata } from 'next'
import { generateSeoMetadata } from '@/lib/seo'

interface CollectionDetailPageProps {
  params: Promise<{
    slug: string
    locale: string
  }>
}

export async function generateMetadata({ params }: CollectionDetailPageProps): Promise<Metadata> {
  const { slug, locale } = await params
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'collections',
    where: {
      slug: { equals: slug },
    },
    locale: locale as 'en' | 'ru' | 'uk',
    limit: 1,
  })

  if (result.docs.length === 0) {
    return generateSeoMetadata({
      title: 'Collection Not Found | PURITY Fashion Studio',
      description: 'The requested collection could not be found.',
      locale,
    })
  }

  const collection = result.docs[0] as CollectionType

  return generateSeoMetadata({
    title: collection.meta?.title || `${collection.name} | PURITY Fashion Studio`,
    description: collection.meta?.description || collection.description || '',
    path: `/collections/${slug}`,
    image: typeof collection.meta?.image === 'object' ? collection.meta?.image?.url || undefined : undefined,
    locale,
  })
}

export default async function CollectionDetailPage({ params }: CollectionDetailPageProps) {
  const { slug, locale } = await params
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'collections',
    where: {
      slug: { equals: slug },
    },
    locale: locale as 'en' | 'ru' | 'uk',
    limit: 1,
    depth: 2, // Get related products
  })

  if (result.docs.length === 0) {
    notFound()
  }

  const collection = result.docs[0] as CollectionType
  // Use coverImage or first image from images array
  const coverImg = collection.coverImage as MediaType | null
  const firstImage = collection.images?.[0]
  const fallbackImage = (typeof firstImage?.image === 'object' ? firstImage.image : null) as MediaType | null
  const coverImage = coverImg || fallbackImage
  const products = (collection.linkedProducts || []).filter(p => typeof p === 'object') as Product[]

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Back Button */}
      <Button asChild variant="ghost" className="mb-8">
        <Link href={`/${locale}/collections`}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {locale === 'uk' ? 'Назад до колекцій' : locale === 'ru' ? 'Назад к коллекциям' : 'Back to Collections'}
        </Link>
      </Button>

      {/* Header */}
      <header className="mb-12">
        {collection.releaseDate && (
          <span className="text-sm text-muted-foreground uppercase tracking-wider">
            {new Date(collection.releaseDate).toLocaleDateString(locale, { year: 'numeric', month: 'long' })}
          </span>
        )}
        <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">{collection.name}</h1>
      </header>

      {/* Cover Image */}
      {coverImage?.url && (
        <div className="aspect-21/9 relative overflow-hidden rounded-sm mb-12">
          <Image
            src={coverImage.url}
            alt={collection.name || ''}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Description */}
      {collection.description && (
        <div className="prose prose-lg max-w-3xl mb-16">
          <p className="text-xl text-muted-foreground">{collection.description}</p>
        </div>
      )}

      {/* Products */}
      {products.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-8">
            {locale === 'uk'
              ? 'Товари з колекції'
              : locale === 'ru'
                ? 'Товары из коллекции'
                : 'Collection Products'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => {
              const productImageData = product.images?.[0]
              const productImage = (typeof productImageData?.image === 'object' ? productImageData.image : null) as MediaType | null
              
              return (
                <article key={product.id} className="group">
                  {productImage?.url && (
                    <div className="aspect-3/4 relative overflow-hidden rounded-sm mb-4 bg-muted">
                      <Image
                        src={productImage.url}
                        alt={product.name || ''}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                  )}
                  <h3 className="font-medium">{product.name}</h3>
                  {product.pricing?.uah && (
                    <p className="text-muted-foreground">
                      ₴{product.pricing.uah}
                    </p>
                  )}
                </article>
              )
            })}
          </div>
        </section>
      )}

      {/* No Products Message */}
      {products.length === 0 && (
        <div className="text-center py-12 bg-muted">
          <p className="text-muted-foreground mb-4">
            {locale === 'uk'
              ? 'Скоро тут з\'являться товари цієї колекції'
              : locale === 'ru'
                ? 'Скоро здесь появятся товары этой коллекции'
                : 'Collection products coming soon'}
          </p>
          <Button asChild variant="outline">
            <Link href={`/${locale}/contact`}>
              {locale === 'uk' ? 'Зв\'яжіться з нами' : locale === 'ru' ? 'Свяжитесь с нами' : 'Contact Us'}
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}
