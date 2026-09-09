import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ProductGrid } from "@/components/site/product-grid";
import { Card } from "@/components/ui/card";
import { getHome } from "@/lib/api";

export default async function HomePage() {
  const home = await getHome();
  const categories = home.categories.filter((c) => (c.product_count ?? 0) > 0);

  return (
    <div className="space-y-12">
      <section className="rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-8 md:p-12">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Okul ve ofis için her şey</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          {home.stats.published_products.toLocaleString("tr-TR")} ürün stokta. Siparişleriniz 1-3 iş günü içinde kargoda.
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Kategoriler</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((category) => (
            <Card key={category.id} className="py-0 transition-shadow hover:shadow-md">
              <Link href={`/kategori/${category.slug}`} className="flex items-center justify-between gap-2 p-4">
                <div>
                  <p className="font-medium">{category.name}</p>
                  <p className="text-xs text-muted-foreground">{category.product_count} ürün</p>
                </div>
                <ArrowRight className="size-4 text-muted-foreground" />
              </Link>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Yeni gelenler</h2>
        <ProductGrid products={home.latest_products} />
      </section>

      {home.brands.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-semibold">Markalar</h2>
          <div className="flex flex-wrap gap-2">
            {home.brands.map((brand) => (
              <span key={brand.id} className="rounded-full border px-3 py-1 text-sm">
                {brand.name} <span className="text-muted-foreground">({brand.product_count})</span>
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
