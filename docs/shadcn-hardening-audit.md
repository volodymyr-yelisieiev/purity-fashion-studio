# PURITY Shadcn Hardening Audit

Date: 2026-07-09
Task: PURITY-18

> Historical audit. The current `b59jufTOPg` output—Base Sera, neutral semantic tokens, Noto Sans/Noto Serif, and Phosphor icons—supersedes all visual conclusions below wherever they conflict with generated preset output. The delete-map and evidence about repeated page structure remain useful.

Official surfaces checked:

- https://ui.shadcn.com/docs/components
- https://ui.shadcn.com/blocks
- https://ui.shadcn.com/docs/directory

## Delete Map

| Surface                                                                                                               | Decision                                   | Exact work                                                                                                                                                                                           |
| --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `components/ui/*`                                                                                                     | Keep as shadcn/Base UI primitives.         | Do not wrap or rename these. Add missing shadcn primitives only when they replace custom code: `aspect-ratio`, `field`, `item`, `navigation-menu`, `empty`, and possibly `toggle-group` or `switch`. |
| `BrandLogo` in `components/purity.tsx`                                                                                | Keep as PURITY composition.                | Real logo media lookup plus `next/image`; keep, but use it from one shell.                                                                                                                           |
| `LanguageSwitcher` in `components/purity.tsx`                                                                         | Keep thin composition.                     | Can be restyled with `buttonVariants`/`toggle-group`, but locale link behavior stays here.                                                                                                           |
| `ImageFrame` in `components/purity.tsx`                                                                               | Keep composition, replace inner structure. | Use shadcn `Aspect Ratio` after installing it; keep media label behavior only if used on public pages.                                                                                               |
| `FeatureList` in `components/purity.tsx`                                                                              | Keep or replace with shadcn `Item`.        | If `Item` covers the list rows cleanly, replace. Otherwise keep as one repeated PURITY list pattern.                                                                                                 |
| `ServiceCard`, `OfferCard` in `components/purity.tsx`                                                                 | Keep as Card compositions.                 | They already use shadcn `Card`; remove geometry drift and avoid adding more card wrappers.                                                                                                           |
| `BookingCTA`, `GalleryRail` in `components/purity.tsx`                                                                | Keep as real repeated sections.            | Convert to shadcn-composed markup where useful; no new layer.                                                                                                                                        |
| `EditorialHero` in `components/purity.tsx`                                                                            | Defer.                                     | Currently styleguide-only. Either wire it into real public pages in PURITY-22 or delete it.                                                                                                          |
| `PriceTag`, `ProcessStep` in `components/purity.tsx`                                                                  | Defer.                                     | Styleguide-only now. Keep only if service pages use them during densification; otherwise delete.                                                                                                     |
| `PathwaySection`, `ProcessSection`, `PricingSection`, `PortfolioSection`, `BookingSection` in `components/purity.tsx` | Delete.                                    | These only rename `Section`. Replace styleguide usage with `Section` or raw `<section>`.                                                                                                             |
| `Footer` in `components/purity.tsx`                                                                                   | Delete or fold into shell.                 | Styleguide-only and duplicates footer markup in `ContentPage` / home.                                                                                                                                |
| `ContentPage` in `components/content-page.tsx`                                                                        | Keep temporarily, then split by need.      | It is useful shared plumbing, but it underfills many pages. In PURITY-21/22, share header/footer only if that deletes duplicate JSX; make dense page bodies route-specific.                          |
| `app/[locale]/page.tsx`                                                                                               | Keep page-specific composition.            | Replace duplicate header/footer with the chosen shell and remove Card geometry drift.                                                                                                                |
| `features/booking/booking-form.tsx`                                                                                   | Keep feature UI.                           | Already uses shadcn primitives. Replace rounded fieldsets/options and consider shadcn `Field` for labels/errors.                                                                                     |

## Rounded Map

Remove these first in PURITY-19:

- `components/purity.tsx:205` and `components/purity.tsx:251` — `ServiceCard` / `OfferCard` pass `rounded-lg` to shadcn `Card`; remove it.
- `features/booking/booking-form.tsx:248` and `features/booking/booking-form.tsx:333` — fieldsets use `rounded-lg`; remove it.
- `features/booking/booking-form.tsx:270`, `features/booking/booking-form.tsx:389`, `features/booking/booking-form.tsx:417` — radio option labels use `rounded-lg`; remove it.
- `app/[locale]/styleguide/page.tsx:201` and `app/[locale]/styleguide/page.tsx:243` — demo panels use `rounded-lg`; remove it.
- `components/ui/radio-group.tsx:23` and `components/ui/radio-group.tsx:32` — radio indicator uses `rounded-full`; convert to square styling or explicitly document a third-party exception. Current PRD has no exception.

`rounded-none` in `components/ui/*` is square styling and should remain allowed by the future QA grep.

## Underfilled Map

Code and existing e2e prove routes are not blank, but they do not prove the new density bar. These pages still read as generic/underfilled because they use the same two-column `ContentPage` shell with a short list:

- Public info pages through `app/[locale]/[section]/page.tsx`: `/studio`, `/privacy`, `/terms`.
- Category pages through `app/[locale]/[section]/page.tsx`: `/stylist`, `/shopping`, `/atelier`, `/wardrobe`, `/corporate`, `/school`, `/collections`.
- Service detail pages through `app/[locale]/services/[slug]/page.tsx`: all seven visible services.
- Course and collection detail pages through `app/[locale]/courses/[slug]/page.tsx` and `app/[locale]/collections/[slug]/page.tsx`: all visible entries.
- `/portfolio` in `app/[locale]/portfolio/page.tsx`: no visible real cases, so it needs shadcn `Empty` plus a source-backed non-proof explanation and inquiry path.
- Payment status pages in `features/booking/payment-status-page.tsx`: acceptable as utility pages, but should use shadcn `Alert`/`Card` instead of generic content shell if PURITY-22 touches them.
- `/booking` and `/contacts` are less empty because the form/entrypoints add density; still need square geometry and shadcn `Field` cleanup.
- Home has enough page sections for now; it mainly needs the shared shell, square pass, and denser shadcn-composed card rhythm.

## Missing Gates

Existing checks cover preset, content, logos, generated files, contact facts, generic copy, links, screenshots, and accessibility smoke. They do not yet fail on:

- forbidden `rounded-sm|md|lg|xl|2xl|3xl|full`;
- wrapper-only PURITY aliases;
- generic `ContentPage` reuse on pages that need dense route-specific bodies;
- repeated generated imagery slots that reuse the same few files across many routes;
- screenshot density beyond "not blank and has an image".

## Implementation Checklist

1. PURITY-19: remove the rounded classes above and add a QA check that allows `rounded-none` only.
2. PURITY-20: install/use shadcn primitives for `aspect-ratio`, `field`, `item`, `navigation-menu`, and `empty` before adding custom UI.
3. PURITY-20: delete the five `*Section` aliases and any styleguide-only components not used by real pages after densification.
4. PURITY-21: dedupe header/footer between home and `ContentPage`; keep one shell only if the diff is smaller than duplicated markup.
5. PURITY-22: replace generic detail/category bodies with shadcn `Card`, `Item`, `Tabs`, `Accordion`, and source-backed sections.
6. PURITY-23: add missing unique editorial imagery for routes that currently reuse the same generated assets.
7. PURITY-24: add strict static gates for square geometry, shadcn-first imports, image coverage, and page density.
8. PURITY-25: run desktop/mobile visual review after all hardening tasks, then sync Notion.

## PURITY-29 Catalogue Replacement Pass

Checked: installed `components/ui/*`, shadcn components catalogue, shadcn blocks, and shadcn directory.

| Surface                                   | Decision                                                                   | Result                                                                                                                                                       |
| ----------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Header/mobile/footer shell                | Keep current `Sheet`, `Separator`, and `buttonVariants` composition.       | P27/P28 already replaced text-logo and footer social-link drift with image logo and button vocabulary.                                                       |
| `EnhancedContrastToggle`                  | Replace bespoke raw button styling with existing `buttonVariants`.         | Done in `components/theme-provider.tsx`; behavior stays local because it owns theme state.                                                                   |
| Contact social links                      | Replace bespoke bordered anchors with existing `buttonVariants`.           | Done in `app/[locale]/contacts/page.tsx`; footer had already moved to the same vocabulary.                                                                   |
| `ServiceCard`, `OfferCard`, content cards | Keep direct `Card` composition.                                            | Already use shadcn `Card`, `CardHeader`, `CardContent`, `CardTitle`, and `CardDescription`; no new wrapper atoms.                                            |
| Forms and controls                        | Keep existing `Input`, `Textarea`, `Select`, `Checkbox`, and `RadioGroup`. | Booking/contact forms already compose installed primitives; defer page-specific density to page tickets.                                                     |
| New catalogue additions                   | Skip.                                                                      | `navigation-menu`, `sidebar`, `field`, `item`, and `empty` would add more code than they delete in this pass; revisit only inside the relevant page tickets. |
