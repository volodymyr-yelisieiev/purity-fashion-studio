# PURITY CMS and Admin Plan

PURITY keeps the frontend content contract in `content/model.ts` and consumes it through `content/source.ts`. The current source is the typed seed in `content/data.ts`; a future Payload adapter should return the same `ContentSnapshot` shape so page routes, metadata, booking preselection, and navigation do not need a rewrite.

## Payload Collections

The collection contract lives in `content/cms.ts` and covers:

- `service-categories`, `services`, `courses`, `collections`, `portfolio-cases`, `testimonials`
- `media-assets`, `pages`, `settings`
- `leads`, `booking-requests`, `payment-orders`

Localized public fields use the same required locales as the app: `uk`, `ru`, and `en`. The seed validation script checks that localized fields contain all locales and that service/media/category relations resolve.

## Seed Import

Export a seed JSON payload from typed content:

```bash
pnpm cms:seed
pnpm cms:seed -- --out tmp/purity-cms-seed.json
pnpm cms:seed -- --stdout
```

The JSON keys match the future Payload collection slugs. A Payload import job can read each array and upsert by `id` or `slug`.

## Admin Roles

- `owner`: full access to content, settings, leads, booking requests, payment orders, and publish controls.
- `editor`: create and edit public content, draft previews, and media metadata; cannot view payment order internals.
- `support`: read and update leads and booking request statuses; cannot edit public content or settings.
- `developer`: schema, integration, and seed migration access in non-production environments.
- `system`: server-only writes for leads, booking requests, and payment orders created by form actions and payment adapters.

## Media Storage

Use Payload upload fields for `media-assets.upload`, backed by S3-compatible object storage in production and local filesystem storage in development. Keep existing fields for `src`, localized `alt`, `internalLabel`, `source`, `replacementPriority`, and `isRealClientProof` so generated placeholders remain distinguishable from approved client proof.

Launch rule: generated media may ship only with `replacementPriority` set to a replacement state and `isRealClientProof=false`. Portfolio cases should remain hidden unless they have approved proof.

## Preview and Publish

Use Payload drafts for public content collections and a preview URL that maps collection + route segment to the existing localized frontend route. The frontend should resolve preview content into the same `ContentSnapshot` shape used by production pages.

Recommended preview routes:

- services: `/{locale}/services/{routeSegment}`
- courses: `/{locale}/courses/{routeSegment}`
- collections: `/{locale}/collections/{routeSegment}`
- portfolio cases: `/{locale}/portfolio/{routeSegment}`
- pages/categories: `/{locale}/{routeSegment}`

Publishing should run `pnpm cms:check` and the route/content validation before deployment.
