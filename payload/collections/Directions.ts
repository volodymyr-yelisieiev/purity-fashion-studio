import type { CollectionConfig } from "payload"

import { contentManagers, ownerOnly } from "../access"
import {
  commonPublicFields,
  draftVersions,
  localizedText,
  localizedTextarea,
  publicRead,
  stepsField,
} from "../fields/shared"
import { publicCollectionHooks } from "../hooks/revalidation"

export const Directions: CollectionConfig = {
  slug: "directions",
  admin: {
    group: "Content",
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "canonicalKey", "enabled", "updatedAt"],
  },
  access: {
    create: contentManagers,
    delete: ownerOnly,
    read: publicRead,
    update: contentManagers,
  },
  hooks: publicCollectionHooks({
    collectionTag: "directions",
    pathPrefix: "",
    revalidateNavigation: true,
  }),
  fields: [
    ...commonPublicFields,
    {
      name: "canonicalKey",
      type: "select",
      required: true,
      unique: true,
      index: true,
      options: [
        "research",
        "realisation",
        "transformation",
        "corporate",
        "school",
        "collections",
      ],
    },
    localizedText("eyebrow", "Eyebrow", { required: false, maxLength: 100 }),
    localizedTextarea("narrative", "Narrative"),
    {
      name: "heroMedia",
      type: "upload",
      relationTo: "media",
    },
    stepsField,
    {
      name: "outcomes",
      type: "array",
      localized: true,
      fields: [{ name: "text", type: "text", required: true, maxLength: 240 }],
    },
    {
      name: "relatedServices",
      type: "relationship",
      relationTo: "services",
      hasMany: true,
    },
    {
      name: "relatedCourses",
      type: "relationship",
      relationTo: "courses",
      hasMany: true,
    },
    {
      name: "relatedCollections",
      type: "relationship",
      relationTo: "fashion-collections",
      hasMany: true,
    },
    {
      name: "navigationVisible",
      type: "checkbox",
      required: true,
      defaultValue: true,
    },
  ],
  versions: draftVersions,
  timestamps: true,
}
