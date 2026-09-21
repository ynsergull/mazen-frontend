type QueryValues = Record<string, string | undefined>;

/**
 * Mevcut query parametrelerini koruyarak yeni bir baglanti uretir.
 * `page` her zaman sifirlanir; overrides icinde verilirse o deger kullanilir.
 */
export function buildHref(basePath: string, current: QueryValues, overrides: QueryValues = {}): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries({ ...current, page: undefined, ...overrides })) {
    if (value) params.set(key, value);
  }
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}
