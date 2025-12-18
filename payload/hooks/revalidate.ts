import type { CollectionAfterChangeHook } from 'payload'

export const revalidateContent = (collectionSlug: string): CollectionAfterChangeHook => async ({ doc, req, operation }) => {
  // Only revalidate on create or update
  if (operation !== 'create' && operation !== 'update') {
    return doc
  }

  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const secret = process.env.PAYLOAD_SECRET

    // Construct paths to revalidate
    // 1. The specific item page
    const itemPath = `/${collectionSlug}/${doc.slug}`
    
    // 2. The collection index page
    const collectionPath = `/${collectionSlug}`

    // 3. The home page (in case it's featured)
    const homePath = '/'

    const paths = [itemPath, collectionPath, homePath]

    // We can fire these in parallel
    await Promise.all(paths.map(async (path) => {
      try {
        await fetch(`${siteUrl}/api/revalidate?secret=${secret}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            path,
          }),
        })
        req.payload.logger.info(`Revalidated path: ${path}`)
      } catch (err) {
        req.payload.logger.error(`Error revalidating path ${path}: ${err}`)
      }
    }))

  } catch (err) {
    req.payload.logger.error(`Error in revalidate hook: ${err}`)
  }

  return doc
}
