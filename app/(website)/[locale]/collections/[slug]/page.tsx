import { getAvailableLocales, getPayload, getCollectionBySlug, type Locale } from '@/lib/payload'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { notFound } from 'next/navigation'
import type { Media as MediaType, Product } from '@/payload-types'
import { Metadata } from 'next'
import { generateSeoMetadata } from '@/lib/seo'
import { getTranslations } from 'next-intl/server'
import { draftMode } from 'next/headers'
import { LanguageFallback, Button, ContentCard } from '@/components/ui'
import { HeroSection } from '@/components/sections'
import { FadeInStagger, FadeInStaggerContainer } from '@/components/animations/FadeInStagger'

interface CollectionDetailPageProps {
  params: Promise<{
    slug: string
    locale: string
  }>
}

export async function generateStaticParams() {
  const payload = await getPayload()
  
  let collections
  try {
    collections = await payload.find({
      collection: 'lookbooks',
      limit: 100,
    })
  } catch (err) {
    // If the schema is out-of-sync (missing columns) or DB is unavailable,
    // don't fail the entire build. Return no params so pages can still build.
    // The `prebuild` migration (added to package.json) should ensure schema is applied on CI.
    console.error('generateStaticParams: failed to fetch lookbooks —', err)
    return []
  }
  
  const locales = ['en', 'uk', 'ru']
  
  return collections.docs
    .filter((item) => item.slug)
    .flatMap((item) =>
      locales.map((locale) => ({
        locale,
        slug: item.slug,
      }))
    )
}

export async function generateMetadata({ params }: CollectionDetailPageProps): Promise<Metadata> {
  const { slug, locale } = await params
  const { isEnabled: isDraft } = await draftMode()
  const t = await getTranslations({ locale, namespace: 'collections' })
  const collection = await getCollectionBySlug(slug, locale as Locale, isDraft)

  if (!collection) {
    const availableLocales = await getAvailableLocales('lookbooks', slug, isDraft)
    const title = availableLocales.length > 0 ? t('notAvailable') : t('notFound')
    return generateSeoMetadata({
      title: `${title} | PURITY Fashion Studio`,
      description: t('notFoundDescription'),
      locale,
    })
  }

  return generateSeoMetadata({
    title: collection.meta?.title || `${collection.name} — Персональний Стайлінг | PURITY Fashion Studio`,
    description: collection.meta?.description || collection.description || '',
    path: `/collections/${slug}`,
    image: typeof collection.meta?.image === 'object' ? collection.meta?.image?.url || undefined : undefined,
    locale,
  })
}

export default async function CollectionDetailPage({ params }: CollectionDetailPageProps) {
  const { slug, locale } = await params
  const { isEnabled: isDraft } = await draftMode()
  const t = await getTranslations({ locale, namespace: 'collections' })
  const tCommon = await getTranslations({ locale, namespace: 'common' })

  const collection = await getCollectionBySlug(slug, locale as Locale, isDraft)

  if (!collection) {
    const availableLocales = await getAvailableLocales('lookbooks', slug, isDraft)
    if (availableLocales.length > 0) {
      return (
        <LanguageFallback
          title={t('notAvailable')}
          description={tCommon('viewInAvailableLanguages')}
          availableLocales={availableLocales}
          currentSlug={slug}
          basePath="/collections"
          backLink={{ href: '/collections', label: t('back') }}
        />
      )
    }
    notFound()
  }

  const hasContent = (value?: string | null) => Boolean(value && value.toString().trim().length > 0)
  const primaryDescription = collection.description

  if (!hasContent(collection.name) || !hasContent(primaryDescription)) {
    const availableLocales = await getAvailableLocales('lookbooks', slug, isDraft)
    if (availableLocales.length > 0) {
      return (
        <LanguageFallback
          title={t('notAvailable')}
          description={tCommon('viewInAvailableLanguages')}
          availableLocales={availableLocales}
          currentSlug={slug}
          basePath="/collections"
          backLink={{ href: '/collections', label: t('back') }}
        />
      )
    }
    notFound()
  }

  // Use coverImage or first image from images array
  const coverImg = collection.coverImage as MediaType | null
  const firstImage = collection.images?.[0]
  const fallbackImage = (typeof firstImage?.image === 'object' ? firstImage.image : null) as MediaType | null
  const coverImage = coverImg || fallbackImage
  const products = (collection.linkedProducts || []).filter(p => typeof p === 'object') as Product[]

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <HeroSection
        title={collection.name}
        subtitle={collection.season ? t(`seasons.${collection.season}`) : ''}
        backgroundImage={coverImage?.url || ''}
      />
      
      {/* Overview - White */}
      <section className="py-24 bg-white">
        <div className="container max-w-4xl">
          <FadeInStaggerContainer>
            <FadeInStagger>
              <h2 className="text-3xl font-serif mb-8">{tCommon('overview')}</h2>
            </FadeInStagger>
            <FadeInStagger>
              <p className="text-xl font-light leading-relaxed text-foreground">
                {collection.description}
              </p>
            </FadeInStagger>
          </FadeInStaggerContainer>
        </div>
      </section>
      
      {/* Details - Gray */}
      <section className="py-24 bg-neutral-50">
        <div className="container max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Materials */}
            <FadeInStaggerContainer>
              <FadeInStagger>
                <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
                  {t('materials')}
                </h3>
                <p className="text-lg font-light">{collection.materials}</p>
              </FadeInStagger>
            </FadeInStaggerContainer>
            
            {/* Sizes */}
            <FadeInStaggerContainer>
              <FadeInStagger>
                <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
                  {t('sizes')}
                </h3>
                <p className="text-lg font-light">{collection.sizes}</p>
              </FadeInStagger>
            </FadeInStaggerContainer>
            
            {/* Care */}
            <FadeInStaggerContainer>
              <FadeInStagger>
                <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
                  {t('care')}
                </h3>
                <p className="text-lg font-light">{collection.careInstructions}</p>
              </FadeInStagger>
            </FadeInStaggerContainer>
          </div>
        </div>
      </section>
      
      {/* Lookbook Gallery - White */}
      {collection.images && collection.images.length > 0 && (
        <section className="py-24 bg-white">
          <div className="container">
            <FadeInStaggerContainer>
              <FadeInStagger>
                <h2 className="text-3xl font-serif mb-16 text-center">{t('lookbook')}</h2>
              </FadeInStagger>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
                {collection.images.map((item, index) => {
                  const image = typeof item.image === 'object' ? item.image as MediaType : null
                  if (!image?.url) return null

                  return (
                    <FadeInStagger key={item.id || index}>
                      <div className="space-y-6">
                        <div className="aspect-4/5 relative overflow-hidden bg-muted">
                          <Image
                            src={image.url}
                            alt={item.caption || `${collection.name} look ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        </div>
                        {item.caption && (
                          <p className="text-sm text-muted-foreground italic text-center">{item.caption}</p>
                        )}
                      </div>
                    </FadeInStagger>
                  )
                })}
              </div>
            </FadeInStaggerContainer>
          </div>
        </section>
      )}
      
      {/* Products - Gray */}
      {products.length > 0 && (
        <section className="py-24 bg-neutral-50">
          <div className="container">
            <FadeInStaggerContainer>
              <FadeInStagger>
                <h2 className="text-3xl font-serif mb-16 text-center">{t('featuredProducts')}</h2>
              </FadeInStagger>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map((product) => {
                  const productImageData = product.images?.[0]
                  const productImage = (typeof productImageData?.image === 'object' ? productImageData.image : null) as MediaType | null
                  
                  return (
                    <FadeInStagger key={product.id}>
                      <ContentCard
                        title={product.name}
                        description={null}
                        image={productImage?.url ? { url: productImage.url, alt: productImage.alt || product.name } : undefined}
                        price={{
                          uah: product.pricing?.uah,
                          eur: product.pricing?.eur
                        }}
                        link={{
                          href: `/products/${product.slug}`,
                          label: t('viewProduct') || 'View Product'
                        }}
                        variant="default"
                      />
                    </FadeInStagger>
                  )
                })}
              </div>
            </FadeInStaggerContainer>
          </div>
        </section>
      )}
      
      {/* CTA - White */}
      <section className="py-32 bg-white">
        <div className="container text-center">
          <FadeInStaggerContainer>
            <FadeInStagger>
              <h2 className="text-4xl font-serif mb-8">{t('interestedInCollection')}</h2>
            </FadeInStagger>
            <FadeInStagger>
              <Button asChild variant="primary" size="lg">
                <Link href="/contact">
                  {tCommon('bookConsultation')}
                </Link>
              </Button>
            </FadeInStagger>
          </FadeInStaggerContainer>
        </div>
      </section>
    </main>
  )
}
