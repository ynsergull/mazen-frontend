import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

import { PaymentLogos } from "@/components/site/payment-logos";
import { getCategoryTreeSafe, getLegalPagesSafe, getStoreInfo } from "@/lib/api";
import { categoryName } from "@/lib/category-name";

import { Wordmark } from "./wordmark";
import styles from "./storefront.module.css";

/** "Yardım" sutununda gosterilen kurumsal sayfalar; alt bardaki yasal listede tekrarlanmaz. */
const HELP_PAGES = ["hakkimizda", "iletisim", "sss", "teslimat-ve-kargo", "iade-ve-cayma"];

/** Alt bilgi, yasal sayfa listesi API'ye ulasilamazsa bu cekirdek sayfalarla acilir. */
const FALLBACK_LEGAL = [
  { slug: "mesafeli-satis-sozlesmesi", title: "Mesafeli Satış Sözleşmesi" },
  { slug: "on-bilgilendirme-formu", title: "Ön Bilgilendirme Formu" },
  { slug: "gizlilik-politikasi", title: "Gizlilik Politikası" },
  { slug: "kvkk", title: "KVKK Aydınlatma Metni" },
  { slug: "cerez-politikasi", title: "Çerez Politikası" },
];

/** Tum sayfalarda kullanilan koyu yesil alt bilgi. */
export async function StorefrontFooter() {
  const [tree, store, pages] = await Promise.all([getCategoryTreeSafe(), getStoreInfo(), getLegalPagesSafe()]);
  const business = store?.business;
  const brand = business?.brand_name ?? "Mazen Kırtasiye";
  const seller = business?.seller_name ? `${business.seller_name} – ${brand}` : brand;
  const popular = tree
    .filter((category) => (category.product_count ?? 0) > 0)
    .sort((a, b) => (b.product_count ?? 0) - (a.product_count ?? 0))
    .slice(0, 4);

  const footerPages = pages.filter((page) => page.in_footer);
  const help = footerPages.filter((page) => HELP_PAGES.includes(page.slug));
  const legal = footerPages.length ? footerPages.filter((page) => !HELP_PAGES.includes(page.slug)) : FALLBACK_LEGAL;

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
          <h2>Yardım</h2>
          {(help.length ? help : [{ slug: "hakkimizda", title: "Hakkımızda" }, { slug: "iletisim", title: "İletişim" }]).map((page) => (
            <Link key={page.slug} href={`/sayfa/${page.slug}`} className={styles.footerLink}>
              {page.title}
            </Link>
          ))}
          <Link href="/hesap/siparisler" className={styles.footerLink}>
            Siparişlerim
          </Link>
          <Link href="/hesap" className={styles.footerLink}>
            Hesabım
          </Link>
        </div>

        {/* iyzico ve Mesafeli Sozlesmeler Yon.: satici unvani, acik adres ve iletisim bilgisi her sayfada gorunur */}
        <address className={styles.footerContact}>
          <h2>Bize ulaşın</h2>
          <p className={styles.footerContactName}>{seller}</p>
          {business?.address && (
            <p className={styles.footerContactLine}>
              <MapPin aria-hidden="true" />
              <span>{business.address}</span>
            </p>
          )}
          {business?.phone && (
            <a href={`tel:${business.phone.replace(/\s/g, "")}`} className={styles.footerContactLine}>
              <Phone aria-hidden="true" />
              <span>{business.phone}</span>
            </a>
          )}
          {business?.email && (
            <a href={`mailto:${business.email}`} className={styles.footerContactLine}>
              <Mail aria-hidden="true" />
              <span>{business.email}</span>
            </a>
          )}
          {business?.tax_office && business.tax_number && (
            <p className={styles.footerContactMeta}>{business.tax_office} VD · VKN {business.tax_number}</p>
          )}
          {/* TODO: ETBIS karekodu kayit tamamlaninca buraya eklenecek. */}
        </address>
      </div>

      <nav className={`${styles.container} ${styles.footerLegal}`} aria-label="Yasal bilgiler">
        {legal.map((page) => (
          <Link key={page.slug} href={`/sayfa/${page.slug}`}>
            {page.title}
          </Link>
        ))}
      </nav>

      {/* iyzico uye isyeri sarti: resmi "iyzico ile Öde" ve kart logolari alt bilgide gorunur olmali */}
      <div className={`${styles.container} ${styles.footerPayments}`}>
        <p>Ödemeleriniz lisanslı ödeme kuruluşu iyzico altyapısıyla, 3D Secure doğrulamasıyla alınır. Kart bilgileriniz bizde saklanmaz.</p>
        <PaymentLogos />
      </div>

      <div className={`${styles.container} ${styles.footerBottom}`}>
        <span>© {new Date().getFullYear()} {seller}. Tüm hakları saklıdır.</span>
        <span className={`${styles.footerNote} ${styles.footerSeller}`}>Tüm fiyatlara KDV dahildir.</span>
        <span>Yaz. Çiz. Boya. Keşfet.</span>
      </div>
    </footer>
  );
}
