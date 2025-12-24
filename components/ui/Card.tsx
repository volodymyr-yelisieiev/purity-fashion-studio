/**
 * Card Component
 *
 * Reusable card component for displaying content in a consistent style.
 * Follows minimalist design principles: white background, subtle borders,
 * clean typography, and smooth hover transitions.
 *
 * @example
 * <Card>
 *   <CardImage src="/image.jpg" alt="Description" />
 *   <CardContent>
 *     <CardTitle>Card Title</CardTitle>
 *     <CardDescription>Description text</CardDescription>
 *   </CardContent>
 * </Card>
 */

import { cn } from '@/lib/utils'
import Image from 'next/image'
import type { HTMLAttributes, ReactNode } from 'react'

/* ============================================
   Card Container
   ============================================ */

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  /** Apply hover effects */
  hoverable?: boolean
  /** Remove border and background */
  plain?: boolean
  className?: string
}

/**
 * Card - Base container with consistent styling
 */
export function Card({
  children,
  hoverable = false,
  plain = false,
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-sm',
        !plain && 'border border-border bg-background',
        hoverable && 'transition-shadow duration-200 hover:shadow-md',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/* ============================================
   Card Image
   ============================================ */

interface CardImageProps {
  src: string
  alt: string
  /** Aspect ratio preset */
  aspect?: 'portrait' | 'landscape' | 'square'
  /** Custom aspect ratio (e.g., '4/3') */
  aspectRatio?: string
  /** Priority loading for above-fold images */
  priority?: boolean
  className?: string
}

const aspectRatios = {
  portrait: 'aspect-4/5',
  landscape: 'aspect-4/3',
  square: 'aspect-square',
}

/**
 * CardImage - Image component for cards with aspect ratio handling
 */
export function CardImage({
  src,
  alt,
  aspect = 'portrait',
  aspectRatio,
  priority = false,
  className,
}: CardImageProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden bg-muted',
        aspectRatio ? `aspect-[${aspectRatio}]` : aspectRatios[aspect],
        className
      )}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        className="object-cover transition-transform duration-300 hover:scale-105"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  )
}

/* ============================================
   Card Content
   ============================================ */

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  /** Padding size */
  padding?: 'sm' | 'md' | 'lg'
  className?: string
}

const paddingSizes = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

/**
 * CardContent - Container for card text content
 */
export function CardContent({
  children,
  padding = 'md',
  className,
  ...props
}: CardContentProps) {
  return (
    <div className={cn(paddingSizes[padding], className)} {...props}>
      {children}
    </div>
  )
}

/* ============================================
   Card Title
   ============================================ */

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode
  /** Heading level for accessibility */
  as?: 'h2' | 'h3' | 'h4'
  className?: string
}

/**
 * CardTitle - Card heading with consistent styling
 */
export function CardTitle({
  children,
  as: Component = 'h3',
  className,
  ...props
}: CardTitleProps) {
  return (
    <Component
      className={cn(
        'font-serif text-lg font-light tracking-tight text-foreground',
        'md:text-xl',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}

/* ============================================
   Card Description
   ============================================ */

interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode
  className?: string
}

/**
 * CardDescription - Secondary text for cards
 */
export function CardDescription({
  children,
  className,
  ...props
}: CardDescriptionProps) {
  return (
    <p
      className={cn(
        'mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-3',
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
}

/* ============================================
   Card Footer
   ============================================ */

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  className?: string
}

/**
 * CardFooter - Footer area for prices, buttons, metadata
 */
export function CardFooter({
  children,
  className,
  ...props
}: CardFooterProps) {
  return (
    <div
      className={cn(
        'mt-4 flex items-center justify-between gap-4',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/* ============================================
   Card Price
   ============================================ */

interface CardPriceProps extends HTMLAttributes<HTMLDivElement> {
  /** Price in EUR */
  eur?: number | null
  /** Price in UAH */
  uah?: number | null
  /** Optional price note (e.g., "from", "per hour") */
  note?: string
  className?: string
}

/**
 * CardPrice - Price display with EUR/UAH
 */
export function CardPrice({
  eur,
  uah,
  note,
  className,
  ...props
}: CardPriceProps) {
  const hasPrice = eur || uah

  if (!hasPrice) {
    return (
      <div className={cn('text-sm text-muted-foreground', className)} {...props}>
        Price on request
      </div>
    )
  }

  return (
    <div className={cn('text-sm', className)} {...props}>
      {note && (
        <span className="text-muted-foreground mr-1">{note}</span>
      )}
      {eur && (
        <span className="font-medium text-foreground">€{eur}</span>
      )}
      {eur && uah && (
        <span className="text-muted-foreground mx-1">/</span>
      )}
      {uah && (
        <span className="text-muted-foreground">₴{uah.toLocaleString()}</span>
      )}
    </div>
  )
}
