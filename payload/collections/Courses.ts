import type { CollectionConfig } from "payload";
import {
  slugField,
  statusField,
  featuredField,
  bookingFields,
  publishedReadAccess,
} from "../fields";

export const Courses: CollectionConfig = {
  slug: "courses",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "status", "updatedAt"],
    group: "Business",
    description: "Educational courses and workshops on styling and fashion",
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
    statusField([
      { label: "Draft", value: "draft" },
      { label: "Published", value: "published" },
      { label: "Coming Soon", value: "coming-soon" },
      { label: "Archived", value: "archived" },
    ]),
    {
      name: "excerpt",
      type: "textarea",
      localized: true,
      admin: { description: "Brief description for cards and previews" },
    },
    {
      name: "description",
      type: "richText",
      localized: true,
    },
    {
      name: "prerequisites",
      type: "textarea",
      localized: true,
      admin: {
        description: "What students should know before taking this course",
      },
    },
    {
      name: "materials",
      type: "textarea",
      localized: true,
      admin: { description: "What students need to have for this course" },
    },
    {
      name: "featuredImage",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "duration",
      type: "group",
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
        { label: "In-Person", value: "in-person" },
        { label: "Hybrid", value: "hybrid" },
      ],
    },
    {
      name: "pricing",
      type: "group",
      admin: { description: "Course pricing" },
      fields: [
        { name: "uah", type: "number", label: "UAH", min: 0 },
        { name: "eur", type: "number", label: "EUR", min: 0 },
        {
          name: "earlyBirdAmount",
          type: "number",
          min: 0,
          admin: { description: "Early bird discount price" },
        },
        { name: "priceNote", type: "text", localized: true },
      ],
    },
    {
      name: "curriculum",
      type: "array",
      fields: [
        { name: "module", type: "text", required: true, localized: true },
        {
          name: "topics",
          type: "array",
          fields: [
            { name: "topic", type: "text", required: true, localized: true },
          ],
        },
      ],
    },
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
      name: "testimonials",
      type: "array",
      fields: [
        { name: "name", type: "text", required: true },
        { name: "quote", type: "textarea", required: true, localized: true },
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
  ],
};
