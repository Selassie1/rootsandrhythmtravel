//src/app/page.tsx

import PremiumHero from "@/components/PremiumHero";
import GhanaMapExplorer from "@/components/GhanaMapExplorer";
import MissionPhilosophy from "@/components/MissionPhilosophy";
import FeaturedJourneys from "@/components/FeaturedJourneys";
import HowToBookPremium from "@/components/HowToBookPremium";
// import Testimonials from "@/components/Testimonials";
import ThreadsVideoSection from "@/components/ThreadsVideoSection";
import HomeFAQ from "@/components/HomeFAQ";
import NewsletterCTA from "@/components/NewsletterCTA";
import Footer from "@/components/layout/Footer";
export const metadata = {
  title: "Ghana Tours from Accra | Roots & Rhythm Travels",
  description:
    "Explore Ghana with Roots & Rhythm Travels. Discover Accra city tours, Cape Coast and Kakum day trips, cultural journeys and custom itineraries.",
};
export default function Home() {
  return (
    <main className="min-h-screen bg-black pt-32">
     <h1 className="px-6 py-4 text-center text-2xl font-semibold text-white">
  Ghana Tours &amp; Cultural Journeys from Accra
</h1>
      <PremiumHero />
      <GhanaMapExplorer />
      <FeaturedJourneys />
      <HowToBookPremium />
      <ThreadsVideoSection />
      <MissionPhilosophy />
      <HomeFAQ />
      <NewsletterCTA />
      <Footer />
    </main>
  );
}
