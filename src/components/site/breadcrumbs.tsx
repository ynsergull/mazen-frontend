import Link from "next/link";
import { ChevronRight } from "lucide-react";

import type { Crumb } from "@/lib/categories";

import styles from "./storefront.module.css";

/** Ana sayfa › ust kategoriler › gecerli sayfa. */
export function Breadcrumbs({ trail, current }: { trail: Crumb[]; current: string }) {
  return (
    <nav aria-label="Sayfa yolu" className={styles.breadcrumb}>
      <Link href="/">Ana sayfa</Link>
      <ChevronRight aria-hidden="true" />
      <Link href="/urunler">Tüm ürünler</Link>
      {trail.map((crumb) => (
        <span key={crumb.slug} className="contents">
          <ChevronRight aria-hidden="true" />
          <Link href={`/kategori/${crumb.slug}`}>{crumb.name}</Link>
        </span>
      ))}
      <ChevronRight aria-hidden="true" />
      <span className={styles.breadcrumbCurrent} aria-current="page">
        {current}
      </span>
    </nav>
  );
}
