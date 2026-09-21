"use client";

import { Check, Minus, Plus, ShoppingCart } from "lucide-react";
import { useState } from "react";

import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";

export function AddToCartButton({ productId, inStock, maxQty, compact = false }: {
  productId: number;
  inStock: boolean;
  maxQty: number;
  /** Mobil sabit bardaki dar yerlesim: adet secici gizlenir, adet 1 olarak eklenir. */
  compact?: boolean;
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
      <Button size="lg" className={compact ? "h-11 w-full" : "h-12 w-full px-6 md:w-auto"} disabled>
        <ShoppingCart className="size-4" /> Stokta yok
      </Button>
    );
  }

  const addButton = (
    <Button
      size="lg"
      className={compact ? "h-11 w-full px-4 text-[12px]" : "h-12 min-w-48 px-6 text-[13px]"}
      onClick={onAdd}
      disabled={busy}
    >
      {added ? (
        <>
          <Check className="size-4" /> Sepete eklendi
        </>
      ) : (
        <>
          <ShoppingCart className="size-4" /> Sepete ekle
        </>
      )}
    </Button>
  );

  if (compact) {
    return (
      <div className="w-full">
        {addButton}
        {error && (
          <p className="mt-1 text-[11px] text-destructive" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center rounded-md border bg-white">
          <Button
            variant="ghost"
            size="icon"
            className="size-11"
            aria-label="Adedi azalt"
            disabled={qty <= 1}
            onClick={() => setQty((q) => q - 1)}
          >
            <Minus className="size-4" />
          </Button>
          <span className="w-10 text-center text-sm font-medium tabular-nums" aria-live="polite">
            {qty}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="size-11"
            aria-label="Adedi artır"
            disabled={qty >= maxQty}
            onClick={() => setQty((q) => q + 1)}
          >
            <Plus className="size-4" />
          </Button>
        </div>
        {addButton}
      </div>
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
