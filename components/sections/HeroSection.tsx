import Link from 'next/link'

interface HeroSectionProps {
  title: string
  subtitle?: string
  ctaText?: string
  ctaLink?: string
}

export function HeroSection({
  title,
  subtitle,
  ctaText,
  ctaLink,
}: HeroSectionProps) {
  return (
    <section className="relative flex min-h-[80vh] flex-col items-center justify-center bg-background px-6 text-center">
      <div className="max-w-4xl">
        <h1 className="font-display text-display-lg font-light tracking-tight text-foreground md:text-display-xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-6 text-body-lg text-muted-foreground md:text-body-xl">
            {subtitle}
          </p>
        )}
        {ctaText && ctaLink && (
          <Link
            href={ctaLink}
            className="mt-10 inline-block border border-foreground px-8 py-4 text-body-sm font-medium uppercase tracking-widest text-foreground transition-colors hover:bg-foreground hover:text-background"
          >
            {ctaText}
          </Link>
        )}
      </div>
    </section>
  )
}
