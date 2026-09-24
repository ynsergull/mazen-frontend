import Link from "next/link";
import { ArrowRight, Pencil, Search, Sparkles } from "lucide-react";

import { UserMenu } from "@/components/auth/user-menu";
import { CartBadge } from "@/components/cart/cart-badge";
import { getCategoryTreeSafe } from "@/lib/api";
import { categoryName } from "@/lib/category-name";

import { categoryStyle } from "./category-style";
import { StorefrontMobileNav, type MobileNavCategory } from "./storefront-mobile-nav";
import { Wordmark } from "./wordmark";
import styles from "./storefront.module.css";

const NAV_LIMIT = 8;
const ANNOUNCEMENT = "Okula dönüş başladı: çanta, defter, kalem, boya — hepsi tek yerde.";
const SEARCH_PLACEHOLDER = "Defter, kalem, okul çantası ara…";

function Announcement({ withLink = true }: { withLink?: boolean }) {
  return (
    <div className={styles.announcement}>
      <Pencil size={14} aria-hidden="true" />
      <span>{ANNOUNCEMENT}</span>
      {withLink && (
        <Link href="/urunler?q=okul">
          Okul alışverişine başla <ArrowRight size={13} aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}

function SearchForm() {
  return (
    <form action="/urunler" role="search" className={styles.search}>
      <Search size={19} aria-hidden="true" />
      <input
        name="q"
        type="search"
        minLength={2}
        maxLength={120}
        required
        placeholder={SEARCH_PLACEHOLDER}
        aria-label="Ürün veya marka ara"
      />
      <button type="submit" aria-label="Ara">
        <ArrowRight size={19} aria-hidden="true" />
      </button>
    </form>
  );
}

/** Tum sayfalarda kullanilan ust bar: duyuru seridi, logo, arama, hesap/sepet ve kategori menusu. */
export async function StorefrontHeader() {
  const tree = await getCategoryTreeSafe();
  const roots: MobileNavCategory[] = tree
    .filter((category) => (category.product_count ?? 0) > 0)
    .map((category) => ({
      id: category.id,
      name: categoryName(category.name),
      slug: category.slug,
      count: category.product_count ?? 0,
    }))
    // Okul/kirtasiye kategorileri once, ofis ve digerleri sonra; esitlikte urun sayisi
    .sort((a, b) => categoryStyle(a.name).priority - categoryStyle(b.name).priority || b.count - a.count);

  return (
    <>
      <Announcement />

      <header className={styles.header}>
        <div className={`${styles.container} ${styles.headerMain}`}>
          <StorefrontMobileNav categories={roots} />
          <Wordmark />
          <SearchForm />
          <div className={styles.headerActions}>
            <UserMenu />
            <CartBadge />
          </div>
        </div>

        <nav className={`${styles.container} ${styles.navigation}`} aria-label="Ana kategoriler">
          <Link href="/urunler" className={styles.newLink}>
            <Sparkles size={15} aria-hidden="true" /> Tüm ürünler
          </Link>
          {roots.slice(0, NAV_LIMIT).map((category) => {
            const { icon: Icon, tone } = categoryStyle(category.name);
            return (
              <Link key={category.id} href={`/kategori/${category.slug}`}>
                <span className={`${styles.navIcon} ${styles[tone]}`} aria-hidden="true">
                  <Icon />
                </span>
                {category.name}
              </Link>
            );
          })}
        </nav>
      </header>
    </>
  );
}

/** Kategoriler yuklenirken ayni yuksekligi koruyan iskelet. */
export function StorefrontHeaderFallback() {
  return (
    <>
      <Announcement withLink={false} />
      <header className={styles.header}>
        <div className={`${styles.container} ${styles.headerMain}`}>
          <Wordmark />
          <SearchForm />
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
