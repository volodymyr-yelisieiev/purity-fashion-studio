import { describe, it, expect } from "vitest";
import { checkoutSchema } from "../checkoutSchema";

describe("checkoutSchema", () => {
  const validData = {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "+380501234567",
    paymentMethod: "stripe" as const,
  };

  it("accepts valid checkout data", () => {
    const result = checkoutSchema.parse(validData);
    expect(result.firstName).toBe("John");
    expect(result.lastName).toBe("Doe");
    expect(result.email).toBe("john@example.com");
    expect(result.paymentMethod).toBe("stripe");
  });

  it("accepts valid data with optional fields", () => {
    const result = checkoutSchema.parse({
      ...validData,
      address: "123 Main St",
      city: "Kyiv",
      postalCode: "01001",
      notes: "Deliver after 5pm",
    });
    expect(result.address).toBe("123 Main St");
    expect(result.notes).toBe("Deliver after 5pm");
  });

  it("defaults country to Ukraine", () => {
    const result = checkoutSchema.parse(validData);
    expect(result.country).toBe("Ukraine");
  });

  it("accepts liqpay as payment method", () => {
    const result = checkoutSchema.parse({
      ...validData,
      paymentMethod: "liqpay",
    });
    expect(result.paymentMethod).toBe("liqpay");
  });

  it("rejects missing firstName", () => {
    const { firstName: _, ...data } = validData;
    expect(() => checkoutSchema.parse(data)).toThrow();
  });

  it("rejects missing lastName", () => {
    const { lastName: _, ...data } = validData;
    expect(() => checkoutSchema.parse(data)).toThrow();
  });

  it("rejects missing email", () => {
    const { email: _, ...data } = validData;
    expect(() => checkoutSchema.parse(data)).toThrow();
  });

  it("rejects invalid email format", () => {
    expect(() =>
      checkoutSchema.parse({ ...validData, email: "not-an-email" }),
    ).toThrow();
  });

  it("rejects short phone number", () => {
    expect(() =>
      checkoutSchema.parse({ ...validData, phone: "123" }),
    ).toThrow();
  });

  it("rejects invalid payment method", () => {
    expect(() =>
      checkoutSchema.parse({ ...validData, paymentMethod: "bitcoin" }),
    ).toThrow();
  });

  it("rejects missing payment method", () => {
    const { paymentMethod: _, ...data } = validData;
    expect(() => checkoutSchema.parse(data)).toThrow();
  });

  it("rejects firstName too short", () => {
    expect(() =>
      checkoutSchema.parse({ ...validData, firstName: "J" }),
    ).toThrow();
  });
});
