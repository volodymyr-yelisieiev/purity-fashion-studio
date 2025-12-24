/**
 * Typography Components
 * 
 * Centralized typography components for consistent styling across the site.
 * Use these components instead of raw HTML elements for headings and text.
 * 
 * @example
 * import { H1, H2, Paragraph, Lead } from '@/components/ui'
 * 
 * <H1>Main Title</H1>
 * <Lead>Introductory paragraph with larger text</Lead>
 * <Paragraph>Regular body text</Paragraph>
 */

import { cn } from '@/lib/utils'
import type { HTMLAttributes, ReactNode } from 'react'
import { FadeInStagger, FadeInStaggerContainer } from '@/components/animations/FadeInStagger'

interface TypographyProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode
  className?: string
}

/**
 * H1 - Main page title
 * Use once per page for the primary heading
 */
export function H1({ children, className, ...props }: TypographyProps) {
  return (
    <h1
      className={cn(
        'font-serif text-4xl font-light tracking-tight text-foreground',
        'md:text-5xl lg:text-6xl',
        className
      )}
      {...props}
    >
      {children}
    </h1>
  )
}

/**
 * H2 - Section headings
 * Use for major section titles within a page
 */
export function H2({ children, className, ...props }: TypographyProps) {
  return (
    <h2
      className={cn(
        'font-serif text-3xl font-light tracking-tight text-foreground',
        'md:text-4xl',
        className
      )}
      {...props}
    >
      {children}
    </h2>
  )
}

/**
 * H3 - Subsection headings
 * Use for grouping content within sections
 */
export function H3({ children, className, ...props }: TypographyProps) {
  return (
    <h3
      className={cn(
        'font-serif text-2xl font-light tracking-tight text-foreground',
        'md:text-3xl',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  )
}

/**
 * H4 - Minor headings
 * Use for card titles, list headers, etc.
 */
export function H4({ children, className, ...props }: TypographyProps) {
  return (
    <h4
      className={cn(
        'font-serif text-xl font-light text-foreground',
        'md:text-2xl',
        className
      )}
      {...props}
    >
      {children}
    </h4>
  )
}

/**
 * Paragraph - Standard body text
 * Use for regular paragraphs and descriptions
 */
export function Paragraph({ children, className, ...props }: TypographyProps) {
  return (
    <p
      className={cn(
        'text-base leading-relaxed text-muted-foreground',
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
}

/**
 * Lead - Larger introductory text
 * Use for subtitles, hero descriptions, section introductions
 */
export function Lead({ children, className, ...props }: TypographyProps) {
  return (
    <p
      className={cn(
        'text-lg leading-relaxed text-muted-foreground',
        'md:text-xl',
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
}

/**
 * Small - Small text
 * Use for captions, footnotes, legal text
 */
export function Small({ children, className, ...props }: TypographyProps) {
  return (
    <small
      className={cn(
        'text-sm font-medium text-muted-foreground',
        className
      )}
      {...props}
    >
      {children}
    </small>
  )
}

/**
 * Muted - De-emphasized text
 * Use for secondary information, timestamps, metadata
 */
export function Muted({ children, className, ...props }: TypographyProps) {
  return (
    <p
      className={cn(
        'text-sm text-muted-foreground',
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
}

/**
 * SectionTitle - Centered section heading with optional subtitle
 * Use for major page sections that need centered headings
 */
interface SectionTitleProps extends HTMLAttributes<HTMLDivElement> {
  title: string
  subtitle?: string
  className?: string
}

export function SectionTitle({ title, subtitle, className, ...props }: SectionTitleProps) {
  return (
    <FadeInStaggerContainer className={cn('mb-12 text-center md:mb-16', className)} {...props}>
      <FadeInStagger>
        <H2>{title}</H2>
      </FadeInStagger>
      {subtitle && (
        <FadeInStagger>
          <Lead className="mt-4 mx-auto max-w-2xl">{subtitle}</Lead>
        </FadeInStagger>
      )}
    </FadeInStaggerContainer>
  )
}
