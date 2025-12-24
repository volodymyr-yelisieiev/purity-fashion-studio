import type { MetadataRoute } from "next";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://purity.studio";
  const locales = ["uk", "ru", "en"] as const;

  // Static pages - always include these
  const staticPages = [
    "",
    "/services",
    "/about",
    "/contact",
    "/portfolio",
    "/collections",
    "/school",
    "/booking",
  ];
  const staticEntries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const page of staticPages) {
      const localePrefix = locale === "uk" ? "" : `/${locale}`;
      staticEntries.push({
        url: `${siteUrl}${localePrefix}${page}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: page === "" ? 1.0 : 0.8,
      });
    }
  }

  // Dynamic entries - try to fetch from database
  const dynamicEntries: MetadataRoute.Sitemap = [];

  try {
    const payload = await getPayload({ config: configPromise });

    // Service pages
    const services = await payload.find({
      collection: "services",
      limit: 100,
    });

    for (const service of services.docs) {
      for (const locale of locales) {
        const localePrefix = locale === "uk" ? "" : `/${locale}`;
        dynamicEntries.push({
          url: `${siteUrl}${localePrefix}/services/${service.slug}`,
          lastModified: new Date(service.updatedAt),
          changeFrequency: "monthly",
          priority: 0.7,
        });
      }
    }

    // Portfolio pages
    const portfolio = await payload.find({
      collection: "portfolio",
      limit: 100,
    });

    for (const item of portfolio.docs) {
      for (const locale of locales) {
        const localePrefix = locale === "uk" ? "" : `/${locale}`;
        dynamicEntries.push({
          url: `${siteUrl}${localePrefix}/portfolio/${item.slug}`,
          lastModified: new Date(item.updatedAt),
          changeFrequency: "monthly",
          priority: 0.6,
        });
      }
    }

    // Collection pages
    const collections = await payload.find({
      collection: "lookbooks",
      limit: 100,
    });

    for (const collection of collections.docs) {
      for (const locale of locales) {
        const localePrefix = locale === "uk" ? "" : `/${locale}`;
        dynamicEntries.push({
          url: `${siteUrl}${localePrefix}/collections/${collection.slug}`,
          lastModified: new Date(collection.updatedAt),
          changeFrequency: "monthly",
          priority: 0.6,
        });
      }
    }

    // Course pages
    const courses = await payload.find({
      collection: "courses",
      limit: 100,
    });

    for (const course of courses.docs) {
      for (const locale of locales) {
        const localePrefix = locale === "uk" ? "" : `/${locale}`;
        dynamicEntries.push({
          url: `${siteUrl}${localePrefix}/school/${course.slug}`,
          lastModified: new Date(course.updatedAt),
          changeFrequency: "monthly",
          priority: 0.6,
        });
      }
    }
  } catch (error) {
    // Database not available - return static entries only
    logger.warn("Could not fetch dynamic sitemap entries:", error);
  }

  return [...staticEntries, ...dynamicEntries];
}
