import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import fs from "fs";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import { seoPlugin } from "@payloadcms/plugin-seo";

import { Users } from "./payload/collections/Users";
import { Media } from "./payload/collections/Media";
import { Services } from "./payload/collections/Services";
import { Products } from "./payload/collections/Products";
import { Portfolio } from "./payload/collections/Portfolio";
import { Collections } from "./payload/collections/Collections";
import { Orders } from "./payload/collections/Orders";
import { Courses } from "./payload/collections/Courses";
import { SiteSettings } from "./payload/globals/SiteSettings";
import {
  fixMigrationIdempotency,
  simplifyMigrationFilename,
} from "./lib/payloadUtils";
import { migrations } from "./migrations";
import { extractPlainText } from "./lib/utils";

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

        const pickLocalized = (value: unknown): string | undefined => {
          if (!value) return undefined;
          if (typeof value === "string") return value;
          if (typeof value === "object") {
            const record = value as Record<string, string | undefined>;
            return (
              (locale?.code && record[locale.code]) ||
              record.uk ||
              record.en ||
              record.ru ||
              Object.values(record).find(Boolean)
            );
          }
          return undefined;
        };

        const collectionSlug = collectionConfig?.slug || "preview";
        const slug =
          pickLocalized((data as Record<string, unknown>)?.slug) || "preview";
        const localeCode = locale?.code || "uk";

        return `${baseUrl}/api/preview?collection=${collectionSlug}&slug=${slug}&locale=${localeCode}&secret=${process.env.PAYLOAD_SECRET}`;
      },
      collections: [
        "services",
        "portfolio",
        "products",
        "lookbooks",
        "courses",
      ],
    },
  },
  // CSRF protection - only allow requests from these origins
  csrf: [process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"],
  serverURL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  collections: [
    Users,
    Media,
    Services,
    Products,
    Portfolio,
    Collections,
    Orders,
    Courses,
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
    const secret = process.env.PAYLOAD_SECRET;
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
  db: (() => {
    const adapter = postgresAdapter({
      pool: {
        connectionString: process.env.DATABASE_URL || "",
      },
      push: false, // Disable push to ensure migrations are the source of truth
    });

    // @ts-expect-error - migrations is not in the type but is used by the adapter
    adapter.migrations = migrations;

    const originalInit = adapter.init;

    adapter.init = (args) => {
      const instance = originalInit(args);
      const originalCreateMigration = instance.createMigration;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      instance.createMigration = async (migrationArgs: any) => {
        await originalCreateMigration.call(instance, migrationArgs);

        // After creation, find the latest file and fix it
        const migrationsDir = instance.migrationDir;
        if (!migrationsDir) return;

        const files = fs
          .readdirSync(migrationsDir)
          .filter((f) => f.endsWith(".ts") && f !== "index.ts")
          .map((f) => ({
            name: f,
            mtime: fs.statSync(path.join(migrationsDir, f)).mtime,
          }))
          .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());

        if (files.length > 0) {
          const latestFile = path.join(migrationsDir, files[0].name);
          fixMigrationIdempotency(latestFile);
          simplifyMigrationFilename(latestFile, migrationsDir);
        }
      };

      return instance;
    };

    return adapter;
  })(),
  sharp,
  plugins: [
    vercelBlobStorage({
      enabled: !!process.env.BLOB_READ_WRITE_TOKEN,
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || "",
      clientUploads: false,
      addRandomSuffix: true,
      cacheControlMaxAge: 31536000, // 1 year
    }),
    seoPlugin({
      collections: [
        "services",
        "products",
        "portfolio",
        "lookbooks",
        "courses",
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
              admin: {
                ...(field.admin || {}),
                hidden: true,
              },
            };
          }
          return field;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }) as any[];
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      generateTitle: ({ doc, locale }: any) => {
        const pickLocalized = (value: unknown): string | undefined => {
          if (!value) return undefined;
          if (typeof value === "string") return value;
          if (typeof value === "object") {
            const record = value as Record<string, string | undefined>;
            return (
              record[locale] ||
              record.uk ||
              record.en ||
              record.ru ||
              Object.values(record).find(Boolean)
            );
          }
          return undefined;
        };

        const title =
          pickLocalized(doc?.title) || pickLocalized(doc?.name) || "PURITY";
        return `${title} | PURITY Fashion Studio`;
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      generateDescription: ({ doc, locale }: any) => {
        const pickLocalized = (value: unknown): string | undefined => {
          if (!value) return undefined;
          if (typeof value === "string") return value;
          if (typeof value === "object") {
            const record = value as Record<string, string | undefined>;
            return (
              record[locale] ||
              record.uk ||
              record.en ||
              record.ru ||
              Object.values(record).find(Boolean)
            );
          }
          return undefined;
        };

        const rawDesc =
          pickLocalized(doc?.excerpt) || pickLocalized(doc?.description);
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      generateImage: ({ doc }: any) => {
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      generateURL: ({ doc, collectionSlug, locale }: any) => {
        const pickLocalized = (value: unknown): string | undefined => {
          if (!value) return undefined;
          if (typeof value === "string") return value;
          if (typeof value === "object") {
            const record = value as Record<string, string | undefined>;
            return (
              record[locale] ||
              record.uk ||
              record.en ||
              record.ru ||
              Object.values(record).find(Boolean)
            );
          }
          return undefined;
        };

        const siteUrl =
          process.env.NEXT_PUBLIC_SITE_URL || "https://purity.studio";
        const slug = pickLocalized(doc?.slug) || "unknown";
        return `${siteUrl}/${locale}/${collectionSlug}/${slug}`;
      },
    }),
  ],
});
