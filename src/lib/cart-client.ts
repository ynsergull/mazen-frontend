import type { Cart, ValidationErrorBody } from "@/types/api";

const TOKEN_KEY = "mazen_cart_token";

export class ApiError extends Error {
  constructor(message: string, public status: number, public errors?: Record<string, string[]>) {
    super(message);
  }

  /** Ilk alan hatasini ya da genel mesaji dondurur (UI'da gostermek icin). */
  get firstMessage(): string {
    const first = this.errors ? Object.values(this.errors)[0]?.[0] : undefined;
    return first ?? this.message;
  }
}

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

/** Tarayicidan sepet API cagrisi; rewrite proxy sayesinde ayni origin (/api/v1). */
export async function cartRequest(path: string, init: RequestInit = {}): Promise<Cart> {
  const token = getCartToken();
  const res = await fetch(`/api/v1${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token ? { "X-Cart-Token": token } : {}),
      ...(init.headers ?? {}),
    },
  });

  const body = (await res.json().catch(() => ({}))) as { cart?: Cart } & Partial<ValidationErrorBody>;
  if (!res.ok) {
    throw new ApiError(body.message ?? "İşlem başarısız oldu", res.status, body.errors);
  }
  if (!body.cart) throw new ApiError("Beklenmeyen cevap", res.status);

  storeCartToken(body.cart.token);
  return body.cart;
}

export const cartApi = {
  get: () => cartRequest("/cart"),
  add: (productId: number, qty = 1) =>
    cartRequest("/cart/items", { method: "POST", body: JSON.stringify({ product_id: productId, qty }) }),
  setQty: (productId: number, qty: number) =>
    cartRequest(`/cart/items/${productId}`, { method: "PATCH", body: JSON.stringify({ qty }) }),
  remove: (productId: number) => cartRequest(`/cart/items/${productId}`, { method: "DELETE" }),
  clear: () => cartRequest("/cart", { method: "DELETE" }),
};
