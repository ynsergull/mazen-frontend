import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { X } from "lucide-react";

import { CatalogFilters } from "@/components/site/catalog-filters";
import { FilterSheet } from "@/components/site/filter-sheet";
import { Pagination } from "@/components/site/pagination";
import { ProductGrid } from "@/components/site/product-grid";
import { QuerySelect } from "@/components/site/query-select";
import { SORT_OPTIONS } from "@/components/site/query-options";
import { getCatalog, getCategoryTree } from "@/lib/api";
import { categoryName } from "@/lib/category-name";
import { decodeHtml } from "@/lib/decode-html";
import { buildHref } from "@/lib/query";
import type { ProductSummary } from "@/types/api";

import styles from "@/components/site/storefront.module.css";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const SORT_VALUES = SORT_OPTIONS.map((option) => option.value) as readonly string[];

function readParams(params: Record<string, string | string[] | undefined>) {
  const value = (key: string) => (typeof params[key] === "string" ? (params[key] as string) : undefined);
  const page = Math.min(100000, Math.max(1, Number.parseInt(value("page") ?? "1", 10) || 1));
  return {
    q: value("q")?.trim().slice(0, 120) || undefined,
    category: value("category")?.slice(0, 200),
    brand: value("brand")?.slice(0, 200),
    in_stock: value("in_stock") === "1" ? "1" : undefined,
    has_image: value("has_image") === "1" ? "1" : undefined,
    sort: SORT_VALUES.includes(value("sort") ?? "") ? value("sort") : undefined,
    page: page > 1 ? String(page) : undefined,
  };
}

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const { q } = readParams(await searchParams);
  return {
    title: q ? `“${q}” araması` : "Tüm ürünler",
    description: "Mazen Kırtasiye kataloğunu keşfet: okul çantası, defter, kalem, boya, sanat ve hobi ürünleri.",
  };
}

function brandLabel(slug: string, products: ProductSummary[]): string {
  const match = products.find((product) => product.brand?.slug === slug);
  return match?.brand ? decodeHtml(match.brand.name) : slug.replace(/-/g, " ");
}

export default async function CatalogPage({ searchParams }: { searchParams: SearchParams }) {
  const params = readParams(await searchParams);
  const [products, categories] = await Promise.all([
    getCatalog({ ...params, sort: params.sort ?? "recommended" }),
    getCategoryTree(),
  ]);

  const activeCategory = categories.find((category) => category.slug === params.category);
  const meta = products.meta;
  const chips: { key: string; label: string; href: string }[] = [];
  if (params.q) chips.push({ key: "q", label: `“${params.q}”`, href: buildHref("/urunler", params, { q: undefined }) });
  if (params.category) {
    chips.push({
      key: "category",
      label: activeCategory ? categoryName(activeCategory.name) : params.category,
      href: buildHref("/urunler", params, { category: undefined }),
    });
  }
  if (params.brand) {
    chips.push({
      key: "brand",
      label: brandLabel(params.brand, products.data),
      href: buildHref("/urunler", params, { brand: undefined }),
    });
  }
  if (params.in_stock) {
    chips.push({ key: "in_stock", label: "Stoktakiler", href: buildHref("/urunler", params, { in_stock: undefined }) });
  }
  if (params.has_image) {
    chips.push({
      key: "has_image",
      label: "Görselli ürünler",
      href: buildHref("/urunler", params, { has_image: undefined }),
    });
  }

  const title = params.q
    ? `“${params.q}” için sonuçlar`
    : activeCategory
      ? categoryName(activeCategory.name)
      : "Tüm ürünler";

  const filters = <CatalogFilters categories={categories} params={params} />;

  return (
    <div className={`${styles.container} ${styles.page}`}>
      <div className={styles.pageHead}>
        <div>
          <span className={styles.eyebrow}>
            <span /> Okul, kırtasiye ve hobi
          </span>
          <h1 className={styles.pageTitle}>{title}</h1>
        </div>
        <p className={styles.pageMeta}>
          {meta.total.toLocaleString("tr-TR")} ürün
          {meta.from && meta.to ? ` · ${meta.from}–${meta.to} arası gösteriliyor` : ""}
        </p>
      </div>

      <div className={styles.catalogLayout}>
        <aside className={`${styles.sidebar} ${styles.sidebarHidden}`} aria-label="Ürün filtreleri">
          {filters}
        </aside>

        <div>
          <div className={styles.toolbar}>
            <FilterSheet activeCount={chips.length}>{filters}</FilterSheet>
            <div className={styles.toolbarRight}>
              <Suspense fallback={<span className={styles.selectField}>Sırala</span>}>
                <QuerySelect
                  basePath="/urunler"
                  name="sort"
                  label="Sırala"
                  value={params.sort ?? "recommended"}
                  defaultValue="recommended"
                  options={SORT_OPTIONS}
                />
              </Suspense>
            </div>
          </div>

          {chips.length > 0 && (
            <div className={`${styles.chipRow} mb-5`}>
              <span className={styles.chipsLabel}>Filtreler</span>
              {chips.map((chip) => (
                <Link key={chip.key} href={chip.href} className={`${styles.chip} ${styles.chipRemove}`}>
                  {chip.label}
                  <X aria-hidden="true" />
                  <span className="sr-only">filtresini kaldır</span>
                </Link>
              ))}
              <Link href="/urunler" className={styles.chip}>
                Temizle
              </Link>
            </div>
          )}

          <ProductGrid
            products={products.data}
            narrow
            preloadCount={4}
            sizes="(max-width: 700px) 45vw, (max-width: 950px) 30vw, 22vw"
            emptyTitle="Aradığın ürünü bulamadık."
            emptyText="Filtreleri azaltmayı veya farklı bir kelime denemeyi öneririz."
          />
          <Pagination meta={meta} basePath="/urunler" query={params} />

          <p className="mt-8 text-center text-[11px] text-muted-foreground">
            Stok bilgisi tedarikçinin var/yok bildirimidir; kesin stok adedi değildir. Online ödeme henüz açık
            değildir.
          </p>
        </div>
      </div>
    </div>
  );
}
