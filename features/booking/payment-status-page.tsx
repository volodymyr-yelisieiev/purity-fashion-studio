import Link from "next/link"
import { notFound } from "next/navigation"

import { EditorialHero } from "@/components/purity"
import { SiteFooter, SiteHeader } from "@/components/site-shell"
import { buttonVariants } from "@/components/ui/button"
import { getMediaAsset } from "@/content/queries"
import {
  paymentStatusCopy,
  providerLabels,
  type PaymentStatus,
} from "@/features/booking/content"
import {
  paymentProviders,
  type PaymentProvider,
} from "@/features/booking/schema"
import { hasLocale, localizePath, type Locale } from "@/i18n/routing"
import { cn } from "@/lib/utils"

type PaymentStatusPageProps = {
  locale: Locale
  status: PaymentStatus
  provider?: string
  order?: string
}

function isPaymentProvider(provider?: string): provider is PaymentProvider {
  return paymentProviders.includes(provider as PaymentProvider)
}

function PaymentStatusPage({
  locale,
  status,
  provider,
  order,
}: PaymentStatusPageProps) {
  if (!hasLocale(locale)) {
    notFound()
  }

  const copy = paymentStatusCopy[status]
  const providerValue = isPaymentProvider(provider)
    ? providerLabels[provider][locale]
    : { uk: "Не вказано", ru: "Не указан", en: "Not provided" }[locale]
  const orderValue =
    order && !/(test|mock|adapter)/i.test(order)
      ? order
      : order
        ? { uk: "Отримано", ru: "Получено", en: "Reference received" }[locale]
        : { uk: "Не вказано", ru: "Не указан", en: "Not provided" }[locale]
  const detailLabels = {
    uk: { provider: "Провайдер", order: "Замовлення" },
    ru: { provider: "Провайдер", order: "Заказ" },
    en: { provider: "Provider", order: "Order" },
  }[locale]

  return (
    <div className="min-h-svh bg-background text-foreground">
      <SiteHeader locale={locale} currentPath={`/payment/${status}`} />
      <main>
        <EditorialHero
          locale={locale}
          eyebrow={detailLabels.provider}
          title={copy.title[locale]}
          summary={copy.summary[locale]}
          mediaAsset={getMediaAsset("editorial-utility-patternmaking")}
          composition="quiet"
        >
          <dl
            role="status"
            data-testid="payment-status-alert"
            data-status={status}
            className="grid max-w-2xl gap-4 border-y border-background/25 py-5 text-background sm:grid-cols-2"
          >
            <div>
              <dt className="text-xs tracking-widest text-background/70 uppercase">
                {detailLabels.provider}
              </dt>
              <dd className="mt-2 text-sm">{providerValue}</dd>
            </div>
            <div>
              <dt className="text-xs tracking-widest text-background/70 uppercase">
                {detailLabels.order}
              </dt>
              <dd className="mt-2 text-sm">{orderValue}</dd>
            </div>
          </dl>
          <Link
            href={localizePath(locale, "/booking")}
            className={cn(
              buttonVariants({
                variant: "secondary",
                size: "lg",
                className: "w-fit",
              })
            )}
          >
            {copy.action[locale]}
          </Link>
        </EditorialHero>
      </main>
      <SiteFooter locale={locale} currentPath={`/payment/${status}`} />
    </div>
  )
}

export { PaymentStatusPage }
