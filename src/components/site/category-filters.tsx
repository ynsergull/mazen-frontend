import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { categoryName } from "@/lib/category-name";
import { decodeHtml } from "@/lib/decode-html";
import { buildHref } from "@/lib/query";
import type { Brand, Category } from "@/types/api";

import { categoryStyle } from "./category-style";
import styles from "./storefront.module.css";

type Params = Record<string, string | undefined>;

const BRAND_VISIBLE = 8;

function Toggle({ href, label, on }: { href: string; label: string; on: boolean }) {
  return (
    <Link href={href} className={`${styles.toggleRow} ${on ? styles.toggleOn : ""}`}>
      <span className={styles.toggleTrack} aria-hidden="true" />
      {label}
      <span className="sr-only">{on ? " — filtre açık, kaldırmak için seçin" : " — filtre kapalı"}</span>
    </Link>
  );
}

/**
 * Kategori sayfasinin sol paneli: ust kategoriye donus, alt kategoriler (yaprak kategoride
 * kardesler), marka ve stok filtreleri. Masaustunde yan sutunda, mobilde FilterSheet icinde
 * ayni icerik kullanilir; tum secimler baglantidir.
 */
export function CategoryFilters({ category, subcategories, parent, brands, params, basePath }: {
  category: Category;
  /** Alt kategoriler; yaprak kategoride ayni ust kategorideki kardesler. */
  subcategories: Category[];
  parent: { name: string; slug: string } | null;
  brands: Brand[];
  params: Params;
  basePath: string;
}) {
  const name = categoryName(category.name);
  const { icon: Icon, tone } = categoryStyle(name);
  const isLeaf = subcategories.some((item) => item.id === category.id);
  const activeIndex = brands.findIndex((brand) => brand.slug === params.brand);
  const visibleBrands = brands.slice(0, Math.max(BRAND_VISIBLE, activeIndex + 1));
  const hiddenBrands = brands.slice(visibleBrands.length);

  const brandLink = (brand: Brand) => {
    const isActive = brand.slug === params.brand;
    return (
      <Link
        key={brand.id}
        href={buildHref(basePath, params, { brand: isActive ? undefined : brand.slug })}
        className={`${styles.filterLink} ${isActive ? styles.filterLinkActive : ""}`}
        aria-current={isActive ? "true" : undefined}
      >
        <span className={styles.radioDot} aria-hidden="true" />
        {decodeHtml(brand.name)}
        <span className={styles.filterCount}>{(brand.product_count ?? 0).toLocaleString("tr-TR")}</span>
      </Link>
    );
  };

  return (
    <div>
      <div className={styles.filterGroup}>
        {parent ? (
          <Link href={`/kategori/${parent.slug}`} className={styles.sideBack}>
            <ChevronLeft aria-hidden="true" /> {parent.name}
          </Link>
        ) : (
          <Link href="/urunler" className={styles.sideBack}>
            <ChevronLeft aria-hidden="true" /> Tüm ürünler
          </Link>
        )}
        {!isLeaf && (
          <p className={styles.sideCurrent}>
            <span className={`${styles.navIcon} ${styles[tone]}`} aria-hidden="true">
              <Icon />
            </span>
            {name}
          </p>
        )}
        {subcategories.length > 0 && (
          <div className={`${styles.filterList} ${isLeaf ? "" : styles.filterChildren}`}>
            {subcategories.map((item) => {
              const isCurrent = item.id === category.id;
              return (
                <Link
                  key={item.id}
                  href={`/kategori/${item.slug}`}
                  className={styles.filterLink}
                  aria-current={isCurrent ? "page" : undefined}
                >
                  {categoryName(item.name)}
                  <span className={styles.filterCount}>{(item.product_count ?? 0).toLocaleString("tr-TR")}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {brands.length > 1 && (
        <div className={styles.filterGroup}>
          <p className={styles.filterTitle}>Marka</p>
          <div className={styles.filterList}>
            <Link
              href={buildHref(basePath, params, { brand: undefined })}
              className={`${styles.filterLink} ${!params.brand ? styles.filterLinkActive : ""}`}
              aria-current={!params.brand ? "true" : undefined}
            >
              <span className={styles.radioDot} aria-hidden="true" />
              Tüm markalar
            </Link>
            {visibleBrands.map(brandLink)}
            {hiddenBrands.length > 0 && (
              <details className={styles.brandMore}>
                <summary>+ {hiddenBrands.length} marka daha</summary>
                {hiddenBrands.map(brandLink)}
              </details>
            )}
          </div>
        </div>
      )}

      <div className={styles.filterGroup}>
        <p className={styles.filterTitle}>Hızlı filtreler</p>
        <Toggle
          href={buildHref(basePath, params, { in_stock: params.in_stock === "1" ? undefined : "1" })}
          label="Sadece stoktakiler"
          on={params.in_stock === "1"}
        />
      </div>

      {(params.brand || params.in_stock || params.sort) && (
        <div className={styles.filterGroup}>
          <Link href={basePath} className={styles.textLink}>
            Filtreleri temizle
          </Link>
        </div>
      )}
    </div>
  );
}
