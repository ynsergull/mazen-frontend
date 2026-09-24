import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";

import { AuthProvider } from "@/components/auth/auth-provider";
import { CartProvider } from "@/components/cart/cart-provider";
import { SiteFrame } from "@/components/site/site-frame";
import { StorefrontFooter } from "@/components/site/storefront-footer";
import { StorefrontHeader, StorefrontHeaderFallback } from "@/components/site/storefront-header";

import "./globals.css";

const inter = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: { default: "Mazen Kırtasiye", template: "%s | Mazen Kırtasiye" },
  description: "Okul çantası, defter, kalem, boya, sanat ve hobi malzemeleri: binlerce kırtasiye ürünü Mazen'de.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="tr" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col overflow-x-clip bg-background text-foreground">
        <AuthProvider>
          <CartProvider>
            <SiteFrame
              header={
                <Suspense fallback={<StorefrontHeaderFallback />}>
                  <StorefrontHeader />
                </Suspense>
              }
              footer={<StorefrontFooter />}
            >
              {children}
            </SiteFrame>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
