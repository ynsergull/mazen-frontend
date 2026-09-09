"use client";

import { Check, Minus, Plus, ShoppingCart } from "lucide-react";
import { useState } from "react";

import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";

export function AddToCartButton({ productId, inStock, maxQty }: {
  productId: number;
  inStock: boolean;
  maxQty: number;
}) {
  const { add, error } = useCart();
  const [qty, setQty] = useState(1);
  const [busy, setBusy] = useState(false);
  const [added, setAdded] = useState(false);

  async function onAdd() {
    setBusy(true);
    const ok = await add(productId, qty);
    setBusy(false);
    if (ok) {
      setAdded(true);
      setTimeout(() => setAdded(false), 1800);
    }
  }

  if (!inStock || maxQty < 1) {
    return (
      <Button size="lg" className="w-full md:w-auto" disabled>
        <ShoppingCart className="size-4" /> Stokta yok
      </Button>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center rounded-lg border">
          <Button variant="ghost" size="icon" aria-label="Azalt" disabled={qty <= 1} onClick={() => setQty((q) => q - 1)}>
            <Minus className="size-4" />
          </Button>
          <span className="w-10 text-center text-sm font-medium tabular-nums" aria-live="polite">{qty}</span>
          <Button variant="ghost" size="icon" aria-label="Artır" disabled={qty >= maxQty} onClick={() => setQty((q) => q + 1)}>
            <Plus className="size-4" />
          </Button>
        </div>
        <Button size="lg" className="min-w-44" onClick={onAdd} disabled={busy}>
          {added ? <><Check className="size-4" /> Sepete eklendi</> : <><ShoppingCart className="size-4" /> Sepete ekle</>}
        </Button>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
