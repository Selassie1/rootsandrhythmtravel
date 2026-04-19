// frontend/src/app/refund-policy/page.tsx
import React from 'react';

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#131A14] pt-24 pb-8">
      <div className="w-full bg-[#1A241B] py-16 px-6 lg:px-12 border-b border-white/5 relative overflow-hidden">
        <div className="max-w-4xl mx-auto pt-10 relative z-10">
          <span className="text-[#B8860B] tracking-[0.3em] text-[10px] font-bold uppercase mb-2 block drop-shadow-sm">
            Legal & Compliance
          </span>
          <h1 className="text-3xl md:text-5xl font-serif text-[#FAFAF8] leading-tight mb-2">
            Cancellation & Refund Policy
          </h1>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-16 text-white/70 font-light leading-relaxed space-y-12">
        
        <section>
          <h2 className="text-xl font-serif text-white mb-4">General Tours (Adventure, Cultural, Diaspora Access)</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            <li><strong className="text-white">Free cancellation:</strong> Up to 7 days before departure.</li>
            <li><strong className="text-white">50% refund:</strong> 3–6 days before departure.</li>
            <li><strong className="text-white">No refund:</strong> Within 48 hours of departure.</li>
            <li><strong className="text-white">Rescheduling:</strong> Allowed once, up to 48 hours before departure, subject to availability.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-serif text-white mb-4">Celebration Journeys (Bachelor Parties, Weddings, Naming Ceremonies)</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            <li><strong className="text-white">Deposit required:</strong> 30% non‑refundable at booking.</li>
            <li><strong className="text-white">Full refund (minus deposit):</strong> Up to 14 days before event.</li>
            <li><strong className="text-white">50% refund (minus deposit):</strong> 7–13 days before event.</li>
            <li><strong className="text-white">No refund:</strong> Within 7 days of event.</li>
            <li><strong className="text-white">Rescheduling:</strong> Allowed with a fee (10% of package cost), subject to venue and supplier availability.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-serif text-white mb-4">Spiritual Tourism</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            <li><strong className="text-white">Free cancellation:</strong> Up to 10 days before trip.</li>
            <li><strong className="text-white">50% refund:</strong> 5–9 days before trip.</li>
            <li><strong className="text-white">No refund:</strong> Within 5 days of trip.</li>
            <li><strong className="text-white">Rescheduling:</strong> Allowed once, up to 5 days before trip, subject to guide availability.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-serif text-white mb-4">Special Wishes (Custom Requests via Contact Form)</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            <li>Policies tailored case‑by‑case depending on the request.</li>
            <li>Customers will receive a written confirmation of terms before payment.</li>
          </ul>
        </section>
        
      </div>
    </div>
  );
}
