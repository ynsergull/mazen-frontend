import { CatalogImage as Image } from "@/components/site/catalog-image";
import Link from "next/link";
import { ImageOff } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/format";
import type { ProductSummary } from "@/types/api";

export function ProductCard({ product }: { product: ProductSummary }) {
  return (
    <Card className="group h-full overflow-hidden py-0 transition-shadow hover:shadow-md">
      <Link href={`/urun/${product.slug}`} className="flex h-full flex-col">
        <div className="relative aspect-square bg-white">
          {product.image ? (
            <Image
              src={product.image.card}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-contain p-3 transition-transform group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <ImageOff className="size-8" />
            </div>
          )}
          {!product.in_stock && (
            <Badge variant="secondary" className="absolute left-2 top-2">
              Tükendi
            </Badge>
          )}
        </div>
        <CardContent className="flex flex-1 flex-col gap-1 p-3">
          {product.brand && (
            <span className="text-xs uppercase tracking-wide text-muted-foreground">{product.brand.name}</span>
          )}
          <h3 className="line-clamp-2 text-sm font-medium leading-snug">{product.name}</h3>
          <div className="mt-auto pt-2">
            {product.list_price && (
              <span className="mr-2 text-xs text-muted-foreground line-through">
                {formatPrice(product.list_price)}
              </span>
            )}
            <span className="text-base font-semibold">{formatPrice(product.price)}</span>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
