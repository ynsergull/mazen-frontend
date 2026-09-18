"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Ana sayfa tasarımı tamamlanırken diğer sayfaların mevcut düzenini korur. */
export function SiteFrame({ children, header, footer }: {
  children: ReactNode;
  header: ReactNode;
  footer: ReactNode;
}) {
  const pathname = usePathname();

  if (pathname === "/") return <>{children}</>;

  return (
    <>
      {header}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">{children}</main>
      {footer}
    </>
  );
}
