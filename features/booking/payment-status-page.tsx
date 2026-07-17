import Link from "next/link"
import { notFound } from "next/navigation"

import { EditorialHero } from "@/components/purity"
import { SiteFooter, SiteHeader } from "@/components/cms-site-shell"
import { buttonVariants } from "@/components/ui/button"
import { providerLabels, type PaymentStatus } from "@/features/booking/content"
import { getPageBySlug } from "@/content/public-api"
import {
  paymentProviders,
  type PaymentProvider,
} from "@/features/booking/schema"
import { getVerifiedPaymentStatus } from "@/features/booking/payment-status"
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

async function PaymentStatusPage({
  locale,
  status,
  provider,
  order,
}: PaymentStatusPageProps) {
  if (!hasLocale(locale)) {
    notFound()
  }

  const verified = await getVerifiedPaymentStatus(order, status)
  const page = await getPageBySlug(locale, `payment-${verified.status}`)
  if (!page) notFound()
  const verifiedProvider = verified.provider ?? provider
  const providerValue = isPaymentProvider(verifiedProvider)
    ? providerLabels[verifiedProvider][locale]
    : { uk: "Не вказано", ru: "Не указан", en: "Not provided" }[locale]
  const orderValue =
    verified.orderReference &&
      !/(test|mock|adapter)/i.test(verified.orderReference)
      ? verified.orderReference
      : verified.orderReference
        ? { uk: "Отримано", ru: "Получено", en: "Reference received" }[locale]
        : { uk: "Не вказано", ru: "Не указан", en: "Not provided" }[locale]
  const detailLabels = {
    uk: { provider: "Провайдер", order: "Замовлення" },
    ru: { provider: "Провайдер", order: "Заказ" },
    en: { provider: "Provider", order: "Order" },
  }[locale]

  return (
    <div className="min-h-svh bg-background text-foreground">
      <SiteHeader locale={locale} currentPath={`/payment/${verified.status}`} />
      <main>
        <EditorialHero
          locale={locale}
          eyebrow={page.eyebrow ?? detailLabels.provider}
          title={page.title}
          summary={page.summary}
          composition="quiet"
        >
          <dl
            role="status"
            data-testid="payment-status-alert"
            data-status={verified.status}
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
            {page.cta?.label ?? page.title}
          </Link>
        </EditorialHero>
      </main>
      <SiteFooter locale={locale} currentPath={`/payment/${verified.status}`} />
    </div>
  )
}

export { PaymentStatusPage }
