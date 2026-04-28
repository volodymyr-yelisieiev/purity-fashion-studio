import type { ReactNode } from 'react'
import { cn } from '~/lib/utils'

export function Section({
  children,
  className,
  large = false,
}: {
  children: ReactNode
  className?: string
  large?: boolean
}) {
  return (
    <section className={cn('editorial-container editorial-section', large && 'editorial-section-large', className)}>
      {children}
    </section>
  )
}

export function SectionHead({
  eyebrow,
  title,
  subtitle,
  className,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  className?: string
}) {
  return (
    <div className={cn('editorial-section-head', className)}>
      <div>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2 className="section-title">{title}</h2>
      </div>
      {subtitle ? <p className="editorial-copy editorial-lead-measure">{subtitle}</p> : null}
    </div>
  )
}
