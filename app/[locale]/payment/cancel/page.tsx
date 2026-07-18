import type { Metadata } from "next"

import { getLocalizedMetadata } from "@/content/metadata"
import { getPageBySlug } from "@/content/public-api"
import { PaymentStatusPage } from "@/features/booking/payment-status-page"
import { hasLocale, type Locale } from "@/i18n/routing"

type PaymentPageProps = {
  params: Promise<{ locale: string }>
  searchParams?: Promise<{
    provider?: string | string[]
    order?: string | string[]
  }>
}

export async function generateMetadata({
  params,
}: PaymentPageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params

  if (!hasLocale(rawLocale)) {
    return {}
  }

  const page = await getPageBySlug(rawLocale, "payment-cancel")
  if (!page) return {}
  return {
    ...getLocalizedMetadata({
    locale: rawLocale,
    path: "/payment/cancel",
    title: page.seo.title,
    description: page.seo.description,
    }),
    robots: { index: false, follow: false },
  }
}

export default async function PaymentCancelPage({
  params,
  searchParams,
}: PaymentPageProps) {
  const { locale: rawLocale } = await params
  const query = await searchParams

  return (
    <PaymentStatusPage
      locale={rawLocale as Locale}
      status="cancel"
      provider={
        typeof query?.provider === "string" ? query.provider : undefined
      }
      order={typeof query?.order === "string" ? query.order : undefined}
    />
  )
}
