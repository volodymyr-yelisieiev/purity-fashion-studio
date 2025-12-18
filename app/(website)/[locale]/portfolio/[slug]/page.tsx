import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import type { Media as MediaType, Portfolio as PortfolioType } from '@/payload-types'
import { draftMode } from 'next/headers'
import { Metadata } from 'next'
import { generateSeoMetadata } from '@/lib/seo'

interface PortfolioDetailPageProps {
  params: Promise<{
    slug: string
    locale: string
  }>
}

export async function generateMetadata({ params }: PortfolioDetailPageProps): Promise<Metadata> {
  const { slug, locale } = await params
  const { isEnabled: isDraft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'portfolio',
    where: {
      slug: { equals: slug },
    },
    locale: locale as 'en' | 'ru' | 'uk',
    limit: 1,
    draft: isDraft,
  })

  if (result.docs.length === 0) {
    return generateSeoMetadata({
      title: 'Project Not Found | PURITY Fashion Studio',
      description: 'The requested portfolio project could not be found.',
      locale,
    })
  }

  const portfolio = result.docs[0] as PortfolioType

  return generateSeoMetadata({
    title: portfolio.meta?.title || `${portfolio.title} | PURITY Fashion Studio`,
    description: portfolio.meta?.description || portfolio.description || '',
    path: `/portfolio/${slug}`,
    image: typeof portfolio.meta?.image === 'object' ? portfolio.meta?.image?.url || undefined : undefined,
    locale,
  })
}

export default async function PortfolioDetailPage({ params }: PortfolioDetailPageProps) {
  const { slug, locale } = await params
  const { isEnabled: isDraft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'portfolio',
    where: {
      slug: { equals: slug },
    },
    locale: locale as 'en' | 'ru' | 'uk',
    limit: 1,
    draft: isDraft,
  })

  if (result.docs.length === 0) {
    notFound()
  }

  const portfolio = result.docs[0] as PortfolioType
  const beforeImage = (typeof portfolio.beforeImage === 'object' ? portfolio.beforeImage : null) as MediaType | null
  const afterImage = (typeof portfolio.afterImage === 'object' ? portfolio.afterImage : null) as MediaType | null
  const gallery = (portfolio.gallery || []) as Array<{ image: number | MediaType | null; caption?: string | null; id?: string | null }>

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Back Button */}
      <Button asChild variant="ghost" className="mb-8">
        <Link href={`/${locale}/portfolio`}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {locale === 'uk' ? 'Назад до портфоліо' : locale === 'ru' ? 'Назад к портфолио' : 'Back to Portfolio'}
        </Link>
      </Button>

      {/* Header */}
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{portfolio.title}</h1>
        {portfolio.category && (
          <span className="inline-block px-3 py-1 text-sm bg-muted rounded-full capitalize">
            {portfolio.category}
          </span>
        )}
      </header>

      {/* Before/After Comparison */}
      {(beforeImage?.url || afterImage?.url) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {beforeImage?.url && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground font-medium">
                {locale === 'uk' ? 'До' : locale === 'ru' ? 'До' : 'Before'}
              </p>
              <div className="aspect-3/4 relative overflow-hidden rounded-sm">
                <Image
                  src={beforeImage.url}
                  alt={`${portfolio.title} - Before`}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          )}
          {afterImage?.url && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground font-medium">
                {locale === 'uk' ? 'Після' : locale === 'ru' ? 'После' : 'After'}
              </p>
              <div className="aspect-3/4 relative overflow-hidden rounded-sm">
                <Image
                  src={afterImage.url}
                  alt={`${portfolio.title} - After`}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Description */}
      {portfolio.description && (
        <div className="prose prose-lg max-w-none mb-12">
          <p>{portfolio.description}</p>
        </div>
      )}

      {/* Gallery */}
      {gallery.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">
            {locale === 'uk' ? 'Галерея' : locale === 'ru' ? 'Галерея' : 'Gallery'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {gallery.map((item, index) => {
              const image = typeof item.image === 'object' ? item.image as MediaType : null
              return image?.url ? (
                <div key={item.id || index} className="aspect-4/3 relative overflow-hidden rounded-sm">
                  <Image
                    src={image.url}
                    alt={`Gallery image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : null
            })}
          </div>
        </section>
      )}

      {/* CTA */}
      <div className="text-center py-12 bg-muted">
        <h3 className="text-2xl font-semibold mb-4">
          {locale === 'uk'
            ? 'Готові до власної трансформації?'
            : locale === 'ru'
              ? 'Готовы к собственной трансформации?'
              : 'Ready for your own transformation?'}
        </h3>
        <Button asChild size="lg">
          <Link href={`/${locale}/booking`}>
            {locale === 'uk' ? 'Записатися на консультацію' : locale === 'ru' ? 'Записаться на консультацию' : 'Book a Consultation'}
          </Link>
        </Button>
      </div>
    </div>
  )
}
