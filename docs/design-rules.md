# PURITY Design Rules

Source reference: Louis Vuitton homepage, observed 2026-07-08, used only for structural UX patterns.

## Structural Patterns

- Compact navigation: short category labels, quiet uppercase rhythm, and visible language controls.
- Visual-first hero: one strong editorial claim, one visual slot, one primary CTA and one secondary path.
- Category rails: repeated service/product cards in tight grids with restrained labels and clear onward links.
- Service grid rhythm: 2-3 column desktop grids, single-column mobile stacks, stable card dimensions.
- Maison/about block: one full-width studio band explaining method, team, and craft.
- Dense footer: brand mark, location/contact context, utility links, and language control without marketing clutter.

## PURITY Mapping

- `BrandLogo` and `LanguageSwitcher` form the header utility row.
- `ImageFrame`, `ServiceCard`, `OfferCard`, and `FeatureList` carry the hero, rails, and grids.
- `ContentPage` and `Footer` keep shared page shell behavior consistent across localized routes.
- Source-backed content in `content/data.ts` keeps public copy tied to old PURITY pages and social links.

## Guardrails

- Do not use LV assets, monogram, product images, store images, typography, public copy, or pixel-copy layouts.
- Do not mention the reference brand in public app copy.
- Keep reference checks in `scripts/check-qa.ts`; docs may describe the reference, public routes may not.
