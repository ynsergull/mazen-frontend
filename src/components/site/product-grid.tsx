import { ProductCard } from "@/components/site/product-card";
import type { ProductSummary } from "@/types/api";

export function ProductGrid({ products, emptyText = "Bu kriterlere uygun ürün bulunamadı." }: {
  products: ProductSummary[];
  emptyText?: string;
}) {
  if (products.length === 0) {
    return <p className="rounded-lg border border-dashed p-10 text-center text-muted-foreground">{emptyText}</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
