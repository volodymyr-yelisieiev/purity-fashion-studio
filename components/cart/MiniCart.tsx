"use client";

import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  Button,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerDescription,
} from "@/components/ui";
import { CartItem } from "./CartItem";
import { CartSummary } from "./CartSummary";
import { useCart } from "@/hooks/useCart";
import { useTranslations } from "next-intl";

export function MiniCart() {
  const [open, setOpen] = useState(false);
  const { items, itemCount, isHydrated } = useCart();
  const t = useTranslations("cart");

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-transparent"
        >
          <ShoppingBag className="h-5 w-5" />
          {isHydrated && itemCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary text-primary-foreground text-xs flex items-center justify-center rounded-full">
              {itemCount > 99 ? "99+" : itemCount}
            </span>
          )}
          <span className="sr-only">Shopping cart</span>
        </Button>
      </DrawerTrigger>

      <DrawerContent className="flex flex-col" overlayClassName="">
        <DrawerHeader>
          <DrawerTitle>{t("title")}</DrawerTitle>
          <DrawerDescription className="sr-only">
            Shopping cart with your selected items
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex-1 overflow-auto py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">{t("empty")}</p>
              <Button asChild variant="outline">
                <Link href="/services" onClick={() => setOpen(false)}>
                  {t("browseServices")}
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-0">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div onClick={() => setOpen(false)}>
            <CartSummary />
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
}
