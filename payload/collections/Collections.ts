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
import { layoutBlocks } from "../blocks";

export const Collections: CollectionConfig = {
  slug: "lookbooks",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "season", "featured", "releaseDate"],
    group: "Showcase",
    description: "Curated fashion collections and lookbooks",
  },
  hooks: {
    afterChange: [revalidateContent("lookbooks")],
  },
  access: publishedReadAccess(),
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      localized: true,
      admin: {
        description: 'Collection name (e.g., "Autumn Essentials 2024")',
      },
    },
    slugField("name"),
    statusField(),
    {
      name: "season",
      type: "select",
      options: [
        { label: "Spring", value: "spring" },
        { label: "Summer", value: "summer" },
        { label: "Autumn", value: "autumn" },
        { label: "Winter", value: "winter" },
        { label: "All Season", value: "all-season" },
      ],
      index: true,
      admin: { position: "sidebar" },
    },
    {
      name: "description",
      type: "textarea",
      localized: true,
      admin: { description: "Collection story and inspiration" },
    },
    {
      name: "layout",
      type: "blocks",
      blocks: layoutBlocks,
      localized: true,
      admin: { description: "Build the lookbook page using editorial blocks" },
    },
    {
      name: "materials",
      type: "textarea",
      localized: true,
      admin: { description: "Materials used in this collection" },
    },
    {
      name: "careInstructions",
      type: "textarea",
      localized: true,
      admin: { description: "How to care for items in this collection" },
    },
    {
      name: "sizes",
      type: "text",
      localized: true,
      admin: { description: 'Available sizes (e.g., "XS-XL", "Custom")' },
    },
    {
      name: "coverImage",
      type: "upload",
      relationTo: "media",
      admin: { description: "Main collection image" },
    },
    {
      name: "images",
      type: "array",
      admin: { description: "Lookbook images" },
      fields: [
        { name: "image", type: "upload", relationTo: "media", required: true },
        { name: "caption", type: "text", localized: true },
      ],
    },
    featuredField(),
    {
      name: "releaseDate",
      type: "date",
      admin: {
        position: "sidebar",
        description: "When this collection was released",
      },
    },
    {
      name: "linkedProducts",
      type: "relationship",
      relationTo: "products",
      hasMany: true,
      admin: { description: "Products featured in this collection" },
    },
    pricingField(),
    ...bookingFields(),
  ],
};
