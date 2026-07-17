# PURITY Payload CMS Contract

Payload 3 is embedded in the existing Next.js app. PostgreSQL uses UUID IDs;
public React Server Components call Local API through typed functions in
`content/public-api.ts`. REST remains available for external/browser needs,
GraphQL is disabled, and locale fallback is disabled.

## Collections and globals

Content: Directions, Services, Offers, Courses, Fashion Collections, Portfolio
Cases, Testimonials and Pages. Site: Media and managed Redirects. Operations:
Leads, Booking Requests, Payment Orders and Webhook Events. Administration:
Users. Globals: Home, Header, Footer, Site Settings and Booking Settings.

`Service` owns the value/process narrative. `Offer` owns SKU, format, price in
integer minor units, commercial/checkout mode, deposit, availability and terms
version. Payment Orders retain an immutable offer snapshot.

## Roles and access

- owner: users, settings, all content and operations;
- editor: public drafts/publish, SEO and media; no payment/PII internals;
- support: leads and booking operations only;
- finance: payment orders and webhook audit only;
- developer: schema-oriented non-production access, not production PII.

Disabled users are rejected at login, API keys are disabled, login attempts are
limited, sessions expire, and passwords must contain at least 14 characters.
Trusted Local API bypasses are limited to named booking/webhook/import contexts.

## Seed and migrations

Run migrations before import:

```bash
pnpm content:manifest -- --out tmp/purity-content-manifest.v1.json
pnpm payload:migrate:status
pnpm payload:migrate
ALLOW_CMS_SEED=true pnpm cms:import -- --target=preview --confirm=IMPORT_PREVIEW
```

The importer upserts in relationship order and is refused unless explicitly
enabled. It must not overwrite edited production content without a separately
implemented and approved force policy. Migration files and `payload-types.ts`
are committed; schema push is limited to isolated development.

On Vercel, `vercel-build` runs migrations and the guarded importer only when
`PAYLOAD_MIGRATE_ON_DEPLOY=true`, `CONTENT_IMPORT_ON_DEPLOY=true` and
`ALLOW_CMS_SEED=true` are all explicitly set. Preview uses those controls for
its clean import; Production stays disabled until Preview parity and QA are
green on the reviewed release commit.

## Publish, preview and cache

Drafts, autosave, versions, scheduled publish support, restore, preview and
Live Preview are configured. Draft Mode uses a 32+ character secret, an
allowlisted localized path and open-redirect protection. Breakpoints are
390×844, 768×1024 and 1440×900. Public queries use locale, no fallback, selected
fields, bounded depth and public access. Cache tags and route invalidation run
on publish, unpublish, delete and global/media/offer change. Slug changes create
301 records; `proxy.ts` resolves them with a bounded cached chain and loop guard.

## Media governance

Production uses Vercel Blob storage with direct client upload. Only JPEG,
PNG, WebP and AVIF are accepted; upload size is limited to 20 MB and remote URL
paste is disabled. Thumbnail, card, editorial and hero derivatives are
generated. Public reads require visibility, approved and non-expired rights.
Generated media cannot be real client proof.

## Runtime source

The public runtime is Payload-only. Static content is a versioned one-time
migration input and test fixture; public routes never import it. An application
rollback must preserve the database because seed is not an authoritative
runtime or rollback source.

`pnpm content:manifest` writes the versioned route/localization/media checksum
fixture used for parity review. Run the guarded importer twice in Preview and
compare the resulting counts and checksums before Production cutover.
