# PURITY Launch and Handoff

This repository now contains the integrated Next.js + Payload target platform.
`CONTENT_SOURCE=seed` is a migration/test mode only; the intended production
source is `payload`.

## Production Deployment

1. Provision separate production PostgreSQL, S3-compatible storage, Resend,
   Stripe, and LiqPay resources. Never reuse preview resources.
2. Configure every variable from `.env.example`; use the canonical HTTPS
   origin for both public URLs.
3. Back up the database, then run `pnpm payload:migrate:status` and
   `pnpm payload:migrate` before switching application traffic.
4. Run the importer once with `ALLOW_CMS_SEED=true pnpm cms:import`; rerun it to
   prove idempotency before editors change production content.
5. Review all three locales in Draft Mode, publish approved records, and set
   `CONTENT_SOURCE=payload`.
6. Run `pnpm qa:all`, verify `/api/health`, `/robots.txt`, `/sitemap.xml`, and
   perform signed webhook test transactions in both currencies.
7. Enable indexing only on the canonical production deployment by setting
   `NEXT_PUBLIC_INDEXING_ENABLED=true` after Search Console and canonical-domain
   review.

Rollback is application-forward: keep the previous deployment, do not reverse
destructive migrations without an approved restore, and never discard CMS
records created after the source switch.

## Environment and Secrets

- Payload: `PAYLOAD_ENABLED=true`, `CONTENT_SOURCE=payload`, two independent
  32+ character secrets, managed `DATABASE_URL`.
- Media: all five S3 variables are mandatory in production; client upload is
  enabled and the server enforces MIME/rights gates.
- Email: verified Resend sender, SPF, DKIM, DMARC, bounce/complaint ownership,
  and environment-safe recipient routing.
- Payments: `PAYMENT_MODE=live` requires both provider credentials, signed
  webhook secrets, and `PAYMENT_MERCHANT_READY=true`.
- Analytics/indexing are fail-closed and require explicit public flags.

Secrets belong in environment stores only. Rotate Payload, webhook, database,
storage, email, and cron credentials independently per environment.

## Payment Activation

1. Owner/finance approves merchant entities, public offer, cancellation/refund
   policy, fiscalization/receipt responsibility, descriptor, countries, and
   currencies.
2. Register Stripe webhook `/api/payments/webhooks/stripe` and LiqPay callback
   `/api/payments/webhooks/liqpay` on the canonical HTTPS domain.
3. Verify signed success, failure, expiry, duplicate delivery, late success,
   partial/full refund, amount mismatch, and currency mismatch behavior.
4. Confirm Apple Pay/Google Pay only after provider eligibility, domain
   verification, device testing, and a live transaction.
5. Reconcile provider dashboards against immutable `payment-orders`; never
   edit `paid` manually.

Redirects never prove payment. The public success page reads the stored order
status written by a verified webhook.

## CMS Activation

Payload Admin is served at `/admin`; public Server Components use Local API.
The code-first collections, globals, generated types, migrations, preview,
live-preview breakpoints, role access, S3 uploads, SEO fields, redirect records,
and revalidation hooks are committed in this repository.

Before switching the source:

- migrate an empty and a representative restored database;
- run `pnpm cms:import` twice and compare counts;
- test owner/editor/support/finance/developer access;
- test draft, publish, unpublish, slug redirect, and old/new route behavior;
- review UK/RU/EN without locale fallback;
- confirm generated/restricted/expired media cannot become public proof.

## Real Media Replacement

Every public asset requires approved rights, localized alt, allowed usage,
credit/release metadata where applicable, and a non-expired rights window.
Generated media is editorial filler only, remains
`isRealClientProof=false`, and carries replacement priority. Portfolio requires
published status, real-client proof, approved rights, approval, and visibility.

## Editable Now

With Payload enabled, editors manage Directions, Services, Offers, Courses,
Collections, Portfolio, Pages, Testimonials, Home/Header/Footer/Settings and
Media in `/admin`. Support manages Leads and Booking Requests. Finance/owner
can inspect Payment Orders and Webhook Events. Schema, migrations, provider
logic, roles, secrets, and arbitrary styling remain code-owned.

## Editable After CMS Activation

No additional code migration is required for the current Release A–C content
model. Production editing starts only after database/storage/email provisioning,
seed parity review, an owner account, role UAT, backups, and the Payload source
switch. Seed files remain fixtures until production parity is accepted.

## Future Backlog

Release D real-time scheduling is intentionally not implemented: resources,
availability, holds, appointments, overlap constraints, reminders, and audit
history require a separately approved operating model. LMS/student accounts,
full ecommerce, inventory, shipping, tax, client portal, and private lookbooks
also remain separate products.
