import type { GlobalConfig } from "payload"

import { hasRole } from "../access"
import {
  draftVersions,
  localizedText,
  localizedTextarea,
} from "../fields/shared"
import { revalidateGlobal } from "../hooks/revalidation"

const canManage = ({ req }: { req: { user?: unknown } }) =>
  hasRole(req.user, ["owner", "editor"])

export const Home: GlobalConfig = {
  slug: "home",
  admin: { group: "Site" },
  access: {
    read: () => true,
    update: canManage,
  },
  hooks: { afterChange: [revalidateGlobal("home")] },
  fields: [
    localizedText("heroEyebrow", "Hero eyebrow", {
      required: false,
      maxLength: 100,
    }),
    localizedText("heroTitle", "Hero title"),
    localizedTextarea("heroSummary", "Hero summary", { maxLength: 1000 }),
    { name: "heroMedia", type: "upload", relationTo: "media" },
    {
      name: "primaryCTA",
      type: "group",
      fields: [
        localizedText("label", "Label", { maxLength: 80 }),
        { name: "path", type: "text", required: true, maxLength: 500 },
      ],
    },
    {
      name: "secondaryCTA",
      type: "group",
      fields: [
        localizedText("label", "Label", { maxLength: 80 }),
        { name: "path", type: "text", required: true, maxLength: 500 },
      ],
    },
    {
      name: "method",
      type: "array",
      localized: true,
      minRows: 3,
      maxRows: 3,
      fields: [
        { name: "label", type: "text", required: true, maxLength: 80 },
        {
          name: "description",
          type: "textarea",
          required: true,
          maxLength: 1000,
        },
      ],
    },
    {
      name: "selectedDirections",
      type: "relationship",
      relationTo: "directions",
      hasMany: true,
    },
    {
      name: "selectedServices",
      type: "relationship",
      relationTo: "services",
      hasMany: true,
    },
    {
      name: "selectedOffers",
      type: "relationship",
      relationTo: "offers",
      hasMany: true,
    },
    {
      name: "selectedCourses",
      type: "relationship",
      relationTo: "courses",
      hasMany: true,
    },
    {
      name: "selectedCollections",
      type: "relationship",
      relationTo: "fashion-collections",
      hasMany: true,
    },
    {
      name: "selectedPortfolio",
      type: "relationship",
      relationTo: "portfolio-cases",
      hasMany: true,
    },
    localizedTextarea("studioIntro", "Studio and method section"),
    localizedText("finalCTATitle", "Final CTA title"),
    localizedTextarea("finalCTASummary", "Final CTA summary", {
      maxLength: 1000,
    }),
  ],
  versions: draftVersions,
}
