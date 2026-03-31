//src/app/page.tsx

import PremiumHero from "@/components/PremiumHero";
import GhanaMapExplorer from "@/components/GhanaMapExplorer";
import MissionPhilosophy from "@/components/MissionPhilosophy";
import FeaturedJourneys from "@/components/FeaturedJourneys";
import HowToBookPremium from "@/components/HowToBookPremium";
import Testimonials from "@/components/Testimonials";
import NewsletterCTA from "@/components/NewsletterCTA";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <PremiumHero />
      <GhanaMapExplorer />
      <MissionPhilosophy />
      <FeaturedJourneys />
      <HowToBookPremium />
      <Testimonials />
      <NewsletterCTA />
      <Footer />
    </main>
  );
}
