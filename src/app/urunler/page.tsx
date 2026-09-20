import type { Metadata } from "next";
import Link from "next/link";
import { getCatalog, getCategoryTree } from "@/lib/api";
import { ProductGrid } from "@/components/site/product-grid";
import { Pagination } from "@/components/site/pagination";

export const metadata: Metadata = { title: "Tüm ürünler", description: "Mazen Kırtasiye kataloğunu keşfet: okul, ofis, sanat ve hobi ürünleri." };

export default async function CatalogPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const value = (key: string) => typeof params[key] === "string" ? params[key] as string : undefined;
  const query: Record<string, string | undefined> = {
    q: value("q")?.slice(0, 120), category: value("category")?.slice(0, 200), brand: value("brand")?.slice(0, 200),
    in_stock: ["0", "1"].includes(value("in_stock") ?? "") ? value("in_stock") : undefined,
    has_image: value("has_image") === "1" ? "1" : undefined,
    sort: ["recommended", "newest", "price_asc", "price_desc", "name"].includes(value("sort") ?? "") ? value("sort") : "recommended",
    page: String(Math.min(100000, Math.max(1, Number.parseInt(value("page") ?? "1") || 1))),
  };
  const [products, categories] = await Promise.all([getCatalog(query), getCategoryTree()]);
  const fieldClass = "w-full rounded-lg border bg-background px-3 py-2.5 text-sm";
  return <div className="space-y-6">
    <div className="rounded-2xl bg-[#f5efe4] p-6 sm:p-8">
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-stone-600">Okula, işe, hayallerine</p>
      <h1 className="text-3xl font-semibold">Tüm ürünler</h1>
      <p className="mt-3 text-sm text-stone-600">{products.meta.total.toLocaleString("tr-TR")} ürün · Stokta olmayan ürünler de katalogda gösterilir.</p>
    </div>
    <form action="/urunler" className="grid items-end gap-3 rounded-xl border p-4 sm:grid-cols-2 lg:grid-cols-4">
      <label className="space-y-1 text-sm"><span>Ürün adı veya kodu</span><input name="q" defaultValue={query.q} maxLength={120} placeholder="Defter, kalem, ürün kodu…" className={fieldClass} /></label>
      <label className="space-y-1 text-sm"><span>Kategori</span><select name="category" defaultValue={query.category ?? ""} className={fieldClass}><option value="">Tüm kategoriler</option>{categories.map(c => <option key={c.id} value={c.slug}>{c.name} ({c.product_count ?? 0})</option>)}</select></label>
      <label className="space-y-1 text-sm"><span>Stok durumu</span><select name="in_stock" defaultValue={query.in_stock ?? ""} className={fieldClass}><option value="">Tüm ürünler</option><option value="1">Tedarikçide mevcut</option><option value="0">Stokta olmayanlar</option></select></label>
      <label className="space-y-1 text-sm"><span>Sıralama</span><select name="sort" defaultValue={query.sort} className={fieldClass}><option value="recommended">Önerilen</option><option value="newest">Son eklenen</option><option value="price_asc">Fiyat: düşükten yükseğe</option><option value="price_desc">Fiyat: yüksekten düşüğe</option><option value="name">İsim: A–Z</option></select></label>
      {query.brand && <input type="hidden" name="brand" value={query.brand} />}
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="has_image" value="1" defaultChecked={query.has_image === "1"} /> Yalnızca görselli ürünler</label>
      <div className="flex items-center gap-4 sm:col-span-1 lg:col-span-3 lg:justify-end"><Link href="/urunler" className="text-sm underline">Filtreleri temizle</Link><button type="submit" className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">Ürünleri göster</button></div>
    </form>
    <ProductGrid products={products.data} />
    <Pagination meta={products.meta} basePath="/urunler" query={query} />
    <p className="text-center text-xs text-muted-foreground">Stok bilgisi tedarikçinin var/yok bildirimidir; kesin stok adedi değildir. Online ödeme henüz açık değildir.</p>
  </div>;
}
