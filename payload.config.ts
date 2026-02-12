import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import { seoPlugin } from "@payloadcms/plugin-seo";
import { env } from "@/lib/env";
import { logger } from "./lib/logger";

import { Users } from "./payload/collections/Users";
import { Media } from "./payload/collections/Media";
// ... (omitting some imports for brevity in thought, but using full in tool call)
import { Services } from "./payload/collections/Services";
import { Products } from "./payload/collections/Products";
import { Portfolio } from "./payload/collections/Portfolio";
import { Collections } from "./payload/collections/Collections";
import { Orders } from "./payload/collections/Orders";
import { Courses } from "./payload/collections/Courses";
import { Posts } from "./payload/collections/Posts";
import { SiteSettings } from "./payload/globals/SiteSettings";
import { pickLocalized, extractPlainText } from "./lib/utils";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    livePreview: {
      url: ({ data, collectionConfig, locale }) => {
        const baseUrl =
          process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
        const collectionSlug = collectionConfig?.slug || "preview";
        const slug =
          pickLocalized(
            (data as Record<string, unknown>)?.slug,
            locale?.code,
          ) || "preview";
        const localeCode = locale?.code || "uk";

        return `${baseUrl}/api/preview?collection=${collectionSlug}&slug=${slug}&locale=${localeCode}&secret=${process.env.PAYLOAD_SECRET}`;
      },
      collections: [
        "services",
        "portfolio",
        "products",
        "lookbooks",
        "courses",
        "posts",
      ],
    },
  },
  csrf: [env.NEXT_PUBLIC_SITE_URL],
  serverURL: env.NEXT_PUBLIC_SITE_URL,
  onInit: async (payload) => {
    const poolCfg = {
      max: 5,
      connectionTimeoutMillis: 10_000,
      idleTimeoutMillis: 30_000,
    };
    try {
      const count = await payload.count({ collection: "users" });
      logger.info(
        `[DB] Pool connected (max=${poolCfg.max}, timeout=${poolCfg.connectionTimeoutMillis}ms). Users: ${count.totalDocs}`,
      );
    } catch (err) {
      logger.error("[DB] Pool connection check failed:", err);
    }
  },
  collections: [
    Users,
    Media,
    Services,
    Products,
    Portfolio,
    Collections,
    Orders,
    Courses,
    Posts,
  ],
  globals: [SiteSettings],
  folders: {},
  localization: {
    locales: ["en", "ru", "uk"],
    defaultLocale: "uk",
    fallback: true,
  },
  editor: lexicalEditor({}),
  secret: (() => {
    const secret = env.PAYLOAD_SECRET;
    if (!secret) {
      throw new Error("PAYLOAD_SECRET environment variable is required");
    }
    if (secret.length < 32) {
      throw new Error("PAYLOAD_SECRET must be at least 32 characters long");
    }
    return secret;
  })(),
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: env.DATABASE_URL || "",
      max: 5,
      connectionTimeoutMillis: 10_000,
      idleTimeoutMillis: 30_000,
      allowExitOnIdle: true,
    },
    push: false,
  }),
  sharp,
  plugins: [
    vercelBlobStorage({
      enabled: !!env.BLOB_READ_WRITE_TOKEN,
      collections: {
        media: {
          disablePayloadAccessControl: true,
        },
      },
      token: env.BLOB_READ_WRITE_TOKEN || "",
      clientUploads: false,
      addRandomSuffix: true,
      cacheControlMaxAge: 31536000,
    }),
    seoPlugin({
      collections: [
        "services",
        "products",
        "portfolio",
        "lookbooks",
        "courses",
        "posts",
      ],
      uploadsCollection: "media",
      tabbedUI: false,
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if (
            "name" in field &&
            (field.name === "image" || field.name === "preview")
          ) {
            return {
              ...field,
              admin: { ...(field.admin || {}), hidden: true },
            };
          }
          return field;
        }) as any[];
      },
      generateTitle: ({ doc, locale }) => {
        const title =
          pickLocalized(doc?.title, locale) ||
          pickLocalized(doc?.name, locale) ||
          "PURITY";
        return `${title} | PURITY Fashion Studio`;
      },
      generateDescription: ({ doc, locale }) => {
        const rawDesc =
          pickLocalized(doc?.excerpt, locale) ||
          pickLocalized(doc?.description, locale);
        let desc = "";

        if (typeof rawDesc === "string") {
          desc = rawDesc;
        } else if (typeof rawDesc === "object" && rawDesc !== null) {
          desc = extractPlainText(rawDesc);
        }

        if (desc) {
          return desc.length > 155 ? desc.substring(0, 152) + "..." : desc;
        }

        return locale === "uk"
          ? "Професійний стайлінг та послуги ательє від PURITY Fashion Studio."
          : locale === "ru"
            ? "Профессиональный стайлинг и услуги ателье от PURITY Fashion Studio."
            : "Professional styling and atelier services by PURITY Fashion Studio.";
      },
      generateImage: ({ doc }) => {
        const image =
          doc?.heroImage ||
          doc?.mainImage ||
          doc?.afterImage ||
          doc?.coverImage ||
          doc?.featuredImage ||
          doc?.images?.[0]?.image;
        if (typeof image === "object" && image?.url) return image.url;
        return undefined;
      },
      generateURL: ({ doc, collectionSlug, locale }) => {
        const siteUrl =
          process.env.NEXT_PUBLIC_SITE_URL || "https://purity.studio";
        const slug = pickLocalized(doc?.slug, locale) || "unknown";
        return `${siteUrl}/${locale}/${collectionSlug}/${slug}`;
      },
    }),
  ],
});
