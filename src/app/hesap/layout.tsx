import type { Metadata } from "next";

import { AccountNav } from "@/components/account/account-nav";
import { RequireAuth } from "@/components/auth/require-auth";

import styles from "@/components/site/storefront.module.css";

export const metadata: Metadata = { title: "Hesabım" };

export default function AccountLayout({ children }: LayoutProps<"/hesap">) {
  return (
    <RequireAuth>
      <div className={`${styles.container} ${styles.page}`}>
        <div className="grid gap-8 md:grid-cols-[230px_1fr]">
          <AccountNav />
          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </RequireAuth>
  );
}
