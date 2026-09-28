"use client";

import { type FormEvent, useState } from "react";

import { AddressFields, type AddressFieldsValue, EMPTY_ADDRESS_FIELDS, toAddressPayload } from "@/components/account/address-fields";
import { Field, FormError } from "@/components/forms/field";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ApiError, apiFetch } from "@/lib/api-client";
import type { Address } from "@/types/api";

function fromAddress(address: Address): AddressFieldsValue {
  return {
    ...EMPTY_ADDRESS_FIELDS,
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
  };
}

export function AddressForm({ address, provinces, onSaved, onCancel }: {
  address?: Address;
  provinces: string[];
  onSaved: (saved: Address) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(address?.title ?? "");
  const [isDefault, setIsDefault] = useState(address?.is_default ?? false);
  const [fields, setFields] = useState<AddressFieldsValue>(address ? fromAddress(address) : EMPTY_ADDRESS_FIELDS);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setErrors({});
    setError(null);
    try {
      const body = { ...toAddressPayload(fields), title, is_default: isDefault };
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

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FormError message={error} />
      <Field label="Adres başlığı" htmlFor="title" error={errors.title} hint="Örn. Ev, İş">
        <Input id="title" required value={title} onChange={(e) => setTitle(e.target.value)} />
      </Field>

      <AddressFields
        value={fields}
        onChange={setFields}
        errors={errors}
        provinces={provinces}
        tcHint={address?.tc_no_masked ? `Kayıtlı: ${address.tc_no_masked} — değiştirmek için yeniden girin` : undefined}
      />

      <label className="flex items-center gap-2 text-sm">
        <Checkbox checked={isDefault} onCheckedChange={(checked) => setIsDefault(checked === true)} />
        Varsayılan adresim olsun
      </label>

      <div className="flex gap-2">
        <Button type="submit" disabled={busy}>{busy ? "Kaydediliyor..." : address ? "Güncelle" : "Adresi kaydet"}</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Vazgeç</Button>
      </div>
    </form>
  );
}
