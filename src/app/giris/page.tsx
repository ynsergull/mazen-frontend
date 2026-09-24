import type { Metadata } from "next";
import { Suspense } from "react";

import { AuthShell } from "@/components/auth/auth-shell";
import { safeNext } from "@/components/auth/auth-utils";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Giriş yap" };

export default async function LoginPage({ searchParams }: PageProps<"/giris">) {
  const { next } = await searchParams;
  const target = typeof next === "string" ? safeNext(next, "") : "";

  return (
    <AuthShell
      mode="login"
      title="Tekrar hoş geldin!"
      intro="Sepetin, siparişlerin ve kayıtlı adreslerin seni bekliyor."
      next={target || undefined}
    >
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
