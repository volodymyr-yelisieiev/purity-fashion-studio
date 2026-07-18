import { createHash } from "node:crypto"
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, resolve } from "node:path"

import { buildCmsSeed, validateCmsSeed } from "../content/cms"
import {
  categoryPageCopy,
  collectionsPageCopy,
  studioPageCopy,
} from "../content/category-page-specs"
import { coursePageCopy } from "../content/course-page-spec"
import { getContentRoutes } from "../content/legacy-routes"
import { mediaAssets, navigation } from "../content/data"
import {
  beadedDressCopy,
  capsuleCopy,
  newYearPartyCopy,
} from "../content/collection-page-specs"
import { homePageCopy } from "../content/home-page-spec"
import { portfolioPageCopy } from "../content/portfolio-page-spec"
import { serviceDetailCopy } from "../content/service-page-specs"
import {
  bookingCopy,
  bookingErrors,
  bookingLabels,
  contactMethodLabels,
  currencyLabels,
  formatLabels,
  inquiryTypeLabels,
  paymentStatusCopy,
  providerLabels,
} from "../features/booking/content"
import { locales } from "../i18n/routing"

const manifestVersion = 1

function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`
  if (value && typeof value === "object") {
    return `{${Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, item]) => `${JSON.stringify(key)}:${canonical(item)}`)
      .join(",")}}`
  }
  return JSON.stringify(value)
}

function sha256(value: string | Buffer) {
  return createHash("sha256").update(value).digest("hex")
}

const seed = buildCmsSeed()
const validation = validateCmsSeed(seed)
if (!validation.ok) {
  throw new Error(`Cannot export invalid migration source:\n${validation.issues.join("\n")}`)
}

const recordChecksums = Object.fromEntries(
  Object.entries(seed).map(([collection, records]) => [
    collection,
    records.map((record) => ({
      id:
        typeof record === "object" && record && "id" in record
          ? String(record.id)
          : sha256(canonical(record)).slice(0, 12),
      checksum: sha256(canonical(record)),
    })),
  ])
)
const mediaChecksums = mediaAssets.map((asset) => {
  const filePath = asset.src
    ? resolve("public", asset.src.replace(/^\//, ""))
    : asset.sourceFile
      ? resolve(asset.sourceFile)
      : undefined
  return {
    id: asset.id,
    checksum: filePath && existsSync(filePath) ? sha256(readFileSync(filePath)) : null,
    sourceFile: asset.sourceFile ?? asset.src ?? null,
  }
})

const manifest = {
  version: manifestVersion,
  locales,
  routes: Object.fromEntries(locales.map((locale) => [locale, getContentRoutes(locale)])),
  source: seed,
  migrationCopy: {
    categoryPageCopy,
    collectionsPageCopy,
    studioPageCopy,
    coursePageCopy,
    beadedDressCopy,
    capsuleCopy,
    newYearPartyCopy,
    homePageCopy,
    portfolioPageCopy,
    serviceDetailCopy,
    bookingCopy,
    bookingLabels,
    inquiryTypeLabels,
    formatLabels,
    contactMethodLabels,
    currencyLabels,
    providerLabels,
    paymentStatusCopy,
    bookingErrors,
    navigation,
  },
  checksums: { records: recordChecksums, media: mediaChecksums },
}
const json = `${JSON.stringify(manifest, null, 2)}\n`
const outputIndex = process.argv.indexOf("--out")
const outputPath =
  outputIndex >= 0
    ? process.argv[outputIndex + 1]
    : "payload/seed/manifests/purity-content-manifest.v1.json"
const absolutePath = resolve(outputPath)

if (process.argv.includes("--stdout")) {
  process.stdout.write(json)
} else if (process.argv.includes("--verify")) {
  if (!existsSync(absolutePath)) {
    throw new Error(`Missing versioned migration manifest: ${absolutePath}`)
  }

  if (readFileSync(absolutePath, "utf8") !== json) {
    throw new Error(
      `Migration manifest drifted. Run pnpm content:manifest -- --out ${outputPath}`
    )
  }

  console.log(`Verified content manifest v${manifestVersion} at ${absolutePath}`)
} else {
  mkdirSync(dirname(absolutePath), { recursive: true })
  writeFileSync(absolutePath, json)
  console.log(`Wrote content manifest v${manifestVersion} to ${absolutePath}`)
}
