"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ArrowUpDown, Tag } from "lucide-react";
import { useId } from "react";

import styles from "./storefront.module.css";

export const SORT_OPTIONS = [
  { value: "recommended", label: "Önerilen" },
  { value: "newest", label: "Son eklenen" },
  { value: "price_asc", label: "Fiyat: artan" },
  { value: "price_desc", label: "Fiyat: azalan" },
  { value: "name", label: "İsim: A–Z" },
] as const;

export const CATEGORY_SORT_OPTIONS = [
  { value: "newest", label: "Son eklenen" },
  { value: "price_asc", label: "Fiyat: artan" },
  { value: "price_desc", label: "Fiyat: azalan" },
  { value: "name", label: "İsim: A–Z" },
] as const;

/**
 * Tek bir query parametresini degistiren kucuk secim kutusu.
 * Secim degisince sayfa yeni adrese gider; diger parametreler korunur, sayfa numarasi sifirlanir.
 */
export function QuerySelect({ basePath, name, value, defaultValue, label, options, icon = "sort" }: {
  basePath: string;
  name: string;
  value: string;
  /** Bu deger secilirse parametre adresten tamamen kaldirilir. */
  defaultValue: string;
  label: string;
  options: readonly { value: string; label: string }[];
  icon?: "sort" | "tag";
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = useId();
  const Icon = icon === "tag" ? Tag : ArrowUpDown;

  function onChange(next: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    if (next && next !== defaultValue) params.set(name, next);
    else params.delete(name);
    const qs = params.toString();
    router.push(qs ? `${basePath}?${qs}` : basePath);
  }

  return (
    <span className={styles.selectField}>
      <Icon size={14} aria-hidden="true" />
      <label htmlFor={id}>{label}</label>
      <select id={id} value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </span>
  );
}
