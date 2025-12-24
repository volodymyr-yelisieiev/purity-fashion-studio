"use client";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";

interface CartSummaryProps {
  showCheckoutButton?: boolean;
}

export function CartSummary({ showCheckoutButton = true }: CartSummaryProps) {
  const { subtotal, itemCount, currency, isHydrated } = useCart();

  if (!isHydrated) {
    return (
      <div className="space-y-3 animate-pulse">
        <div className="h-4 bg-background w-1/2" />
        <div className="h-6 bg-background w-2/3" />
      </div>
    );
  }

  if (itemCount === 0) {
    return null;
  }

  return (
    <div className="space-y-4 pt-4 border-t border-border">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">
          Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
        </span>
        <span className="font-medium">{formatPrice(subtotal, currency)}</span>
      </div>

      {showCheckoutButton && (
        <Button asChild className="w-full">
          <Link href="/checkout">Proceed to Checkout</Link>
        </Button>
      )}
    </div>
  );
}
