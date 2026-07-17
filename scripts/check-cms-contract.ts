import { existsSync } from "node:fs"

import configPromise from "../payload.config"
import { buildCmsSeed, cmsSeedCounts, validateCmsSeed } from "../content/cms"

const config = await configPromise
const expectedCollections = [
  "users",
  "media",
  "directions",
  "services",
  "offers",
  "courses",
  "fashion-collections",
  "portfolio-cases",
  "testimonials",
  "pages",
  "leads",
  "booking-requests",
  "payment-orders",
  "webhook-events",
  "redirects",
]
const expectedGlobals = [
  "home",
  "header",
  "footer",
  "site-settings",
  "booking-settings",
]
const collectionSlugs = new Set<string>(
  config.collections?.map((collection) => collection.slug)
)
const globalSlugs = new Set<string>(
  config.globals?.map((global) => global.slug)
)
const issues = [
  ...expectedCollections
    .filter((slug) => !collectionSlugs.has(slug))
    .map((slug) => `Missing Payload collection: ${slug}`),
  ...expectedGlobals
    .filter((slug) => !globalSlugs.has(slug))
    .map((slug) => `Missing Payload global: ${slug}`),
]

if (config.graphQL?.disable !== true) {
  issues.push("Payload GraphQL must remain disabled")
}
if (!config.localization || config.localization.fallback !== false) {
  issues.push("Payload locale fallback must remain disabled")
}
if (!existsSync("payload-types.ts"))
  issues.push("Missing generated Payload types")
if (!existsSync("payload/migrations/index.ts")) {
  issues.push("Missing committed Payload migrations")
}

const seed = buildCmsSeed()
const seedResult = validateCmsSeed(seed)
if (!seedResult.ok) issues.push(...seedResult.issues)
if (issues.length) {
  throw new Error(`CMS contract invalid:\n${issues.join("\n")}`)
}

const counts = cmsSeedCounts(seed)
console.log(
  [
    `Payload contract ok: ${expectedCollections.length} collections`,
    `${expectedGlobals.length} globals`,
    `${counts.services} legacy services ready for import`,
    `${counts["media-assets"]} legacy media records`,
  ].join(", ")
)
