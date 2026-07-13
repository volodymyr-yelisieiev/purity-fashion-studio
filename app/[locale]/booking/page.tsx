import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { SiteFooter, SiteHeader } from "@/components/site-shell"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { services } from "@/content/source"
import { getEntryMetadata } from "@/content/metadata"
import { getFirstMediaAsset, getPublicPageByRoute } from "@/content/queries"
import { ImageFrame } from "@/components/purity"
import { BookingForm } from "@/features/booking/booking-form"
import { hasLocale, type Locale } from "@/i18n/routing"

type BookingPageProps = {
  params: Promise<{ locale: string }>
  searchParams?: Promise<{ service?: string | string[] }>
}

export async function generateMetadata({
  params,
}: BookingPageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params

  if (!hasLocale(rawLocale)) {
    return {}
  }

  const page = getPublicPageByRoute("booking")

  if (!page) {
    return {}
  }

  return getEntryMetadata(page, rawLocale, "/booking")
}

export default async function BookingPage({
  params,
  searchParams,
}: BookingPageProps) {
  const { locale: rawLocale } = await params

  if (!hasLocale(rawLocale)) {
    notFound()
  }

  const locale: Locale = rawLocale
  const page = getPublicPageByRoute("booking")

  if (!page) {
    notFound()
  }

  const query = await searchParams
  const requestedServiceParam =
    typeof query?.service === "string" ? query.service : undefined
  const visibleServices = services.filter((service) => service.visibleInMvp)
  const requestedService = visibleServices.find(
    (service) =>
      service.slug === requestedServiceParam ||
      service.routeSegment === requestedServiceParam
  )
  const serviceOptions = visibleServices.map((service) => ({
    slug: service.slug,
    title: service.title[locale],
  }))
  const initialServiceSlug = requestedService?.slug ?? serviceOptions[0]?.slug
  const mediaAsset = getFirstMediaAsset(page.mediaIds)

  return (
    <div className="min-h-svh bg-background text-foreground">
      <SiteHeader
        locale={locale}
        currentPath={
          initialServiceSlug
            ? `/booking?service=${initialServiceSlug}`
            : "/booking"
        }
      />

      <main>
        <section className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-10 md:grid-cols-[1fr_0.82fr] md:items-end md:px-10 md:py-14">
          <div>
            <Badge variant="default">{page.eyebrow[locale]}</Badge>
            <h1 className="mt-6 max-w-4xl text-4xl leading-none font-medium text-balance md:text-7xl">
              {page.title[locale]}
            </h1>
            <p className="mt-6 max-w-3xl text-sm leading-7 text-muted-foreground">
              {page.summary[locale]}
            </p>
            <div className="mt-8 grid gap-3 md:grid-cols-2">
              {page.body[locale].map((item) => (
                <Card key={item} className="min-w-0 border-border bg-muted">
                  <CardContent className="text-sm leading-7 text-muted-foreground">
                    {item}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          {mediaAsset?.src && (
            <ImageFrame
              src={mediaAsset.src}
              alt={mediaAsset.alt[locale]}
              label={page.eyebrow[locale]}
              eager
            />
          )}
        </section>

        <section className="bg-muted">
          <div className="mx-auto w-full max-w-6xl px-6 py-10 md:px-10 md:py-14">
            <Card className="min-w-0 border-border bg-background">
              <CardContent className="min-w-0 pt-6">
                <BookingForm
                  locale={locale}
                  services={serviceOptions}
                  initialServiceSlug={initialServiceSlug ?? ""}
                />
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <SiteFooter
        locale={locale}
        currentPath={
          initialServiceSlug
            ? `/booking?service=${initialServiceSlug}`
            : "/booking"
        }
      />
    </div>
  )
}
