import type { Metadata } from "next";
import { Suspense } from "react";

import { ResetPasswordForm } from "@/components/auth/password-forms";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = { title: "Şifre sıfırla" };

export default function ResetPasswordPage() {
  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-6 text-2xl font-bold">Yeni şifre belirle</h1>
      <Card>
        <CardContent>
          <Suspense>
            <ResetPasswordForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
