import type { Metadata } from "next";

import { ForgotPasswordForm } from "@/components/auth/password-forms";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = { title: "Şifremi unuttum" };

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-2 text-2xl font-bold">Şifremi unuttum</h1>
      <p className="mb-6 text-sm text-muted-foreground">E-posta adresinizi girin, size sıfırlama bağlantısı gönderelim.</p>
      <Card>
        <CardContent>
          <ForgotPasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}
