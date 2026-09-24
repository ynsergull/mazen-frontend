import type { ReactNode } from "react";

/*
 * Yasal metin TASLAKLARI. Yayin oncesi hukuk danismaniyla gozden gecirilmeli; isletme unvani,
 * adres, MERSIS/vergi no ve iletisim e-postasi eklenmeli (footer'daki TODO ile ayni is).
 */

export type LegalPage = { title: string; updated: string; body: ReactNode };

const COMPANY_NOTE = (
  <p>
    <strong>Veri sorumlusu:</strong> Mazen Kırtasiye. İşletme unvanı, adres ve iletişim bilgileri yakında bu
    sayfada yer alacaktır.
  </p>
);

export const LEGAL_PAGES: Record<string, LegalPage> = {
  kvkk: {
    title: "KVKK Aydınlatma Metni",
    updated: "24 Eylül 2026",
    body: (
      <>
        <p>
          6698 sayılı Kişisel Verilerin Korunması Kanunu (&ldquo;KVKK&rdquo;) uyarınca, Mazen Kırtasiye olarak
          kişisel verilerinizi hangi amaçlarla işlediğimizi ve haklarınızı aşağıda açıklıyoruz.
        </p>
        {COMPANY_NOTE}
        <h2>İşlenen kişisel veriler</h2>
        <ul>
          <li>Kimlik ve iletişim: ad soyad, e-posta adresi, cep telefonu.</li>
          <li>Teslimat ve fatura: adres bilgileri; bireysel faturada T.C. kimlik no, kurumsal faturada vergi bilgileri.</li>
          <li>Müşteri işlemleri: sepet, sipariş ve iade kayıtları.</li>
          <li>İşlem güvenliği: oturum ve güvenlik kayıtları (IP adresi, tarayıcı bilgisi, giriş zamanı).</li>
        </ul>
        <h2>İşleme amaçları</h2>
        <ul>
          <li>Üyelik hesabının oluşturulması ve yönetilmesi,</li>
          <li>Siparişlerin alınması, faturalandırılması ve teslim edilmesi,</li>
          <li>Sipariş ve kargo durumu hakkında bilgilendirme,</li>
          <li>Yasal yükümlülüklerin (vergi, tüketici mevzuatı) yerine getirilmesi,</li>
          <li>Açık onay vermeniz halinde kampanya ve duyuruların iletilmesi.</li>
        </ul>
        <h2>Hukuki sebepler</h2>
        <p>
          Verileriniz KVKK m.5/2 kapsamında sözleşmenin kurulması ve ifası, hukuki yükümlülüklerin yerine getirilmesi
          ve meşru menfaat sebeplerine; ticari elektronik iletiler ise açık rızanıza dayanılarak işlenir.
        </p>
        <h2>Aktarım</h2>
        <p>
          Kişisel verileriniz yalnızca yukarıdaki amaçlarla sınırlı olarak kargo firmalarına, ödeme kuruluşlarına,
          barındırma hizmeti sağlayıcılarına ve talep halinde yetkili kamu kurumlarına aktarılabilir.
        </p>
        <h2>Haklarınız</h2>
        <p>
          KVKK m.11 uyarınca verilerinizin işlenip işlenmediğini öğrenme, bilgi talep etme, düzeltilmesini veya
          silinmesini isteme, aktarıldığı kişileri bilme ve itiraz etme haklarına sahipsiniz. Taleplerinizi
          iletişim adresimize yazılı olarak iletebilirsiniz.
        </p>
      </>
    ),
  },
  "uyelik-sozlesmesi": {
    title: "Üyelik Sözleşmesi",
    updated: "24 Eylül 2026",
    body: (
      <>
        <p>
          Bu sözleşme, mazenkirtasiye.com üzerinden üye olan kullanıcı (&ldquo;Üye&rdquo;) ile Mazen Kırtasiye
          arasında, üyelik hizmetlerinin kullanım koşullarını belirlemek amacıyla düzenlenmiştir.
        </p>
        {COMPANY_NOTE}
        <h2>Üyelik</h2>
        <ul>
          <li>Üyelik, kayıt formunun doldurulması ve bu sözleşmenin onaylanmasıyla başlar.</li>
          <li>Üye, verdiği bilgilerin doğru ve güncel olduğunu kabul eder.</li>
          <li>Hesap ve şifre güvenliği üyenin sorumluluğundadır; şifre üçüncü kişilerle paylaşılmamalıdır.</li>
          <li>18 yaşından küçük kullanıcılar veli veya vasilerinin gözetiminde alışveriş yapmalıdır.</li>
        </ul>
        <h2>Siparişler</h2>
        <p>
          Ürün fiyatları ve stok bilgileri sitede gösterildiği şekildedir; tedarik kaynaklı stok farklılıklarında üye
          bilgilendirilir ve ödeme iade edilir. Satın alma işlemleri ayrıca mesafeli satış sözleşmesine tabidir.
        </p>
        <h2>Ticari iletiler</h2>
        <p>
          Kampanya ve duyurular yalnızca üyenin açık onayı ile gönderilir. Üye bu onayı dilediği zaman hesap
          ayarlarından geri alabilir.
        </p>
        <h2>Sözleşmenin sona ermesi</h2>
        <p>
          Üye dilediği zaman üyeliğini sonlandırabilir. Sözleşmeye aykırı kullanım halinde Mazen Kırtasiye üyeliği
          askıya alma veya sonlandırma hakkına sahiptir.
        </p>
        <h2>Değişiklikler</h2>
        <p>Bu sözleşmede yapılan değişiklikler sitede yayımlandığı tarihte yürürlüğe girer.</p>
      </>
    ),
  },
};
