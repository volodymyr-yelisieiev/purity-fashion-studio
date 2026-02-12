import type { CollectionConfig } from "payload";
import { revalidateContent } from "../hooks/revalidate";
import {
  slugField,
  statusField,
  featuredField,
  pricingField,
  publishedReadAccess,
} from "../fields";
import { layoutBlocks } from "../blocks";

export const Products: CollectionConfig = {
  slug: "products",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "category", "status", "featured"],
    group: "Business",
    description: "Atelier products and clothing items",
  },
  hooks: {
    afterChange: [revalidateContent("products")],
  },
  access: publishedReadAccess(),
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      localized: true,
    },
    slugField("name"),
    statusField([
      { label: "Draft", value: "draft" },
      { label: "Published", value: "published" },
      { label: "Out of Stock", value: "out-of-stock" },
      { label: "Archived", value: "archived" },
    ]),
    featuredField(),
    pricingField({ required: true, includeSale: true }),
    {
      name: "sku",
      type: "text",
      unique: true,
      admin: { position: "sidebar", description: "Stock Keeping Unit" },
    },
    {
      name: "excerpt",
      type: "textarea",
      localized: true,
      admin: { description: "Brief description for cards" },
    },
    {
      name: "description",
      type: "textarea",
      localized: true,
      admin: { description: "Full product description" },
    },
    {
      name: "layout",
      type: "blocks",
      blocks: layoutBlocks,
      localized: true,
      admin: { description: "Build the product page using editorial blocks" },
    },
    {
      name: "images",
      type: "array",
      minRows: 1,
      admin: { description: "Product images (first is main)" },
      fields: [
        { name: "image", type: "upload", relationTo: "media", required: true },
        {
          name: "alt",
          type: "text",
          localized: true,
          admin: { description: "Alt text for accessibility" },
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
      admin: { position: "sidebar" },
    },
    {
      name: "details",
      type: "group",
      admin: { description: "Product specifications" },
      fields: [
        { name: "material", type: "text", localized: true },
        {
          name: "care",
          type: "textarea",
          localized: true,
          admin: { description: "Care instructions" },
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
            { name: "name", type: "text", required: true, localized: true },
            {
              name: "hex",
              type: "text",
              admin: { description: "Hex color code (e.g., #000000)" },
            },
          ],
        },
      ],
    },
  ],
};
