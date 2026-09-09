import type { Metadata } from "next";

import { CartView } from "@/components/cart/cart-view";

export const metadata: Metadata = { title: "Sepetim" };

export default function CartPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Sepetim</h1>
      <CartView />
    </div>
  );
}
