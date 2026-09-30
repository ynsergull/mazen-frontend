"use client";

import Link from "next/link";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import { Loader2, Lock, MapPin, ShoppingBag } from "lucide-react";

import { AddressFields, type AddressFieldsValue, EMPTY_ADDRESS_FIELDS, toAddressPayload } from "@/components/account/address-fields";
import { useAuth } from "@/components/auth/auth-provider";
import { useCart } from "@/components/cart/cart-provider";
import { Field, FormError } from "@/components/forms/field";
import { AgreementsDialog, useAgreementsDialog } from "@/components/legal/agreements-dialog";
import { IyzicoPayBadge } from "@/components/site/payment-logos";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiError, apiFetch } from "@/lib/api-client";
import { formatPrice } from "@/lib/format";
import { checkoutApi, newIdempotencyKey, ordersApi } from "@/lib/orders-client";
import type { Address, CheckoutInput, StoreInfo } from "@/types/api";

type AddressChoice = { kind: "saved"; id: number } | { kind: "new" };

/** 422 alan hatalarindan "shipping_address.phone" gibi on ekli olanlari ayiklar. */
function scopedErrors(errors: Record<string, string>, prefix: string): Record<string, string> {
  return Object.fromEntries(
    Object.entries(errors)
      .filter(([key]) => key.startsWith(prefix + "."))
      .map(([key, message]) => [key.slice(prefix.length + 1), message]),
  );
}

function AddressPicker({ addresses, choice, onChoose, idPrefix }: {
  addresses: Address[];
  choice: AddressChoice;
  onChoose: (next: AddressChoice) => void;
  idPrefix: string;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {addresses.map((address) => {
        const selected = choice.kind === "saved" && choice.id === address.id;
        return (
          <label
            key={address.id}
            className={`flex cursor-pointer gap-3 rounded-lg border p-3 text-sm ${selected ? "border-primary bg-primary/5" : ""}`}
          >
            <input
              type="radio"
              name={`${idPrefix}choice`}
              className="mt-1"
              checked={selected}
              onChange={() => onChoose({ kind: "saved", id: address.id })}
            />
            <span className="min-w-0">
              <span className="block font-semibold">{address.title}</span>
              <span className="block">{address.first_name} {address.last_name} · {address.phone}</span>
              <span className="block text-muted-foreground">{address.address_line}</span>
              <span className="block text-muted-foreground">{address.district} / {address.province}</span>
              {address.invoice_type === "corporate" && (
                <span className="block text-xs text-muted-foreground">Kurumsal: {address.company_name}</span>
              )}
            </span>
          </label>
        );
      })}
      <label className={`flex cursor-pointer items-center gap-3 rounded-lg border border-dashed p-3 text-sm ${choice.kind === "new" ? "border-primary bg-primary/5" : ""}`}>
        <input type="radio" name={`${idPrefix}choice`} checked={choice.kind === "new"} onChange={() => onChoose({ kind: "new" })} />
        <MapPin className="size-4 text-muted-foreground" /> Yeni adres gir
      </label>
    </div>
  );
}

export function CheckoutForm({ store }: { store: StoreInfo }) {
  const { cart, loading: cartLoading } = useCart();
  const { user, loading: authLoading } = useAuth();

  const [addresses, setAddresses] = useState<Address[] | null>(null);
  const [provinces, setProvinces] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const [shippingChoice, setShippingChoice] = useState<AddressChoice>({ kind: "new" });
  const [shipping, setShipping] = useState<AddressFieldsValue>(EMPTY_ADDRESS_FIELDS);
  const [billingSame, setBillingSame] = useState(true);
  const [billingChoice, setBillingChoice] = useState<AddressChoice>({ kind: "new" });
  const [billing, setBilling] = useState<AddressFieldsValue>(EMPTY_ADDRESS_FIELDS);
  const [saveAddress, setSaveAddress] = useState(true);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);
  // Ayni siparis istegi tekrar giderse (cift tik, ag hatasi) sunucu ayni siparisi dondurur
  const idempotencyKey = useMemo(() => newIdempotencyKey(), []);

  // Iller her zaman; adres defteri yalnizca uye icin
  useEffect(() => {
    let active = true;
    apiFetch<{ provinces: string[] }>("/geo/provinces")
      .then((geo) => active && setProvinces(geo.provinces))
      .catch(() => active && setProvinces([]));
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (authLoading || !user) return;
    let active = true;
    apiFetch<{ data: Address[] }>("/addresses")
      .then((list) => {
        if (!active) return;
        setAddresses(list.data);
        const preferred = list.data.find((a) => a.is_default) ?? list.data[0];
        if (preferred) {
          setShippingChoice({ kind: "saved", id: preferred.id });
          setBillingChoice({ kind: "saved", id: preferred.id });
        }
      })
      .catch(() => active && setAddresses([]));
    return () => {
      active = false;
    };
  }, [user, authLoading]);

  // Misafirin adres defteri yok; uye icin liste gelene kadar bekle
  const loading = cartLoading || authLoading || (user !== null && addresses === null);
  const savedAddresses = user ? (addresses ?? []) : [];

  async function goToPayment(pageUrl: string) {
    window.location.assign(pageUrl);
  }

  async function retryPayment() {
    if (!pendingOrderId) return;
    setBusy(true);
    setError(null);
    try {
      const payment = await ordersApi.pay(pendingOrderId);
      await goToPayment(payment.page_url);
    } catch (e) {
      setError(e instanceof ApiError ? e.firstMessage : "Ödeme başlatılamadı.");
      setBusy(false);
    }
  }

  /** Formdaki alici ve adres secimi: siparis istegi ve sozlesme onizlemesi ayni govdeyi kullanir. */
  function buyerInput(): Omit<CheckoutInput, "idempotency_key" | "accept_terms"> {
    const input: Omit<CheckoutInput, "idempotency_key" | "accept_terms"> = { billing_same_as_shipping: billingSame };
    if (!user) input.email = email;
    if (user && shippingChoice.kind === "saved") {
      input.shipping_address_id = shippingChoice.id;
    } else {
      input.shipping_address = toAddressPayload(shipping);
      if (user) input.save_address = saveAddress;
    }
    if (!billingSame) {
      if (user && billingChoice.kind === "saved") input.billing_address_id = billingChoice.id;
      else input.billing_address = toAddressPayload(billing);
    }
    return input;
  }

  // Sozlesme metni her acilista formdaki guncel alici bilgisi ve sepetle yeniden doldurulur
  const agreements = useAgreementsDialog(() => checkoutApi.agreements(buyerInput()));

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setErrors({});
    setError(null);

    const input: CheckoutInput = { ...buyerInput(), idempotency_key: idempotencyKey, accept_terms: acceptTerms };

    try {
      const result = await checkoutApi.place(input);
      setPendingOrderId(result.order.public_id);
      if (result.payment) {
        await goToPayment(result.payment.page_url);
        return;
      }
      setError(result.payment_error ?? "Ödeme başlatılamadı. Lütfen tekrar deneyin.");
      setBusy(false);
    } catch (e) {
      if (e instanceof ApiError) {
        setErrors(e.fieldErrors);
        setError(e.errors ? (e.fieldErrors.cart ?? e.fieldErrors.accept_terms ?? e.fieldErrors.email ?? "Lütfen işaretli alanları düzeltin.") : e.message);
      } else {
        setError("Sipariş oluşturulamadı. Lütfen tekrar deneyin.");
      }
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-3"><Skeleton className="h-40 w-full" /><Skeleton className="h-64 w-full" /></div>
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  if (cart.items.length === 0 && !pendingOrderId) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <ShoppingBag className="size-12 text-muted-foreground" />
        <h2 className="text-lg font-semibold">Sepetiniz boş</h2>
        <p className="text-sm text-muted-foreground">Ödeme için önce sepetinize ürün ekleyin.</p>
        <Button nativeButton={false} render={<Link href="/urunler" />}>Ürünlere göz at</Button>
      </div>
    );
  }

  const showShippingForm = !user || shippingChoice.kind === "new" || savedAddresses.length === 0;
  const showBillingForm = !billingSame && (!user || billingChoice.kind === "new" || savedAddresses.length === 0);

  return (
    <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <div className="space-y-6">
        {store.checkout?.test_mode && (
          <p className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900">
            <strong>Test modu:</strong> Ödeme altyapısı deneme ortamında çalışıyor; gerçek kartınızdan para çekilmez.
          </p>
        )}
        <FormError message={error} />
        {pendingOrderId && (
          <div className="flex flex-wrap items-center gap-3 rounded-md border px-3 py-2 text-sm">
            <span>Siparişiniz oluşturuldu, ödeme adımı tamamlanmadı.</span>
            <Button type="button" size="sm" disabled={busy} onClick={retryPayment}>Ödemeye devam et</Button>
            <Link href={`/siparis/${pendingOrderId}`} className="text-xs underline">Siparişi görüntüle</Link>
          </div>
        )}

        {!user && (
          <Card>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-semibold">İletişim</h2>
                <p className="text-xs text-muted-foreground">
                  Üye misiniz? <Link href="/giris?next=/odeme" className="underline">Giriş yapın</Link>, adresleriniz otomatik gelsin.
                </p>
              </div>
              <Field label="E-posta" htmlFor="email" error={errors.email} hint="Sipariş onayı ve kargo bilgisi bu adrese gönderilir">
                <Input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </Field>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="space-y-4">
            <h2 className="font-semibold">Teslimat adresi</h2>
            {savedAddresses.length > 0 && (
              <AddressPicker addresses={savedAddresses} choice={shippingChoice} onChoose={setShippingChoice} idPrefix="shipping-" />
            )}
            {errors.shipping_address_id && <p className="text-xs text-destructive" role="alert">{errors.shipping_address_id}</p>}
            {showShippingForm && (
              <>
                <AddressFields value={shipping} onChange={setShipping} errors={scopedErrors(errors, "shipping_address")} provinces={provinces} idPrefix="shipping-" />
                {user && (
                  <label className="flex items-center gap-2 text-sm">
                    <Checkbox checked={saveAddress} onCheckedChange={(checked) => setSaveAddress(checked === true)} />
                    Bu adresi adres defterime kaydet
                  </label>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4">
            <h2 className="font-semibold">Fatura adresi</h2>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox checked={billingSame} onCheckedChange={(checked) => setBillingSame(checked === true)} />
              Teslimat adresiyle aynı
            </label>
            {!billingSame && savedAddresses.length > 0 && (
              <AddressPicker addresses={savedAddresses} choice={billingChoice} onChoose={setBillingChoice} idPrefix="billing-" />
            )}
            {errors.billing_address_id && <p className="text-xs text-destructive" role="alert">{errors.billing_address_id}</p>}
            {showBillingForm && (
              <AddressFields value={billing} onChange={setBilling} errors={scopedErrors(errors, "billing_address")} provinces={provinces} idPrefix="billing-" />
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="h-fit lg:sticky lg:top-24">
        <CardContent className="space-y-4">
          <h2 className="font-semibold">Sipariş özeti</h2>
          <ul className="max-h-64 space-y-2 overflow-y-auto text-sm">
            {cart.items.map((item) => (
              <li key={item.product.id} className="flex justify-between gap-3">
                <span className="line-clamp-2 min-w-0">{item.product.name} <span className="text-muted-foreground">× {item.qty}</span></span>
                <span className="shrink-0 tabular-nums">{formatPrice(item.line_total)}</span>
              </li>
            ))}
          </ul>
          <Separator />
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt>Ara toplam</dt><dd>{formatPrice(cart.subtotal)}</dd></div>
            <div className="flex justify-between"><dt>Kargo</dt><dd>{cart.shipping_fee === 0 ? "Ücretsiz" : formatPrice(cart.shipping_fee)}</dd></div>
            <Separator />
            <div className="flex justify-between text-base font-semibold"><dt>Toplam</dt><dd>{formatPrice(cart.total)}</dd></div>
          </dl>
          <p className="text-xs text-muted-foreground">Tüm fiyatlara KDV dahildir. Kargo: {store.business.dispatch_days ?? "3"} iş günü içinde teslimata verilir.</p>

          <label className="flex items-start gap-2 text-xs leading-relaxed">
            <Checkbox className="mt-0.5" checked={acceptTerms} onCheckedChange={(checked) => setAcceptTerms(checked === true)} />
            <span>
              {/* Metinler alici ve sepet bilgileriyle doldurulmus halde pencerede acilir (Mesafeli Sozlesmeler Yon. m.5) */}
              <span className="whitespace-nowrap">
                <button type="button" className="font-medium underline underline-offset-2" onClick={() => agreements.show("on-bilgilendirme-formu")}>
                  Ön Bilgilendirme Formu
                </button>&rsquo;nu
              </span>{" "}ve{" "}
              <span className="whitespace-nowrap">
                <button type="button" className="font-medium underline underline-offset-2" onClick={() => agreements.show("mesafeli-satis-sozlesmesi")}>
                  Mesafeli Satış Sözleşmesi
                </button>&rsquo;ni
              </span>{" "}okudum, onaylıyorum.
            </span>
          </label>
          {errors.accept_terms && <p className="text-xs text-destructive" role="alert">{errors.accept_terms}</p>}

          <Button type="submit" size="lg" className="w-full" disabled={busy || !acceptTerms}>
            {busy ? <Loader2 className="size-4 animate-spin" /> : <Lock className="size-4" />}
            {busy ? "Ödeme sayfası açılıyor..." : `Güvenli öde · ${formatPrice(cart.total)}`}
          </Button>
          {!acceptTerms && !busy && (
            <p className="text-xs text-muted-foreground">Ödemeye geçmek için sözleşmeleri onaylayın.</p>
          )}
          <IyzicoPayBadge />
          <p className="text-xs text-muted-foreground">
            Kart bilgileriniz iyzico&rsquo;nun güvenli ödeme sayfasında alınır; sitemizde saklanmaz.
          </p>
        </CardContent>
      </Card>

      <AgreementsDialog
        dialog={agreements}
        description="Metinler sepetinizdeki ürünler ve girdiğiniz bilgilerle doldurulmuştur. Siparişten sonra bir kopyası e-posta adresinize gönderilir."
        onAccept={() => setAcceptTerms(true)}
      />
    </form>
  );
}
