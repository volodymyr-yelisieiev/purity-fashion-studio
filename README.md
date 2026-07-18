# PURITY Fashion Studio

[![CI](https://github.com/volodymyr-yelisieiev/purity-fashion-studio/actions/workflows/ci.yml/badge.svg)](https://github.com/volodymyr-yelisieiev/purity-fashion-studio/actions/workflows/ci.yml)
[![Vercel](https://img.shields.io/badge/Vercel-production-black?logo=vercel)](https://purity-fashion-studio.vercel.app)

Multilingual product platform for PURITY Fashion Studio, built with Next.js,
Payload CMS, PostgreSQL, TypeScript, Tailwind CSS and shadcn/ui. It includes
managed content, leads/request booking, transactional email, Stripe/LiqPay
checkout adapters and signed webhooks.

## Design system

The UI uses shadcn preset `b59jufTOPg` as its single design-system source:

- Base Sera with Base UI primitives;
- neutral semantic colors;
- Noto Sans and Noto Serif;
- Phosphor icons;
- standard preset radius and a single light semantic theme.

Canonical primitives live in `components/ui`. Product compositions may use
layout utilities, but must not introduce parallel palettes, custom primitive
variants, or page-specific forks of shadcn components. The live component
showcase is available at `/uk/styleguide`, `/ru/styleguide`, and
`/en/styleguide`.

## Getting started

Requirements: Node.js 22 and pnpm 10.28.0.

```bash
pnpm install
cp .env.example .env.local
pnpm setup
pnpm dev
```

The localized entry points are `/uk`, `/ru`, and `/en`.
Seed mode works without infrastructure. Payload mode additionally requires
PostgreSQL and the variables documented in `.env.example`; see
`docs/launch-handoff.md` before activating it. The current PRD implementation
and external activation boundaries are recorded in
`docs/prd-compliance-report.md`.

## Commands

| Command                | Purpose                                                 |
| ---------------------- | ------------------------------------------------------- |
| `pnpm dev`             | Start the development server                            |
| `pnpm build`           | Create a production build                               |
| `pnpm payload:migrate` | Apply committed PostgreSQL migrations                   |
| `pnpm cms:bootstrap`   | Populate an empty Payload database from the manifest    |
| `pnpm cms:verify`      | Verify published Payload content without writing        |
| `pnpm cms:restore`     | Explicitly restore manifest-owned content               |
| `pnpm cms:check`       | Validate the actual Payload config and import fixtures  |
| `pnpm payment:check`   | Verify provider routing and payment state transitions   |
| `pnpm readiness:mvp`   | Run types, lint, content, i18n and design-system checks |
| `pnpm test:e2e`        | Build and run Playwright route and interaction tests    |
| `pnpm qa:all`          | Run the complete release gate                           |

## Architecture

- `app/` — localized routes and metadata.
- `components/ui/` — canonical shadcn primitives.
- `components/` — site shell and product compositions.
- `content/` — typed public Local API query layer and migration fixtures.
- `payload/` — collections, globals, access, hooks, migrations and seed import.
- `features/booking/` — leads, booking, payments and status contracts.
- `messages/` — localized interface copy.
- `tests/e2e/` — route, interaction, accessibility and visual coverage.
- `docs/` — launch, QA and CMS handoff documentation.

Production: [purity-fashion-studio.vercel.app](https://purity-fashion-studio.vercel.app)

Contribution and release rules are defined in [CONTRIBUTING.md](CONTRIBUTING.md).
Automation-specific rules are defined in [AGENTS.md](AGENTS.md).
