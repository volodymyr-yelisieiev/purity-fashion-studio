# Visual follow-ups

## Critical cleanup completed

- Production-unsafe local/prototype/CRM copy was removed from public form messaging.
- Locale leaks were cleaned for `/uk`, `/en`, and `/ru`.
- Collections now render consistently from the same published source.
- Portfolio detail section numbering is generated from content order.
- Primary page media no longer uses abstract SVGs as fake editorial photography.
- Browser-use rendered-page sweep covered the required route list on the local production-surface dev server.
- Playwright visual regression covers the requested public routes across the configured mobile, tablet, and desktop viewport matrix.

## Needs manual visual pass later

### `/uk`

- [ ] Review the layered hero crop and logo/header scale on narrow mobile.
- [ ] Check whether the first fold should reduce image density on mobile.
- [ ] Review repeated home imagery against the desired editorial story.

### `/uk/collections`

- [ ] Replace or generate collection-specific editorial images later.
- [ ] Review Silky Touches visual identity once final images exist.
- [ ] Check whether the large intro image is too tall on mobile for the desired editorial rhythm.

### `/uk/collections/dress-for-victory`

- [ ] Review gallery quality and collection-specific proof images.
- [ ] Confirm that detail-page image rhythm feels editorial, not archive-like.

### `/uk/portfolio`

- [ ] Review whether every case card has a distinct visual identity.
- [ ] Replace weak reused imagery in the future image pass.

### `/uk/portfolio/soft-power-capsule`

- [ ] Replace remaining generic case imagery with real/generated before-and-after styling proof.
- [ ] Re-check the `04 Results` / `05 Visual system` sequence after final copy review.

### `/uk/school`

- [ ] Review course image quality and final terminology.
- [ ] Check if the education page needs more tactile draping/process imagery.

### `/uk/contacts`

- [ ] Review the contact hero crop and image brightness on mobile.
- [ ] Check form spacing after final copy and lead-routing decisions.

### `/uk/book`

- [ ] Review the booking form select label: the accessible label is present, but the compact control text can read as repeated copy in text extraction.
- [ ] Check form density on 320-390px screens after final manual design pass.

### Header / menu

- [ ] Review mobile menu overlay contrast. Browser-use showed page content faintly visible behind the menu panel, which may need a stronger solid editorial surface.
- [ ] Re-check focus/escape behavior after any menu visual changes.
