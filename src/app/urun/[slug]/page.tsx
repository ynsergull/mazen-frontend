import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ImageOff, PackageCheck, PackageX } from "lucide-react";

import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { ProductGrid } from "@/components/site/product-grid";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { getProductPage } from "@/lib/api";
import { formatPrice } from "@/lib/format";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = await getProductPage(slug);
  if (!data) return { title: "Ürün bulunamadı" };
  const { product } = data;
  return {
    title: product.name,
    description: product.description ?? `${product.name} — ${formatPrice(product.price)}`,
    openGraph: { images: product.images[0] ? [product.images[0].card] : [] },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getProductPage(slug);
  if (!data) notFound();
  const { product, similar } = data;
  const main = product.images[0];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku,
    gtin13: product.barcode ?? undefined,
    brand: product.brand ? { "@type": "Brand", name: product.brand.name } : undefined,
    image: product.images.map((img) => img.zoom ?? img.card),
    offers: {
      "@type": "Offer",
      priceCurrency: "TRY",
      price: product.price,
      availability: product.in_stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="space-y-10">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/" />}>Ana sayfa</BreadcrumbLink>
          </BreadcrumbItem>
          {product.breadcrumb.map((crumb) => (
            <span key={crumb.slug} className="contents">
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href={`/kategori/${crumb.slug}`} />}>{crumb.name}</BreadcrumbLink>
              </BreadcrumbItem>
            </span>
          ))}
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="line-clamp-1">{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-3">
          <div className="relative aspect-square overflow-hidden rounded-xl border bg-white">
            {main ? (
              <Image src={main.zoom ?? main.card} alt={product.name} fill priority sizes="(max-width: 768px) 100vw, 50vw" className="object-contain p-4" />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground"><ImageOff className="size-12" /></div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <div key={i} className="relative size-20 overflow-hidden rounded-md border bg-white">
                  <Image src={img.thumb} alt={`${product.name} ${i + 1}`} fill sizes="80px" className="object-contain p-1" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-5">
          {product.brand && (
            <p className="text-sm uppercase tracking-wide text-muted-foreground">{product.brand.name}</p>
          )}
          <h1 className="text-2xl font-bold leading-tight">{product.name}</h1>
          <p className="text-xs text-muted-foreground">
            Ürün kodu: {product.sku}{product.barcode ? ` · Barkod: ${product.barcode}` : ""}
          </p>

          <div className="flex items-end gap-3">
            <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
            {product.list_price && (
              <span className="pb-1 text-muted-foreground line-through">{formatPrice(product.list_price)}</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">KDV dahil</p>

          {product.in_stock ? (
            <Badge className="gap-1 bg-green-600 hover:bg-green-600"><PackageCheck className="size-3.5" /> Stokta — 1-3 iş günü içinde kargoda</Badge>
          ) : (
            <Badge variant="secondary" className="gap-1"><PackageX className="size-3.5" /> Tükendi</Badge>
          )}

          <AddToCartButton productId={product.id} inStock={product.in_stock} maxQty={product.stock_qty} />

          {product.description && (
            <>
              <Separator />
              <div>
                <h2 className="mb-2 font-semibold">Ürün açıklaması</h2>
                <p className="whitespace-pre-line text-sm text-muted-foreground">{product.description}</p>
              </div>
            </>
          )}
        </div>
      </div>

      {similar.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-semibold">Benzer ürünler</h2>
          <ProductGrid products={similar} />
        </section>
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
