'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button, H2, Paragraph, Container, PageHeader } from '@/components/ui'

/**
 * Error Boundary for website routes
 * Catches and displays errors gracefully with retry option
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to console in development, would send to error tracking service in production
    console.error('Error boundary caught:', error)
  }, [error])

  return (
    <PageHeader fullHeight centered>
      <Container size="sm">
        <H2 className="mb-4">Something went wrong</H2>
        <Paragraph className="mb-8 max-w-md">
          We&apos;re sorry, but something unexpected happened. Please try again or contact us if the problem persists.
        </Paragraph>
        <div className="flex gap-4 justify-center">
          <Button 
            onClick={() => reset()}
          >
            Try Again
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </Container>
    </PageHeader>
  )
}
