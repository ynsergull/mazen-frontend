import Link from "next/link";
import { Asterisk } from "lucide-react";

import styles from "./storefront.module.css";

/** Mazen logosu: "mazen*" + kucuk altyazi. */
export function Wordmark({ variant = "header" }: { variant?: "header" | "footer" }) {
  return (
    <Link
      href="/"
      aria-label="Mazen Kırtasiye ana sayfa"
      className={`${styles.wordmark} ${variant === "footer" ? styles.footerWordmark : ""}`}
    >
      mazen
      <span className={styles.logoStar} aria-hidden="true">
        <Asterisk />
      </span>
      <span className={styles.wordmarkCaption}>kırtasiye &amp; güzel şeyler</span>
    </Link>
  );
}
