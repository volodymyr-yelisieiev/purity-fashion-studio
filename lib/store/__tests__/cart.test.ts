import { describe, it, expect, beforeEach } from "vitest";
import { useCartStore } from "../cart";

describe("useCartStore", () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    useCartStore.setState({ items: [], currency: "UAH" });
  });

  const sampleItem = {
    id: "svc-1",
    type: "service" as const,
    name: "Style Consultation",
    slug: "style-consultation",
    price: 1500,
    currency: "UAH" as const,
  };

  const anotherItem = {
    id: "prod-1",
    type: "product" as const,
    name: "Fashion Item",
    slug: "fashion-item",
    price: 800,
    currency: "UAH" as const,
  };

  describe("addItem", () => {
    it("adds a new item with quantity 1", () => {
      useCartStore.getState().addItem(sampleItem);
      const { items } = useCartStore.getState();
      expect(items).toHaveLength(1);
      expect(items[0].id).toBe("svc-1");
      expect(items[0].quantity).toBe(1);
    });

    it("adds a new item with custom quantity", () => {
      useCartStore.getState().addItem({ ...sampleItem, quantity: 3 });
      const { items } = useCartStore.getState();
      expect(items[0].quantity).toBe(3);
    });

    it("increments quantity for existing item", () => {
      useCartStore.getState().addItem(sampleItem);
      useCartStore.getState().addItem(sampleItem);
      const { items } = useCartStore.getState();
      expect(items).toHaveLength(1);
      expect(items[0].quantity).toBe(2);
    });

    it("increments by custom quantity for existing item", () => {
      useCartStore.getState().addItem(sampleItem);
      useCartStore.getState().addItem({ ...sampleItem, quantity: 5 });
      const { items } = useCartStore.getState();
      expect(items[0].quantity).toBe(6);
    });
  });

  describe("removeItem", () => {
    it("removes an item by id", () => {
      useCartStore.getState().addItem(sampleItem);
      useCartStore.getState().addItem(anotherItem);
      useCartStore.getState().removeItem("svc-1");
      const { items } = useCartStore.getState();
      expect(items).toHaveLength(1);
      expect(items[0].id).toBe("prod-1");
    });

    it("does nothing if item not found", () => {
      useCartStore.getState().addItem(sampleItem);
      useCartStore.getState().removeItem("nonexistent");
      expect(useCartStore.getState().items).toHaveLength(1);
    });
  });

  describe("updateQuantity", () => {
    it("updates quantity for existing item", () => {
      useCartStore.getState().addItem(sampleItem);
      useCartStore.getState().updateQuantity("svc-1", 5);
      expect(useCartStore.getState().items[0].quantity).toBe(5);
    });

    it("removes item when quantity is set to 0", () => {
      useCartStore.getState().addItem(sampleItem);
      useCartStore.getState().updateQuantity("svc-1", 0);
      expect(useCartStore.getState().items).toHaveLength(0);
    });

    it("removes item when quantity is negative", () => {
      useCartStore.getState().addItem(sampleItem);
      useCartStore.getState().updateQuantity("svc-1", -1);
      expect(useCartStore.getState().items).toHaveLength(0);
    });
  });

  describe("clearCart", () => {
    it("removes all items", () => {
      useCartStore.getState().addItem(sampleItem);
      useCartStore.getState().addItem(anotherItem);
      useCartStore.getState().clearCart();
      expect(useCartStore.getState().items).toHaveLength(0);
    });
  });

  describe("setCurrency", () => {
    it("changes currency to EUR", () => {
      useCartStore.getState().setCurrency("EUR");
      expect(useCartStore.getState().currency).toBe("EUR");
    });

    it("changes currency to UAH", () => {
      useCartStore.getState().setCurrency("EUR");
      useCartStore.getState().setCurrency("UAH");
      expect(useCartStore.getState().currency).toBe("UAH");
    });
  });

  describe("getItemCount", () => {
    it("returns 0 for empty cart", () => {
      expect(useCartStore.getState().getItemCount()).toBe(0);
    });

    it("returns total quantity across items", () => {
      useCartStore.getState().addItem(sampleItem);
      useCartStore.getState().addItem({ ...sampleItem, quantity: 2 });
      useCartStore.getState().addItem(anotherItem);
      expect(useCartStore.getState().getItemCount()).toBe(4); // 3 + 1
    });
  });

  describe("getSubtotal", () => {
    it("returns 0 for empty cart", () => {
      expect(useCartStore.getState().getSubtotal()).toBe(0);
    });

    it("calculates correct subtotal", () => {
      useCartStore.getState().addItem(sampleItem); // 1500 * 1
      useCartStore.getState().addItem(anotherItem); // 800 * 1
      expect(useCartStore.getState().getSubtotal()).toBe(2300);
    });

    it("accounts for quantity in subtotal", () => {
      useCartStore.getState().addItem(sampleItem);
      useCartStore.getState().updateQuantity("svc-1", 3);
      expect(useCartStore.getState().getSubtotal()).toBe(4500); // 1500 * 3
    });
  });
});
