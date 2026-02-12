import type { CollectionConfig } from "payload";
import { revalidateContent } from "../hooks/revalidate";
import { slugField, statusField, publishedReadAccess } from "../fields";
import { layoutBlocks } from "../blocks";

export const Posts: CollectionConfig = {
  slug: "posts",
  admin: {
    useAsTitle: "title",
    defaultColumns: [
      "title",
      "category",
      "author",
      "publishedAt",
      "status",
      "updatedAt",
    ],
    group: "Content",
    description: "Blog posts and editorial content",
  },
  hooks: {
    afterChange: [revalidateContent("blog")],
  },
  access: publishedReadAccess(),
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      localized: true,
      admin: { description: "Post title" },
    },
    slugField("title"),
    statusField(),
    {
      name: "heroImage",
      type: "upload",
      relationTo: "media",
      required: true,
      admin: { description: "Primary image for the post (required)" },
    },
    {
      name: "excerpt",
      type: "textarea",
      required: true,
      localized: true,
      maxLength: 300,
      admin: {
        description: "Brief summary of the post (max 300 characters, required)",
      },
    },
    {
      name: "author",
      type: "text",
      required: true,
      admin: {
        position: "sidebar",
        description: "Author name",
      },
    },
    {
      name: "publishedAt",
      type: "date",
      required: true,
      admin: {
        position: "sidebar",
        description: "Publication date",
        date: { pickerAppearance: "dayOnly", displayFormat: "d MMM yyyy" },
      },
    },
    {
      name: "category",
      type: "select",
      required: true,
      options: [
        { label: "Editorial", value: "editorial" },
        { label: "Behind the Scenes", value: "behind-the-scenes" },
        { label: "Style Guide", value: "style-guide" },
        { label: "Methodology", value: "methodology" },
      ],
      admin: {
        position: "sidebar",
        description: "Post category",
      },
    },
    {
      name: "tags",
      type: "array",
      admin: {
        position: "sidebar",
        description: "Tags for flexible categorization",
      },
      fields: [
        {
          name: "tag",
          type: "text",
          required: true,
        },
      ],
    },
    {
      name: "layout",
      type: "blocks",
      blocks: layoutBlocks,
      localized: true,
      admin: { description: "Build the post content using editorial blocks" },
    },
    {
      name: "seo",
      type: "group",
      admin: { description: "SEO metadata overrides" },
      fields: [
        {
          name: "metaTitle",
          type: "text",
          localized: true,
          admin: { description: "Custom meta title (overrides post title)" },
        },
        {
          name: "metaDescription",
          type: "textarea",
          localized: true,
          admin: { description: "Custom meta description (overrides excerpt)" },
        },
        {
          name: "ogImage",
          type: "upload",
          relationTo: "media",
          admin: { description: "Open Graph image (overrides hero image)" },
        },
      ],
    },
  ],
};
