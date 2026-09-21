import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { PaginationMeta } from "@/types/api";

import styles from "./storefront.module.css";

/** Gecerli sayfanin cevresinde numaralar, uclarda 1 ve son sayfa; aradakiler "…". */
function pageWindow(current: number, last: number): (number | "gap")[] {
  if (last <= 7) return Array.from({ length: last }, (_, i) => i + 1);

  const pages = new Set<number>([1, last, current]);
  if (current - 1 > 1) pages.add(current - 1);
  if (current + 1 < last) pages.add(current + 1);
  if (current <= 3) pages.add(2).add(3).add(4);
  if (current >= last - 2) pages.add(last - 1).add(last - 2).add(last - 3);

  const sorted = [...pages].filter((page) => page >= 1 && page <= last).sort((a, b) => a - b);
  const result: (number | "gap")[] = [];
  let previous = 0;
  for (const page of sorted) {
    if (previous && page - previous > 1) result.push("gap");
    result.push(page);
    previous = page;
  }
  return result;
}

/** Sayfa numarasini, korunan diger query parametreleriyle birlikte uretir. */
export function Pagination({ meta, basePath, query }: {
  meta: PaginationMeta;
  basePath: string;
  query: Record<string, string | undefined>;
}) {
  if (meta.last_page <= 1) return null;

  const href = (page: number) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (key !== "page" && value) params.set(key, value);
    }
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  const hasPrev = meta.current_page > 1;
  const hasNext = meta.current_page < meta.last_page;

  return (
    <nav className={styles.pagination} aria-label="Sayfalama">
      {hasPrev ? (
        <Link href={href(meta.current_page - 1)} rel="prev" className={styles.pageLink}>
          <ChevronLeft size={15} aria-hidden="true" />
          <span>Önceki</span>
        </Link>
      ) : (
        <span className={`${styles.pageLink} ${styles.pageLinkDisabled}`} aria-hidden="true">
          <ChevronLeft size={15} />
          <span>Önceki</span>
        </span>
      )}

      {pageWindow(meta.current_page, meta.last_page).map((page, index) =>
        page === "gap" ? (
          <span key={`gap-${index}`} className={styles.pageEllipsis} aria-hidden="true">
            …
          </span>
        ) : page === meta.current_page ? (
          <span key={page} className={`${styles.pageLink} ${styles.pageLinkActive}`} aria-current="page">
            {page}
          </span>
        ) : (
          <Link key={page} href={href(page)} className={styles.pageLink} aria-label={`Sayfa ${page}`}>
            {page}
          </Link>
        )
      )}

      {hasNext ? (
        <Link href={href(meta.current_page + 1)} rel="next" className={styles.pageLink}>
          <span>Sonraki</span>
          <ChevronRight size={15} aria-hidden="true" />
        </Link>
      ) : (
        <span className={`${styles.pageLink} ${styles.pageLinkDisabled}`} aria-hidden="true">
          <span>Sonraki</span>
          <ChevronRight size={15} />
        </span>
      )}
    </nav>
  );
}
