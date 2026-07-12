import Link from "next/link"
import { notFound } from "next/navigation"

import { ContentPage } from "@/components/content-page"
import { SiteFooter, SiteHeader } from "@/components/site-shell"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
  if (status === "success" || status === "failure" || status === "cancel") {
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
          <section className="mx-auto grid w-full max-w-3xl min-w-0 gap-5 px-6 py-14 md:px-10 md:py-20">
            <Alert
              variant={status === "failure" ? "destructive" : undefined}
              data-testid="payment-status-alert"
              data-status={status}
              className="border-border bg-muted"
            >
              <h1 className="text-lg font-semibold">{copy.title[locale]}</h1>
              <AlertDescription>{copy.summary[locale]}</AlertDescription>
            </Alert>
            <Card className="min-w-0 border-border bg-background">
              <CardContent className="grid gap-3 p-6 sm:grid-cols-2">
                <div className="border-t border-border pt-3">
                  <p className="text-xs tracking-widest text-muted-foreground uppercase">
                    {detailLabels.provider}
                  </p>
                  <p className="mt-2 text-sm leading-6">{providerValue}</p>
                </div>
                <div className="border-t border-border pt-3">
                  <p className="text-xs tracking-widest text-muted-foreground uppercase">
                    {detailLabels.order}
                  </p>
                  <p className="mt-2 text-sm leading-6 [overflow-wrap:anywhere]">
                    {orderValue}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Link
              href={localizePath(locale, "/booking")}
              className={cn(
                buttonVariants({
                  variant: "default",
                  size: "lg",
                  className: "w-fit",
                })
              )}
            >
              {copy.action[locale]}
            </Link>
          </section>
        </main>
        <SiteFooter locale={locale} currentPath={`/payment/${status}`} />
      </div>
    )
  }

  return (
    <ContentPage
      locale={locale}
      currentPath={`/payment/${status}`}
      eyebrow={copy.eyebrow[locale]}
      title={copy.title[locale]}
      summary={copy.summary[locale]}
    >
      <Link
        href={localizePath(locale, "/booking")}
        className={cn(
          buttonVariants({
            variant: "default",
            size: "lg",
            className: "mt-6",
          })
        )}
      >
        {copy.action[locale]}
      </Link>
    </ContentPage>
  )
}

export { PaymentStatusPage }
