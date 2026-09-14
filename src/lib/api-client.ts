import type { ValidationErrorBody } from "@/types/api";

/**
 * Tarayici tarafi API istemcisi. Tum istekler ayni origin'den /api/v1'e gider (Next rewrite → Laravel),
 * cookie'ler otomatik tasinir. Yazma isteklerinde Sanctum CSRF (XSRF-TOKEN) eklenir.
 */
export class ApiError extends Error {
  constructor(message: string, public status: number, public errors?: Record<string, string[]>) {
    super(message);
  }

  /** Ilk alan hatasini ya da genel mesaji dondurur. */
  get firstMessage(): string {
    const first = this.errors ? Object.values(this.errors)[0]?.[0] : undefined;
    return first ?? this.message;
  }

  /** Alan bazli ilk hata mesajlari (form gosterimi icin). */
  get fieldErrors(): Record<string, string> {
    return Object.fromEntries(Object.entries(this.errors ?? {}).map(([key, msgs]) => [key, msgs[0]]));
  }
}

function readCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

async function ensureCsrfCookie(force = false): Promise<string | null> {
  if (!force) {
    const existing = readCookie("XSRF-TOKEN");
    if (existing) return existing;
  }
  await fetch("/sanctum/csrf-cookie", { credentials: "same-origin", cache: "no-store" });
  return readCookie("XSRF-TOKEN");
}

interface ApiInit {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
}

export async function apiFetch<T>(path: string, init: ApiInit = {}, retry = true): Promise<T> {
  const method = init.method ?? "GET";
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
    ...init.headers,
  };

  if (method !== "GET") {
    const token = await ensureCsrfCookie();
    if (token) headers["X-XSRF-TOKEN"] = token;
  }

  const res = await fetch(`/api/v1${path}`, {
    method,
    headers,
    credentials: "same-origin",
    cache: "no-store",
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  });

  // CSRF token suresi dolduysa bir kez yenileyip tekrar dene
  if (res.status === 419 && retry) {
    await ensureCsrfCookie(true);
    return apiFetch<T>(path, init, false);
  }

  const data = (await res.json().catch(() => ({}))) as Partial<ValidationErrorBody> & T;
  if (!res.ok) {
    throw new ApiError(data.message ?? (res.status === 401 ? "Giriş yapmanız gerekiyor" : "İşlem başarısız oldu"), res.status, data.errors);
  }
  return data;
}
