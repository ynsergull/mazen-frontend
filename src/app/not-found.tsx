import Link from "next/link";
import { Asterisk } from "lucide-react";

import styles from "@/components/site/storefront.module.css";

export default function NotFound() {
  return (
    <div className={`${styles.container} ${styles.page}`}>
      <div className={`${styles.emptyState} ${styles.narrow}`}>
        <Asterisk aria-hidden="true" />
        <h2>Bu sayfayı bulamadık.</h2>
        <p>
          Aradığın ürün kaldırılmış ya da adres yanlış yazılmış olabilir. Kataloğu gezerek
          benzerlerini bulabilirsin.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-5">
          <Link href="/urunler" className={styles.textLink}>
            Tüm ürünler
          </Link>
          <Link href="/" className={styles.textLink}>
            Ana sayfa
          </Link>
        </div>
      </div>
    </div>
  );
}
