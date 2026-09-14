import { ApiError, apiFetch } from "@/lib/api-client";
import type { Cart } from "@/types/api";

export { ApiError };

const TOKEN_KEY = "mazen_cart_token";

export function getCartToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function storeCartToken(token: string | null) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // depolama kapali (gizli pencere vb.) — sepet bu sekmede yasar
  }
}

/** Sepet istegi: misafir token'i basligina eklenir, cevaptaki token saklanir. */
async function cartRequest(path: string, init: Parameters<typeof apiFetch>[1] = {}): Promise<Cart> {
  const token = getCartToken();
  const { cart } = await apiFetch<{ cart: Cart }>(path, {
    ...init,
    headers: { ...(token ? { "X-Cart-Token": token } : {}), ...init.headers },
  });
  storeCartToken(cart.token);
  return cart;
}

export const cartApi = {
  get: () => cartRequest("/cart"),
  add: (productId: number, qty = 1) => cartRequest("/cart/items", { method: "POST", body: { product_id: productId, qty } }),
  setQty: (productId: number, qty: number) => cartRequest(`/cart/items/${productId}`, { method: "PATCH", body: { qty } }),
  remove: (productId: number) => cartRequest(`/cart/items/${productId}`, { method: "DELETE" }),
  clear: () => cartRequest("/cart", { method: "DELETE" }),
};
