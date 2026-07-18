import { list } from "@vercel/blob"
import { getPayload } from "payload"

import config from "@payload-config"

type MediaDoc = {
  id: string
  url?: string | null
  mimeType?: string | null
  filesize?: number | null
  sizes?: Record<string, { url?: string | null; filesize?: number | null }>
}

const token = process.env.BLOB_READ_WRITE_TOKEN
if (!token) throw new Error("BLOB_READ_WRITE_TOKEN is required")

const payload = await getPayload({ config })
const media = await payload.find({
  collection: "media",
  depth: 0,
  limit: 10_000,
  overrideAccess: true,
  pagination: false,
  select: { id: true, url: true, mimeType: true, filesize: true, sizes: true },
})

const expected = new Map<string, MediaDoc>()
for (const doc of media.docs as MediaDoc[]) {
  for (const asset of [doc, ...Object.values(doc.sizes ?? {})]) {
    if (asset.url) expected.set(asset.url, doc)
  }
}

const errors: string[] = []
for (const [url, doc] of expected) {
  try {
    const response = await fetch(url, {
      method: "HEAD",
      signal: AbortSignal.timeout(5000),
    })
    if (!response.ok) {
      errors.push(`${doc.id}: ${response.status} ${url}`)
      continue
    }
    const contentType = response.headers.get("content-type")?.split(";", 1)[0]
    if (doc.mimeType && contentType && contentType !== doc.mimeType) {
      errors.push(`${doc.id}: mime ${contentType} != ${doc.mimeType}`)
    }
    const length = Number(response.headers.get("content-length"))
    if (doc.filesize && Number.isFinite(length) && length !== doc.filesize) {
      errors.push(`${doc.id}: size ${length} != ${doc.filesize}`)
    }
  } catch (error) {
    errors.push(
      `${doc.id}: ${error instanceof Error ? error.message : "HEAD failed"}`
    )
  }
}

const blobURLs = new Set<string>()
let cursor: string | undefined
do {
  const page = await list({ token, cursor, limit: 1000 })
  page.blobs.forEach((blob) => blobURLs.add(blob.url))
  cursor = page.hasMore ? page.cursor : undefined
} while (cursor)

const dbURLs = new Set(expected.keys())
const orphaned = [...blobURLs].filter((url) => !dbURLs.has(url))
const missing = [...dbURLs].filter((url) => !blobURLs.has(url))

if (orphaned.length) errors.push(`orphaned Blob objects: ${orphaned.length}`)
if (missing.length)
  errors.push(`DB media without Blob objects: ${missing.length}`)

if (errors.length) {
  console.error(errors.join("\n"))
  process.exitCode = 1
} else {
  console.log(
    `Media integrity ok: ${expected.size} assets, ${blobURLs.size} blobs.`
  )
}
