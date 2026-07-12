import {
  buildCmsSeed,
  cmsCollectionSlugs,
  cmsSeedCounts,
  validateCmsSeed,
} from "../content/cms"

const seed = buildCmsSeed()
const result = validateCmsSeed(seed)

if (!result.ok) {
  throw new Error(`CMS contract invalid:\n${result.issues.join("\n")}`)
}

const counts = cmsSeedCounts(seed)

console.log(
  [
    `CMS contract ok: ${cmsCollectionSlugs.length} collections`,
    `${counts.services} services`,
    `${counts["media-assets"]} media assets`,
    `${counts.pages} pages`,
  ].join(", ")
)
