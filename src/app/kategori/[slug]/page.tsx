import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { CATEGORY_SORT_OPTIONS, QuerySelect } from "@/components/site/query-select";
import { Pagination } from "@/components/site/pagination";
import { ProductGrid } from "@/components/site/product-grid";
import { getCategoryPage, getCategoryTree } from "@/lib/api";
import { resolveAncestors } from "@/lib/categories";
import { decodeHtml } from "@/lib/decode-html";
import { buildHref } from "@/lib/query";

import styles from "@/components/site/storefront.module.css";

type SearchParams = Promise<Record<string, string | undefined>>;

const BRAND_CHIP_LIMIT = 12;
const SORT_VALUES = CATEGORY_SORT_OPTIONS.map((option) => option.value) as readonly string[];

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCategoryPage(slug, {});
  if (!data) return { title: "Kategori bulunamadı" };
  const name = decodeHtml(data.category.name);
  return {
    title: name,
    description: `${name} kategorisindeki ${data.products.meta.total.toLocaleString("tr-TR")} ürünü Mazen Kırtasiye'de keşfet.`,
  };
}

export default async function CategoryPage({ params, searchParams }: {
  params: Promise<{ slug: string }>;
  searchParams: SearchParams;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const page = Math.min(100000, Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1));
  const query = {
    brand: sp.brand?.slice(0, 200) || undefined,
    sort: SORT_VALUES.includes(sp.sort ?? "") ? sp.sort : undefined,
    in_stock: sp.in_stock === "1" ? "1" : undefined,
    page: page > 1 ? String(page) : undefined,
  };

  const [data, tree] = await Promise.all([getCategoryPage(slug, query), getCategoryTree()]);
  if (!data) notFound();

  const basePath = `/kategori/${slug}`;
  const name = decodeHtml(data.category.name);
  const trail = resolveAncestors(data.category, tree);
  const children = data.children.filter((child) => (child.product_count ?? 0) > 0);
  const meta = data.products.meta;
  const activeBrand = data.brands.find((brand) => brand.slug === query.brand);

  return (
    <div className={`${styles.container} ${styles.page}`}>
      <Breadcrumbs trail={trail} current={name} />

      <div className={styles.pageHead}>
        <div>
          <span className={styles.eyebrow}>
            <span /> Kategori
          </span>
          <h1 className={styles.pageTitle}>{name}</h1>
        </div>
        <p className={styles.pageMeta}>
          {meta.total.toLocaleString("tr-TR")} ürün
          {meta.from && meta.to ? ` · ${meta.from}–${meta.to} arası gösteriliyor` : ""}
        </p>
      </div>

      {children.length > 0 && (
        <div className={`${styles.chipRow} mt-6`}>
          <span className={styles.chipsLabel}>Alt kategoriler</span>
          {children.map((child) => (
            <Link key={child.id} href={`/kategori/${child.slug}`} className={styles.chip}>
              {decodeHtml(child.name)}
              <span className={styles.chipCount}>{(child.product_count ?? 0).toLocaleString("tr-TR")}</span>
            </Link>
          ))}
        </div>
      )}

      <div className={`${styles.toolbar} mt-7`}>
        <div className={styles.chipRow}>
          <Link
            href={buildHref(basePath, query, { in_stock: query.in_stock ? undefined : "1" })}
            className={`${styles.chip} ${query.in_stock ? styles.chipActive : ""}`}
          >
            Sadece stoktakiler
          </Link>
          {(query.brand || query.sort) && (
            <Link href={basePath} className={`${styles.chip} ${styles.chipRemove}`}>
              Filtreleri temizle
            </Link>
          )}
        </div>
        <div className={styles.toolbarRight}>
          {data.brands.length > BRAND_CHIP_LIMIT && (
            <Suspense fallback={<span className={styles.selectField}>Marka</span>}>
              <QuerySelect
                basePath={basePath}
                name="brand"
                label="Marka"
                icon="tag"
                value={query.brand ?? ""}
                defaultValue=""
                options={[
                  { value: "", label: "Tüm markalar" },
                  ...data.brands.map((brand) => ({
                    value: brand.slug,
                    label: `${decodeHtml(brand.name)} (${brand.product_count ?? 0})`,
                  })),
                ]}
              />
            </Suspense>
          )}
          <Suspense fallback={<span className={styles.selectField}>Sırala</span>}>
            <QuerySelect
              basePath={basePath}
              name="sort"
              label="Sırala"
              value={query.sort ?? "newest"}
              defaultValue="newest"
              options={CATEGORY_SORT_OPTIONS}
            />
          </Suspense>
        </div>
      </div>

      {data.brands.length > 1 && data.brands.length <= BRAND_CHIP_LIMIT && (
        <div className={`${styles.chipRow} mt-4`}>
          <span className={styles.chipsLabel}>Marka</span>
          <Link
            href={buildHref(basePath, query, { brand: undefined })}
            className={`${styles.chip} ${!query.brand ? styles.chipActive : ""}`}
          >
            Tümü
          </Link>
          {data.brands.map((brand) => (
            <Link
              key={brand.id}
              href={buildHref(basePath, query, { brand: brand.slug })}
              className={`${styles.chip} ${query.brand === brand.slug ? styles.chipActive : ""}`}
            >
              {decodeHtml(brand.name)}
              <span className={styles.chipCount}>{brand.product_count ?? 0}</span>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8">
        <ProductGrid
          products={data.products.data}
          preloadCount={4}
          emptyTitle="Bu kategoride şimdilik ürün yok."
          emptyText={
            activeBrand
              ? `${decodeHtml(activeBrand.name)} markası için sonuç bulunamadı. Marka filtresini kaldırmayı deneyebilirsin.`
              : "Filtreleri kaldırmayı veya üst kategoriye göz atmayı öneririz."
          }
        />
        <Pagination meta={meta} basePath={basePath} query={query} />
      </div>
    </div>
  );
}
