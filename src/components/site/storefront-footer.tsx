import Link from "next/link";
import { Asterisk } from "lucide-react";

import { getCategoryTreeSafe } from "@/lib/api";
import { categoryName } from "@/lib/category-name";

import { Wordmark } from "./wordmark";
import styles from "./storefront.module.css";

/** Tum sayfalarda kullanilan koyu yesil alt bilgi. */
export async function StorefrontFooter() {
  const tree = await getCategoryTreeSafe();
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
          <Link href="/sayfa/uyelik-sozlesmesi" className={styles.footerLink}>
            Üyelik sözleşmesi
          </Link>
          <Link href="/sayfa/kvkk" className={styles.footerLink}>
            KVKK aydınlatma metni
          </Link>
        </div>

        <div className={styles.footerMessage}>
          <Asterisk size={40} aria-hidden="true" />
          <p>
            Yeni dönem,
            <br />
            <em>yeni defterler.</em>
          </p>
          {/* TODO: unvan, adres, MERSIS/vergi no ve ETBIS logosu yayin oncesi eklenecek. */}
          <Link href="/urunler" className={styles.footerLink}>
            Kataloğa göz at
          </Link>
        </div>
      </div>

      <div className={`${styles.container} ${styles.footerBottom}`}>
        <span>© {new Date().getFullYear()} Mazen Kırtasiye</span>
        <span className={styles.footerNote}>
          Tüm fiyatlara KDV dahildir. İşletme ve yasal bilgiler yayın öncesi eklenecektir.
        </span>
        <span>Yaz. Çiz. Boya. Keşfet.</span>
      </div>
    </footer>
  );
}
