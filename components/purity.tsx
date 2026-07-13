import Image from "next/image"
import Link from "next/link"
import type * as React from "react"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { mediaAssets } from "@/content/source"
import { locales, localizePath, type Locale } from "@/i18n/routing"
import { cn } from "@/lib/utils"

type SectionProps = {
  eyebrow?: string
  title: string
  summary?: string
  children: React.ReactNode
}

const logoVariantIds = {
  wordmark: "logo-wordmark-black",
  lockup: "logo-lockup-black",
  mark: "logo-mark-grey",
  reversedWordmark: "logo-wordmark-reversed",
  reversedLockup: "logo-lockup-reversed",
} as const

const logoDimensions = {
  wordmark: { width: 1320, height: 540 },
  lockup: { width: 1308, height: 615 },
  mark: { width: 250, height: 452 },
  reversedWordmark: { width: 1315, height: 710 },
  reversedLockup: { width: 1305, height: 564 },
} as const

function BrandLogo({
  locale,
  variant = "wordmark",
  className,
  priority,
}: {
  locale: Locale
  variant?: keyof typeof logoVariantIds
  className?: string
  priority?: boolean
}) {
  const logo = mediaAssets.find((asset) => asset.id === logoVariantIds[variant])

  if (!logo?.src) {
    return null
  }

  return (
    <Image
      alt={logo.alt[locale]}
      src={logo.src}
      {...logoDimensions[variant]}
      className={cn(
        "h-auto w-full object-contain dark:brightness-0 dark:invert",
        className
      )}
      loading={priority ? undefined : "eager"}
      preload={priority}
    />
  )
}

function Section({ eyebrow, title, summary, children }: SectionProps) {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-14 md:px-10">
      <div className="mb-8 grid gap-4 md:grid-cols-[0.8fr_1.2fr] md:items-end">
        <div>
          {eyebrow && (
            <p className="mb-3 text-xs tracking-normal text-muted-foreground uppercase">
              {eyebrow}
            </p>
          )}
          <h2 className="text-3xl leading-tight font-medium text-balance md:text-5xl">
            {title}
          </h2>
        </div>
        {summary && (
          <p className="text-sm leading-7 text-muted-foreground">{summary}</p>
        )}
      </div>
      {children}
    </section>
  )
}

function ImageFrame({
  alt,
  src,
  label,
  className,
  eager,
  ratio = 4 / 5,
}: {
  alt: string
  src?: string
  label?: string
  className?: string
  eager?: boolean
  ratio?: number
}) {
  return (
    <AspectRatio
      ratio={ratio}
      className={cn(
        "min-w-0 overflow-hidden border border-border bg-muted",
        className
      )}
    >
      <figure className="size-full">
        {src ? (
          <Image
            alt={alt}
            src={src}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            loading={eager ? "eager" : "lazy"}
            fetchPriority={eager ? "high" : undefined}
            className="object-cover"
          />
        ) : (
          <div className="size-full bg-[repeating-linear-gradient(90deg,var(--muted),var(--muted)_18px,var(--secondary)_18px,var(--secondary)_19px)]" />
        )}
        {label && (
          <figcaption className="absolute right-3 bottom-3 bg-background/90 px-2 py-1 text-xs text-muted-foreground">
            {label}
          </figcaption>
        )}
      </figure>
    </AspectRatio>
  )
}

function LanguageSwitcher({
  currentLocale,
  currentPath = "/",
  ariaLabel = "Language",
  className,
  linkClassName,
}: {
  currentLocale: Locale
  currentPath?: string
  ariaLabel?: string
  className?: string
  linkClassName?: string
}) {
  return (
    <nav
      className={cn("flex items-center gap-1", className)}
      aria-label={ariaLabel}
    >
      {locales.map((locale) => (
        <Link
          key={locale}
          href={localizePath(locale, currentPath)}
          aria-current={locale === currentLocale ? "page" : undefined}
          className={cn(
            "inline-flex min-h-11 min-w-11 items-center justify-center px-3 text-xs text-muted-foreground uppercase hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
            locale === currentLocale &&
              "text-foreground underline underline-offset-4",
            linkClassName
          )}
        >
          {locale}
        </Link>
      ))}
    </nav>
  )
}

function ServiceCard({
  title,
  summary,
  meta,
  status,
  priceNote,
  image,
}: {
  title: string
  summary: string
  meta?: string
  status?: string
  priceNote?: string
  image?: {
    src?: string
    alt: string
  }
}) {
  return (
    <Card className="h-full min-w-0 overflow-hidden border-border bg-background pt-0">
      {image?.src && (
        <AspectRatio ratio={4 / 3} className="border-b border-border bg-muted">
          <Image
            alt={image.alt}
            src={image.src}
            fill
            loading="eager"
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover"
          />
        </AspectRatio>
      )}
      <CardHeader>
        {meta && <Badge variant="default">{meta}</Badge>}
        <CardTitle className="min-w-0 break-words">{title}</CardTitle>
        <CardDescription className="min-w-0 break-words">
          {summary}
        </CardDescription>
      </CardHeader>
      {(status || priceNote) && (
        <CardFooter className="mt-auto grid gap-2 border-t border-border pt-5 text-xs leading-5 text-muted-foreground">
          {status && <p>{status}</p>}
          {priceNote && <p>{priceNote}</p>}
        </CardFooter>
      )}
    </Card>
  )
}

function OfferCard({
  title,
  summary,
  children,
  status,
  priceNote,
  image,
}: {
  title: string
  summary: string
  children?: React.ReactNode
  status?: string
  priceNote?: string
  image?: {
    src?: string
    alt: string
  }
}) {
  return (
    <Card className="h-full min-w-0 overflow-hidden border-border bg-background pt-0">
      {image?.src && (
        <AspectRatio ratio={4 / 3} className="border-b border-border bg-muted">
          <Image
            alt={image.alt}
            src={image.src}
            fill
            loading="eager"
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </AspectRatio>
      )}
      <CardHeader>
        <CardTitle className="min-w-0 break-words">{title}</CardTitle>
        <CardDescription className="min-w-0 break-words">
          {summary}
        </CardDescription>
      </CardHeader>
      {children && (
        <CardContent className="flex flex-1 flex-col gap-4">
          {children}
        </CardContent>
      )}
      {(status || priceNote) && (
        <CardFooter className="mt-auto grid gap-2 border-t border-border pt-4 text-xs leading-5 text-muted-foreground">
          {status && <p>{status}</p>}
          {priceNote && <p>{priceNote}</p>}
        </CardFooter>
      )}
    </Card>
  )
}

function FeatureList({
  items,
  className,
}: {
  items: string[]
  className?: string
}) {
  return (
    <ul className={cn("grid gap-2 text-sm text-muted-foreground", className)}>
      {items.map((item) => (
        <li key={item} className="flex min-w-0 gap-2">
          <span
            aria-hidden="true"
            className="mt-2 size-1.5 shrink-0 bg-current"
          />
          <span className="min-w-0 break-words">{item}</span>
        </li>
      ))}
    </ul>
  )
}

function BookingCTA({
  title,
  summary,
  action,
  href,
}: {
  title: string
  summary: string
  action: string
  href?: string
}) {
  return (
    <div className="grid gap-6 border border-border bg-muted px-6 py-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)]">
        <h3 className="text-2xl font-medium break-words">{title}</h3>
        <p className="mt-2 text-sm leading-6 break-words text-muted-foreground">
          {summary}
        </p>
      </div>
      {href ? (
        <Link
          className={cn(
            buttonVariants({
              variant: "default",
              size: "lg",
              className: "max-w-full",
            })
          )}
          href={href}
        >
          {action}
        </Link>
      ) : (
        <Button variant="default" size="lg" type="button" disabled>
          {action}
        </Button>
      )}
    </div>
  )
}

export {
  BookingCTA,
  BrandLogo,
  FeatureList,
  ImageFrame,
  LanguageSwitcher,
  OfferCard,
  Section,
  ServiceCard,
}
