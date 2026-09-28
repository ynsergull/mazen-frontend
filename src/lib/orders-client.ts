import { apiFetch } from "@/lib/api-client";
import { getCartToken } from "@/lib/cart-client";
import type { CheckoutInput, CheckoutResponse, Order, OrderSummary, PaymentSession } from "@/types/api";

/** Misafir sepeti icin X-Cart-Token; uye sepetinde de zararsiz (sunucu uyeyi tercih eder). */
function cartHeaders(): Record<string, string> {
  const token = getCartToken();
  return token ? { "X-Cart-Token": token } : {};
}

export const checkoutApi = {
  place: (input: CheckoutInput) =>
    apiFetch<CheckoutResponse>("/checkout", { method: "POST", body: input, headers: cartHeaders() }),
};

export const ordersApi = {
  list: () => apiFetch<{ data: OrderSummary[] }>("/orders").then((r) => r.data),
  get: (publicId: string) => apiFetch<{ order: Order }>(`/orders/${publicId}`).then((r) => r.order),
  /** Odeme bekleyen siparis icin odeme formunu yeniden baslatir */
  pay: (publicId: string) => apiFetch<{ payment: PaymentSession }>(`/orders/${publicId}/pay`, { method: "POST" }).then((r) => r.payment),
};

/** Tarayicida guvenli UUID; eski tarayicilarda basit yedek */
export function newIdempotencyKey(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}
