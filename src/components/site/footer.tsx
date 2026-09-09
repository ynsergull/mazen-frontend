import Link from "next/link";

const LEGAL_LINKS = [
  { href: "/sayfa/hakkimizda", label: "Hakkımızda" },
  { href: "/sayfa/iletisim", label: "İletişim" },
  { href: "/sayfa/mesafeli-satis-sozlesmesi", label: "Mesafeli Satış Sözleşmesi" },
  { href: "/sayfa/iade-ve-cayma", label: "İade ve Cayma Hakkı" },
  { href: "/sayfa/kvkk", label: "KVKK Aydınlatma Metni" },
  { href: "/sayfa/gizlilik", label: "Gizlilik ve Çerez Politikası" },
];

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t bg-muted/30">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <p className="text-lg font-bold">Mazen Kırtasiye</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Okul, ofis ve hobi için binlerce kırtasiye ürünü. Siparişleriniz 1-3 iş günü içinde kargoda.
          </p>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold">Kurumsal</p>
          <ul className="space-y-1.5">
            {LEGAL_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="text-sm text-muted-foreground">
          <p className="mb-3 font-semibold text-foreground">İşletme Bilgileri</p>
          {/* TODO: unvan, adres, MERSİS/vergi no, ETBİS logosu — yayin oncesi zorunlu */}
          <p>Mazen Kırtasiye</p>
          <p>Adres ve vergi bilgileri yayın öncesi eklenecek.</p>
        </div>
      </div>
      <div className="border-t py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Mazen Kırtasiye — Tüm fiyatlara KDV dahildir.
      </div>
    </footer>
  );
}
