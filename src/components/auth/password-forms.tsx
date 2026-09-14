"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, useState } from "react";

import { Field, FormError } from "@/components/forms/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiError, apiFetch } from "@/lib/api-client";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await apiFetch<{ message: string }>("/auth/forgot-password", { method: "POST", body: { email } });
      setMessage(res.message);
    } catch (e) {
      setError(e instanceof ApiError ? e.firstMessage : "İstek gönderilemedi.");
    } finally {
      setBusy(false);
    }
  }

  if (message) {
    return (
      <div className="space-y-3 text-sm">
        <p className="rounded-md bg-green-50 px-3 py-2 text-green-800">{message}</p>
        <p className="text-muted-foreground">E-postadaki bağlantı 60 dakika geçerlidir.</p>
        <Link href="/giris" className="underline">Girişe dön</Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FormError message={error} />
      <Field label="E-posta" htmlFor="email">
        <Input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </Field>
      <Button type="submit" className="w-full" disabled={busy}>{busy ? "Gönderiliyor..." : "Sıfırlama bağlantısı gönder"}</Button>
    </form>
  );
}

export function ResetPasswordForm() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token") ?? "";
  const email = params.get("email") ?? "";
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setErrors({});
    try {
      await apiFetch("/auth/reset-password", {
        method: "POST",
        body: { token, email, password, password_confirmation: confirmation },
      });
      router.push("/giris?reset=1");
    } catch (e) {
      if (e instanceof ApiError) {
        setErrors(e.fieldErrors);
        if (!e.errors) setError(e.message);
      } else {
        setError("Şifre güncellenemedi.");
      }
    } finally {
      setBusy(false);
    }
  }

  if (!token || !email) {
    return <p className="text-sm text-destructive">Bağlantı eksik ya da hatalı. <Link href="/sifremi-unuttum" className="underline">Yeni bağlantı isteyin</Link>.</p>;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FormError message={error ?? errors.email ?? null} />
      <Field label="Yeni şifre" htmlFor="password" error={errors.password} hint="En az 8 karakter">
        <Input id="password" type="password" autoComplete="new-password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
      </Field>
      <Field label="Yeni şifre (tekrar)" htmlFor="password_confirmation">
        <Input id="password_confirmation" type="password" autoComplete="new-password" required value={confirmation} onChange={(e) => setConfirmation(e.target.value)} />
      </Field>
      <Button type="submit" className="w-full" disabled={busy}>{busy ? "Kaydediliyor..." : "Şifreyi güncelle"}</Button>
    </form>
  );
}
