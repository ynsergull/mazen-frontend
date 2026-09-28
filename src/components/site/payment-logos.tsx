import { cn } from "@/lib/utils";

/*
 * Odeme bolumu ve alt bilgide gosterilmesi zorunlu logolar (iyzico uye isyeri sarti: "iyzico ile Ode",
 * Visa, Mastercard). Simdilik metin rozetleri; iyzico panelindeki logo paketi indirilince
 * public/images/payment/ altina konup buradaki rozetler <Image> ile degistirilecek.
 */
const BADGES: { label: string; className: string }[] = [
  { label: "iyzico ile öde", className: "bg-[#1e64ff] text-white" },
  { label: "VISA", className: "bg-white text-[#1a1f71] italic font-black" },
  { label: "Mastercard", className: "bg-white text-[#eb001b]" },
  { label: "TROY", className: "bg-white text-[#00a7e1]" },
];

export function PaymentLogos({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <ul aria-label="Kabul edilen ödeme yöntemleri" className={cn("flex flex-wrap items-center gap-2", className)}>
      {BADGES.map((badge) => (
        <li
          key={badge.label}
          className={cn(
            "inline-flex items-center rounded-md border border-black/10 font-semibold tracking-tight",
            compact ? "h-6 px-2 text-[10px]" : "h-8 px-3 text-xs",
            badge.className,
          )}
        >
          {badge.label}
        </li>
      ))}
      <li className={cn("text-muted-foreground", compact ? "text-[10px]" : "text-xs")}>3D Secure ile güvenli ödeme</li>
    </ul>
  );
}
