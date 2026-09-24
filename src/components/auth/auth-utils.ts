import { ApiError } from "@/lib/api-client";

/** Giris/kayit sonrasi donus adresi: yalnizca site ici yollar ("//baska.site" gibi acik yonlendirme engellenir). */
export function safeNext(next: string | null, fallback = "/hesap"): string {
  return next && next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\") ? next : fallback;
}

/** Form hatasini alan hatalari ve genel mesaj olarak ayirir. */
export function readAuthError(e: unknown, fallback: string): { fields: Record<string, string>; message: string | null } {
  if (!(e instanceof ApiError)) return { fields: {}, message: fallback };
  if (e.status === 429) {
    return { fields: {}, message: "Çok fazla deneme yapıldı. Lütfen bir dakika sonra tekrar dene." };
  }
  if (e.errors) return { fields: e.fieldErrors, message: null };
  return { fields: {}, message: e.status >= 500 ? fallback : e.message };
}
