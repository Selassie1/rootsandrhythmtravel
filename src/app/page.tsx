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

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
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
