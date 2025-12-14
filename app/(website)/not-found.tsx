import {NextIntlClientProvider} from 'next-intl';
import {getLocale, getMessages, getTranslations} from 'next-intl/server';
import {RootLayout as AppRootLayout} from '@/components/layout/RootLayout';
import {Link} from '@/i18n/navigation';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { H1, Lead } from '@/components/ui/typography';
import { Container, PageHeader } from '@/components/ui/layout-components';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({locale, namespace: 'notFound'});
  
  return {
    title: t('title'),
    description: t('description'),
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function NotFound() {
  const locale = await getLocale();
  const [messages, t] = await Promise.all([
    getMessages(),
    getTranslations({locale, namespace: 'notFound'})
  ]);

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <AppRootLayout>
        <PageHeader fullHeight centered>
          <Container size="sm">
            <span className="mb-4 font-serif text-8xl font-light text-muted-foreground/30">404</span>
            <H1 className="mb-4">{t('title')}</H1>
            <Lead className="mb-8 max-w-md">{t('description')}</Lead>
            <Button asChild size="lg">
              <Link href="/">{t('backHome')}</Link>
            </Button>
          </Container>
        </PageHeader>
      </AppRootLayout>
    </NextIntlClientProvider>
  );
}
