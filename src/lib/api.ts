import "server-only";
import { resolveApiUrl } from "@/lib/api-url";

import type {
  Category,
  CategoryPageResponse,
  HomeResponse,
  ProductPageResponse,
  SearchResponse,
  Paginated,
  ProductSummary,
} from "@/types/api";

const API_URL = resolveApiUrl(process.env.API_URL, process.env.NEXT_PUBLIC_API_URL);

export const CACHE_TAGS = {
  products: "products",
  categories: "categories",
} as const;

type Query = Record<string, string | number | undefined>;

interface ApiOptions {
  tags?: string[];
  /** saniye; ISR penceresi. Laravel senkron sonrasi tag ile aninda tazelenir. */
  revalidate?: number;
  query?: Query;
}

/**
 * Sunucu tarafi API cagrisi. 404'te null doner (sayfa notFound() cagirir), diger hatalarda firlatir.
 */
export async function apiGet<T>(path: string, options: ApiOptions = {}): Promise<T | null> {
  const url = new URL(API_URL + path);
  for (const [key, value] of Object.entries(options.query ?? {})) {
    if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
  }

  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: options.revalidate ?? 900, tags: options.tags ?? [CACHE_TAGS.products] },
  });

  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
  return (await res.json()) as T;
}

export async function getHome(): Promise<HomeResponse> {
  const data = await apiGet<HomeResponse>("/home", { tags: [CACHE_TAGS.products, CACHE_TAGS.categories] });
  if (!data) throw new Error("Ana sayfa verisi alinamadi");
  return data;
}

export async function getCatalog(query: Query): Promise<Paginated<ProductSummary>> {
  const data = await apiGet<Paginated<ProductSummary>>("/products", { query, revalidate: 300 });
  if (!data) throw new Error("Katalog yüklenemedi");
  return data;
}

export async function getCategoryTree(): Promise<Category[]> {
  const data = await apiGet<{ data: Category[] }>("/categories", {
    tags: [CACHE_TAGS.categories],
    revalidate: 3600,
  });
  return data?.data ?? [];
}

/**
 * Ust bar ve alt bilgi her sayfada kategori agacini okur. API'ye ulasilamazsa
 * tum site 500 vermesin diye burada bos liste doneriz: menu daralir, sayfa acilir.
 */
export async function getCategoryTreeSafe(): Promise<Category[]> {
  try {
    return await getCategoryTree();
  } catch (error) {
    console.error("Kategori agaci alinamadi; menu bos gosteriliyor.", error);
    return [];
  }
}

export function getCategoryPage(slug: string, query: Query): Promise<CategoryPageResponse | null> {
  return apiGet<CategoryPageResponse>(`/categories/${encodeURIComponent(slug)}`, {
    query,
    tags: [CACHE_TAGS.products, CACHE_TAGS.categories],
  });
}

export function getProductPage(slug: string): Promise<ProductPageResponse | null> {
  return apiGet<ProductPageResponse>(`/products/${encodeURIComponent(slug)}`);
}

export function searchProducts(q: string, page?: number): Promise<SearchResponse | null> {
  return apiGet<SearchResponse>("/search", { query: { q, page }, revalidate: 300 });
}
