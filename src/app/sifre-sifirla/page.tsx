import type { Metadata } from "next";
import { Suspense } from "react";

import { ResetPasswordForm } from "@/components/auth/password-forms";
import { PageHeading } from "@/components/site/page-heading";

import styles from "@/components/site/storefront.module.css";

export const metadata: Metadata = { title: "Şifre sıfırla" };

export default function ResetPasswordPage() {
  return (
    <div className={`${styles.container} ${styles.page}`}>
      <div className={styles.narrow}>
        <PageHeading eyebrow="Senin Mazen’in" title="Yeni şifre belirle" />
        <div className={`${styles.panel} mt-7`}>
          <Suspense>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
