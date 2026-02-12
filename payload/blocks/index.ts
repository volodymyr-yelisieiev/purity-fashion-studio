import type { Block } from "payload";
import { EditorialHero } from "./EditorialHero";
import { MediaGrid } from "./MediaGrid";
import { HorizontalMarquee } from "./HorizontalMarquee";
import { LiquidCinematicHero } from "./LiquidCinematicHero";
import { MethodologyTimeline } from "./MethodologyTimeline";

export const RichTextBlock: Block = {
  slug: "richText",
  labels: {
    singular: "Rich Text",
    plural: "Rich Text Blocks",
  },
  fields: [
    {
      name: "content",
      type: "richText",
      required: true,
      localized: true,
    },
  ],
};

export const layoutBlocks = [
  EditorialHero,
  MediaGrid,
  HorizontalMarquee,
  LiquidCinematicHero,
  MethodologyTimeline,
  RichTextBlock,
];

export {
  EditorialHero,
  MediaGrid,
  HorizontalMarquee,
  LiquidCinematicHero,
  MethodologyTimeline,
};
