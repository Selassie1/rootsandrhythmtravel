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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased text-white bg-black`}>
        <GlobalNav />
        <PageTransition>
          {children}
        </PageTransition>
      </body>
    </html>
  );
}
