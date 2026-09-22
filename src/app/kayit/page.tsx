import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { RegisterForm } from "@/components/auth/register-form";
import { PageHeading } from "@/components/site/page-heading";

import styles from "@/components/site/storefront.module.css";

export const metadata: Metadata = { title: "Kayıt ol" };

export default function RegisterPage() {
  return (
    <div className={`${styles.container} ${styles.page}`}>
      <div className={styles.narrow}>
        <PageHeading eyebrow="Senin Mazen’in" title="Kayıt ol" />
        <div className={`${styles.panel} mt-7`}>
          <Suspense>
            <RegisterForm />
          </Suspense>
        </div>
        <p className="mt-5 text-center text-[12px] text-muted-foreground">
          Zaten hesabın var mı?{" "}
          <Link href="/giris" className="underline underline-offset-4">
            Giriş yap
          </Link>
        </p>
      </div>
    </div>
  );
}
