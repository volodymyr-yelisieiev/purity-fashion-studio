/**
 * Brand Glossary — Canonical Constants for PURITY Fashion Studio
 *
 * Single source of truth for the three methodology phases:
 *   @RESEARCH → @IMAGINE → @CREATE
 *
 * Every layer (Payload schemas, navigation, seed data, i18n, components)
 * MUST import phase identifiers from this module instead of hardcoding strings.
 */

export const METHODOLOGY_PHASES = [
  { id: "research", number: "01", label: "@Research", tag: "@RESEARCH" },
  { id: "imagine", number: "02", label: "@Imagine", tag: "@IMAGINE" },
  { id: "create", number: "03", label: "@Create", tag: "@CREATE" },
] as const;

/** Union of canonical phase IDs */
export type PhaseId = (typeof METHODOLOGY_PHASES)[number]["id"];

/** A single methodology phase entry */
export type MethodologyPhase = (typeof METHODOLOGY_PHASES)[number];

/** Look up a phase by its canonical ID */
export function getPhaseById(id: string): MethodologyPhase | undefined {
  return METHODOLOGY_PHASES.find((p) => p.id === id);
}

/** Look up a phase by its two-digit number string */
export function getPhaseByNumber(num: string): MethodologyPhase | undefined {
  return METHODOLOGY_PHASES.find((p) => p.number === num);
}

/** All phase IDs as an array — useful for Payload select options, iteration, etc. */
export const PHASE_IDS = METHODOLOGY_PHASES.map((p) => p.id);

/** Brand name constant */
export const BRAND_NAME = "PURITY" as const;

/** Full studio name */
export const STUDIO_NAME = "PURITY Fashion Studio" as const;
