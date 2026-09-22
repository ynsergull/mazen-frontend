import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { LoginForm } from "@/components/auth/login-form";
import { PageHeading } from "@/components/site/page-heading";

import styles from "@/components/site/storefront.module.css";

export const metadata: Metadata = { title: "Giriş yap" };

export default function LoginPage() {
  return (
    <div className={`${styles.container} ${styles.page}`}>
      <div className={styles.narrow}>
        <PageHeading eyebrow="Senin Mazen’in" title="Giriş yap" />
        <div className={`${styles.panel} mt-7`}>
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
        <p className="mt-5 text-center text-[12px] text-muted-foreground">
          Hesabın yok mu?{" "}
          <Link href="/kayit" className="underline underline-offset-4">
            Kayıt ol
          </Link>
        </p>
      </div>
    </div>
  );
}
