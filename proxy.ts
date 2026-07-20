import createMiddleware from "next-intl/middleware"
import { NextResponse, type NextRequest } from "next/server"

import { routing } from "./i18n/routing"
import { getPayloadURL } from "./lib/site-url"

const handleI18n = createMiddleware(routing)

type RedirectDocument = {
  from: string
  type: "301" | "302"
  to?: {
    type?: "reference" | "custom" | null
    url?: string | null
    reference?: {
      relationTo: string
      value: { slug?: string | null } | string
    } | null
  }
}

let redirectCache:
  { expiresAt: number; documents: RedirectDocument[] } | undefined

function referencePath(document: RedirectDocument, locale: string) {
  const reference = document.to?.reference
  if (!reference || typeof reference.value === "string") return null
  const slug = reference.value.slug
  if (!slug) return null
  const prefixes: Record<string, string> = {
    directions: "",
    services: "/services",
    courses: "/courses",
    "fashion-collections": "/collections",
    "portfolio-cases": "/portfolio",
    pages: "",
  }
  const prefix = prefixes[reference.relationTo]
  return prefix === undefined ? null : `/${locale}${prefix}/${slug}`
}

async function getRedirects() {
  if (process.env.PAYLOAD_ENABLED !== "true") return []
  if (redirectCache && redirectCache.expiresAt > Date.now()) {
    return redirectCache.documents
  }
  try {
    const url = new URL("/api/redirects", getPayloadURL())
    url.searchParams.set("depth", "1")
    url.searchParams.set("limit", "1000")
    url.searchParams.set("pagination", "false")
    const response = await fetch(url, {
      cache: "no-store",
      headers: { "x-purity-internal": "redirect-resolution" },
    })
    if (!response.ok) return []
    const result = (await response.json()) as { docs?: RedirectDocument[] }
    const documents = result.docs ?? []
    redirectCache = { documents, expiresAt: Date.now() + 60_000 }
    return documents
  } catch {
    return []
  }
}

export default async function proxy(request: NextRequest) {
  const documents = await getRedirects()
  const bySource = new Map(documents.map((item) => [item.from, item]))
  let document = bySource.get(request.nextUrl.pathname)

  if (document) {
    const locale = request.nextUrl.pathname.split("/")[1] || "uk"
    const visited = new Set([request.nextUrl.pathname])
    let destination =
      document.to?.type === "custom"
        ? document.to.url
        : referencePath(document, locale)

    for (let hop = 0; destination && hop < 5; hop += 1) {
      if (visited.has(destination)) return handleI18n(request)
      visited.add(destination)
      const next = bySource.get(destination)
      if (!next) break
      document = next
      destination =
        next.to?.type === "custom" ? next.to.url : referencePath(next, locale)
    }

    if (destination?.startsWith("/") && !destination.startsWith("//")) {
      const target = new URL(destination, request.url)
      if (target.origin !== request.nextUrl.origin) return handleI18n(request)
      if (!target.search && request.nextUrl.search) {
        target.search = request.nextUrl.search
      }
      return NextResponse.redirect(target, Number(document.type))
    }
  }

  return handleI18n(request)
}

export const config = {
  matcher: ["/((?!admin|api|_next|_vercel|.*\\..*).*)"],
}
