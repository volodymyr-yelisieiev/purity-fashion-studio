import { Link } from '@tanstack/react-router'
import { useErrorStateContent } from './error-state-copy'
import { ErrorStateLayout } from './error-state-layout'

export function NotFound() {
  const { homePath, ui, copy } = useErrorStateContent()

  return (
    <ErrorStateLayout>
      <p className="eyebrow">404</p>
      <h1 className="section-title mt-4">{copy.notFoundTitle}</h1>
      <p className="editorial-copy mt-4 max-w-xl">
        {copy.notFoundBody}
      </p>
      <div className="hero-actions">
        <button className="button-secondary" onClick={() => window.history.back()}>
          {copy.backLabel}
        </button>
        <Link to={homePath} className="button-primary">
          {ui.actions.backHome}
        </Link>
      </div>
    </ErrorStateLayout>
  )
}
