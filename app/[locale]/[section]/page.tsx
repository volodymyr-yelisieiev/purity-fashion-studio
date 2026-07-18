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
import type {
  CategoryPageSpec,
  MediaAsset,
  PublicPage,
  ServiceCategory,
} from "@/content/model"
import { getLocalizedMetadata } from "@/content/metadata"
import {
  getCourseBySlug,
  getDirectionByCanonicalKey,
  getDirectionBySlug,
  getFashionCollectionBySlug,
  getPageBySlug,
  getPublishedCourseSlugs,
  getPublishedDirectionSlugs,
  getPublishedFashionCollectionSlugs,
  getPublishedServices,
  type DirectionPageData,
  type PublicPageData,
} from "@/content/public-api"
import {
  collectionPath,
  coursePath,
  sectionPath,
  servicePath,
} from "@/content/routes"
import { hasLocale, localizePath, type Locale } from "@/i18n/routing"
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

function toCategoryPageSpec(direction: DirectionPageData): CategoryPageSpec {
  return {
    ctaService: direction.ctaService,
    heroNote: localized(direction.narrative),
    processTitle: localized(direction.processTitle),
    processSteps: direction.process.map((step) => ({
      title: localized(step.title),
      text: localized(step.description),
    })),
    formatsTitle: localized(direction.formatsTitle),
    formats: direction.formatNotes.map(localized),
    outcomesTitle: localized(direction.outcomesTitle),
    outcomes: direction.outcomes.map(localized),
    ctaTitle: localized(direction.ctaTitle),
    ctaSummary: localized(direction.ctaSummary),
    diagnosticLabel: direction.diagnosticLabel
      ? localized(direction.diagnosticLabel)
      : undefined,
    faqTitle: direction.faqTitle ? localized(direction.faqTitle) : undefined,
    faq: direction.faq.map((item) => ({
      question: localized(item.question),
      answer: localized(item.answer),
    })),
  }
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
  pageData,
  privateServices,
  corporateServices,
  directions,
  mediaAsset: mediaAssetOverride,
}: {
  locale: Locale
  publicPage: PublicPageEntry
  pageData: PublicPageData
  privateServices: Array<{ title: string; summary: string }>
  corporateServices: Array<{ title: string; summary: string }>
  directions: DirectionPageData[]
  mediaAsset?: MediaAsset
}) {
  const mediaAsset =
    mediaAssetOverride
  const signalCards = pageData.studioSignals

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
                key={signal.label}
                className="grid content-start gap-2 pr-4"
              >
                <dt className="text-xs text-muted-foreground">
                  {signal.label}
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
            {publicPage.cta?.label[locale] ?? pageData.title}
          </Link>
        </EditorialHero>

        <section className="bg-muted">
          <div className="mx-auto grid max-w-6xl min-w-0 gap-10 px-6 py-16 md:grid-cols-[0.8fr_1.2fr] md:px-10">
            <div>
              <p className="mb-4 text-xs tracking-normal text-muted-foreground uppercase">
                {pageData.methodEyebrow}
              </p>
              <h2 className="text-[clamp(2rem,9vw,3.75rem)] leading-tight font-medium text-balance">
                {pageData.methodTitle}
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
                {pageData.methodSteps.map((step) => (
                  <Card
                    key={step.title}
                    size="sm"
                    className="border-border bg-background"
                  >
                    <CardHeader>
                      <CardTitle className="min-w-0 break-words">
                        {step.title}
                      </CardTitle>
                      <CardDescription className="min-w-0 break-words">
                        {step.text}
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
              {pageData.clientsTitle}
            </h2>
            <p className="text-sm leading-7 text-muted-foreground md:self-center">
              {pageData.clientsSummary}
            </p>
          </div>
          <div className="grid min-w-0 auto-rows-fr gap-4 md:grid-cols-2">
            <Card className="min-w-0 border-border bg-background">
              <CardHeader>
                <CardTitle className="min-w-0 break-words">
                  {pageData.privateTitle}
                </CardTitle>
                <CardDescription className="min-w-0 break-words">
                  {privateServices
                    .slice(0, 2)
                    .map((service) => service.summary)
                    .join(" ")}
                </CardDescription>
              </CardHeader>
              <CardContent className="border-t border-border pt-5">
                <FeatureList
                  items={privateServices
                    .slice(0, 4)
                    .map((service) => service.title)}
                />
              </CardContent>
            </Card>
            <Card className="min-w-0 border-primary-foreground/20 bg-primary text-primary-foreground">
              <CardHeader>
                <CardTitle className="min-w-0 break-words">
                  {pageData.corporateTitle}
                </CardTitle>
                <CardDescription className="text-secondary">
                  {corporateServices[0]?.summary ?? pageData.clientsSummary}
                </CardDescription>
              </CardHeader>
              <CardContent className="border-t border-primary-foreground/20 pt-5">
                <FeatureList
                  items={
                    corporateServices.map((service) => service.title).length
                      ? corporateServices.map((service) => service.title)
                      : [pageData.corporateTitle ?? pageData.title]
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
                {pageData.directionsTitle}
              </h2>
              <Link
                href={localizePath(locale, "/booking")}
                className={cn(
                  buttonVariants({ variant: "default", size: "lg" })
                )}
              >
                {publicPage.cta?.label[locale] ?? pageData.title}
              </Link>
            </div>
            <div className="grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {directions.map((category) => (
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
                        {category.title}
                      </CardTitle>
                      <CardDescription className="min-w-0 break-words">
                        {category.summary}
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
            title={pageData.ctaTitle ?? pageData.title}
            summary={pageData.ctaSummary ?? pageData.summary}
            label={
              publicPage.cta?.label[locale] ??
              pageData.title
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
  pageData,
}: {
  locale: Locale
  publicPage: PublicPageEntry
  pageData: PublicPageData
}) {
  const currentPath = sectionPath(publicPage.routeSegment)
  const sectionTitles = pageData.sections.map((section) => section.heading)
  const effectiveDate = pageData.effectiveDate
    ? `${pageData.effectiveDateLabel ?? pageData.legalVersion ?? ""}: ${new Intl.DateTimeFormat(
        locale === "uk" ? "uk-UA" : locale,
        { dateStyle: "long" }
      ).format(new Date(pageData.effectiveDate))}`
    : pageData.legalVersion

  return (
    <div className="min-h-svh bg-background text-foreground">
      <SiteHeader locale={locale} currentPath={currentPath} />

      <main>
        <EditorialHero
          locale={locale}
          eyebrow={publicPage.eyebrow[locale]}
          title={publicPage.title[locale]}
          summary={publicPage.summary[locale]}
          mediaAsset={pageData.mediaAsset}
          composition="quiet"
        >
          <p className="text-xs tracking-widest text-background/70 uppercase">
            {effectiveDate}
          </p>
        </EditorialHero>

        <section className="bg-muted">
          <div className="mx-auto grid w-full max-w-4xl min-w-0 gap-12 px-6 py-16 md:px-10 md:py-24">
            <div>
              <h2 className="text-2xl font-medium md:text-3xl">
                {pageData.contentsTitle}
              </h2>
              <ol className="mt-5 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                {sectionTitles.map((title, index) => (
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
              {pageData.sections.map((section, index) => (
                <article
                  key={`${section.heading}-${index}`}
                  id={`legal-section-${index + 1}`}
                  className="grid scroll-mt-24 gap-4"
                >
                  <p className="text-xs text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h2 className="text-3xl font-medium text-pretty md:text-4xl">
                    {sectionTitles[index] ?? pageData.title}
                  </h2>
                  <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
                    {section.body}
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
  direction,
}: {
  locale: Locale
  category: ServiceCategory
  collections: CollectionCardView[]
  direction: DirectionPageData
}) {
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
          summary={direction.narrative}
          mediaAsset={heroMedia}
          composition="editorial"
        >
          <dl className="grid grid-cols-3 border-y border-border py-5">
            {[
              [collections.length, direction.countLabel ?? ""],
              [direction.availabilityValue ?? "", direction.availabilityLabel ?? ""],
              [direction.fittingValue ?? "", direction.fittingLabel ?? ""],
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
            {direction.ctaLabel}
          </Link>
        </EditorialHero>

        <section className="bg-muted">
          <div className="mx-auto w-full max-w-6xl px-6 py-16 md:px-10">
            <div className="mb-8 grid gap-4 md:grid-cols-[0.85fr_1.15fr] md:items-start">
              <h2 className="text-4xl leading-tight font-medium text-balance md:text-6xl">
                {direction.catalogueTitle}
              </h2>
              <p className="text-sm leading-7 text-muted-foreground">
                {direction.catalogueSummary}
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
                          {direction.materialsLabel}
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
              {direction.inquiryTitle}
            </h2>
            <p className="text-sm leading-7 text-muted-foreground">
              {direction.ctaSummary}
            </p>
          </div>
          <div className="grid auto-rows-fr gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {direction.inquirySteps.map((step) => (
              <Card
                key={step.title}
                size="sm"
                className="h-full border-border bg-background"
              >
                <CardHeader>
                  <CardTitle className="min-w-0 break-words">
                    {step.title}
                  </CardTitle>
                  <CardDescription className="min-w-0 break-words">
                    {step.text}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-6 pb-14 md:px-10">
          <SectionActionCard
            title={direction.ctaTitle}
            summary={direction.ctaSummary}
            label={direction.ctaLabel}
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
  copy,
  ctaLabel,
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
  copy: CategoryPageSpec
  ctaLabel: string
}) {
  const relatedEntries = entries
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
            {ctaLabel}
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
            label={ctaLabel}
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
      const directionSlugs = await getPublishedDirectionSlugs()
      const directions = (
        await Promise.all(
          directionSlugs.map((slug) => getDirectionBySlug(locale, slug))
        )
      ).filter((item): item is DirectionPageData => Boolean(item))
      const corporateServices =
        directions.find((item) => item.canonicalKey === "corporate")
          ?.services ?? []
      const privateServices = directions
        .filter(
          (item) =>
            item.canonicalKey !== "corporate" &&
            item.canonicalKey !== "collections"
        )
        .flatMap((item) => item.services)
      return (
        <StudioPageView
          locale={locale}
          publicPage={publicPage}
          pageData={publicPageData!}
          privateServices={privateServices}
          corporateServices={corporateServices}
          directions={directions}
          mediaAsset={publicPageData?.mediaAsset}
        />
      )
    }

    if (publicPage.slug === "privacy" || publicPage.slug === "terms") {
      return (
        <LegalPageView
          locale={locale}
          publicPage={publicPage}
          pageData={publicPageData!}
        />
      )
    }

    return (
      <ContentPage
        locale={locale}
        currentPath={sectionPath(publicPage.routeSegment)}
        eyebrow={publicPage.eyebrow[locale]}
        title={publicPage.title[locale]}
        summary={publicPage.summary[locale]}
        items={publicPage.body[locale]}
        mediaAsset={publicPageData?.mediaAsset}
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

  const atelierServices =
    section === "atelier"
      ? await getPublishedServices(locale, { slugs: ["atelier-service"] })
      : []
  const presentationDirection =
    directionData ??
    (section === "atelier"
      ? await getDirectionByCanonicalKey(locale, "realisation")
      : null)
  const atelierService = atelierServices[0]
  const category: ServiceCategory | undefined = directionData
    ? toLegacyCategory(directionData)
    : section === "atelier" && atelierService
      ? {
          slug: "atelier",
          routeSegment: "atelier",
          title: localized(atelierService.title),
          summary: localized(atelierService.summary),
        }
      : undefined

  if (
    !category ||
    category.slug === "portfolio" ||
    category.slug === "contacts"
  ) {
    notFound()
  }

  const payloadCategoryServices = directionData
    ? directionData.services
    : category.slug === "atelier"
      ? atelierServices
      : undefined
  const [payloadCourses, payloadCollections] =
    await Promise.all([
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
  const categoryMediaAsset =
    directionData?.mediaAsset ??
    payloadCategoryServices?.find((service) => service.mediaAsset)
      ?.mediaAsset ??
    payloadCourses.find((course) => course?.mediaAsset)?.mediaAsset ??
    payloadCollections.find((collection) => collection?.mediaAssets[0])
      ?.mediaAssets[0]
  const serviceEntries = (payloadCategoryServices ?? []).map((service) => ({
        href: localizePath(locale, servicePath(service.routeSegment)),
        title: service.title,
        summary: service.summary,
        status: presentationDirection?.narrative ?? service.summary,
        priceNote: presentationDirection?.outcomes.join(" · ") ?? "",
      }))
  const courseEntries = payloadCourses.flatMap((course) =>
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
  const collectionCards: CollectionCardView[] = payloadCollections.flatMap((collection) =>
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
  if (category.slug === "collections" && directionData) {
    return (
      <CollectionsPageView
        locale={locale}
        category={category}
        collections={collectionCards}
        direction={directionData}
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
    if (!presentationDirection) notFound()
    return (
      <OfferCategoryPageView
        locale={locale}
        category={category}
        entries={[...serviceEntries, ...courseEntries]}
        mediaAsset={categoryMediaAsset}
        copy={toCategoryPageSpec(presentationDirection)}
        ctaLabel={presentationDirection.ctaLabel}
      />
    )
  }

  notFound()
}
