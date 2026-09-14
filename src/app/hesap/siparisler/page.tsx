import Link from "next/link";
import { Package } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Siparişlerim</h1>
      {/* Siparis modeli bir sonraki fazda (checkout) geliyor */}
      <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed py-16 text-center">
        <Package className="size-10 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Henüz siparişiniz yok.</p>
        <Button variant="outline" render={<Link href="/" />}>Alışverişe başla</Button>
      </div>
    </div>
  );
}
