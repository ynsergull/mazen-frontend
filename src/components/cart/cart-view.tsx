"use client";

import Image from "next/image";
import Link from "next/link";
import { ImageOff, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/format";

export function CartView() {
  const { cart, loading, error, setQty, remove, clear } = useCart();

  if (loading) {
    return (
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-24 w-full" />)}</div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <ShoppingBag className="size-12 text-muted-foreground" />
        <h2 className="text-lg font-semibold">Sepetiniz boş</h2>
        <p className="text-sm text-muted-foreground">Binlerce kırtasiye ürünü sizi bekliyor.</p>
        <Button render={<Link href="/" />}>Alışverişe başla</Button>
      </div>
    );
  }

  const remaining = Math.max(0, cart.free_shipping_threshold - cart.subtotal);
  const progress = cart.free_shipping_threshold > 0 ? Math.min(100, (cart.subtotal / cart.free_shipping_threshold) * 100) : 100;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-3">
        {error && <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}

        {cart.items.map((item) => (
          <Card key={item.product.id} className="py-0">
            <CardContent className="flex gap-4 p-3">
              <Link href={`/urun/${item.product.slug}`} className="relative size-20 shrink-0 overflow-hidden rounded-md border bg-white">
                {item.product.image ? (
                  <Image src={item.product.image.thumb} alt={item.product.name} fill sizes="80px" className="object-contain p-1" />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground"><ImageOff className="size-5" /></div>
                )}
              </Link>
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                {item.product.brand && <span className="text-xs uppercase text-muted-foreground">{item.product.brand.name}</span>}
                <Link href={`/urun/${item.product.slug}`} className="line-clamp-2 text-sm font-medium hover:underline">{item.product.name}</Link>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center rounded-md border">
                    <Button variant="ghost" size="icon-sm" aria-label="Azalt" onClick={() => setQty(item.product.id, item.qty - 1)}>
                      <Minus className="size-3.5" />
                    </Button>
                    <span className="w-8 text-center text-sm tabular-nums">{item.qty}</span>
                    <Button variant="ghost" size="icon-sm" aria-label="Artır" disabled={item.qty >= item.max_qty} onClick={() => setQty(item.product.id, item.qty + 1)}>
                      <Plus className="size-3.5" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold">{formatPrice(item.line_total)}</span>
                    <Button variant="ghost" size="icon-sm" aria-label="Kaldır" onClick={() => remove(item.product.id)}>
                      <Trash2 className="size-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <button type="button" onClick={clear} className="text-sm text-muted-foreground underline-offset-4 hover:underline">
          Sepeti boşalt
        </button>
      </div>

      <Card className="h-fit lg:sticky lg:top-24">
        <CardContent className="space-y-4">
          <h2 className="font-semibold">Sipariş özeti</h2>
          <div className="space-y-1.5">
            <Progress value={progress} />
            <p className="text-xs text-muted-foreground">
              {remaining > 0
                ? `Ücretsiz kargo için ${formatPrice(remaining)} daha ekleyin`
                : "Kargonuz ücretsiz 🎉"}
            </p>
          </div>
          <Separator />
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt>Ara toplam</dt><dd>{formatPrice(cart.subtotal)}</dd></div>
            <div className="flex justify-between"><dt>Kargo</dt><dd>{cart.shipping_fee === 0 ? "Ücretsiz" : formatPrice(cart.shipping_fee)}</dd></div>
            <Separator />
            <div className="flex justify-between text-base font-semibold"><dt>Toplam</dt><dd>{formatPrice(cart.total)}</dd></div>
          </dl>
          <p className="text-xs text-muted-foreground">Tüm fiyatlara KDV dahildir.</p>
          <Button size="lg" className="w-full" disabled>Ödemeye geç (yakında)</Button>
        </CardContent>
      </Card>
    </div>
  );
}
