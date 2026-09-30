"use client";

import { useCallback, useRef, useState } from "react";
import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiError } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import type { AgreementDocument } from "@/types/api";

import styles from "@/components/site/storefront.module.css";

/** Odeme adiminda onaylatilan metinler; baslik yuklenmeden once de sekmede gorunsun diye sabit. */
export const CHECKOUT_AGREEMENTS = [
  { slug: "on-bilgilendirme-formu", title: "Ön Bilgilendirme Formu" },
  { slug: "mesafeli-satis-sozlesmesi", title: "Mesafeli Satış Sözleşmesi" },
] as const;

type State = { open: boolean; active: string; docs: AgreementDocument[] | null; error: string | null };

/**
 * Sozlesme penceresi durumu. Pencere hemen acilir, metin arkadan yuklenir. cache=false iken
 * (odeme ekrani) her acilista yeniden istenir: metin formdaki guncel adres ve sepetle doldurulur.
 */
export function useAgreementsDialog(fetcher: () => Promise<AgreementDocument[]>, { cache = false } = {}) {
  const [state, setState] = useState<State>({ open: false, active: CHECKOUT_AGREEMENTS[0].slug, docs: null, error: null });
  const request = useRef(0);

  const load = useCallback(async (active: string, cached: AgreementDocument[] | null) => {
    const id = ++request.current;
    if (cached) {
      setState({ open: true, active, docs: cached, error: null });
      return;
    }
    setState({ open: true, active, docs: null, error: null });
    try {
      const docs = await fetcher();
      if (id === request.current) setState((current) => ({ ...current, docs }));
    } catch (error) {
      if (id === request.current) {
        setState((current) => ({ ...current, error: error instanceof ApiError ? error.firstMessage : "Metin yüklenemedi. Bağlantınızı kontrol edip tekrar deneyin." }));
      }
    }
  }, [fetcher]);

  return {
    state,
    show: (slug: string) => void load(slug, cache ? state.docs : null),
    retry: () => void load(state.active, null),
    select: (slug: string) => setState((current) => ({ ...current, active: slug })),
    close: () => setState((current) => ({ ...current, open: false })),
  };
}

export function AgreementsDialog({ dialog, description, onAccept }: {
  dialog: ReturnType<typeof useAgreementsDialog>;
  description: string;
  /** Verilirse "Okudum, onaylıyorum" dugmesi gosterilir (odeme ekrani) */
  onAccept?: () => void;
}) {
  const { state } = dialog;
  const tabs = state.docs?.map(({ slug, title }) => ({ slug, title })) ?? CHECKOUT_AGREEMENTS;
  const doc = state.docs?.find((item) => item.slug === state.active) ?? state.docs?.[0];

  return (
    <Dialog open={state.open} onOpenChange={(open) => !open && dialog.close()}>
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 p-0 sm:max-w-3xl">
        <DialogHeader className="gap-3 border-b p-4 pr-12">
          <DialogTitle>Sözleşmeler</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
          <div role="tablist" aria-label="Metinler" className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.slug}
                type="button"
                role="tab"
                aria-selected={state.active === tab.slug}
                onClick={() => dialog.select(tab.slug)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  state.active === tab.slug ? "border-primary bg-primary text-primary-foreground" : "hover:bg-muted",
                )}
              >
                {tab.title}
              </button>
            ))}
          </div>
        </DialogHeader>

        <div role="tabpanel" className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6" aria-busy={!state.docs && !state.error}>
          {state.error ? (
            <div className="flex flex-col items-start gap-3 text-sm" role="alert">
              <p className="flex items-center gap-2 text-destructive"><AlertCircle className="size-4" /> {state.error}</p>
              <Button type="button" variant="outline" size="sm" onClick={dialog.retry}>Tekrar dene</Button>
            </div>
          ) : doc ? (
            <div className={styles.prose}>
              <h2 className="!mt-0">{doc.title}</h2>
              {doc.accepted_at && (
                <p className="text-xs text-muted-foreground">
                  Onay: {new Date(doc.accepted_at).toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" })} · Metin sürümü {doc.version}
                </p>
              )}
              {/* Metin sunucuda temizlenip degerler kacislanarak doldurulur */}
              <article className="mt-4" dangerouslySetInnerHTML={{ __html: doc.html }} />
            </div>
          ) : (
            <div className="space-y-3" aria-label="Metin yükleniyor">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          )}
        </div>

        <DialogFooter className="m-0 rounded-b-xl">
          <DialogClose render={<Button type="button" variant="outline" />}>Kapat</DialogClose>
          {onAccept && (
            <Button type="button" disabled={!state.docs} onClick={() => { onAccept(); dialog.close(); }}>
              Okudum, onaylıyorum
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
