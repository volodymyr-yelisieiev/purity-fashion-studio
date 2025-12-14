# PURITY Fashion Studio

Premium minimalist styling services and atelier website built with Next.js 15, Payload CMS, and TypeScript.

![Next.js](https://img.shields.io/badge/Next.js-15.4-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)
![Payload CMS](https://img.shields.io/badge/Payload-3.68-purple)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-cyan)

## ✨ Features

- **Multi-language Support** - Full i18n with English, Ukrainian, and Russian locales
- **Payload CMS Integration** - Headless CMS with admin panel at `/admin`
- **Modern Design System** - Consistent typography, spacing, and components
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **E-commerce Ready** - Product catalog, cart, and checkout
- **Booking System** - Service booking with form validation
- **Portfolio Showcase** - Before/after transformation gallery
- **SEO Optimized** - Meta tags, Open Graph, sitemap generation

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- pnpm 9+
- Docker (for PostgreSQL)

### Development Setup

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd purity-fashion-studio
   pnpm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your settings (see [Environment Variables](#environment-variables))

3. **Start PostgreSQL with Docker**
   ```bash
   docker-compose up -d
   ```

4. **Start development server**
   ```bash
   pnpm dev
   ```

5. **Access the application**
   - Website: http://localhost:3000
   - Admin Panel: http://localhost:3000/admin

### First-time Admin Setup

1. Navigate to http://localhost:3000/admin
2. Create your first admin user
3. Start adding content through the CMS

## 📁 Project Structure

```
├── app/
│   ├── (payload)/          # Payload CMS admin routes
│   │   ├── admin/          # Admin panel
│   │   └── api/            # CMS API routes
│   ├── (website)/          # Public website routes
│   │   └── [locale]/       # Localized pages
│   └── api/                # Custom API endpoints
├── components/
│   ├── booking/            # Booking form components
│   ├── cart/               # Shopping cart components
│   ├── checkout/           # Checkout components
│   ├── layout/             # Header, Footer, Navigation
│   ├── sections/           # Page sections (Hero, etc.)
│   └── ui/                 # Design system components
├── lib/                    # Utilities and helpers
├── messages/               # i18n translation files
├── payload/
│   ├── collections/        # CMS content types
│   └── globals/            # Site-wide settings
├── styles/                 # Global styles and tokens
└── public/                 # Static assets
```

## 🎨 Design System

The project uses a consistent design system with:

- **Typography** - Components in `components/ui/typography.tsx`
  - `H1`, `H2`, `H3`, `H4` - Heading components
  - `Paragraph`, `Lead`, `Small`, `Muted` - Text components
  
- **Layout** - Components in `components/ui/layout-components.tsx`
  - `Container` - Consistent max-width containment
  - `Section` - Consistent vertical spacing
  - `Grid` - Responsive grid layouts

- **CSS Tokens** - Utility classes in `styles/tokens.css`
  - `.section-sm`, `.section-md`, `.section-lg` - Section spacing
  - `.container-*` - Container sizing
  - `.heading-*` - Typography presets

## 🌍 Internationalization

Supported locales:
- `en` - English
- `uk` - Ukrainian
- `ru` - Russian

Translation files are in `messages/` directory. CMS content is automatically localized.

## 📦 CMS Collections

| Collection | Description |
|------------|-------------|
| **Services** | Styling services offered |
| **Portfolio** | Before/after transformations |
| **Collections** | Fashion lookbooks |
| **Products** | Shop items |
| **Courses** | Educational programs |
| **Media** | Images and files |
| **Users** | Admin users |
| **Orders** | Customer orders |

## 🔧 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `PAYLOAD_SECRET` | Yes | CMS authentication secret (32+ chars) |
| `NEXT_PUBLIC_SITE_URL` | Yes | Public site URL |
| `STRIPE_SECRET_KEY` | No | Stripe API key |
| `LIQPAY_PUBLIC_KEY` | No | LiqPay API key (Ukraine) |

See `.env.example` for full list with documentation.

## 🛠️ Available Scripts

```bash
# Development
pnpm dev           # Start dev server
pnpm build         # Build for production
pnpm start         # Start production server

# Code Quality
pnpm lint          # Run ESLint
pnpm typecheck     # Run TypeScript compiler

# CMS
pnpm payload generate:types  # Regenerate TypeScript types
pnpm payload migrate         # Run database migrations
```

## 🐳 Docker

PostgreSQL is managed via Docker Compose:

```bash
docker-compose up -d      # Start database
docker-compose down       # Stop database
docker-compose logs -f    # View logs
```

## 🚢 Deployment

### Production Build

```bash
pnpm build
pnpm start
```

### Environment Requirements

- Node.js 20+
- PostgreSQL 15+
- 512MB+ RAM

### Recommended Hosting

- **Vercel** - Optimized for Next.js
- **Railway** - Full-stack with PostgreSQL
- **Docker** - Self-hosted option

## 🔒 Security

- All forms have CSRF protection
- Passwords hashed with argon2
- SQL injection prevention via Payload ORM
- XSS protection via React
- Environment variables for secrets

## 📄 License

Private - All rights reserved.

## 🤝 Contributing

Contact the development team for contribution guidelines.

---

Built with ❤️ by PURITY Fashion Studio
