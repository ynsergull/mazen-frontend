"use client";

import { SlidersHorizontal } from "lucide-react";
import type { ReactNode } from "react";

import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

import styles from "./storefront.module.css";

/** Mobilde filtreleri yan panelde gosterir; icerik sunucuda uretilir. */
export function FilterSheet({ children, activeCount }: { children: ReactNode; activeCount: number }) {
  return (
    <Sheet>
      <SheetTrigger render={<button type="button" className={styles.filterButton} />}>
        <SlidersHorizontal size={15} aria-hidden="true" />
        Filtreler
        {activeCount > 0 && <span className={styles.chipCount}>({activeCount})</span>}
      </SheetTrigger>
      <SheetContent side="left" className={`${styles.sheetPanel} w-[88vw] max-w-sm`}>
        <SheetTitle className="mt-6 text-lg font-medium">Filtreler</SheetTitle>
        <SheetDescription className="text-xs">
          Seçim yaptığında liste hemen güncellenir.
        </SheetDescription>
        <div className="mt-4">{children}</div>
      </SheetContent>
    </Sheet>
  );
}
