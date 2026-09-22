import type { Metadata } from "next";

import { CartView } from "@/components/cart/cart-view";
import { PageHeading } from "@/components/site/page-heading";

import styles from "@/components/site/storefront.module.css";

export const metadata: Metadata = { title: "Sepetim" };

export default function CartPage() {
  return (
    <div className={`${styles.container} ${styles.page}`}>
      <PageHeading eyebrow="Alışverişin" title="Sepetim" meta="Tüm fiyatlara KDV dahildir." />
      <div className="mt-8">
        <CartView />
      </div>
    </div>
  );
}
