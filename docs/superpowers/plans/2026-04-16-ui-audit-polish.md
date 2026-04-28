# PURITY UI Audit and Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve DRYness, UI/UX consistency, responsive behavior, and baseline accessibility/compliance across the public-facing editorial site while preserving the current editorial feel.

**Architecture:** Keep the existing TanStack Router route structure and editorial visual language, but reduce duplication by extracting small shared presentation primitives and tightening shared CSS/layout behavior. Prioritize responsive and accessibility-risk fixes first, then normalize repeated section patterns, then browser-test and polish until the front feels cohesive.

**Tech Stack:** React 19, TanStack Router, TypeScript, Vite, shared global CSS in `src/styles/app.css`

---

## File Structure

### Primary files

- Modify: `src/components/site-shell.tsx`
  - introduce or extract a shared section wrapper
  - introduce or extract a shared section head block
  - introduce or extract a shared error-state layout
  - normalize repeated page-building primitives without over-generalizing unlike content
- Modify: `src/styles/app.css`
  - narrow broad overflow clipping
  - normalize shared width and spacing behavior
  - improve mobile and mid-breakpoint layout stability
- Modify: `src/routes/$lang/index.tsx`
  - remove inline locale-conditioned copy where practical
  - align homepage sections with shared primitives where useful
- Modify: `src/components/NotFound.tsx`
  - adopt the shared error-state layout
- Modify: `src/components/DefaultCatchBoundary.tsx`
  - adopt the shared error-state layout

### Secondary files

- Modify if needed: `src/routes/$lang/collections/index.tsx`
- Modify if needed: `src/routes/$lang/research/index.tsx`

### Validation targets

- Build/typecheck via `npm run build`
- Browser-check homepage, menu, listing pages, and error states at desktop + mobile widths

## Task 1: Baseline audit and CSS safety pass

**Files:**
- Modify: `src/styles/app.css`
- Reference: `docs/superpowers/specs/2026-04-16-ui-audit-design.md`

- [ ] **Step 1: Identify every broad overflow rule and width constraint that affects layout rhythm**

Review the actual declarations around the shared layout, hero, card, and shell regions. Capture which selectors use broad clipping and which selectors define container/max-width behavior.

Run: `grep -n "overflow\|max-width\|width:" src/styles/app.css`
Expected: a list of declarations covering the shell, hero, card, and responsive layout rules.

- [ ] **Step 2: Write a failing layout checklist before editing CSS**

Create a short handwritten checklist in your working notes with these conditions and treat any violation as a failure:

```text
1. No essential text or CTA is clipped at narrow mobile width.
2. Section spacing remains visually even from desktop to mobile.
3. Shared containers do not feel oversized at mid breakpoints.
4. Overlay/menu behavior does not permanently lock page scroll.
```

Expected: you have a concrete pass/fail list before touching styles.

- [ ] **Step 3: Narrow risky overflow clipping to the smallest necessary containers**

Update `src/styles/app.css` so that decorative/media clipping stays local to the exact visual surface that needs it, rather than broad shared wrappers. Prefer safe visible overflow on layout containers unless a component truly needs clipping.

Use this target pattern while editing:

```css
/* Keep clipping local to media surfaces, not shared layout wrappers */
.editorial-card-media,
.page-hero-media,
.compact-intro-media {
  overflow: clip;
}

.site-container,
.section-space,
.site-frame {
  overflow: visible;
}
```

Expected: fewer broad clipping rules and safer layout behavior on small screens.

- [ ] **Step 4: Normalize container and max-width rhythm**

Adjust shared width constraints so homepage copy, section heads, and shared editorial text align to one rhythm instead of mixing one-off max widths.

Use this target pattern while editing:

```css
:root {
  --content-width: 42rem;
  --content-width-wide: 48rem;
}

.section-copy,
.editorial-copy-measure {
  max-width: var(--content-width);
}
```

Expected: shared copy blocks and section heads can reuse a small set of consistent measures.

- [ ] **Step 5: Run build validation for the CSS pass**

Run: `npm run build`
Expected: successful Vite build and TypeScript check with exit code 0.

## Task 2: Extract shared section primitives from the shell layer

**Files:**
- Modify: `src/components/site-shell.tsx`
- Test via build: `npm run build`

- [ ] **Step 1: Find repeated section wrapper and section-head markup in `src/components/site-shell.tsx`**

Locate repeated instances of these patterns:

```tsx
<section className="site-container section-space">...

<div className="section-head">
  <p className="eyebrow">...</p>
  <h2 className="section-title">...</h2>
  <p className="editorial-copy ...">...</p>
</div>
```

Run: `grep -n "site-container section-space\|section-head" src/components/site-shell.tsx`
Expected: multiple repeated matches that justify extraction.

- [ ] **Step 2: Implement a minimal shared section wrapper**

Add a focused wrapper that preserves the current class-based system:

```tsx
function Section({ children, className }: { children: React.ReactNode; className?: string }) {
  return <section className={cn('site-container section-space', className)}>{children}</section>
}
```

Expected: repeated `<section className="site-container section-space">` instances can migrate to `Section` without visual change.

- [ ] **Step 3: Implement a minimal shared section head block**

Add a presentation-only helper for repeated heading groups:

```tsx
function SectionHead({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string
  title: string
  subtitle?: string
}) {
  return (
    <div className="section-head">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="section-title">{title}</h2>
      {subtitle ? <p className="editorial-copy editorial-copy-measure">{subtitle}</p> : null}
    </div>
  )
}
```

Expected: shared sections can reuse one heading scaffold while keeping editorial styling intact.

- [ ] **Step 4: Replace only the obvious duplicated usages**

Refactor repeated internal usages to the new primitives, but do not force unlike layouts into them.

Expected: a smaller diff with clearer shared structure, not a full rewrite.

- [ ] **Step 5: Run build validation after primitive extraction**

Run: `npm run build`
Expected: successful build and no TypeScript errors.

## Task 3: Unify error-state layout

**Files:**
- Modify: `src/components/site-shell.tsx`
- Modify: `src/components/NotFound.tsx`
- Modify: `src/components/DefaultCatchBoundary.tsx`
- Test via build: `npm run build`

- [ ] **Step 1: Compare both existing error layouts side by side**

Confirm the repeated structure in both files before extracting.

Run: `grep -n "min-h-\[60vh\]\|editorial-panel\|hero-actions" src/components/NotFound.tsx src/components/DefaultCatchBoundary.tsx`
Expected: overlapping container and action layout patterns.

- [ ] **Step 2: Implement a shared error-state layout component**

Create a small layout helper in `src/components/site-shell.tsx` or a nearby shared file:

```tsx
function ErrorStateLayout({ children, centered = false }: { children: React.ReactNode; centered?: boolean }) {
  return (
    <div className={cn('site-container min-h-[60vh] py-16', centered && 'flex flex-col items-center justify-center text-center')}>
      <div className="editorial-panel max-w-2xl">{children}</div>
    </div>
  )
}
```

Expected: both error surfaces share one structural shell.

- [ ] **Step 3: Refactor `NotFound` to the shared layout**

Keep the existing actions and message, but wrap them in the new shared error-state layout.

Expected: `NotFound` becomes shorter with no visual regression.

- [ ] **Step 4: Refactor `DefaultCatchBoundary` to the shared layout**

Preserve retry/back behavior while reusing the same structural shell.

Expected: error states feel part of one system.

- [ ] **Step 5: Run build validation after error layout refactor**

Run: `npm run build`
Expected: successful build and unchanged runtime wiring.

## Task 4: Normalize homepage content and repeated composition

**Files:**
- Modify: `src/routes/$lang/index.tsx`
- Modify if needed: `src/components/site-shell.tsx`
- Test via build: `npm run build`

- [ ] **Step 1: Locate inline locale-conditioned copy in the homepage route**

Find any ternary or locale-branching strings embedded directly in JSX.

Run: `grep -n "locale === 'en'\|locale === 'ru'\|locale === 'uk'" src/routes/\$lang/index.tsx`
Expected: one or more inline branches that should be moved into data/constants.

- [ ] **Step 2: Move homepage inline localized copy into a local map or content helper**

Use a simple content object if the copy is homepage-specific:

```tsx
const atelierHeadings = {
  en: 'Atelier, school, and collection work held inside one editorial rhythm.',
  ru: 'Atelier, школа и коллекции в одном editorial-ритме.',
  uk: 'Atelier, школа й колекції в одному editorial-ритмі.',
} as const
```

Expected: JSX becomes simpler and future copy maintenance is safer.

- [ ] **Step 3: Replace one-off max-width utility usage with the shared copy measure where practical**

Update homepage copy blocks to use the normalized class or shared pattern established in Task 1 instead of route-local one-off measures where it improves consistency.

Expected: homepage text rhythm aligns better with the rest of the site.

- [ ] **Step 4: Refactor only clearly repeated section composition into shared shell primitives**

Use `Section` or `SectionHead` where the route already matches those patterns. Do not force bespoke editorial blocks into generic wrappers if that makes them harder to read.

Expected: a cleaner homepage with preserved storytelling structure.

- [ ] **Step 5: Run build validation after homepage normalization**

Run: `npm run build`
Expected: successful build and no route-level type errors.

## Task 5: Harmonize listing-page rhythm without full template overreach

**Files:**
- Modify if needed: `src/routes/$lang/collections/index.tsx`
- Modify if needed: `src/routes/$lang/research/index.tsx`
- Modify if needed: `src/components/site-shell.tsx`
- Test via build: `npm run build`

- [ ] **Step 1: Compare the listing route structures**

Confirm which parts are truly shared between the collection and research index pages.

Run: `grep -n "<PageHero\|<QuoteBand\|<OfferGrid" src/routes/\$lang/collections/index.tsx src/routes/\$lang/research/index.tsx`
Expected: matching page recipe with small content differences.

- [ ] **Step 2: Extract only the repeated wrapper/composition pattern if it makes the routes simpler**

Use a small shared page recipe helper only if it reduces duplication without hiding route intent.

Use this target shape if justified:

```tsx
function StandardListingPage({ hero, quoteTitle, quoteText, children }: Props) {
  return (
    <>
      <PageHero {...hero} />
      <QuoteBand title={quoteTitle} text={quoteText} />
      {children}
    </>
  )
}
```

Expected: routes stay readable and slightly drier.

- [ ] **Step 3: Keep card differences explicit**

Do not merge `ServiceCard` and `CollectionCard` unless the final diff shows the markup is truly the same. Prefer consistency tweaks over aggressive unification.

Expected: reduced risk of visual regressions from false abstraction.

- [ ] **Step 4: Run build validation after listing-page cleanup**

Run: `npm run build`
Expected: successful build and no accidental route regressions.

## Task 6: Browser verification and iterative visual polish

**Files:**
- Verify: `src/components/site-shell.tsx`
- Verify: `src/styles/app.css`
- Verify: `src/routes/$lang/index.tsx`
- Verify: listing routes and error surfaces changed earlier

- [ ] **Step 1: Start the app locally**

Run: `npm run dev`
Expected: local Vite server starts successfully.

- [ ] **Step 2: Verify the homepage at desktop width**

Check these conditions:

```text
1. Header, hero, and section spacing feel even.
2. No clipped text or CTA in editorial sections.
3. Homepage bespoke blocks still feel premium and intentional.
```

Expected: desktop homepage feels cohesive.

- [ ] **Step 3: Verify narrow mobile behavior**

Check these conditions:

```text
1. No horizontal overflow.
2. No clipped hero, card, or copy content.
3. Menu overlay opens, traps focus reasonably, and closes without broken scroll.
```

Expected: mobile layout is stable and usable.

- [ ] **Step 4: Verify listing pages and error surfaces**

Check collections, research, and the shared error-state surfaces for spacing, CTA rhythm, and structural consistency.

Expected: listing pages feel related and error states feel intentionally designed.

- [ ] **Step 5: Perform one polish loop if anything still feels off**

If the browser check reveals uneven spacing, clipping, or visual noise, make one focused polish pass and re-run:

Run: `npm run build`
Expected: final build passes after the polish loop.

## Final Verification Checklist

- [ ] `npm run build` passes.
- [ ] Changed files have no LSP errors.
- [ ] Homepage reviewed on desktop and mobile widths.
- [ ] Menu/overlay behavior reviewed manually.
- [ ] Listing pages reviewed manually.
- [ ] Error-state pages reviewed manually.
- [ ] Only verified accessibility/compliance improvements are claimed.
