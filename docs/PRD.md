# PURITY Fashion Studio Website PRD (TanStack-based Frontend)

## Executive Summary

This document defines the product requirements for the new PURITY Fashion Studio website, a premium minimalist trilingual site that sells stylist and atelier services, presents collections and portfolio, and supports clients in Ukraine and internationally.[^1]
The frontend will be implemented as a modern React application using TanStack Router for routing, TanStack Query for data fetching and caching, and TanStack Table for admin data views.

## Product Vision and Goals

PURITY Fashion Studio is a studio that creates wardrobes, collections, and looks for private and corporate clients.[^1]
The website should embody the brand philosophy of feeling form, fabric, and the client’s future, while providing a clean and frictionless digital experience.[^1]

Key goals:

- Sell stylist services and couture atelier services online, with the ability to purchase and book directly from the website.[^1]
- Present the studio’s methodology (Research, Realisation, Transformation) and educational offerings in a clear, structured way.[^1]
- Showcase collections and portfolio cases with strong, minimal visual presentation.[^1]
- Support trilingual content (Russian, Ukrainian, English) with full localization and easy content management by non-technical staff.[^1]
- Provide convenient online payments for Ukrainian and international clients using local and global payment providers.[^1]

Non-goals (for this release):

- Full standalone platform for the future separate PURITY School site (current scope covers only the School section on the main site).[^1]
- Complex logged-in customer dashboards; the focus is on marketing pages and transactional booking/checkout flows.

## Target Users and Use Cases

### User Types

- Individual clients (women and men) seeking personal style research, wardrobe revision, and custom garments.[^1]
- Corporate clients seeking styling for teams, events, or brand collaborations.[^1]
- Students and aspiring designers interested in PURITY educational courses and the future School of Draping.[^1]

### Primary Use Cases

- Discover the studio’s philosophy and approach, understand “Research” and “Realisation” stages.[^1]
- Explore specific services (e.g., Personal Lookbook, Wardrobe Review, Shopping Service, Atelier) and understand scope, format, pricing, and process.[^1]
- Select and purchase a service online (choose format, date/time if applicable, and pay online).[^1]
- Discover and inquire about collections (e.g., “Dress for Victory”, retreat clothing, travel capsule, Silky Touches) and send a request.[^1]
- Browse portfolio cases, before/after examples, and lookbooks to assess quality.[^1]
- View and purchase educational courses, understanding number of sessions, format, and price.[^1]
- Contact the studio for custom or corporate requests.

## Brand and UX Requirements

### Brand Style

The site must reflect a premium minimalist style inspired by Net-a-Porter and similar references, with clean design, white space, strict typography, and focus on silhouette and fabric.[^1]
Visuals should use large imagery, airy modular blocks, and light animations (e.g., subtle fade-in), avoiding heavy visual effects.[^1]

### Tone of Content

- Sophisticated, calm, and expert tone.
- Short, precise copy with strong headlines and clear service descriptions.
- Emphasis on sensory experience: form, movement, fabric, future self.[^1]

## Information Architecture and Sections

### Global Navigation

Top-level navigation should include:

- Home
- ЯИсследование / Research
- ЯВоплощение / Realisation (Implementation)
- ЯТрансформация / Transformation (as side/additional block)[^1]
- Atelier
- School
- Collections
- Portfolio
- Contacts

All main service clusters (Research, Realisation, Transformation, School, Collections, Portfolio) must be directly discoverable from the main navigation or hero sections.[^1]

### Home Page

Home page requirements:

- Strong hero section with mission statement and tagline such as “@RESEARCH @IMAGINE @CREATE your PERFECT WARDROBE.”[^1]
- Highlight of three pillars: ЯИсследование, ЯПеревоплощение, ЯТрансформация.[^1]
- Quick-entry blocks for “Atelier”, “School”, and “Collections” with imagery.
- Prominent “Book Now / Купить услугу” call-to-action buttons leading to relevant service purchase flows.[^1]
- Short “About Studio” section: philosophy “Ощути форму. Ощути ткань. Ощути своё будущее.” and methodology description.[^1]
- Brief explanation of directions: private clients and corporate clients.[^1]

### Research Section (ЯИсследование)

This section presents services related to style research.[^1]

Services:

1. Personal Lookbook
   - Composed of two mandatory sub-services: Color Palette (personal color palette) and Cut Strategy (silhouette strategy).[^1]
   - Both services jointly form a personal lookbook for the client.[^1]

2. Wardrobe Review (ревизия гардероба)
   - Analysis of current wardrobe, with recommendations on what to keep, what to buy, what to tailor, and which elements are needed in a capsule wardrobe.[^1]

For each service the page must include:

- Detailed service description and value.[^1]
- Format (online / in-studio session).[^1]
- Pricing in euro and hryvnia.[^1]
- “Buy” button linking to checkout/booking with selected language and currency.[^1]
- Visual examples (e.g., lookbook pages, before/after wardrobe photos where appropriate).[^1]

Each service under Research must have its own landing-style page reachable from the main Research page and the global navigation structure (nested routes).[^1]

### Realisation Section (ЯВоплощение / Implementation)

This section covers implementation services: stylist shopping support and atelier.[^1]

Services:

1. Shopping Service
   - Online shopping plan (remote shopping plan with links).
   - Live accompaniment in stores.[^1]

2. Atelier Service
   - Stages of work, starting with the dossier (personal mannequin) as mandatory first step.[^1]
   - Custom garment production: dresses, jackets, etc., with example price ranges (Dress: 500–700 euro, Jacket: 600–800 euro, atelier hourly rate 25 euro per hour).[^1]

Each service page must include:

- Process description (steps, timeline).[^1]
- Visual examples and references.[^1]
- Pricing (with currency options).[^1]
- Lead-time expectations (approximate timelines).[^1]
- “Order / Book” buttons.

### Transformation Section (ЯТрансформация)

Transformation is an additional side block grouping transformative experiences and courses.[^1]

It should include:

- Course “Create Your ‘Dress of Victory’ with the Designer.”[^1]
- Photomeditation “Wholeness” based on five archetypes of Old Slavic goddesses.[^1]
- Fashion retreat offerings.[^1]

Each item should have a short description, format, and CTA (book, request details, or join waitlist).

### School Section (Школа PURITY)

The School of Draping PURITY will be a separate site in the future, but the main site should have a dedicated School section now.[^1]

The School page must include:

- Catalog of courses such as “Dress for Victory”, “Draping / Macetirovanie”, and “Wardrobe Management”.[^1]
- For each course: number of sessions, format (online / studio), price in euro and hryvnia, and payment button.[^1]
- Clear indication that a standalone School site will follow later (optional note in admin content only, not necessarily for users).[^1]

### Collections Section

The Collections section presents capsule and thematic collections.

Collections include, for example:

- “Dress for Victory” (shootings, events).[^1]
- Clothing for retreats (yoga, home, rest, lingerie).[^1]
- Travel capsule collection created with Vika Veda (e.g., 1,000 euro for a capsule of 5 silk items).[^1]
- “Silky Touches / Шёлковые Дотики”: cruise, yacht, yoga everywhere, chiffon dresses.[^1]

Each collection page must include:

- Photo gallery.
- Text descriptions and story.
- Option to send a request or begin consultation about ordering pieces.[^1]

### Portfolio (Cases) Section

The Portfolio section showcases work outcomes.

It must include:

- Lookbooks.
- Before/after examples.
- Video embeds where needed.[^1]

The admin panel must support adding new cases with images, text, and optional video links.[^1]

### Contacts Section

The Contacts section must include:

- Inquiry form (name, contact details, message, optional service interest).
- Ability to schedule or request booking.
- Contact details specifically for corporate clients.[^1]
- Links to social networks.
- Map embed for studio location.[^1]

## Functional Requirements

### Trilingual Localization

- Full support for Russian, Ukrainian, and English content across all pages.[^1]
- Language switcher accessible from main navigation on desktop and mobile.[^1]
- All content entities (pages, services, collections, courses, portfolio items) must be localizable.

Implementation note (TanStack):

- Use TanStack Router route loaders to fetch localized content based on active language parameter.
- Maintain language in URL (e.g., `/en/...`, `/ru/...`, `/uk/...`) for SEO and clarity.

### Online Payments

Payments must support both Ukrainian and international clients.[^1]

For Ukraine:

- Integrate LiqPay or Fondy.
- Accept cards from local banks (PrivatBank, Monobank) and Apple Pay / Google Pay.[^1]

For international clients:

- Integrate Stripe to accept Visa/Mastercard worldwide.[^1]

Functional requirements:

- Payments must be tied to specific services or courses (products) with correct pricing per currency.[^1]
- Successful payment should trigger confirmation email and internal notification.
- Handle payment status (success, failure, cancellation) with clear messaging.

### Service Purchase and Booking Flows

- From any service page, the user can click “Buy / Book Now” and see a focused flow to:
  - Confirm selected service and language.
  - Choose format (online / studio) if applicable.[^1]
  - Choose date/time (if synchronous session).
  - Provide contact details.
  - Pay online using appropriate provider.
- Display brief summary of conditions (price, duration, location or online, cancellation terms) before final confirmation.

### Content Management

The system must allow non-technical staff to manage content.[^1]

Admin capabilities:

- Add, edit, archive services (including research, realisation, and transformation offerings).[^1]
- Update prices and currencies.[^1]
- Add new collections and manage their galleries and descriptions.[^1]
- Upload portfolio cases (images, texts, videos).[^1]
- Manage course catalog, including sessions count, format, and pricing.[^1]

Admin UX can use TanStack Table to manage lists (services, collections, courses, portfolio entries) with sorting and filtering.

### Multimedia and Assets

- Support high-resolution images, optimized for web (lazy loading, responsive sizes).
- Allow embedding of video from external platforms or uploading as supported formats.

### Forms and Integrations

- Contact form submissions stored in backend and optionally sent via email to a configured address.
- Optional integration with CRM or email marketing tools (out of scope for MVP, but architecture should allow adding webhooks or API integrations later).

## Non-Functional Requirements

### Performance

- Fast loading on desktop and mobile (use image optimization, code splitting, caching).
- Use TanStack Query caching and prefetching to minimize redundant network requests.

### SEO

- Server-side rendering or static generation for key marketing pages to ensure good SEO.
- Localized meta tags per language.
- Clean URLs, readable slugs for services and collections.

### Accessibility

- Proper semantic HTML structure.
- Sufficient color contrast and focus states.
- Keyboard navigability for all interactive elements.

### Security

- Secure handling of payment flows through trusted providers (LiqPay / Fondy / Stripe).[^1]
- Protection of personal data (TLS, no sensitive data stored in front-end only systems).

## Technical Architecture (TanStack Focus)

### Frontend Stack

- React as the main UI library.
- TanStack Router for routing and nested layouts.
- TanStack Query (React Query) for data fetching, caching, and synchronization with backend APIs.
- TanStack Table for admin data grids (services, courses, collections, portfolio entries).
- Styling via a modern CSS approach (e.g., Tailwind CSS or CSS-in-JS) with a custom design system reflecting PURITY branding.

### Routing Structure (Indicative)

- `/` – Home
- `/:lang/research` – Research index
- `/:lang/research/personal-lookbook`
- `/:lang/research/wardrobe-review`
- `/:lang/realisation` – Realisation index
- `/:lang/realisation/shopping-service`
- `/:lang/realisation/atelier`
- `/:lang/transformation`
- `/:lang/school`
- `/:lang/collections`
- `/:lang/collections/:slug`
- `/:lang/portfolio`
- `/:lang/contacts`

TanStack Router will handle nested layouts for language, main section, and detail pages.

### Data Layer

- Backend API (REST or GraphQL) exposing entities: services, collections, courses, portfolio, pages, and localization content.
- TanStack Query hooks per entity (e.g., `useServices`, `useCollections`, `useCourseBySlug`) with caching and background refresh.

### Admin Interface

- Admin app can share the same frontend stack but gated behind authentication.
- TanStack Table-based views for listing entities, with inline edit or detail forms.

## Analytics and Tracking

- Track page views and key events such as service page views, CTA clicks, checkout starts, and successful payments.
- Track language preference distribution to inform content focus.

## Risks and Open Questions

- Final decision on exact payment provider (LiqPay vs Fondy) for Ukrainian payments needs to be made.[^1]
- Confirmation of exact list of initial services, collections, and courses at launch.[^1]
- Decision on backend/CMS platform (headless CMS vs custom backend) and hosting environment.
- Clarification of whether corporate client flows require separate forms or pricing pages.

## Acceptance Criteria (MVP)

- All key sections (Home, Research, Realisation, Transformation, School, Collections, Portfolio, Contacts) are implemented and reachable from navigation in three languages.[^1]
- Each listed service under Research and Realisation has its own page with description, format, pricing in euro and hryvnia, and a working “Buy / Book” flow leading to payment.[^1]
- At least one collection and several portfolio cases are published with images and descriptions.[^1]
- Online payments work for at least one Ukrainian provider and Stripe for international cards.[^1]
- Admin can create and update services, collections, courses, and portfolio entries without developer assistance.[^1]
- Site visually matches the described minimalist Net-a-Porter-like aesthetic with strict typography, white space, and light animations.[^1]

---

## References

1. [pasted-text.txt](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/collection_7caeda1c-85f0-4715-97b1-870ffd2cb1e8/d0674112-6d85-47a9-92f5-e8d581ca71cc/pasted-text.txt?AWSAccessKeyId=ASIA2F3EMEYEXAM2ZDY4&Signature=S%2BeeD77MVOFRE5qM7s2G6hTOtBc%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEIL%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIQCpLLt7PNbKlZ6Da%2BKdj889lYAafssFr9HGP0N%2FTtS5nAIgfeOyzd37rQqEjhddid9QwL2YQPciYDQsGfbm%2FXQNj60q8wQISxABGgw2OTk3NTMzMDk3MDUiDJ6yBfF98qUgBDPQzyrQBCEvdbH%2FDKGpvKzJZX73RsmNLlynv96%2BxfTGeHPAKAU6UN3nsN%2BY1jhJqnXw%2FLLWjrVASgJQUcKB%2F%2FR9NQpW5WwL9d4ch%2Bjd0eDkZuOgPDKGMpAmdR2cLEvnuBCvXGislJZ2rvhLaxThsUmXiYAHi6%2BP%2B7bejsz7vcG4esQe2YShp4%2F3bu1YjIhVnR3IvTBDxLs%2FhrPnT8rSDJPS8nPEA6lBE7WinAeuv8UU6jb%2FlqAvgrUxk9Odf3%2FEO8ratbqEak9x%2Fq8Zm8YJ1cJtmew6kWZkf7ktwLhuHnoeFPX2WVJdNY9vgNe9e7YFhur3PKUhXiNEuvrfW8n%2BDnXH06iWTBo%2FJ0aaYlIrAlkU0MHk8KYwkQGL1Sesf%2FDpXNvg5Y%2Bs4b6MVKsDk%2FVtUvjkSOg0t3LFA%2FaUGPuigkfprallnexf%2BDzPqMgmpnyToYWp1DdWI8aIs4p%2BzczExfCxNLlWA%2B6xlZF5VnjU%2FE8VBvJi4gPJso9S00xzFozG0K8HDjWeVdRX0bNa2tyG8PfJ4E5%2BqsqjnCMHPAWOsBvGiAUqGhYesmVnF0MgYeWxIimgYpct4Ky1Q2mUq6qenCNxTCaZaIU96ghvXxlvzdsog7k1qq9eCWg6NjitLkBbN8KZUtEl25q4cPjTaErTq6%2BOhYG6vl2fsiR%2BhWEab8aaJHf7ij1IHmFFWp4Q7m18k9IE8nWRoIcAcYLyWmQ1ByiAMbgHlwVLu8fcNPgo7Khr%2F0aXU7pLtOQvbJZYxZKgPOqE%2B%2BG9vSmQKIzoUcP2yf0nB4n8lVwwxYvqzgY6mAEN4UiqQa0KO0LtHLho8QS7JVhjO3EzLZidhZG1BcM4CeAh2Rmh8m7x5HZybQ3lJU3s17gPSV4y0GRj4mgGjlFJF9MOBG70TMXr8ychhJrEa1NY4D3EA063rRTEY5TVLIJZfT87dmAHBiCrUKG6m7b%2F%2FezdOZudy%2B9raCj3rgQkNM%2Fk9rP3naMUQ3N%2FWVHOr1PnsxOuXB3hVA%3D%3D&Expires=1775932312) - БРИФ ДЛЯ РАЗРАБОТЧИКА




САЙТА PURITY Fashion Studio

purity-fashion-studio.ua**




1. Общая инфор...

