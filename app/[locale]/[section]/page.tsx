import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { ContentPage } from "@/components/content-page"
import {
  EditorialFaq,
  EditorialHero,
  FeatureList,
  ImageFrame,
} from "@/components/purity"
import { SiteFooter, SiteHeader } from "@/components/cms-site-shell"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { serviceCategories, siteSettings } from "@/content/source"
import type {
  CategoryPageSpec,
  MediaAsset,
  PublicPage,
  ServiceCategory,
} from "@/content/model"
import {
  categoryPageCopy,
  collectionsPageCopy,
  studioPageCopy,
} from "@/content/category-page-specs"
import { getLocalizedMetadata } from "@/content/metadata"
import {
  getCourseBySlug,
  getDirectionBySlug,
  getFashionCollectionBySlug,
  getPageBySlug,
  getPublishedCourseSlugs,
  getPublishedDirectionSlugs,
  getPublishedFashionCollectionSlugs,
  getPublishedPageSlugs,
  getPublishedServices,
  type DirectionPageData,
  type PublicPageData,
} from "@/content/public-api"
import {
  getCategoryByRoute,
  getFirstMediaAsset,
  getMediaAsset,
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

type PublicPageEntry = PublicPage

type CollectionCardView = {
  routeSegment: string
  title: string
  summary: string
  materials: string[]
  commercialStatus: string
  priceNote: string
  mediaAsset?: MediaAsset
}

export const dynamicParams = true

export async function generateStaticParams() {
  const [directions, pages] = await Promise.all([
    getPublishedDirectionSlugs(),
    getPublishedPageSlugs(),
  ])
  const sections = [...new Set([...directions, ...pages, "atelier"])]

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

  const [direction, publicPage] = await Promise.all([
    getDirectionBySlug(rawLocale, section),
    getPageBySlug(rawLocale, section),
  ])
  const entry = publicPage ?? direction

  if (!entry) {
    return {}
  }

  return getLocalizedMetadata({
    locale: rawLocale,
    path: sectionPath(entry.routeSegment),
    title: entry.seo.title,
    description: entry.seo.description,
  })
}

function localized(value: string) {
  return { uk: value, ru: value, en: value }
}

function toLegacyPublicPage(page: PublicPageData): PublicPageEntry | undefined {
  const slug =
    page.pageType === "studio"
      ? "studio"
      : page.pageType === "privacy"
        ? "privacy"
        : page.pageType === "terms"
          ? "terms"
          : undefined
  if (!slug) return undefined

  const body = page.sections.length
    ? page.sections.map((section) => section.body)
    : page.body.split(/\n\n+/).filter(Boolean)
  return {
    slug,
    routeSegment: page.routeSegment,
    title: localized(page.title),
    eyebrow: localized(page.eyebrow ?? page.title),
    summary: localized(page.summary),
    body: { uk: body, ru: body, en: body },
    cta: {
      label: localized(page.cta.label),
      path: page.cta.action === "contact" ? "/contacts" : "/booking",
    },
    mediaIds: page.mediaIds,
    seo: {
      uk: page.seo,
      ru: page.seo,
      en: page.seo,
    },
  }
}

function toLegacyCategory(direction: DirectionPageData): ServiceCategory {
  return {
    slug: direction.canonicalKey,
    routeSegment: direction.routeSegment,
    title: localized(direction.title),
    summary: localized(direction.summary),
  }
}

function SectionActionCard({
  title,
  summary,
  label,
  href,
}: {
  title: string
  summary: string
  label: string
  href: string
}) {
  return (
    <Card className="min-h-64 min-w-0 border-border bg-background">
      <CardHeader className="flex flex-1 flex-col gap-8 md:grid md:grid-cols-[minmax(0,1fr)_auto] md:grid-rows-[1fr_auto]">
        <div className="grid content-start gap-3 md:col-start-1 md:row-start-1">
          <CardTitle className="min-w-0 break-words">{title}</CardTitle>
          <CardDescription className="max-w-3xl">{summary}</CardDescription>
        </div>
        <Link
          href={href}
          className={cn(
            buttonVariants({
              variant: "default",
              size: "lg",
              className:
                "mt-auto h-auto min-h-11 w-full max-w-full whitespace-normal md:col-start-2 md:row-start-2 md:w-fit md:justify-self-end",
            })
          )}
        >
          {label}
        </Link>
      </CardHeader>
    </Card>
  )
}

function StudioPageView({
  locale,
  publicPage,
  mediaAsset: mediaAssetOverride,
}: {
  locale: Locale
  publicPage: PublicPageEntry
  mediaAsset?: MediaAsset
}) {
  const mediaAsset =
    mediaAssetOverride ?? getFirstMediaAsset(publicPage.mediaIds)
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
        <EditorialHero
          locale={locale}
          eyebrow={publicPage.eyebrow[locale]}
          title={publicPage.title[locale]}
          summary={publicPage.summary[locale]}
          mediaAsset={mediaAsset}
          composition="cinematic"
          titleClassName="max-w-none"
        >
          <dl className="grid grid-cols-3 border-y border-border py-5">
            {signalCards.map((signal) => (
              <div
                key={signal.label[locale]}
                className="grid content-start gap-2 pr-4"
              >
                <dt className="text-xs text-muted-foreground">
                  {signal.label[locale]}
                </dt>
                <dd className="text-lg font-medium">{signal.value}</dd>
              </div>
            ))}
          </dl>
          <Link
            href={localizePath(locale, "/booking")}
            className={cn(
              buttonVariants({
                variant: "secondary",
                size: "lg",
                className: "w-fit max-w-full",
              })
            )}
          >
            {siteSettings.home.primaryCta.label[locale]}
          </Link>
        </EditorialHero>

        <section className="bg-muted">
          <div className="mx-auto grid max-w-6xl min-w-0 gap-10 px-6 py-16 md:grid-cols-[0.8fr_1.2fr] md:px-10">
            <div>
              <p className="mb-4 text-xs tracking-normal text-muted-foreground uppercase">
                {studioPageCopy.methodEyebrow[locale]}
              </p>
              <h2 className="text-[clamp(2rem,9vw,3.75rem)] leading-tight font-medium text-balance">
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
          <div className="mb-8 grid gap-4 md:grid-cols-[0.85fr_1.15fr] md:items-start">
            <h2 className="text-3xl leading-tight font-medium md:text-5xl">
              {studioPageCopy.clientsTitle[locale]}
            </h2>
            <p className="text-sm leading-7 text-muted-foreground md:self-center">
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
                  buttonVariants({ variant: "default", size: "lg" })
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
          <SectionActionCard
            title={studioPageCopy.ctaTitle[locale]}
            summary={studioPageCopy.ctaSummary[locale]}
            label={
              publicPage.cta?.label[locale] ??
              siteSettings.home.primaryCta.label[locale]
            }
            href={localizePath(locale, publicPage.cta?.path ?? "/booking")}
          />
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
        <EditorialHero
          locale={locale}
          eyebrow={publicPage.eyebrow[locale]}
          title={publicPage.title[locale]}
          summary={publicPage.summary[locale]}
          mediaAsset={getMediaAsset("editorial-utility-patternmaking")}
          composition="quiet"
        >
          <p className="text-xs tracking-widest text-background/70 uppercase">
            {copy.effectiveDate[locale]}
          </p>
        </EditorialHero>

        <section className="bg-muted">
          <div className="mx-auto grid w-full max-w-4xl min-w-0 gap-12 px-6 py-16 md:px-10 md:py-24">
            <div>
              <h2 className="text-2xl font-medium md:text-3xl">
                {copy.contentsTitle[locale]}
              </h2>
              <ol className="mt-5 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
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
            <div className="grid gap-12">
              {publicPage.body[locale].map((item, index) => (
                <article
                  key={item}
                  id={`legal-section-${index + 1}`}
                  className="grid scroll-mt-24 gap-4"
                >
                  <p className="text-xs text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h2 className="text-3xl font-medium text-pretty md:text-4xl">
                    {sectionTitles[locale][index]}
                  </h2>
                  <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
                    {item}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-foreground px-6 py-14 text-background md:px-10 md:py-20">
          <div className="mx-auto max-w-4xl md:grid md:grid-cols-[1fr_auto] md:items-center md:gap-8">
            <div>
              <h2 className="text-3xl font-medium text-pretty">
                {publicPage.cta?.label[locale]}
              </h2>
              <p className="mt-3 text-sm leading-7 text-background/70">
                {publicPage.summary[locale]}
              </p>
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
          </div>
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
  category: ServiceCategory
  collections: CollectionCardView[]
}) {
  const copy = collectionsPageCopy
  const heroMedia = collections[0]?.mediaAsset
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
        <EditorialHero
          locale={locale}
          eyebrow={category.title[locale]}
          title={category.title[locale]}
          summary={copy.heroNote[locale]}
          mediaAsset={heroMedia}
          composition="editorial"
        >
          <dl className="grid grid-cols-3 border-y border-border py-5">
            {[
              [collections.length, copy.countLabel[locale]],
              [copy.availabilityValue[locale], copy.availabilityLabel[locale]],
              [copy.fittingValue[locale], copy.fittingLabel[locale]],
            ].map(([value, label]) => (
              <div key={label} className="grid gap-2 pr-4">
                <dt className="text-xs text-muted-foreground">{label}</dt>
                <dd className="text-lg font-medium">{value}</dd>
              </div>
            ))}
          </dl>
          <Link
            href={inquiryHref}
            className={cn(
              buttonVariants({
                variant: "secondary",
                size: "lg",
                className: "w-fit max-w-full",
              })
            )}
          >
            {copy.ctaLabel[locale]}
          </Link>
        </EditorialHero>

        <section className="bg-muted">
          <div className="mx-auto w-full max-w-6xl px-6 py-16 md:px-10">
            <div className="mb-8 grid gap-4 md:grid-cols-[0.85fr_1.15fr] md:items-start">
              <h2 className="text-4xl leading-tight font-medium text-balance md:text-6xl">
                {copy.catalogueTitle[locale]}
              </h2>
              <p className="text-sm leading-7 text-muted-foreground">
                {copy.catalogueSummary[locale]}
              </p>
            </div>
            <div className="grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {collections.map((collection) => {
                const mediaAsset = collection.mediaAsset

                return (
                  <Link
                    key={collection.routeSegment}
                    href={localizePath(
                      locale,
                      collectionPath(collection.routeSegment)
                    )}
                    className="block h-full min-w-0 text-foreground hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                  >
                    <Card className="h-full min-w-0 overflow-hidden border-border bg-background pt-0">
                      <ImageFrame
                        alt={mediaAsset?.alt[locale] ?? collection.title}
                        src={mediaAsset?.src}
                        className="border-x-0 border-t-0"
                      />
                      <CardHeader className="flex-1">
                        <CardTitle className="min-w-0 break-words">
                          {collection.title}
                        </CardTitle>
                        <CardDescription className="min-w-0 break-words">
                          {collection.summary}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="mt-auto grid gap-3 border-t border-border pt-5 text-xs leading-5 text-muted-foreground">
                        <p className="text-muted-foreground uppercase">
                          {copy.materialsLabel[locale]}
                        </p>
                        <p>{collection.materials.join(" · ")}</p>
                        <p>{collection.commercialStatus}</p>
                        <p>{collection.priceNote}</p>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl min-w-0 px-6 py-14 md:px-10">
          <div className="mb-8 grid gap-4 md:grid-cols-[0.85fr_1.15fr] md:items-start">
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
          <SectionActionCard
            title={copy.ctaTitle[locale]}
            summary={copy.ctaSummary[locale]}
            label={copy.ctaLabel[locale]}
            href={inquiryHref}
          />
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
  category: ServiceCategory
  entries: Array<{
    href: string
    title: string
    summary: string
    status: string
    priceNote: string
  }>
  mediaAsset?: MediaAsset
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
        <EditorialHero
          locale={locale}
          eyebrow={siteSettings.home.serviceRailTitle[locale]}
          title={category.title[locale]}
          summary={copy.heroNote[locale]}
          mediaAsset={mediaAsset}
          composition={category.slug === "atelier" ? "editorial" : "cinematic"}
        >
          <ol className="grid border-t border-border">
            {copy.outcomes.map((outcome, index) => (
              <li
                key={outcome[locale]}
                className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-3 border-b border-border py-3 text-sm"
              >
                <span className="text-xs text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {outcome[locale]}
              </li>
            ))}
          </ol>
          <Link
            href={localizePath(locale, `/booking?service=${copy.ctaService}`)}
            className={cn(
              buttonVariants({
                variant: "secondary",
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
        </EditorialHero>

        <section className="bg-muted">
          <div className="mx-auto grid max-w-6xl min-w-0 gap-10 px-6 py-16 md:px-10 lg:grid-cols-[minmax(20rem,0.9fr)_minmax(0,1.1fr)]">
            <div className="min-w-0">
              <p className="mb-4 text-xs tracking-normal text-muted-foreground uppercase">
                {copy.processTitle[locale]}
              </p>
              <h2 className="max-w-[13ch] text-[clamp(2rem,4vw,3.5rem)] leading-[0.98] font-medium text-pretty">
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
          <EditorialFaq
            title={copy.faqTitle[locale]}
            items={copy.faq.map(
              (item) => [item.question[locale], item.answer[locale]] as const
            )}
            className="bg-muted"
          />
        )}

        <section className="mx-auto w-full max-w-6xl px-6 py-14 md:px-10">
          <div className="mb-8 grid gap-4 md:grid-cols-[0.85fr_1.15fr] md:items-start">
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
                className={cn(
                  "block h-full focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                  relatedEntries.length === 1 &&
                    "mx-auto w-full max-w-xl md:col-span-2"
                )}
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
          <SectionActionCard
            title={copy.ctaTitle[locale]}
            summary={copy.ctaSummary[locale]}
            label={siteSettings.home.primaryCta.label[locale]}
            href={localizePath(locale, `/booking?service=${copy.ctaService}`)}
          />
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
  const [directionData, publicPageData] = await Promise.all([
    getDirectionBySlug(locale, section),
    getPageBySlug(locale, section),
  ])
  const publicPage = publicPageData
    ? toLegacyPublicPage(publicPageData)
    : undefined

  if (publicPage) {
    if (publicPage.slug === "studio") {
      return (
        <StudioPageView
          locale={locale}
          publicPage={publicPage}
          mediaAsset={publicPageData?.mediaAsset}
        />
      )
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
        mediaAsset={
          publicPageData?.mediaAsset ?? getFirstMediaAsset(publicPage.mediaIds)
        }
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

  if (publicPageData) {
    return (
      <ContentPage
        locale={locale}
        currentPath={sectionPath(publicPageData.routeSegment)}
        eyebrow={publicPageData.eyebrow ?? publicPageData.title}
        title={publicPageData.title}
        summary={publicPageData.summary}
        items={
          publicPageData.sections.length
            ? publicPageData.sections.map((item) => item.body)
            : publicPageData.body.split(/\n\n+/).filter(Boolean)
        }
        action={{
          label: publicPageData.cta.label,
          href: localizePath(
            locale,
            publicPageData.cta.action === "contact" ? "/contacts" : "/booking"
          ),
        }}
      />
    )
  }

  const seedCategory = getCategoryByRoute(section)
  const category = directionData
    ? toLegacyCategory(directionData)
    : seedCategory

  if (
    !category ||
    category.slug === "portfolio" ||
    category.slug === "contacts"
  ) {
    notFound()
  }

  const payloadCategoryServices = directionData
    ? directionData.services
    : process.env.CONTENT_SOURCE === "payload" && category.slug === "atelier"
      ? await getPublishedServices(locale, { slugs: ["atelier-service"] })
      : undefined
  const visibleCategoryServices = payloadCategoryServices
    ? []
    : getVisibleServicesByCategory(category.slug)
  const visibleCategoryCourses =
    category.slug === "school" ? getVisibleCourses() : []
  const visibleCategoryCollections =
    category.slug === "collections" ? getVisibleCollections() : []
  const payloadMode = process.env.CONTENT_SOURCE === "payload"
  const [payloadCourses, payloadCollections] = payloadMode
    ? await Promise.all([
        category.slug === "school"
          ? getPublishedCourseSlugs().then((slugs) =>
              Promise.all(slugs.map((slug) => getCourseBySlug(locale, slug)))
            )
          : [],
        category.slug === "collections"
          ? getPublishedFashionCollectionSlugs().then((slugs) =>
              Promise.all(
                slugs.map((slug) => getFashionCollectionBySlug(locale, slug))
              )
            )
          : [],
      ])
    : [[], []]
  const categoryMediaAsset =
    directionData?.mediaAsset ??
    payloadCategoryServices?.find((service) => service.mediaAsset)
      ?.mediaAsset ??
    payloadCourses.find((course) => course?.mediaAsset)?.mediaAsset ??
    payloadCollections.find((collection) => collection?.mediaAssets[0])
      ?.mediaAssets[0] ??
    getFirstMediaAsset([
      ...visibleCategoryServices.flatMap((service) => service.mediaIds),
      ...visibleCategoryCourses.flatMap((course) => course.mediaIds),
      ...visibleCategoryCollections.flatMap(
        (collection) => collection.mediaIds
      ),
    ])
  const serviceEntries = payloadCategoryServices
    ? payloadCategoryServices.map((service) => ({
        href: localizePath(locale, servicePath(service.routeSegment)),
        title: service.title,
        summary: service.summary,
        status: directionData?.narrative ?? service.summary,
        priceNote: directionData?.outcomes.join(" · ") ?? "",
      }))
    : visibleCategoryServices.map((service) => ({
        href: localizePath(locale, servicePath(service.routeSegment)),
        title: service.title[locale],
        summary: service.summary[locale],
        status: service.commercialStatus[locale],
        priceNote: service.priceNote[locale],
      }))
  const courseEntries = payloadMode
    ? payloadCourses.flatMap((course) =>
        course
          ? [
              {
                href: localizePath(locale, coursePath(course.routeSegment)),
                title: course.title,
                summary: course.summary,
                status: course.commercialStatus,
                priceNote: course.priceNote,
              },
            ]
          : []
      )
    : visibleCategoryCourses.map((course) => ({
        href: localizePath(locale, coursePath(course.routeSegment)),
        title: course.title[locale],
        summary: course.summary[locale],
        status: course.commercialStatus[locale],
        priceNote: course.priceNote[locale],
      }))
  const collectionCards: CollectionCardView[] = payloadMode
    ? payloadCollections.flatMap((collection) =>
        collection
          ? [
              {
                routeSegment: collection.routeSegment,
                title: collection.title,
                summary: collection.summary,
                materials: collection.materials,
                commercialStatus: collection.commercialStatus,
                priceNote: collection.priceNote,
                mediaAsset: collection.mediaAssets[0],
              },
            ]
          : []
      )
    : visibleCategoryCollections.map((collection) => ({
        routeSegment: collection.routeSegment,
        title: collection.title[locale],
        summary: collection.summary[locale],
        materials: collection.materials[locale],
        commercialStatus: collection.commercialStatus[locale],
        priceNote: collection.priceNote[locale],
        mediaAsset: getFirstMediaAsset(collection.mediaIds),
      }))
  if (category.slug === "collections") {
    return (
      <CollectionsPageView
        locale={locale}
        category={category}
        collections={collectionCards}
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
          process.env.CONTENT_SOURCE === "payload"
            ? undefined
            : category.slug === "research"
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
