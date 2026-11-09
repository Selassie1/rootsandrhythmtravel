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
    <main className="min-h-screen bg-black pt-20">
     <h1 className="px-6 py-4 text-center text-2xl font-semibold text-white">
  Ghana Tours &amp; Cultural Journeys from Accra
</h1>
      <PremiumHero />      
      <section className="mx-auto my-10 max-w-4xl rounded-2xl border border-[#B8860B]/40 bg-[#B8860B]/10 px-6 py-8 text-center text-white">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B8860B]">December Homecoming Heritage Day</p>
        <h2 className="mt-3 font-serif text-2xl sm:text-3xl">Welcome home this December, walk your heritage with us</h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-white/80 sm:text-base">A guided day to Assin Manso Slave River, the Cape Coast and Elmina castles, and Kakum. $299 per person. Book by 28 November.</p>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-white/70">Small groups of up to 8, free airport pickup for groups of 4 or more, and a free WhatsApp planning call.</p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a href="/tours/heritage-adventure-tour-itinerary" className="rounded-full bg-[#B8860B] px-6 py-3 text-sm font-semibold text-black">See the tour</a>
          <a href="https://wa.me/233549796875" target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white">Message us on WhatsApp</a>
        </div>
      </section>
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
