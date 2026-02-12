/**
 * Type-safe block builder factories.
 * Each function returns a strongly-typed layout block — no `as any` needed.
 */
import type { LayoutBlock, MediaMap } from "./types";
import type { PhaseId } from "../../lib/brand";

/* ── Helper to resolve media id from map ─────────────── */
function m(map: MediaMap, key: string): number {
  const id = map[key];
  if (id == null)
    throw new Error(`block-builders: media key "${key}" not found in map`);
  return id;
}

/* ── Editorial Hero ──────────────────────────────────── */
export function editorialHero(
  map: MediaMap,
  opts: {
    title: string;
    subtitle?: string;
    media: string; // key in MediaMap
    theme?: "light" | "dark" | "parchment";
    layout?: "full" | "split" | "overlap";
  },
): LayoutBlock {
  return {
    blockType: "editorialHero",
    title: opts.title,
    subtitle: opts.subtitle ?? null,
    media: m(map, opts.media),
    theme: opts.theme ?? null,
    layout: opts.layout ?? null,
  };
}

/* ── Liquid Cinematic Hero ───────────────────────────── */
export function liquidCinematicHero(
  map: MediaMap,
  opts: {
    title: string;
    subtitle?: string;
    backgroundImage: string;
    foregroundImage: string;
    revealIntensity?: "subtle" | "medium" | "bold";
  },
): LayoutBlock {
  return {
    blockType: "liquidCinematicHero",
    title: opts.title,
    subtitle: opts.subtitle ?? null,
    backgroundImage: m(map, opts.backgroundImage),
    foregroundImage: m(map, opts.foregroundImage),
    revealIntensity: opts.revealIntensity ?? "medium",
  };
}

/* ── Methodology Timeline ────────────────────────────── */
export function methodologyTimeline(
  map: MediaMap,
  opts: {
    title: string;
    steps: {
      stage: PhaseId;
      title: string;
      description: string;
      media: string;
    }[];
  },
): LayoutBlock {
  return {
    blockType: "methodologyTimeline",
    title: opts.title,
    steps: opts.steps.map((s) => ({
      stage: s.stage,
      title: s.title,
      description: s.description,
      media: m(map, s.media),
    })),
  };
}

/* ── Media Grid ──────────────────────────────────────── */
export function mediaGrid(
  map: MediaMap,
  opts: {
    title?: string;
    columns?: "2" | "3" | "4" | "masonry";
    items: {
      media: string;
      caption?: string;
      aspectRatio?: "portrait" | "square" | "landscape";
    }[];
  },
): LayoutBlock {
  return {
    blockType: "mediaGrid",
    title: opts.title ?? null,
    columns: opts.columns ?? null,
    items: opts.items.map((i) => ({
      media: m(map, i.media),
      caption: i.caption ?? null,
      aspectRatio: i.aspectRatio ?? null,
    })),
  };
}

/* ── Horizontal Marquee ──────────────────────────────── */
export function horizontalMarquee(opts: {
  items: string[];
  speed?: "slow" | "normal" | "fast";
  direction?: "left" | "right";
}): LayoutBlock {
  return {
    blockType: "horizontalMarquee",
    items: opts.items.map((text) => ({ text })),
    speed: opts.speed ?? null,
    direction: opts.direction ?? null,
  };
}
