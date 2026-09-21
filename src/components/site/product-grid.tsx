import { PackageSearch } from "lucide-react";

import { ProductCard } from "@/components/site/product-card";
import type { ProductSummary } from "@/types/api";

import styles from "./storefront.module.css";

export function ProductGrid({
  products,
  narrow = false,
  sizes,
  preloadCount = 0,
  emptyTitle = "Burada henüz bir şey yok.",
  emptyText = "Bu kriterlere uygun ürün bulamadık. Filtreleri azaltmayı veya başka bir kelime denemeyi öneririz.",
}: {
  products: ProductSummary[];
  /** Yan filtre sutunu ile birlikte kullanilan daha dar izgara. */
  narrow?: boolean;
  sizes?: string;
  /** Ilk N gorseli erkenden yukle (sadece sayfanin ust kismindaki izgaralar icin). */
  preloadCount?: number;
  emptyTitle?: string;
  emptyText?: string;
}) {
  if (products.length === 0) {
    return (
      <div className={styles.emptyState}>
        <PackageSearch aria-hidden="true" />
        <h2>{emptyTitle}</h2>
        <p>{emptyText}</p>
      </div>
    );
  }

  return (
    <div className={`${styles.productGrid} ${narrow ? styles.productGridNarrow : ""}`}>
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} sizes={sizes} preload={index < preloadCount} />
      ))}
    </div>
  );
}
