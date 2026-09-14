"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, useState } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { Field, FormError } from "@/components/forms/field";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError } from "@/lib/api-client";

export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setErrors({});
    try {
      await login(email, password, remember);
      router.push(next && next.startsWith("/") ? next : "/hesap");
    } catch (e) {
      if (e instanceof ApiError) {
        setErrors(e.fieldErrors);
        if (!e.errors) setError(e.message);
      } else {
        setError("Giriş yapılamadı, lütfen tekrar deneyin.");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FormError message={error} />
      <Field label="E-posta" htmlFor="email" error={errors.email}>
        <Input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </Field>
      <Field label="Şifre" htmlFor="password" error={errors.password}>
        <Input id="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
      </Field>
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm">
          <Checkbox checked={remember} onCheckedChange={(checked) => setRemember(checked === true)} />
          Beni hatırla
        </label>
        <Link href="/sifremi-unuttum" className="text-sm text-muted-foreground hover:underline">Şifremi unuttum</Link>
      </div>
      <Button type="submit" className="w-full" disabled={busy}>{busy ? "Giriş yapılıyor..." : "Giriş yap"}</Button>
      <p className="text-center text-sm text-muted-foreground">
        Hesabınız yok mu? <Link href={next ? `/kayit?next=${encodeURIComponent(next)}` : "/kayit"} className="text-foreground underline">Kayıt olun</Link>
      </p>
      <Label className="sr-only">Giriş formu</Label>
    </form>
  );
}
