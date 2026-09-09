import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { PaginationMeta } from "@/types/api";

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
      if (value) params.set(key, value);
    }
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  const hasPrev = meta.current_page > 1;
  const hasNext = meta.current_page < meta.last_page;

  return (
    <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Sayfalama">
      {hasPrev ? (
        <Button variant="outline" size="sm" render={<Link href={href(meta.current_page - 1)} />}>
          <ChevronLeft className="size-4" /> Önceki
        </Button>
      ) : (
        <Button variant="outline" size="sm" disabled>
          <ChevronLeft className="size-4" /> Önceki
        </Button>
      )}
      <span className="px-3 text-sm text-muted-foreground">
        Sayfa {meta.current_page} / {meta.last_page}
      </span>
      {hasNext ? (
        <Button variant="outline" size="sm" render={<Link href={href(meta.current_page + 1)} />}>
          Sonraki <ChevronRight className="size-4" />
        </Button>
      ) : (
        <Button variant="outline" size="sm" disabled>
          Sonraki <ChevronRight className="size-4" />
        </Button>
      )}
    </nav>
  );
}
