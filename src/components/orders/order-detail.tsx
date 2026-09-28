"use client";

import { CatalogImage as Image } from "@/components/site/catalog-image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, ImageOff, Loader2, PackageSearch, XCircle } from "lucide-react";

import { useAuth } from "@/components/auth/auth-provider";
import { useCart } from "@/components/cart/cart-provider";
import { formatDateTime, orderStatusClass } from "@/components/orders/order-status";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiError } from "@/lib/api-client";
import { formatPrice } from "@/lib/format";
import { ordersApi } from "@/lib/orders-client";
import type { Order, OrderAddress } from "@/types/api";

import styles from "@/components/site/storefront.module.css";

function AddressBlock({ title, address }: { title: string; address: OrderAddress | null }) {
  if (!address) return null;
  return (
    <div className="text-sm">
      <h3 className="mb-1 font-semibold">{title}</h3>
      <p>{address.first_name} {address.last_name}{address.phone ? ` · ${address.phone}` : ""}</p>
      <p className="text-muted-foreground">{address.address_line}</p>
      <p className="text-muted-foreground">{address.district} / {address.province}{address.postal_code ? ` · ${address.postal_code}` : ""}</p>
      {address.invoice_type === "corporate" && (
        <p className="text-xs text-muted-foreground">{address.company_name} · VD {address.tax_office} · VN {address.tax_number_masked}</p>
      )}
    </div>
  );
}

function OutcomeBanner({ outcome, order }: { outcome: string | null; order: Order }) {
  if (order.payment_status === "paid" || order.status === "paid") {
    return (
      <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
        <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
        <div>
          <p className="font-semibold">Ödemeniz alındı, teşekkürler!</p>
          <p>Sipariş onayınızı <strong>{order.customer_email}</strong> adresine gönderdik. Kargoya verildiğinde takip numarasını yine e-posta ile ileteceğiz.</p>
        </div>
      </div>
    );
  }
  if (outcome === "basarisiz" || outcome === "hata" || order.payment_status === "failed") {
    return (
      <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-900">
        <XCircle className="mt-0.5 size-5 shrink-0" />
        <div>
          <p className="font-semibold">{outcome === "hata" ? "Ödeme sonucu alınamadı" : "Ödeme alınamadı"}</p>
          <p>Bankanız işlemi onaylamadı ya da işlem yarıda kaldı. Kartınızdan para çekilmedi; aşağıdan yeniden deneyebilirsiniz.</p>
        </div>
      </div>
    );
  }
  return null;
}

export function OrderDetail({ publicId }: { publicId: string }) {
  const params = useSearchParams();
  const router = useRouter();
  const outcome = params.get("odeme");
  const { user, loading: authLoading } = useAuth();
  const { refresh: refreshCart } = useCart();

  const [order, setOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "notfound" | "error">("loading");
  const [attempt, setAttempt] = useState(0);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  // Uye siparisi giris gerektirir: oturum durumu belli olmadan sorma. "Tekrar dene" attempt'i artirir.
  useEffect(() => {
    if (authLoading) return;
    let active = true;
    ordersApi.get(publicId)
      .then((loaded) => {
        if (!active) return;
        setOrder(loaded);
        setStatus("ready");
      })
      .catch((e) => {
        if (!active) return;
        setStatus(e instanceof ApiError && (e.status === 404 || e.status === 401) ? "notfound" : "error");
      });
    return () => {
      active = false;
    };
  }, [authLoading, publicId, attempt]);

  const reload = useCallback(() => {
    setStatus("loading");
    setAttempt((n) => n + 1);
  }, []);

  // Odeme sonrasi sepet sunucuda bosaldi; rozet guncellensin
  useEffect(() => {
    if (outcome === "basarili") void refreshCart();
  }, [outcome, refreshCart]);

  async function retry() {
    setPaying(true);
    setPayError(null);
    try {
      const payment = await ordersApi.pay(publicId);
      window.location.assign(payment.page_url);
    } catch (e) {
      setPayError(e instanceof ApiError ? e.firstMessage : "Ödeme başlatılamadı.");
      setPaying(false);
    }
  }

  if (status === "loading" || authLoading) {
    return <div className="space-y-3"><Skeleton className="h-20 w-full" /><Skeleton className="h-64 w-full" /></div>;
  }

  if (status === "notfound") {
    return (
      <div className={styles.emptyState}>
        <PackageSearch aria-hidden="true" />
        <h2>Sipariş bulunamadı</h2>
        <p>
          {user
            ? "Bu sipariş hesabınıza ait değil ya da bağlantı hatalı."
            : "Bu siparişi görmek için sipariş verdiğiniz hesapla giriş yapın."}
        </p>
        {user ? (
          <Link href="/hesap/siparisler" className={styles.textLink}>Siparişlerime git</Link>
        ) : (
          <Button nativeButton={false} render={<Link href={`/giris?next=${encodeURIComponent(`/siparis/${publicId}`)}`} />}>Giriş yap</Button>
        )}
      </div>
    );
  }

  if (status === "error" || !order) {
    return (
      <div className={styles.emptyState}>
        <XCircle aria-hidden="true" />
        <h2>Sipariş yüklenemedi</h2>
        <p>Bağlantıda bir sorun oldu.</p>
        <Button variant="outline" onClick={reload}>Tekrar dene</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <OutcomeBanner outcome={outcome} order={order} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Sipariş no</p>
          <p className="text-lg font-semibold">{order.number}</p>
          <p className="text-xs text-muted-foreground">{formatDateTime(order.placed_at ?? order.created_at)}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${orderStatusClass(order.status)}`}>{order.status_label}</span>
      </div>

      {order.can_pay && (
        <Card>
          <CardContent className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm">
              <p className="font-semibold">Ödeme bekleniyor</p>
              <p className="text-muted-foreground">Ürünler {order.expires_at ? formatDateTime(order.expires_at) : "kısa bir süre"} tarihine kadar sizin için ayrıldı.</p>
              {payError && <p className="mt-1 text-xs text-destructive" role="alert">{payError}</p>}
            </div>
            <Button onClick={retry} disabled={paying}>
              {paying && <Loader2 className="size-4 animate-spin" />}
              {paying ? "Ödeme sayfası açılıyor..." : `Ödemeyi tamamla · ${formatPrice(order.grand_total)}`}
            </Button>
          </CardContent>
        </Card>
      )}

      {order.shipments.length > 0 && (
        <Card>
          <CardContent className="space-y-1 text-sm">
            <h3 className="font-semibold">Kargo</h3>
            {order.shipments.map((shipment, index) => (
              <p key={index}>
                {shipment.carrier ?? "Kargo"} · Takip no: <strong>{shipment.tracking_number ?? "—"}</strong>
                {shipment.shipped_at ? ` · ${formatDateTime(shipment.shipped_at)}` : ""}
                {shipment.delivered_at ? ` · Teslim: ${formatDateTime(shipment.delivered_at)}` : ""}
              </p>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card className="py-0">
          <CardContent className="divide-y p-0">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-4 p-3">
                <div className="relative size-16 shrink-0 overflow-hidden rounded-md border bg-white">
                  {item.product?.image ? (
                    <Image src={item.product.image.thumb} alt={item.name} fill sizes="64px" className="object-contain p-1" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground"><ImageOff className="size-5" /></div>
                  )}
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-1 text-sm">
                  {item.product ? (
                    <Link href={`/urun/${item.product.slug}`} className="line-clamp-2 font-medium hover:underline">{item.name}</Link>
                  ) : (
                    <span className="line-clamp-2 font-medium">{item.name}</span>
                  )}
                  <span className="text-xs text-muted-foreground">Ürün kodu: {item.sku}</span>
                  <div className="mt-auto flex justify-between">
                    <span className="text-muted-foreground">{item.quantity} × {formatPrice(item.unit_price)}</span>
                    <span className="font-semibold">{formatPrice(item.line_total)}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardContent className="space-y-3">
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between"><dt>Ara toplam</dt><dd>{formatPrice(order.subtotal)}</dd></div>
                <div className="flex justify-between"><dt>Kargo</dt><dd>{order.shipping_total === 0 ? "Ücretsiz" : formatPrice(order.shipping_total)}</dd></div>
                <Separator />
                <div className="flex justify-between text-base font-semibold"><dt>Toplam</dt><dd>{formatPrice(order.grand_total)}</dd></div>
                <div className="flex justify-between text-xs text-muted-foreground"><dt>KDV (dahil)</dt><dd>{formatPrice(order.tax_total)}</dd></div>
              </dl>
              {order.payment && (
                <p className="text-xs text-muted-foreground">
                  Ödeme: {order.payment.card_association ?? "Kart"} {order.payment.card_last_four ? `**** ${order.payment.card_last_four}` : ""}
                  {order.payment.installment > 1 ? ` · ${order.payment.installment} taksit` : " · tek çekim"}
                </p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-4">
              <AddressBlock title="Teslimat adresi" address={order.shipping_address} />
              <AddressBlock title="Fatura adresi" address={order.billing_address} />
            </CardContent>
          </Card>
          <p className="text-xs text-muted-foreground">
            Sorun mu var? <Link href="/sayfa/iletisim" className="underline">Bize yazın</Link>; iade için{" "}
            <Link href="/sayfa/iade-ve-cayma" className="underline">İade ve cayma</Link> sayfasına bakın.
          </p>
          {!user && (
            <Button variant="outline" className="w-full" onClick={() => router.push("/urunler")}>Alışverişe devam et</Button>
          )}
        </div>
      </div>
    </div>
  );
}
