import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Pagination } from "@/components/site/pagination";
import { ProductGrid } from "@/components/site/product-grid";
import { Badge } from "@/components/ui/badge";
import { getCategoryPage } from "@/lib/api";
import { cn } from "@/lib/utils";

type SearchParams = Promise<Record<string, string | undefined>>;

const SORT_OPTIONS = [
  { value: "newest", label: "Yeni" },
  { value: "price_asc", label: "Fiyat ↑" },
  { value: "price_desc", label: "Fiyat ↓" },
  { value: "name", label: "A-Z" },
];

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCategoryPage(slug, {});
  return { title: data?.category.name ?? "Kategori" };
}

export default async function CategoryPage({ params, searchParams }: {
  params: Promise<{ slug: string }>;
  searchParams: SearchParams;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const query = { brand: sp.brand, sort: sp.sort, page: sp.page, in_stock: sp.in_stock };

  const data = await getCategoryPage(slug, query);
  if (!data) notFound();

  const basePath = `/kategori/${slug}`;
  const link = (overrides: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries({ ...query, page: undefined, ...overrides })) {
      if (v) p.set(k, v);
    }
    const qs = p.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{data.category.name}</h1>
        <p className="text-sm text-muted-foreground">{data.products.meta.total} ürün</p>
      </div>

      {data.children.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {data.children
            .filter((c) => (c.product_count ?? 0) > 0)
            .map((child) => (
              <Link key={child.id} href={`/kategori/${child.slug}`}>
                <Badge variant="outline" className="px-3 py-1 text-sm hover:bg-accent">
                  {child.name} <span className="ml-1 text-muted-foreground">{child.product_count}</span>
                </Badge>
              </Link>
            ))}
        </div>
      )}

      <div className="flex flex-col gap-3 rounded-lg border p-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted-foreground">Sırala:</span>
          {SORT_OPTIONS.map((option) => (
            <Link
              key={option.value}
              href={link({ sort: option.value === "newest" ? undefined : option.value })}
              className={cn(
                "rounded-md px-2 py-1 hover:bg-accent",
                (query.sort ?? "newest") === option.value && "bg-accent font-medium"
              )}
            >
              {option.label}
            </Link>
          ))}
          <Link
            href={link({ in_stock: query.in_stock ? undefined : "1" })}
            className={cn("rounded-md px-2 py-1 hover:bg-accent", query.in_stock && "bg-accent font-medium")}
          >
            Sadece stoktakiler
          </Link>
        </div>
        {data.brands.length > 1 && (
          <div className="flex flex-wrap items-center gap-1 text-sm">
            <span className="mr-1 text-muted-foreground">Marka:</span>
            <Link href={link({ brand: undefined })} className={cn("rounded-md px-2 py-1 hover:bg-accent", !query.brand && "bg-accent")}>
              Tümü
            </Link>
            {data.brands.map((brand) => (
              <Link
                key={brand.id}
                href={link({ brand: brand.slug })}
                className={cn("rounded-md px-2 py-1 hover:bg-accent", query.brand === brand.slug && "bg-accent font-medium")}
              >
                {brand.name} <span className="text-muted-foreground">({brand.product_count})</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      <ProductGrid products={data.products.data} />
      <Pagination meta={data.products.meta} basePath={basePath} query={query} />
    </div>
  );
}
