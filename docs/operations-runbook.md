# PURITY Operations Runbook

## Health and incident triage

Monitor `GET /api/health` without caching. `503` means the app cannot reach the
Payload data plane. Check application errors, managed PostgreSQL, storage,
Resend and provider status pages without logging secrets, raw webhooks, form
messages or client PII. Site Settings can publish a localized maintenance
message; payment/booking writes must fail closed rather than pretend success.

## Backup and restore

The owner must configure automated encrypted PostgreSQL backups and S3 object
versioning/lifecycle in the vendor control planes. Record the agreed retention,
RPO and RTO in the private operations register.

Quarterly and before destructive migration:

1. create a named database backup and record its timestamp/version;
2. retain the matching application commit, migration list and storage snapshot;
3. restore into an isolated non-production database and storage namespace;
4. configure a staging deployment with isolated secrets and indexing disabled;
5. run `pnpm payload:migrate:status`, `pnpm payload:migrate`,
   `pnpm readiness:mvp` and a CMS/public route smoke;
6. compare counts for content, leads, bookings, payment orders and webhook
   events, then sample media URLs and relationship integrity;
7. record duration, data gap and reviewer evidence; delete the drill copy under
   the approved retention policy.

Never test restore against production. Never roll a production schema backward
after new writes unless the migration owner explicitly approves a compatible
down migration; prefer forward repair or full restore.

## Deploy and migrate

Use separate local, preview and production databases, buckets, email routing,
payment keys, URLs and analytics. Preview must not mutate production. Before app
traffic changes, back up, check migration status, migrate once, deploy a
forward-compatible app, smoke health/admin/public reads, then enable traffic.
If the app fails, restore the previous deployment while retaining the migrated
database unless the approved recovery plan says otherwise.

## Payments and webhook operations

Provider endpoints retry safely through unique Webhook Events. Investigate
failed events by payload hash, safe error, order UUID and provider dashboard;
do not paste raw payloads into tickets. Finance never edits `paid` manually.
Refund actions require owner/finance authorization, reason, amount, provider
reference and policy evidence. Reconcile pending orders and provider totals on
an agreed schedule; escalate amount/currency mismatches immediately.

## Email operations

Booking persistence precedes email. `notificationStatus=failed` requires a
controlled retry; it does not justify recreating the booking. Monitor domain
verification, bounces and complaints. Preview/local mail must use an override
recipient. Client messages distinguish request received, booking confirmed and
payment confirmed.

## Security and privacy

Rotate compromised credentials immediately and disable affected users. Preserve
the minimum audit evidence without copying passwords, tokens, card data, raw
provider payloads or unnecessary PII. Data export, correction, deletion,
anonymization, lead/booking retention, accounting retention and incident
notification follow the owner-approved private privacy register and legal
policy; code cannot choose those periods on the owner's behalf.
