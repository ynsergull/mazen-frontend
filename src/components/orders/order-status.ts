import type { OrderStatus } from "@/types/api";

/** Durum rozeti renkleri; etiket sunucudan (status_label) gelir. */
export function orderStatusClass(status: OrderStatus): string {
  switch (status) {
    case "paid":
    case "delivered":
      return "bg-emerald-100 text-emerald-800";
    case "preparing":
    case "shipped":
      return "bg-sky-100 text-sky-800";
    case "pending_payment":
      return "bg-amber-100 text-amber-900";
    case "cancelled":
      return "bg-red-100 text-red-800";
    case "refunded":
    default:
      return "bg-muted text-muted-foreground";
  }
}

export function formatDateTime(value: string | null): string {
  if (!value) return "—";
  return new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Istanbul" }).format(new Date(value));
}
