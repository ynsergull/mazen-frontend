"use client";

import { Field } from "@/components/forms/field";
import { Input } from "@/components/ui/input";
import type { AddressInput } from "@/types/api";

/** Baslik ve varsayilan disindaki adres alanlari: adres defteri formu ve checkout ayni bilesenle. */
export type AddressFieldsValue = Omit<AddressInput, "title" | "is_default">;

export const EMPTY_ADDRESS_FIELDS: AddressFieldsValue = {
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
};

export function AddressFields({ value, onChange, errors, provinces, idPrefix = "", tcHint }: {
  value: AddressFieldsValue;
  onChange: (next: AddressFieldsValue) => void;
  /** Laravel 422 alan hatalari; anahtarlar alan adi (on ek olmadan) */
  errors: Record<string, string>;
  provinces: string[];
  /** Ayni sayfada iki adres formu varsa id'ler cakismasin */
  idPrefix?: string;
  tcHint?: string;
}) {
  const set = <K extends keyof AddressFieldsValue>(key: K, next: AddressFieldsValue[K]) => onChange({ ...value, [key]: next });
  const input = (key: keyof AddressFieldsValue) => (e: { target: { value: string } }) => set(key, e.target.value as never);
  const id = (name: string) => `${idPrefix}${name}`;
  const corporate = value.invoice_type === "corporate";

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Ad" htmlFor={id("first_name")} error={errors.first_name}>
          <Input id={id("first_name")} required autoComplete="given-name" value={value.first_name} onChange={input("first_name")} />
        </Field>
        <Field label="Soyad" htmlFor={id("last_name")} error={errors.last_name}>
          <Input id={id("last_name")} required autoComplete="family-name" value={value.last_name} onChange={input("last_name")} />
        </Field>
      </div>
      <Field label="Telefon" htmlFor={id("phone")} error={errors.phone} hint="05xx xxx xx xx">
        <Input id={id("phone")} type="tel" inputMode="numeric" autoComplete="tel-national" required value={value.phone} onChange={input("phone")} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="İl" htmlFor={id("province")} error={errors.province}>
          <select
            id={id("province")}
            required
            value={value.province}
            onChange={input("province")}
            className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
          >
            <option value="">Seçin</option>
            {provinces.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </Field>
        <Field label="İlçe" htmlFor={id("district")} error={errors.district}>
          <Input id={id("district")} required autoComplete="address-level2" value={value.district} onChange={input("district")} />
        </Field>
      </div>
      <Field label="Adres" htmlFor={id("address_line")} error={errors.address_line} hint="Mahalle, sokak, bina ve daire no">
        <textarea
          id={id("address_line")}
          required
          rows={3}
          autoComplete="street-address"
          value={value.address_line}
          onChange={input("address_line")}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
        />
      </Field>
      <Field label="Posta kodu (isteğe bağlı)" htmlFor={id("postal_code")} error={errors.postal_code}>
        <Input id={id("postal_code")} inputMode="numeric" autoComplete="postal-code" value={value.postal_code} onChange={input("postal_code")} />
      </Field>

      <fieldset className="space-y-3 rounded-lg border p-3">
        <legend className="px-1 text-sm font-medium">Fatura tipi</legend>
        <div className="flex gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input type="radio" name={id("invoice_type")} checked={!corporate} onChange={() => set("invoice_type", "individual")} /> Bireysel
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name={id("invoice_type")} checked={corporate} onChange={() => set("invoice_type", "corporate")} /> Kurumsal
          </label>
        </div>
        {corporate ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Firma adı" htmlFor={id("company_name")} error={errors.company_name}>
              <Input id={id("company_name")} value={value.company_name} onChange={input("company_name")} />
            </Field>
            <Field label="Vergi dairesi" htmlFor={id("tax_office")} error={errors.tax_office}>
              <Input id={id("tax_office")} value={value.tax_office} onChange={input("tax_office")} />
            </Field>
            <Field label="Vergi numarası" htmlFor={id("tax_number")} error={errors.tax_number}>
              <Input id={id("tax_number")} inputMode="numeric" value={value.tax_number} onChange={input("tax_number")} />
            </Field>
          </div>
        ) : (
          <Field label="TC kimlik no (isteğe bağlı)" htmlFor={id("tc_no")} error={errors.tc_no} hint={tcHint ?? "Faturada görünmesi için"}>
            <Input id={id("tc_no")} inputMode="numeric" maxLength={11} value={value.tc_no} onChange={input("tc_no")} />
          </Field>
        )}
      </fieldset>
    </div>
  );
}

/** Sunucuya giderken bos metinler null olur (TC bos ise mevcut deger korunur). */
export function toAddressPayload(value: AddressFieldsValue): AddressFieldsValue & { tc_no: string; postal_code: string } {
  return {
    ...value,
    tc_no: (value.tc_no || null) as unknown as string,
    postal_code: (value.postal_code || null) as unknown as string,
  };
}
