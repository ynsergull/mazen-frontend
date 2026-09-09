"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SearchForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const term = query.trim();
    if (term.length >= 2) router.push(`/arama?q=${encodeURIComponent(term)}`);
  }

  return (
    <form onSubmit={onSubmit} role="search" className="flex w-full gap-2">
      <Input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ürün, marka veya barkod ara..."
        aria-label="Ara"
        className="h-10"
      />
      <Button type="submit" size="icon" className="h-10 w-10 shrink-0" aria-label="Ara">
        <Search className="size-4" />
      </Button>
    </form>
  );
}
