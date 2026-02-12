import { describe, it, expect } from "vitest";
import {
  normalizeService,
  normalizeServices,
  normalizePortfolio,
  normalizePortfolios,
  normalizeLookbook,
  normalizeLookbooks,
  normalizeCourse,
  normalizeCourses,
  normalizeProduct,
  normalizeProducts,
} from "../safeData";

describe("normalizeService", () => {
  it("applies default values for missing fields", () => {
    const result = normalizeService({ id: 1 } as any);
    expect(result.paymentEnabled).toBe(false);
    expect(result.bookable).toBe(true);
    expect(result.featured).toBe(false);
    expect(result.pricing!.uah).toBeNull();
    expect(result.pricing!.eur).toBeNull();
  });

  it("preserves existing values", () => {
    const result = normalizeService({
      id: 1,
      paymentEnabled: true,
      bookable: false,
      featured: true,
      pricing: { uah: 1000, eur: 50, priceNote: "per session" },
    } as any);
    expect(result.paymentEnabled).toBe(true);
    expect(result.bookable).toBe(false);
    expect(result.featured).toBe(true);
    expect(result.pricing!.uah).toBe(1000);
    expect(result.pricing!.eur).toBe(50);
    expect(result.pricing!.priceNote).toBe("per session");
  });

  it("handles empty pricing object", () => {
    const result = normalizeService({ id: 1, pricing: {} } as any);
    expect(result.pricing!.uah).toBeNull();
    expect(result.pricing!.eur).toBeNull();
  });
});

describe("normalizeServices", () => {
  it("normalizes an array of services", () => {
    const result = normalizeServices([{ id: 1 }, { id: 2 }] as any[]);
    expect(result).toHaveLength(2);
    expect(result[0].paymentEnabled).toBe(false);
    expect(result[1].paymentEnabled).toBe(false);
  });

  it("handles empty array", () => {
    expect(normalizeServices([])).toEqual([]);
  });
});

describe("normalizePortfolio", () => {
  it("applies default values", () => {
    const result = normalizePortfolio({ id: 1 } as any);
    expect(result.paymentEnabled).toBe(false);
    expect(result.bookable).toBe(false);
    expect(result.featured).toBe(false);
  });

  it("preserves existing values", () => {
    const result = normalizePortfolio({
      id: 1,
      featured: true,
    } as any);
    expect(result.featured).toBe(true);
  });
});

describe("normalizePortfolios", () => {
  it("normalizes an array", () => {
    const result = normalizePortfolios([{ id: 1 }] as any[]);
    expect(result).toHaveLength(1);
    expect(result[0].bookable).toBe(false);
  });
});

describe("normalizeLookbook", () => {
  it("applies default values", () => {
    const result = normalizeLookbook({ id: 1 } as any);
    expect(result.paymentEnabled).toBe(false);
    expect(result.bookable).toBe(false);
    expect(result.featured).toBe(false);
  });
});

describe("normalizeLookbooks", () => {
  it("normalizes an array", () => {
    const result = normalizeLookbooks([{ id: 1 }, { id: 2 }] as any[]);
    expect(result).toHaveLength(2);
  });
});

describe("normalizeCourse", () => {
  it("applies default values including salePrice", () => {
    const result = normalizeCourse({ id: 1 } as any);
    expect(result.paymentEnabled).toBe(false);
    expect(result.bookable).toBe(true);
    expect(result.featured).toBe(false);
    expect(result.pricing!.salePrice).toBeNull();
  });

  it("preserves salePrice when set", () => {
    const result = normalizeCourse({
      id: 1,
      pricing: { salePrice: 500 },
    } as any);
    expect(result.pricing!.salePrice).toBe(500);
  });
});

describe("normalizeCourses", () => {
  it("normalizes an array", () => {
    const result = normalizeCourses([{ id: 1 }] as any[]);
    expect(result).toHaveLength(1);
    expect(result[0].bookable).toBe(true);
  });
});

describe("normalizeProduct", () => {
  it("applies default values including salePrice", () => {
    const result = normalizeProduct({ id: 1 } as any);
    expect(result.featured).toBe(false);
    expect(result.pricing.uah).toBe(0);
    expect(result.pricing.eur).toBeNull();
    expect(result.pricing.salePrice).toBeNull();
  });

  it("preserves existing salePrice", () => {
    const result = normalizeProduct({
      id: 1,
      pricing: { uah: 1000, salePrice: 800 },
    } as any);
    expect(result.pricing.uah).toBe(1000);
    expect(result.pricing.salePrice).toBe(800);
  });
});

describe("normalizeProducts", () => {
  it("normalizes an array", () => {
    const result = normalizeProducts([{ id: 1 }, { id: 2 }] as any[]);
    expect(result).toHaveLength(2);
    expect(result[0].pricing!.salePrice).toBeNull();
  });
});
