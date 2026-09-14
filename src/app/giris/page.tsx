import type { Metadata } from "next";
import { Suspense } from "react";

import { LoginForm } from "@/components/auth/login-form";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = { title: "Giriş yap" };

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-6 text-2xl font-bold">Giriş yap</h1>
      <Card>
        <CardContent>
          <Suspense>
            <LoginForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
