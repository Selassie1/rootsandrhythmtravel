//src/app/layout.tsx

import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import GlobalNav from "@/components/layout/GlobalNav";
import PageTransition from "@/components/layout/PageTransition";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Roots & Rhythm Travels | Explore Ghana",
  description: "Authentic Ghanaian cultural immersions, celebration journeys, and diaspora connections.",
  icons: {
     icon: '/icon.png',
  },
  verification: {
  google: "BFZxESKlLw-yqb8n_EhC3FNdjW4YwZ7BX4ev-5RxLJ8",
  },
};

import { CurrencyProvider } from "@/context/CurrencyContext";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased text-white bg-black`}>
        <CurrencyProvider>
          <CartProvider>
            <GlobalNav />
            <CartDrawer />
            <PageTransition>
              {children}
            </PageTransition>
          </CartProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
