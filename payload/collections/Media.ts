import type { CollectionConfig } from "payload";
import path from "path";
import { fileURLToPath } from "url";
import { env } from "@/lib/env";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export const Media: CollectionConfig = {
  slug: "media",
  admin: {
    useAsTitle: "alt",
    defaultColumns: ["alt", "filename", "mimeType", "filesize", "updatedAt"],
    group: "System",
    description: "Images and documents for the website",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      localized: true,
      admin: {
        description: "Localized alt text is required for accessibility and SEO",
      },
    },
    {
      name: "purpose",
      type: "text",
      index: true,
      admin: {
        hidden: true,
        description:
          "Machine-readable purpose identifier for programmatic media queries (e.g. hero-about, homepage-background)",
      },
    },
  ],
  upload: {
    staticDir: env.BLOB_READ_WRITE_TOKEN
      ? undefined
      : path.resolve(dirname, "../../media"),
    staticURL: env.BLOB_READ_WRITE_TOKEN ? undefined : "/api/media/file",
    disableLocalStorage: !!env.BLOB_READ_WRITE_TOKEN,
    adminThumbnail: "thumbnail",
    resizeOptions: {
      width: 2560,
      height: 2560,
      fit: "inside",
      withoutEnlargement: true,
    },
    imageSizes: [
      {
        name: "thumbnail",
        width: 400,
        height: 300,
        position: "centre",
      },
      {
        name: "card",
        width: 800,
        height: 600,
        position: "centre",
      },
      {
        name: "hero",
        width: 1920,
        height: 1080,
        position: "centre",
      },
    ],
    mimeTypes: ["image/*"],
  } as any,
};
