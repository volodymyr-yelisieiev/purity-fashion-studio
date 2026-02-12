/**
 * Media seeder — generates branded placeholders and uploads to Payload.
 *
 * Reads the image registry, generates each placeholder via sharp,
 * uploads with the `purpose` field for programmatic queries,
 * and localizes alt text across all locales.
 */
import type { Payload, MediaMap } from "../types";
import { LOCALES } from "../types";
import type { Locale } from "../types";
import { IMAGE_REGISTRY } from "../registry/images";
import { generatePlaceholder } from "../placeholders/generator";
import path from "node:path";
import fs from "node:fs";

/**
 * Seed all media defined in the image registry.
 *
 * @returns MediaMap — a mapping from image id → Payload media document id.
 */
export async function seedMedia(payload: Payload): Promise<MediaMap> {
  const hasBlobToken = !!process.env.BLOB_READ_WRITE_TOKEN;
  console.log(
    `Seeding placeholder media assets… (${hasBlobToken ? "Vercel Blob enabled" : "Local fallback mode"})`,
  );
  const mediaMap: MediaMap = {};

  for (const entry of IMAGE_REGISTRY) {
    try {
      const label = entry.id.replace(/_/g, " ").toUpperCase();

      const buffer = await generatePlaceholder({
        width: entry.width,
        height: entry.height,
        palette: entry.palette,
        label,
      });

      const media = await payload.create({
        collection: "media",
        locale: "en",
        data: {
          alt: entry.alt.en,
          purpose: entry.purpose,
        } as Record<string, unknown>,
        file: {
          data: buffer,
          name: `${entry.id}.jpg`,
          mimetype: "image/jpeg",
          size: buffer.length,
        },
      } as any);

      // Localize alt text for non-English locales
      for (const locale of LOCALES) {
        if (locale === "en") continue;
        await payload.update({
          collection: "media",
          id: media.id,
          locale,
          data: { alt: entry.alt[locale as Locale] } as Record<string, unknown>,
        } as any);
      }

      mediaMap[entry.id] = media.id as number;
      const storageInfo = (media as any).url?.includes(
        "blob.vercel-storage.com",
      )
        ? "Vercel Blob"
        : "Local Storage";

      // Verify file exists on disk (local storage only)
      if (storageInfo === "Local Storage") {
        const expectedPath = path.join(
          process.cwd(),
          "media",
          `${entry.id}.jpg`,
        );
        if (!fs.existsSync(expectedPath)) {
          console.warn(
            `  ⚠ File missing on disk after upload: ${expectedPath}, re-writing...`,
          );
          fs.mkdirSync(path.dirname(expectedPath), { recursive: true });
          fs.writeFileSync(expectedPath, buffer);
        }
      }

      console.log(`  ✓ ${entry.id} (${entry.purpose}) -> ${storageInfo}`);
    } catch (e) {
      console.warn(
        `  ✗ Failed to seed image ${entry.id}:`,
        e instanceof Error ? e.message : e,
      );
    }
  }

  console.log(
    `Media seeding complete: ${Object.keys(mediaMap).length}/${IMAGE_REGISTRY.length} images.`,
  );
  return mediaMap;
}
