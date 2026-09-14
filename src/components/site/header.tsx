import Link from "next/link";
import { Menu } from "lucide-react";

import { UserMenu } from "@/components/auth/user-menu";
import { CartBadge } from "@/components/cart/cart-badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { getCategoryTree } from "@/lib/api";
import { SearchForm } from "@/components/site/search-form";

export async function SiteHeader() {
  const categories = await getCategoryTree();
  const topLevel = categories.filter((c) => (c.product_count ?? 0) > 0);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
        <Sheet>
          <SheetTrigger render={<Button variant="ghost" size="icon" className="lg:hidden" aria-label="Menü" />}>
            <Menu className="size-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-80 overflow-y-auto">
            <SheetTitle className="mb-4">Kategoriler</SheetTitle>
            <nav className="flex flex-col gap-1">
              {topLevel.map((category) => (
                <Link
                  key={category.id}
                  href={`/kategori/${category.slug}`}
                  className="rounded-md px-3 py-2 text-sm hover:bg-accent"
                >
                  {category.name}
                  <span className="ml-2 text-xs text-muted-foreground">{category.product_count}</span>
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        <Link href="/" className="shrink-0 text-lg font-bold tracking-tight">
          Mazen <span className="text-primary">Kırtasiye</span>
        </Link>

        <div className="mx-auto hidden w-full max-w-xl md:block">
          <SearchForm />
        </div>

        <div className="ml-auto flex items-center gap-1">
          <UserMenu />
          <CartBadge />
        </div>
      </div>

      <div className="border-t md:hidden">
        <div className="mx-auto max-w-7xl px-4 py-2">
          <SearchForm />
        </div>
      </div>

      <nav className="hidden border-t lg:block">
        <ul className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4">
          {topLevel.map((category) => (
            <li key={category.id}>
              <Link
                href={`/kategori/${category.slug}`}
                className="block whitespace-nowrap px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
