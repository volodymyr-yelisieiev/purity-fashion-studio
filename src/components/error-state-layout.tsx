import * as React from 'react'
import { cn } from '~/lib/utils'

export function ErrorStateLayout({ children, centered = false }: { children: React.ReactNode; centered?: boolean }) {
  return (
    <div className={cn('site-container flex min-h-[60vh] flex-col justify-center py-16', centered && 'items-center text-center')}>
      <div className="editorial-panel max-w-2xl">{children}</div>
    </div>
  )
}
