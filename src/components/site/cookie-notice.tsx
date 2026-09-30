"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

import styles from "./storefront.module.css";

/*
 * Cerez bilgilendirmesi. Site yalnizca zorunlu cerez kullandigi icin onay (rıza) istenmez, yalnizca
 * bilgilendirilir (KVKK Cerez Rehberi). Istatistik/pazarlama cerezi eklenirse burasi tercih
 * penceresine donusmeli: kategori bazli onay, "Reddet" en az "Kabul et" kadar gorunur.
 */
const KEY = "mazen_cookie_notice";
const EVENT = "mazen-cookie-notice";

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(EVENT, onChange);
  };
}

function readDismissed(): boolean {
  try {
    return localStorage.getItem(KEY) !== null;
  } catch {
    return true; // depolama kapaliysa her sayfada tekrar gosterme
  }
}

function dismiss() {
  try {
    localStorage.setItem(KEY, new Date().toISOString());
  } catch {
    // depolama engelli: bu sayfa icin kapansin yeter
  }
  window.dispatchEvent(new Event(EVENT));
}

export function CookieNotice() {
  // Sunucuda gizli: ilk boyamada yanip sonmesin; tarayicida okunur
  const dismissed = useSyncExternalStore(subscribe, readDismissed, () => true);
  if (dismissed) return null;

  return (
    <div role="region" aria-label="Çerez bilgilendirmesi" className={styles.cookieNotice}>
      <p>
        Sitemizde yalnızca oturum, güvenlik ve sepet için <strong>zorunlu çerezler</strong> kullanılır; reklam veya
        takip çerezi kullanılmaz. Ayrıntılar için <Link href="/sayfa/cerez-politikasi">Çerez Politikası</Link>.
      </p>
      <button type="button" onClick={dismiss} className={styles.cookieNoticeButton}>
        Tamam
      </button>
    </div>
  );
}
