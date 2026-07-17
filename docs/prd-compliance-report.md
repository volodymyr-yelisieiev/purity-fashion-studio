# PURITY PRD Compliance Report

Baseline: Notion PRD v1.0, updated 2026-07-16. This report distinguishes
repository compliance from production activation. A feature is not considered
operational merely because its code exists.

## Implemented in the repository

| PRD area | Status | Evidence |
| --- | --- | --- |
| Multilingual public site | Implemented | UK/RU/EN routes, localized metadata and no CMS locale fallback |
| CMS and editorial workflow | Implemented | Payload Admin, PostgreSQL schema, 15 collections, 5 globals, roles, drafts, versions, scheduled publish, preview and revalidation |
| Content migration | Implemented, activation pending | Guarded idempotent importer and committed migrations; production database is required to execute them |
| Media governance | Implemented | S3 storage, MIME/size limits, derivatives, rights metadata, expiry and real-client-proof publication gates |
| Leads and booking requests | Implemented | Server validation, anti-abuse controls, deduplication, attribution, consent version, lifecycle records and localized transactional email |
| Paid offers | Implemented | Server-owned prices, immutable orders, Stripe Checkout, LiqPay checkout, signed raw-body webhooks and verified status pages |
| Payment reliability | Implemented | Idempotent webhook ledger, monotonic state transitions, late-success handling, refunds received from providers, amount/currency verification and protected reconciliation job |
| SEO and redirects | Implemented | CMS metadata, canonicals, sitemap, robots, structured data, managed redirects and preview noindex |
| Security and privacy controls | Implemented in code | RBAC, strong authentication settings, CORS/CSRF allowlist, CSP/security headers, rate limits, fail-closed production flags and PII-safe operational responses |
| Analytics and operations | Implemented in code | Explicit GA4 enablement, health endpoint, backup/restore and incident runbooks, launch gates and reconciliation endpoint |
| Release D scheduling | Intentionally deferred by PRD scope | Real-time resources, availability, holds, appointments and reminders require a separately approved operating model |

## Required before production activation

These are external decisions or environment operations and cannot be completed
truthfully inside the repository:

1. Provision isolated PostgreSQL, S3-compatible storage, Resend, Stripe and
   LiqPay production resources and place secrets in the deployment platform.
2. Run migration status and migrations against an empty and restored database;
   run the importer twice and approve record/media parity across UK/RU/EN.
3. Complete owner/editor/support/finance/developer role UAT and Draft Mode,
   publish, unpublish and redirect UAT.
4. Approve merchant entity, public offer, refund/cancellation, receipt and
   fiscalization responsibilities. Register both signed webhook endpoints and
   prove success, failure, expiry, duplicates, late success, amount mismatch,
   currency mismatch and partial/full refund with provider test transactions.
5. Approve privacy retention, processors, data-subject request and incident
   procedures; verify the email domain, bounce ownership, SPF, DKIM and DMARC.
6. Configure database backups, object versioning, monitoring and job schedules;
   perform and record a restore drill with agreed RPO/RTO.
7. Verify the canonical domain, Search Console, analytics consent decision and
   payment-wallet domain/device eligibility before enabling indexing,
   analytics or live payments.

The application deliberately fails closed while these prerequisites are
missing. It does not silently downgrade production to seed content or treat a
payment redirect as proof of payment.

## Verification record

Executed on 2026-07-17:

- `pnpm qa:all` — passed, including production build and 33 Playwright tests.
- `pnpm qa:budget` — passed; 1,641,794 public JS bytes across 12 route
  manifests, with Payload Admin isolated from public bundles.
- `pnpm audit --prod --audit-level low` — no known vulnerabilities.
- `pnpm typecheck` — passed.
- `pnpm cms:check` — passed: 15 collections, 5 globals and migration fixtures.
- `pnpm payment:check` — passed: provider routing and monotonic transitions.
- `git diff --check` — passed.
- `pnpm payload:migrate:status` — not executable in this workspace because no
  PostgreSQL service, `psql` or Docker is available; connection to
  `127.0.0.1:5432` was refused.

No visual baseline was updated. Production deployment, data migration, provider
configuration and external-account changes were not performed.
