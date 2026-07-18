import Image from "next/image"
import Link from "next/link"
import type * as React from "react"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
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
import type { MediaAsset } from "@/content/media"
import { locales, localizePath, type Locale } from "@/i18n/routing"
import { cn } from "@/lib/utils"

type SectionProps = {
  eyebrow?: string
  title: string
  summary?: string
  children: React.ReactNode
}

type EditorialHeroProps = {
  locale: Locale
  eyebrow: string
  title: string
  summary: string
  mediaAsset?: MediaAsset
  children?: React.ReactNode
  composition?: "cinematic" | "editorial" | "quiet"
  titleClassName?: string
}

const logoSources = {
  wordmark: "/brand/logo-wordmark-black.png",
  lockup: "/brand/logo-lockup-black.png",
  mark: "/brand/logo-mark-grey.png",
  reversedWordmark: "/brand/purity/wordmark-white.png",
  reversedLockup: "/brand/logo-lockup-reversed.png",
} as const

const logoAlt = {
  uk: "PURITY Fashion Studio",
  ru: "PURITY Fashion Studio",
  en: "PURITY Fashion Studio",
} as const

const logoDimensions = {
  wordmark: { width: 2212, height: 1079 },
  lockup: { width: 2245, height: 1103 },
  mark: { width: 487, height: 808 },
  reversedWordmark: { width: 2218, height: 1085 },
  reversedLockup: { width: 2238, height: 1103 },
} as const

function BrandLogo({
  locale,
  variant = "wordmark",
  className,
  priority,
  decorative = false,
}: {
  locale: Locale
  variant?: keyof typeof logoSources
  className?: string
  priority?: boolean
  decorative?: boolean
}) {
  return (
    <Image
      alt={decorative ? "" : logoAlt[locale]}
      src={logoSources[variant]}
      {...logoDimensions[variant]}
      className={cn("h-auto w-full object-contain", className)}
      loading={priority ? undefined : "eager"}
      preload={priority}
    />
  )
}

function EditorialFaq({
  title,
  items,
  className,
}: {
  title: string
  items: ReadonlyArray<readonly [string, string]>
  className?: string
}) {
  const displayTitle = title.replace(/[.!?]\s*$/, "")

  return (
    <section className={cn("bg-background", className)}>
      <div className="mx-auto grid w-full max-w-6xl min-w-0 gap-12 px-6 py-16 md:px-10 md:py-24 lg:grid-cols-[minmax(20rem,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
        <h2 className="max-w-[14ch] min-w-0 text-[clamp(2rem,4.5vw,3.5rem)] leading-[0.96] font-medium text-balance">
          {displayTitle}
        </h2>
        <Accordion>
          {items.map(([question, answer]) => (
            <AccordionItem key={question} value={question}>
              <AccordionTrigger>{question}</AccordionTrigger>
              <AccordionContent className="max-w-3xl leading-7 text-muted-foreground">
                {answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

function Section({ eyebrow, title, summary, children }: SectionProps) {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-14 md:px-10">
      <div className="mb-8 grid gap-4 md:grid-cols-[0.8fr_1.2fr] md:items-start">
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
      className={cn("relative min-w-0 overflow-hidden bg-muted", className)}
    >
      <figure className="relative size-full">
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
          <div className="size-full bg-muted" />
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

function EditorialHero({
  locale,
  eyebrow,
  title,
  summary,
  mediaAsset,
  children,
  composition = "cinematic",
  titleClassName,
}: EditorialHeroProps) {
  const focalPoint = mediaAsset?.heroFocalPoint ?? "center"

  return (
    <section
      className="relative min-h-svh overflow-hidden bg-foreground text-background"
      data-testid="editorial-hero"
    >
      {mediaAsset?.src && (
        <Image
          alt={mediaAsset.alt[locale]}
          src={mediaAsset.src}
          fill
          preload
          sizes="100vw"
          className={cn(
            "object-cover",
            focalPoint === "left" && "object-left",
            focalPoint === "center" && "object-center",
            focalPoint === "right" && "object-right"
          )}
        />
      )}
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-0 bg-foreground/50",
          composition === "quiet" && "bg-foreground/60",
          composition === "editorial" && "bg-foreground/40"
        )}
      />
      <div
        className={cn(
          "relative mx-auto flex min-h-svh w-full max-w-screen-2xl items-end px-6 pt-32 pb-12 md:px-10 md:pb-16 lg:items-start lg:px-16 lg:pt-48",
          composition === "quiet" && "items-center lg:items-center",
          composition === "editorial" && "items-center lg:items-start"
        )}
      >
        <div
          className={cn(
            "grid w-full max-w-5xl min-w-0 gap-6 [&_.border-border]:border-background/25 [&_.text-foreground]:text-background [&_.text-muted-foreground]:text-background/70 [&>*]:min-w-0",
            composition === "quiet" && "max-w-3xl",
            composition === "editorial" && "lg:max-w-6xl"
          )}
        >
          <p className="text-xs tracking-[0.2em] text-background/70 uppercase">
            {eyebrow}
          </p>
          <h1
            className={cn(
              "max-w-[13ch] text-[clamp(2rem,8vw,7.5rem)] leading-[0.88] font-medium text-pretty",
              titleClassName
            )}
          >
            {title}
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-background/75 md:text-base">
            {summary}
          </p>
          {children && (
            <div className="grid w-full max-w-3xl min-w-0 gap-6 [&>*]:min-w-0">
              {children}
            </div>
          )}
        </div>
      </div>
    </section>
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
    <Card className="h-full min-w-0 overflow-hidden pt-0">
      {image?.src && (
        <AspectRatio ratio={4 / 3} className="bg-muted">
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
      <CardHeader className="pt-2">
        {meta && <Badge variant="default">{meta}</Badge>}
        <CardTitle className="min-w-0 break-words">{title}</CardTitle>
        <CardDescription className="min-w-0 break-words">
          {summary}
        </CardDescription>
      </CardHeader>
      {(status || priceNote) && (
        <CardFooter className="mt-auto grid gap-2 text-xs leading-5 text-muted-foreground">
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
    <Card className="h-full min-w-0 overflow-hidden pt-0">
      {image?.src && (
        <AspectRatio ratio={3 / 2} className="bg-muted">
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
      <CardHeader className="pt-2">
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
        <CardFooter className="mt-auto grid gap-2 text-xs leading-5 text-muted-foreground">
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
    <section className="grid min-h-[34rem] overflow-hidden bg-foreground px-6 py-16 text-background md:px-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-16 lg:px-16 lg:py-20">
      <div className="grid max-w-4xl min-w-0 gap-6">
        <p className="text-xs tracking-[0.2em] text-background/65 uppercase">
          Research. Imagine. Create.
        </p>
        <h3 className="max-w-[15ch] text-[clamp(2.75rem,7vw,6.5rem)] leading-[0.9] font-medium text-pretty">
          {title}
        </h3>
        <p className="max-w-2xl text-sm leading-7 text-background/70">
          {summary}
        </p>
      </div>
      <div className="mt-12 flex min-w-52 flex-col items-start lg:mt-0 lg:items-end lg:self-end">
        {href ? (
          <Link
            className={cn(
              buttonVariants({
                variant: "secondary",
                size: "lg",
                className: "min-h-16 w-full max-w-full px-10 text-sm sm:w-fit",
              })
            )}
            href={href}
          >
            {action}
          </Link>
        ) : (
          <Button
            variant="secondary"
            size="lg"
            type="button"
            disabled
            className="min-h-16 w-full px-10 text-sm sm:w-fit"
          >
            {action}
          </Button>
        )}
      </div>
    </section>
  )
}

export {
  BookingCTA,
  BrandLogo,
  EditorialFaq,
  EditorialHero,
  FeatureList,
  ImageFrame,
  LanguageSwitcher,
  OfferCard,
  Section,
  ServiceCard,
}
