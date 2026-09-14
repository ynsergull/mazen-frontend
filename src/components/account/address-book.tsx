"use client";

import { MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import { AddressForm } from "@/components/account/address-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { apiFetch } from "@/lib/api-client";
import type { Address } from "@/types/api";

type Mode = { kind: "list" } | { kind: "create" } | { kind: "edit"; address: Address };

export function AddressBook() {
  const [addresses, setAddresses] = useState<Address[] | null>(null);
  const [provinces, setProvinces] = useState<string[]>([]);
  const [mode, setMode] = useState<Mode>({ kind: "list" });

  useEffect(() => {
    let active = true;
    Promise.all([
      apiFetch<{ data: Address[] }>("/addresses"),
      apiFetch<{ provinces: string[] }>("/geo/provinces"),
    ])
      .then(([list, geo]) => {
        if (!active) return;
        setAddresses(list.data);
        setProvinces(geo.provinces);
      })
      .catch(() => active && setAddresses([]));
    return () => {
      active = false;
    };
  }, []);

  async function reload() {
    const list = await apiFetch<{ data: Address[] }>("/addresses");
    setAddresses(list.data);
  }

  async function onDelete(address: Address) {
    if (!confirm(`"${address.title}" adresi silinsin mi?`)) return;
    await apiFetch(`/addresses/${address.id}`, { method: "DELETE" });
    await reload();
  }

  if (addresses === null) {
    return <div className="space-y-3"><Skeleton className="h-28 w-full" /><Skeleton className="h-28 w-full" /></div>;
  }

  if (mode.kind !== "list") {
    return (
      <Card>
        <CardContent>
          <h2 className="mb-4 font-semibold">{mode.kind === "edit" ? "Adresi düzenle" : "Yeni adres"}</h2>
          <AddressForm
            address={mode.kind === "edit" ? mode.address : undefined}
            provinces={provinces}
            onSaved={async () => {
              await reload();
              setMode({ kind: "list" });
            }}
            onCancel={() => setMode({ kind: "list" })}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setMode({ kind: "create" })}><Plus className="size-4" /> Yeni adres</Button>
      </div>

      {addresses.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed py-14 text-center">
          <MapPin className="size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Henüz kayıtlı adresiniz yok.</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {addresses.map((address) => (
            <Card key={address.id} className="py-0">
              <CardContent className="space-y-2 p-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{address.title}</span>
                  {address.is_default && <Badge variant="secondary">Varsayılan</Badge>}
                </div>
                <p>{address.first_name} {address.last_name} · {address.phone}</p>
                <p className="text-muted-foreground">{address.address_line}</p>
                <p className="text-muted-foreground">{address.district} / {address.province}{address.postal_code ? ` · ${address.postal_code}` : ""}</p>
                {address.invoice_type === "corporate" && (
                  <p className="text-xs text-muted-foreground">Kurumsal: {address.company_name} · VD {address.tax_office} · VN {address.tax_number}</p>
                )}
                <div className="flex gap-1 pt-1">
                  <Button variant="ghost" size="sm" onClick={() => setMode({ kind: "edit", address })}><Pencil className="size-3.5" /> Düzenle</Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(address)}><Trash2 className="size-3.5" /> Sil</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
