import { getPayload as getPayloadInstance } from "payload";
import configPromise from "@payload-config";
import type { Where, Payload, PaginatedDocs } from "payload";
import { logger } from "@/lib/logger";
import type {
  Service,
  Portfolio,
  Lookbook,
  Course,
  SiteSetting,
} from "@/payload-types";

export type Locale = "uk" | "ru" | "en";

type LocalizedCollection = "services" | "portfolio" | "lookbooks" | "courses";

const supportedLocales: Locale[] = ["en", "uk", "ru"];

export async function getPayload(): Promise<Payload> {
  return getPayloadInstance({ config: configPromise });
}

export async function getServices(
  locale: Locale = "uk",
  category?: string
): Promise<PaginatedDocs<Service>> {
  const payload = await getPayload();

  const where: Where | undefined = category
    ? { category: { equals: category } }
    : undefined;

  try {
    return await payload.find({
      collection: "services",
      locale,
      fallbackLocale: false,
      where,
      sort: "-featured,-createdAt",
    });
  } catch (err) {
    logger.error("getServices: payload.find failed:", err);
    return {
      docs: [],
      totalDocs: 0,
      limit: 10,
      totalPages: 1,
      page: 1,
      pagingCounter: 1,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: null,
      nextPage: null,
    };
  }
}

export async function getFeaturedServices(
  locale: Locale = "uk"
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
    });
  } catch (err) {
    logger.error("getFeaturedServices: payload.find failed:", err);
    return {
      docs: [],
      totalDocs: 0,
      limit: 3,
      totalPages: 1,
      page: 1,
      pagingCounter: 1,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: null,
      nextPage: null,
    };
  }
}

export async function getServiceBySlug(
  slug: string,
  locale: Locale = "uk",
  draft = false
): Promise<Service | null> {
  const payload = await getPayload();

  try {
    const result = await payload.find({
      collection: "services",
      where: { slug: { equals: slug } },
      locale,
      fallbackLocale: false,
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
  draft = false
): Promise<Portfolio | null> {
  const payload = await getPayload();

  try {
    const result = await payload.find({
      collection: "portfolio",
      where: { slug: { equals: slug } },
      locale,
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
  draft = false
): Promise<Lookbook | null> {
  const payload = await getPayload();

  try {
    const result = await payload.find({
      collection: "lookbooks",
      where: { slug: { equals: slug } },
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
  draft = false
): Promise<Course | null> {
  const payload = await getPayload();

  try {
    const result = await payload.find({
      collection: "courses",
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
  draft = false
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
        })
      )
    );

    return supportedLocales.filter(
      (_, index) => results[index].docs.length > 0
    );
  } catch (err) {
    logger.error("getAvailableLocales: payload.find failed:", err);
    return [];
  }
}

export async function getPortfolio(
  locale: Locale = "uk",
  page = 1,
  limit = 6
): Promise<PaginatedDocs<Portfolio>> {
  const payload = await getPayload();

  try {
    return await payload.find({
      collection: "portfolio",
      locale,
      fallbackLocale: false,
      page,
      limit,
      sort: "-featured,-createdAt",
    });
  } catch (err) {
    logger.error("getPortfolio: payload.find failed:", err);
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
}

export async function getFeaturedPortfolio(
  locale: Locale = "uk"
): Promise<PaginatedDocs<Portfolio>> {
  const payload = await getPayload();

  try {
    return await payload.find({
      collection: "portfolio",
      locale,
      fallbackLocale: false,
      where: {
        featured: { equals: true },
      },
      limit: 3,
    });
  } catch (err) {
    logger.error("getFeaturedPortfolio: payload.find failed:", err);
    return {
      docs: [],
      totalDocs: 0,
      limit: 3,
      totalPages: 1,
      page: 1,
      pagingCounter: 1,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: null,
      nextPage: null,
    };
  }
}

export async function getCollections(
  locale: Locale = "uk",
  limit = 4
): Promise<PaginatedDocs<Lookbook>> {
  const payload = await getPayload();

  try {
    return await payload.find({
      collection: "lookbooks",
      locale,
      fallbackLocale: false,
      limit,
      sort: "-featured,-createdAt",
    });
  } catch (err) {
    logger.error("getCollections: payload.find failed:", err);
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
}

export async function getSiteSettings(
  locale: Locale = "uk"
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
