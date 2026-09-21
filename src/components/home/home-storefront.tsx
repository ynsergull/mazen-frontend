import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown, ArrowUpRight, Asterisk, Backpack, BookOpen,
  Gift, Palette, Pencil, SlidersHorizontal,
} from "lucide-react";

import { ProductGrid } from "@/components/site/product-grid";
import { Button } from "@/components/ui/button";
import type { HomeResponse } from "@/types/api";

import site from "@/components/site/storefront.module.css";
import styles from "./home.module.css";

const categories = [
  { name: "Defter & ajanda", note: "Yeni bir sayfa", icon: BookOpen, color: "peach", query: "defter" },
  { name: "Kalemler", note: "İz bırak", icon: Pencil, color: "yellow", query: "kalem" },
  { name: "Okula dönüş", note: "Heyecan başlasın", icon: Backpack, color: "mint", query: "okul" },
  { name: "Sanat & hobi", note: "İçinden geldiği gibi", icon: Palette, color: "pink", query: "boya" },
  { name: "Masa düzeni", note: "Kendine alan aç", icon: SlidersHorizontal, color: "lilac", query: "kalemlik" },
  { name: "Hediyelik", note: "Küçük mutluluklar", icon: Gift, color: "blue", query: "hediye" },
] as const;

export function HomeStorefront({ data }: { data: HomeResponse }) {
  return (
    <div className={styles.home}>
      <section className={`${site.container} ${styles.hero}`} aria-labelledby="hero-title">
        <div className={styles.heroCopy}>
          <span className={`${site.eyebrow} ${styles.heroEyebrow}`}>
            <span /> Küçük şeyler, büyük heyecanlar
          </span>
          <h1 id="hero-title">
            Yeni bir sayfa.
            <br />
            Biraz <span>renk.</span>
            <br />
            Bolca sen.
          </h1>
          <p>
            Bir fikrin, bir hayalin, bir sonraki güzel günün için.
            <br className={styles.desktopBreak} /> İyi ki var dediğin kırtasiye, şimdi Mazen&rsquo;de.
          </p>
          <Button render={<a href="#kesfet" />} className={styles.primaryButton}>
            Kendine bir şeyler seç <ArrowUpRight size={19} aria-hidden="true" />
          </Button>
          <div className={styles.heroFootnote}>
            <span className={styles.littleLine} /> Okula, işe, hayallerine.
          </div>
        </div>
        <div className={styles.heroImage}>
          <Image
            src="/images/home/hero.webp"
            alt="Güneşli bir masada renkli keten defterler, kalemler ve mavi kalem çantası"
            fill
            preload
            sizes="(max-width: 700px) 100vw, 57vw"
          />
          <div className={styles.heroSticker} aria-hidden="true">
            <Asterisk size={26} />
            <span>
              Güzel şeyler
              <br />
              burada başlar.
            </span>
          </div>
          <div className={styles.imageCaption}>
            <span>MAZEN SEÇKİSİ / 01</span>
            <a href="#kesfet" aria-label="Mazen seçkisine git">
              <ArrowDown size={20} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <div className={styles.ticker} aria-hidden="true">
        <div>
          <span>Yaz.</span>
          <Asterisk />
          <span>Çiz.</span>
          <Asterisk />
          <span>Hayal et.</span>
          <Asterisk />
          <span>Kendin ol.</span>
          <Asterisk />
          <span>Yaz.</span>
          <Asterisk />
          <span>Çiz.</span>
          <Asterisk />
          <span>Hayal et.</span>
          <Asterisk />
        </div>
      </div>

      <section className={`${site.container} ${styles.categorySection}`} aria-labelledby="categories-title">
        <div className={styles.sectionHeading}>
          <div>
            <span className={`${site.eyebrow} ${styles.sectionEyebrow}`}>Her güne bir şey</span>
            <h2 id="categories-title">Senin dünyan hangisi?</h2>
          </div>
          <p>Küçük ihtiyaçlar, güzel keşifler.</p>
        </div>
        <div className={styles.categoryGrid}>
          {categories.map(({ name, note, icon: Icon, color, query }) => (
            <Link key={name} href={`/urunler?q=${encodeURIComponent(query)}`} className={styles.categoryCard}>
              <div className={`${styles.categoryIcon} ${styles[color]}`}>
                <Icon strokeWidth={1.3} aria-hidden="true" />
                <ArrowUpRight className={styles.categoryArrow} aria-hidden="true" />
              </div>
              <h3>{name}</h3>
              <p>{note}</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="kesfet" className={`${site.container} ${styles.productSection}`} aria-labelledby="products-title">
        <div className={styles.sectionHeading}>
          <div>
            <span className={`${site.eyebrow} ${styles.sectionEyebrow}`}>Bakarken bile iyi gelir</span>
            <h2 id="products-title">Masana çok yakışacak.</h2>
          </div>
          <Link href="/urunler" className={site.textLink}>
            Tüm ürünleri gör <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
        <div className={styles.productToolbar}>
          <div className={site.chipRow}>
            <Link href="/urunler" className={site.chip}>
              Tüm katalog
            </Link>
            <Link href="/urunler?in_stock=1" className={site.chip}>
              Stoktakiler
            </Link>
            <Link href="/urunler?sort=price_asc" className={site.chip}>
              Uygun fiyatlılar
            </Link>
          </div>
          <span className={styles.previewNote}>
            {data.stats.published_products.toLocaleString("tr-TR")} ürün keşfedilmeyi bekliyor
          </span>
        </div>
        <ProductGrid
          products={data.latest_products.slice(0, 8)}
          emptyTitle="Katalog hazırlanıyor."
          emptyText="Ürünler çok yakında burada olacak."
        />
      </section>

      <section id="koleksiyonlar" className={`${site.container} ${styles.collections}`} aria-label="İlham veren koleksiyonlar">
        <Link href="/urunler?q=defter" className={`${styles.collectionCard} ${styles.notebookCollection}`}>
          <div className={styles.collectionCopy}>
            <span className={`${site.eyebrow} ${styles.collectionEyebrow}`}>Bir sayfa, bin ihtimal</span>
            <h2>
              Aklındakileri
              <br />
              kâğıda dök.
            </h2>
            <span className={styles.collectionLink}>
              Defterleri keşfet <ArrowUpRight size={19} aria-hidden="true" />
            </span>
          </div>
          <div className={styles.collectionImage}>
            <Image
              src="/images/home/notebooks.webp"
              alt="Mercan ve şeftali tonlarında keten defterler"
              fill
              sizes="(max-width: 700px) 55vw, 27vw"
            />
          </div>
        </Link>
        <Link href="/urunler?q=boya" className={`${styles.collectionCard} ${styles.artCollection}`}>
          <div className={styles.collectionCopy}>
            <span className={`${site.eyebrow} ${styles.collectionEyebrow}`}>Mükemmel olması gerekmez</span>
            <h2>
              Biraz çiz.
              <br />
              Çokça eğlen.
            </h2>
            <span className={styles.collectionLink}>
              Renkleri keşfet <ArrowUpRight size={19} aria-hidden="true" />
            </span>
          </div>
          <div className={styles.collectionImage}>
            <Image
              src="/images/home/pencils.webp"
              alt="Yelpaze şeklinde sıralanmış pastel boya kalemleri"
              fill
              sizes="(max-width: 700px) 55vw, 27vw"
            />
          </div>
        </Link>
      </section>

      <section id="ilham" className={styles.story} aria-labelledby="story-title">
        <div className={`${site.container} ${styles.storyInner}`}>
          <div className={styles.storyVisual}>
            <Image
              src="/images/home/desk.webp"
              alt="Mavi kalemlik, renkli kalemler ve makasla düzenlenmiş yaratıcı bir çalışma köşesi"
              fill
              sizes="(max-width: 700px) 90vw, 35vw"
            />
            <span className={styles.storyLabel}>senin küçük yaratıcı köşen ↗</span>
          </div>
          <div className={styles.storyCopy}>
            <span className={`${site.eyebrow} ${styles.sectionEyebrow}`}>Sadece kırtasiye değil</span>
            <h2 id="story-title">
              Günün en güzel
              <br />
              fikrine <em>yer aç.</em>
            </h2>
            <p>
              Bazen yeni bir defter, bazen en sevdiğin renkte bir kalem. Küçük şeylerin kocaman bir heyecan
              yarattığına inanıyoruz.
            </p>
            <p>
              Mazen, okul çantandan çalışma masana kadar sana eşlik edecek güzel şeyleri bir araya getiriyor.
            </p>
            <Link href="/urunler?q=kalemlik" className={site.textLink}>
              Kendi köşeni oluştur <ArrowUpRight size={19} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <div className={`${site.container} ${styles.values}`}>
        <div>
          <BookOpen aria-hidden="true" />
          <span>
            Her yeni başlangıca<small>Okuldan çalışma masana</small>
          </span>
        </div>
        <div>
          <Palette aria-hidden="true" />
          <span>
            Biraz daha renk<small>Kendini ifade etmenin binbir yolu</small>
          </span>
        </div>
        <div>
          <Gift aria-hidden="true" />
          <span>
            Küçük mutluluklar<small>Kendine veya sevdiğin birine</small>
          </span>
        </div>
      </div>
    </div>
  );
}
