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
