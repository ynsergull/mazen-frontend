import Link from "next/link";
import { Asterisk } from "lucide-react";

import { LEGAL_NAV } from "@/components/legal/legal-pages";
import { getCategoryTreeSafe, getStoreInfo } from "@/lib/api";
import { categoryName } from "@/lib/category-name";

import { Wordmark } from "./wordmark";
import styles from "./storefront.module.css";

/** Tum sayfalarda kullanilan koyu yesil alt bilgi. */
export async function StorefrontFooter() {
  const [tree, store] = await Promise.all([getCategoryTreeSafe(), getStoreInfo()]);
  const business = store?.business;
  const popular = tree
    .filter((category) => (category.product_count ?? 0) > 0)
    .sort((a, b) => (b.product_count ?? 0) - (a.product_count ?? 0))
    .slice(0, 4);

  return (
    <footer className={styles.footer}>
      <div className={`${styles.container} ${styles.footerTop}`}>
        <div className={styles.footerBrand}>
          <Wordmark variant="footer" />
          <p>
            Okul çantasından boya kalemine,
            <br />
            yeni döneme dair her şey.
          </p>
        </div>

        <div>
          <h2>Keşfet</h2>
          <Link href="/urunler" className={styles.footerLink}>
            Tüm ürünler
          </Link>
          {popular.map((category) => (
            <Link key={category.id} href={`/kategori/${category.slug}`} className={styles.footerLink}>
              {categoryName(category.name)}
            </Link>
          ))}
        </div>

        <div>
          <h2>Senin Mazen&rsquo;in</h2>
          <Link href="/hesap" className={styles.footerLink}>
            Hesabım
          </Link>
          <Link href="/hesap/siparisler" className={styles.footerLink}>
            Siparişlerim
          </Link>
          <Link href="/hesap/adresler" className={styles.footerLink}>
            Adreslerim
          </Link>
          <Link href="/sepet" className={styles.footerLink}>
            Sepetim
          </Link>
          <Link href="/sayfa/iletisim" className={styles.footerLink}>
            İletişim
          </Link>
        </div>

        <div className={styles.footerMessage}>
          <Asterisk size={40} aria-hidden="true" />
          <p>
            Yeni dönem,
            <br />
            <em>yeni defterler.</em>
          </p>
          {/* TODO: ETBIS karekodu kayit tamamlaninca buraya eklenecek. */}
          <Link href="/urunler" className={styles.footerLink}>
            Kataloğa göz at
          </Link>
        </div>
      </div>

      <nav className={`${styles.container} ${styles.footerLegal}`} aria-label="Yasal bilgiler">
        {LEGAL_NAV.map((item) => (
          <Link key={item.slug} href={`/sayfa/${item.slug}`}>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className={`${styles.container} ${styles.footerBottom}`}>
        <span>© {new Date().getFullYear()} {business?.brand_name ?? "Mazen Kırtasiye"}</span>
        <span className={`${styles.footerNote} ${styles.footerSeller}`}>
          {business?.seller_name && `${business.seller_name} · `}
          {business?.address && `${business.address} · `}
          {business?.tax_office && business.tax_number && `${business.tax_office} VD ${business.tax_number} · `}
          Tüm fiyatlara KDV dahildir.
        </span>
        <span>Yaz. Çiz. Boya. Keşfet.</span>
      </div>
    </footer>
  );
}
