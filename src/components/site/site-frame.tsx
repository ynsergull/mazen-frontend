import type { ReactNode } from "react";

import styles from "./storefront.module.css";

/** Ust bar + icerik + alt bilgi: ana sayfa dahil tum sayfalarda ayni cerceve. */
export function SiteFrame({ children, header, footer }: {
  children: ReactNode;
  header: ReactNode;
  footer: ReactNode;
}) {
  return (
    <>
      <a href="#ana-icerik" className={styles.skipLink}>
        İçeriğe geç
      </a>
      {header}
      <main id="ana-icerik" className={styles.main}>
        {children}
      </main>
      {footer}
    </>
  );
}
