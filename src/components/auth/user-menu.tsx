"use client";

import Link from "next/link";
import { User } from "lucide-react";

import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";

export function UserMenu() {
  const { user, loading } = useAuth();
  const href = user ? "/hesap" : "/giris";
  const label = user ? user.name.split(" ")[0] : "Giriş yap";

  return (
    <Button variant="ghost" size="sm" className="gap-1.5" aria-label={user ? "Hesabım" : "Giriş yap"} render={<Link href={href} />}>
      <User className="size-5" />
      <span className="hidden max-w-28 truncate sm:inline">{loading ? "" : label}</span>
    </Button>
  );
}
