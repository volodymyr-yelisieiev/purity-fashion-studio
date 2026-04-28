import * as React from 'react'
import {
  ErrorComponent,
  Link,
  rootRouteId,
  useMatch,
  useRouter,
} from '@tanstack/react-router'
import type { ErrorComponentProps } from '@tanstack/react-router'
import { useErrorStateContent } from './error-state-copy'
import { ErrorStateLayout } from './error-state-layout'

export function DefaultCatchBoundary({ error }: ErrorComponentProps) {
  const router = useRouter()
  const { homePath, ui, copy } = useErrorStateContent()
  const isRoot = useMatch({
    strict: false,
    select: (state) => state.id === rootRouteId,
  })

  React.useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <ErrorStateLayout centered>
      <ErrorComponent error={error} />
      <div className="hero-actions justify-center mt-6">
        <button onClick={() => router.invalidate()} className="button-secondary">
          {copy.tryAgainLabel}
        </button>
        {isRoot ? (
          <Link to={homePath} className="button-primary">{ui.actions.backHome}</Link>
        ) : (
          <button onClick={() => window.history.back()} className="button-primary">
            {copy.backLabel}
          </button>
        )}
      </div>
    </ErrorStateLayout>
  )
}
