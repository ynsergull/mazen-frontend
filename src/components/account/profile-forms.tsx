"use client";

import { type FormEvent, useState } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { Field, FormError } from "@/components/forms/field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ApiError, apiFetch } from "@/lib/api-client";
import type { User } from "@/types/api";

export function ProfileForm() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setErrors({});
    setStatus(null);
    try {
      const res = await apiFetch<{ user: User }>("/auth/profile", { method: "PATCH", body: { name, phone } });
      setUser(res.user);
      setStatus("Bilgileriniz güncellendi.");
    } catch (e) {
      if (e instanceof ApiError) setErrors(e.fieldErrors);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card>
      <CardHeader><CardTitle>Hesap bilgileri</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="Ad Soyad" htmlFor="name" error={errors.name}>
            <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="E-posta" htmlFor="email" hint="E-posta değişikliği için bize ulaşın.">
            <Input id="email" value={user?.email ?? ""} disabled />
          </Field>
          <Field label="Telefon" htmlFor="phone" error={errors.phone}>
            <Input id="phone" type="tel" inputMode="numeric" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </Field>
          {status && <p className="text-sm text-green-700">{status}</p>}
          <Button type="submit" disabled={busy}>Kaydet</Button>
        </form>
      </CardContent>
    </Card>
  );
}

export function PasswordForm() {
  const [current, setCurrent] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setErrors({});
    setError(null);
    setStatus(null);
    try {
      await apiFetch("/auth/password", {
        method: "PATCH",
        body: { current_password: current, password, password_confirmation: confirmation },
      });
      setStatus("Şifreniz güncellendi.");
      setCurrent("");
      setPassword("");
      setConfirmation("");
    } catch (e) {
      if (e instanceof ApiError) {
        setErrors(e.fieldErrors);
        if (!e.errors) setError(e.message);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card>
      <CardHeader><CardTitle>Şifre değiştir</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <FormError message={error} />
          <Field label="Mevcut şifre" htmlFor="current_password" error={errors.current_password}>
            <Input id="current_password" type="password" autoComplete="current-password" required value={current} onChange={(e) => setCurrent(e.target.value)} />
          </Field>
          <Field label="Yeni şifre" htmlFor="new_password" error={errors.password} hint="En az 8 karakter">
            <Input id="new_password" type="password" autoComplete="new-password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
          </Field>
          <Field label="Yeni şifre (tekrar)" htmlFor="new_password_confirmation">
            <Input id="new_password_confirmation" type="password" autoComplete="new-password" required value={confirmation} onChange={(e) => setConfirmation(e.target.value)} />
          </Field>
          {status && <p className="text-sm text-green-700">{status}</p>}
          <Button type="submit" variant="outline" disabled={busy}>Şifreyi güncelle</Button>
        </form>
      </CardContent>
    </Card>
  );
}
