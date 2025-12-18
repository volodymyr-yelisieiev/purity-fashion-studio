// app/not-found.tsx
// Root 404 page - catches routes without locale prefix
// This is for routes like /xyz that don't match ANY locale

import Link from 'next/link'

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-center px-4">
          <div className="mb-8 font-serif text-9xl font-light text-gray-200">404</div>
          <h1 className="mb-4 text-4xl font-light">Page not found</h1>
          <p className="mb-8 text-gray-500 max-w-md mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <Link 
            href="/en"
            className="inline-block bg-gray-900 text-white px-8 py-3 text-sm uppercase tracking-widest hover:bg-gray-800 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </body>
    </html>
  )
}
