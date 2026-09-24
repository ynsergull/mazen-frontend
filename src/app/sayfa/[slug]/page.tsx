import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { buildLegalPage, LEGAL_NAV, legalUpdatedAt } from "@/components/legal/legal-pages";
import { PageHeading } from "@/components/site/page-heading";
import { getStoreInfo } from "@/lib/api";

import styles from "@/components/site/storefront.module.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return LEGAL_NAV.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/sayfa/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const page = buildLegalPage(slug, null);
  return page ? { title: page.title } : {};
}

export default async function LegalPage({ params }: PageProps<"/sayfa/[slug]">) {
  const { slug } = await params;
  const page = buildLegalPage(slug, await getStoreInfo());
  if (!page) notFound();

  return (
    <div className={`${styles.container} ${styles.page}`}>
      <div className={styles.prose}>
        <PageHeading
          eyebrow={slug === "iletisim" ? "Bize ulaş" : "Yasal bilgiler"}
          title={page.title}
          meta={slug === "iletisim" ? undefined : `Son güncelleme: ${legalUpdatedAt()}`}
        />
        <article className="mt-7">{page.body}</article>

        <nav aria-label="Diğer sayfalar" className={styles.legalNav}>
          {LEGAL_NAV.filter((item) => item.slug !== slug).map((item) => (
            <Link key={item.slug} href={`/sayfa/${item.slug}`} className={styles.chip}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
