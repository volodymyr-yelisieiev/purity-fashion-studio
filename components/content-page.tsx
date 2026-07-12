import Link from "next/link"
import type * as React from "react"

import { ImageFrame } from "@/components/purity"
import { SiteFooter, SiteHeader } from "@/components/site-shell"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { MediaAsset } from "@/content/model"
import type { Locale } from "@/i18n/routing"
import { cn } from "@/lib/utils"

type ContentPageProps = {
  locale: Locale
  currentPath: string
  eyebrow: string
  title: string
  summary: string
  items?: string[]
  mediaAsset?: MediaAsset
  action?: {
    label: string
    href: string
  }
  children?: React.ReactNode
}

function ContentPage({
  locale,
  currentPath,
  eyebrow,
  title,
  summary,
  items,
  mediaAsset,
  action,
  children,
}: ContentPageProps) {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <SiteHeader locale={locale} currentPath={currentPath} />

      <main>
        <section className="mx-auto grid w-full max-w-6xl min-w-0 grid-cols-1 gap-10 px-6 py-16 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:px-10">
          <div className="min-w-0">
            <Badge variant="default">{eyebrow}</Badge>
            <h1 className="mt-6 text-4xl leading-none font-medium text-balance break-words md:text-6xl xl:text-7xl">
              {title}
            </h1>
            <p className="mt-6 max-w-2xl text-sm leading-7 break-words text-muted-foreground">
              {summary}
            </p>
          </div>
          <div className="min-w-0 border-t border-border pt-5">
            {mediaAsset?.src && (
              <ImageFrame
                alt={mediaAsset.alt[locale]}
                src={mediaAsset.src}
                label={eyebrow}
                eager
                className="mb-6 aspect-[4/5]"
              />
            )}
            {children}
            {action && (
              <Link
                href={action.href}
                className={cn(
                  buttonVariants({
                    variant: "default",
                    size: "lg",
                    className: "mt-6 w-fit max-w-full",
                  })
                )}
              >
                {action.label}
              </Link>
            )}
          </div>
        </section>

        {items && (
          <section className="mx-auto w-full max-w-6xl min-w-0 px-6 pb-16 md:px-10">
            <div className="grid min-w-0 gap-3 md:grid-cols-2">
              {items.map((item) => (
                <Card
                  key={item}
                  data-size="sm"
                  className="min-w-0 border-border"
                >
                  <CardContent className="text-sm leading-7 break-words text-muted-foreground">
                    {item}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </main>
      <SiteFooter locale={locale} currentPath={currentPath} />
    </div>
  )
}

export { ContentPage }
