"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";

import { type RegisterInput, useAuth } from "@/components/auth/auth-provider";
import { readAuthError, safeNext } from "@/components/auth/auth-utils";
import { PasswordInput } from "@/components/auth/password-input";
import { Field, FormError } from "@/components/forms/field";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

import styles from "./auth.module.css";

type TextKey = "name" | "email" | "phone" | "password" | "password_confirmation";

const EMPTY: RegisterInput = {
  name: "",
  email: "",
  phone: "",
  password: "",
  password_confirmation: "",
  terms: false,
  marketing: false,
};

const STRENGTH_LABELS = ["", "Zayıf", "İdare eder", "Güçlü"] as const;

/** 0: bos/kisa, 1: 8+ karakter, 2: harf + rakam, 3: 10+ karakter ve harf + rakam + buyuk harf/simge. */
function passwordLevel(value: string): 0 | 1 | 2 | 3 {
  if (value.length < 8) return 0;
  const mixed = /\p{L}/u.test(value) && /\d/.test(value);
  if (!mixed) return 1;
  const extra = /[\p{Lu}]/u.test(value) || /[^\p{L}\d]/u.test(value);
  return value.length >= 10 && extra ? 3 : 2;
}

/** "0532 123 45 67", "+90 532..." gibi girisleri API'nin bekledigi 05xxxxxxxxx bicimine indirger. */
function normalizePhone(value: string): string {
  const digits = value.replace(/\D/g, "").replace(/^90(?=5\d{9}$)/, "");
  return digits.length === 10 && digits.startsWith("5") ? `0${digits}` : digits;
}

export function RegisterForm() {
  const { user, loading, register } = useAuth();
  const router = useRouter();
  const target = safeNext(useSearchParams().get("next"));
  const [form, setForm] = useState<RegisterInput>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user && !busy) router.replace(target);
  }, [loading, user, busy, router, target]);

  const set = (key: TextKey) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const level = passwordLevel(form.password);
  const mismatch = form.password_confirmation.length > 0 && form.password !== form.password_confirmation;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const local: Record<string, string> = {};
    if (form.password.length < 8) local.password = "Şifre en az 8 karakter olmalı.";
    if (mismatch) local.password_confirmation = "Şifreler birbiriyle aynı değil.";
    if (!form.terms) local.terms = "Devam etmek için üyelik sözleşmesini onaylamalısın.";
    if (Object.keys(local).length > 0) {
      setErrors(local);
      return;
    }

    setBusy(true);
    setError(null);
    setErrors({});
    try {
      await register({
        ...form,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: normalizePhone(form.phone),
      });
      router.push(target);
    } catch (e) {
      const { fields, message } = readAuthError(e, "Kayıt yapılamadı, lütfen tekrar dene.");
      setErrors(fields);
      setError(message);
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <FormError message={error} />
      <Field label="Ad Soyad" htmlFor="name" error={errors.name}>
        <Input
          id="name"
          autoComplete="name"
          required
          maxLength={100}
          autoFocus
          className={styles.input}
          aria-invalid={errors.name ? true : undefined}
          value={form.name}
          onChange={set("name")}
        />
      </Field>
      <Field label="E-posta" htmlFor="email" error={errors.email}>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          maxLength={190}
          className={styles.input}
          aria-invalid={errors.email ? true : undefined}
          value={form.email}
          onChange={set("email")}
        />
      </Field>
      <Field
        label="Cep telefonu (isteğe bağlı)"
        htmlFor="phone"
        error={errors.phone}
        hint="Sipariş ve kargo bildirimleri için. Örn: 0532 123 45 67"
      >
        <Input
          id="phone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          maxLength={17}
          className={styles.input}
          aria-invalid={errors.phone ? true : undefined}
          value={form.phone}
          onChange={set("phone")}
        />
      </Field>
      <div>
        <Field label="Şifre" htmlFor="password" error={errors.password} hint="En az 8 karakter; harf ve rakam karıştırmanı öneririz.">
          <PasswordInput
            id="password"
            autoComplete="new-password"
            required
            minLength={8}
            aria-invalid={errors.password ? true : undefined}
            aria-describedby="password-strength"
            value={form.password}
            onChange={set("password")}
          />
        </Field>
        {form.password.length > 0 && (
          <div id="password-strength" className="mt-1">
            <div className={styles.strength} data-level={level} aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <p className={`${styles.muted} mt-1 text-[11px]`}>
              {level === 0 ? `${8 - form.password.length} karakter daha` : `Şifre gücü: ${STRENGTH_LABELS[level]}`}
            </p>
          </div>
        )}
      </div>
      <Field
        label="Şifre (tekrar)"
        htmlFor="password_confirmation"
        error={errors.password_confirmation ?? (mismatch ? "Şifreler birbiriyle aynı değil." : undefined)}
      >
        <PasswordInput
          id="password_confirmation"
          autoComplete="new-password"
          required
          aria-invalid={mismatch || errors.password_confirmation ? true : undefined}
          value={form.password_confirmation}
          onChange={set("password_confirmation")}
        />
      </Field>

      <div className="space-y-3 pt-1">
        <div>
          <label className={styles.check}>
            <Checkbox
              checked={form.terms}
              onCheckedChange={(checked) => setForm((f) => ({ ...f, terms: checked === true }))}
              aria-invalid={errors.terms ? true : undefined}
            />
            <span>
              <Link href="/sayfa/uyelik-sozlesmesi" target="_blank">Üyelik sözleşmesini</Link> okudum ve kabul
              ediyorum. Kişisel verilerimin <Link href="/sayfa/kvkk" target="_blank">KVKK aydınlatma metni</Link>{" "}
              kapsamında işleneceğini biliyorum.
            </span>
          </label>
          {errors.terms && (
            <p className="mt-1.5 pl-6 text-xs text-destructive" role="alert">
              {errors.terms}
            </p>
          )}
        </div>
        <label className={styles.check}>
          <Checkbox
            checked={form.marketing}
            onCheckedChange={(checked) => setForm((f) => ({ ...f, marketing: checked === true }))}
          />
          <span className={styles.muted}>
            Kampanya ve okula dönüş fırsatlarından e-posta/SMS ile haberdar olmak istiyorum. (İsteğe bağlı, istediğin
            zaman hesabından kapatabilirsin.)
          </span>
        </label>
      </div>

      <Button type="submit" className={styles.submit} disabled={busy}>
        {busy ? "Hesabın oluşturuluyor…" : "Hesabımı oluştur"}
      </Button>
    </form>
  );
}
