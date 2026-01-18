"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type CartItemType = "service" | "product";

export interface CartItem {
  id: string;
  type: CartItemType;
  name: string;
  slug: string;
  price: number;
  currency: "UAH" | "EUR";
  quantity: number;
  image?: string;
  // For services: optional booking metadata
  bookingDate?: string;
  bookingTime?: string;
}

interface CartState {
  items: CartItem[];
  currency: "UAH" | "EUR";
}

interface CartActions {
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setCurrency: (currency: "UAH" | "EUR") => void;
  getItemCount: () => number;
  getSubtotal: () => number;
}

type CartStore = CartState & CartActions;

const initialState: CartState = {
  items: [],
  currency: "UAH",
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      addItem: (item) => {
        const { items } = get();
        const existingIndex = items.findIndex((i) => i.id === item.id);

        if (existingIndex >= 0) {
          // Update quantity for existing item
          const updatedItems = [...items];
          updatedItems[existingIndex] = {
            ...updatedItems[existingIndex],
            quantity:
              updatedItems[existingIndex].quantity + (item.quantity || 1),
          };
          set({ items: updatedItems });
        } else {
          // Add new item
          set({
            items: [...items, { ...item, quantity: item.quantity || 1 }],
          });
        }
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateQuantity: (id, quantity) => {
        if (quantity < 1) {
          get().removeItem(id);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item,
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      setCurrency: (currency) => {
        set({ currency });
      },

      getItemCount: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0,
        );
      },
    }),
    {
      name: "purity-cart",
      storage: createJSONStorage(() =>
        typeof window !== "undefined"
          ? localStorage
          : {
              getItem: (_name: string) => null,
              setItem: (_name: string, _value: string) => {},
              removeItem: (_name: string) => {},
            },
      ),
      // Only persist items and currency
      partialize: (state) => ({
        items: state.items,
        currency: state.currency,
      }),
    },
  ),
);
