# PURITY Launch and Handoff

This repository now contains the integrated Next.js + Payload target platform.
Payload is the only public runtime content source.

## Production Deployment

1. Provision separate production PostgreSQL, Vercel Blob storage, Resend,
   Stripe, and LiqPay resources. Never reuse preview resources.
2. Configure every variable from `.env.example`; use the canonical HTTPS
   origin for both public URLs.
3. Back up the database, then run `pnpm payload:migrate:status` and
   `pnpm payload:migrate` before switching application traffic.
4. Run the reviewed SHA through the `CMS release operation` workflow with
   `BOOTSTRAP_PRODUCTION`; then run `pnpm cms:verify` before editors change
   production content.
5. Review all three locales in Draft Mode and publish approved records.
6. Run `pnpm qa:all`, verify `/api/health/live`, `/api/health/ready`, `/robots.txt`, `/sitemap.xml`, and
   perform signed webhook test transactions in both currencies.
7. Enable indexing only on the canonical production deployment by setting
   `NEXT_PUBLIC_INDEXING_ENABLED=true` after Search Console and canonical-domain
   review.

Rollback is application-forward: keep the previous deployment, do not reverse
destructive migrations without an approved restore, and never discard CMS
records created after the source switch.

## Environment and Secrets

- Payload: `PAYLOAD_ENABLED=true`, two independent
  32+ character secrets, managed `DATABASE_URL`.
- Media: `BLOB_READ_WRITE_TOKEN` is mandatory when Payload serves media on
  enabled and the server enforces MIME/rights gates.
- Email: verified Resend sender, SPF, DKIM, DMARC, bounce/complaint ownership,
  environment-safe recipient routing and a protected notification-outbox job.
- Monitoring: matching server/public Sentry DSNs, an approved data region,
  alert ownership and PII-disabled event review.
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
6. Invoke both `/api/jobs/reconcile-payments` and
   `/api/jobs/process-notifications` with `CRON_SECRET`; retain a daily Vercel
   recovery run and configure the merchant-approved higher frequency externally
   if the Vercel plan cannot provide it.

Redirects never prove payment. The public success page reads the stored order
status written by a verified webhook.

## CMS Activation

Payload Admin is served at `/admin`; public Server Components use Local API.
The code-first collections, globals, generated types, migrations, preview,
live-preview breakpoints, role access, Vercel Blob uploads, SEO fields, redirect records,
and revalidation hooks are committed in this repository.

Before switching the source:

- migrate an empty and a representative restored database;
- run `pnpm cms:verify` and compare counts with the reviewed manifest;
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
