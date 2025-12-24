/**
 * Navigation Configuration
 * 
 * Main site navigation items following the PURITY brand philosophy:
 * RESEARCH → REALISATION → TRANSFORMATION
 */
export const navItems = [
  { href: '/research', key: 'research' },
  { href: '/realisation', key: 'realisation' },
  { href: '/transformation', key: 'transformation' },
  { href: '/collections', key: 'collections' },
  { href: '/portfolio', key: 'portfolio' },
  { href: '/school', key: 'school' },
  { href: '/about', key: 'about' },
  { href: '/contact', key: 'contact' },
] as const;

/**
 * Service categories mapped to the PURITY methodology
 */
export const serviceCategories = {
  research: ['styling', 'consulting'], // Color, cut, wardrobe review
  realisation: ['shopping', 'atelier'], // Shopping service, custom garments
  transformation: ['events'], // Courses, retreats, photo meditation
} as const;

export type NavItem = (typeof navItems)[number];
export type ServiceCategoryKey = keyof typeof serviceCategories;
