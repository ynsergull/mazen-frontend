"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";

export function CartBadge() {
  const { cart } = useCart();

  return (
    <Button variant="ghost" size="icon" className="relative" aria-label={`Sepet, ${cart.item_count} ürün`} render={<Link href="/sepet" />}>
      <ShoppingCart className="size-5" />
      {cart.item_count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex size-4.5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
          {cart.item_count > 99 ? "99+" : cart.item_count}
        </span>
      )}
    </Button>
  );
}
