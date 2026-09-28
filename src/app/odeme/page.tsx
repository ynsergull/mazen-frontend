import type { Metadata } from "next";
import Link from "next/link";
import { Clock } from "lucide-react";

import { CheckoutForm } from "@/components/checkout/checkout-form";
import { PageHeading } from "@/components/site/page-heading";
import { getStoreInfo } from "@/lib/api";

import styles from "@/components/site/storefront.module.css";

export const metadata: Metadata = { title: "Ödeme", robots: { index: false } };

// Odeme acik/kapali ve test modu bilgisi sunucudan; her istekte taze
export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const store = await getStoreInfo();

  return (
    <div className={`${styles.container} ${styles.page}`}>
      <PageHeading eyebrow="Alışverişin" title="Ödeme" meta="Adres bilgilerini gir, ödemeni iyzico güvencesiyle tamamla." />
      <div className="mt-8">
        {store?.checkout.enabled ? (
          <CheckoutForm store={store} />
        ) : (
          <div className={styles.emptyState}>
            <Clock aria-hidden="true" />
            <h2>Online ödeme çok yakında</h2>
            <p>Ödeme altyapımızı hazırlıyoruz. Sepetiniz hesabınızda saklı kalır; açıldığında buradan devam edebilirsiniz.</p>
            <Link href="/sepet" className={styles.textLink}>Sepete dön</Link>
          </div>
        )}
      </div>
    </div>
  );
}
