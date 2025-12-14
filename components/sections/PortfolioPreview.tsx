import Image from 'next/image'
import Link from 'next/link'

interface PortfolioItem {
  id: string
  title: string
  slug: string
  featuredImage?: {
    url: string
    alt?: string
  }
}

interface PortfolioPreviewProps {
  items: PortfolioItem[]
  title?: string
  viewAllText?: string
  viewAllLink?: string
}

export function PortfolioPreview({
  items,
  title = 'Portfolio',
  viewAllText = 'View All',
  viewAllLink = '/portfolio',
}: PortfolioPreviewProps) {
  return (
    <section className="bg-background px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-16 text-center font-display text-heading-lg font-light tracking-tight text-foreground">
          {title}
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/portfolio/${item.slug}`}
              className="group relative aspect-square overflow-hidden bg-neutral-200 dark:bg-neutral-800"
            >
              {item.featuredImage?.url && (
                <Image
                  src={item.featuredImage.url}
                  alt={item.featuredImage.alt || item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 flex items-end bg-black/0 p-6 transition-colors group-hover:bg-black/40">
                <h3 className="font-display text-heading-sm font-light text-white opacity-0 transition-opacity group-hover:opacity-100">
                  {item.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
        {viewAllLink && (
          <div className="mt-16 text-center">
            <Link
              href={viewAllLink}
              className="inline-block border border-foreground px-8 py-4 text-body-sm font-medium uppercase tracking-widest text-foreground transition-colors hover:bg-foreground hover:text-background"
            >
              {viewAllText}
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
