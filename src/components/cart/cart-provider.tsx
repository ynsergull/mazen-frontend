"use client";

import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { ApiError, cartApi, getCartToken } from "@/lib/cart-client";
import type { Cart } from "@/types/api";

const EMPTY_CART: Cart = {
  token: null,
  items: [],
  item_count: 0,
  subtotal: 0,
  shipping_fee: 0,
  free_shipping_threshold: 0,
  total: 0,
};

interface CartContextValue {
  cart: Cart;
  loading: boolean;
  /** Son islem hatasi (422 mesaji vb.) */
  error: string | null;
  add: (productId: number, qty?: number) => Promise<boolean>;
  setQty: (productId: number, qty: number) => Promise<void>;
  remove: (productId: number) => Promise<void>;
  clear: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>(EMPTY_CART);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    // token yoksa API'ye gitmeden bos sepet; varsa sunucudan yukle
    const load = getCartToken() ? cartApi.get() : Promise.resolve(EMPTY_CART);
    load
      .then((loaded) => active && setCart(loaded))
      .catch(() => active && setCart(EMPTY_CART))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const run = useCallback(async (operation: () => Promise<Cart>): Promise<boolean> => {
    setError(null);
    try {
      setCart(await operation());
      return true;
    } catch (e) {
      setError(e instanceof ApiError ? e.firstMessage : "Sepet güncellenemedi");
      return false;
    }
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      loading,
      error,
      add: (productId, qty = 1) => run(() => cartApi.add(productId, qty)),
      setQty: async (productId, qty) => {
        await run(() => cartApi.setQty(productId, qty));
      },
      remove: async (productId) => {
        await run(() => cartApi.remove(productId));
      },
      clear: async () => {
        await run(() => cartApi.clear());
      },
    }),
    [cart, loading, error, run]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart, CartProvider icinde kullanilmali");
  return context;
}
