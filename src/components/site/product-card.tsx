import Link from "next/link";

import { CatalogImage } from "@/components/site/catalog-image";
import { decodeHtml } from "@/lib/decode-html";
import { formatPrice } from "@/lib/format";
import type { ProductSummary } from "@/types/api";

import styles from "./storefront.module.css";

const DEFAULT_SIZES = "(max-width: 700px) 45vw, (max-width: 1150px) 30vw, 22vw";

/**
 * Katalog, kategori, arama, ana sayfa ve benzer urunlerde kullanilan tek urun karti.
 * Kartin tamami urun sayfasina giden bir baglantidir; onizleme/popup yoktur.
 */
export function ProductCard({ product, sizes = DEFAULT_SIZES, preload = false }: {
  product: ProductSummary;
  sizes?: string;
  preload?: boolean;
}) {
  const name = decodeHtml(product.name);
  const brand = decodeHtml(product.brand?.name);

  return (
    <Link href={`/urun/${product.slug}`} className={styles.productCard}>
      <div className={styles.productImage}>
        <CatalogImage
          src={product.image?.card ?? ""}
          alt={name}
          fill
          preload={preload}
          sizes={sizes}
          className="object-contain p-4"
        />
        <span className={`${styles.productBadge} ${product.in_stock ? "" : styles.productBadgeOut}`}>
          {product.in_stock ? "Stokta" : "Stokta yok"}
        </span>
      </div>
      <div className={styles.productInfo}>
        <span className={styles.productBrand}>{brand || "Mazen kataloğu"}</span>
        <h3 className={styles.productName}>{name}</h3>
        <div className={styles.productBottom}>
          <span className={styles.price}>{formatPrice(product.price)}</span>
          {product.list_price !== null && product.list_price > product.price && (
            <span className={styles.listPrice}>{formatPrice(product.list_price)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
