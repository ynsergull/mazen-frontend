import type { Metadata } from "next";

import { RequireAuth } from "@/components/auth/require-auth";
import { AccountNav } from "@/components/account/account-nav";

export const metadata: Metadata = { title: "Hesabım" };

export default function AccountLayout({ children }: LayoutProps<"/hesap">) {
  return (
    <RequireAuth>
      <div className="grid gap-6 md:grid-cols-[220px_1fr]">
        <AccountNav />
        <div className="min-w-0">{children}</div>
      </div>
    </RequireAuth>
  );
}
