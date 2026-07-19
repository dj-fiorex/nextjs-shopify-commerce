import { CartProvider } from "components/cart/cart-context";
import AnnouncementBar from "components/layout/announcement-bar";
import { Navbar } from "components/layout/navbar";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { SITE_NAME } from "lib/brand";
import { getCart } from "lib/shopify";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import "./globals.css";
import { baseUrl } from "lib/utils";

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  robots: {
    follow: true,
    index: true,
  },
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Don't await the fetch, pass the Promise to the context provider
  const cart = getCart();

  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="bg-brand-base text-brand-ink selection:bg-brand-ink selection:text-brand-base">
        <CartProvider cartPromise={cart}>
          <AnnouncementBar />
          <Navbar />
          <main>
            {children}
            <Toaster closeButton />
          </main>
        </CartProvider>
      </body>
    </html>
  );
}
