import Link from "next/link";
import { ArrowRight, Asterisk, Search, Sparkles } from "lucide-react";

import { UserMenu } from "@/components/auth/user-menu";
import { CartBadge } from "@/components/cart/cart-badge";
import { getCategoryTreeSafe } from "@/lib/api";
import { decodeHtml } from "@/lib/decode-html";

import { StorefrontMobileNav, type MobileNavCategory } from "./storefront-mobile-nav";
import { Wordmark } from "./wordmark";
import styles from "./storefront.module.css";

const NAV_LIMIT = 8;

/** Tum sayfalarda kullanilan ust bar: duyuru seridi, logo, arama, hesap/sepet ve kategori menusu. */
export async function StorefrontHeader() {
  const tree = await getCategoryTreeSafe();
  const roots: MobileNavCategory[] = tree
    .filter((category) => (category.product_count ?? 0) > 0)
    .map((category) => ({
      id: category.id,
      name: decodeHtml(category.name),
      slug: category.slug,
      count: category.product_count ?? 0,
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <>
      <div className={styles.announcement}>
        <span>Bir defterle başlar. Bir dünyaya dönüşür.</span>
        <Asterisk size={16} aria-hidden="true" />
        <Link href="/urunler">
          Tüm kataloğu keşfet <ArrowRight size={13} aria-hidden="true" />
        </Link>
      </div>

      <header className={styles.header}>
        <div className={`${styles.container} ${styles.headerMain}`}>
          <StorefrontMobileNav categories={roots} />
          <Wordmark />
          <form action="/urunler" role="search" className={styles.search}>
            <Search size={19} aria-hidden="true" />
            <input
              name="q"
              type="search"
              minLength={2}
              maxLength={120}
              required
              placeholder="Bugün neye ihtiyacın var?"
              aria-label="Ürün veya marka ara"
            />
            <button type="submit" aria-label="Ara">
              <ArrowRight size={19} aria-hidden="true" />
            </button>
          </form>
          <div className={styles.headerActions}>
            <UserMenu />
            <CartBadge />
          </div>
        </div>

        <nav className={`${styles.container} ${styles.navigation}`} aria-label="Ana kategoriler">
          <Link href="/urunler" className={styles.newLink}>
            <Sparkles size={15} aria-hidden="true" /> Tüm ürünler
          </Link>
          {roots.slice(0, NAV_LIMIT).map((category) => (
            <Link key={category.id} href={`/kategori/${category.slug}`}>
              {category.name}
            </Link>
          ))}
        </nav>
      </header>
    </>
  );
}

/** Kategoriler yuklenirken ayni yuksekligi koruyan iskelet. */
export function StorefrontHeaderFallback() {
  return (
    <>
      <div className={styles.announcement}>
        <span>Bir defterle başlar. Bir dünyaya dönüşür.</span>
        <Asterisk size={16} aria-hidden="true" />
      </div>
      <header className={styles.header}>
        <div className={`${styles.container} ${styles.headerMain}`}>
          <Wordmark />
          <form action="/urunler" role="search" className={styles.search}>
            <Search size={19} aria-hidden="true" />
            <input
              name="q"
              type="search"
              minLength={2}
              maxLength={120}
              required
              placeholder="Bugün neye ihtiyacın var?"
              aria-label="Ürün veya marka ara"
            />
            <button type="submit" aria-label="Ara">
              <ArrowRight size={19} aria-hidden="true" />
            </button>
          </form>
          <div className={styles.headerActions}>
            <UserMenu />
            <CartBadge />
          </div>
        </div>
        <nav className={`${styles.container} ${styles.navigation}`} aria-label="Ana kategoriler">
          <Link href="/urunler" className={styles.newLink}>
            <Sparkles size={15} aria-hidden="true" /> Tüm ürünler
          </Link>
        </nav>
      </header>
    </>
  );
}
