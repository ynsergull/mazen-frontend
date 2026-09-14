"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, useState } from "react";

import { type RegisterInput, useAuth } from "@/components/auth/auth-provider";
import { Field, FormError } from "@/components/forms/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api-client";

const EMPTY: RegisterInput = { name: "", email: "", phone: "", password: "", password_confirmation: "" };

export function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();
  const next = useSearchParams().get("next");
  const [form, setForm] = useState<RegisterInput>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const set = (key: keyof RegisterInput) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setErrors({});
    try {
      await register(form);
      router.push(next && next.startsWith("/") ? next : "/hesap");
    } catch (e) {
      if (e instanceof ApiError) {
        setErrors(e.fieldErrors);
        if (!e.errors) setError(e.message);
      } else {
        setError("Kayıt yapılamadı, lütfen tekrar deneyin.");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FormError message={error} />
      <Field label="Ad Soyad" htmlFor="name" error={errors.name}>
        <Input id="name" autoComplete="name" required value={form.name} onChange={set("name")} />
      </Field>
      <Field label="E-posta" htmlFor="email" error={errors.email}>
        <Input id="email" type="email" autoComplete="email" required value={form.email} onChange={set("email")} />
      </Field>
      <Field label="Telefon" htmlFor="phone" error={errors.phone} hint="05xx xxx xx xx — sipariş bildirimleri için">
        <Input id="phone" type="tel" autoComplete="tel" inputMode="numeric" value={form.phone} onChange={set("phone")} />
      </Field>
      <Field label="Şifre" htmlFor="password" error={errors.password} hint="En az 8 karakter">
        <Input id="password" type="password" autoComplete="new-password" required minLength={8} value={form.password} onChange={set("password")} />
      </Field>
      <Field label="Şifre (tekrar)" htmlFor="password_confirmation">
        <Input id="password_confirmation" type="password" autoComplete="new-password" required value={form.password_confirmation} onChange={set("password_confirmation")} />
      </Field>
      <p className="text-xs text-muted-foreground">
        Kayıt olarak <Link href="/sayfa/kvkk" className="underline">KVKK Aydınlatma Metni</Link>&apos;ni okuduğunuzu kabul edersiniz.
      </p>
      <Button type="submit" className="w-full" disabled={busy}>{busy ? "Kaydediliyor..." : "Kayıt ol"}</Button>
      <p className="text-center text-sm text-muted-foreground">
        Zaten üye misiniz? <Link href="/giris" className="text-foreground underline">Giriş yapın</Link>
      </p>
    </form>
  );
}
