import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHeading } from "@/components/site/page-heading";

import styles from "@/components/site/storefront.module.css";

import { LEGAL_PAGES } from "./legal-pages";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(LEGAL_PAGES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/sayfa/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const page = LEGAL_PAGES[slug];
  return page ? { title: page.title } : {};
}

export default async function LegalPage({ params }: PageProps<"/sayfa/[slug]">) {
  const { slug } = await params;
  const page = LEGAL_PAGES[slug];
  if (!page) notFound();

  return (
    <div className={`${styles.container} ${styles.page}`}>
      <div className={styles.prose}>
        <PageHeading eyebrow="Yasal bilgiler" title={page.title} meta={`Son güncelleme: ${page.updated}`} />
        <article className="mt-7">{page.body}</article>
      </div>
    </div>
  );
}
