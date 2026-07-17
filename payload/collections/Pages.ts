import type { CollectionConfig } from "payload"

import { contentManagers, ownerOnly } from "../access"
import {
  commonPublicFields,
  ctaField,
  draftVersions,
  localizedText,
  localizedTextarea,
  publicRead,
} from "../fields/shared"
import { publicCollectionHooks } from "../hooks/revalidation"

export const Pages: CollectionConfig = {
  slug: "pages",
  admin: {
    group: "Content",
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "pageType", "enabled", "updatedAt"],
  },
  access: {
    create: contentManagers,
    delete: ownerOnly,
    read: publicRead,
    update: contentManagers,
  },
  hooks: publicCollectionHooks({
    collectionTag: "pages",
    pathPrefix: "",
    revalidateNavigation: true,
  }),
  fields: [
    ...commonPublicFields,
    {
      name: "pageType",
      type: "select",
      required: true,
      options: [
        "studio",
        "contacts",
        "privacy",
        "terms",
        "cookies",
        "payments",
        "cancellation-refunds",
        "consent",
        "service-state",
      ],
    },
    localizedText("eyebrow", "Eyebrow", { required: false, maxLength: 100 }),
    localizedTextarea("body", "Body"),
    {
      name: "sections",
      type: "array",
      localized: true,
      fields: [
        { name: "heading", type: "text", required: true, maxLength: 240 },
        { name: "body", type: "textarea", required: true, maxLength: 6000 },
        { name: "media", type: "upload", relationTo: "media" },
      ],
    },
    {
      name: "contactConfiguration",
      type: "group",
      admin: {
        condition: (_, siblingData) => siblingData?.pageType === "contacts",
      },
      fields: [
        { name: "showMap", type: "checkbox", defaultValue: false },
        { name: "corporateContext", type: "checkbox", defaultValue: true },
      ],
    },
    {
      name: "legalVersion",
      type: "text",
      maxLength: 80,
      admin: {
        condition: (_, siblingData) => siblingData?.pageType !== "studio",
      },
    },
    {
      name: "effectiveDate",
      type: "date",
      admin: {
        condition: (_, siblingData) => siblingData?.pageType !== "studio",
      },
    },
    ctaField,
  ],
  versions: draftVersions,
  timestamps: true,
}
