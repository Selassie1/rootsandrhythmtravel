'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Check, ChevronDown, CheckCircle2, Shield, ArrowRight, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function TourDetailClient({ tour }: { tour: any }) {
  const router = useRouter();
  const [activeDay, setActiveDay] = useState<number | null>(1);
  const [isBooking, setIsBooking] = useState(false);

  // Safely grab the mock or live itinerary
  const itinerary = tour.itinerary || [];
  const isCustom = tour.isCustom || false;

  const handleBooking = () => {
    setIsBooking(true);
    setTimeout(() => {
      router.push(`/checkout?tour=${tour.id}`);
    }, 1000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-32 flex flex-col lg:flex-row gap-16 xl:gap-24 relative z-10 bg-[#131A14]">
      
      {/* 1. MAIN LEFT COLUMN (Itinerary & Details) */}
      <div className="flex-1 flex flex-col gap-16">
        
        {/* Storytelling Description */}
        <div className="flex flex-col gap-6">
           <h2 className="text-[#B8860B] tracking-[0.3em] font-bold uppercase text-[10px]">The Experience</h2>
           <h3 className="text-4xl md:text-5xl font-serif text-[#FAFAF8] leading-tight">{tour.description_heading || `Journey into the heart of ${tour.location}`}</h3>
           <p className="text-white/60 text-base md:text-lg leading-relaxed max-w-3xl whitespace-pre-wrap">
             {tour.description_body || tour.description}
             {!isCustom && (
                 <></>
             )}
           </p>
        </div>

        {/* What's Included Grid */}
        <div className="bg-[#1A241B] rounded-[32px] p-8 md:p-12 border border-white/5 shadow-2xl">
          <h3 className="text-2xl font-serif text-white mb-8 border-b border-white/10 pb-4">
               {isCustom ? "Concierge Services Included" : "Curated Inclusions"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(tour.curated_inclusions?.length > 0 ? tour.curated_inclusions : ['5-Star Boutique Accommodations', 'Private Chauffeur & Armored Fleet', 'All Exclusive Dining Experiences', 'Bespoke Private Guides', 'VIP Airport Fast-Track']).map((item: string, i: number) => (
              <div key={i} className="flex items-start gap-4">
                 <div className="w-6 h-6 rounded-full bg-[#B8860B]/20 flex items-center justify-center shrink-0 mt-0.5">
                   <Check size={12} className="text-[#E8D3A2]" />
                 </div>
                 <span className="text-white/80 text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic State: Day-By-Day Itinerary vs Custom Contact block */}
        <div className="flex flex-col gap-8">
           <h2 className="text-[#B8860B] tracking-[0.3em] font-bold uppercase text-[10px]">
              {isCustom ? "Personalized Craftsmanship" : "Daily Flow"}
           </h2>
           <h3 className="text-3xl md:text-4xl font-serif text-[#FAFAF8] leading-tight mb-4">
              {isCustom ? "Start Your Bespoke Build" : "Your Detailed Itinerary"}
           </h3>
           
           {isCustom ? (
               // Explicit Custom Contact Hook extracted from CSV "Special Wishes via Contact Form" request
               <div className="bg-[#B8860B]/5 border border-[#B8860B]/20 rounded-3xl p-8 md:p-12 flex flex-col gap-6">
                  <div className="w-16 h-16 rounded-full bg-[#B8860B]/20 flex items-center justify-center mb-2">
                     <MessageSquare className="text-[#E8D3A2]" size={28} />
                  </div>
                  <h4 className="text-2xl font-serif text-white">We bring your vision to life.</h4>
                  <p className="text-white/60 leading-relaxed max-w-2xl text-sm">
                    Because this is an entirely bespoke package, we do not force you into a generic checkout pipeline. We assign a dedicated Travel Concierge to personally call you, map your goals (including budget and dietary restrictions), and draft a perfect, one-of-a-kind Motherland itinerary from scratch.
                  </p>
                  <Link href="/contact" className="w-fit bg-[#E8D3A2] text-[#131A14] hover:bg-[#B8860B] px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm transition-colors mt-4 shadow-xl flex items-center gap-3">
                     Contact Concierge <ArrowRight size={16} />
                  </Link>
               </div>
           ) : (
               // Standard Iteration
               <div className="flex flex-col gap-4">
                 {itinerary.map((day: any) => (
                   <div 
                     key={day.day} 
                     className={`border border-white/10 rounded-2xl overflow-hidden transition-colors ${activeDay === day.day ? 'bg-[#1A241B]' : 'bg-transparent hover:bg-white/5'}`}
                   >
                     <button 
                       onClick={() => setActiveDay(activeDay === day.day ? null : day.day)}
                       className="w-full flex items-center justify-between p-6 md:p-8 text-left cursor-pointer"
                     >
                       <span className="text-lg md:text-xl font-serif text-white">Day {day.day}: {day.title}</span>
                       <ChevronDown size={20} className={`text-[#B8860B] transition-transform duration-300 ${activeDay === day.day ? 'rotate-180' : 'rotate-0'}`} />
                     </button>
                     
                     <AnimatePresence>
                       {activeDay === day.day && (
                         <motion.div 
                           initial={{ height: 0, opacity: 0 }}
                           animate={{ height: "auto", opacity: 1 }}
                           exit={{ height: 0, opacity: 0 }}
                           transition={{ duration: 0.3 }}
                         >
                           <div className="px-6 md:px-8 pb-8 pt-0 text-white/50 text-sm leading-relaxed border-t border-white/5 mt-2 pt-6 whitespace-pre-wrap">
                             {day.details || day.description}
                           </div>
                         </motion.div>
                       )}
                     </AnimatePresence>
                   </div>
                 ))}
               </div>
           )}
        </div>

      </div>


      {/* 2. RIGHT COLUMN: Sticky Booking Widget */}
      <div className="w-full lg:w-[400px] shrink-0">
        <div className="sticky top-32 flex flex-col gap-6">
          
          <div className="w-full bg-[#1A241B] rounded-[32px] p-8 md:p-10 border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
            <h4 className="text-[#B8860B] text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Investment</h4>
            
            <div className="flex items-end gap-2 mb-2">
              <span className="text-5xl font-serif text-white">
                 {isCustom ? "TBD" : `$${tour.price.toLocaleString()}`}
              </span>
              {!isCustom && <span className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1 pb-1">/ Person</span>}
            </div>

            <p className="text-[#FAFAF8]/50 text-xs leading-relaxed mb-8 pb-8 border-b border-white/5">
              {isCustom 
                 ? "Our concierge will provide a transparent, itemized invoice once your custom itinerary is sculpted." 
                 : `Secure your journey with a $${tour.deposit.toLocaleString()} refundable deposit today. Complete balance due 30 days prior to departure.`}
            </p>

            <div className="flex flex-col gap-4 mb-8">
               <div className="flex items-center justify-between">
                 <span className="text-white/60 text-sm">Duration</span>
                 <span className="text-white font-bold">{tour.duration_days} {isCustom ? '' : 'Days'}</span>
               </div>
               <div className="flex items-center justify-between">
                 <span className="text-white/60 text-sm">Availability</span>
                 <span className="text-[#E8D3A2] font-bold">{isCustom ? "Upon Request" : "Limited Priority"}</span>
               </div>
            </div>

            {isCustom ? (
               <Link 
                 href="/contact"
                 className="w-full py-5 bg-[#FAFAF8] hover:bg-[#E8D3A2] text-black font-bold uppercase tracking-[0.2em] text-xs rounded-2xl flex items-center justify-center gap-3 transition-colors shadow-2xl relative"
               >
                 Inquire Now
               </Link>
            ) : (
               <button 
                 onClick={handleBooking}
                 disabled={isBooking}
                 className="w-full py-5 bg-[#FAFAF8] hover:bg-[#E8D3A2] text-black font-bold uppercase tracking-[0.2em] text-xs rounded-2xl flex items-center justify-center gap-3 transition-colors shadow-2xl relative overflow-hidden group disabled:opacity-50 cursor-pointer"
               >
                 <span className="relative z-10">{isBooking ? 'Securing Spot...' : 'Book This Journey'}</span>
                 {!isBooking && <ArrowRight size={16} className="relative z-10 transition-transform group-hover:translate-x-1" strokeWidth={2.5} />}
               </button>
            )}
            <p className="text-center text-[#FAFAF8]/30 pt-4 text-[9px] uppercase tracking-widest font-bold">
              Secure SSL Encryption
            </p>
          </div>

          <div className="w-full border border-white/5 bg-transparent rounded-2xl p-6 flex gap-4 overflow-hidden relative">
            <div className="absolute inset-0 bg-[#B8860B]/5" />
            <Shield size={24} className="text-[#B8860B] shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="text-white text-sm font-bold mb-1">Concierge Guarantee</span>
              <span className="text-white/50 text-xs leading-relaxed">Cancel securely for a full refund up to 90 days before your departure.</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
