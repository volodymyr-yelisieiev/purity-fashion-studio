# PURITY Editorial Design System

## Direction

PURITY should feel like an editorial fashion site, not a product dashboard. The interface is only a frame for photography, typography, and pacing. The visual reference point is closer to gallery websites and Awwwards-caliber fashion presentations than to SaaS landing pages.

The design language must reject:
- soft glass cards
- floating shadows
- pill-heavy navigation
- rounded product tiles
- decorative gradients
- synthetic 3D depth
- “Notion-like” neutral productivity styling

The design language must lean into:
- full-bleed photography
- sharp edges
- large typographic contrast
- black and white UI chrome
- generous whitespace
- restrained separators instead of containers
- a consistent editorial rhythm across every route

## Core Visual Rules

### Color
- Base canvas: `#ffffff`
- Primary text: `#090909`
- Secondary text: `rgba(9, 9, 9, 0.62)`
- Hairline: `rgba(9, 9, 9, 0.12)`
- Strong line: `rgba(9, 9, 9, 0.22)`
- Inverse surface: `#090909`
- Inverse text: `#ffffff`
- Gray is support only. The photography carries richness; the UI should not.

### Typography
- Display font: elegant serif with fashion-editorial character
- Body / UI font: clean sans
- Headlines should be oversized and spatial, never compressed into card modules
- Body text stays restrained, calm, and narrow in measure
- Micro-labels use uppercase sans with consistent tracking
- Never mix multiple decorative text styles in one section

### Form
- Default corners are sharp or near-sharp
- Avoid rounded cards as a recurring motif
- Avoid shadows unless there is a strict functional need
- Prefer borders, spacing, and composition over “surface” effects
- Imagery should bleed edge-to-edge where it matters

## Layout System

### Header
- Transparent global header that sits over white canvas and photography
- Full PURITY logo centered in the header on every inner page from first paint
- Homepage uses a scroll-led logo docking pattern:
  - full logo centered on white intro stage
  - on scroll, it scales down and settles into the centered header position
- Navigation opens as a full-width architectural sheet with the same information structure as the footer
- Header should read as a clean frame, not as a toolbar or chip row

### Hero
- Homepage top fold is white and minimal, with logo first and content hinted below the fold
- Major image bands should feel full-bleed but stay below or around one viewport in height
- Inner-page heroes are sub-viewport by default; no giant vertical media towers
- Copy sits in a disciplined editorial block, not inside a soft card

### Sections
- Use alternating patterns:
  - image-led band
  - type-led band
  - split editorial section
  - flat listing grid
- Section spacing must be consistent across the site
- Each section should feel intentionally composed, not generated from the same rounded container
- Vertical photography can be used, but never full-width at screen-and-a-half height

### Footer
- Flat, clean, informational
- Logo aligned to the same scale logic as the header
- Link groupings should feel architectural and calm
- No leftover pill badges or card shells

## Component Policy

### Badges / Micro Labels
- Use one single badge language across the site:
  - uppercase sans
  - small size
  - tracked lettering
  - monochrome
- Do not scatter multiple badge styles
- Decorative brand badges should be removed unless they serve a structural purpose

### Buttons
- Sharp, quiet, typographic
- Primary buttons may invert to black-on-white / white-on-black
- Secondary actions should be text-led or bordered, never bubbly
- Buttons must stay compact; avoid stretched call-to-action bars and awkward text wraps

### Cards
- Cards are not the default layout primitive
- If a content block must be boxed, it should still feel flat and editorial
- No elevation stacks, no translucent glass, no plush radius

### Forms
- Forms should be minimal and flat
- Inputs use lines, spacing, and contrast instead of soft panels
- Booking and contact flows should feel premium but quiet

## Photography Use

`public/images/` contains flagship editorial imagery, not filler.

Rules:
- prioritize horizontal images for heroes and major bands
- use vertical images for interstitial spreads, lists, and detail pages
- let the image crop confidently
- never place flagship photos inside soft cards
- do not fake collection imagery with abstract placeholders if a strong editorial crop works better
- if a page has no strong image match, default to a typography-led section instead of inventing decorative UI
- impose explicit max-height/aspect-ratio rules so imagery stays cinematic, not oversized

## Consistency Checklist

Every page must be checked against these questions:
- Is the logo the same visual size logic in header and footer?
- Are all micro-labels using one consistent pattern?
- Are there any leftover rounded cards, pills, shadows, or gradients?
- Does photography lead the visual tone instead of the UI chrome?
- Does the page feel sharp, quiet, and premium in black and white?
- Is spacing disciplined enough to feel designed, not templated?

## Explicit Bans

Do not reintroduce:
- glassmorphism
- soft dashboard cards
- default Tailwind “rounded-xl shadow” patterns
- tinted blue status chips as decoration
- floating blur blobs
- warm beige productivity-site gradients
- ornamental 3D treatments
