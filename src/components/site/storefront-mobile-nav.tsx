"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

import styles from "./storefront.module.css";

export type MobileNavCategory = { id: number; name: string; slug: string; count: number };

/** Mobil kategori menusu: sunucudan gelen kok kategorilerin tamamini listeler. */
export function StorefrontMobileNav({ categories }: { categories: MobileNavCategory[] }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={<Button variant="ghost" className={styles.mobileMenu} aria-label="Kategori menüsünü aç" />}
      >
        <Menu size={24} />
      </SheetTrigger>
      <SheetContent side="left" className={`${styles.sheetPanel} w-[86vw] max-w-sm`}>
        <SheetTitle className="mt-6 text-xl font-medium">Neler keşfetmek istersin?</SheetTitle>
        <SheetDescription className="text-xs">Okula, masaya, hayallerine.</SheetDescription>
        <nav aria-label="Mobil kategori menüsü" className={styles.mobileNav}>
          <Link href="/urunler" onClick={close} className={styles.mobileNavAll}>
            Tüm ürünler
            <ArrowUpRight size={15} className="ml-auto" aria-hidden="true" />
          </Link>
          {categories.map((category) => (
            <Link key={category.id} href={`/kategori/${category.slug}`} onClick={close}>
              {category.name}
              <span className={styles.mobileNavCount}>{category.count.toLocaleString("tr-TR")}</span>
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
