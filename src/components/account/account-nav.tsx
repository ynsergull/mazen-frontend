"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, MapPin, Package, UserRound } from "lucide-react";

import { useAuth } from "@/components/auth/auth-provider";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/hesap", label: "Hesap bilgilerim", icon: UserRound },
  { href: "/hesap/siparisler", label: "Siparişlerim", icon: Package },
  { href: "/hesap/adresler", label: "Adreslerim", icon: MapPin },
];

export function AccountNav() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();

  async function onLogout() {
    await logout();
    router.push("/");
  }

  return (
    <aside className="space-y-4">
      <div>
        <p className="font-semibold">{user?.name}</p>
        <p className="text-xs text-muted-foreground">{user?.email}</p>
      </div>
      <nav className="flex gap-1 overflow-x-auto md:flex-col">
        {LINKS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm hover:bg-accent",
              pathname === href && "bg-accent font-medium"
            )}
          >
            <Icon className="size-4" /> {label}
          </Link>
        ))}
        <button type="button" onClick={onLogout} className="flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-left text-sm text-muted-foreground hover:bg-accent">
          <LogOut className="size-4" /> Çıkış yap
        </button>
      </nav>
    </aside>
  );
}
