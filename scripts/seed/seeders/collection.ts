/**
 * Generic collection seeder — DRY replacement for per-collection seed functions.
 *
 * Takes a collection slug + array of SeedEntry and handles:
 * 1. Create document in en locale
 * 2. Localize to uk, ru via localizeDoc
 */
import type { Payload, SeedEntry } from "../types";
import { seedCreate } from "../types";
import { localizeDoc } from "../locale-helpers";

/**
 * Seed an entire collection from a registry array.
 *
 * @param payload  - Payload instance
 * @param collection - Payload collection slug
 * @param entries  - Array of SeedEntry from a registry
 * @param label    - Human-readable name for logging
 */
export async function seedCollection(
  payload: Payload,
  collection: string,
  entries: SeedEntry[],
  label: string,
): Promise<void> {
  console.log(`Creating ${label}…`);

  for (const entry of entries) {
    try {
      const doc = await seedCreate<{ id: number }>(payload, {
        collection,
        locale: "en",
        data: entry.data,
      });
      await localizeDoc(payload, collection, doc.id, entry.locales);
      const title = (entry.data.title ??
        entry.data.name ??
        entry.data.slug ??
        doc.id) as string;
      console.log(`  ✓ ${title}`);
    } catch (e) {
      const title = (entry.data.title ??
        entry.data.name ??
        "unknown") as string;
      console.warn(
        `  ✗ Failed to seed ${title}:`,
        e instanceof Error ? e.message : e,
      );
    }
  }
}

/**
 * Seed a Payload global from a GlobalSeedEntry.
 */
export async function seedGlobal(
  payload: Payload,
  slug: string,
  entry: {
    en: Record<string, unknown>;
    uk: Record<string, unknown>;
    ru: Record<string, unknown>;
  },
): Promise<void> {
  console.log(`Updating ${slug}…`);

  await payload.updateGlobal({ slug, locale: "en", data: entry.en } as any);
  await payload.updateGlobal({ slug, locale: "uk", data: entry.uk } as any);
  await payload.updateGlobal({ slug, locale: "ru", data: entry.ru } as any);
}
