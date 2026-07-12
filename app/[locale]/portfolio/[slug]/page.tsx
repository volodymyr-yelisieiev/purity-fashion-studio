import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ContentPage } from "@/components/content-page"
import { portfolioCases } from "@/content/source"
import { getEntryMetadata } from "@/content/metadata"
import {
  getCategory,
  getFirstMediaAsset,
  getVisiblePortfolioCase,
} from "@/content/queries"
import { portfolioCasePath } from "@/content/routes"
import { hasLocale, locales, type Locale } from "@/i18n/routing"

type PortfolioCasePageProps = {
  params: Promise<{ locale: string; slug: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    portfolioCases
      .filter(
        (portfolioCase) =>
          portfolioCase.visibleInMvp && portfolioCase.isRealClientProof
      )
      .map((portfolioCase) => ({ locale, slug: portfolioCase.routeSegment }))
  )
}

export async function generateMetadata({
  params,
}: PortfolioCasePageProps): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params

  if (!hasLocale(rawLocale)) {
    return {}
  }

  const portfolioCase = getVisiblePortfolioCase(slug)

  if (!portfolioCase) {
    return {}
  }

  return getEntryMetadata(
    portfolioCase,
    rawLocale,
    portfolioCasePath(portfolioCase.routeSegment)
  )
}

export default async function PortfolioCasePage({
  params,
}: PortfolioCasePageProps) {
  const { locale: rawLocale, slug } = await params

  if (!hasLocale(rawLocale)) {
    notFound()
  }

  const locale: Locale = rawLocale
  const portfolioCase = getVisiblePortfolioCase(slug)

  if (!portfolioCase) {
    notFound()
  }

  const category = getCategory("portfolio")

  return (
    <ContentPage
      locale={locale}
      currentPath={portfolioCasePath(portfolioCase.routeSegment)}
      eyebrow={category?.title[locale] ?? portfolioCase.title[locale]}
      title={portfolioCase.title[locale]}
      summary={portfolioCase.summary[locale]}
      mediaAsset={getFirstMediaAsset(portfolioCase.mediaIds)}
    />
  )
}
