import type { Metadata } from "next";

import { Pagination } from "@/components/site/pagination";
import { ProductGrid } from "@/components/site/product-grid";
import { searchProducts } from "@/lib/api";

export const metadata: Metadata = { title: "Arama" };

export default async function SearchPage({ searchParams }: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q = "", page } = await searchParams;
  const term = q.trim();

  if (term.length < 2) {
    return <p className="text-muted-foreground">Aramak için en az 2 karakter girin.</p>;
  }

  const data = await searchProducts(term, page ? Number(page) : undefined);
  const products = data?.products;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">&ldquo;{term}&rdquo; için sonuçlar</h1>
        <p className="text-sm text-muted-foreground">{products?.meta.total ?? 0} ürün bulundu</p>
      </div>
      <ProductGrid products={products?.data ?? []} emptyText="Aramanızla eşleşen ürün bulunamadı. Farklı bir kelime deneyin." />
      {products && <Pagination meta={products.meta} basePath="/arama" query={{ q: term }} />}
    </div>
  );
}
