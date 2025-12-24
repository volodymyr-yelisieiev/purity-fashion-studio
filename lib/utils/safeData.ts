import type {
  Service,
  Portfolio,
  Lookbook,
  Course,
  Product,
} from "@/payload-types";

/**
 * Normalizes a Service document with default values
 */
export function normalizeService(service: Partial<Service>): Service {
  return {
    ...service,
    paymentEnabled: service.paymentEnabled ?? false,
    bookable: service.bookable ?? true,
    featured: service.featured ?? false,
    pricing: {
      uah: service.pricing?.uah ?? null,
      eur: service.pricing?.eur ?? null,
      priceNote: service.pricing?.priceNote ?? undefined,
    },
  } as Service;
}

/**
 * Normalizes an array of Service documents
 */
export function normalizeServices(
  services: Array<Partial<Service>>
): Service[] {
  return services.map(normalizeService);
}

/**
 * Normalizes a Portfolio document with default values
 */
export function normalizePortfolio(item: Partial<Portfolio>): Portfolio {
  return {
    ...item,
    paymentEnabled: item.paymentEnabled ?? false,
    bookable: item.bookable ?? false,
    featured: item.featured ?? false,
    pricing: {
      uah: item.pricing?.uah ?? null,
      eur: item.pricing?.eur ?? null,
      priceNote: item.pricing?.priceNote ?? undefined,
    },
  } as Portfolio;
}

/**
 * Normalizes an array of Portfolio documents
 */
export function normalizePortfolios(
  items: Array<Partial<Portfolio>>
): Portfolio[] {
  return items.map(normalizePortfolio);
}

/**
 * Normalizes a Lookbook document with default values
 */
export function normalizeLookbook(item: Partial<Lookbook>): Lookbook {
  return {
    ...item,
    paymentEnabled: item.paymentEnabled ?? false,
    bookable: item.bookable ?? false,
    featured: item.featured ?? false,
    pricing: {
      uah: item.pricing?.uah ?? null,
      eur: item.pricing?.eur ?? null,
      priceNote: item.pricing?.priceNote ?? undefined,
    },
  } as Lookbook;
}

/**
 * Normalizes an array of Lookbook documents
 */
export function normalizeLookbooks(
  items: Array<Partial<Lookbook>>
): Lookbook[] {
  return items.map(normalizeLookbook);
}

/**
 * Normalizes a Course document with default values
 */
export function normalizeCourse(item: Partial<Course>): Course {
  return {
    ...item,
    paymentEnabled: item.paymentEnabled ?? false,
    bookable: item.bookable ?? true,
    featured: item.featured ?? false,
    pricing: {
      uah: item.pricing?.uah ?? null,
      eur: item.pricing?.eur ?? null,
      earlyBirdAmount: item.pricing?.earlyBirdAmount ?? null,
      priceNote: item.pricing?.priceNote ?? undefined,
    },
  } as Course;
}

/**
 * Normalizes an array of Course documents
 */
export function normalizeCourses(items: Array<Partial<Course>>): Course[] {
  return items.map(normalizeCourse);
}

/**
 * Normalizes a Product document with default values
 */
export function normalizeProduct(item: Partial<Product>): Product {
  return {
    ...item,
    featured: item.featured ?? false,
    pricing: {
      uah: item.pricing?.uah ?? 0,
      eur: item.pricing?.eur ?? null,
      salePrice: item.pricing?.salePrice ?? null,
    },
  } as Product;
}

/**
 * Normalizes an array of Product documents
 */
export function normalizeProducts(items: Array<Partial<Product>>): Product[] {
  return items.map(normalizeProduct);
}
