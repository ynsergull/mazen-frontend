"use client";

import { type FormEvent, useState } from "react";

import { Field, FormError } from "@/components/forms/field";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ApiError, apiFetch } from "@/lib/api-client";
import type { Address, AddressInput } from "@/types/api";

const EMPTY: AddressInput = {
  title: "",
  first_name: "",
  last_name: "",
  phone: "",
  province: "",
  district: "",
  address_line: "",
  postal_code: "",
  invoice_type: "individual",
  tc_no: "",
  company_name: "",
  tax_office: "",
  tax_number: "",
  is_default: false,
};

function fromAddress(address: Address): AddressInput {
  return {
    ...EMPTY,
    title: address.title,
    first_name: address.first_name,
    last_name: address.last_name,
    phone: address.phone,
    province: address.province,
    district: address.district,
    address_line: address.address_line,
    postal_code: address.postal_code ?? "",
    invoice_type: address.invoice_type,
    company_name: address.company_name ?? "",
    tax_office: address.tax_office ?? "",
    tax_number: address.tax_number ?? "",
    is_default: address.is_default,
  };
}

export function AddressForm({ address, provinces, onSaved, onCancel }: {
  address?: Address;
  provinces: string[];
  onSaved: (saved: Address) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<AddressInput>(address ? fromAddress(address) : EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const set = <K extends keyof AddressInput>(key: K, value: AddressInput[K]) => setForm((f) => ({ ...f, [key]: value }));
  const input = (key: keyof AddressInput) => (e: { target: { value: string } }) => set(key, e.target.value as never);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setErrors({});
    setError(null);
    try {
      const body = { ...form, tc_no: form.tc_no || null, postal_code: form.postal_code || null };
      const res = address
        ? await apiFetch<{ address: Address }>(`/addresses/${address.id}`, { method: "PATCH", body })
        : await apiFetch<{ address: Address }>("/addresses", { method: "POST", body });
      onSaved(res.address);
    } catch (e) {
      if (e instanceof ApiError) {
        setErrors(e.fieldErrors);
        if (!e.errors) setError(e.message);
      } else {
        setError("Adres kaydedilemedi.");
      }
    } finally {
      setBusy(false);
    }
  }

  const corporate = form.invoice_type === "corporate";

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FormError message={error} />
      <Field label="Adres başlığı" htmlFor="title" error={errors.title} hint="Örn. Ev, İş">
        <Input id="title" required value={form.title} onChange={input("title")} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Ad" htmlFor="first_name" error={errors.first_name}>
          <Input id="first_name" required value={form.first_name} onChange={input("first_name")} />
        </Field>
        <Field label="Soyad" htmlFor="last_name" error={errors.last_name}>
          <Input id="last_name" required value={form.last_name} onChange={input("last_name")} />
        </Field>
      </div>
      <Field label="Telefon" htmlFor="phone" error={errors.phone} hint="05xx xxx xx xx">
        <Input id="phone" type="tel" inputMode="numeric" required value={form.phone} onChange={input("phone")} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="İl" htmlFor="province" error={errors.province}>
          <select
            id="province"
            required
            value={form.province}
            onChange={input("province")}
            className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
          >
            <option value="">Seçin</option>
            {provinces.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </Field>
        <Field label="İlçe" htmlFor="district" error={errors.district}>
          <Input id="district" required value={form.district} onChange={input("district")} />
        </Field>
      </div>
      <Field label="Adres" htmlFor="address_line" error={errors.address_line} hint="Mahalle, sokak, bina ve daire no">
        <textarea
          id="address_line"
          required
          rows={3}
          value={form.address_line}
          onChange={input("address_line")}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
        />
      </Field>
      <Field label="Posta kodu (isteğe bağlı)" htmlFor="postal_code" error={errors.postal_code}>
        <Input id="postal_code" inputMode="numeric" value={form.postal_code} onChange={input("postal_code")} />
      </Field>

      <fieldset className="space-y-3 rounded-lg border p-3">
        <legend className="px-1 text-sm font-medium">Fatura tipi</legend>
        <div className="flex gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input type="radio" name="invoice_type" checked={!corporate} onChange={() => set("invoice_type", "individual")} /> Bireysel
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="invoice_type" checked={corporate} onChange={() => set("invoice_type", "corporate")} /> Kurumsal
          </label>
        </div>
        {corporate ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Firma adı" htmlFor="company_name" error={errors.company_name}>
              <Input id="company_name" value={form.company_name} onChange={input("company_name")} />
            </Field>
            <Field label="Vergi dairesi" htmlFor="tax_office" error={errors.tax_office}>
              <Input id="tax_office" value={form.tax_office} onChange={input("tax_office")} />
            </Field>
            <Field label="Vergi numarası" htmlFor="tax_number" error={errors.tax_number}>
              <Input id="tax_number" inputMode="numeric" value={form.tax_number} onChange={input("tax_number")} />
            </Field>
          </div>
        ) : (
          <Field
            label="TC kimlik no (isteğe bağlı)"
            htmlFor="tc_no"
            error={errors.tc_no}
            hint={address?.tc_no_masked ? `Kayıtlı: ${address.tc_no_masked} — değiştirmek için yeniden girin` : "Faturada görünmesi için"}
          >
            <Input id="tc_no" inputMode="numeric" maxLength={11} value={form.tc_no} onChange={input("tc_no")} />
          </Field>
        )}
      </fieldset>

      <label className="flex items-center gap-2 text-sm">
        <Checkbox checked={form.is_default} onCheckedChange={(checked) => set("is_default", checked === true)} />
        Varsayılan adresim olsun
      </label>

      <div className="flex gap-2">
        <Button type="submit" disabled={busy}>{busy ? "Kaydediliyor..." : address ? "Güncelle" : "Adresi kaydet"}</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Vazgeç</Button>
      </div>
    </form>
  );
}
