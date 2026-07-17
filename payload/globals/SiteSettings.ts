import type { GlobalConfig } from "payload"

import { hasRole } from "../access"
import { localizedText } from "../fields/shared"
import { revalidateGlobal } from "../hooks/revalidation"

const ownerOrEditor = ({ req }: { req: { user?: unknown } }) =>
  hasRole(req.user, ["owner", "editor"])

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  admin: { group: "Site" },
  access: { read: () => true, update: ownerOrEditor },
  hooks: { afterChange: [revalidateGlobal("site-settings")] },
  fields: [
    {
      name: "brandName",
      type: "text",
      required: true,
      defaultValue: "PURITY Fashion Studio",
    },
    { name: "canonicalOrigin", type: "text", required: true, maxLength: 500 },
    { name: "defaultSocialImage", type: "upload", relationTo: "media" },
    {
      name: "contacts",
      type: "group",
      fields: [
        { name: "email", type: "email", required: true },
        { name: "phone", type: "text", required: true, maxLength: 80 },
        localizedText("address", "Address"),
        localizedText("hours", "Hours"),
      ],
    },
    {
      name: "localeLabels",
      type: "group",
      fields: [
        {
          name: "uk",
          type: "text",
          required: true,
          defaultValue: "Українська",
        },
        { name: "ru", type: "text", required: true, defaultValue: "Русский" },
        { name: "en", type: "text", required: true, defaultValue: "English" },
      ],
    },
    { name: "ga4MeasurementID", type: "text", maxLength: 80 },
    {
      name: "map",
      type: "group",
      fields: [
        {
          name: "provider",
          type: "select",
          options: ["none", "google", "openstreetmap"],
        },
        { name: "latitude", type: "number", min: -90, max: 90 },
        { name: "longitude", type: "number", min: -180, max: 180 },
      ],
    },
    {
      name: "maintenance",
      type: "group",
      fields: [
        {
          name: "enabled",
          type: "checkbox",
          required: true,
          defaultValue: false,
        },
        localizedText("message", "Maintenance message", { required: false }),
      ],
    },
  ],
}
