import type { CollectionConfig } from "payload";
import { revalidateContent } from "../hooks/revalidate";
import {
  slugField,
  statusField,
  pricingField,
  featuredField,
  bookingFields,
  publishedReadAccess,
} from "../fields";

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
  access: publishedReadAccess(),
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      localized: true,
      admin: { description: "Project title (can include client first name)" },
    },
    slugField("title"),
    statusField(),
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
      admin: { position: "sidebar" },
    },
    {
      name: "mainImage",
      type: "upload",
      relationTo: "media",
      required: true,
      admin: { description: "Primary project image" },
    },
    {
      name: "description",
      type: "textarea",
      localized: true,
      admin: { description: "Story behind the project" },
    },
    {
      name: "challenge",
      type: "textarea",
      localized: true,
      admin: { description: "The problem or starting point" },
    },
    {
      name: "solution",
      type: "textarea",
      localized: true,
      admin: { description: "What we did to address the challenge" },
    },
    {
      name: "result",
      type: "textarea",
      localized: true,
      admin: { description: "The final outcome and transformation" },
    },
    {
      name: "gallery",
      type: "array",
      admin: { description: "Additional photos from the project" },
      fields: [
        { name: "image", type: "upload", relationTo: "media", required: true },
        { name: "caption", type: "text", localized: true },
      ],
    },
    {
      name: "servicesUsed",
      type: "relationship",
      relationTo: "services",
      hasMany: true,
      admin: { description: "Which services were used for this project" },
    },
    {
      name: "testimonial",
      type: "group",
      admin: { description: "Optional client testimonial" },
      fields: [
        { name: "quote", type: "textarea", localized: true },
        {
          name: "clientName",
          type: "text",
          admin: { description: "First name only for privacy" },
        },
        { name: "rating", type: "number", min: 1, max: 5 },
      ],
    },
    featuredField(),
    {
      name: "publishedAt",
      type: "date",
      admin: {
        position: "sidebar",
        description: "Date to display for this project",
      },
    },
    pricingField(),
    ...bookingFields(),
  ],
};
