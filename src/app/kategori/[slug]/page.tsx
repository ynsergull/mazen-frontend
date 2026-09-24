import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { X } from "lucide-react";

import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { CategoryFilters } from "@/components/site/category-filters";
import { categoryStyle } from "@/components/site/category-style";
import { FilterSheet } from "@/components/site/filter-sheet";
import { QuerySelect } from "@/components/site/query-select";
import { CATEGORY_SORT_OPTIONS } from "@/components/site/query-options";
import { Pagination } from "@/components/site/pagination";
import { ProductGrid } from "@/components/site/product-grid";
import { getCategoryPage, getCategoryTree } from "@/lib/api";
import { flattenCategories, resolveAncestors } from "@/lib/categories";
import { categoryName } from "@/lib/category-name";
import { decodeHtml } from "@/lib/decode-html";
import { buildHref } from "@/lib/query";

import styles from "@/components/site/storefront.module.css";

type SearchParams = Promise<Record<string, string | undefined>>;

const SORT_VALUES = CATEGORY_SORT_OPTIONS.map((option) => option.value) as readonly string[];

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCategoryPage(slug, {});
  if (!data) return { title: "Kategori bulunamadı" };
  const name = categoryName(data.category.name);
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
  const name = categoryName(data.category.name);
  const { icon: Icon, tone } = categoryStyle(name);
  const trail = resolveAncestors(data.category, tree);
  const parent = trail.at(-1) ?? null;
  const meta = data.products.meta;
  const activeBrand = data.brands.find((brand) => brand.slug === query.brand);

  // Alt kategori yoksa ayni ust kategorideki kardesler gosterilir, kullanici yan menude kaybolmaz.
  const children = data.children.filter((child) => (child.product_count ?? 0) > 0);
  const siblings = parent
    ? (flattenCategories(tree).find((item) => item.slug === parent.slug)?.children ?? [])
        .filter((item) => (item.product_count ?? 0) > 0 || item.id === data.category.id)
    : [];
  const subcategories = children.length > 0 ? children : siblings;

  const chips: { key: string; label: string; href: string }[] = [];
  if (activeBrand) {
    chips.push({ key: "brand", label: decodeHtml(activeBrand.name), href: buildHref(basePath, query, { brand: undefined }) });
  }
  if (query.in_stock) {
    chips.push({ key: "in_stock", label: "Stoktakiler", href: buildHref(basePath, query, { in_stock: undefined }) });
  }

  const filters = (
    <CategoryFilters
      category={data.category}
      subcategories={subcategories}
      parent={parent}
      brands={data.brands}
      params={query}
      basePath={basePath}
    />
  );

  return (
    <div className={`${styles.container} ${styles.page}`}>
      <Breadcrumbs trail={trail} current={name} />

      <div className={`${styles.categoryHero} ${styles[tone]}`}>
        <span className={styles.categoryHeroIcon} aria-hidden="true">
          <Icon />
        </span>
        <div>
          <span className={styles.eyebrow}>
            <span /> {parent ? parent.name : "Kategori"}
          </span>
          <h1 className={styles.pageTitle}>{name}</h1>
        </div>
        <p className={styles.categoryHeroMeta}>
          {meta.total.toLocaleString("tr-TR")} ürün
          {meta.from && meta.to && meta.total > meta.to - meta.from + 1 ? ` · ${meta.from}–${meta.to} arası` : ""}
        </p>
      </div>

      <div className={styles.catalogLayout}>
        <aside className={`${styles.sidebar} ${styles.sidebarHidden}`} aria-label="Kategori ve filtreler">
          {filters}
        </aside>

        <div>
          <div className={styles.toolbar}>
            <FilterSheet activeCount={chips.length}>{filters}</FilterSheet>
            {chips.length > 0 && (
              <div className={styles.chipRow}>
                {chips.map((chip) => (
                  <Link key={chip.key} href={chip.href} className={`${styles.chip} ${styles.chipRemove}`}>
                    {chip.label}
                    <X aria-hidden="true" />
                    <span className="sr-only">filtresini kaldır</span>
                  </Link>
                ))}
              </div>
            )}
            <div className={styles.toolbarRight}>
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

          <ProductGrid
            products={data.products.data}
            narrow
            preloadCount={3}
            sizes="(max-width: 700px) 45vw, (max-width: 950px) 30vw, 22vw"
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
    </div>
  );
}
