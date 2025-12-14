# PURITY Fashion Studio - Administration Guide

This guide covers how to set up, configure, and manage the PURITY Fashion Studio platform.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Environment Setup](#environment-setup)
3. [Content Management](#content-management)
4. [Payment Configuration](#payment-configuration)
5. [Email Configuration](#email-configuration)
6. [Deployment](#deployment)
7. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Prerequisites

- Node.js 20+ (LTS recommended)
- pnpm 8+
- PostgreSQL 16+ (or Docker)
- Git

### Local Development Setup

```bash
# 1. Clone the repository
git clone <repository-url>
cd purity-fashion-studio

# 2. Install dependencies
pnpm install

# 3. Copy environment file
cp .env.example .env.local

# 4. Start PostgreSQL (using Docker)
docker-compose up -d

# 5. Run database migrations
pnpm payload migrate

# 6. Start development server
pnpm dev
```

Access the application:
- **Site**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin

---

## Environment Setup

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/purity` |
| `PAYLOAD_SECRET` | Secret for Payload CMS (min 32 chars) | Generate with `openssl rand -base64 32` |

### Optional Environment Variables

| Variable | Description | Required For |
|----------|-------------|--------------|
| `STRIPE_SECRET_KEY` | Stripe secret key | EUR payments |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe public key | EUR checkout |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook verification | Payment confirmation |
| `LIQPAY_PUBLIC_KEY` | LiqPay public key | UAH payments |
| `LIQPAY_PRIVATE_KEY` | LiqPay private key | UAH payments |
| `RESEND_API_KEY` | Resend.com API key | Transactional emails |
| `EMAIL_FROM` | Sender email address | Email sending |
| `NEXT_PUBLIC_SITE_URL` | Public site URL | Callbacks, emails, SEO |

---

## Content Management

### Accessing the Admin Panel

1. Navigate to `/admin`
2. Log in with your admin credentials
3. First-time setup: Create an admin user when prompted

### Collections Overview

| Collection | Purpose | Fields |
|------------|---------|--------|
| **Services** | Styling and atelier services | Title, slug, description, category, pricing (UAH/EUR), duration, images |
| **Products** | E-commerce products | Name, slug, description, price, sizes, colors, images, stock |
| **Portfolio** | Before/after transformations | Title, slug, client info, before/after images, gallery |
| **Collections** | Seasonal fashion collections | Name, description, season, release date, linked products |
| **Courses** | Style school courses | Title, category, level, curriculum, pricing, instructor info |
| **Orders** | Customer orders (auto-generated) | Order number, items, totals, status, payment info |
| **Media** | All uploaded files | Images, documents, metadata |
| **Users** | Admin users | Email, password, roles |

### Managing Services

1. Go to **Collections → Services**
2. Click **Create New**
3. Fill in required fields:
   - **Title**: Service name (localized for UK/RU/EN)
   - **Slug**: URL-friendly identifier (auto-generated)
   - **Category**: `styling`, `consultation`, `atelier`, or `workshop`
   - **Description**: Full service description
   - **Price UAH/EUR**: Set both currency prices
   - **Duration**: Service duration in minutes
4. Save and publish

### Managing Products

1. Go to **Collections → Products**
2. Fill in product details:
   - **Name**: Product name
   - **Description**: Product details
   - **Price**: Base price
   - **Available Sizes**: Array of sizes (XS, S, M, L, XL)
   - **Available Colors**: Array with name and hex code
   - **Images**: Product images (first is featured)
   - **Stock**: Inventory count
3. Save

### Managing Portfolio

1. Go to **Collections → Portfolio**
2. Add transformation cases:
   - **Before Image**: Client's original look
   - **After Image**: Transformed look (also used as cover)
   - **Gallery**: Additional process photos
   - **Client Info**: Name, age, profession
   - **Testimonial**: Client feedback

### Managing Courses

1. Go to **Collections → Courses**
2. Create course with:
   - **Category**: `personal-style`, `wardrobe`, `shopping`, `color-analysis`, `professional`
   - **Level**: `beginner`, `intermediate`, `advanced`
   - **Curriculum**: Array of modules with title, description, duration
   - **Instructor**: Name, photo, bio
   - **Pricing**: Regular price + optional early bird discount

### Localization

All content supports three locales:
- **UK** (Ukrainian) - Default
- **RU** (Russian)
- **EN** (English)

When editing content:
1. Select the locale from the dropdown in the admin UI
2. Fill in content for that locale
3. Repeat for each language

---

## Payment Configuration

### Stripe (EUR Payments)

1. Create account at [stripe.com](https://stripe.com)
2. Get API keys from Dashboard → Developers → API Keys
3. Add to `.env.local`:
   ```
   STRIPE_SECRET_KEY=sk_live_xxx
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
   ```

4. Set up webhook:
   - Go to Dashboard → Developers → Webhooks
   - Add endpoint: `https://your-domain.com/api/webhooks/stripe`
   - Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
   - Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

5. **Local Testing**:
   ```bash
   # Install Stripe CLI
   brew install stripe/stripe-cli/stripe

   # Forward webhooks to local server
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

### LiqPay (UAH Payments)

1. Create merchant account at [liqpay.ua](https://www.liqpay.ua)
2. Get keys from Settings → API
3. Add to `.env.local`:
   ```
   LIQPAY_PUBLIC_KEY=your_public_key
   LIQPAY_PRIVATE_KEY=your_private_key
   ```

4. Configure callback URL in LiqPay settings:
   - Result URL: `https://your-domain.com/api/webhooks/liqpay`

---

## Email Configuration

### Setting up Resend

1. Create account at [resend.com](https://resend.com)
2. Verify your sending domain
3. Create API key
4. Add to `.env.local`:
   ```
   RESEND_API_KEY=re_xxx
   EMAIL_FROM="PURITY <noreply@yourdomain.com>"
   ```

### Email Templates

The system sends:
- **Order Confirmation**: When payment succeeds
- **Booking Confirmation**: When appointment is booked
- **Contact Form Notification**: When contact form is submitted

---

## Deployment

### Vercel (Recommended)

1. Connect repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Set up PostgreSQL:
   - Use Vercel Postgres, Neon, or Supabase
   - Update `DATABASE_URL` accordingly

4. Deploy:
   ```bash
   vercel --prod
   ```

### Build Commands

```bash
# Production build
pnpm build

# Type checking
pnpm typecheck

# Linting
pnpm lint

# Database migrations
pnpm payload migrate
```

### Database Migrations

When deploying schema changes:

```bash
# Create migration
pnpm payload migrate:create

# Run migrations
pnpm payload migrate

# Check migration status
pnpm payload migrate:status
```

---

## Troubleshooting

### Common Issues

#### Database Connection Failed

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution**: Ensure PostgreSQL is running
```bash
docker-compose up -d
docker-compose ps  # Verify status
```

#### Payment Webhook Not Working

1. Check webhook endpoint is accessible
2. Verify webhook secret is correct
3. Check Stripe/LiqPay dashboard for failed deliveries

#### Missing Translations

1. Check `messages/{locale}.json` files
2. Ensure all keys exist in all locale files
3. Restart dev server after changes

#### Build Errors

```bash
# Clear cache and rebuild
rm -rf .next node_modules/.cache
pnpm build
```

### Logs and Debugging

```bash
# View Payload logs
pnpm dev  # Check terminal output

# Check database
docker-compose logs postgres

# Verify environment
node -e "console.log(process.env.DATABASE_URL)"
```

### Support

For issues:
1. Check this guide first
2. Review error logs
3. Contact development team

---

## Security Checklist

Before going live:

- [ ] Change all default passwords
- [ ] Generate new `PAYLOAD_SECRET`
- [ ] Enable HTTPS only
- [ ] Review CSP headers in `next.config.ts`
- [ ] Set up backup strategy for database
- [ ] Configure rate limiting (if needed)
- [ ] Test all payment flows
- [ ] Verify email delivery
- [ ] Check all locales work correctly
- [ ] Test mobile responsiveness
