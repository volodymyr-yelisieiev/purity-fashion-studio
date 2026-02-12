/**
 * Shared types for the seed system.
 * All modules import from here — never from the monolith.
 */
import type { getPayload } from "payload";
import type {
  Service,
  Product,
  Portfolio,
  Lookbook,
  Course,
  Media,
} from "../../payload-types";
import type { PlaceholderPalette } from "./placeholders/generator";

/* ── Locale ───────────────────────────────────────────── */
export const LOCALES = ["en", "uk", "ru"] as const;
export type Locale = (typeof LOCALES)[number];

/* ── Payload instance shorthand ───────────────────────── */
export type Payload = Awaited<ReturnType<typeof getPayload>>;

/* ── Media map (image-id → Payload media id) ─────────── */
export type MediaMap = Record<string, number>;

/* ── Block union (re-export from generated types) ─────── */
export type LayoutBlock = NonNullable<Service["layout"]>[number];

/* ── Localized data for the localizeDoc helper ────────── */
export type LocalizedData = Record<Locale, Record<string, unknown>>;

/* ── Image registry entry ────────────────────────────── */
export interface ImageRegistryEntry {
  /** Unique identifier (used as MediaMap key) */
  id: string;
  /** Machine-readable purpose (e.g. "hero-about", "homepage-background") */
  purpose: string;
  /** Semantic category for grouping */
  category: "hero" | "content" | "product" | "texture" | "lifestyle";
  /** Target width in pixels */
  width: number;
  /** Target height in pixels */
  height: number;
  /** Brand-themed palette for placeholder generation */
  palette: PlaceholderPalette;
  /** Tri-lingual alt text */
  alt: Record<Locale, string>;
}

/* ── Generic seed entry (content data + locales) ──────── */
export interface SeedEntry {
  /** English data passed to payload.create */
  data: Record<string, unknown>;
  /** Per-locale overrides (uk, ru). en can be empty. */
  locales: LocalizedData;
}

/* ── Global seed entry ────────────────────────────────── */
export interface GlobalSeedEntry {
  /** English data */
  en: Record<string, unknown>;
  /** Ukrainian locale overrides */
  uk: Record<string, unknown>;
  /** Russian locale overrides */
  ru: Record<string, unknown>;
}

/* ── Re-exports for convenience ──────────────────────── */
export type { Service, Product, Portfolio, Lookbook, Course, Media };
export type { PlaceholderPalette };

/* ── Seed-safe create helper ─────────────────────────── */
/**
 * Create a document during seeding. Wraps `payload.create` with a relaxed
 * `data` type — seed scripts construct partial objects that don't satisfy
 * the strict `DataFromCollectionSlug` discriminated union (auto-generated
 * fields like `id`/`createdAt`/`slug` are missing). This is intentional;
 * Payload fills those fields at persist time.
 */
export async function seedCreate<T extends { id: number | string }>(
  payload: Payload,
  options: {
    collection: string;
    locale?: string;
    data: Record<string, unknown>;
  },
): Promise<T> {
  return payload.create(options as any) as unknown as Promise<T>;
}
