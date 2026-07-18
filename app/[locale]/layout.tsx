import type { Metadata } from "next"
import { Noto_Sans, Noto_Serif } from "next/font/google"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { notFound } from "next/navigation"
import type * as React from "react"

import "../globals.css"
import { MotionProvider } from "@/components/motion-provider"
import { Analytics } from "@/components/analytics"
import { StructuredData } from "@/components/structured-data"
import { getLocalizedMetadata } from "@/content/metadata"
import { getHome } from "@/content/public-api"
import { hasLocale, locales } from "@/i18n/routing"
import { getSiteURL } from "@/lib/site-url"
import { cn } from "@/lib/utils"

// Public content is read from Payload at request time. This avoids baking a
// database snapshot into a build and lets revalidation hooks publish changes.
export const dynamic = "force-dynamic"

const notoSans = Noto_Sans({
  variable: "--font-sans",
  subsets: ["cyrillic", "cyrillic-ext", "latin"],
  weight: "variable",
  display: "swap",
})

const notoSerif = Noto_Serif({
  variable: "--font-heading",
  subsets: ["cyrillic", "cyrillic-ext", "latin"],
  weight: "variable",
  display: "swap",
})

type LocaleParams = {
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: LocaleParams): Promise<Metadata> {
  const { locale } = await params

  if (!hasLocale(locale)) {
    return {}
  }

  const home = await getHome(locale)
  const metadata = getLocalizedMetadata({
    locale,
    title: home.seo.title,
    description: home.seo.description,
  })

  return {
    ...metadata,
  }
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<
  {
    children: React.ReactNode
  } & LocaleParams
>) {
  const { locale } = await params

  if (!hasLocale(locale)) {
    notFound()
  }

  const messages = await getMessages({ locale })
  const siteURL = getSiteURL()

  return (
    <html
      lang={locale}
      className={cn(
        "font-sans antialiased",
        notoSans.variable,
        notoSerif.variable
      )}
    >
      <body>
        <StructuredData
          data={[
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "PURITY Fashion Studio",
              url: siteURL,
              email: "voronina@purity-fashion.com",
              telephone: "+380676561912",
            },
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "PURITY Fashion Studio",
              url: siteURL,
              inLanguage: locales,
            },
          ]}
        />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <MotionProvider>{children}</MotionProvider>
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  )
}
