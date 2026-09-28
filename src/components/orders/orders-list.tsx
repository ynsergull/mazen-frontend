"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronRight, PackageSearch } from "lucide-react";

import { formatDateTime, orderStatusClass } from "@/components/orders/order-status";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/format";
import { ordersApi } from "@/lib/orders-client";
import type { OrderSummary } from "@/types/api";

import styles from "@/components/site/storefront.module.css";

export function OrdersList() {
  const [orders, setOrders] = useState<OrderSummary[] | null>(null);

  useEffect(() => {
    let active = true;
    ordersApi.list()
      .then((list) => active && setOrders(list))
      .catch(() => active && setOrders([]));
    return () => {
      active = false;
    };
  }, []);

  if (orders === null) {
    return <div className="space-y-3"><Skeleton className="h-20 w-full" /><Skeleton className="h-20 w-full" /></div>;
  }

  if (orders.length === 0) {
    return (
      <div className={styles.emptyState}>
        <PackageSearch aria-hidden="true" />
        <h2>Henüz siparişin yok.</h2>
        <p>Beğendiklerini sepetine ekle, birkaç adımda sipariş ver.</p>
        <Link href="/urunler" className={styles.textLink}>Kataloğa göz at</Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <Card key={order.public_id} className="py-0">
          <CardContent className="p-0">
            <Link href={`/siparis/${order.public_id}`} className="flex items-center gap-4 p-4 text-sm hover:bg-accent/40">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold">{order.number}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${orderStatusClass(order.status)}`}>{order.status_label}</span>
                  {order.can_pay && <span className="text-[11px] text-amber-800">Ödeme bekliyor</span>}
                </div>
                <p className="text-xs text-muted-foreground">{formatDateTime(order.created_at)} · {order.item_count} ürün</p>
              </div>
              <span className="font-semibold tabular-nums">{formatPrice(order.grand_total)}</span>
              <ChevronRight className="size-4 text-muted-foreground" />
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
