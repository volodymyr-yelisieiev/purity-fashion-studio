import type { CollectionConfig } from "payload";
import { revalidateContent } from "../hooks/revalidate";
import {
  slugField,
  statusField,
  featuredField,
  pricingField,
  bookingFields,
  publishedReadAccess,
} from "../fields";
import { layoutBlocks } from "../blocks";

export const Courses: CollectionConfig = {
  slug: "courses",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "status", "updatedAt"],
    group: "Business",
    description: "Educational courses and workshops on styling and fashion",
  },
  hooks: {
    afterChange: [revalidateContent("courses")],
  },
  access: publishedReadAccess(),
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      localized: true,
      admin: { description: "Course title in this language" },
    },
    slugField("title"),
    statusField([
      { label: "Draft", value: "draft" },
      { label: "Published", value: "published" },
      { label: "Coming Soon", value: "coming-soon" },
      { label: "Archived", value: "archived" },
    ]),
    {
      name: "category",
      type: "select",
      required: true,
      index: true,
      options: [
        { label: "Personal Styling", value: "personal-styling" },
        { label: "Color Analysis", value: "color-analysis" },
        { label: "Wardrobe Audit", value: "wardrobe-audit" },
        { label: "Shopping Skills", value: "shopping" },
        { label: "Professional Development", value: "professional" },
        { label: "Masterclass", value: "masterclass" },
        { label: "Construction & Tailoring", value: "construction" },
      ],
      admin: {
        position: "sidebar",
        description: "Course category for filtering",
      },
    },
    {
      name: "level",
      type: "select",
      required: true,
      defaultValue: "beginner",
      index: true,
      options: [
        { label: "Beginner", value: "beginner" },
        { label: "Intermediate", value: "intermediate" },
        { label: "Advanced", value: "advanced" },
        { label: "All Levels", value: "all" },
      ],
      admin: {
        position: "sidebar",
        description: "Target audience experience level",
      },
    },
    {
      name: "layout",
      type: "blocks",
      blocks: layoutBlocks,
      localized: true,
      admin: { description: "Build the course page using editorial blocks" },
    },
    {
      name: "excerpt",
      type: "textarea",
      localized: true,
      admin: {
        position: "sidebar",
        description: "Brief description for cards and previews",
      },
    },
    {
      name: "duration",
      type: "group",
      admin: { position: "sidebar" },
      fields: [
        { name: "value", type: "number", required: true, min: 1 },
        {
          name: "unit",
          type: "select",
          required: true,
          defaultValue: "hours",
          options: [
            { label: "Hours", value: "hours" },
            { label: "Days", value: "days" },
            { label: "Weeks", value: "weeks" },
            { label: "Months", value: "months" },
          ],
        },
      ],
    },
    {
      name: "format",
      type: "select",
      required: true,
      defaultValue: "online",
      options: [
        { label: "Online", value: "online" },
        { label: "In Studio", value: "studio" },
        { label: "In-Person", value: "in-person" },
        { label: "Hybrid", value: "hybrid" },
      ],
      admin: { position: "sidebar" },
    },
    pricingField({ includeSale: true }),
    {
      name: "instructor",
      type: "group",
      fields: [
        { name: "name", type: "text", required: true },
        { name: "title", type: "text", localized: true },
        { name: "bio", type: "textarea", localized: true },
        { name: "photo", type: "upload", relationTo: "media" },
      ],
    },
    {
      name: "upcomingDates",
      type: "array",
      fields: [
        { name: "startDate", type: "date", required: true },
        { name: "endDate", type: "date" },
        { name: "spotsAvailable", type: "number", min: 0 },
      ],
    },
    {
      name: "faq",
      type: "array",
      fields: [
        { name: "question", type: "text", required: true, localized: true },
        { name: "answer", type: "textarea", required: true, localized: true },
      ],
    },
    featuredField(),
    ...bookingFields(),
    {
      name: "featuredImage",
      type: "upload",
      relationTo: "media",
      admin: { position: "sidebar" },
    },
  ],
};
