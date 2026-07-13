import type { Metadata } from "next"
import { ArrowSquareOutIcon as ExternalLinkIcon } from "@phosphor-icons/react/dist/ssr"
import { notFound } from "next/navigation"

import { ImageFrame } from "@/components/purity"
import { SiteFooter, SiteHeader } from "@/components/site-shell"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { services, siteSettings } from "@/content/source"
import { getEntryMetadata } from "@/content/metadata"
import { getCategory, getMediaAsset } from "@/content/queries"
import { BookingForm } from "@/features/booking/booking-form"
import { hasLocale, type Locale } from "@/i18n/routing"
import { cn } from "@/lib/utils"

type ContactsPageProps = {
  params: Promise<{ locale: string }>
}

const contactEntryLabels = {
  phone: {
    uk: "Телефон",
    ru: "Телефон",
    en: "Phone",
  },
  email: {
    uk: "Email",
    ru: "Email",
    en: "Email",
  },
  viber: {
    uk: "Viber",
    ru: "Viber",
    en: "Viber",
  },
  socials: {
    uk: "Соціальні канали",
    ru: "Социальные каналы",
    en: "Social channels",
  },
  direct: {
    uk: "Зв’язатися напряму",
    ru: "Связаться напрямую",
    en: "Contact directly",
  },
  address: {
    uk: "Адреса студії",
    ru: "Адрес студии",
    en: "Studio address",
  },
  hours: {
    uk: "Години роботи",
    ru: "Часы работы",
    en: "Opening hours",
  },
  request: {
    uk: "Надіслати запит",
    ru: "Отправить запрос",
    en: "Send an inquiry",
  },
  requestSummary: {
    uk: "Оберіть напрям і зручний спосіб зв’язку. Форма одразу покаже відповідний платіжний маршрут.",
    ru: "Выберите направление и удобный способ связи. Форма сразу покажет подходящий платежный маршрут.",
    en: "Choose a direction and preferred contact method. The form immediately shows the matching payment route.",
  },
} as const

const contactButtonClass =
  "h-auto min-h-11 w-full min-w-0 shrink justify-start overflow-hidden whitespace-normal px-4 text-left leading-5 sm:px-8"

function ContactEntrypoints({ locale }: { locale: Locale }) {
  return (
    <section
      aria-label={contactEntryLabels.socials[locale]}
      className="grid gap-5"
    >
      <h2 className="text-2xl font-medium md:text-3xl">
        {contactEntryLabels.direct[locale]}
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {siteSettings.contacts.phones.map((phone) => (
          <a
            key={phone}
            href={`tel:${phone.replace(/\s+/g, "")}`}
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "lg",
                className: contactButtonClass,
              })
            )}
          >
            {contactEntryLabels.phone[locale]}: {phone}
          </a>
        ))}
        {siteSettings.contacts.email && (
          <a
            href={`mailto:${siteSettings.contacts.email}`}
            aria-label={`${contactEntryLabels.email[locale]}: ${siteSettings.contacts.email}`}
            title={siteSettings.contacts.email}
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "lg",
                className: contactButtonClass,
              })
            )}
          >
            <span className="shrink-0">
              {contactEntryLabels.email[locale]}:
            </span>{" "}
            <span className="min-w-0 truncate">
              {siteSettings.contacts.email}
            </span>
          </a>
        )}
        <a
          href={siteSettings.contacts.viberUrl}
          className={cn(
            buttonVariants({
              variant: "outline",
              size: "lg",
              className: contactButtonClass,
            })
          )}
        >
          {contactEntryLabels.viber[locale]}: {siteSettings.contacts.phone}
        </a>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {siteSettings.contacts.socials.map((social) => (
          <a
            key={social.url}
            href={social.url}
            target="_blank"
            rel="noreferrer"
            data-testid="contact-social-link"
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "lg",
                className: contactButtonClass,
              })
            )}
          >
            {social.label}
            <ExternalLinkIcon aria-hidden="true" className="size-3.5" />
            <span className="sr-only">
              {siteSettings.externalLinkLabel[locale]}
            </span>
          </a>
        ))}
      </div>
    </section>
  )
}

export async function generateMetadata({
  params,
}: ContactsPageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params

  if (!hasLocale(rawLocale)) {
    return {}
  }

  const category = getCategory("contacts")

  if (!category) {
    return {}
  }

  return getEntryMetadata(category, rawLocale, "/contacts")
}

export default async function ContactsPage({ params }: ContactsPageProps) {
  const { locale: rawLocale } = await params

  if (!hasLocale(rawLocale)) {
    notFound()
  }

  const locale: Locale = rawLocale
  const category = getCategory("contacts")

  if (!category) {
    notFound()
  }

  const serviceOptions = services
    .filter((service) => service.visibleInMvp)
    .map((service) => ({
      slug: service.slug,
      title: service.title[locale],
    }))
  const mediaAsset = getMediaAsset("generated-studio-atmosphere")

  return (
    <div className="min-h-svh bg-background text-foreground">
      <SiteHeader locale={locale} currentPath="/contacts" />

      <main>
        <section className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-10 md:grid-cols-[1fr_0.9fr] md:items-end md:px-10 md:py-12">
          <div className="min-w-0">
            <Badge variant="default">{category.title[locale]}</Badge>
            <h1 className="mt-6 text-4xl leading-none font-medium text-balance break-words md:text-6xl xl:text-7xl">
              {category.title[locale]}
            </h1>
            <p className="mt-6 max-w-2xl text-sm leading-7 break-words text-muted-foreground">
              {category.summary[locale]}
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
              {siteSettings.contacts.responseTime[locale]}
            </p>
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
          <div className="mx-auto grid w-full max-w-6xl gap-6 px-6 py-14 lg:px-10">
            <div className="grid min-w-0 gap-6 lg:grid-cols-2 lg:items-start">
              <div className="grid gap-3 sm:grid-cols-2">
                <Card className="min-w-0 border-border bg-background">
                  <CardHeader>
                    <CardTitle className="min-w-0 break-words">
                      {contactEntryLabels.address[locale]}
                    </CardTitle>
                    <CardDescription className="min-w-0 break-words">
                      {siteSettings.contacts.city[locale]}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="border-t border-border pt-5 text-sm leading-7 text-muted-foreground">
                    {siteSettings.contacts.address[locale]}
                  </CardContent>
                </Card>
                <Card className="min-w-0 border-border bg-background">
                  <CardHeader>
                    <CardTitle className="min-w-0 break-words">
                      {contactEntryLabels.hours[locale]}
                    </CardTitle>
                    <CardDescription className="min-w-0 break-words">
                      {siteSettings.contacts.hours[locale]}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
              <ContactEntrypoints locale={locale} />
            </div>

            <Card className="min-w-0 border-border bg-background">
              <CardHeader>
                <CardTitle className="min-w-0 break-words">
                  {contactEntryLabels.request[locale]}
                </CardTitle>
                <CardDescription className="min-w-0 break-words">
                  {contactEntryLabels.requestSummary[locale]}
                </CardDescription>
              </CardHeader>
              <CardContent className="border-t border-border pt-6">
                <BookingForm
                  locale={locale}
                  services={serviceOptions}
                  initialServiceSlug={serviceOptions[0]?.slug ?? ""}
                />
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <SiteFooter locale={locale} currentPath="/contacts" />
    </div>
  )
}
