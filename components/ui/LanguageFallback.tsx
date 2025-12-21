import { Link } from '@/i18n/navigation'
import { Container } from './LayoutComponents'
import { H1, Paragraph } from './Typography'
import type { Locale } from '@/lib/payload'

interface LanguageFallbackProps {
  title: string
  description: string
  availableLocales: Locale[]
  currentSlug: string
  basePath: string
  backLink: {
    href: string
    label: string
  }
}

const localeLabels: Record<Locale, string> = {
  en: 'English',
  uk: 'Українська',
  ru: 'Русский',
}

export function LanguageFallback({
  title,
  description,
  availableLocales,
  currentSlug,
  basePath,
  backLink,
}: LanguageFallbackProps) {
  const normalizedBasePath = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath

  return (
    <main className="min-h-[60vh] bg-background">
      <Container size="md" className="py-16 text-center">
        <H1 className="mb-6 font-light">{title}</H1>
        <Paragraph className="mb-10 text-base text-muted-foreground">
          {description}
        </Paragraph>

        <div className="flex flex-wrap justify-center gap-4">
          {availableLocales.map((locale) => (
            <Link
              key={locale}
              href={`${normalizedBasePath}/${currentSlug}`}
              locale={locale}
              className="text-sm uppercase tracking-[0.18em] border-b border-foreground/30 pb-1 transition-colors hover:border-foreground"
            >
              {localeLabels[locale]}
            </Link>
          ))}
        </div>

        <div className="mt-12">
          <Link
            href={backLink.href}
            className="text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
          >
            ← {backLink.label}
          </Link>
        </div>
      </Container>
    </main>
  )
}
