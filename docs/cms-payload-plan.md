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
pnpm payload:migrate:status
pnpm payload:migrate
ALLOW_CMS_SEED=true pnpm cms:import
ALLOW_CMS_SEED=true pnpm cms:import
```

The importer upserts in relationship order and is refused unless explicitly
enabled. It must not overwrite edited production content without a separately
implemented and approved force policy. Migration files and `payload-types.ts`
are committed; schema push is limited to isolated development.

## Publish, preview and cache

Drafts, autosave, versions, scheduled publish support, restore, preview and
Live Preview are configured. Draft Mode uses a 32+ character secret, an
allowlisted localized path and open-redirect protection. Breakpoints are
390×844, 768×1024 and 1440×900. Public queries use locale, no fallback, selected
fields, bounded depth and public access. Cache tags and route invalidation run
on publish, unpublish, delete and global/media/offer change. Slug changes create
301 records; `proxy.ts` resolves them with a bounded cached chain and loop guard.

## Media governance

Production uses S3-compatible storage with direct client upload. Only JPEG,
PNG, WebP and AVIF are accepted; upload size is limited to 20 MB and remote URL
paste is disabled. Thumbnail, card, editorial and hero derivatives are
generated. Public reads require visibility, approved and non-expired rights.
Generated media cannot be real client proof.

## Source switch

`CONTENT_SOURCE=seed|payload` is the temporary migration flag. Production moves
to `payload` only after import parity, locale review, route/metadata comparison,
role UAT and backup verification. After editors start changing CMS content, an
application rollback must preserve the database; seed is no longer an
authoritative rollback source.
