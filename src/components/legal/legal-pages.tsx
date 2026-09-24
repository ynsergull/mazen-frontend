import Link from "next/link";
import type { ReactNode } from "react";

import { formatPrice } from "@/lib/format";
import type { BusinessInfo, StoreInfo } from "@/types/api";

/*
 * Yasal metinler: 6502 sayili Tuketicinin Korunmasi Hakkinda Kanun, Mesafeli Sozlesmeler
 * Yonetmeligi ve 6698 sayili KVKK esas alinarak hazirlandi. Satici bilgileri admin >
 * Isletme bilgileri ekranindan gelir. Metin degisirse UPDATED tarihini de guncelle.
 */

export type LegalPage = { title: string; body: ReactNode };

const UPDATED = "24 Eylül 2026";
const MISSING = "yakında eklenecek";

/** Alt bilgi ve sayfa altindaki gezinme icin sirali liste. */
export const LEGAL_NAV = [
  { slug: "iletisim", label: "İletişim" },
  { slug: "teslimat-ve-kargo", label: "Teslimat ve kargo" },
  { slug: "iade-ve-cayma", label: "İade ve cayma" },
  { slug: "mesafeli-satis-sozlesmesi", label: "Mesafeli satış sözleşmesi" },
  { slug: "on-bilgilendirme-formu", label: "Ön bilgilendirme formu" },
  { slug: "uyelik-sozlesmesi", label: "Üyelik sözleşmesi" },
  { slug: "kvkk", label: "KVKK aydınlatma metni" },
  { slug: "cerez-politikasi", label: "Çerez politikası" },
] as const;

export type LegalSlug = (typeof LEGAL_NAV)[number]["slug"];

export function legalUpdatedAt(): string {
  return UPDATED;
}

type Ctx = {
  b: BusinessInfo;
  seller: string;
  site: string;
  contact: string;
  fee: string;
  threshold: string;
  dispatch: string;
};

function makeCtx(store: StoreInfo | null): Ctx {
  const b: BusinessInfo = store?.business ?? {
    seller_name: null, brand_name: "Mazen Kırtasiye", address: null, tax_office: null, tax_number: null,
    mersis: null, phone: null, email: null, kep: null, return_address: null, dispatch_days: null,
  };
  const brand = b.brand_name ?? "Mazen Kırtasiye";
  const seller = b.seller_name ? `${b.seller_name} – ${brand}` : brand;
  const contactParts = [b.email && `e-posta: ${b.email}`, b.phone && `telefon: ${b.phone}`].filter(Boolean);
  return {
    b,
    seller,
    site: "mazenkirtasiye.com",
    contact: contactParts.length ? contactParts.join(", ") : `iletişim bilgilerimiz (${MISSING})`,
    fee: store ? formatPrice(store.shipping.fee) : "sepette gösterilen tutar",
    threshold: store ? formatPrice(store.shipping.free_threshold) : "",
    dispatch: b.dispatch_days ?? "3",
  };
}

function SellerTable({ b, title = "Satıcı bilgileri" }: { b: BusinessInfo; title?: string }) {
  const rows: [string, string | null][] = [
    ["Satıcı", b.seller_name],
    ["Mağaza adı", b.brand_name],
    ["Adres", b.address],
    ["Vergi dairesi / no", b.tax_office && b.tax_number ? `${b.tax_office} / ${b.tax_number}` : null],
    ["MERSİS no", b.mersis],
    ["Telefon", b.phone],
    ["E-posta", b.email],
    ["KEP adresi", b.kep],
  ];
  return (
    <div>
      <h2>{title}</h2>
      <dl>
        {rows
          .filter(([label, value]) => value || !["MERSİS no", "KEP adresi"].includes(label))
          .map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value ?? MISSING}</dd>
            </div>
          ))}
      </dl>
    </div>
  );
}

function WithdrawalExceptions() {
  return (
    <ul>
      <li>Tüketicinin istekleri veya kişisel ihtiyaçları doğrultusunda hazırlanan, kişiye özel ürünler (baskılı, isim yazılı ürünler vb.),</li>
      <li>Teslimden sonra ambalajı, bandı, mührü veya paketi açılmış olup iadesi sağlık ve hijyen açısından uygun olmayan ürünler,</li>
      <li>Ambalajı tüketici tarafından açılmış kitaplar, dijital içerikler ve bilgisayar sarf malzemeleri,</li>
      <li>Teslimden sonra başka ürünlerle karışan ve doğası gereği ayrıştırılması mümkün olmayan ürünler,</li>
      <li>Süreli yayınlar (gazete, dergi vb.; abonelik sözleşmesiyle sağlananlar hariç).</li>
    </ul>
  );
}

function Complaints() {
  return (
    <p>
      Şikâyet ve itirazlarınızı öncelikle bize iletebilirsiniz. Uyuşmazlık halinde, Ticaret Bakanlığınca her yıl
      ilan edilen parasal sınırlar dahilinde yerleşim yerinizdeki veya işlemin yapıldığı yerdeki{" "}
      <strong>Tüketici Hakem Heyetine</strong>, bu sınırların üzerindeki uyuşmazlıklarda{" "}
      <strong>Tüketici Mahkemesine</strong> başvurabilirsiniz. Başvurular e-Devlet üzerinden Tüketici Bilgi
      Sistemi (TÜBİS) ile de yapılabilir.
    </p>
  );
}

const pages: Record<LegalSlug, (c: Ctx) => LegalPage> = {
  iletisim: ({ b }) => ({
    title: "İletişim",
    body: (
      <>
        <p>Siparişin, bir ürün ya da iade hakkında soruların için bize aşağıdaki kanallardan ulaşabilirsin.</p>
        <SellerTable b={b} title="İşletme bilgileri" />
        <h2>İade adresi</h2>
        <p>{b.return_address ?? MISSING}</p>
        <p>
          İade göndermeden önce lütfen <Link href="/sayfa/iade-ve-cayma">İade ve cayma</Link> sayfasındaki adımları
          izle; paketin daha hızlı işleme alınır.
        </p>
      </>
    ),
  }),

  "mesafeli-satis-sozlesmesi": ({ b, seller, site, dispatch }) => ({
    title: "Mesafeli Satış Sözleşmesi",
    body: (
      <>
        <p>
          Bu sözleşme, 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği uyarınca,
          {" "}{site} üzerinden verilen siparişlere ilişkin tarafların hak ve yükümlülüklerini düzenler. Sipariş
          sırasında sözleşmenin bu hali, alıcı ve sipariş bilgileriyle doldurularak onayınıza sunulur ve siparişten
          sonra e-posta ile gönderilir.
        </p>
        <h2>Madde 1 – Taraflar</h2>
        <SellerTable b={b} title="1.1 Satıcı" />
        <h2>1.2 Alıcı</h2>
        <p>Sipariş sırasında beyan edilen ad soyad, teslimat ve fatura adresi, telefon ve e-posta bilgileri.</p>
        <h2>Madde 2 – Konu</h2>
        <p>
          Sözleşmenin konusu, alıcının {site} üzerinden elektronik ortamda siparişini verdiği, nitelikleri ve satış
          fiyatı sipariş özetinde belirtilen ürünlerin satışı ve teslimidir.
        </p>
        <h2>Madde 3 – Ürün, fiyat ve ödeme</h2>
        <ul>
          <li>Ürünlerin temel nitelikleri, adedi, KDV dahil satış fiyatı, kargo ücreti ve toplam tutar sipariş özetinde ve ön bilgilendirme formunda yer alır; bu bilgiler sözleşmenin ayrılmaz parçasıdır.</li>
          <li>Tüm fiyatlara KDV dahildir. Sitede ilan edilen fiyatlar, sipariş tamamlanana kadar değişebilir; sipariş anındaki fiyat geçerlidir.</li>
          <li>Kartla yapılan ödemeler lisanslı ödeme kuruluşu iyzico altyapısı ile 3D Secure doğrulamalı olarak alınır. Kart bilgileri satıcı tarafından görülmez ve saklanmaz.</li>
        </ul>
        <h2>Madde 4 – Teslimat</h2>
        <ul>
          <li>Satıcı, ödemesi onaylanan siparişi en geç <strong>{dispatch} iş günü</strong> içinde kargoya teslim eder. Teslim süresi hiçbir durumda sipariş tarihinden itibaren yasal üst sınır olan 30 günü aşamaz.</li>
          <li>Ürün, alıcının belirttiği teslimat adresine kargo ile gönderilir. Alıcının adreste bulunmaması halinde satıcı sorumlu tutulamaz.</li>
          <li>Alıcı, teslim sırasında paketi kontrol etmeli; hasarlı pakette kargo görevlisine tutanak tutturarak teslim almamalıdır.</li>
          <li>Sipariş konusu ürünün tedarikinin imkânsızlaşması halinde satıcı bu durumu öğrendiği tarihten itibaren 3 gün içinde alıcıya bildirir ve tahsil edilen tüm tutarı en geç 14 gün içinde iade eder.</li>
        </ul>
        <h2>Madde 5 – Cayma hakkı</h2>
        <ul>
          <li>Alıcı, ürünün kendisine veya gösterdiği kişiye teslim tarihinden itibaren <strong>14 gün</strong> içinde herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin sözleşmeden cayabilir.</li>
          <li>Cayma bildirimi, süre dolmadan satıcıya {b.email ? `${b.email} adresine e-posta ile` : "e-posta ile"} veya yazılı olarak yapılır.</li>
          <li>Alıcı, cayma bildiriminden itibaren 10 gün içinde ürünü satıcıya geri gönderir. Satıcının belirttiği kargo firmasıyla yapılan iadelerde kargo ücreti satıcıya aittir.</li>
          <li>Satıcı, cayma bildiriminin kendisine ulaşmasından itibaren 14 gün içinde ürün bedeli ve varsa teslimat masrafı dahil tahsil edilen tüm ödemeleri, alıcının ödeme yaptığı araca uygun şekilde iade eder.</li>
          <li>Alıcı, ürünü olağan kullanımı dışında kullanmasından kaynaklanan değişiklik ve bozulmalardan sorumludur.</li>
        </ul>
        <h2>Madde 6 – Cayma hakkının kullanılamayacağı ürünler</h2>
        <WithdrawalExceptions />
        <h2>Madde 7 – Ayıplı ürün</h2>
        <p>
          Teslim edilen ürün ayıplı ise alıcı, 6502 sayılı Kanunun 11. maddesindeki seçimlik haklarını (sözleşmeden
          dönme, bedel indirimi, ücretsiz onarım veya ayıpsız misli ile değişim) kullanabilir. Ayıplı ürünün iade
          masrafları satıcıya aittir.
        </p>
        <h2>Madde 8 – Uyuşmazlıkların çözümü</h2>
        <Complaints />
        <h2>Madde 9 – Yürürlük</h2>
        <p>
          Alıcı, siparişi onaylamadan önce ön bilgilendirme formunu ve bu sözleşmeyi okuduğunu elektronik ortamda
          onaylar. Sözleşme, siparişin onaylanmasıyla kurulur. Satıcı: {seller}.
        </p>
      </>
    ),
  }),

  "on-bilgilendirme-formu": ({ b, site, dispatch, fee, threshold }) => ({
    title: "Ön Bilgilendirme Formu",
    body: (
      <>
        <p>
          Mesafeli Sözleşmeler Yönetmeliği uyarınca, siparişi onaylamadan önce aşağıdaki bilgileri okumanız gerekir.
          Sipariş sırasında bu form, sepetinizdeki ürünler ve tutarlarla doldurularak gösterilir.
        </p>
        <SellerTable b={b} />
        <h2>Ürün ve fiyat bilgileri</h2>
        <ul>
          <li>Ürünlerin temel nitelikleri ürün sayfasında, adet ve KDV dahil satış fiyatları sipariş özetinde yer alır.</li>
          <li>Kargo ücreti {fee}{threshold ? `; ${threshold} ve üzeri siparişlerde kargo ücretsizdir` : ""}. Toplam ödenecek tutar sipariş özetinde gösterilir.</li>
          <li>Ödeme, kredi veya banka kartı ile iyzico altyapısı üzerinden alınır.</li>
        </ul>
        <h2>Teslimat</h2>
        <p>
          Sipariş, ödeme onayından itibaren en geç {dispatch} iş günü içinde kargoya verilir ve alıcının belirttiği
          adrese teslim edilir. Teslim süresi 30 günü aşamaz.
        </p>
        <h2>Cayma hakkı</h2>
        <p>
          Ürünün tesliminden itibaren 14 gün içinde gerekçe göstermeden cayma hakkınız vardır. Cayma bildiriminizi
          {b.email ? ` ${b.email} adresine` : " e-posta ile"} iletebilirsiniz. Ayrıntılar için{" "}
          <Link href="/sayfa/iade-ve-cayma">İade ve cayma</Link> sayfasına bakınız. Aşağıdaki ürünlerde cayma
          hakkı kullanılamaz:
        </p>
        <WithdrawalExceptions />
        <h2>Şikâyet ve başvuru yolları</h2>
        <Complaints />
        <p>Bu form, {site} üzerinden verilen tüm siparişler için geçerlidir.</p>
      </>
    ),
  }),

  "iade-ve-cayma": ({ b }) => ({
    title: "İade ve Cayma",
    body: (
      <>
        <p>
          Aldığın ürünü teslimden itibaren <strong>14 gün</strong> içinde, gerekçe göstermeden iade edebilirsin.
        </p>
        <h2>Nasıl iade ederim?</h2>
        <ol>
          <li>
            {b.email ? <strong>{b.email}</strong> : "Müşteri hizmetleri e-posta adresimize"} adresine sipariş numaranı
            ve iade etmek istediğin ürünleri yaz.
          </li>
          <li>Sana anlaşmalı kargo firmamızın iade bilgisini gönderelim. Bu şekilde gönderilen iadelerde kargo ücreti bize aittir.</li>
          <li>Ürünü, mümkünse orijinal ambalajı ve faturasıyla birlikte, bildirimden sonraki 10 gün içinde kargoya ver.</li>
          <li>Ürün bize ulaşıp kontrol edildikten sonra ödemen, cayma bildiriminden itibaren en geç 14 gün içinde ödeme yaptığın karta iade edilir. Tutarın kart hesabına yansıma süresi bankana bağlıdır.</li>
        </ol>
        <h2>İade adresi</h2>
        <p>{b.return_address ?? MISSING}</p>
        <h2>İade edilemeyen ürünler</h2>
        <WithdrawalExceptions />
        <h2>Hasarlı veya hatalı ürün</h2>
        <p>
          Paket hasarlı geldiyse kargo görevlisine tutanak tutturarak teslim alma. Ürün hatalı veya eksik çıktıysa
          fotoğrafıyla birlikte bize yaz; değişim, onarım, bedel indirimi veya iade seçeneklerinden birini
          kullanabilirsin. Bu durumda tüm kargo masrafları bize aittir.
        </p>
      </>
    ),
  }),

  "teslimat-ve-kargo": ({ dispatch, fee, threshold }) => ({
    title: "Teslimat ve Kargo",
    body: (
      <>
        <ul>
          <li>Türkiye’nin her yerine kargo ile gönderim yapıyoruz.</li>
          <li>Kargo ücreti {fee}{threshold ? `; ${threshold} ve üzeri siparişlerde kargo ücretsiz` : ""}.</li>
          <li>Siparişin, ödemen onaylandıktan sonra en geç <strong>{dispatch} iş günü</strong> içinde kargoya verilir. Kargo takip numarası e-posta ile iletilir ve “Siparişlerim” sayfasında görünür.</li>
          <li>Sipariş verdiğin bir ürün beklenmedik şekilde tükenirse seni hemen bilgilendirir, o ürünün tutarını en geç 14 gün içinde iade ederiz.</li>
          <li>Paketi teslim alırken kontrol et; hasar varsa kargo görevlisine tutanak tutturmadan teslim alma.</li>
        </ul>
      </>
    ),
  }),

  "uyelik-sozlesmesi": ({ b, seller, site }) => ({
    title: "Üyelik Sözleşmesi",
    body: (
      <>
        <p>
          Bu sözleşme, {site} üzerinden üye olan kullanıcı (“Üye”) ile {seller} (“Satıcı”) arasında, üyelik
          hizmetlerinin kullanım koşullarını belirlemek amacıyla düzenlenmiştir.
        </p>
        <SellerTable b={b} />
        <h2>Üyelik</h2>
        <ul>
          <li>Üyelik, kayıt formunun doldurulması ve bu sözleşmenin elektronik ortamda onaylanmasıyla başlar ve ücretsizdir.</li>
          <li>Üye, verdiği bilgilerin doğru ve güncel olduğunu kabul eder; değişiklikleri hesabından günceller.</li>
          <li>Hesap ve şifre güvenliği üyenin sorumluluğundadır. Şifre üçüncü kişilerle paylaşılmamalıdır.</li>
          <li>18 yaşından küçükler veli veya vasilerinin izni ve gözetimiyle üye olabilir ve alışveriş yapabilir.</li>
        </ul>
        <h2>Siparişler</h2>
        <p>
          Üyelik üzerinden verilen her sipariş ayrıca Mesafeli Satış Sözleşmesi ve Ön Bilgilendirme Formuna tabidir.
          Sitedeki stok bilgisi tedarik kaynaklı olarak değişebilir; tedarik edilemeyen ürünlerde üye bilgilendirilir
          ve ödeme iade edilir.
        </p>
        <h2>Ticari elektronik iletiler</h2>
        <p>
          Kampanya ve duyurular yalnızca üyenin açık onayıyla gönderilir. Üye bu onayı dilediği zaman hesap
          ayarlarından veya iletideki bağlantıdan geri alabilir. Sipariş ve kargo bilgilendirmeleri bu onaydan
          bağımsız olarak gönderilir.
        </p>
        <h2>Kişisel veriler</h2>
        <p>
          Üyenin kişisel verileri <Link href="/sayfa/kvkk">KVKK Aydınlatma Metni</Link> kapsamında işlenir.
        </p>
        <h2>Üyeliğin sona ermesi</h2>
        <p>
          Üye dilediği zaman üyeliğini sonlandırabilir. Sözleşmeye aykırı, hileli veya başkalarına zarar veren
          kullanım halinde Satıcı üyeliği askıya alabilir veya sonlandırabilir. Yasal saklama yükümlülüğü bulunan
          sipariş ve fatura kayıtları üyelik sona erse de mevzuattaki süre boyunca saklanır.
        </p>
        <h2>Değişiklikler</h2>
        <p>Bu sözleşmede yapılan değişiklikler sitede yayımlandığı tarihte yürürlüğe girer.</p>
      </>
    ),
  }),

  kvkk: ({ b, seller, contact }) => ({
    title: "KVKK Aydınlatma Metni",
    body: (
      <>
        <p>
          6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) uyarınca, veri sorumlusu sıfatıyla {seller}
          olarak kişisel verilerinizi hangi amaçlarla işlediğimizi ve haklarınızı aşağıda açıklıyoruz.
        </p>
        <SellerTable b={b} title="Veri sorumlusu" />
        <h2>İşlenen kişisel veriler</h2>
        <ul>
          <li>Kimlik ve iletişim: ad soyad, e-posta adresi, cep telefonu.</li>
          <li>Teslimat ve fatura: adres bilgileri; bireysel faturada T.C. kimlik no (isteğe bağlı), kurumsal faturada unvan, vergi dairesi ve vergi no.</li>
          <li>Müşteri işlemleri: sepet, sipariş, iade ve talep kayıtları.</li>
          <li>İşlem güvenliği: oturum ve güvenlik kayıtları (IP adresi, tarayıcı bilgisi, giriş zamanı).</li>
          <li>Pazarlama: yalnızca onay vermeniz halinde ticari ileti tercihiniz.</li>
        </ul>
        <p>Kart bilgileriniz tarafımızca işlenmez; ödeme kuruluşu iyzico tarafından alınır.</p>
        <h2>İşleme amaçları ve hukuki sebepler</h2>
        <ul>
          <li>Üyelik hesabının oluşturulması ve yönetilmesi, siparişlerin alınması, faturalandırılması ve teslimi — sözleşmenin kurulması ve ifası (KVKK m.5/2-c).</li>
          <li>Vergi, ticaret ve tüketici mevzuatından doğan yükümlülükler — hukuki yükümlülük (m.5/2-ç).</li>
          <li>Site güvenliği, dolandırıcılığın önlenmesi ve hizmetin iyileştirilmesi — meşru menfaat (m.5/2-f).</li>
          <li>Kampanya ve duyuruların iletilmesi — açık rıza.</li>
        </ul>
        <h2>Aktarım</h2>
        <p>
          Kişisel verileriniz yalnızca yukarıdaki amaçlarla sınırlı olarak kargo firmalarına, ödeme kuruluşuna,
          muhasebe ve e-fatura hizmet sağlayıcılarına, barındırma ve e-posta hizmet sağlayıcılarına ve talep
          halinde yetkili kamu kurum ve kuruluşlarına aktarılabilir. Sitemiz Türkiye’deki sunucularda barındırılır;
          e-posta gönderimi ve içerik dağıtımı için kullanılan bazı hizmet sağlayıcıların sunucuları yurt dışında
          bulunabilir. Bu aktarımlar KVKK m.9’da öngörülen şartlara uygun olarak yapılır.
        </p>
        <h2>Saklama süresi</h2>
        <p>
          Üyelik verileri üyelik süresince; sipariş ve fatura kayıtları ilgili vergi ve ticaret mevzuatının öngördüğü
          süre (genel olarak 10 yıl) boyunca saklanır, sürenin sonunda silinir, yok edilir veya anonim hale getirilir.
        </p>
        <h2>Haklarınız</h2>
        <p>
          KVKK m.11 uyarınca verilerinizin işlenip işlenmediğini öğrenme, bilgi talep etme, amacına uygun kullanılıp
          kullanılmadığını öğrenme, aktarıldığı kişileri bilme, eksik veya yanlış işlenmişse düzeltilmesini, silinmesini
          isteme, otomatik sistemlerle analiz sonucu aleyhinize bir sonuca itiraz etme ve zarara uğramanız halinde
          tazminat talep etme haklarına sahipsiniz. Taleplerinizi {contact} veya işletme adresimize yazılı olarak
          iletebilirsiniz; en geç 30 gün içinde ücretsiz olarak yanıtlanır.
        </p>
      </>
    ),
  }),

  "cerez-politikasi": ({ seller }) => ({
    title: "Çerez Politikası",
    body: (
      <>
        <p>
          Bu politika, {seller} tarafından işletilen sitede kullanılan çerezleri ve benzeri teknolojileri açıklar.
        </p>
        <h2>Kullandığımız çerezler</h2>
        <p>Sitemiz şu anda yalnızca sitenin çalışması için <strong>zorunlu</strong> çerezleri kullanır:</p>
        <ul>
          <li><strong>Oturum çerezi:</strong> Giriş yaptığınızda hesabınızın açık kalmasını sağlar.</li>
          <li><strong>Güvenlik (XSRF) çerezi:</strong> Formların sizin adınıza başkaları tarafından gönderilmesini engeller.</li>
          <li><strong>Sepet bilgisi:</strong> Üye olmadan eklediğiniz ürünlerin sepetinizde kalması için tarayıcınızda bir sepet anahtarı saklanır.</li>
          <li><strong>Beni hatırla çerezi:</strong> Yalnızca giriş sırasında “Beni hatırla” seçeneğini işaretlerseniz kullanılır.</li>
        </ul>
        <p>
          Zorunlu çerezler sitenin çalışması için gerekli olduğundan onayınıza bağlı değildir. Reklam veya istatistik
          amaçlı çerez kullanmaya başlarsak, bunları yalnızca onayınızla etkinleştirir ve bu sayfayı güncelleriz.
        </p>
        <h2>Çerezleri nasıl yönetirim?</h2>
        <p>
          Tarayıcınızın ayarlarından çerezleri silebilir veya engelleyebilirsiniz. Zorunlu çerezleri engellemeniz
          halinde giriş yapma ve sepet gibi özellikler çalışmayabilir.
        </p>
      </>
    ),
  }),
};

export function buildLegalPage(slug: string, store: StoreInfo | null): LegalPage | null {
  const build = pages[slug as LegalSlug];
  return build ? build(makeCtx(store)) : null;
}


