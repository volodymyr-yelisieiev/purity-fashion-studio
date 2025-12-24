import type { CollectionConfig } from "payload";
import { slugify } from "@/lib/utils";
import { revalidateContent } from "../hooks/revalidate";

export const Portfolio: CollectionConfig = {
  slug: "portfolio",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "featured", "updatedAt"],
    group: "Showcase",
    description: "Before/after transformations and client work",
  },
  hooks: {
    afterChange: [revalidateContent("portfolio")],
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true;
      return { status: { equals: "published" } };
    },
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      localized: true,
      admin: {
        description: "Project title (can include client first name)",
      },
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

            const title =
              pickLocalizedText(data?.title) ||
              pickLocalizedText(originalDoc?.title);
            return title ? slugify(title) : value;
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
      ],
      admin: {
        position: "sidebar",
        description: "Only published items are visible on the site",
      },
    },
    {
      name: "category",
      type: "select",
      options: [
        { label: "Personal Styling", value: "styling" },
        { label: "Wardrobe Audit", value: "wardrobe-audit" },
        { label: "Event Look", value: "event" },
        { label: "Shopping Result", value: "shopping" },
        { label: "Editorial", value: "editorial" },
      ],
      index: true,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "mainImage",
      type: "upload",
      relationTo: "media",
      required: true,
      admin: {
        description: "Primary project image",
      },
    },
    {
      name: "description",
      type: "textarea",
      localized: true,
      admin: {
        description: "Story behind the project",
      },
    },
    {
      name: "challenge",
      type: "textarea",
      localized: true,
      admin: {
        description: "The problem or starting point for the client",
      },
    },
    {
      name: "solution",
      type: "textarea",
      localized: true,
      admin: {
        description: "What we did to address the challenge",
      },
    },
    {
      name: "result",
      type: "textarea",
      localized: true,
      admin: {
        description: "The final outcome and transformation",
      },
    },
    {
      name: "gallery",
      type: "array",
      admin: {
        description: "Additional photos from the project",
      },
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
        },
        {
          name: "caption",
          type: "text",
          localized: true,
        },
      ],
    },
    {
      name: "servicesUsed",
      type: "relationship",
      relationTo: "services",
      hasMany: true,
      admin: {
        description: "Which services were used for this project",
      },
    },
    {
      name: "testimonial",
      type: "group",
      admin: {
        description: "Optional client testimonial",
      },
      fields: [
        {
          name: "quote",
          type: "textarea",
          localized: true,
        },
        {
          name: "clientName",
          type: "text",
          admin: {
            description: "First name only for privacy",
          },
        },
        {
          name: "rating",
          type: "number",
          min: 1,
          max: 5,
        },
      ],
    },
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
      index: true,
      admin: {
        position: "sidebar",
        description: "Show on homepage",
      },
    },
    {
      name: "publishedAt",
      type: "date",
      admin: {
        position: "sidebar",
        description: "Date to display for this project",
      },
    },
    {
      name: "pricing",
      type: "group",
      admin: {
        position: "sidebar",
        description: "Pricing information for this transformation package",
      },
      fields: [
        {
          name: "uah",
          type: "number",
          label: "UAH",
          min: 0,
        },
        {
          name: "eur",
          type: "number",
          label: "EUR",
          min: 0,
        },
        {
          name: "priceNote",
          type: "text",
          localized: true,
        },
      ],
    },
    {
      name: "bookable",
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: "sidebar",
        description: "Allow booking a similar transformation",
      },
    },
    {
      name: "paymentEnabled",
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: "sidebar",
        description: "Enable online payment for this transformation package",
      },
    },
  ],
};
