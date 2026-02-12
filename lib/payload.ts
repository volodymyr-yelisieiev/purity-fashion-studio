import { getPayload as getPayloadInstance } from "payload";
import configPromise from "@payload-config";
import type { Where, Payload, PaginatedDocs } from "payload";
import { logger } from "@/lib/logger";
import { unstable_cache } from "next/cache";
import type {
  Service,
  Portfolio,
  Lookbook,
  Course,
  Post,
  SiteSetting,
  Media,
} from "@/payload-types";

export type Locale = "uk" | "ru" | "en";

type LocalizedCollection =
  | "services"
  | "portfolio"
  | "lookbooks"
  | "courses"
  | "posts";

const supportedLocales: Locale[] = ["en", "uk", "ru"];

/* ── Empty paginated result helper ────────────────────── */

/**
 * Return an empty PaginatedDocs object with the correct shape.
 * Replaces the 12-line inline literal used in every catch block.
 */
export function emptyPaginatedDocs<T>(limit = 10): PaginatedDocs<T> {
  return {
    docs: [],
    totalDocs: 0,
    limit,
    totalPages: 1,
    page: 1,
    pagingCounter: 1,
    hasPrevPage: false,
    hasNextPage: false,
    prevPage: null,
    nextPage: null,
  };
}

export async function getPayload(): Promise<Payload> {
  return getPayloadInstance({ config: configPromise });
}

export async function getServices(
  locale: Locale = "uk",
  category?: string,
): Promise<PaginatedDocs<Service>> {
  return unstable_cache(
    async () => {
      const payload = await getPayload();

      const where: Where | undefined = category
        ? { category: { equals: category } }
        : undefined;

      const start = Date.now();
      try {
        const result = await payload.find({
          collection: "services",
          locale,
          fallbackLocale: false,
          where,
          sort: "-featured,-createdAt",
          depth: 2,
          select: {
            title: true,
            slug: true,
            category: true,
            featured: true,
            blocks: true,
          },
        });
        const duration = Date.now() - start;
        if (duration > 1000) {
          logger.warn(`getServices took ${duration}ms for locale ${locale}`);
        }
        return result;
      } catch (err) {
        logger.error("getServices: payload.find failed:", err);
        return emptyPaginatedDocs<Service>();
      }
    },
    [`services-${locale}-${category || "all"}`],
    {
      tags: ["services"],
      revalidate: 3600,
    },
  )();
}

export async function getFeaturedServices(
  locale: Locale = "uk",
): Promise<PaginatedDocs<Service>> {
  const payload = await getPayload();

  try {
    return await payload.find({
      collection: "services",
      locale,
      fallbackLocale: false,
      where: {
        featured: { equals: true },
        status: { equals: "published" },
      },
      limit: 3,
      depth: 1,
    });
  } catch (err) {
    logger.error("getFeaturedServices: payload.find failed:", err);
    return emptyPaginatedDocs<Service>(3);
  }
}

export async function getServiceBySlug(
  slug: string,
  locale: Locale = "uk",
  draft = false,
): Promise<Service | null> {
  const payload = await getPayload();

  try {
    const result = await payload.find({
      collection: "services",
      where: { slug: { equals: slug } },
      locale,
      fallbackLocale: false,
      depth: 2,
      draft,
    });

    return result.docs[0] || null;
  } catch (err) {
    logger.error("getServiceBySlug: payload.find failed:", err);
    return null;
  }
}

export async function getPortfolioBySlug(
  slug: string,
  locale: Locale = "uk",
  draft = false,
): Promise<Portfolio | null> {
  const payload = await getPayload();

  try {
    const result = await payload.find({
      collection: "portfolio",
      where: { slug: { equals: slug } },
      locale,
      depth: 2,
      fallbackLocale: false,
      draft,
    });

    return result.docs[0] || null;
  } catch (err) {
    logger.error("getPortfolioBySlug: payload.find failed:", err);
    return null;
  }
}

export async function getCollectionBySlug(
  slug: string,
  locale: Locale = "uk",
  draft = false,
): Promise<Lookbook | null> {
  const payload = await getPayload();

  try {
    const result = await payload.find({
      collection: "lookbooks",
      where: { slug: { equals: slug } },
      depth: 2,
      locale,
      fallbackLocale: false,
      draft,
    });

    return result.docs[0] || null;
  } catch (err) {
    logger.error("getCollectionBySlug: payload.find failed:", err);
    return null;
  }
}

export async function getCourseBySlug(
  slug: string,
  locale: Locale = "uk",
  draft = false,
): Promise<Course | null> {
  const payload = await getPayload();

  try {
    const result = await payload.find({
      collection: "courses",
      depth: 1,
      where: { slug: { equals: slug } },
      locale,
      fallbackLocale: false,
      draft,
    });

    return result.docs[0] || null;
  } catch (err) {
    logger.error("getCourseBySlug: payload.find failed:", err);
    return null;
  }
}

export async function getAvailableLocales(
  collection: LocalizedCollection,
  slug: string,
  draft = false,
): Promise<Locale[]> {
  const payload = await getPayload();

  try {
    const results = await Promise.all(
      supportedLocales.map((locale) =>
        payload.find({
          collection,
          where: { slug: { equals: slug } },
          locale,
          fallbackLocale: false,
          draft,
          limit: 1,
          select: {
            slug: true,
          },
        }),
      ),
    );

    return supportedLocales.filter(
      (_, index) => results[index].docs.length > 0,
    );
  } catch (err) {
    logger.error("getAvailableLocales: payload.find failed:", err);
    return [];
  }
}

export async function getPortfolio(
  locale: Locale = "uk",
  page = 1,
  limit = 6,
): Promise<PaginatedDocs<Portfolio>> {
  return unstable_cache(
    async () => {
      const payload = await getPayload();

      try {
        return await payload.find({
          collection: "portfolio",
          depth: 2,
          locale,
          fallbackLocale: false,
          page,
          limit,
          sort: "-featured,-createdAt",
        });
      } catch (err) {
        logger.error("getPortfolio: payload.find failed:", err);
        return emptyPaginatedDocs<Portfolio>(limit);
      }
    },
    [`portfolio-${locale}-${page}-${limit}`],
    {
      tags: ["portfolio"],
      revalidate: 3600,
    },
  )();
}

export async function getFeaturedPortfolio(
  locale: Locale = "uk",
): Promise<PaginatedDocs<Portfolio>> {
  return unstable_cache(
    async () => {
      const payload = await getPayload();

      try {
        return await payload.find({
          collection: "portfolio",
          depth: 1,
          locale,
          fallbackLocale: false,
          where: {
            featured: { equals: true },
          },
          limit: 3,
        });
      } catch (err) {
        logger.error("getFeaturedPortfolio: payload.find failed:", err);
        return emptyPaginatedDocs<Portfolio>(3);
      }
    },
    [`featured-portfolio-${locale}`],
    {
      tags: ["portfolio"],
      revalidate: 3600,
    },
  )();
}

export async function getCollections(
  locale: Locale = "uk",
  limit = 4,
): Promise<PaginatedDocs<Lookbook>> {
  return unstable_cache(
    async () => {
      const payload = await getPayload();

      try {
        return await payload.find({
          collection: "lookbooks",
          depth: 1,
          locale,
          fallbackLocale: false,
          limit,
          sort: "-featured,-createdAt",
        });
      } catch (err) {
        logger.error("getCollections: payload.find failed:", err);
        return emptyPaginatedDocs<Lookbook>(limit);
      }
    },
    [`collections-${locale}-${limit}`],
    {
      tags: ["collections"],
      revalidate: 3600,
    },
  )();
}
/* ── Posts / Blog ──────────────────────────────────────── */

export async function getPosts(
  locale: Locale = "uk",
  limit = 50,
): Promise<PaginatedDocs<Post>> {
  return unstable_cache(
    async () => {
      const payload = await getPayload();

      try {
        return await payload.find({
          collection: "posts",
          locale,
          fallbackLocale: false,
          limit,
          depth: 2,
          sort: "-publishedAt",
          where: {
            status: { equals: "published" },
          },
        });
      } catch (err) {
        logger.error("getPosts: payload.find failed:", err);
        return emptyPaginatedDocs<Post>(limit);
      }
    },
    [`posts-${locale}-${limit}`],
    {
      tags: ["blog"],
      revalidate: 3600,
    },
  )();
}

export async function getPostBySlug(
  slug: string,
  locale: Locale = "uk",
  draft = false,
): Promise<Post | null> {
  const payload = await getPayload();

  try {
    const result = await payload.find({
      collection: "posts",
      where: { slug: { equals: slug } },
      locale,
      fallbackLocale: false,
      depth: 2,
      draft,
    });

    return result.docs[0] || null;
  } catch (err) {
    logger.error("getPostBySlug: payload.find failed:", err);
    return null;
  }
}

export async function getSiteSettings(
  locale: Locale = "uk",
): Promise<SiteSetting | null> {
  const payload = await getPayload();

  try {
    return await payload.findGlobal({
      slug: "site-settings",
      locale,
      fallbackLocale: false,
    });
  } catch (err) {
    logger.error("getSiteSettings: payload.findGlobal failed:", err);
    return null;
  }
}

/* ── Purpose-based media helpers ──────────────────────── */

/** Resolved media entry with URL and alt text */
interface ResolvedMedia {
  url: string;
  alt: string;
}

const PLACEHOLDER_MEDIA: ResolvedMedia = {
  url: "",
  alt: "PURITY Fashion Studio",
};

/**
 * Fetch a single media document by its seeded `purpose` field.
 * Falls back to a placeholder if not found.
 */
export async function getMediaByPurpose(
  purpose: string,
  locale: Locale = "en",
): Promise<ResolvedMedia> {
  const payload = await getPayload();

  try {
    const result = await payload.find({
      collection: "media",
      locale,
      where: { purpose: { equals: purpose } },
      limit: 1,
      depth: 0,
    });

    const media = result.docs[0];
    if (media?.url) {
      return { url: media.url, alt: media.alt || purpose };
    }
    return PLACEHOLDER_MEDIA;
  } catch {
    return PLACEHOLDER_MEDIA;
  }
}

export interface HomepageMedia {
  background: ResolvedMedia;
  foreground: ResolvedMedia;
  research: ResolvedMedia;
  imagine: ResolvedMedia;
  create: ResolvedMedia;
}

/** Map from HomepageMedia key → seeded purpose field value */
const HOMEPAGE_PURPOSE_MAP: Record<keyof HomepageMedia, string> = {
  background: "homepage-background",
  foreground: "homepage-foreground",
  research: "homepage-research",
  imagine: "homepage-imagine",
  create: "homepage-create",
};

export async function getHomepageMedia(): Promise<HomepageMedia> {
  return unstable_cache(
    async () => {
      const payload = await getPayload();
      const fallback: HomepageMedia = {
        background: PLACEHOLDER_MEDIA,
        foreground: PLACEHOLDER_MEDIA,
        research: PLACEHOLDER_MEDIA,
        imagine: PLACEHOLDER_MEDIA,
        create: PLACEHOLDER_MEDIA,
      };

      try {
        // Fetch all homepage media in a single query using purpose prefix
        const result = await payload.find({
          collection: "media",
          locale: "en",
          where: {
            purpose: { like: "homepage-%" },
          },
          limit: 10,
          depth: 0,
        });

        const byPurpose = new Map<string, Media>();
        for (const doc of result.docs) {
          const purpose = (doc as Media & { purpose?: string }).purpose;
          if (purpose) byPurpose.set(purpose, doc);
        }

        for (const [key, purpose] of Object.entries(HOMEPAGE_PURPOSE_MAP)) {
          const media = byPurpose.get(purpose);
          if (media?.url) {
            fallback[key as keyof HomepageMedia] = {
              url: media.url,
              alt: media.alt || purpose,
            };
          }
        }

        return fallback;
      } catch (err) {
        logger.error("getHomepageMedia: payload.find failed:", err);
        return fallback;
      }
    },
    ["homepage-media"],
    { tags: ["media"], revalidate: 3600 },
  )();
}

/**
 * Get a hero image for a page by its purpose key.
 *
 * Purposes follow the convention `hero-{pageName}`, e.g.:
 *   "hero-about", "hero-research", "hero-imagine", "hero-create",
 *   "hero-school", "hero-contact", "hero-portfolio", "hero-collections"
 */
export async function getPageHeroMedia(
  pageName: string,
  locale: Locale = "en",
): Promise<ResolvedMedia> {
  return unstable_cache(
    async () => getMediaByPurpose(`hero-${pageName}`, locale),
    [`hero-media-${pageName}-${locale}`],
    { tags: ["media"], revalidate: 3600 },
  )();
}
