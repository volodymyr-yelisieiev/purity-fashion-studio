import type { CollectionConfig } from "payload";
import { slugify } from "@/lib/utils";
import { revalidateContent } from "../hooks/revalidate";

export const Products: CollectionConfig = {
  slug: "products",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "category", "uah", "status", "featured"],
    group: "Business",
    description: "Atelier products and clothing items",
  },
  hooks: {
    afterChange: [revalidateContent("products")],
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true;
      return { status: { equals: "published" } };
    },
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "slug",
      type: "text",
      unique: true,
      required: true,
      localized: true,
      admin: {
        position: "sidebar",
        description: "URL-friendly identifier",
      },
      hooks: {
        beforeValidate: [
          ({ value, data, req, originalDoc }) => {
            if (value) return value;

            const locale = req.locale;

            const pickLocalizedText = (source: unknown): string | undefined => {
              if (!source) return undefined;
              if (typeof source === "string" && source) return source;
              if (typeof source === "object" && source !== null) {
                const record = source as Record<string, string | undefined>;
                if (locale && record[locale]) return record[locale];
                return (
                  record.uk ||
                  record.en ||
                  record.ru ||
                  Object.values(record).find(Boolean)
                );
              }
              return undefined;
            };

            const name =
              pickLocalizedText(data?.name) ||
              pickLocalizedText(originalDoc?.name);
            return name ? slugify(name) : value;
          },
        ],
      },
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "draft",
      index: true,
      options: [
        { label: "Draft", value: "draft" },
        { label: "Published", value: "published" },
        { label: "Out of Stock", value: "out-of-stock" },
        { label: "Archived", value: "archived" },
      ],
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
      index: true,
      admin: {
        position: "sidebar",
        description: "Show in featured products section",
      },
    },
    {
      name: "excerpt",
      type: "textarea",
      localized: true,
      admin: {
        description: "Brief description for cards and previews",
      },
    },
    {
      name: "description",
      type: "textarea",
      localized: true,
      admin: {
        description: "Full product description",
      },
    },
    {
      name: "sku",
      type: "text",
      unique: true,
      admin: {
        position: "sidebar",
        description: "Stock Keeping Unit",
      },
    },
    {
      name: "pricing",
      type: "group",
      admin: {
        description: "Product pricing in multiple currencies",
      },
      fields: [
        {
          name: "uah",
          type: "number",
          required: true,
          min: 0,
          admin: {
            description: "Price in Ukrainian Hryvnia",
          },
        },
        {
          name: "eur",
          type: "number",
          min: 0,
          admin: {
            description: "Price in Euro (optional)",
          },
        },
        {
          name: "salePrice",
          type: "number",
          min: 0,
          admin: {
            description: "Sale price in UAH (leave empty if not on sale)",
          },
        },
      ],
    },
    {
      name: "images",
      type: "array",
      minRows: 1,
      admin: {
        description: "Product images (first is main)",
      },
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
        },
        {
          name: "alt",
          type: "text",
          localized: true,
          admin: {
            description: "Alt text for accessibility",
          },
        },
      ],
    },
    {
      name: "category",
      type: "select",
      required: true,
      index: true,
      options: [
        { label: "Dresses", value: "dresses" },
        { label: "Tops", value: "tops" },
        { label: "Bottoms", value: "bottoms" },
        { label: "Outerwear", value: "outerwear" },
        { label: "Accessories", value: "accessories" },
        { label: "Bags", value: "bags" },
        { label: "Jewelry", value: "jewelry" },
      ],
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "details",
      type: "group",
      admin: {
        description: "Product specifications",
      },
      fields: [
        {
          name: "material",
          type: "text",
          localized: true,
        },
        {
          name: "care",
          type: "textarea",
          localized: true,
          admin: {
            description: "Care instructions",
          },
        },
        {
          name: "sizes",
          type: "select",
          hasMany: true,
          options: [
            { label: "XS", value: "xs" },
            { label: "S", value: "s" },
            { label: "M", value: "m" },
            { label: "L", value: "l" },
            { label: "XL", value: "xl" },
            { label: "One Size", value: "one-size" },
          ],
        },
        {
          name: "colors",
          type: "array",
          fields: [
            {
              name: "name",
              type: "text",
              required: true,
              localized: true,
            },
            {
              name: "hex",
              type: "text",
              admin: {
                description: "Hex color code (e.g., #000000)",
              },
            },
          ],
        },
      ],
    },
  ],
};
