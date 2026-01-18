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
      name: "description",
      type: "textarea",
      localized: true,
      admin: { description: "Full service description" },
    },
    {
      name: "excerpt",
      type: "textarea",
      localized: true,
      admin: { description: "Brief description for cards (1-2 sentences)" },
    },
    {
      name: "category",
      type: "select",
      options: [
        { label: "Research", value: "research" },
        { label: "Realisation", value: "realisation" },
        { label: "Transformation", value: "transformation" },
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
      name: "format",
      type: "select",
      options: [
        { label: "Online", value: "online" },
        { label: "In Studio", value: "studio" },
        { label: "At Client Location", value: "onsite" },
        { label: "Hybrid", value: "hybrid" },
      ],
      admin: { description: "How this service is delivered" },
    },
    pricingField(),
    {
      name: "duration",
      type: "text",
      localized: true,
      admin: { description: 'Service duration (e.g., "2 hours")' },
    },
    {
      name: "heroImage",
      type: "upload",
      relationTo: "media",
      admin: { description: "Main image for the service page" },
    },
    {
      name: "includes",
      type: "array",
      localized: true,
      admin: { description: "What is included in this service" },
      fields: [{ name: "item", type: "text", required: true }],
    },
    {
      name: "steps",
      type: "array",
      admin: { description: "How the service works (process steps)" },
      fields: [
        { name: "title", type: "text", localized: true, required: true },
        { name: "description", type: "textarea", localized: true },
      ],
    },
    featuredField(),
    ...bookingFields(),
  ],
};
