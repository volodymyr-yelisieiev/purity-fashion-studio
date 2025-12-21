import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { H3, Paragraph, Label } from '@/components/ui/typography'

export interface ContentCardItem {
  id: string
  type: 'service' | 'portfolio' | 'collection' | 'course'
  title: string
  href: string
  image?: { url: string; alt?: string }
  excerpt?: string
  category?: string | null
  categoryLabel?: string | null
  priceDisplay?: string | null
  duration?: string | null
  format?: string | null
  date?: string | null
}

interface ContentCardProps {
  item: ContentCardItem
  learnMoreText?: string
  showType?: boolean
  aspectRatio?: 'square' | '4/3' | '3/2' | '4/5' | '16/9'
}

const aspectClasses = {
  square: 'aspect-square',
  '4/3': 'aspect-4/3',
  '3/2': 'aspect-3/2',
  '4/5': 'aspect-4/5',
  '16/9': 'aspect-video',
}

export function ContentCard({
  item,
  learnMoreText = 'Learn More →',
  showType = true,
  aspectRatio = '4/3',
}: ContentCardProps) {
  return (
    <Link
      href={item.href}
      className="group block overflow-hidden border border-border transition-colors hover:border-foreground"
      prefetch={false}
    >
      {item.image?.url && (
        <div className={`relative overflow-hidden bg-muted ${aspectClasses[aspectRatio]}`}>
          <Image
            src={item.image.url}
            alt={item.image.alt || item.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-6 space-y-3">
        {/* Type and Category */}
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {showType && <span>{item.type}</span>}
          {item.categoryLabel && (
            <>
              {showType && <span className="text-foreground/70">•</span>}
              <span className={showType ? 'text-foreground/70' : ''}>{item.categoryLabel}</span>
            </>
          )}
        </div>

        {/* Title */}
        <H3 className="text-2xl font-light leading-tight group-hover:text-foreground">
          {item.title}
        </H3>

        {/* Excerpt */}
        {item.excerpt && (
          <Paragraph className="text-muted-foreground line-clamp-2">
            {item.excerpt}
          </Paragraph>
        )}

        {/* Metadata: Duration, Format, Date */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-foreground">
          {item.duration && (
            <Label className="text-xs! tracking-[0.15em]!">{item.duration}</Label>
          )}
          {item.format && (
            <span className="rounded-full border px-3 py-1 text-xs uppercase tracking-[0.15em]">
              {item.format}
            </span>
          )}
          {item.date && (
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              {item.date}
            </span>
          )}
        </div>

        {/* Learn More */}
        <span className="inline-block text-sm font-medium uppercase tracking-widest text-foreground/80 transition-opacity group-hover:opacity-80">
          {learnMoreText}
        </span>
      </div>
    </Link>
  )
}
