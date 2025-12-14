// app/not-found.tsx
// Root 404 page - catches routes without locale prefix
// This is for routes like /xyz that don't match ANY locale

'use client'

import Error from 'next/error'

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body>
        <Error statusCode={404} />
      </body>
    </html>
  )
}
