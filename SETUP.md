# Development Setup Guide

## Prerequisites
- Node.js 18+
- npm or pnpm
- PostgreSQL Database (Neon, Supabase, or local)

## Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd purity-fashion-studio
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    pnpm install
    ```

3.  **Environment Setup:**
    Create a `.env.local` file in the root directory:
    ```env
    PAYLOAD_SECRET=your-secret-key
    DATABASE_URL=postgresql://user:password@host:port/database
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    # or
    pnpm dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
    Access the Admin Panel at [http://localhost:3000/admin](http://localhost:3000/admin).

## API Usage

We expose several API endpoints for fetching content:

- **Services:**
  ```bash
  curl "http://localhost:3000/api/services?locale=en"
  curl "http://localhost:3000/api/services/personal-styling?locale=uk"
  ```

- **Portfolio:**
  ```bash
  curl "http://localhost:3000/api/portfolio?page=1&locale=ru"
  ```

- **Collections:**
  ```bash
  curl "http://localhost:3000/api/collections"
  ```

## Design System

We use a custom design system built on top of Tailwind CSS.

### Tokens
Design tokens are defined in `styles/design-tokens.ts` and mapped to Tailwind configuration.
- **Colors:** `primary` (Teal-500), `neutral` (Grays), `accent` (Red/Orange)
- **Typography:** `font-sans` (Geist Sans), `font-mono` (Geist Mono)
- **Spacing:** Standard Tailwind spacing (4px base), but design uses 8px grid.

### Usage
Use Tailwind utility classes that reference our tokens:
```tsx
<div className="bg-neutral-50 p-8 rounded-lg shadow-sm">
  <h1 className="text-2xl font-bold text-primary">Hello World</h1>
</div>
```

### Shadcn/UI
We use Shadcn/UI for base components.
To add a new component:
```bash
npx shadcn-ui@latest add [component-name]
```
Components are located in `components/ui`.

## File Structure

- `/app`: Next.js App Router pages and layouts.
- `/components`: Reusable UI components.
  - `/layout`: Layout components (Header, Footer).
  - `/ui`: Shadcn/UI base components.
- `/lib`: Utilities, helpers, and types.
- `/styles`: Global styles and design tokens.
- `/config`: Configuration files.
- `/public`: Static assets.
- `/payload`: Payload CMS configuration and collections.
