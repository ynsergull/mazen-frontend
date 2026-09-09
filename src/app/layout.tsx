import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";

import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";

import "./globals.css";

const inter = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: { default: "Mazen Kırtasiye", template: "%s | Mazen Kırtasiye" },
  description: "Okul, ofis ve hobi için binlerce kırtasiye ürünü. Uygun fiyat, hızlı kargo.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="tr" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <Suspense fallback={<div className="h-14 border-b" />}>
          <SiteHeader />
        </Suspense>
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
