import type { Block } from "payload";

export const MediaGrid: Block = {
  slug: "mediaGrid",
  labels: {
    singular: "Media Grid",
    plural: "Media Grids",
  },
  fields: [
    {
      name: "title",
      type: "text",
      localized: true,
      admin: { description: "Optional grid title" },
    },
    {
      name: "columns",
      type: "select",
      defaultValue: "3",
      options: [
        { label: "2 Columns", value: "2" },
        { label: "3 Columns", value: "3" },
        { label: "4 Columns", value: "4" },
        { label: "Masonry", value: "masonry" },
      ],
    },
    {
      name: "items",
      type: "array",
      minRows: 1,
      fields: [
        {
          name: "media",
          type: "upload",
          relationTo: "media",
          required: true,
        },
        {
          name: "caption",
          type: "text",
          localized: true,
        },
        {
          name: "aspectRatio",
          type: "select",
          defaultValue: "portrait",
          options: [
            { label: "Portrait (3:4)", value: "portrait" },
            { label: "Square (1:1)", value: "square" },
            { label: "Landscape (16:9)", value: "landscape" },
          ],
        },
      ],
    },
  ],
};
