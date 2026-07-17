import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { ContentPage } from "@/components/content-page"
import { EditorialHero, FeatureList, ImageFrame } from "@/components/purity"
import { SiteFooter, SiteHeader } from "@/components/cms-site-shell"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatOfferPrice } from "@/content/commerce"
import {
  beadedDressCopy,
  capsuleCopy,
  newYearPartyCopy,
} from "@/content/collection-page-specs"
import type { CollectionPageSpec } from "@/content/model"
import { getLocalizedMetadata } from "@/content/metadata"
import {
  getFashionCollectionBySlug,
  getPublishedFashionCollectionSlugs,
  type FashionCollectionPageData,
} from "@/content/public-api"
import { getCategory } from "@/content/queries"
import { collectionPath } from "@/content/routes"
import { BookingStartCta } from "@/features/booking/booking-start-cta"
import { hasLocale, locales, localizePath, type Locale } from "@/i18n/routing"
import { cn } from "@/lib/utils"

type CollectionPageProps = {
  params: Promise<{ locale: string; slug: string }>
}

export const dynamicParams = true

export async function generateStaticParams() {
  const slugs = await getPublishedFashionCollectionSlugs()
  return locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug }))
  )
}

export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params

  if (!hasLocale(rawLocale)) {
    return {}
  }

  const collection = await getFashionCollectionBySlug(rawLocale, slug)

  if (!collection) {
    return {}
  }

  return getLocalizedMetadata({
    locale: rawLocale,
    path: collectionPath(collection.routeSegment),
    title: collection.seo.title,
    description: collection.seo.description,
  })
}

function CollectionDetailPage({
  locale,
  collection,
  copy,
}: {
  locale: Locale
  collection: FashionCollectionPageData
  copy: CollectionPageSpec
}) {
  const currentPath = collectionPath(collection.routeSegment)
  const mediaAsset = collection.mediaAssets[0]
  const storyAssets = collection.mediaAssets.slice(1)
  const bookingHref = localizePath(
    locale,
    "/booking?service=capsule-collection"
  )

  return (
    <div className="min-h-svh bg-background text-foreground">
      <SiteHeader locale={locale} currentPath={currentPath} />

      <main>
        <EditorialHero
          locale={locale}
          eyebrow={copy.eyebrow[locale]}
          title={collection.title}
          summary={collection.summary}
          mediaAsset={mediaAsset}
          composition="cinematic"
        >
          <p className="border-y border-border py-4 text-sm leading-7 text-muted-foreground">
            {collection.materials.join(" · ")}
          </p>
          <div className="flex max-w-full flex-wrap gap-3">
            <BookingStartCta
              href={bookingHref}
              label={collection.cta.label}
              serviceSlug="capsule-collection"
              variant="secondary"
            />
            <Link
              href={localizePath(locale, "/services/capsule-collection")}
              className={cn(
                buttonVariants({
                  variant: "outline",
                  size: "lg",
                  className: "h-auto min-h-11 max-w-full whitespace-normal",
                })
              )}
            >
              {copy.serviceLabel[locale]}
            </Link>
          </div>
        </EditorialHero>

        {storyAssets.length > 0 && (
          <section className="mx-auto w-full max-w-6xl min-w-0 px-6 py-14 md:px-10">
            <div className="mb-8 grid gap-4 md:grid-cols-[0.8fr_1.2fr] md:items-start">
              <h2 className="text-3xl leading-tight font-medium md:text-5xl">
                {copy.stylingTitle[locale]}
              </h2>
              <p className="text-sm leading-7 text-muted-foreground">
                {copy.narrative[locale]}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {storyAssets.map((asset) => (
                <ImageFrame
                  key={asset.id}
                  alt={asset.alt[locale]}
                  src={asset.src}
                  label={copy.stylingTitle[locale]}
                  ratio={4 / 3}
                />
              ))}
            </div>
          </section>
        )}

        <section className="bg-muted">
          <div className="mx-auto grid max-w-6xl min-w-0 gap-10 px-6 py-16 md:grid-cols-[0.8fr_1.2fr] md:px-10">
            <div>
              <p className="mb-4 text-xs tracking-normal text-muted-foreground uppercase">
                {copy.stylingTitle[locale]}
              </p>
              <h2 className="text-3xl leading-tight font-medium text-balance md:text-6xl">
                {copy.stylingTitle[locale]}
              </h2>
              <p className="mt-5 text-sm leading-7 text-muted-foreground">
                {copy.narrative[locale]}
              </p>
            </div>
            <div className="grid auto-rows-fr gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {copy.styling.map((item) => (
                <Card
                  key={item.title[locale]}
                  className="h-full border-border bg-background"
                >
                  <CardHeader>
                    <CardTitle className="min-w-0 break-words">
                      {item.title[locale]}
                    </CardTitle>
                    <CardDescription className="min-w-0 break-words">
                      {item.text[locale]}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl min-w-0 px-6 py-14 md:px-10">
          <h2 className="mb-8 text-3xl leading-tight font-medium md:text-5xl">
            {copy.factsTitle[locale]}
          </h2>
          <div className="grid auto-rows-fr gap-3 sm:grid-cols-3">
            {copy.facts.map((fact) => (
              <Card
                key={fact.title[locale]}
                className="h-full border-border bg-background"
              >
                <CardHeader>
                  <CardTitle className="min-w-0 break-words">
                    {fact.title[locale]}
                  </CardTitle>
                  <CardDescription className="min-w-0 break-words">
                    {fact.text[locale]}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl min-w-0 px-6 py-14 md:px-10">
          <h2 className="mb-8 text-3xl leading-tight font-medium md:text-5xl">
            {copy.inquiryTitle[locale]}
          </h2>
          <div className="grid auto-rows-fr gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {copy.inquiry.map((step, index) => (
              <Card
                key={step.title[locale]}
                className="h-full border-border bg-background"
              >
                <CardHeader>
                  <p className="mb-4 text-xs text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <CardTitle className="min-w-0 break-words">
                    {step.title[locale]}
                  </CardTitle>
                  <CardDescription className="min-w-0 break-words">
                    {step.text[locale]}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section className="bg-muted">
          <div className="mx-auto grid max-w-6xl min-w-0 auto-rows-fr gap-4 px-6 py-16 md:grid-cols-2 md:px-10">
            <Card className="h-full min-w-0 border-primary-foreground/20 bg-primary text-primary-foreground">
              <CardHeader>
                <CardTitle className="min-w-0 break-words">
                  {copy.materialsTitle[locale]}
                </CardTitle>
                <CardDescription className="text-secondary">
                  {copy.narrative[locale]}
                </CardDescription>
              </CardHeader>
              <CardContent className="border-t border-primary-foreground/20 pt-5">
                <FeatureList
                  items={collection.materials}
                  className="text-primary-foreground/80"
                />
              </CardContent>
            </Card>
            <Card className="h-full min-w-0 border-border bg-background">
              <CardHeader>
                <CardTitle className="min-w-0 break-words">
                  {copy.availabilityTitle[locale]}
                </CardTitle>
                <CardDescription className="min-w-0 break-words">
                  {collection.availability}
                </CardDescription>
              </CardHeader>
              <CardContent className="border-t border-border pt-5 text-sm leading-7 text-muted-foreground">
                {collection.offers.length > 0
                  ? collection.offers
                      .map((offer) =>
                        `${offer.title}: ${formatOfferPrice(offer, locale)}`
                      )
                      .join(" · ")
                  : collection.narrative}
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl min-w-0 px-6 py-14 md:px-10">
          <Card className="min-w-0 border-border bg-background">
            <CardHeader>
              <CardTitle className="min-w-0 break-words">
                {copy.ctaTitle[locale]}
              </CardTitle>
              <CardDescription className="mt-3 max-w-3xl">
                {copy.ctaSummary[locale]}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BookingStartCta
                href={bookingHref}
                label={collection.cta.label}
                serviceSlug="capsule-collection"
              />
            </CardContent>
          </Card>
        </section>
      </main>
      <SiteFooter locale={locale} currentPath={currentPath} />
    </div>
  )
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { locale: rawLocale, slug } = await params

  if (!hasLocale(rawLocale)) {
    notFound()
  }

  const locale: Locale = rawLocale
  const collection = await getFashionCollectionBySlug(locale, slug)

  if (!collection) {
    notFound()
  }

  const category = getCategory("collections")

  if (collection.slug === "purity-capsule") {
    return (
      <CollectionDetailPage
        locale={locale}
        collection={collection}
        copy={capsuleCopy}
      />
    )
  }

  if (collection.slug === "new-year-party-collection") {
    return (
      <CollectionDetailPage
        locale={locale}
        collection={collection}
        copy={newYearPartyCopy}
      />
    )
  }

  if (collection.slug === "beaded-dress-signal") {
    return (
      <CollectionDetailPage
        locale={locale}
        collection={collection}
        copy={beadedDressCopy}
      />
    )
  }

  return (
    <ContentPage
      locale={locale}
      currentPath={collectionPath(collection.routeSegment)}
      eyebrow={category?.title[locale] ?? collection.title}
      title={collection.title}
      summary={collection.summary}
      items={[
        collection.availability,
        collection.narrative,
        ...collection.materials,
      ]}
      mediaAsset={collection.mediaAssets[0]}
      action={{
        label: collection.cta.label,
        href: localizePath(locale, "/booking?service=capsule-collection"),
      }}
    />
  )
}
