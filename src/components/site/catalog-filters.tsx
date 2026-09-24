import Link from "next/link";

import { categoryName } from "@/lib/category-name";
import { buildHref } from "@/lib/query";
import type { Category } from "@/types/api";

import styles from "./storefront.module.css";

type Params = Record<string, string | undefined>;

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
 * /urunler sayfasinin filtre paneli. Hem masaustu yan sutunda hem de mobil
 * panelde ayni icerik kullanilir; tum secimler baglantidir, JavaScript gerektirmez.
 */
export function CatalogFilters({ categories, params, basePath = "/urunler" }: {
  categories: Category[];
  params: Params;
  basePath?: string;
}) {
  const activeSlug = params.category;
  const roots = categories.filter((category) => (category.product_count ?? 0) > 0);
  const activeRoot = categories.find((category) => category.slug === activeSlug);
  const activeChildren = (activeRoot?.children ?? []).filter((child) => (child.product_count ?? 0) > 0);

  return (
    <div>
      <div className={styles.filterGroup}>
        <p className={styles.filterTitle}>Kategoriler</p>
        <div className={styles.filterList}>
          <Link
            href={buildHref(basePath, params, { category: undefined })}
            className={`${styles.filterLink} ${!activeSlug ? styles.filterLinkActive : ""}`}
            aria-current={!activeSlug ? "true" : undefined}
          >
            Tüm kategoriler
          </Link>
          {roots.map((category) => {
            const isActive = category.slug === activeSlug;
            return (
              <div key={category.id}>
                <Link
                  href={buildHref(basePath, params, { category: category.slug })}
                  className={`${styles.filterLink} ${isActive ? styles.filterLinkActive : ""}`}
                  aria-current={isActive ? "true" : undefined}
                >
                  {categoryName(category.name)}
                  <span className={styles.filterCount}>{(category.product_count ?? 0).toLocaleString("tr-TR")}</span>
                </Link>
                {isActive && activeChildren.length > 0 && (
                  <div className={styles.filterChildren}>
                    {activeChildren.map((child) => (
                      <Link key={child.id} href={`/kategori/${child.slug}`} className={styles.filterLink}>
                        {categoryName(child.name)}
                        <span className={styles.filterCount}>
                          {(child.product_count ?? 0).toLocaleString("tr-TR")}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.filterGroup}>
        <p className={styles.filterTitle}>Hızlı filtreler</p>
        <Toggle
          href={buildHref(basePath, params, { in_stock: params.in_stock === "1" ? undefined : "1" })}
          label="Sadece stoktakiler"
          on={params.in_stock === "1"}
        />
        <Toggle
          href={buildHref(basePath, params, { has_image: params.has_image === "1" ? undefined : "1" })}
          label="Sadece görselli ürünler"
          on={params.has_image === "1"}
        />
      </div>

      <div className={styles.filterGroup}>
        <Link href={basePath} className={styles.textLink}>
          Tüm filtreleri temizle
        </Link>
      </div>
    </div>
  );
}
