import type { Metadata } from "next";
import { Suspense } from "react";

import { RegisterForm } from "@/components/auth/register-form";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = { title: "Kayıt ol" };

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-6 text-2xl font-bold">Kayıt ol</h1>
      <Card>
        <CardContent>
          <Suspense>
            <RegisterForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
