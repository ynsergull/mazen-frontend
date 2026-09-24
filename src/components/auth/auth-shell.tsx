import Image from "next/image";
import Link from "next/link";
import { Backpack, Check, MapPin, Package } from "lucide-react";
import type { ReactNode } from "react";

import site from "@/components/site/storefront.module.css";
import styles from "./auth.module.css";

const PERKS = [
  { icon: Backpack, text: "Okul listeni sepetinde sakla, her cihazdan devam et" },
  { icon: Package, text: "Siparişlerini tek ekrandan takip et" },
  { icon: MapPin, text: "Adreslerini kaydet, sonraki alışverişte vakit kazan" },
] as const;

/** Giris ve kayit sayfalarinin ortak iki sutunlu cercevesi: solda gorsel + faydalar, sagda form. */
export function AuthShell({ mode, title, intro, next, children }: {
  mode: "login" | "register";
  /** Giris/kayit sonrasi donulecek sayfa; sekmeler arasinda korunur. */
  next?: string;
  title: string;
  intro: string;
  children: ReactNode;
}) {
  const suffix = next ? `?next=${encodeURIComponent(next)}` : "";

  return (
    <div className={`${site.container} ${styles.shell}`}>
      <aside className={styles.visual} aria-hidden="true">
        <Image
          src="/images/home/desk.webp"
          alt=""
          fill
          sizes="(max-width: 900px) 0px, 42vw"
          className={styles.visualImage}
        />
        <div className={styles.visualCopy}>
          <p className={styles.visualTitle}>
            Yeni döneme
            <br />
            <em>hazır mısın?</em>
          </p>
          <ul className={styles.perks}>
            {PERKS.map(({ icon: Icon, text }) => (
              <li key={text}>
                <span>
                  <Icon size={16} />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <section className={styles.formSide}>
        <nav className={styles.tabs} aria-label="Giriş veya kayıt">
          <Link
            href={`/giris${suffix}`}
            aria-current={mode === "login" ? "page" : undefined}
            className={mode === "login" ? styles.tabActive : undefined}
          >
            Giriş yap
          </Link>
          <Link
            href={`/kayit${suffix}`}
            aria-current={mode === "register" ? "page" : undefined}
            className={mode === "register" ? styles.tabActive : undefined}
          >
            Kayıt ol
          </Link>
        </nav>

        <h1 className={styles.title}>{title}</h1>
        <p className={styles.intro}>{intro}</p>

        <div className="mt-7">{children}</div>

        <p className={styles.secure}>
          <Check size={14} aria-hidden="true" /> Bilgilerin güvenli (HTTPS) bağlantı üzerinden iletilir.
        </p>
      </section>
    </div>
  );
}
