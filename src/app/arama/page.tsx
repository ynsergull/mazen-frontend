import { redirect } from "next/navigation";

/**
 * Arama artik katalog sayfasinda yapiliyor; eski /arama baglantilari korunsun diye
 * sorgu /urunler adresine tasiniyor.
 */
export default async function SearchPage({ searchParams }: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q = "", page } = await searchParams;
  const params = new URLSearchParams();
  const term = q.trim().slice(0, 120);
  if (term) params.set("q", term);
  if (page && page !== "1") params.set("page", page);
  const qs = params.toString();
  redirect(qs ? `/urunler?${qs}` : "/urunler");
}
