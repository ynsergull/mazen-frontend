import type { Metadata } from "next";
import { Suspense } from "react";

import { OrderDetail } from "@/components/orders/order-detail";
import { PageHeading } from "@/components/site/page-heading";
import { Skeleton } from "@/components/ui/skeleton";

import styles from "@/components/site/storefront.module.css";

export const metadata: Metadata = { title: "Siparişim", robots: { index: false } };

/** Siparis sayfasi: odeme donusu (?odeme=basarili|basarisiz|hata) ve siparis takibi. */
export default async function OrderPage({ params }: PageProps<"/siparis/[publicId]">) {
  const { publicId } = await params;

  return (
    <div className={`${styles.container} ${styles.page}`}>
      <PageHeading eyebrow="Senin Mazen’in" title="Sipariş detayı" />
      <div className="mt-8">
        <Suspense fallback={<Skeleton className="h-64 w-full" />}>
          <OrderDetail publicId={publicId} />
        </Suspense>
      </div>
    </div>
  );
}
