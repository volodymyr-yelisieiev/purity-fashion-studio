import { getAvailableLocales, getPayload, getPortfolioBySlug, type Locale } from '@/lib/payload'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { ArrowLeft, Star } from 'lucide-react'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import type { Media as MediaType, Service } from '@/payload-types'
import { draftMode } from 'next/headers'
import { Metadata } from 'next'
import { generateSeoMetadata } from '@/lib/seo'
import { getTranslations } from 'next-intl/server'
import { LanguageFallback } from '@/components/ui/language-fallback'

interface PortfolioDetailPageProps {
  params: Promise<{
    slug: string
    locale: string
  }>
}

export async function generateStaticParams() {
  const payload = await getPayload()
  
  const portfolio = await payload.find({
    collection: 'portfolio',
    limit: 100,
  })
  
  const locales = ['en', 'uk', 'ru']
  
  return portfolio.docs
    .filter((item) => item.slug)
    .flatMap((item) =>
      locales.map((locale) => ({
        locale,
        slug: item.slug,
      }))
    )
}

export async function generateMetadata({ params }: PortfolioDetailPageProps): Promise<Metadata> {
  const { slug, locale } = await params
  const { isEnabled: isDraft } = await draftMode()
  const t = await getTranslations({ locale, namespace: 'portfolio' })
  const portfolio = await getPortfolioBySlug(slug, locale as Locale, isDraft)

  if (!portfolio) {
    const availableLocales = await getAvailableLocales('portfolio', slug, isDraft)
    const title = availableLocales.length > 0 ? t('notAvailable') : t('notFound')
    return generateSeoMetadata({
      title: `${title} | PURITY Fashion Studio`,
      description: t('notFoundDescription'),
      locale,
    })
  }

  const hasContent = (value?: string | null) => Boolean(value && value.toString().trim().length > 0)
  const primaryDescription = portfolio.description

  if (!hasContent(portfolio.title) || !hasContent(primaryDescription)) {
    const availableLocales = await getAvailableLocales('portfolio', slug, isDraft)
    const title = availableLocales.length > 0 ? t('notAvailable') : t('notFound')
    return generateSeoMetadata({
      title: `${title} | PURITY Fashion Studio`,
      description: t('notFoundDescription'),
      locale,
    })
  }

  return generateSeoMetadata({
    title: portfolio.meta?.title || `${portfolio.title} — Персональний Стайлінг | PURITY Fashion Studio`,
    description: portfolio.meta?.description || portfolio.description || '',
    path: `/portfolio/${slug}`,
    image: typeof portfolio.meta?.image === 'object' ? portfolio.meta?.image?.url || undefined : undefined,
    locale,
  })
}

export default async function PortfolioDetailPage({ params }: PortfolioDetailPageProps) {
  const { slug, locale } = await params
  const { isEnabled: isDraft } = await draftMode()
  const t = await getTranslations({ locale, namespace: 'portfolio' })
  const tCommon = await getTranslations({ locale, namespace: 'common' })

  const portfolio = await getPortfolioBySlug(slug, locale as Locale, isDraft)

  if (!portfolio) {
    const availableLocales = await getAvailableLocales('portfolio', slug, isDraft)
    if (availableLocales.length > 0) {
      return (
        <LanguageFallback
          title={t('notAvailable')}
          description={tCommon('viewInAvailableLanguages')}
          availableLocales={availableLocales}
          currentSlug={slug}
          basePath="/portfolio"
          backLink={{ href: '/portfolio', label: t('back') }}
        />
      )
    }
    notFound()
  }

  const hasContent = (value?: string | null) => Boolean(value && value.toString().trim().length > 0)
  const primaryDescription = portfolio.description

  if (!hasContent(portfolio.title) || !hasContent(primaryDescription)) {
    const availableLocales = await getAvailableLocales('portfolio', slug, isDraft)
    if (availableLocales.length > 0) {
      return (
        <LanguageFallback
          title={t('notAvailable')}
          description={tCommon('viewInAvailableLanguages')}
          availableLocales={availableLocales}
          currentSlug={slug}
          basePath="/portfolio"
          backLink={{ href: '/portfolio', label: t('back') }}
        />
      )
    }
    notFound()
  }

  const beforeImage = (typeof portfolio.beforeImage === 'object' ? portfolio.beforeImage : null) as MediaType | null
  const afterImage = (typeof portfolio.afterImage === 'object' ? portfolio.afterImage : null) as MediaType | null
  const gallery = (portfolio.gallery || []) as Array<{ image: number | MediaType | null; caption?: string | null; id?: string | null }>
  const servicesUsed = (portfolio.servicesUsed || []).filter(s => typeof s === 'object') as Service[]

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Back Button */}
      <Button asChild variant="ghost" className="mb-8">
        <Link href={`/${locale}/portfolio`}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('back')}
        </Link>
      </Button>

      {/* Header */}
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{portfolio.title}</h1>
        {portfolio.category && (
          <span className="inline-block px-3 py-1 text-sm bg-muted rounded-full capitalize">
            {portfolio.category.replace('-', ' ')}
          </span>
        )}
      </header>

      {/* Before/After Comparison */}
      {(beforeImage?.url || afterImage?.url) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {beforeImage?.url && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground font-medium">
                {t('before')}
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
                {t('after')}
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

      {/* Services Used */}
      {servicesUsed.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">{t('servicesUsed')}</h2>
          <div className="flex flex-wrap gap-3">
            {servicesUsed.map((service) => (
              <Link
                key={service.id}
                href={`/services/${service.slug}`}
                className="px-4 py-2 border border-border rounded-full hover:bg-muted transition-colors text-sm"
              >
                {service.title}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Testimonial */}
      {portfolio.testimonial?.quote && (
        <section className="mb-12 p-8 bg-muted/50 rounded-sm border border-border">
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-6">
            {t('testimonial')}
          </h2>
          <div className="relative">
            <p className="text-xl italic font-serif leading-relaxed mb-6">
              &quot;{portfolio.testimonial.quote}&quot;
            </p>
            <div className="flex items-center justify-between">
              {portfolio.testimonial.clientName && (
                <span className="font-medium">— {portfolio.testimonial.clientName}</span>
              )}
              {portfolio.testimonial.rating && (
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < (portfolio.testimonial?.rating || 0)
                          ? 'fill-foreground text-foreground'
                          : 'text-muted-foreground/30'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Gallery */}
      {gallery.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">{t('gallery')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {gallery.map((item, index) => {
              const image = typeof item.image === 'object' ? item.image as MediaType : null
              return image?.url ? (
                <div key={item.id || index} className="aspect-4/3 relative overflow-hidden rounded-sm">
                  <Image
                    src={image.url}
                    alt={item.caption || `Gallery image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  {item.caption && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black/60 to-transparent">
                      <p className="text-white text-sm">{item.caption}</p>
                    </div>
                  )}
                </div>
              ) : null
            })}
          </div>
        </section>
      )}

      {/* CTA */}
      <div className="text-center py-12 bg-muted">
        <h3 className="text-2xl font-semibold mb-4">{t('ctaTitle')}</h3>
        <Button asChild size="lg">
          <Link href={`/${locale}/booking`}>
            {t('ctaButton')}
          </Link>
        </Button>
      </div>
    </div>
  )
}
