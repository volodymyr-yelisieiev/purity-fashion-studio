import type { Block } from "payload";

export const LiquidCinematicHero: Block = {
  slug: "liquidCinematicHero",
  labels: {
    singular: "Liquid Cinematic Hero",
    plural: "Liquid Cinematic Heroes",
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      localized: true,
      admin: { description: "Main editorial headline" },
    },
    {
      name: "subtitle",
      type: "textarea",
      localized: true,
      admin: { description: "Supporting narrative or quote" },
    },
    {
      name: "backgroundImage",
      type: "upload",
      relationTo: "media",
      required: true,
      admin: {
        description: "Deep background layer (often blurred or textured)",
      },
    },
    {
      name: "foregroundImage",
      type: "upload",
      relationTo: "media",
      required: true,
      admin: {
        description: "Subject/Focus layer (revealed with liquid effect)",
      },
    },
    {
      name: "revealIntensity",
      type: "select",
      defaultValue: "medium",
      options: [
        { label: "Subtle", value: "subtle" },
        { label: "Medium", value: "medium" },
        { label: "Bold", value: "bold" },
      ],
      admin: { description: "Intensity of the liquid displacement effect" },
    },
    {
      name: "cta",
      type: "group",
      fields: [
        { name: "label", type: "text", localized: true },
        { name: "link", type: "text" },
      ],
    },
  ],
};
