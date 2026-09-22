import type { ReactNode } from "react";

import styles from "./storefront.module.css";

/** Katalog disindaki sayfalarda (sepet, hesap, form sayfalari) ortak baslik blogu. */
export function PageHeading({ eyebrow, title, meta, children }: {
  eyebrow: string;
  title: ReactNode;
  meta?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className={styles.pageHead}>
      <div>
        <span className={styles.eyebrow}>
          <span /> {eyebrow}
        </span>
        <h1 className={styles.pageTitle}>{title}</h1>
        {children}
      </div>
      {meta && <p className={styles.pageMeta}>{meta}</p>}
    </div>
  );
}
