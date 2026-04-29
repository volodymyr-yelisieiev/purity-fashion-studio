# Media follow-ups

This pass did not run image generation and did not add new generated assets. The goal was to stop treating abstract SVGs as primary editorial photography and to leave a clear plan for the next photo-generation pass.

## Current state

- Primary page media now points at existing photographic assets instead of `abstract-*.svg`.
- `public/images/generated/` exists but is empty in this workspace.
- Abstract SVGs remain available only as decorative/support graphics in the media plan.
- Collection and portfolio entity media still use a limited pool of existing photos, so the next pass should replace weak or repeated visuals with route-specific editorial assets.

## Follow-up list

| Route | Slot | Current asset | Problem | Recommended next action |
| --- | --- | --- | --- | --- |
| `/uk` | layered hero | `atelier-workshop.jpeg`, `wardrobe-system.jpeg`, `atelier-detail.jpeg`, `portfolio-black-look.jpeg`, `stylist-lookbook.jpeg` | Existing photos are real assets, but several are reused elsewhere and may not all carry the same editorial story. | Review crops manually, then generate or shoot a coherent home hero set if needed. |
| `/uk/collections` | collection cards | `portfolio-black-look.jpeg`, `purity_7.webp`, `shopping-fitting.jpeg`, `purity_2.webp` | Cards are no longer abstract placeholders, but the image set is not yet collection-specific enough. | Replace with dedicated Dress for Victory, Retreat Wear, Travel Capsule, and Silky Touches editorial images. |
| `/uk/collections/dress-for-victory` | detail gallery | existing `purity_*` and fallback gallery assets from content | Detail gallery is functional, but it still reads partly as reused archive imagery rather than final collection proof. | Generate or replace with collection-specific full-length, detail, and movement shots. |
| `/uk/portfolio` | portfolio cards | `stylist-consultation.jpeg`, `concept-team.jpeg`, `purity_6.webp` | Cards avoid abstract SVGs, but case identity is still uneven. | Create one distinct case image per portfolio story. |
| `/uk/portfolio/soft-power-capsule` | case proof/gallery | existing case gallery/fallback assets | Visual proof is acceptable for stabilization but still not a final before/after case story. | Replace with editorial before/after styling imagery in the next photo pass. |
| `/uk/transformation` | transformation cards | `purity_5.webp`, `purity_1.webp`, `concept-atelier.jpeg` | The images are real, but they are not yet a fully coherent transformation trilogy. | Review whether each card needs a dedicated ritual/transformation image. |
| `/uk/school` | course cards | `stylist-editorial.jpeg`, `atelier-detail.jpeg`, `wardrobe-system.jpeg` | The school page is no longer abstract-led, but course visuals may need stronger educational proof. | Replace weak course visuals with draping, wardrobe management, and atelier study images. |
| global decorative/support slots | support graphics | `abstract-*.svg` from `homeMedia`, `listingProcessMedia`, `listingPreviewMedia` | These assets are acceptable only as decoration or secondary graphic rhythm. | Keep decorative with empty/suppressed alt if rendered as non-content, or replace before promoting to a primary slot. |

## Next pass rule

Before running `npm run images:generate`, map each missing image to a concrete route and slot. Do not regenerate the whole library just because the pipeline exists.
