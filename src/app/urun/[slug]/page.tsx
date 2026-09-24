import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PackageCheck, PackageX, Truck } from "lucide-react";

import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { ProductGallery } from "@/components/site/product-gallery";
import { ProductGrid } from "@/components/site/product-grid";
import { getProductPage } from "@/lib/api";
import { categoryName } from "@/lib/category-name";
import { decodeHtml } from "@/lib/decode-html";
import { formatPrice } from "@/lib/format";

import styles from "@/components/site/storefront.module.css";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = await getProductPage(slug);
  if (!data) return { title: "Ürün bulunamadı" };
  const { product } = data;
  const name = decodeHtml(product.name);
  return {
    title: name,
    description: decodeHtml(product.description) || `${name} — ${formatPrice(product.price)}`,
    openGraph: { images: product.images[0] ? [product.images[0].card] : [] },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getProductPage(slug);
  if (!data) notFound();
  const { product, similar } = data;

  const name = decodeHtml(product.name);
  const brandName = decodeHtml(product.brand?.name);
  const categoryLabel = categoryName(product.category?.name);
  const description = decodeHtml(product.description);
  const trail = product.breadcrumb.map((crumb) => ({ name: categoryName(crumb.name), slug: crumb.slug }));
  const hasDiscount = product.list_price !== null && product.list_price > product.price;

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

  const specs: { label: string; value: string }[] = [
    ...(brandName ? [{ label: "Marka", value: brandName }] : []),
    { label: "Ürün kodu", value: product.sku },
    ...(product.barcode ? [{ label: "Barkod", value: product.barcode }] : []),
    ...(categoryLabel ? [{ label: "Kategori", value: categoryLabel }] : []),
  ];

  return (
    <div className={`${styles.container} ${styles.page} ${styles.hasStickyBar}`}>
      <Breadcrumbs trail={trail} current={name} />

      <div className={styles.productLayout}>
        <ProductGallery name={name} images={product.images} />

        <div className={styles.buyColumn}>
          <span className={styles.eyebrow}>
            <span /> {brandName || "Mazen kataloğu"}
          </span>
          <h1 className={styles.productH1}>{name}</h1>
          <p className={styles.codeLine}>
            Ürün kodu: {product.sku}
            {product.barcode ? ` · Barkod: ${product.barcode}` : ""}
          </p>

          <div className={styles.priceRow}>
            <span className={styles.bigPrice}>{formatPrice(product.price)}</span>
            {hasDiscount && product.list_price !== null && (
              <span className={styles.bigListPrice}>{formatPrice(product.list_price)}</span>
            )}
          </div>
          <p className={styles.vatNote}>KDV dahil</p>

          <span className={`${styles.stockBadge} ${product.in_stock ? "" : styles.stockBadgeOut}`}>
            {product.in_stock ? <PackageCheck aria-hidden="true" /> : <PackageX aria-hidden="true" />}
            {product.in_stock ? "Stokta" : "Stokta yok"}
          </span>

          <AddToCartButton productId={product.id} inStock={product.in_stock} maxQty={product.stock_qty} />

          <p className={styles.infoBox}>
            <Truck aria-hidden="true" />
            Kargo ücreti ve teslimat süresi sepette hesaplanır. Stok bilgisi tedarikçinin var/yok bildirimidir.
          </p>

          {description && (
            <div>
              <h2 className={styles.blockTitle}>Ürün açıklaması</h2>
              <p className={styles.description}>{description}</p>
            </div>
          )}

          <div>
            <h2 className={styles.blockTitle}>Ürün bilgileri</h2>
            <dl className={styles.specs}>
              {specs.map((spec) => (
                <div key={spec.label}>
                  <dt>{spec.label}</dt>
                  <dd>
                    {spec.label === "Kategori" && product.category ? (
                      <Link href={`/kategori/${product.category.slug}`} className="underline underline-offset-4">
                        {spec.value}
                      </Link>
                    ) : (
                      spec.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {similar.length > 0 && (
        <section className={styles.similar} aria-labelledby="benzer-urunler">
          <div className={styles.pageHead}>
            <div>
              <span className={styles.eyebrow}>
                <span /> Bunlar da ilgini çekebilir
              </span>
              <h2 id="benzer-urunler" className={styles.pageTitle}>
                Benzer ürünler
              </h2>
            </div>
            <Link href="/urunler" className={styles.textLink}>
              Tüm kataloğu gör
            </Link>
          </div>
          <div className="mt-7">
            <ProductGrid products={similar.slice(0, 8)} />
          </div>
        </section>
      )}

      <div className={styles.stickyBar}>
        <span className={styles.stickyPrice}>
          <strong>{formatPrice(product.price)}</strong>
          <span>KDV dahil</span>
        </span>
        <div className="ml-auto min-w-0 flex-1">
          <AddToCartButton compact productId={product.id} inStock={product.in_stock} maxQty={product.stock_qty} />
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </div>
  );
}
