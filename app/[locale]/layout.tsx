import type { Metadata } from "next"
import { Noto_Sans, Noto_Serif } from "next/font/google"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { notFound } from "next/navigation"
import type * as React from "react"

import "../globals.css"
import { MotionProvider } from "@/components/motion-provider"
import { getSiteMetadata } from "@/content/metadata"
import { hasLocale, locales } from "@/i18n/routing"
import { cn } from "@/lib/utils"

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

  const metadata = getSiteMetadata(locale)

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
        <NextIntlClientProvider locale={locale} messages={messages}>
          <MotionProvider>{children}</MotionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
