"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowDown, ArrowRight, ArrowUpRight, Asterisk, Backpack, BookOpen,
  Check, Gift, Heart, Menu, Palette, Pencil, Search, ShoppingBag,
  SlidersHorizontal, Sparkles, X,
} from "lucide-react";

import { UserMenu } from "@/components/auth/user-menu";
import { CartBadge } from "@/components/cart/cart-badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { formatPrice } from "@/lib/format";
import { CatalogImage } from "@/components/site/catalog-image";
import type { HomeResponse } from "@/types/api";
import styles from "./home.module.css";

type ShowcaseProduct = {
  key: string; slug: string; name: string; subtitle: string; collection: string;
  image: string; price: number; badge: string; colors: string[]; description: string;
};

const categories = [
  { name: "Defter & ajanda", note: "Yeni bir sayfa", icon: BookOpen, color: "peach", query: "defter" },
  { name: "Kalemler", note: "İz bırak", icon: Pencil, color: "yellow", query: "kalem" },
  { name: "Okula dönüş", note: "Heyecan başlasın", icon: Backpack, color: "mint", query: "okul" },
  { name: "Sanat & hobi", note: "İçinden geldiği gibi", icon: Palette, color: "pink", query: "boya" },
  { name: "Masa düzeni", note: "Kendine alan aç", icon: SlidersHorizontal, color: "lilac", query: "kalemlik" },
  { name: "Hediyelik", note: "Küçük mutluluklar", icon: Gift, color: "blue", query: "hediye" },
];

function Wordmark({ footer = false }: { footer?: boolean }) {
  return (
    <Link href="/" aria-label="Mazen Kırtasiye ana sayfa" className={`${styles.wordmark} ${footer ? styles.footerWordmark : ""}`}>
      mazen<span className={styles.logoStar} aria-hidden="true"><Asterisk /></span>
      <span className={styles.wordmarkCaption}>kırtasiye & güzel şeyler</span>
    </Link>
  );
}

function ProductCard({ product, saved, onSave, onPreview }: {
  product: ShowcaseProduct;
  saved: boolean;
  onSave: () => void;
  onPreview: () => void;
}) {
  return (
    <article className={styles.productCard}>
      <div className={styles.productImage}>
        <button className={styles.imageButton} onClick={onPreview} aria-label={`${product.name} ürününü incele`}>
          <CatalogImage src={product.image} alt={product.name} fill sizes="(max-width: 600px) 46vw, (max-width: 1000px) 45vw, 23vw" className="object-contain bg-white p-4" />
        </button>
        <span className={styles.productBadge}>{product.badge}</span>
        <button
          className={`${styles.saveButton} ${saved ? styles.saved : ""}`}
          onClick={onSave}
          aria-label={`${product.name}: ${saved ? "beğendiklerimden çıkar" : "beğendiklerime ekle"}`}
          aria-pressed={saved}
        ><Heart size={18} fill={saved ? "currentColor" : "none"} /></button>
        <button className={styles.quickView} onClick={onPreview}>Yakından bak <ArrowUpRight size={16} /></button>
      </div>
      <div className={styles.productInfo}>
        <span className={styles.productCollection}>{product.collection}</span>
        <h3><button onClick={onPreview}>{product.name}</button></h3>
        <p>{product.subtitle}</p>
        <div className={styles.productBottom}>
          <span className={styles.price}>{formatPrice(product.price)}</span>
          <span className={styles.swatches} aria-hidden="true">
            {product.colors.map((color) => <span key={color} style={{ background: color }} />)}
          </span>
        </div>
      </div>
    </article>
  );
}

export function HomeStorefront({ data }: { data: HomeResponse }) {
  const showcaseProducts: ShowcaseProduct[] = data.latest_products.map((product) => ({
    key: String(product.id), slug: product.slug, name: product.name,
    subtitle: `Ürün kodu: ${product.sku}`, collection: product.brand?.name ?? "Mazen kataloğu",
    image: product.image?.card ?? "", price: product.price,
    badge: product.in_stock ? "Tedarikçide mevcut" : "Stokta yok", colors: [],
    description: "Ürün detaylarını inceleyebilir, mevcut ürünleri sepetine ekleyebilirsin.",
  }));
  const [saved, setSaved] = useState<string[]>([]);
  const [preview, setPreview] = useState<ShowcaseProduct | null>(null);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const visibleProducts = showcaseProducts;

  function toggleSaved(key: string) {
    setSaved((current) => current.includes(key) ? current.filter((item) => item !== key) : [...current, key]);
  }

  return (
    <div className={styles.home}>
      <a href="#ana-icerik" className={styles.skipLink}>İçeriğe geç</a>
      <div className={styles.announcement}>
        <span>Bir defterle başlar. Bir dünyaya dönüşür.</span>
        <Asterisk size={16} aria-hidden="true" />
        <a href="#kesfet">Yeni ilhamını keşfet <ArrowRight size={13} /></a>
      </div>

      <header className={styles.header}>
        <div className={`${styles.container} ${styles.headerMain}`}>
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger render={<Button variant="ghost" className={styles.mobileMenu} aria-label="Kategoriler menüsünü aç" />}>
              <Menu size={24} />
            </SheetTrigger>
            <SheetContent side="left" className="overflow-y-auto bg-[#fcfaf5] p-6">
              <SheetTitle className="mt-8 text-2xl">Neler keşfetmek istersin?</SheetTitle>
              <SheetDescription>Okula, masaya, hayallerine.</SheetDescription>
              <nav aria-label="Mobil kategoriler" className="mt-5 flex flex-col gap-1">
                <Link href="/urunler" onClick={() => setMenuOpen(false)} className="py-3 font-semibold">Tüm ürünler →</Link>
                {categories.map(({ name, query, icon: Icon }) => (
                  <Link key={name} href={`/arama?q=${encodeURIComponent(query)}`} onClick={() => setMenuOpen(false)} className="flex min-h-14 items-center gap-3 border-b border-black/10 py-3 text-base">
                    <Icon size={20} /> {name} <ArrowUpRight size={16} className="ml-auto" />
                  </Link>
                ))}
                <a href="#kesfet" onClick={() => setMenuOpen(false)} className="py-4 font-semibold text-[#bc432f]">Mazen seçkisini keşfet</a>
              </nav>
            </SheetContent>
          </Sheet>
          <Wordmark />
          <form action="/arama" role="search" className={styles.search}>
            <Search size={19} aria-hidden="true" />
            <input name="q" type="search" minLength={2} required placeholder="Bugün neye ihtiyacın var?" aria-label="Ürün veya marka ara" />
            <button type="submit" aria-label="Ara"><ArrowRight size={19} /></button>
          </form>
          <div className={styles.headerActions}>
            <UserMenu />
            <button className={styles.favoritesButton} onClick={() => setFavoritesOpen(true)} aria-label={`Beğendiklerim, ${saved.length} ürün`}>
              <Heart size={21} />
              {saved.length > 0 && <span>{saved.length}</span>}
            </button>
            <CartBadge />
          </div>
        </div>
        <nav className={`${styles.container} ${styles.navigation}`} aria-label="Ana kategoriler">
          <Link href="/urunler" className={styles.newLink}><Sparkles size={15} /> Tüm ürünler</Link>
          {categories.map(({ name, query }) => <Link key={name} href={`/arama?q=${encodeURIComponent(query)}`}>{name}</Link>)}
          <a href="#ilham" className={styles.inspirationLink}>Biraz ilham <ArrowUpRight size={14} /></a>
        </nav>
      </header>

      <main id="ana-icerik">
        <section className={`${styles.container} ${styles.hero}`} aria-labelledby="hero-title">
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}><span /> KÜÇÜK ŞEYLER, BÜYÜK HEYECANLAR</span>
            <h1 id="hero-title">Yeni bir sayfa.<br />Biraz <span>renk.</span><br />Bolca sen.</h1>
            <p>Bir fikrin, bir hayalin, bir sonraki güzel günün için.<br className={styles.desktopBreak} /> İyi ki var dediğin kırtasiye, şimdi Mazen’de.</p>
            <Button render={<a href="#kesfet" />} className={styles.primaryButton}>Kendine bir şeyler seç <ArrowUpRight size={19} /></Button>
            <div className={styles.heroFootnote}><span className={styles.littleLine} /> Okula, işe, hayallerine.</div>
          </div>
          <div className={styles.heroImage}>
            <Image src="/images/home/hero.webp" alt="Güneşli bir masada renkli keten defterler, kalemler ve mavi kalem çantası" fill preload sizes="(max-width: 700px) 100vw, 57vw" />
            <div className={styles.heroSticker} aria-hidden="true"><Asterisk size={26} /><span>Güzel şeyler<br />burada başlar.</span></div>
            <div className={styles.imageCaption}><span>MAZEN SEÇKİSİ / 01</span><a href="#kesfet" aria-label="Mazen seçkisine git"><ArrowDown size={20} /></a></div>
          </div>
        </section>

        <div className={styles.ticker} aria-hidden="true">
          <div><span>Yaz.</span><Asterisk /><span>Çiz.</span><Asterisk /><span>Hayal et.</span><Asterisk /><span>Kendin ol.</span><Asterisk /><span>Yaz.</span><Asterisk /><span>Çiz.</span><Asterisk /><span>Hayal et.</span><Asterisk /></div>
        </div>

        <section className={`${styles.container} ${styles.categorySection}`} aria-labelledby="categories-title">
          <div className={styles.sectionHeading}>
            <div><span className={styles.eyebrow}>HER GÜNE BİR ŞEY</span><h2 id="categories-title">Senin dünyan hangisi?</h2></div>
            <p>Küçük ihtiyaçlar, güzel keşifler.</p>
          </div>
          <div className={styles.categoryGrid}>
            {categories.map(({ name, note, icon: Icon, color, query }) => (
              <Link key={name} href={`/arama?q=${encodeURIComponent(query)}`} className={styles.categoryCard}>
                <div className={`${styles.categoryIcon} ${styles[color]}`}><Icon strokeWidth={1.3} /><ArrowUpRight className={styles.categoryArrow} /></div>
                <h3>{name}</h3><p>{note}</p>
              </Link>
            ))}
          </div>
        </section>

        <section id="kesfet" className={`${styles.container} ${styles.productSection}`} aria-labelledby="products-title">
          <div className={styles.sectionHeading}>
            <div><span className={styles.eyebrow}>BAKARKEN BİLE İYİ GELİR</span><h2 id="products-title">Masana çok yakışacak.</h2></div>
            <Link href="/urunler" className={styles.textLink}>Tüm ürünleri gör <ArrowUpRight size={18} /></Link>
          </div>
          <div className={styles.productToolbar}>
            <div className={styles.filters}>
              <Link href="/urunler">Tüm katalog</Link>
              <Link href="/urunler?in_stock=1">Stoktakiler</Link>
              <Link href="/urunler?sort=price_asc">Uygun fiyatlılar</Link>
            </div>
            <span className={styles.previewNote}>{data.stats.published_products.toLocaleString("tr-TR")} ürün keşfedilmeyi bekliyor</span>
          </div>
          <p className="sr-only">Katalogdan {visibleProducts.length} ürün gösteriliyor.</p>
          <div className={styles.productGrid}>
            {visibleProducts.map((product) => (
              <ProductCard key={product.key} product={product} saved={saved.includes(product.key)} onSave={() => toggleSaved(product.key)} onPreview={() => setPreview(product)} />
            ))}
          </div>
        </section>

        <section id="koleksiyonlar" className={`${styles.container} ${styles.collections}`} aria-label="İlham veren koleksiyonlar">
          <a href="/urunler?q=defter" className={`${styles.collectionCard} ${styles.notebookCollection}`}>
            <div className={styles.collectionCopy}><span className={styles.eyebrow}>BİR SAYFA, BİN İHTİMAL</span><h2>Aklındakileri<br />kâğıda dök.</h2><span className={styles.collectionLink}>Defterleri keşfet <ArrowUpRight size={19} /></span></div>
            <div className={styles.collectionImage}><Image src="/images/home/notebooks.webp" alt="Mercan ve şeftali tonlarında keten defterler" fill sizes="(max-width: 700px) 55vw, 27vw" /></div>
          </a>
          <a href="/urunler?q=boya" className={`${styles.collectionCard} ${styles.artCollection}`}>
            <div className={styles.collectionCopy}><span className={styles.eyebrow}>MÜKEMMEL OLMASI GEREKMEZ</span><h2>Biraz çiz.<br />Çokça eğlen.</h2><span className={styles.collectionLink}>Renkleri keşfet <ArrowUpRight size={19} /></span></div>
            <div className={styles.collectionImage}><Image src="/images/home/pencils.webp" alt="Yelpaze şeklinde sıralanmış pastel boya kalemleri" fill sizes="(max-width: 700px) 55vw, 27vw" /></div>
          </a>
        </section>

        <section id="ilham" className={styles.story} aria-labelledby="story-title">
          <div className={`${styles.container} ${styles.storyInner}`}>
            <div className={styles.storyVisual}>
              <Image src="/images/home/desk.webp" alt="Mavi kalemlik, renkli kalemler ve makasla düzenlenmiş yaratıcı bir çalışma köşesi" fill sizes="(max-width: 700px) 90vw, 35vw" />
              <span className={styles.storyLabel}>senin küçük yaratıcı köşen ↗</span>
            </div>
            <div className={styles.storyCopy}>
              <span className={styles.eyebrow}>SADECE KIRTASİYE DEĞİL</span>
              <h2>Günün en güzel<br />fikrine <em>yer aç.</em></h2>
              <p>Bazen yeni bir defter, bazen en sevdiğin renkte bir kalem. Küçük şeylerin kocaman bir heyecan yarattığına inanıyoruz.</p>
              <p>Mazen, okul çantandan çalışma masana kadar sana eşlik edecek güzel şeyleri bir araya getiriyor.</p>
              <a href="/urunler?q=kalemlik" className={styles.textLink}>Kendi köşeni oluştur <ArrowUpRight size={19} /></a>
            </div>
          </div>
        </section>

        <div className={`${styles.container} ${styles.values}`}>
          <div><BookOpen /><span>Her yeni başlangıca<small>Okuldan çalışma masana</small></span></div>
          <div><Palette /><span>Biraz daha renk<small>Kendini ifade etmenin binbir yolu</small></span></div>
          <div><Gift /><span>Küçük mutluluklar<small>Kendine veya sevdiğin birine</small></span></div>
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={`${styles.container} ${styles.footerTop}`}>
          <div className={styles.footerBrand}><Wordmark footer /><p>Bir defter, bir kalem,<br />başlamak için güzel bir sebep.</p></div>
          <div><h2>Keşfet</h2><Link href="/arama?q=defter">Defter & ajanda</Link><Link href="/arama?q=kalem">Kalemler</Link><Link href="/arama?q=boya">Sanat & hobi</Link><Link href="/arama?q=kalemlik">Masa düzeni</Link></div>
          <div><h2>Senin Mazen’in</h2><Link href="/hesap">Hesabım</Link><Link href="/hesap/siparisler">Siparişlerim</Link><Link href="/sepet">Sepetim</Link><button onClick={() => setFavoritesOpen(true)}>Beğendiklerim</button></div>
          <div className={styles.footerMessage}><Asterisk size={40} /><p>Güzel şeyler,<br /><em>birlikte daha güzel.</em></p><a href="#ana-icerik">Başa dön ↑</a></div>
        </div>
        <div className={`${styles.container} ${styles.footerBottom}`}><span>© {new Date().getFullYear()} Mazen Kırtasiye</span><Link href="/urunler">Gerçek ürünler · Tüm kataloğu keşfet</Link><span>Biraz renk. Bolca sen.</span></div>
      </footer>

      <Dialog open={preview !== null} onOpenChange={(open) => { if (!open) setPreview(null); }}>
        <DialogContent className={`${styles.previewDialog} sm:max-w-3xl`} showCloseButton={false}>
          {preview && <>
            <button className={styles.dialogClose} onClick={() => setPreview(null)} aria-label="Ürün önizlemesini kapat"><X size={22} /></button>
            <div className={styles.dialogImage}><CatalogImage src={preview.image} alt={preview.name} fill sizes="(max-width: 700px) 85vw, 400px" className="object-contain bg-white p-5" /></div>
            <div className={styles.dialogInfo}>
              <span className={styles.eyebrow}>{preview.collection}</span>
              <DialogTitle className={styles.dialogTitle}>{preview.name}</DialogTitle>
              <DialogDescription>{preview.description}</DialogDescription>
              <p className={styles.dialogPrice}>{formatPrice(preview.price)}</p>
              <p className={styles.dialogNotice}>{preview.badge}. Katalog ve sepet açık; online ödeme hazırlık aşamasında.</p>
              <Button className={styles.primaryButton} render={<Link href={`/urun/${preview.slug}`} />}>Ürünü incele <ArrowRight size={18} /></Button>
              <Button variant="outline" className={styles.dialogSave} onClick={() => toggleSaved(preview.key)}>
                {saved.includes(preview.key) ? <Check size={18} /> : <Heart size={18} />}
                {saved.includes(preview.key) ? "Beğendiklerimde" : "Beğendiklerime ekle"}
              </Button>
            </div>
          </>}
        </DialogContent>
      </Dialog>

      <Sheet open={favoritesOpen} onOpenChange={setFavoritesOpen}>
        <SheetContent className="overflow-y-auto bg-[#fcfaf5] p-6 sm:max-w-md">
          <SheetTitle className="mt-8 text-2xl">Beğendiklerin <span className="text-[#bc432f]">({saved.length})</span></SheetTitle>
          <SheetDescription>Bu sayfada bulunduğun süre boyunca beğendiğin ürünler.</SheetDescription>
          {saved.length === 0 ? (
            <div className={styles.emptyFavorites}><Heart size={40} strokeWidth={1.2} /><h3>Güzel bir şey bulalım.</h3><p>Ürünlerdeki kalbe dokun,<br />beğendiklerin burada biriksin.</p><Button className={styles.primaryButton} onClick={() => setFavoritesOpen(false)}>Keşfetmeye devam et <ArrowRight size={18} /></Button></div>
          ) : (
            <div className={styles.favoriteList}>{showcaseProducts.filter((product) => saved.includes(product.key)).map((product) => (
              <div key={product.key} className={styles.favoriteItem}>
                <CatalogImage src={product.image} alt={product.name} width={84} height={84} />
                <button onClick={() => { setFavoritesOpen(false); setPreview(product); }}><strong>{product.name}</strong><span>{formatPrice(product.price)}</span></button>
                <button aria-label={`${product.name} ürününü beğendiklerimden çıkar`} onClick={() => toggleSaved(product.key)}><X size={18} /></button>
              </div>
            ))}</div>
          )}
          <p className={styles.favoriteNote}><ShoppingBag size={16} /> Gerçek alışveriş için katalogdaki ürünleri keşfedebilirsin.</p>
        </SheetContent>
      </Sheet>
    </div>
  );
}
