import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import { Card } from './Card'
import { Button } from './Button'
import { cn } from '@/lib/utils'

interface ContentCardProps {
  title: string
  description?: string | null
  category?: string | null
  image?: {
    url: string | null
    alt?: string | null
  } | null
  price?: {
    eur?: number | null
    uah?: number | null
    note?: string | null
  } | null
  metadata?: {
    label: string
    value: string
  }[]
  link: {
    href: string
    label?: string
  }
  variant?: 'default' | 'portfolio' | 'collection' | 'service' | 'course'
  className?: string
}

export function ContentCard({
  title,
  description,
  category,
  image,
  price,
  metadata,
  link,
  className
}: ContentCardProps) {
  return (
    <Link href={link.href} className={cn("group block h-full", className)}>
      <Card hoverable className="h-full flex flex-col overflow-hidden transition-all duration-300">
        {/* Image - Consistent 4:5 aspect ratio for all cards */}
        <div className="relative aspect-4/5 w-full overflow-hidden bg-neutral-100">
          {image?.url ? (
            <Image
              src={image.url}
              alt={image.alt || title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-serif text-4xl text-neutral-300">P</span>
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="flex-1 flex flex-col p-6 md:p-8">
          {/* Category - Small caps tracking */}
          {category && (
            <p className="font-sans text-[10px] font-medium uppercase tracking-[0.25em] text-neutral-500 mb-3">
              {category}
            </p>
          )}
          
          {/* Title - Serif font, elegant */}
          <h3 className="font-serif text-xl md:text-2xl font-light tracking-tight mb-3 group-hover:opacity-70 transition-opacity duration-300">
            {title}
          </h3>
          
          {/* Description */}
          {description && (
            <p className="font-sans text-sm text-neutral-600 leading-relaxed mb-4 line-clamp-3">
              {description}
            </p>
          )}
          
          {/* Metadata */}
          {metadata && metadata.length > 0 && (
            <div className="space-y-1.5 mb-4">
              {metadata.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="font-sans text-neutral-500">{item.label}</span>
                  <span className="font-sans font-medium text-neutral-900">{item.value}</span>
                </div>
              ))}
            </div>
          )}
          
          {/* Spacer to push price and button to bottom */}
          <div className="flex-1 min-h-4" />
          
          {/* Price - Always at bottom, before button */}
          {price && (price.eur || price.uah) && (
            <div className="mb-4 pt-4 border-t border-neutral-200">
              <p className="font-serif text-2xl md:text-3xl font-light tracking-tight">
                {price.eur && `€${price.eur}`}
                {price.eur && price.uah && <span className="text-neutral-400 mx-2">/</span>}
                {price.uah && `₴${price.uah}`}
              </p>
              {price.note && (
                <p className="font-sans text-xs text-neutral-500 mt-1">
                  {price.note}
                </p>
              )}
            </div>
          )}
          
          {/* CTA Button - Always at very bottom */}
          <div className={cn("mt-auto", !price?.eur && !price?.uah && "pt-4 border-t border-neutral-200")}>
            <Button 
              variant="primary" 
              size="sm"
              className="w-full"
              asChild
            >
              <span>{link.label || 'Learn More'}</span>
            </Button>
          </div>
        </div>
      </Card>
    </Link>
  )
}
