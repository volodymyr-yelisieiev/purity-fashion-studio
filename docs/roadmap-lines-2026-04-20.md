# PURITY Roadmap Lines

Date: 2026-04-20

## Purpose

This roadmap breaks the project into five parallel lines that can be staffed independently with minimal overlap.

Each line below includes:

- objective
- what is already done
- what is still todo
- dependencies
- gray areas that still need product decisions
- a strong standalone implementation prompt

## Verification

This roadmap is based on:

- `docs/project-audit-2026-04-20.md`
- live inspection of the current site
- parallel planning-agent outputs for each line

All five planning agents returned:

- verified current done state
- verified current gaps
- proposed work packages
- explicit dependencies
- explicit gray areas / open questions
- reusable implementation prompt

## Line 1: Commerce And Client Journey

### Objective

Turn the current prototype booking surface into an operational commerce flow covering offer selection, scheduling, checkout, payment outcomes, and contact-to-booking handoff.

### Current Done

- locale-aware booking route exists
- service, course, collection, and transformation CTAs can prefill booking intent
- booking UI captures format, date, contact data, currency, and notes
- contacts page includes a separate inquiry path

### Still Todo

- real payment integration
- real booking state machine
- scheduling model and availability
- success, failure, and cancellation outcomes
- confirmation email and internal notifications
- lead persistence and contact-to-booking handoff
- offer intent separation between direct-pay and consultation-only flows

### Dependencies

- payment provider decision for Ukraine
- backend/API for sessions, orders, webhooks, and notifications
- scheduling source of truth
- commercial rules per offer
- cancellation/refund policy

### Gray Areas

- should collections be consultation-first or directly purchasable?
- should transformation offers be waitlist, request-details, or payable?
- should live services schedule before payment or after payment?
- does corporate business need a separate lead form instead of the same booking funnel?

### Implementation Prompt

```text
Own the Commerce and Client Journey line for PURITY Fashion Studio in `/Users/v.yelisieiev/Documents/Work/Purity/purity-fashion-studio`. Focus only on booking flow, checkout, payment providers, contact-to-booking handoff, scheduling, confirmation/failure/cancellation states, and transactional requirements. Use `docs/PRD.md`, `docs/project-audit-2026-04-20.md`, `src/routes/$lang/book.tsx`, `src/components/site-shell.tsx`, `src/lib/adapters.ts`, `src/lib/types.ts`, `src/lib/content.ts`, and related routes.

Goals:
1. Replace the mocked booking/checkout contract with a production-ready architecture and UI contract.
2. Define robust domain types and statuses for booking intent, checkout session, payment status, scheduling, and transactional outcomes.
3. Separate direct-pay offers from consultation-only or waitlist flows.
4. Replace free-text date entry with a real scheduling model.
5. Implement explicit success, failure, cancel, retry, and return-from-provider states.
6. Prepare Stripe plus one Ukrainian provider path per PRD.

Constraints:
- preserve locale-aware routing
- preserve current visual tone where practical
- do not redesign unrelated marketing pages
- before coding, summarize architecture and blocking product decisions
- after coding, list what remains mocked or blocked
```

## Line 2: Content Platform And Admin

### Objective

Replace hardcoded prototype content with a backend/CMS-ready model and editor-friendly admin foundation for non-technical publishing.

### Current Done

- typed content entities already exist
- repository abstraction exists
- query layer already centralizes reads
- public routes consistently consume centralized content
- trilingual static content is already organized in one place

### Still Todo

- CMS/backend integration
- write-capable repository layer
- draft/published/archive model
- media modeling for galleries, images, and video
- admin routes and admin IA
- auth/role model
- publishing workflows for services, courses, collections, portfolio, and contacts/settings

### Dependencies

- CMS vs custom backend decision
- media storage strategy
- admin auth strategy
- publishing governance and localization workflow
- alignment with future pricing/commerce model

### Gray Areas

- should pages be fully CMS-managed or only entity content?
- is pricing editorial text or operational catalog data?
- should the admin live in the same app or separately?
- how should translations be managed: field-level, document-level, or fallback-based?

### Implementation Prompt

```text
Own the Content Platform and Admin line for `/Users/v.yelisieiev/Documents/Work/Purity/purity-fashion-studio`. Focus only on content model, repository/query architecture, CMS/backend readiness, admin IA, media management, and editor workflows. Use `docs/PRD.md`, `docs/project-audit-2026-04-20.md`, `src/lib/content.ts`, `src/lib/repository.ts`, `src/lib/types.ts`, `src/lib/query.ts`, and current route usage.

Goals:
1. Define stronger production entity types for pages, services, courses, collections, portfolio, media, and settings.
2. Add publish-state, ownership, archive, and revision-aware structures.
3. Refactor repository/query contracts to support managed content and preview.
4. Add admin IA and initial route structure for entity list/detail management.
5. Introduce real media modeling for galleries and video.
6. Support non-technical publishing workflows.

Constraints:
- do not work on payments or frontend polish except where content architecture requires it
- preserve current public behavior where possible
- remove prototype assumptions like caption-only galleries
- after coding, summarize unresolved CMS/platform decisions
```

## Line 3: UX, Responsive, Localization, Accessibility

### Objective

Make the frontend feel complete and trustworthy across breakpoints by tightening navigation, responsive behavior, localization completeness, accessibility, and motion restraint.

### Current Done

- all major sections are routed and reachable
- locale switching works
- baseline accessibility patterns exist
- major layouts collapse responsively
- visual direction is strong and premium
- motion system is centralized and reduced-motion aware

### Still Todo

- align navigation discoverability with PRD, especially Home and Atelier
- localize remaining hardcoded English UI
- fix mid-size header action disappearance
- reduce oversized mobile nav presentation
- improve form semantics and status messaging
- improve contacts-page trust and completeness
- tone down overall motion intensity

### Dependencies

- final launch navigation decision
- final localized copy in `uk/en/ru`
- real social/contact/map data
- product decision on desired motion intensity

### Gray Areas

- should Home always appear as a visible nav item?
- should Atelier be top-level or a persistent shortcut?
- should smooth scrolling remain at all?
- what is the intended MVP trust package for the contacts page?

### Implementation Prompt

```text
Own the frontend UX polish and completeness line for `/Users/v.yelisieiev/Documents/Work/Purity/purity-fashion-studio`. Focus only on UX, responsive behavior, navigation, localization completeness, accessibility, and motion polish. Use `docs/PRD.md`, `docs/project-audit-2026-04-20.md`, `src/components/site-shell.tsx`, `src/styles/app.css`, `src/routes/__root.tsx`, and affected route/content files.

Goals:
1. Improve navigation discoverability, including explicit Home visibility and direct Atelier discoverability.
2. Eliminate hardcoded English UI in shell and representative routes so all user-facing copy is localized.
3. Fix responsive shell issues around hidden header actions and oversized mobile nav links.
4. Improve accessibility with `aria-live`, failure/error states, better form semantics, `autocomplete`, stronger contrast, and a better booking date input strategy.
5. Reduce motion intensity while preserving reduced-motion support.
6. Improve contacts-page trust/completeness within current prototype constraints.

Constraints:
- do not add backend integrations
- do not expand into payments/CMS/admin work
- preserve existing visual brand direction
- after coding, list remaining copy/content dependencies
```

## Line 4: Content Depth, Media Authenticity, SEO

### Objective

Upgrade the editorial/content layer so the site has real depth: authentic media, richer collections and portfolio storytelling, cleaner localized brand tone, and a scalable SEO metadata system.

### Current Done

- trilingual content architecture exists
- service content is relatively rich
- collections have index and detail routes
- school, transformation, and portfolio have localized list surfaces
- route metadata already sets title and description
- `html lang` is driven by locale

### Still Todo

- replace generic shared media usage with content-owned assets
- extend content models for real galleries and video
- add portfolio detail depth
- enrich collections and portfolio narratives
- move hardcoded English editorial labels into localized copy
- implement canonical, alternates, OG/Twitter metadata, and richer SEO strategy

### Dependencies

- real approved media assets and captions
- multilingual brand copy approval
- decision on depth for school/transformation detail pages
- SEO strategy priorities and schema scope

### Gray Areas

- does launch require Russian parity or should `uk/en` be prioritized?
- should school and transformation get detail pages now?
- what level of collection and portfolio authenticity is required for launch?
- which structured data types matter most for MVP?

### Implementation Prompt

```text
Own the content depth, authentic media, brand tone, and SEO metadata line for `/Users/v.yelisieiev/Documents/Work/Purity/purity-fashion-studio` without touching payments/backend logic. Use `docs/PRD.md`, `docs/project-audit-2026-04-20.md`, `src/lib/content.ts`, `src/lib/types.ts`, `src/lib/seo.ts`, and relevant `src/routes/$lang/*` files.

Goals:
1. Expand the content model for asset-backed collections and portfolio cases, longform editorial content, contact/social/map fields, and typed SEO metadata.
2. Remove generic/shared media usage where content-specific media should exist.
3. Add route depth where needed, especially portfolio detail pages.
4. Eliminate hardcoded English editorial/UI labels through the content/UI system.
5. Implement a reusable locale-aware metadata framework with canonical URLs, `hreflang`, and OG/Twitter images.

Constraints:
- preserve the existing visual system unless content architecture requires light UI adaptation
- keep types strict
- keep all new content/code production-oriented, not prototype-framed
```

## Line 5: Quality, Analytics, Release Readiness

### Objective

Add the engineering safety rails required to move from polished prototype to launch-gated frontend baseline.

### Current Done

- typed TanStack Router/Query architecture exists
- build includes TypeScript typecheck
- error and not-found surfaces exist
- reduced-motion handling and route-level shell control already exist

### Still Todo

- typed env/config layer
- production gating for devtools and prototype-only behaviors
- analytics abstraction and event tracking
- test framework and scripts
- CI workflow
- release checklist and safeguards
- hardened async flow states for inquiry/booking

### Dependencies

- analytics vendor decision or provider-agnostic first step
- deployment environment matrix
- event taxonomy approval
- CI target platform
- decision on how long mocked flows remain available in non-production

### Gray Areas

- should analytics start vendor-specific or provider-agnostic?
- should devtools be runtime-hidden or excluded from production bundles?
- what is the minimum acceptable test baseline for launch?
- what error monitoring stack is approved?

### Implementation Prompt

```text
Own the production hardening and launch gating line for `/Users/v.yelisieiev/Documents/Work/Purity/purity-fashion-studio`. Do not add product features or backend integrations beyond what is needed for safe frontend hardening. Use `docs/PRD.md`, `docs/project-audit-2026-04-20.md`, `package.json`, `src/routes/__root.tsx`, and relevant source files.

Goals:
1. Add a typed env/config layer with validation and clear public vs server-only boundaries.
2. Gate router devtools and prototype-only/debug behavior for production.
3. Add a lightweight analytics abstraction with PRD-required events.
4. Add automated quality gates: lint/check/typecheck/tests.
5. Add CI workflows that fail on broken quality or release-safety rules.
6. Harden mocked booking/contact flows with failure/retry/duplicate-submit handling and non-production-only prototype messaging.

Constraints:
- preserve current UX direction
- keep changes minimal and composable
- add only the smallest necessary dependencies
- before coding, propose a short implementation plan
- after coding, run the full validation suite and state what remains mocked
```

## Recommended Parallel Execution Order

Phase 1, can start immediately in parallel:

1. Line 2: Content Platform And Admin
2. Line 3: UX, Responsive, Localization, Accessibility
3. Line 4: Content Depth, Media Authenticity, SEO
4. Line 5: Quality, Analytics, Release Readiness

Phase 2, start once product/platform decisions are clearer:

5. Line 1: Commerce And Client Journey

Rationale:

- Line 1 has the most external dependencies.
- Lines 2, 3, 4, and 5 can reduce launch risk immediately and unblock future implementation.

## Done Vs Todo Summary

### Done In This Session

- created the audit document
- defined 5 parallel roadmap lines
- wrote a strong implementation prompt for each line
- dispatched one planning agent per line
- verified that each line now has explicit gray areas/open questions
- persisted the roadmap in this document

### Still Todo

- choose which lines to execute first
- confirm unresolved gray-area decisions where required
- dispatch implementation agents using the prompts above
- review resulting changes and merge cross-line decisions
