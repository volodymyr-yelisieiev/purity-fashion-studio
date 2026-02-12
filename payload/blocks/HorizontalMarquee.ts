import type { Block } from "payload";

export const HorizontalMarquee: Block = {
  slug: "horizontalMarquee",
  labels: {
    singular: "Horizontal Marquee",
    plural: "Horizontal Marquees",
  },
  fields: [
    {
      name: "items",
      type: "array",
      minRows: 1,
      admin: { description: "Keywords or phrases to scroll" },
      fields: [
        {
          name: "text",
          type: "text",
          localized: true,
          required: true,
        },
      ],
    },
    {
      name: "speed",
      type: "select",
      defaultValue: "slow",
      options: [
        { label: "Slow", value: "slow" },
        { label: "Normal", value: "normal" },
        { label: "Fast", value: "fast" },
      ],
    },
    {
      name: "direction",
      type: "select",
      defaultValue: "left",
      options: [
        { label: "To Left", value: "left" },
        { label: "To Right", value: "right" },
      ],
    },
  ],
};
