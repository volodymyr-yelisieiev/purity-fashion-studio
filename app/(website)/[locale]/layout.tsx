import { hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { RootLayout as AppRootLayout } from "@/components/layout/RootLayout";

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  // Validate locale
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <AppRootLayout>
        {children}
      </AppRootLayout>
    </NextIntlClientProvider>
  )
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}
