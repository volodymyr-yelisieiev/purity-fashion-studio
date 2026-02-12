/**
 * Navigation Configuration
 *
 * Main site navigation items following the PURITY brand philosophy:
 * @RESEARCH → @IMAGINE → @CREATE
 */
import type { PhaseId } from "@/lib/brand";

export const navItems = [
  { href: "/research", key: "research" },
  { href: "/imagine", key: "imagine" },
  { href: "/create", key: "create" },
  { href: "/collections", key: "collections" },
  { href: "/portfolio", key: "portfolio" },
  { href: "/blog", key: "blog" },
  { href: "/school", key: "school" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
] as const;

/**
 * Service categories mapped to the PURITY methodology
 */
export const serviceCategories: Record<PhaseId, readonly string[]> = {
  research: ["styling", "consulting"], // Color, cut, wardrobe review
  imagine: ["shopping", "atelier"], // Shopping service, custom garments
  create: ["events"], // Courses, retreats, photo meditation
} as const;

export type NavItem = (typeof navItems)[number];
export type ServiceCategoryKey = keyof typeof serviceCategories;
