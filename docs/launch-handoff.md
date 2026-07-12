# PURITY Launch and Handoff

## Production Deployment

1. Set environment variables from `.env.example`.
2. Run `pnpm install --frozen-lockfile`.
3. Run `pnpm qa:all`.
4. Deploy the Next.js app with `NEXT_PUBLIC_SITE_URL` set to the production origin.
5. Open `/uk`, `/ru`, `/en`, `/uk/booking`, `/uk/contacts`, `/robots.txt`, and `/sitemap.xml`.

## Remediation Review Status

Tasks PURITY-00 through PURITY-59 are retained as completed history. The active full-site hardening wave is PURITY-60 through PURITY-84 and uses the `b59jufTOPg` preset as the UI source of truth. Completion requires `pnpm qa:all` plus browser review at the six required widths.

Core review routes:

- `/uk`, `/ru`, `/en`
- `/uk/studio`, `/uk/stylist`, `/uk/collections`
- `/uk/services/atelier-service`
- `/uk/booking?service=atelier-service`
- `/uk/contacts`

Review these routes on desktop and mobile. The browser QA suite checks that the logo, hero/content imagery, meaningful copy, dense footer contact facts, and mobile width constraints render on the core routes.

Hardening contract:

- Keep the shadcn `b59jufTOPg` Base Sera / neutral / Phosphor / Base UI baseline in `components.json`.
- Use `components/ui/*` primitives first; custom PURITY components must be thin repeated composition, not primitive renames.
- Do not override preset-owned radii, fonts, or primitive geometry with a parallel PURITY design system.
- Public pages need a title, summary, useful content cluster, visible imagery where applicable, a next step, and the dense footer.
- Generated media stays editorial filler only: `isRealClientProof=false`, real non-empty file, localized alt, source metadata, and replacement priority.

## Environment and Secrets

- `NEXT_PUBLIC_SITE_URL`: public production origin used for canonical URLs, Open Graph, robots, and sitemap.
- `PAYMENT_MODE`: keep `test` for the MVP stubs; set `live` only when real Stripe and LiqPay adapters are connected.
- `STRIPE_SECRET_KEY`: required only when `PAYMENT_MODE=live`.
- `LIQPAY_PRIVATE_KEY`: required only when `PAYMENT_MODE=live`.

`pnpm env:check` fails fast for invalid URLs and for missing live payment secrets when live mode is enabled.

## Payment Activation

1. Keep current Stripe/LiqPay test adapters for MVP demos.
2. Add real provider SDKs only when live credentials and webhook URLs exist.
3. Persist `payment-orders` through the CMS/server data layer before live checkout.
4. Verify success, cancel, and failure return URLs for every locale.
5. Run `pnpm qa:all` with `PAYMENT_MODE=live` in a secret-backed environment.

## CMS Activation

1. Use `docs/cms-payload-plan.md` as the collection map.
2. Export seed data with `pnpm cms:seed -- --out tmp/purity-cms-seed.json`.
3. Import by collection key and upsert by `id` or `slug`.
4. Replace `content/source.ts` internals with the CMS adapter while preserving `ContentSnapshot`.
5. Run `pnpm cms:check`, `pnpm content:validate`, and `pnpm qa:all`.

## Real Media Replacement

1. Replace generated placeholders before launch when approved assets exist.
2. Keep `isRealClientProof=false` for generated media.
3. Publish portfolio cases only when approved client proof is available.
4. Update localized `alt` and `internalLabel` with every replacement.

## MVP Content Boundaries

- Source-backed content: public services, studio, contacts, social links, price/status notes, and old-shop collection signals come from the recovered PURITY source pages and must keep `sourceUrl`/`sourceLabel` metadata.
- Logo assets: `public/brand/logo-*.png`, app icons, and social preview images are extracted from the PURITY client logo source and are tracked in `mediaAssets`.
- Generated imagery: `public/generated/*.png` is editorial filler only. It must have `source: "generated"`, `generated: true`, generation metadata, a non-empty file, `isRealClientProof=false`, and replacement priority set to a replacement state.
- Booking/payment: the MVP keeps test adapters for Stripe/LiqPay routing. It does not persist live orders or process live payments.
- QA gates: `pnpm qa:all` runs readiness checks, production build, Playwright E2E/screenshot/density checks, and the static JS budget. It fails on wrong shadcn preset, `nova`, forbidden rounded classes, deleted wrapper aliases returning, invented Prague facts, missing logo/media files, empty generated files, missing media coverage for visible offers/core pages, generic public copy, protected brand references in runtime content, broken service preselect, missing contact/social entrypoints, sparse core routes, thin footer facts, horizontal overflow, and localized validation regressions.

## Editable Now

- Typed content in `content/data.ts`: public copy, navigation, services, courses, collections, portfolio placeholders, media manifest, settings.
- Brand/UI tokens in `app/globals.css`.
- Booking/payment copy in `features/booking/content.ts`.

## Editable After CMS Activation

- Services, categories, courses, collections, portfolio cases, testimonials, public pages, settings, media assets.
- Leads, booking requests, and payment orders through admin/system workflows.

## Future Backlog

Outside MVP scope:

- School platform: lesson pages, student access, progress, payments for courses.
- Ecommerce/productization: product catalog, inventory, cart, tax/shipping, order emails.
- Client accounts: authentication, saved profiles, private lookbooks, order history.
- Advanced booking: calendar availability, rescheduling, reminders, staff capacity.
- Portfolio proof system: client approvals, release metadata, before/after media governance.
