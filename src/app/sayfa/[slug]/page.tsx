import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeading } from "@/components/site/page-heading";
import { getLegalPage, getLegalPagesSafe } from "@/lib/api";

import styles from "@/components/site/storefront.module.css";

/** Kurumsal sayfalarda "Son guncelleme" satiri gosterilmez; yasal metinlerde gosterilir. */
const CORPORATE = new Set(["hakkimizda", "iletisim", "sss"]);

const EYEBROWS: Record<string, string> = {
  iletisim: "Bize ulaş",
  hakkimizda: "Mazen Kırtasiye",
  sss: "Yardım",
};

const dateFormatter = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Istanbul" });

/** Derlemede API'ye ulasilirsa sayfalar onceden uretilir; ulasilamazsa ilk istekte uretilir. */
export async function generateStaticParams() {
  return (await getLegalPagesSafe()).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/sayfa/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const page = await getLegalPage(slug);
  return page ? { title: page.title } : { title: "Sayfa bulunamadı" };
}

/**
 * Yasal ve kurumsal sayfalar: metin admin > Yasal sayfalar ekranindan yonetilir, satici ve kargo
 * bilgileriyle doldurulmus HTML olarak gelir. Admin'de degisince "legal" etiketiyle tazelenir.
 */
export default async function LegalPage({ params }: PageProps<"/sayfa/[slug]">) {
  const { slug } = await params;
  const [page, pages] = await Promise.all([getLegalPage(slug), getLegalPagesSafe()]);
  if (!page) notFound();

  const updated = page.updated_at && !CORPORATE.has(slug) ? `Son güncelleme: ${dateFormatter.format(new Date(page.updated_at))}` : undefined;

  return (
    <div className={`${styles.container} ${styles.page}`}>
      <div className={styles.prose}>
        <PageHeading eyebrow={EYEBROWS[slug] ?? "Yasal bilgiler"} title={page.title} meta={updated} />
        {/* Icerik admin panelinde yazilir; API tarafinda temizlenip degerler kacislanarak doldurulur */}
        <article className="mt-7" dangerouslySetInnerHTML={{ __html: page.html }} />

        <nav aria-label="Diğer sayfalar" className={styles.legalNav}>
          {pages.filter((item) => item.slug !== slug).map((item) => (
            <Link key={item.slug} href={`/sayfa/${item.slug}`} className={styles.chip}>
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
