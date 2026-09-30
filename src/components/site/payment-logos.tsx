import Image from "next/image";
import { ShieldCheck } from "lucide-react";

import { cn } from "@/lib/utils";

/*
 * iyzico uye isyeri sarti: resmi logolar sitede gorunur olmali. Dosyalar iyzico'nun logo paketinden
 * (docs.iyzico.com > Ek Bilgiler > iyzico Logo Paketi) degistirilmeden alindi: public/payment/.
 * Logo bandi acik zemin icin tasarlandi; koyu alt bilgide beyaz kutu icinde gosterilir.
 */

/** "iyzico ile Öde" + Mastercard, Visa, American Express, Troy bandi (alt bilgi, sepet, odeme). */
export function PaymentLogos({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <div className={cn("inline-flex max-w-full items-center rounded-md bg-white px-3 py-2 ring-1 ring-black/10", className)}>
      <Image
        src="/payment/iyzico-logo-band-colored.svg"
        alt="iyzico ile Öde; Mastercard, Visa, American Express ve Troy kartlarla güvenli ödeme"
        width={429}
        height={32}
        unoptimized
        className={cn("w-auto max-w-full", compact ? "h-5" : "h-6")}
      />
    </div>
  );
}

/** Odeme butonunun altinda: "iyzico ile Öde" logosu ve 3D Secure notu. */
export function IyzicoPayBadge({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center justify-between gap-2", className)}>
      <Image
        src="/payment/iyzico-ile-ode-colored.svg"
        alt="iyzico ile Öde"
        width={210}
        height={31}
        unoptimized
        className="h-6 w-auto"
      />
      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
        <ShieldCheck className="size-3.5" aria-hidden="true" />
        3D Secure ile güvenli ödeme
      </span>
    </div>
  );
}
