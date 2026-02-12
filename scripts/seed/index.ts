/**
 * Seed orchestrator — registry-driven, DRY pipeline.
 *
 * All content lives in `registry/` files (pure data).
 * All creation logic lives in `seeders/` files (generic).
 */
import "./load-env";
import { getPayload } from "payload";
import config from "../../payload.config";

import type { Payload, MediaMap } from "./types";

// Seeders
import { seedMedia } from "./seeders/media";
import { seedCollection, seedGlobal } from "./seeders/collection";

// Registries
import { getPostEntries } from "./registry/posts";
import { getServiceEntries } from "./registry/services";
import { getPortfolioEntries } from "./registry/portfolio";
import { getProductEntries } from "./registry/products";
import { getCourseEntries } from "./registry/courses";
import { getLookbookEntries } from "./registry/lookbooks";
import { getSettingsEntry } from "./registry/settings";

/* ── Collections to wipe before seeding ───────────────── */
const COLLECTIONS_TO_CLEAN = [
  "orders",
  "posts",
  "portfolio",
  "products",
  "lookbooks",
  "courses",
  "services",
  "media",
] as const;

/* ── Admin setup ──────────────────────────────────────── */
async function ensureAdmin(payload: Payload): Promise<void> {
  const adminEmail = "admin@purity.studio";
  const existing = await payload.find({
    collection: "users",
    where: { email: { equals: adminEmail } },
  });
  if (existing.totalDocs === 0) {
    console.log("Creating admin user…");
    await payload.create({
      collection: "users",
      data: {
        email: adminEmail,
        password: "password123",
        firstName: "Vika",
        lastName: "Veda",
        role: "admin",
      },
    });
  }
}

/* ── Cleanup ──────────────────────────────────────────── */
async function cleanCollections(payload: Payload): Promise<void> {
  console.log("Cleaning up existing data…");
  for (const collection of COLLECTIONS_TO_CLEAN) {
    try {
      const result = await payload.delete({
        collection,
        where: {
          id: { exists: true },
        },
      });
      console.log(
        `  ✓ ${collection}: ${result.errors.length > 0 ? "partial " : ""}deleted (${result.docs.length})`,
      );
    } catch (err) {
      console.warn(
        `  Warning: Failed to bulk delete ${collection}. Continuing…`,
        err,
      );
    }
  }
}

/* ── Step runner with error boundary ──────────────────── */
async function runStep(name: string, fn: () => Promise<void>): Promise<void> {
  try {
    await fn();
    console.log(`✓ ${name}`);
  } catch (err) {
    console.error(
      `✗ ${name} failed:`,
      err instanceof Error ? err.message : err,
    );
    throw err;
  }
}

/* ── Public orchestrator ──────────────────────────────── */
export async function runSeed(): Promise<void> {
  console.log("━━━ PURITY Seed: starting… ━━━");
  const payload = await getPayload({ config });

  await cleanCollections(payload);
  await ensureAdmin(payload);

  // 1. Media first — every registry references the media map
  const m: MediaMap = await seedMedia(payload);

  // 2. Content collections — all driven by registries through the generic seeder
  await runStep("Posts", () =>
    seedCollection(payload, "posts", getPostEntries(m), "Blog Posts"),
  );
  await runStep("Services", () =>
    seedCollection(
      payload,
      "services",
      getServiceEntries(m),
      "Premium Services",
    ),
  );
  await runStep("Portfolio", () =>
    seedCollection(
      payload,
      "portfolio",
      getPortfolioEntries(m),
      "Portfolio Showcase",
    ),
  );
  await runStep("Products", () =>
    seedCollection(
      payload,
      "products",
      getProductEntries(m),
      "Premium Products",
    ),
  );
  await runStep("Courses", () =>
    seedCollection(
      payload,
      "courses",
      getCourseEntries(m),
      "Educational Courses",
    ),
  );
  await runStep("Lookbooks", () =>
    seedCollection(
      payload,
      "lookbooks",
      getLookbookEntries(m),
      "Collections (Lookbooks)",
    ),
  );

  // 3. Globals
  await runStep("Settings", () =>
    seedGlobal(payload, "site-settings", getSettingsEntry()),
  );

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("SEEDING COMPLETE: Premium Editorial Site Ready");
  console.log(`  Media:       ${Object.keys(m).length} images`);
  console.log(
    "  Posts:       5 (editorial, behind-the-scenes ×2, style-guide, methodology)",
  );
  console.log("  Services:    9 (research, imagine, create stages)");
  console.log("  Portfolio:   2 (Metamorphosis, Kyiv Capsule)");
  console.log("  Products:    3 (Silk Slip, Wool Blazer, Cashmere Wrap)");
  console.log(
    "  Courses:     3 (Victory Dress, Patterning, Architecture of Style)",
  );
  console.log(
    "  Collections: 4 (Victory Dress, Travel Capsule, Silky Touches, Retreat Wear)",
  );
  console.log("  Locales:     en, uk, ru");
  console.log("  Admin:       admin@purity.studio / password123");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}
