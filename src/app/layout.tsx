import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import GlobalNav from "@/components/layout/GlobalNav";
import PageTransition from "@/components/layout/PageTransition";
import CookieConsent from "@/components/CookieConsent";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const SITE_URL = "https://www.rootsandrhythmtravel.com";
const SITE_TITLE = "Ghana Tours from Accra | Roots & Rhythm Travels";
const SITE_DESCRIPTION =
  "Explore Ghana with Roots & Rhythm Travels. Discover Accra city tours, Cape Coast and Kakum day trips, cultural journeys and custom itineraries.";
const DEFAULT_IMAGE = "/images/kintampo.jpg";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s",
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: "Roots & Rhythm Travels",
    url: SITE_URL,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: "en_US",
    images: [{ url: DEFAULT_IMAGE, alt: "Roots & Rhythm Travels, Ghana tours" }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_IMAGE],
  },
  icons: {
    icon: "/icon.png",
  },
  verification: {
    google: "BFZxESKlLw-yqb8n_EhC3FNdjW4YwZ7BX4ev-5RxLJ8",
  },
};

const travelAgencySchema = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: "Roots & Rhythm Travels",
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/logo.png`,
  image: `${SITE_URL}/images/kintampo.jpg`,
  description:
    "Ghana tours and cultural journeys from Accra: heritage, nature, and custom itineraries with Roots & Rhythm Travels.",
  email: "elikem@rootsandrhythmtravel.com",
  telephone: "+233549796875",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Tse Addo",
    addressLocality: "Accra",
    addressCountry: "GH",
  },
  areaServed: { "@type": "Country", name: "Ghana" },
  sameAs: [
    "https://www.facebook.com/rootsandrhythmtravel",
    "https://www.instagram.com/rootsandrhythmtravel/",
    "https://www.threads.com/@rootsandrhythmtravel",
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: "+233549796875",
      email: "elikem@rootsandrhythmtravel.com",
      availableLanguage: ["English"],
    },
    {
      "@type": "ContactPoint",
      contactType: "customer service",
      url: "https://wa.me/233549796875",
      name: "WhatsApp",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased text-white bg-black`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(travelAgencySchema) }}
        />
        <CurrencyProvider>
          <CartProvider>
            <GlobalNav />
            <CartDrawer />
            <PageTransition>{children}</PageTransition>
          </CartProvider>
        </CurrencyProvider>
        <CookieConsent />
      </body>
    </html>
  );
}