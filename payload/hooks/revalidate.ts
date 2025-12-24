import type { CollectionAfterChangeHook } from "payload";

export const revalidateContent =
  (collectionSlug: string): CollectionAfterChangeHook =>
  async ({ doc, req, operation }) => {
    // Only revalidate on create or update
    if (operation !== "create" && operation !== "update") {
      return doc;
    }

    try {
      const siteUrl =
        process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
      const secret = process.env.PAYLOAD_SECRET;

      // Construct paths to revalidate
      // 1. The specific item page
      const locales = ["uk", "ru", "en"];
      const paths: string[] = [];

      locales.forEach((locale) => {
        // 1. The specific item page
        paths.push(`/${locale}/${collectionSlug}/${doc.slug}`);
        // 2. The collection index page
        paths.push(`/${locale}/${collectionSlug}`);
        // 3. The home page
        paths.push(`/${locale}`);
      });

      try {
        await fetch(`${siteUrl}/api/revalidate?secret=${secret}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paths,
          }),
        });
        req.payload.logger.info(
          `Revalidated ${paths.length} paths for ${collectionSlug}`
        );
      } catch (err) {
        req.payload.logger.error(`Error revalidating paths: ${err}`);
      }
    } catch (err) {
      req.payload.logger.error(`Error in revalidate hook: ${err}`);
    }

    return doc;
  };
