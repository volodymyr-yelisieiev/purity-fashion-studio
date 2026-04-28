# PURITY Source Of Truth And Launch Handoff

Date: 2026-04-28

## Sources Reviewed

- Legacy site: http://purity-fashion.com/
- Photo Drive: https://drive.google.com/drive/folders/1PeVqekX20CJ9EGOsCvG8Qxb9MF0wqaX5
- Instagram: https://www.instagram.com/purity_fashion_studio/
- YouTube: https://www.youtube.com/channel/UCVTLImOTCrlad07TufNaJYw
- Facebook: https://www.facebook.com/puritypersonalstylist/

## Public Facts To Use

- Current public email from the legacy site: `voronina@purity-fashion.com`
- Current stylist/contact phone from the legacy site: `+38 067 656 19 12`
- Legacy admin phone also appears on the contact page metadata: `+38 066 00 44 066`
- Studio address from the contact page: `Киев 03150, ул. Предславинская 44, офис 1, этаж 2 (ЖК Французский квартал 2)`
- Working hours from the contact page metadata: `Каждый день 11:00 - 20:00`
- Instagram positioning: personal/corporate wardrobe collections, couture sewing, slow fashion worldwide, since 2010, art/photo space, for stylists and designers.
- Facebook positioning: stylists-designers, shoppers, tailors and masters collected around PURITY Fashion Studio.

## Legacy Site Content Map

- Main nav: concept, personal stylist, atelier-workshop, personal shopping, wardrobe review, corporate image, portfolio, contacts.
- Contacts page has the strongest operational data and was used for the current site contact settings.
- Concept page establishes the service system: stylist, shopping, atelier, showroom, personal approach, team work.
- Atelier page positions PURITY as a VIP atelier with tailoring from swimwear to fur coats, personal patterns, fittings, shoes/bags/belts/gloves, and individual cost calculation after sketch/fabric/scope.
- Wardrobe page describes a 3-step wardrobe revision and old listed price of `3000 грн`.
- Personal shopping page lists old service prices: consultation in studio free or `400 грн` with travel, lookbook without shopping `3700 грн`, shopping accompaniment `3700 грн` per full working day.
- Studio page is useful for story/history, but its old Obolon/Turgenevskaya addresses conflict with the newer contacts page; the contacts page address should win.

## Photo Drive Audit

- Current committed public photos (`purity_1` through `purity_7`) match the Drive folder `Flafman_PURITY_Image_brand`.
- The Drive connector exposed the folder structure, but raw JPEG download was not available in this session. Folder search still resolves key buckets such as `Flafman_PURITY_Image_brand` and `ATELIER_Siluette_fitting`.
- To unblock the visible site, additional public images were imported from the legacy WordPress media source and normalized into `public/images`.
- Where Drive download was blocked and unique photography was not available, the current build uses local abstract SVG visuals with no people. These are placeholders for atmosphere and layout stability, not a substitute for final client photo curation.
- Public media ownership is centralized in `src/lib/media-plan.ts`. The rule is that a planned visual asset appears once across public planned media; detail pages may show the entity media that belongs to that entity.
- Drive also contains strong buckets for later curation:
  - `ATELIER_Siluette_fitting`: atelier/fitting process photos.
  - `Atelier_portfolio`: older atelier portfolio and garment work.
  - `PURITY_Collectiions`: collection folders including Parus, cruise/Maldives, striped robe, roses dress, Dobrydneva.
  - `PURITY_about`: studio opening, early history, events and brand story assets.
  - `School_formcreation`: draping/form-creation process photos.
  - `LOGO`: source logo files.
- The repo had local ignored macOS AppleDouble files (`._purity_*`) beside the real photos. They are not tracked by git and should stay out of uploads.

## What Is Closed Now

- Public contact data now uses the legacy source-of-truth email, phone, address, hours, map link, and real social URLs.
- Local `.env.local` exists with generated development admin credentials and local JSON overlay path.
- Router devtools are disabled by default, including local development, to keep the public site surface clean during review.
- Main public pages and selected detail pages were checked for repeated visible `/images/*` references; current SSR output has no duplicate visible photo sources per checked page, excluding logo SVGs. A unit test also guards planned public media against reusing the same visual asset key.
- `.env.example` documents the split between local/staging flags and production-only secrets.
- Production handoff path is clarified below.

## Ownership And Deployment Plan

For development, it is fine to keep the repository and Vercel project under your own GitHub/Vercel account while the site is still being built. Do not connect the production domain, production payment accounts, or production email/webhook credentials to a personal-only project as the long-term owner.

Recommended production handoff:

1. Create or use the client's GitHub organization.
2. Transfer the repository to that organization, or create the final repository there and push the code.
3. Create a Vercel Team owned by the client or have the client invite you to their existing Vercel team.
4. Import the GitHub repository into the client's Vercel team.
5. Configure production environment variables in the client-owned Vercel project.
6. Connect the domain only after the client-owned Vercel project is ready.
7. Keep the domain registrar/DNS account owned by the client. You can be added as admin/collaborator.

If you already created a dev Vercel project in your account, keep it as a preview/staging project. For production, either transfer the Vercel project to the client's team if the plan supports it and settings are clean, or re-import the same GitHub repo into a fresh client-owned Vercel project. Re-import is often cleaner when payments, domains, analytics, and email credentials are involved.

## Environment Matrix

Local dev:

- `VITE_APP_ENV=development`
- `VITE_ENABLE_ADMIN=true`
- `VITE_ENABLE_ROUTER_DEVTOOLS=false`
- `APP_ENV=development`
- `ADMIN_USERNAME` / `ADMIN_PASSWORD` can be local generated credentials.
- `CONTENT_STORE_PATH=.data/purity-content-overlay.json`
- `CONTACT_WEBHOOK_URL` can stay empty; mock submission adapter is used.

Vercel preview/staging:

- `VITE_APP_ENV=staging`
- `VITE_ENABLE_ADMIN=true`
- `VITE_ENABLE_ROUTER_DEVTOOLS=false`
- `VITE_ENABLE_PROTOTYPE_FLOWS=true` only while testing unfinished flows.
- `APP_ENV=staging`
- Set generated `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`.
- Set `CONTACT_WEBHOOK_URL` if leads should be delivered.
- Do not treat `CONTENT_STORE_PATH` as durable production storage on Vercel serverless.

Production:

- `VITE_APP_ENV=production`
- `VITE_ENABLE_ADMIN=false` until production admin/CMS/storage is deliberately approved.
- `VITE_ENABLE_ROUTER_DEVTOOLS=false`
- `VITE_ENABLE_PROTOTYPE_FLOWS=false`
- `VITE_ENABLE_FORCE_MOCK_FAILURES=false`
- `VITE_ANALYTICS_MODE=off` until a real analytics provider is configured.
- `APP_ENV=production`
- Required if admin is enabled: `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`.
- Required for real leads: `CONTACT_WEBHOOK_URL`.
- Required for payments later: client-owned Stripe/LiqPay/Fondy credentials, not developer-owned credentials.

## Client-Owned Accounts Needed Before Production

- GitHub organization or final repository owner.
- Vercel team/project owner.
- Domain registrar/DNS access for `purity-fashion.com`.
- Email/webhook destination for contact and booking leads.
- Payment accounts if checkout goes live: Stripe for international cards and LiqPay/Fondy or equivalent for Ukraine.
- Analytics account, if required.
- A production content/media backend decision: headless CMS, database/blob storage, or another durable provider.

## Open Decisions

- Confirm whether old UAH prices from WordPress are still valid. They look legacy and are lower than the current PRD/service pricing.
- Select final production photo set from Drive. The Drive connector can audit folder structure, but the actual image curation should avoid near-duplicates and should be reviewed visually.
- Decide whether the first production release ships admin editing disabled with static seeded content, or waits for a durable CMS/media backend.
