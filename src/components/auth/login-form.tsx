"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { readAuthError, safeNext } from "@/components/auth/auth-utils";
import { PasswordInput } from "@/components/auth/password-input";
import { Field, FormError } from "@/components/forms/field";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

import styles from "./auth.module.css";

export function LoginForm() {
  const { user, loading, login } = useAuth();
  const router = useRouter();
  const next = useSearchParams().get("next");
  const target = safeNext(next);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Zaten oturum aciksa formu gostermeden hedefe gonder
  useEffect(() => {
    if (!loading && user && !busy) router.replace(target);
  }, [loading, user, busy, router, target]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setErrors({});
    try {
      await login(email.trim(), password, remember);
      router.push(target);
    } catch (e) {
      const { fields, message } = readAuthError(e, "Giriş yapılamadı, lütfen tekrar dene.");
      setErrors(fields);
      setError(message);
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <FormError message={error} />
      <Field label="E-posta" htmlFor="email" error={errors.email}>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          autoFocus
          className={styles.input}
          aria-invalid={errors.email ? true : undefined}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Field>
      <Field label="Şifre" htmlFor="password" error={errors.password}>
        <PasswordInput
          id="password"
          autoComplete="current-password"
          required
          aria-invalid={errors.password ? true : undefined}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Field>
      <div className={styles.row}>
        <label className={styles.check}>
          <Checkbox checked={remember} onCheckedChange={(checked) => setRemember(checked === true)} />
          Beni hatırla
        </label>
        <Link href="/sifremi-unuttum" className={styles.link}>
          Şifremi unuttum
        </Link>
      </div>
      <Button type="submit" className={styles.submit} disabled={busy}>
        {busy ? "Giriş yapılıyor…" : "Giriş yap"}
      </Button>
    </form>
  );
}
