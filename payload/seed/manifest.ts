import type { ContentRoute } from "../../content/routes"
import type { Locale } from "../../i18n/routing"
import manifest from "./manifests/purity-content-manifest.v1.json"

/**
 * Frozen migration/parity fixture. It is consumed by the importer and test
 * tooling only; the public application reads business content from Payload.
 */
export const purityContentManifest = manifest

export type PurityContentManifest = typeof purityContentManifest

export function getManifestRoutes(locale: Locale): ContentRoute[] {
  return purityContentManifest.routes[locale].map((route) => ({
    ...route,
  })) as ContentRoute[]
}
