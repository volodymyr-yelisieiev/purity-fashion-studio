import type { Block } from "payload";

export const EditorialHero: Block = {
  slug: "editorialHero",
  labels: {
    singular: "Editorial Hero",
    plural: "Editorial Heroes",
  },
  fields: [
    {
      name: "layout",
      type: "select",
      defaultValue: "full",
      options: [
        { label: "Full Screen", value: "full" },
        { label: "Split", value: "split" },
        { label: "Overlap", value: "overlap" },
      ],
      admin: { description: "Cinematic layout style" },
    },
    {
      name: "media",
      type: "upload",
      relationTo: "media",
      required: true,
      admin: { description: "Main background media" },
    },
    {
      name: "overlayMedia",
      type: "upload",
      relationTo: "media",
      admin: { description: "Optional foreground/floating cinematic layer" },
    },
    {
      name: "title",
      type: "text",
      localized: true,
      required: true,
      admin: { description: "Large editorial title" },
    },
    {
      name: "subtitle",
      type: "textarea",
      localized: true,
      admin: { description: "Optional smaller description or quote" },
    },
    {
      name: "theme",
      type: "select",
      defaultValue: "light",
      options: [
        { label: "Light", value: "light" },
        { label: "Dark", value: "dark" },
        { label: "Parchment", value: "parchment" },
      ],
      admin: { description: "Specific theme override for this block" },
    },
  ],
};
