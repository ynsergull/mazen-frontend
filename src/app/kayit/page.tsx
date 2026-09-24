import type { Metadata } from "next";
import { Suspense } from "react";

import { AuthShell } from "@/components/auth/auth-shell";
import { safeNext } from "@/components/auth/auth-utils";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = { title: "Kayıt ol" };

export default async function RegisterPage({ searchParams }: PageProps<"/kayit">) {
  const { next } = await searchParams;
  const target = typeof next === "string" ? safeNext(next, "") : "";

  return (
    <AuthShell
      mode="register"
      title="Mazen’e katıl"
      intro="Bir dakikada hesabını oluştur; okul alışverişin hep kaldığın yerden devam etsin."
      next={target || undefined}
    >
      <Suspense>
        <RegisterForm />
      </Suspense>
    </AuthShell>
  );
}
