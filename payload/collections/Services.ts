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

export const Services: CollectionConfig = {
  slug: "services",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "status", "updatedAt"],
    group: "Business",
    description: "Styling and atelier services offered by PURITY",
  },
  hooks: {
    afterChange: [revalidateContent("services")],
  },
  access: publishedReadAccess(),
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      localized: true,
      admin: { description: "Service name in this language" },
    },
    slugField("title"),
    statusField(),
    {
      name: "category",
      type: "select",
      options: [
        { label: "Research", value: "research" },
        { label: "Imagine", value: "imagine" },
        { label: "Create", value: "create" },
        { label: "Personal Styling", value: "styling" },
        { label: "Atelier & Tailoring", value: "atelier" },
        { label: "Consulting", value: "consulting" },
        { label: "Shopping", value: "shopping" },
        { label: "Events", value: "events" },
      ],
      required: true,
      index: true,
      admin: { position: "sidebar", description: "Service category" },
    },
    {
      name: "layout",
      type: "blocks",
      blocks: layoutBlocks,
      localized: true,
      admin: { description: "Build the service page using editorial blocks" },
    },
    {
      name: "excerpt",
      type: "textarea",
      required: true,
      localized: true,
      admin: {
        position: "sidebar",
        description: "Brief professional summary (Required)",
      },
    },
    {
      name: "description",
      type: "textarea",
      required: true,
      localized: true,
      admin: {
        description:
          "Deep narrative story of the service (Required for Editorial feel)",
      },
    },
    {
      name: "process",
      type: "array",
      required: true,
      minRows: 3,
      localized: true,
      admin: {
        description:
          "The 3-stage journey for this service (Minimum 3 steps required)",
      },
      fields: [
        {
          name: "title",
          type: "text",
          required: true,
        },
        {
          name: "description",
          type: "textarea",
          required: true,
        },
      ],
    },
    {
      name: "deliverables",
      type: "array",
      required: true,
      minRows: 1,
      localized: true,
      admin: {
        description:
          "What the client receives (e.g., Personal Lookbook, Custom Mannequin)",
      },
      fields: [
        {
          name: "item",
          type: "text",
          required: true,
        },
      ],
    },
    {
      name: "format",
      type: "select",
      options: [
        { label: "Online", value: "online" },
        { label: "In Studio", value: "studio" },
        { label: "At Client Location", value: "onsite" },
        { label: "Hybrid", value: "hybrid" },
        { label: "Retreat", value: "retreat" },
      ],
      admin: {
        position: "sidebar",
        description: "How this service is delivered",
      },
    },
    {
      name: "duration",
      type: "text",
      localized: true,
      admin: {
        position: "sidebar",
        description: 'Service duration (e.g., "2 hours")',
      },
    },
    pricingField(),
    featuredField(),
    ...bookingFields(),
    {
      name: "heroImage",
      type: "upload",
      relationTo: "media",
      admin: {
        position: "sidebar",
        description: "Thumbnail image for the service",
      },
    },
  ],
};
