import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "About Roots & Rhythm Travels | Ghana Cultural Tours",
  description:
    "Meet Roots & Rhythm Travels and discover our mission to connect travellers with Ghana through culture, heritage, music and authentic local experiences.",
};

export default function AboutLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}