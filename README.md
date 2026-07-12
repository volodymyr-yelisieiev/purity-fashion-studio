# PURITY Fashion Studio

[![CI](https://github.com/volodymyr-yelisieiev/purity-fashion-studio/actions/workflows/ci.yml/badge.svg)](https://github.com/volodymyr-yelisieiev/purity-fashion-studio/actions/workflows/ci.yml)
[![Vercel](https://img.shields.io/badge/Vercel-production-black?logo=vercel)](https://purity-fashion-studio.vercel.app)

Multilingual website for PURITY Fashion Studio, built with Next.js, TypeScript,
Tailwind CSS and shadcn/ui.

## Design system

The UI uses shadcn preset `b59jufTOPg` as its single design-system source:

- Base Sera with Base UI primitives;
- neutral semantic colors;
- Noto Sans and Noto Serif;
- Phosphor icons;
- standard preset radius and light/dark themes.

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

## Commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start the development server |
| `pnpm build` | Create a production build |
| `pnpm readiness:mvp` | Run types, lint, content, i18n and design-system checks |
| `pnpm test:e2e` | Build and run Playwright route and interaction tests |
| `pnpm qa:all` | Run the complete release gate |

## Architecture

- `app/` — localized routes and metadata.
- `components/ui/` — canonical shadcn primitives.
- `components/` — site shell and product compositions.
- `content/` — typed multilingual content and CMS adapter boundary.
- `messages/` — localized interface copy.
- `tests/e2e/` — route, interaction, accessibility and visual coverage.
- `docs/` — launch, QA and CMS handoff documentation.

Production: [purity-fashion-studio.vercel.app](https://purity-fashion-studio.vercel.app)

Contribution and release rules are defined in [CONTRIBUTING.md](CONTRIBUTING.md).
Automation-specific rules are defined in [AGENTS.md](AGENTS.md).
