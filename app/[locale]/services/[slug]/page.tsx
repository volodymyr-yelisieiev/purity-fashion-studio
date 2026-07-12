import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { ContentPage } from "@/components/content-page"
import { FeatureList, ImageFrame } from "@/components/purity"
import { SiteFooter, SiteHeader } from "@/components/site-shell"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { services, siteSettings } from "@/content/source"
import { serviceDetailCopy } from "@/content/service-page-specs"
import type { ServicePageSpec } from "@/content/model"
import { getEntryMetadata } from "@/content/metadata"
import {
  getCategory,
  getFirstMediaAsset,
  getVisibleService,
} from "@/content/queries"
import { collectionPath, coursePath, servicePath } from "@/content/routes"
import { BookingStartCta } from "@/features/booking/booking-start-cta"
import { hasLocale, locales, localizePath, type Locale } from "@/i18n/routing"
import { cn } from "@/lib/utils"

type ServicePageProps = {
  params: Promise<{ locale: string; slug: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    services
      .filter((service) => service.visibleInMvp)
      .map((service) => ({ locale, slug: service.routeSegment }))
  )
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params

  if (!hasLocale(rawLocale)) {
    return {}
  }

  const service = getVisibleService(slug)

  if (!service) {
    return {}
  }

  return getEntryMetadata(service, rawLocale, servicePath(service.routeSegment))
}

function ServiceDetailPage({
  locale,
  service,
  eyebrow,
  copy,
}: {
  locale: Locale
  service: NonNullable<ReturnType<typeof getVisibleService>>
  eyebrow: string
  copy: ServicePageSpec
}) {
  const currentPath = servicePath(service.routeSegment)
  const mediaAsset = getFirstMediaAsset(service.mediaIds)
  const bookingHref = localizePath(
    locale,
    `/booking?service=${service.routeSegment}`
  )

  return (
    <div className="min-h-svh bg-background text-foreground">
      <SiteHeader locale={locale} currentPath={currentPath} />

      <main>
        <section className="mx-auto grid w-full max-w-6xl min-w-0 gap-8 px-6 py-10 md:grid-cols-[1fr_0.95fr] md:items-end md:px-10 md:py-12">
          <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-6">
            <p className="text-xs tracking-normal text-muted-foreground uppercase">
              {eyebrow}
            </p>
            <h1 className="max-w-4xl text-4xl leading-none font-medium text-balance sm:text-5xl md:text-7xl">
              {service.title[locale]}
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
              {service.summary[locale]}
            </p>
            <div
              className={
                service.outcomes[locale].length === 4
                  ? "grid gap-3 sm:grid-cols-2"
                  : "grid gap-3 sm:grid-cols-3"
              }
            >
              {service.outcomes[locale].map((outcome) => (
                <Card
                  key={outcome}
                  data-size="sm"
                  className="border-border bg-background"
                >
                  <CardContent className="text-sm leading-6 text-muted-foreground">
                    {outcome}
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex max-w-full flex-wrap gap-3">
              <BookingStartCta
                href={bookingHref}
                label={siteSettings.home.primaryCta.label[locale]}
                serviceSlug={service.slug}
              />
              {copy.contactLabel && (
                <Link
                  href={localizePath(locale, "/contacts")}
                  className={cn(
                    buttonVariants({
                      variant: "outline",
                      size: "lg",
                    })
                  )}
                >
                  {copy.contactLabel[locale]}
                </Link>
              )}
              {copy.courseLabel && (
                <Link
                  href={localizePath(
                    locale,
                    coursePath("wardrobe-management-course")
                  )}
                  className={cn(
                    buttonVariants({
                      variant: "outline",
                      size: "lg",
                    })
                  )}
                >
                  {copy.courseLabel[locale]}
                </Link>
              )}
              {copy.collectionLabel && (
                <Link
                  href={localizePath(locale, collectionPath("purity-capsule"))}
                  className={cn(
                    buttonVariants({
                      variant: "outline",
                      size: "lg",
                    })
                  )}
                >
                  {copy.collectionLabel[locale]}
                </Link>
              )}
            </div>
          </div>
          {mediaAsset?.src && (
            <ImageFrame
              alt={mediaAsset.alt[locale]}
              src={mediaAsset.src}
              label={service.title[locale]}
              eager
              className="aspect-[4/5]"
            />
          )}
        </section>

        <section className="bg-muted">
          <div className="mx-auto grid max-w-6xl min-w-0 gap-10 px-6 py-16 md:grid-cols-[0.8fr_1.2fr] md:px-10">
            <div className="min-w-0">
              <p className="mb-4 text-xs tracking-normal text-muted-foreground uppercase">
                {copy.formatsTitle[locale]}
              </p>
              <h2 className="text-4xl leading-tight font-medium text-balance md:text-6xl">
                {copy.formatsTitle[locale]}
              </h2>
              <p className="mt-5 text-sm leading-7 text-muted-foreground">
                {copy.intro[locale]}
              </p>
            </div>
            <div className="grid min-w-0 auto-rows-fr grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {copy.formats.map((format) => (
                <Card
                  key={format.title[locale]}
                  data-size="sm"
                  className="h-full border-border bg-background"
                >
                  <CardHeader>
                    <CardTitle className="min-w-0 break-words">
                      {format.title[locale]}
                    </CardTitle>
                    <CardDescription className="min-w-0 break-words">
                      {format.text[locale]}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl min-w-0 px-6 py-14 md:px-10">
          <h2 className="mb-8 text-3xl leading-tight font-medium md:text-5xl">
            {copy.processTitle[locale]}
          </h2>
          <div className="grid min-w-0 auto-rows-fr gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {copy.process.map((step, index) => (
              <Card
                key={step.title[locale]}
                data-size="sm"
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
                  {copy.outcomeTitle[locale]}
                </CardTitle>
                <CardDescription className="text-secondary">
                  {copy.outcomeSummary[locale]}
                </CardDescription>
              </CardHeader>
              <CardContent className="border-t border-primary-foreground/20 pt-5">
                <FeatureList items={service.outcomes[locale]} />
              </CardContent>
            </Card>
            <Card className="h-full min-w-0 border-border bg-background">
              <CardHeader>
                <CardTitle className="min-w-0 break-words">
                  {copy.commercialTitle[locale]}
                </CardTitle>
                <CardDescription className="min-w-0 break-words">
                  {service.commercialStatus[locale]}
                </CardDescription>
              </CardHeader>
              <CardContent className="border-t border-border pt-5 text-sm leading-7 text-muted-foreground">
                {service.priceNote[locale]}
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl min-w-0 px-6 py-14 md:px-10">
          <Card className="min-w-0 border-border bg-background">
            <CardHeader>
              <CardTitle className="min-w-0 break-words">
                {copy.nextStepTitle[locale]}
              </CardTitle>
              <CardDescription className="mt-3 max-w-3xl">
                {copy.nextStepSummary[locale]}
              </CardDescription>
            </CardHeader>
          </Card>
        </section>
      </main>
      <SiteFooter locale={locale} currentPath={currentPath} />
    </div>
  )
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { locale: rawLocale, slug } = await params

  if (!hasLocale(rawLocale)) {
    notFound()
  }

  const locale: Locale = rawLocale
  const service = getVisibleService(slug)

  if (!service) {
    notFound()
  }

  const category = getCategory(service.category)
  const detailCopy = serviceDetailCopy[service.slug]

  if (detailCopy) {
    return (
      <ServiceDetailPage
        locale={locale}
        service={service}
        eyebrow={category?.title[locale] ?? service.title[locale]}
        copy={detailCopy}
      />
    )
  }

  return (
    <ContentPage
      locale={locale}
      currentPath={servicePath(service.routeSegment)}
      eyebrow={category?.title[locale] ?? service.title[locale]}
      title={service.title[locale]}
      summary={service.summary[locale]}
      items={[
        service.commercialStatus[locale],
        service.priceNote[locale],
        ...service.outcomes[locale],
      ]}
      mediaAsset={getFirstMediaAsset(service.mediaIds)}
    >
      <div className="mt-6">
        <BookingStartCta
          href={localizePath(
            locale,
            `/booking?service=${service.routeSegment}`
          )}
          label={siteSettings.home.primaryCta.label[locale]}
          serviceSlug={service.slug}
        />
      </div>
    </ContentPage>
  )
}
