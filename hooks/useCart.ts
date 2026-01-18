"use client";

import { useSyncExternalStore } from "react";
import { useCartStore, type CartItem } from "@/lib/store/cart";

// Subscribe function for hydration detection
const emptySubscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * Custom hook for cart operations with SSR hydration handling
 * Prevents hydration mismatches by only returning cart data after client-side hydration
 */
export function useCart() {
  const store = useCartStore();
  const isHydrated = useSyncExternalStore(
    emptySubscribe,
    getSnapshot,
    getServerSnapshot,
  );

  // Return empty values during SSR to prevent hydration mismatch
  if (!isHydrated) {
    return {
      items: [] as CartItem[],
      currency: "UAH" as const,
      itemCount: 0,
      subtotal: 0,
      isHydrated: false,
      addItem: store.addItem,
      removeItem: store.removeItem,
      updateQuantity: store.updateQuantity,
      clearCart: store.clearCart,
      setCurrency: store.setCurrency,
    };
  }

  return {
    items: store.items,
    currency: store.currency,
    itemCount: store.getItemCount(),
    subtotal: store.getSubtotal(),
    isHydrated: true,
    addItem: store.addItem,
    removeItem: store.removeItem,
    updateQuantity: store.updateQuantity,
    clearCart: store.clearCart,
    setCurrency: store.setCurrency,
  };
}
