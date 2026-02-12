import React from "react";
import type { Service } from "@/payload-types";
import { EditorialHero } from "../blocks/EditorialHero";
import { MediaGrid } from "../blocks/MediaGrid";
import { HorizontalMarquee } from "../blocks/HorizontalMarquee";
import { RichTextBlock } from "../blocks/RichText";
import { LiquidCinematicHero } from "../blocks/LiquidCinematicHero";
import { MethodologyTimeline } from "../blocks/MethodologyTimeline";

/** Discriminated union of all layout block types from Payload's generated types */
type LayoutBlock = NonNullable<Service["layout"]>[number];

/** Map of block type slugs to their React components */
const blockComponents: Record<string, React.ComponentType<any>> = {
  editorialHero: EditorialHero,
  mediaGrid: MediaGrid,
  horizontalMarquee: HorizontalMarquee,
  liquidCinematicHero: LiquidCinematicHero,
  methodologyTimeline: MethodologyTimeline,
  richText: RichTextBlock,
};

interface BlockRendererProps {
  blocks?: LayoutBlock[];
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({ blocks }) => {
  if (!blocks || blocks.length === 0) return null;

  return (
    <>
      {blocks.map((block, index) => {
        const { blockType, ...props } = block;
        const Component = blockComponents[blockType];

        if (!Component) {
          console.warn(`Unknown block type: ${blockType}`);
          return null;
        }

        return <Component key={index} {...props} />;
      })}
    </>
  );
};
