import type { Access, CollectionConfig, Where } from "payload"

import { contentManagers, hasRole, ownerOnly } from "../access"
import {
  commonPublicFields,
  draftVersions,
  localizedTextarea,
} from "../fields/shared"
import { publicCollectionHooks } from "../hooks/revalidation"

const revalidationHooks = publicCollectionHooks({
  collectionTag: "portfolio-cases",
  pathPrefix: "/portfolio",
})

const approvedPortfolioRead: Access = ({ req }) => {
  if (hasRole(req.user, ["owner", "editor", "developer"])) return true

  const filter: Where = {
    and: [
      { _status: { equals: "published" } },
      { enabled: { equals: true } },
      { isRealClientProof: { equals: true } },
      { usageRightsStatus: { equals: "approved" } },
      { approvalStatus: { equals: "approved" } },
    ],
  }

  return filter
}

export const PortfolioCases: CollectionConfig = {
  slug: "portfolio-cases",
  admin: {
    group: "Content",
    useAsTitle: "title",
    defaultColumns: [
      "title",
      "slug",
      "clientType",
      "isRealClientProof",
      "usageRightsStatus",
      "approvalStatus",
    ],
  },
  access: {
    create: contentManagers,
    delete: ownerOnly,
    read: approvedPortfolioRead,
    update: contentManagers,
  },
  hooks: {
    ...revalidationHooks,
    beforeValidate: [
      ({ data }) => {
        if (!data) return data

        if (data.approvalStatus === "approved") {
          if (!data.isRealClientProof) {
            throw new Error(
              "Approved portfolio must be real client/editorial proof."
            )
          }
          if (data.usageRightsStatus !== "approved") {
            throw new Error(
              "Approved portfolio requires approved usage rights."
            )
          }
        }

        return data
      },
    ],
  },
  fields: [
    ...commonPublicFields,
    {
      name: "clientType",
      type: "select",
      required: true,
      options: ["private", "corporate", "editorial", "collaboration"],
    },
    localizedTextarea("brief", "Brief"),
    localizedTextarea("constraints", "Constraints"),
    localizedTextarea("research", "Research"),
    localizedTextarea("process", "Process"),
    localizedTextarea("result", "Result"),
    {
      name: "services",
      type: "relationship",
      relationTo: "services",
      hasMany: true,
      required: true,
    },
    {
      name: "media",
      type: "upload",
      relationTo: "media",
      hasMany: true,
      required: true,
    },
    {
      name: "hasBeforeAfter",
      type: "checkbox",
      required: true,
      defaultValue: false,
    },
    {
      name: "consentReference",
      type: "text",
      required: true,
      maxLength: 240,
      admin: {
        description: "Internal consent/release reference; never public.",
      },
      access: {
        read: ({ req }) => hasRole(req.user, ["owner", "editor", "developer"]),
      },
    },
    {
      name: "isRealClientProof",
      type: "checkbox",
      required: true,
      defaultValue: false,
    },
    {
      name: "usageRightsStatus",
      type: "select",
      required: true,
      defaultValue: "pending",
      options: ["pending", "approved", "restricted", "expired"],
    },
    {
      name: "approvalStatus",
      type: "select",
      required: true,
      defaultValue: "pending",
      options: ["pending", "approved", "rejected", "revoked"],
    },
  ],
  versions: draftVersions,
  timestamps: true,
}
