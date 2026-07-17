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

export const FashionCollections: CollectionConfig = {
  slug: "fashion-collections",
  admin: {
    group: "Content",
    useAsTitle: "title",
    defaultColumns: [
      "title",
      "slug",
      "collectionType",
      "availability",
      "enabled",
    ],
  },
  access: {
    create: contentManagers,
    delete: ownerOnly,
    read: publicRead,
    update: contentManagers,
  },
  hooks: publicCollectionHooks({
    collectionTag: "fashion-collections",
    pathPrefix: "/collections",
  }),
  fields: [
    ...commonPublicFields,
    localizedTextarea("narrative", "Narrative"),
    localizedTextarea("stylingNotes", "Styling notes", { required: false }),
    {
      name: "collectionType",
      type: "select",
      required: true,
      options: [
        "editorial",
        "commercial",
        "capsule",
        "collaboration",
        "seasonal",
      ],
    },
    localizedTextarea("collaborationCredits", "Collaboration credits", {
      required: false,
    }),
    {
      name: "materials",
      type: "array",
      localized: true,
      fields: [
        { name: "material", type: "text", required: true, maxLength: 160 },
      ],
    },
    {
      name: "pieces",
      type: "array",
      localized: true,
      fields: [
        { name: "name", type: "text", required: true, maxLength: 160 },
        { name: "description", type: "textarea", maxLength: 1000 },
      ],
    },
    { name: "season", type: "text", maxLength: 80 },
    { name: "year", type: "number", min: 2000, max: 2200 },
    {
      name: "gallery",
      type: "upload",
      relationTo: "media",
      hasMany: true,
      required: true,
    },
    {
      name: "videoURL",
      type: "text",
      maxLength: 500,
      admin: {
        description:
          "Approved privacy-aware video URL; poster remains required in Media.",
      },
    },
    {
      name: "availability",
      type: "select",
      required: true,
      defaultValue: "inquiry",
      options: ["available", "inquiry", "coming-soon", "sold-out", "archived"],
    },
    {
      name: "relatedOffers",
      type: "relationship",
      relationTo: "offers",
      hasMany: true,
    },
    {
      name: "relatedServices",
      type: "relationship",
      relationTo: "services",
      hasMany: true,
    },
    {
      name: "relatedCourse",
      type: "relationship",
      relationTo: "courses",
    },
    localizedText("rightsAndCredits", "Rights and image credits", {
      required: true,
    }),
    ctaField,
  ],
  versions: draftVersions,
  timestamps: true,
}
