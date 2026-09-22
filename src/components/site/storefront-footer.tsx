import Link from "next/link";
import { Asterisk } from "lucide-react";

import { getCategoryTreeSafe } from "@/lib/api";
import { decodeHtml } from "@/lib/decode-html";

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
            Bir defter, bir kalem,
            <br />
            başlamak için güzel bir sebep.
          </p>
        </div>

        <div>
          <h2>Keşfet</h2>
          <Link href="/urunler" className={styles.footerLink}>
            Tüm ürünler
          </Link>
          {popular.map((category) => (
            <Link key={category.id} href={`/kategori/${category.slug}`} className={styles.footerLink}>
              {decodeHtml(category.name)}
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
        </div>

        <div className={styles.footerMessage}>
          <Asterisk size={40} aria-hidden="true" />
          <p>
            Güzel şeyler,
            <br />
            <em>birlikte daha güzel.</em>
          </p>
          {/* TODO: unvan, adres, MERSIS/vergi no, ETBIS logosu ve /sayfa/* yasal metinleri yayin oncesi eklenecek. */}
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
        <span>Biraz renk. Bolca sen.</span>
      </div>
    </footer>
  );
}
