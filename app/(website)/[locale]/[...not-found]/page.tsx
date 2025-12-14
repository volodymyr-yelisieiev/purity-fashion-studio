// app/(website)/[locale]/[...not-found]/page.tsx
// Catch-all route for unmatched paths within a locale
// Triggers the closest not-found.tsx (localized 404 page)

import { notFound } from 'next/navigation'

// This metadata prevents search engines from indexing catch-all routes
export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

export default function CatchAllPage() {
  // Simply trigger notFound() - this renders the localized not-found.tsx
  // and sends proper 404 HTTP status code (important for SEO)
  notFound()
}
