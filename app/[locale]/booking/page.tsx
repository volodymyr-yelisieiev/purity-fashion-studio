import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { SiteFooter, SiteHeader } from "@/components/site-shell"
import { services } from "@/content/source"
import { getEntryMetadata } from "@/content/metadata"
import { getFirstMediaAsset, getPublicPageByRoute } from "@/content/queries"
import { EditorialHero } from "@/components/purity"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { BookingForm } from "@/features/booking/booking-form"
import { hasLocale, type Locale } from "@/i18n/routing"

type BookingPageProps = {
  params: Promise<{ locale: string }>
  searchParams?: Promise<{ service?: string | string[] }>
}

const bookingPageCopy = {
  formTitle: {
    uk: "Деталі заявки",
    ru: "Детали заявки",
    en: "Inquiry details",
  },
  formSummary: {
    uk: "Контакти, формат роботи й оплата — в одній послідовній формі.",
    ru: "Контакты, формат работы и оплата — в одной последовательной форме.",
    en: "Contacts, working format, and payment in one clear form.",
  },
} as const

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
        <EditorialHero
          locale={locale}
          eyebrow={page.eyebrow[locale]}
          title={page.title[locale]}
          summary={page.summary[locale]}
          mediaAsset={mediaAsset}
          composition="cinematic"
        >
          <ol className="grid max-w-3xl gap-8 border-t border-background/25 pt-6 sm:grid-cols-2 sm:gap-10">
            {page.body[locale].map((item, index) => (
              <li
                key={item}
                className="grid min-w-0 gap-3 sm:grid-cols-[3rem_minmax(0,1fr)]"
              >
                <span className="font-heading text-3xl leading-none text-background/45">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-sm leading-7 text-background/75">
                  {item}
                </span>
              </li>
            ))}
          </ol>
        </EditorialHero>

        <section className="bg-muted">
          <div className="mx-auto w-full max-w-screen-xl px-6 py-16 md:px-10 md:py-24">
            <Card className="bg-background shadow-sm">
              <CardHeader className="justify-items-center text-center">
                <CardTitle>{bookingPageCopy.formTitle[locale]}</CardTitle>
                <CardDescription className="max-w-2xl">
                  {bookingPageCopy.formSummary[locale]}
                </CardDescription>
              </CardHeader>
              <CardContent>
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
