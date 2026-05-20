'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    question: 'Do I need a visa to visit Ghana?',
    answer: 'Most nationalities require a visa to enter Ghana. Citizens of ECOWAS countries can enter visa-free. We strongly recommend applying for an e-Visa via the Ghana Immigration Service website at least 4–6 weeks before travel. We can provide a supporting letter from our company to assist with your visa application. Current visa fee is approximately $100 USD for most countries.',
  },
  {
    question: 'What is included vs. excluded in tour prices?',
    answer: 'Every tour card lists exact inclusions and exclusions — look for the green "What\'s Included" and red "What\'s Excluded" breakdown when you click Book Now. As a rule: all guides, in-country transport, and listed entry fees are included. International flights, travel insurance, and personal shopping are always excluded. Multi-day tours include accommodation and most meals; day tours specify if meals are included.',
  },
  {
    question: 'What is your cancellation and refund policy?',
    answer: 'We offer a full refund on your deposit if you cancel 30+ days before your travel date. Cancellations 15–29 days prior receive a 50% refund or a credit towards a future journey. Cancellations within 14 days are non-refundable. We always recommend purchasing travel insurance to cover unforeseen circumstances.',
  },
  {
    question: 'Can I travel solo, or is a minimum group required?',
    answer: 'Most day tours operate with a minimum of 2 travellers. Solo travellers are welcome to join our scheduled group departures — check the calendar for confirmed dates. For multi-day and private tours, solo bookings are possible at a small single supplement fee. Contact us directly and we\'ll arrange the perfect solo journey.',
  },
  {
    question: 'What currency should I bring to Ghana?',
    answer: "Ghana's currency is the Ghanaian Cedi (GHS). We recommend bringing USD or GBP to exchange on arrival — both are widely accepted at forex bureaux in Accra and offer better rates than airport exchanges. ATMs are available throughout Accra and Kumasi. Most hotels accept international cards. Tour payments are processed in USD.",
  },
  {
    question: 'Do you offer custom group or corporate tours?',
    answer: "Absolutely. We specialise in bespoke group itineraries for diaspora organisations, family reunions, corporate retreats, and milestone celebrations. Our concierge team works with you from scratch to design a fully tailored experience. Contact us via WhatsApp or email with your group size, dates, and vision — we'll take it from there.",
  },
];

export default function HomeFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="w-full bg-[#131A14] py-24 md:py-32 relative overflow-hidden">
      <div className="absolute bottom-0 left-[-5%] w-[500px] h-[500px] bg-[#178548]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-3xl mx-auto px-6 lg:px-12 relative z-10">

        <div className="flex flex-col items-center text-center gap-4 mb-16">
          <span className="text-[#B8860B] text-[10px] font-bold uppercase tracking-[0.3em] flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B] animate-pulse" />
            Before You Travel
          </span>
          <h2 className="text-3xl md:text-5xl font-serif text-[#FAFAF8] leading-tight">Common Questions</h2>
          <p className="text-white/40 text-sm max-w-lg">
            Everything you need to know before your journey to the Motherland.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${isOpen ? 'border-[#B8860B]/40 bg-[#1A241B]' : 'border-white/5 bg-[#1A241B]/50 hover:border-white/10'}`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer"
                >
                  <span className={`font-bold text-sm md:text-base leading-snug transition-colors ${isOpen ? 'text-[#E8D3A2]' : 'text-white'}`}>
                    {faq.question}
                  </span>
                  <span className={`shrink-0 w-7 h-7 rounded-full border flex items-center justify-center transition-all ${isOpen ? 'bg-[#B8860B] border-[#B8860B] text-black' : 'border-white/10 text-white/30'}`}>
                    {isOpen ? <Minus size={13} strokeWidth={2.5} /> : <Plus size={13} strokeWidth={2.5} />}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6">
                    <div className="h-px bg-white/5 mb-4" />
                    <p className="text-white/60 text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-white/30 text-xs">
            Still have questions?{' '}
            <a href="/contact" className="text-[#E8D3A2] hover:text-white underline transition-colors">
              Contact our concierge team
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
