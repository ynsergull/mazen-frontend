import Link from "next/link";
import { PackageSearch } from "lucide-react";

import { PageHeading } from "@/components/site/page-heading";

import styles from "@/components/site/storefront.module.css";

export default function OrdersPage() {
  return (
    <div>
      <PageHeading eyebrow="Senin Mazen’in" title="Siparişlerim" />
      {/* Siparis olusturma ve odeme bir sonraki fazda aciliyor; simdilik bos durum gosteriliyor. */}
      <div className={`${styles.emptyState} mt-8`}>
        <PackageSearch aria-hidden="true" />
        <h2>Henüz siparişin yok.</h2>
        <p>
          Online ödeme hazırlık aşamasında. Şimdilik kataloğu gezip beğendiklerini sepetine
          ekleyebilirsin.
        </p>
        <Link href="/urunler" className={styles.textLink}>
          Kataloğa göz at
        </Link>
      </div>
    </div>
  );
}
