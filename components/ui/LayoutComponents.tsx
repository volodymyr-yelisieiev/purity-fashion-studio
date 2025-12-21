/**
 * Layout Components
 * 
 * Reusable layout components for consistent spacing and containment.
 * Use these instead of raw div elements with inline Tailwind classes.
 * 
 * @example
 * import { Container, Section } from '@/components/ui'
 * 
 * <Section spacing="lg">
 *   <Container size="md">
 *     <h2>Section Content</h2>
 *   </Container>
 * </Section>
 */

import { cn } from '@/lib/utils'
import type { HTMLAttributes, ReactNode } from 'react'

/* ============================================
   Container Component
   ============================================ */

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  /** Container max-width size */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  /** Whether to add horizontal padding */
  padded?: boolean
  className?: string
}

const containerSizes = {
  sm: 'max-w-3xl',   // ~768px - for text-heavy content
  md: 'max-w-4xl',   // ~896px - for medium layouts
  lg: 'max-w-6xl',   // ~1152px - default for most pages
  xl: 'max-w-7xl',   // ~1280px - for wide layouts
  full: 'max-w-full', // full width
}

/**
 * Container - Centers content with max-width constraints
 * 
 * @param size - 'sm' (768px), 'md' (896px), 'lg' (1152px), 'xl' (1280px), 'full'
 * @param padded - Whether to add horizontal padding (default: true)
 */
export function Container({
  children,
  size = 'lg',
  padded = true,
  className,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto',
        containerSizes[size],
        padded && 'px-4 sm:px-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/* ============================================
   Section Component
   ============================================ */

interface SectionProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode
  /** Vertical padding size */
  spacing?: 'none' | 'sm' | 'md' | 'lg'
  /** Background variant */
  variant?: 'default' | 'muted'
  /** HTML element to render as */
  as?: 'section' | 'div' | 'article'
  className?: string
}

const sectionSpacing = {
  none: '',
  sm: 'py-8 sm:py-12 md:py-16',
  md: 'py-12 sm:py-16 md:py-24',
  lg: 'py-16 sm:py-20 md:py-32',
}

const sectionVariants = {
  default: 'bg-background',
  muted: 'bg-muted',
}

/**
 * Section - Wrapper for page sections with consistent vertical rhythm
 * 
 * @param spacing - 'none', 'sm' (48-64px), 'md' (64-96px), 'lg' (80-128px)
 * @param variant - 'default' (white bg) or 'muted' (gray bg)
 * @param as - HTML element type (default: 'section')
 */
export function Section({
  children,
  spacing = 'md',
  variant = 'default',
  as: Component = 'section',
  className,
  ...props
}: SectionProps) {
  return (
    <Component
      className={cn(
        sectionVariants[variant],
        sectionSpacing[spacing],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}

/* ============================================
   PageHeader Component
   ============================================ */

interface PageHeaderProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode
  /** Use full viewport height minus header */
  fullHeight?: boolean
  /** Center content vertically */
  centered?: boolean
  className?: string
}

/**
 * PageHeader - Hero section wrapper with proper spacing
 * 
 * @param fullHeight - Make section take most of viewport height
 * @param centered - Center content both horizontally and vertically
 */
export function PageHeader({
  children,
  fullHeight = false,
  centered = true,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        'bg-background px-4 sm:px-6',
        fullHeight ? 'min-h-[60vh] sm:min-h-[70vh]' : 'py-12 sm:py-16 md:py-24',
        centered && 'flex flex-col items-center justify-center text-center',
        className
      )}
      {...props}
    >
      {children}
    </header>
  )
}

/* ============================================
   Grid Component
   ============================================ */

interface GridProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  /** Number of columns on desktop */
  cols?: 1 | 2 | 3 | 4
  /** Gap size between items */
  gap?: 'sm' | 'md' | 'lg'
  className?: string
}

const gridCols = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
}

const gridGaps = {
  sm: 'gap-4',
  md: 'gap-8',
  lg: 'gap-12',
}

/**
 * Grid - Responsive grid layout
 * 
 * @param cols - 1, 2, 3, or 4 columns on desktop (responsive)
 * @param gap - 'sm' (16px), 'md' (32px), 'lg' (48px)
 */
export function Grid({
  children,
  cols = 3,
  gap = 'md',
  className,
  ...props
}: GridProps) {
  return (
    <div
      className={cn(
        'grid',
        gridCols[cols],
        gridGaps[gap],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
