import type { Metadata } from "next"

import { getLocalizedMetadata } from "@/content/metadata"
import { paymentStatusCopy } from "@/features/booking/content"
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

  return getLocalizedMetadata({
    locale: rawLocale,
    path: "/payment/success",
    title: `${paymentStatusCopy.success.title[rawLocale]} | PURITY`,
    description: paymentStatusCopy.success.summary[rawLocale],
  })
}

export default async function PaymentSuccessPage({
  params,
  searchParams,
}: PaymentPageProps) {
  const { locale: rawLocale } = await params
  const query = await searchParams

  return (
    <PaymentStatusPage
      locale={rawLocale as Locale}
      status="success"
      provider={
        typeof query?.provider === "string" ? query.provider : undefined
      }
      order={typeof query?.order === "string" ? query.order : undefined}
    />
  )
}
