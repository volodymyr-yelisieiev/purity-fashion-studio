# PURITY UI Audit and Polish Design

**Date:** 2026-04-16

**Goal:** Improve DRYness, UI/UX consistency, responsive behavior, and baseline accessibility/compliance across the public-facing editorial site while preserving the existing brand feel.

## Context

The current frontend is a TanStack Router + Vite site with most shared presentation primitives and layout logic concentrated in `src/components/site-shell.tsx`, route composition under `src/routes/$lang/**`, and global styling in `src/styles/app.css`.

The first audit pass found four main issues:

1. Repeated section scaffolding and error-state layouts in shared UI code.
2. Mixed content/layout patterns on the homepage, including inline locale-conditioned copy in `src/routes/$lang/index.tsx`.
3. Responsive risk from broad `overflow: hidden` usage and inconsistent width constraints.
4. Basic accessibility/compliance improvements still available even though the current semantic structure is mostly sound.

## Design Principles

- Preserve the editorial character and avoid flattening the visual identity.
- Prioritize balanced changes: improve robustness and consistency without a full redesign.
- Extract only the abstractions that are already obviously repeated.
- Keep route-level composition readable and avoid over-generalizing unlike content blocks.
- Treat this as a practical compliance baseline pass, not a formal certification exercise.

## Proposed Architecture

### 1. Shared layout primitives

Keep `src/components/site-shell.tsx` as the main presentation spine for this pass, but introduce a few focused primitives inside or alongside it:

- A reusable section wrapper for repeated `site-container section-space` usage.
- A reusable section-head block for eyebrow/title/subtitle patterns.
- A shared error-state layout used by `src/components/NotFound.tsx` and `src/components/DefaultCatchBoundary.tsx`.

This reduces obvious duplication without forcing a full component-system extraction.

### 2. Route composition cleanup

Keep the existing route structure under `src/routes/$lang/**`, but normalize repeated page recipes where the current structure is effectively the same:

- hero
- supporting quote band
- offer or card grid

The immediate targets are the index/listing-style routes such as collections and research. The homepage remains partially bespoke because its editorial storytelling is intentionally richer.

### 3. Content normalization

Move homepage locale-conditioned text in `src/routes/$lang/index.tsx` toward the same content-driven approach already used elsewhere in the repo. This improves DRYness and reduces the chance of copy drift between locales.

### 4. Responsive behavior hardening

Audit and narrow the use of global or broad `overflow: hidden` rules in `src/styles/app.css` and in menu/scroll-lock logic where it affects the document root. Favor scoped overflow management on the exact containers that need clipping.

Normalize max-width and spacing constraints so the homepage and shared components follow the same layout rhythm across desktop, tablet, and mobile breakpoints.

## UI/UX Consistency Strategy

The visual direction stays editorial and premium. The work focuses on consistency, not reinvention.

Primary consistency improvements:

- Align repeated section spacing and vertical rhythm.
- Standardize repeated heading/copy groupings.
- Reduce small differences between pages that are meant to feel like part of the same system.
- Keep CTA treatment and card rhythm consistent across similar surfaces.
- Preserve current imagery, typography tone, and motion language unless they directly conflict with usability.

## Responsive and Accessibility Strategy

### Responsive goals

- Prevent clipping and awkward cropping on smaller screens.
- Reduce mid-breakpoint layout tension caused by oversized containers or hidden overflow.
- Ensure shared sections collapse gracefully without creating inconsistent white space.
- Verify key flows visually on narrow and medium widths, not just desktop.

### Accessibility/compliance goals

- Preserve and strengthen the existing semantic structure.
- Improve focus and scroll behavior where overlays or transitions affect interaction.
- Avoid patterns that can trap content off-screen or degrade zoom/keyboard usage.
- Keep alt text, heading hierarchy, and control labeling intact while making structural improvements.

This pass targets obvious issues and establishes a stronger baseline. It does not claim complete legal or WCAG certification.

## File-Level Design Scope

### Primary files expected to change

- `src/components/site-shell.tsx`
  - extract or introduce shared layout primitives
  - reduce repeated section scaffolding
  - normalize shared visual building blocks
- `src/styles/app.css`
  - reduce risky overflow rules
  - tighten responsive layout behavior
  - normalize shared width/spacing constraints
- `src/routes/$lang/index.tsx`
  - remove inline locale-conditioned copy where practical
  - align homepage structure with shared presentation patterns without over-templating it
- `src/components/NotFound.tsx`
  - adopt shared error-state layout
- `src/components/DefaultCatchBoundary.tsx`
  - adopt shared error-state layout

### Secondary files that may change if needed

- listing routes under `src/routes/$lang/collections/index.tsx`
- listing routes under `src/routes/$lang/research/index.tsx`
- possibly other route files that benefit from a shared section-head or wrapper primitive

## Testing and Verification Design

Verification should be practical and visual:

1. Run type/build validation after implementation.
2. Check changed files for diagnostics.
3. Test in a browser at desktop and mobile widths.
4. Review the homepage, menu/overlay behavior, listing pages, and error surfaces carefully.
5. Iterate on spacing, overflow, and layout polish until the interface feels cohesive.

## Risks and Guardrails

- Do not over-abstract cards or templates that are only superficially similar.
- Do not remove the editorial character in the name of compliance.
- Do not keep broad overflow clipping if it hides real layout problems.
- Do not expand the scope into a complete design-system rewrite.
- Do not claim perfect accessibility; claim only the verified improvements made in this pass.

## Recommended Execution Approach

Use a balanced structural pass:

1. Fix the highest-value responsive and compliance risks first.
2. Extract the smallest useful shared primitives.
3. Normalize homepage and listing-page consistency.
4. Browser-test and visually polish iteratively.

This gives the best tradeoff between quality, risk, and preservation of the current brand language.
