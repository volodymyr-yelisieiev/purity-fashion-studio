import type { Block } from "payload";
import { METHODOLOGY_PHASES } from "@/lib/brand";

export const MethodologyTimeline: Block = {
  slug: "methodologyTimeline",
  labels: {
    singular: "Methodology Timeline",
    plural: "Methodology Timelines",
  },
  fields: [
    {
      name: "title",
      type: "text",
      localized: true,
      required: true,
      admin: { description: "Section heading (e.g., 'The Adventure Path')" },
    },
    {
      name: "steps",
      type: "array",
      required: true,
      minRows: 3,
      maxRows: 3,
      localized: true,
      admin: { description: METHODOLOGY_PHASES.map((p) => p.tag).join(", ") },
      fields: [
        {
          name: "stage",
          type: "select",
          options: METHODOLOGY_PHASES.map((p) => ({
            label: `${p.number} ${p.tag.replace("@", "")}`,
            value: p.id,
          })),
          required: true,
        },
        {
          name: "title",
          type: "text",
          required: true,
        },
        {
          name: "description",
          type: "textarea",
          required: true,
        },
        {
          name: "media",
          type: "upload",
          relationTo: "media",
          required: true,
        },
      ],
    },
  ],
};
