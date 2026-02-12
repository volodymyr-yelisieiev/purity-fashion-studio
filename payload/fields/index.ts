import type { Field, FieldHook } from "payload";
import { slugify, pickLocalized } from "@/lib/utils";

/**
 * Shared slug generation hook that uses pickLocalized
 */
export const generateSlugHook =
  (sourceField: string = "title"): FieldHook =>
  ({ value, data, req, originalDoc }) => {
    if (value) return value;

    // Prefer English source, then current locale
    const source =
      pickLocalized(data?.[sourceField], "en") ||
      pickLocalized(originalDoc?.[sourceField], "en") ||
      pickLocalized(data?.[sourceField], req.locale) ||
      pickLocalized(originalDoc?.[sourceField], req.locale);

    return source ? slugify(source) : value;
  };

/**
 * Reusable slug field with auto-generation from a source field
 */
export const slugField = (sourceField: string = "title"): Field => ({
  name: "slug",
  type: "text",
  unique: true,
  required: true,
  localized: false,
  admin: {
    position: "sidebar",
    description: "URL-friendly identifier (auto-generated)",
  },
  hooks: {
    beforeValidate: [generateSlugHook(sourceField)],
  },
});

/**
 * Reusable status field with draft/published options
 */
export const statusField = (
  options: { label: string; value: string }[] = [
    { label: "Draft", value: "draft" },
    { label: "Published", value: "published" },
  ],
): Field => ({
  name: "status",
  type: "select",
  required: true,
  defaultValue: "draft",
  index: true,
  options,
  admin: {
    position: "sidebar",
    description: "Only published items are visible on the site",
  },
});

/**
 * Reusable pricing group field for UAH/EUR with optional sale price and notes
 */
export const pricingField = (options?: {
  required?: boolean;
  includeSale?: boolean;
}): Field => ({
  name: "pricing",
  type: "group",
  admin: {
    description: "Pricing and commercial information",
  },
  fields: [
    {
      name: "uah",
      type: "number",
      label: "UAH",
      min: 0,
      required: options?.required,
      admin: {
        description: "Price in Ukrainian Hryvnia",
        width: "50%",
      },
    },
    {
      name: "eur",
      type: "number",
      label: "EUR",
      min: 0,
      admin: {
        description: "Price in Euros",
        width: "50%",
      },
    },
    ...(options?.includeSale
      ? ([
          {
            name: "salePrice",
            type: "number",
            min: 0,
            admin: {
              description: "Sale price in UAH (optional)",
              width: "50%",
            },
          },
        ] as Field[])
      : []),
    {
      name: "priceNote",
      type: "text",
      localized: true,
      admin: {
        description: 'Optional note (e.g., "Starting from", "Per hour")',
      },
    },
  ],
});

/**
 * Reusable featured checkbox field
 */
export const featuredField = (): Field => ({
  name: "featured",
  type: "checkbox",
  defaultValue: false,
  index: true,
  admin: {
    position: "sidebar",
    description: "Show on homepage featured section",
  },
});

/**
 * Reusable bookable/payment fields
 */
export const bookingFields = (): Field[] => [
  {
    name: "bookable",
    type: "checkbox",
    defaultValue: true,
    admin: {
      position: "sidebar",
      description: "Allow online booking",
    },
  },
  {
    name: "paymentEnabled",
    type: "checkbox",
    defaultValue: false,
    admin: {
      position: "sidebar",
      description: "Enable online payment",
    },
  },
];

/**
 * Standard access control for published content
 */
export const publishedReadAccess = () => ({
  read: ({ req: { user } }: { req: { user: unknown } }) => {
    if (user) return true;
    return { status: { equals: "published" } };
  },
});
