import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { ContentPage } from "@/components/content-page"
import { FeatureList, ImageFrame } from "@/components/purity"
import { SiteFooter, SiteHeader } from "@/components/site-shell"
import { Badge } from "@/components/ui/badge"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { publicPages, serviceCategories, siteSettings } from "@/content/source"
import type { CategoryPageSpec } from "@/content/model"
import {
  categoryPageCopy,
  collectionsPageCopy,
  studioPageCopy,
} from "@/content/category-page-specs"
import { getEntryMetadata } from "@/content/metadata"
import {
  getCategoryByRoute,
  getFirstMediaAsset,
  getPublicPageByRoute,
  getVisibleCollections,
  getVisibleCourses,
  getVisibleServicesByCategory,
} from "@/content/queries"
import {
  collectionPath,
  coursePath,
  sectionPath,
  servicePath,
} from "@/content/routes"
import { hasLocale, locales, localizePath, type Locale } from "@/i18n/routing"
import { cn } from "@/lib/utils"

type SectionPageProps = {
  params: Promise<{ locale: string; section: string }>
}

type PublicPageEntry = (typeof publicPages)[number]

export const dynamicParams = false

export function generateStaticParams() {
  const sections = [
    ...serviceCategories
      .filter(
        (category) =>
          category.slug !== "portfolio" && category.slug !== "contacts"
      )
      .map((category) => category.routeSegment),
    ...publicPages
      .filter((page) => page.slug !== "booking")
      .map((page) => page.routeSegment),
  ]

  return locales.flatMap((locale) =>
    sections.map((section) => ({ locale, section }))
  )
}

export async function generateMetadata({
  params,
}: SectionPageProps): Promise<Metadata> {
  const { locale: rawLocale, section } = await params

  if (!hasLocale(rawLocale)) {
    return {}
  }

  const category = getCategoryByRoute(section)
  const publicPage = getPublicPageByRoute(section)
  const entry = publicPage ?? category

  if (!entry) {
    return {}
  }

  return getEntryMetadata(entry, rawLocale, sectionPath(entry.routeSegment))
}

function StudioPageView({
  locale,
  publicPage,
}: {
  locale: Locale
  publicPage: PublicPageEntry
}) {
  const mediaAsset = getFirstMediaAsset(publicPage.mediaIds)
  const privateServices = [
    ...getVisibleServicesByCategory("research"),
    ...getVisibleServicesByCategory("realisation"),
    ...getVisibleServicesByCategory("transformation"),
    ...getVisibleServicesByCategory("atelier"),
  ]
  const corporateServices = getVisibleServicesByCategory("corporate")
  const directionCategories = serviceCategories.filter((category) =>
    [
      "research",
      "realisation",
      "atelier",
      "transformation",
      "corporate",
      "school",
      "collections",
    ].includes(category.slug)
  )
  const signalCards = [
    studioPageCopy.signals.team,
    studioPageCopy.signals.space,
    studioPageCopy.signals.hours,
  ]

  return (
    <div className="min-h-svh bg-background text-foreground">
      <SiteHeader locale={locale} currentPath="/studio" />

      <main>
        <section className="mx-auto grid w-full max-w-6xl min-w-0 gap-8 px-6 py-10 md:grid-cols-[1fr_0.95fr] md:items-end md:px-10 md:py-12">
          <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-6">
            <p className="text-xs tracking-normal text-muted-foreground uppercase">
              {publicPage.eyebrow[locale]}
            </p>
            <h1 className="max-w-4xl text-3xl leading-none font-medium text-balance sm:text-5xl md:text-7xl">
              {publicPage.title[locale]}
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
              {publicPage.summary[locale]}
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {signalCards.map((signal) => (
                <Card
                  key={signal.label[locale]}
                  size="sm"
                  className="border-border bg-background"
                >
                  <CardHeader>
                    <CardTitle className="min-w-0 break-words">
                      {signal.value}
                    </CardTitle>
                    <CardDescription className="min-w-0 break-words">
                      {signal.label[locale]}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="border-t border-border pt-4 text-xs leading-5 text-muted-foreground">
                    {signal.detail[locale]}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          {mediaAsset?.src && (
            <ImageFrame
              alt={mediaAsset.alt[locale]}
              src={mediaAsset.src}
              label={publicPage.eyebrow[locale]}
              eager
            />
          )}
        </section>

        <section className="bg-muted">
          <div className="mx-auto grid max-w-6xl min-w-0 gap-10 px-6 py-16 md:grid-cols-[0.8fr_1.2fr] md:px-10">
            <div>
              <p className="mb-4 text-xs tracking-normal text-muted-foreground uppercase">
                {studioPageCopy.methodEyebrow[locale]}
              </p>
              <h2 className="text-4xl leading-tight font-medium text-balance md:text-6xl">
                {studioPageCopy.methodTitle[locale]}
              </h2>
            </div>
            <div className="grid gap-4">
              <div className="grid gap-3 md:grid-cols-2">
                {publicPage.body[locale].map((item) => (
                  <Card
                    key={item}
                    size="sm"
                    className="border-border bg-background"
                  >
                    <CardContent className="text-sm leading-7 text-muted-foreground">
                      {item}
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {studioPageCopy.methodSteps.map((step) => (
                  <Card
                    key={step.title[locale]}
                    size="sm"
                    className="border-border bg-background"
                  >
                    <CardHeader>
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
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl min-w-0 px-6 py-14 md:px-10">
          <div className="mb-8 grid gap-4 md:grid-cols-[0.85fr_1.15fr] md:items-end">
            <h2 className="text-3xl leading-tight font-medium md:text-5xl">
              {studioPageCopy.clientsTitle[locale]}
            </h2>
            <p className="text-sm leading-7 text-muted-foreground">
              {studioPageCopy.clientsSummary[locale]}
            </p>
          </div>
          <div className="grid min-w-0 auto-rows-fr gap-4 md:grid-cols-2">
            <Card className="min-w-0 border-border bg-background">
              <CardHeader>
                <CardTitle className="min-w-0 break-words">
                  {studioPageCopy.privateTitle[locale]}
                </CardTitle>
                <CardDescription className="min-w-0 break-words">
                  {privateServices
                    .slice(0, 2)
                    .map((service) => service.summary[locale])
                    .join(" ")}
                </CardDescription>
              </CardHeader>
              <CardContent className="border-t border-border pt-5">
                <FeatureList
                  items={privateServices
                    .slice(0, 4)
                    .map((service) => service.title[locale])}
                />
              </CardContent>
            </Card>
            <Card className="min-w-0 border-primary-foreground/20 bg-primary text-primary-foreground">
              <CardHeader>
                <CardTitle className="min-w-0 break-words">
                  {studioPageCopy.corporateTitle[locale]}
                </CardTitle>
                <CardDescription className="text-secondary">
                  {corporateServices[0]?.summary[locale] ??
                    studioPageCopy.clientsSummary[locale]}
                </CardDescription>
              </CardHeader>
              <CardContent className="border-t border-primary-foreground/20 pt-5">
                <FeatureList
                  items={
                    corporateServices[0]?.outcomes[locale] ?? [
                      studioPageCopy.corporateTitle[locale],
                    ]
                  }
                  className="text-primary-foreground/80"
                />
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="bg-muted">
          <div className="mx-auto max-w-6xl min-w-0 px-6 py-16 md:px-10">
            <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <h2 className="text-3xl leading-tight font-medium md:text-5xl">
                {studioPageCopy.directionsTitle[locale]}
              </h2>
              <Link
                href={localizePath(locale, "/booking")}
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" })
                )}
              >
                {siteSettings.home.primaryCta.label[locale]}
              </Link>
            </div>
            <div className="grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {directionCategories.map((category) => (
                <Link
                  key={category.slug}
                  href={localizePath(
                    locale,
                    sectionPath(category.routeSegment)
                  )}
                  className="block h-full focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  <Card
                    size="sm"
                    className="h-full border-border bg-background"
                  >
                    <CardHeader>
                      <CardTitle className="min-w-0 break-words">
                        {category.title[locale]}
                      </CardTitle>
                      <CardDescription className="min-w-0 break-words">
                        {category.summary[locale]}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl min-w-0 px-6 py-14 md:px-10">
          <Card className="min-w-0 border-border bg-background">
            <CardHeader className="md:grid md:grid-cols-[1fr_auto] md:items-center md:gap-8">
              <div>
                <CardTitle className="min-w-0 break-words">
                  {studioPageCopy.ctaTitle[locale]}
                </CardTitle>
                <CardDescription className="mt-3">
                  {studioPageCopy.ctaSummary[locale]}
                </CardDescription>
              </div>
              <Link
                href={localizePath(locale, publicPage.cta?.path ?? "/booking")}
                className={cn(
                  buttonVariants({
                    variant: "default",
                    size: "lg",
                    className:
                      "mt-4 h-auto min-h-11 max-w-full whitespace-normal md:mt-0",
                  })
                )}
              >
                {publicPage.cta?.label[locale] ??
                  siteSettings.home.primaryCta.label[locale]}
              </Link>
            </CardHeader>
          </Card>
        </section>
      </main>
      <SiteFooter locale={locale} currentPath="/studio" />
    </div>
  )
}

function LegalPageView({
  locale,
  publicPage,
}: {
  locale: Locale
  publicPage: PublicPageEntry
}) {
  const currentPath = sectionPath(publicPage.routeSegment)
  const copy = {
    effectiveDate: {
      uk: "Чинна редакція: 10 липня 2026",
      ru: "Действующая редакция: 10 июля 2026",
      en: "Effective date: 10 July 2026",
    },
    contentsTitle: {
      uk: "Зміст",
      ru: "Содержание",
      en: "Contents",
    },
    sectionTitles: {
      privacy: {
        uk: ["Дані та мета", "Обмеження обробки"],
        ru: ["Данные и цель", "Ограничения обработки"],
        en: ["Data and purpose", "Processing limits"],
      },
      terms: {
        uk: ["Інформаційний характер", "Узгодження роботи"],
        ru: ["Информационный характер", "Согласование работы"],
        en: ["Informational scope", "Agreement before work"],
      },
    },
  }
  const legalSlug = publicPage.slug === "terms" ? "terms" : "privacy"
  const sectionTitles = copy.sectionTitles[legalSlug]

  return (
    <div className="min-h-svh bg-background text-foreground">
      <SiteHeader locale={locale} currentPath={currentPath} />

      <main>
        <section className="mx-auto w-full max-w-5xl min-w-0 px-6 py-12 md:px-10 md:py-20">
          <Badge variant="default">{publicPage.eyebrow[locale]}</Badge>
          <h1 className="mt-6 max-w-4xl text-4xl leading-none font-medium text-balance md:text-7xl">
            {publicPage.title[locale]}
          </h1>
          <p className="mt-6 max-w-3xl text-sm leading-7 text-muted-foreground">
            {publicPage.summary[locale]}
          </p>
          <p className="mt-4 text-xs tracking-widest text-muted-foreground uppercase">
            {copy.effectiveDate[locale]}
          </p>
        </section>

        <section className="bg-muted">
          <div className="mx-auto grid w-full max-w-5xl min-w-0 gap-4 px-6 py-12 md:grid-cols-2 md:px-10 md:py-16">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-medium md:text-3xl">
                {copy.contentsTitle[locale]}
              </h2>
              <ol className="mt-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                {sectionTitles[locale].map((title, index) => (
                  <li key={title}>
                    <a
                      href={`#legal-section-${index + 1}`}
                      className="underline underline-offset-4 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                    >
                      {String(index + 1).padStart(2, "0")} {title}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
            {publicPage.body[locale].map((item, index) => (
              <Card
                key={item}
                id={`legal-section-${index + 1}`}
                className="h-full scroll-mt-24 border-border bg-background"
              >
                <CardHeader>
                  <p className="mb-2 text-xs text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <CardTitle className="min-w-0 break-words">
                    {sectionTitles[locale][index]}
                  </CardTitle>
                </CardHeader>
                <CardContent className="border-t border-border pt-5 text-sm leading-7 text-muted-foreground">
                  {item}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-5xl min-w-0 px-6 py-12 md:px-10 md:py-16">
          <Card className="min-w-0 border-primary-foreground/20 bg-primary text-primary-foreground">
            <CardHeader className="md:grid md:grid-cols-[1fr_auto] md:items-center md:gap-8">
              <div>
                <CardTitle className="min-w-0 break-words">
                  {publicPage.cta?.label[locale]}
                </CardTitle>
                <CardDescription className="mt-3 text-secondary">
                  {publicPage.summary[locale]}
                </CardDescription>
              </div>
              {publicPage.cta && (
                <Link
                  href={localizePath(locale, publicPage.cta.path)}
                  className={cn(
                    buttonVariants({
                      variant: "secondary",
                      size: "lg",
                    })
                  )}
                >
                  {publicPage.cta.label[locale]}
                </Link>
              )}
            </CardHeader>
          </Card>
        </section>
      </main>
      <SiteFooter locale={locale} currentPath={currentPath} />
    </div>
  )
}

function CollectionsPageView({
  locale,
  category,
  collections,
}: {
  locale: Locale
  category: NonNullable<ReturnType<typeof getCategoryByRoute>>
  collections: ReturnType<typeof getVisibleCollections>
}) {
  const copy = collectionsPageCopy
  const heroMedia = getFirstMediaAsset(collections[0]?.mediaIds ?? [])
  const inquiryHref = localizePath(
    locale,
    "/booking?service=capsule-collection"
  )

  return (
    <div className="min-h-svh bg-background text-foreground">
      <SiteHeader
        locale={locale}
        currentPath={sectionPath(category.routeSegment)}
      />

      <main>
        <section className="mx-auto grid w-full max-w-6xl min-w-0 gap-8 px-6 py-10 md:grid-cols-[1fr_0.95fr] md:items-end md:px-10 md:py-12">
          <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-6">
            <p className="text-xs tracking-normal text-muted-foreground uppercase">
              {category.title[locale]}
            </p>
            <h1 className="max-w-4xl text-3xl leading-none font-medium text-balance sm:text-5xl md:text-7xl">
              {category.title[locale]}
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
              {copy.heroNote[locale]}
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              <Card size="sm" className="min-w-0 border-border bg-background">
                <CardHeader>
                  <CardTitle className="min-w-0 break-words">
                    {collections.length}
                  </CardTitle>
                  <CardDescription className="min-w-0 break-words">
                    {copy.countLabel[locale]}
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card size="sm" className="min-w-0 border-border bg-background">
                <CardHeader>
                  <CardTitle className="min-w-0 break-words">
                    {copy.availabilityValue[locale]}
                  </CardTitle>
                  <CardDescription className="min-w-0 break-words">
                    {copy.availabilityLabel[locale]}
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card size="sm" className="min-w-0 border-border bg-background">
                <CardHeader>
                  <CardTitle className="min-w-0 break-words">
                    {copy.fittingValue[locale]}
                  </CardTitle>
                  <CardDescription className="min-w-0 break-words">
                    {copy.fittingLabel[locale]}
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
            <Link
              href={inquiryHref}
              className={cn(
                buttonVariants({
                  variant: "default",
                  size: "lg",
                  className: "w-fit max-w-full",
                })
              )}
            >
              {copy.ctaLabel[locale]}
            </Link>
          </div>
          {heroMedia?.src && (
            <ImageFrame
              alt={heroMedia.alt[locale]}
              src={heroMedia.src}
              label={category.title[locale]}
              eager
            />
          )}
        </section>

        <section className="bg-muted">
          <div className="mx-auto w-full max-w-6xl px-6 py-16 md:px-10">
            <div className="mb-8 grid gap-4 md:grid-cols-[0.85fr_1.15fr] md:items-end">
              <h2 className="text-4xl leading-tight font-medium text-balance md:text-6xl">
                {copy.catalogueTitle[locale]}
              </h2>
              <p className="text-sm leading-7 text-muted-foreground">
                {copy.catalogueSummary[locale]}
              </p>
            </div>
            <div className="grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {collections.map((collection) => {
                const mediaAsset = getFirstMediaAsset(collection.mediaIds)

                return (
                  <Link
                    key={collection.slug}
                    href={localizePath(
                      locale,
                      collectionPath(collection.routeSegment)
                    )}
                    className="block h-full min-w-0 text-foreground hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                  >
                    <Card className="h-full min-w-0 border-border bg-background">
                      <ImageFrame
                        alt={
                          mediaAsset?.alt[locale] ?? collection.title[locale]
                        }
                        src={mediaAsset?.src}
                        className="border-x-0 border-t-0"
                      />
                      <CardHeader className="flex-1">
                        <CardTitle className="min-w-0 break-words">
                          {collection.title[locale]}
                        </CardTitle>
                        <CardDescription className="min-w-0 break-words">
                          {collection.summary[locale]}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="mt-auto grid gap-3 border-t border-border pt-5 text-xs leading-5 text-muted-foreground">
                        <p className="text-muted-foreground uppercase">
                          {copy.materialsLabel[locale]}
                        </p>
                        <p>{collection.materials[locale].join(" · ")}</p>
                        <p>{collection.commercialStatus[locale]}</p>
                        <p>{collection.priceNote[locale]}</p>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl min-w-0 px-6 py-14 md:px-10">
          <div className="mb-8 grid gap-4 md:grid-cols-[0.85fr_1.15fr] md:items-end">
            <h2 className="text-3xl leading-tight font-medium md:text-5xl">
              {copy.inquiryTitle[locale]}
            </h2>
            <p className="text-sm leading-7 text-muted-foreground">
              {copy.ctaSummary[locale]}
            </p>
          </div>
          <div className="grid auto-rows-fr gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {copy.inquirySteps.map((step) => (
              <Card
                key={step.title[locale]}
                size="sm"
                className="h-full border-border bg-background"
              >
                <CardHeader>
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

        <section className="mx-auto w-full max-w-6xl px-6 pb-14 md:px-10">
          <Card className="min-w-0 border-border bg-background">
            <CardHeader className="md:grid md:grid-cols-[1fr_auto] md:items-center md:gap-8">
              <div>
                <CardTitle className="min-w-0 break-words">
                  {copy.ctaTitle[locale]}
                </CardTitle>
                <CardDescription className="mt-3">
                  {copy.ctaSummary[locale]}
                </CardDescription>
              </div>
              <Link
                href={inquiryHref}
                className={cn(
                  buttonVariants({
                    variant: "default",
                    size: "lg",
                    className: "mt-4 md:mt-0",
                  })
                )}
              >
                {copy.ctaLabel[locale]}
              </Link>
            </CardHeader>
          </Card>
        </section>
      </main>
      <SiteFooter
        locale={locale}
        currentPath={sectionPath(category.routeSegment)}
      />
    </div>
  )
}

function OfferCategoryPageView({
  locale,
  category,
  entries,
  mediaAsset,
  copyKey,
  relatedCategory,
}: {
  locale: Locale
  category: NonNullable<ReturnType<typeof getCategoryByRoute>>
  entries: Array<{
    href: string
    title: string
    summary: string
    status: string
    priceNote: string
  }>
  mediaAsset?: NonNullable<ReturnType<typeof getFirstMediaAsset>>
  copyKey: keyof typeof categoryPageCopy
  relatedCategory?: "research" | "realisation" | "transformation"
}) {
  const copy: CategoryPageSpec = categoryPageCopy[copyKey]
  const relatedEntries = [
    ...entries,
    ...(relatedCategory
      ? getVisibleServicesByCategory(relatedCategory)
          .slice(0, 1)
          .map((service) => ({
            href: localizePath(locale, servicePath(service.routeSegment)),
            title: service.title[locale],
            summary: service.summary[locale],
            status: service.commercialStatus[locale],
            priceNote: service.priceNote[locale],
          }))
      : []),
  ]

  return (
    <div className="min-h-svh bg-background text-foreground">
      <SiteHeader
        locale={locale}
        currentPath={sectionPath(category.routeSegment)}
      />

      <main>
        <section className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-10 md:grid-cols-[1fr_0.95fr] md:items-end md:px-10 md:py-12">
          <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-6">
            <p className="text-xs tracking-normal text-muted-foreground uppercase">
              {siteSettings.home.serviceRailTitle[locale]}
            </p>
            <h1 className="max-w-4xl text-3xl leading-none font-medium text-balance sm:text-5xl md:text-7xl">
              {category.title[locale]}
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
              {copy.heroNote[locale]}
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {copy.outcomes.map((outcome) => (
                <Card
                  key={outcome[locale]}
                  size="sm"
                  className="border-border bg-background"
                >
                  <CardContent className="text-sm leading-6 text-muted-foreground">
                    {outcome[locale]}
                  </CardContent>
                </Card>
              ))}
            </div>
            <Link
              href={localizePath(locale, `/booking?service=${copy.ctaService}`)}
              className={cn(
                buttonVariants({
                  variant: "default",
                  size: "lg",
                  className: "w-fit max-w-full",
                })
              )}
            >
              {siteSettings.home.primaryCta.label[locale]}
            </Link>
            {copy.diagnosticLabel && (
              <p className="text-xs leading-5 text-muted-foreground">
                {copy.diagnosticLabel[locale]}
              </p>
            )}
          </div>
          {mediaAsset?.src && (
            <ImageFrame
              alt={mediaAsset.alt[locale]}
              src={mediaAsset.src}
              label={category.title[locale]}
              eager
            />
          )}
        </section>

        <section className="bg-muted">
          <div className="mx-auto grid max-w-6xl min-w-0 gap-10 px-6 py-16 md:px-10 lg:grid-cols-[0.82fr_1.18fr]">
            <div className="min-w-0">
              <p className="mb-4 text-xs tracking-normal text-muted-foreground uppercase">
                {copy.processTitle[locale]}
              </p>
              <h2 className="text-4xl leading-tight font-medium text-balance md:text-6xl">
                {copy.processTitle[locale]}
              </h2>
            </div>
            <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-4">
              <div className="grid auto-rows-fr gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {copy.processSteps.map((step) => (
                  <Card
                    key={step.title[locale]}
                    size="sm"
                    className="border-border bg-background"
                  >
                    <CardHeader>
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
              <div className="grid gap-4 lg:grid-cols-2">
                <Card className="min-w-0 border-border bg-background">
                  <CardHeader>
                    <CardTitle className="min-w-0 break-words">
                      {copy.formatsTitle[locale]}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="border-t border-border pt-5">
                    <FeatureList
                      items={copy.formats.map((format) => format[locale])}
                    />
                  </CardContent>
                </Card>
                <Card className="min-w-0 border-primary-foreground/20 bg-primary text-primary-foreground">
                  <CardHeader>
                    <CardTitle className="min-w-0 break-words">
                      {copy.outcomesTitle[locale]}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="border-t border-primary-foreground/20 pt-5">
                    <FeatureList
                      items={copy.outcomes.map((outcome) => outcome[locale])}
                      className="text-primary-foreground/80"
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {copy.faq && copy.faqTitle && (
          <section className="bg-muted">
            <div className="mx-auto w-full max-w-6xl px-6 py-14 md:px-10">
              <h2 className="mb-8 text-3xl leading-tight font-medium md:text-5xl">
                {copy.faqTitle[locale]}
              </h2>
              <Accordion className="border-t border-border">
                {copy.faq.map((item) => (
                  <AccordionItem
                    key={item.question[locale]}
                    value={item.question[locale]}
                  >
                    <AccordionTrigger>{item.question[locale]}</AccordionTrigger>
                    <AccordionContent className="max-w-3xl leading-7 text-muted-foreground">
                      {item.answer[locale]}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>
        )}

        <section className="mx-auto w-full max-w-6xl px-6 py-14 md:px-10">
          <div className="mb-8 grid gap-4 md:grid-cols-[0.85fr_1.15fr] md:items-end">
            <h2 className="text-3xl leading-tight font-medium md:text-5xl">
              {category.title[locale]}
            </h2>
            <p className="text-sm leading-7 text-muted-foreground">
              {category.summary[locale]}
            </p>
          </div>
          <div className="grid min-w-0 auto-rows-fr gap-4 md:grid-cols-2">
            {relatedEntries.map((entry) => (
              <Link
                key={entry.href}
                href={entry.href}
                className="block h-full focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                <Card className="h-full min-w-0 border-border bg-background">
                  <CardHeader className="flex-1">
                    <CardTitle className="min-w-0 break-words">
                      {entry.title}
                    </CardTitle>
                    <CardDescription className="min-w-0 break-words">
                      {entry.summary}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto grid gap-2 border-t border-border pt-5 text-xs leading-5 text-muted-foreground">
                    <p>{entry.status}</p>
                    <p>{entry.priceNote}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl min-w-0 px-6 py-14 md:px-10">
          <Card className="min-w-0 border-border bg-background">
            <CardHeader className="md:grid md:grid-cols-[1fr_auto] md:items-center md:gap-8">
              <div>
                <CardTitle className="min-w-0 break-words">
                  {copy.ctaTitle[locale]}
                </CardTitle>
                <CardDescription className="mt-3">
                  {copy.ctaSummary[locale]}
                </CardDescription>
              </div>
              <Link
                href={localizePath(
                  locale,
                  `/booking?service=${copy.ctaService}`
                )}
                className={cn(
                  buttonVariants({
                    variant: "default",
                    size: "lg",
                    className: "mt-4 md:mt-0",
                  })
                )}
              >
                {siteSettings.home.primaryCta.label[locale]}
              </Link>
            </CardHeader>
          </Card>
        </section>
      </main>
      <SiteFooter
        locale={locale}
        currentPath={sectionPath(category.routeSegment)}
      />
    </div>
  )
}

export default async function SectionPage({ params }: SectionPageProps) {
  const { locale: rawLocale, section } = await params

  if (!hasLocale(rawLocale)) {
    notFound()
  }

  const locale: Locale = rawLocale
  const category = getCategoryByRoute(section)
  const publicPage = getPublicPageByRoute(section)

  if (publicPage) {
    if (publicPage.slug === "studio") {
      return <StudioPageView locale={locale} publicPage={publicPage} />
    }

    if (publicPage.slug === "privacy" || publicPage.slug === "terms") {
      return <LegalPageView locale={locale} publicPage={publicPage} />
    }

    return (
      <ContentPage
        locale={locale}
        currentPath={sectionPath(publicPage.routeSegment)}
        eyebrow={publicPage.eyebrow[locale]}
        title={publicPage.title[locale]}
        summary={publicPage.summary[locale]}
        items={publicPage.body[locale]}
        mediaAsset={getFirstMediaAsset(publicPage.mediaIds)}
        action={
          publicPage.cta
            ? {
                label: publicPage.cta.label[locale],
                href: localizePath(locale, publicPage.cta.path),
              }
            : undefined
        }
      />
    )
  }

  if (
    !category ||
    category.slug === "portfolio" ||
    category.slug === "contacts"
  ) {
    notFound()
  }

  const visibleCategoryServices = getVisibleServicesByCategory(category.slug)
  const visibleCategoryCourses =
    category.slug === "school" ? getVisibleCourses() : []
  const visibleCategoryCollections =
    category.slug === "collections" ? getVisibleCollections() : []
  const categoryMediaAsset = getFirstMediaAsset([
    ...visibleCategoryServices.flatMap((service) => service.mediaIds),
    ...visibleCategoryCourses.flatMap((course) => course.mediaIds),
    ...visibleCategoryCollections.flatMap((collection) => collection.mediaIds),
  ])
  const serviceEntries = visibleCategoryServices.map((service) => ({
    href: localizePath(locale, servicePath(service.routeSegment)),
    title: service.title[locale],
    summary: service.summary[locale],
    status: service.commercialStatus[locale],
    priceNote: service.priceNote[locale],
  }))
  const courseEntries = visibleCategoryCourses.map((course) => ({
    href: localizePath(locale, coursePath(course.routeSegment)),
    title: course.title[locale],
    summary: course.summary[locale],
    status: course.commercialStatus[locale],
    priceNote: course.priceNote[locale],
  }))
  if (category.slug === "collections") {
    return (
      <CollectionsPageView
        locale={locale}
        category={category}
        collections={visibleCategoryCollections}
      />
    )
  }

  if (
    category.slug === "research" ||
    category.slug === "realisation" ||
    category.slug === "atelier" ||
    category.slug === "transformation" ||
    category.slug === "corporate" ||
    category.slug === "school"
  ) {
    return (
      <OfferCategoryPageView
        locale={locale}
        category={category}
        entries={[...serviceEntries, ...courseEntries]}
        mediaAsset={categoryMediaAsset}
        copyKey={category.slug}
        relatedCategory={
          category.slug === "research"
            ? "realisation"
            : category.slug === "realisation"
              ? "research"
              : category.slug === "transformation"
                ? "realisation"
                : undefined
        }
      />
    )
  }

  notFound()
}
