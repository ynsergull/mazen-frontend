import type { Metadata } from "next";
import Link from "next/link";

import { ForgotPasswordForm } from "@/components/auth/password-forms";
import { PageHeading } from "@/components/site/page-heading";

import styles from "@/components/site/storefront.module.css";

export const metadata: Metadata = { title: "Şifremi unuttum" };

export default function ForgotPasswordPage() {
  return (
    <div className={`${styles.container} ${styles.page}`}>
      <div className={styles.narrow}>
        <PageHeading
          eyebrow="Senin Mazen’in"
          title="Şifremi unuttum"
          meta="E-posta adresini gir, sıfırlama bağlantısını gönderelim."
        />
        <div className={`${styles.panel} mt-7`}>
          <ForgotPasswordForm />
        </div>
        <p className="mt-5 text-center text-[12px] text-muted-foreground">
          <Link href="/giris" className="underline underline-offset-4">
            Giriş sayfasına dön
          </Link>
        </p>
      </div>
    </div>
  );
}
