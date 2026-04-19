// frontend/src/app/terms/page.tsx
import React from 'react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#131A14] pt-24 pb-8">
      <div className="w-full bg-[#1A241B] py-16 px-6 lg:px-12 border-b border-white/5 relative overflow-hidden">
        <div className="max-w-4xl mx-auto pt-10 relative z-10">
          <span className="text-[#B8860B] tracking-[0.3em] text-[10px] font-bold uppercase mb-2 block drop-shadow-sm">
            Legal & Compliance
          </span>
          <h1 className="text-3xl md:text-5xl font-serif text-[#FAFAF8] leading-tight mb-2">
            Terms of Service
          </h1>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-16 text-white/70 font-light leading-relaxed space-y-8 text-sm">
        <p>Welcome to Roots & Rhythm Travels. By accessing and using our website, and booking our curated tours, you agree to comply with and be bound by the following terms and conditions of use.</p>
        
        <h2 className="text-xl font-serif text-white mt-8 mb-4">1. Booking and Reservations</h2>
        <p>All bookings are subject to availability. A reservation is only confirmed once the required deposit or full payment has been received and you have been provided with a booking confirmation receipt.</p>
        
        <h2 className="text-xl font-serif text-white mt-8 mb-4">2. Pricing and Payments</h2>
        <p>All prices are listed in USD unless otherwise noted. We reserve the right to alter the prices of any of the holidays shown on our website. You will be advised of the current price of the holiday that you wish to book before your contract is confirmed.</p>
        
        <h2 className="text-xl font-serif text-white mt-8 mb-4">3. Medical and Health Requirements</h2>
        <p>It is your responsibility to ensure you possess the required health certifications and vaccinations for your destination. Roots & Rhythm Travels will not be held liable for any travel disruptions due to health non-compliance.</p>
        
        <p className="pt-8 text-white/40 italic">Last Updated: April 2026</p>
      </div>
    </div>
  );
}
