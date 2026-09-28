import type { Metadata } from "next";

import { CartView } from "@/components/cart/cart-view";
import { PageHeading } from "@/components/site/page-heading";
import { getStoreInfo } from "@/lib/api";

import styles from "@/components/site/storefront.module.css";

export const metadata: Metadata = { title: "Sepetim" };

export default async function CartPage() {
  // Odeme acik mi bilgisi sunucudan (ISR, 1 saat); acilinca "Odemeye gec" /odeme'ye gider
  const store = await getStoreInfo();

  return (
    <div className={`${styles.container} ${styles.page}`}>
      <PageHeading eyebrow="Alışverişin" title="Sepetim" meta="Tüm fiyatlara KDV dahildir." />
      <div className="mt-8">
        <CartView checkoutEnabled={store?.checkout.enabled ?? false} />
      </div>
    </div>
  );
}
