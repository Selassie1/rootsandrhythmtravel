// src/app/contact/page.tsx
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, MessageSquare, Send, CheckCircle2, Music, Camera, Heart, Users } from 'lucide-react';
import Image from 'next/image';

const GREETINGS = [
  { text: "Akwaaba", lang: "Akan" },
  { text: "Oobakɛ", lang: "Ga" },
  { text: "Woezor", lang: "Ewe" },
  { text: "Barka da zuwa", lang: "Hausa" }
];

const SPECIAL_WISHES = [
  { id: 'bachelor', label: 'Bachelor Party', icon: <Music size={16} /> },
  { id: 'wedding', label: 'Wedding Service', icon: <Heart size={16} /> },
  { id: 'naming', label: 'Naming Ceremony', icon: <Users size={16} /> },
  { id: 'spiritual', label: 'Spiritual Tour', icon: <MessageSquare size={16} /> },
  { id: 'creative', label: 'Creative Content', icon: <Camera size={16} /> },
];

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedWishes, setSelectedWishes] = useState<string[]>([]);

  const toggleWish = (id: string) => {
    setSelectedWishes(prev => 
      prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    // In a real scenario, we'd send this to Supabase or an email API
  };

  return (
    <main className="min-h-screen bg-[#131A14] text-white pt-24 pb-20 md:pb-32">
      
      {/* 1. CINEMATIC GREETING HERO */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 md:py-20 text-center">
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mb-8 text-[#B8860B]">
          {GREETINGS.map((greeting, i) => (
            <motion.div
              key={greeting.text}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white/5 rounded-full border border-white/10"
            >
              <span className="text-[8px] sm:text-[10px] uppercase tracking-widest font-bold opacity-40 block mb-1">{greeting.lang}</span>
              <span className="text-xs sm:text-sm tracking-[0.2em] font-medium italic">{greeting.text}</span>
            </motion.div>
          ))}
        </div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl sm:text-6xl md:text-8xl font-serif text-[#FAFAF8] leading-tight mb-6"
        >
          Share Your Journey's<br className="hidden sm:block" />Rhythm With Us
        </motion.h1>
        <p className="max-w-2xl mx-auto text-white/40 text-base md:text-xl font-light px-4">
          Whether you're seeking ancestral roots or planning a celebration of a lifetime, our motherland experts are here to listen.
        </p>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-5 gap-8 md:gap-12 lg:gap-16 items-start mt-8 md:mt-12">
        
        {/* 2. CONTACT DETAILS PANEL (2 Cols) */}
        <div className="lg:col-span-2 space-y-8 md:space-y-12 order-2 lg:order-1">
          <div className="space-y-8 p-6 sm:p-10 bg-white/5 backdrop-blur-xl border border-white/5 rounded-[32px] sm:rounded-[40px] relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-serif text-[#FAFAF8] mb-6 sm:mb-8">Direct Channels</h2>
              
              <div className="space-y-4 sm:space-y-6">
                <a href="tel:0202713806" className="flex items-center gap-4 sm:gap-5 group py-3 sm:py-4 border-b border-white/5 hover:border-[#B8860B]/30 transition-all">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#B8860B]/10 rounded-xl sm:rounded-2xl flex items-center justify-center text-[#B8860B] group-hover:bg-[#B8860B] group-hover:text-[#131A14] transition-all">
                    <Phone size={18} />
                  </div>
                  <div>
                    <span className="text-white/40 text-[8px] sm:text-[9px] uppercase tracking-[0.2em] font-bold block mb-1">WhatsApp & Call</span>
                    <span className="text-base sm:text-lg font-medium text-white/90">+233 202 713 806</span>
                  </div>
                </a>

                <a href="mailto:amenuprince36@gmail.com" className="flex items-center gap-4 sm:gap-5 group py-3 sm:py-4 border-b border-white/5 hover:border-[#B8860B]/30 transition-all">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#B8860B]/10 rounded-xl sm:rounded-2xl flex items-center justify-center text-[#B8860B] group-hover:bg-[#B8860B] group-hover:text-[#131A14] transition-all">
                    <Mail size={18} />
                  </div>
                  <div>
                    <span className="text-white/40 text-[8px] sm:text-[9px] uppercase tracking-[0.2em] font-bold block mb-1">Email Enquiries</span>
                    <span className="text-base sm:text-lg font-medium text-white/90">amenuprince36@gmail.com</span>
                  </div>
                </a>

                <div className="flex items-center gap-4 sm:gap-5 py-3 sm:py-4 group">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#B8860B]/10 rounded-xl sm:rounded-2xl flex items-center justify-center text-[#B8860B]">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <span className="text-white/40 text-[8px] sm:text-[9px] uppercase tracking-[0.2em] font-bold block mb-1">Location</span>
                    <span className="text-base sm:text-lg font-medium text-white/90">Tse Addo, Accra - Ghana</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Aesthetic Background Shapes */}
            <div className="absolute top-[-10%] right-[-10%] w-24 h-24 sm:w-32 sm:h-32 bg-[#B8860B]/5 rounded-full blur-3xl" />
            <div className="absolute bottom-[-10%] left-[-10%] w-24 h-24 sm:w-32 sm:h-32 bg-[#B8860B]/5 rounded-full blur-3xl" />
          </div>

          <div className="p-6 sm:p-10 rounded-[32px] sm:rounded-[40px] bg-[#E8D3A2] text-[#131A14]">
            <h3 className="text-xl sm:text-2xl font-serif mb-4 italic">"Rhythm and roots are shared best in person. Tell us your story, and we'll weave the path."</h3>
            <span className="text-[10px] uppercase font-bold tracking-[0.2em]">— Elikem</span>
          </div>
        </div>

        {/* 3. CONTACT FORM (3 Cols) — Form is order-1 on mobile */}
        <div className="lg:col-span-3 order-1 lg:order-2">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] sm:rounded-[40px] p-6 sm:p-8 md:p-12 shadow-2xl relative overflow-hidden">
            {isSubmitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-16 sm:py-32 text-center flex flex-col items-center gap-6"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#B8860B]/20 rounded-full flex items-center justify-center text-[#B8860B]">
                  <CheckCircle2 size={40} />
                </div>
                <div>
                  <h2 className="text-3xl sm:text-4xl font-serif text-[#FAFAF8] mb-4">Request Received</h2>
                  <p className="text-white/40 max-w-md mx-auto text-sm sm:text-base">
                    Medase! Your special inquiry has been logged. Elikem or our concierge team will reach out within 24 hours to begin crafting your journey.
                  </p>
                </div>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="mt-6 sm:mt-8 text-[#B8860B] font-bold text-[9px] sm:text-[10px] uppercase tracking-[0.3em] hover:text-white transition-colors"
                >
                  Send Another Inquiry
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 relative z-10">
                <div className="space-y-2">
                  <h2 className="text-3xl sm:text-4xl font-serif text-[#FAFAF8]">Bespoke Inquiry</h2>
                  <p className="text-white/40 text-xs sm:text-sm">Tell us your special wishes or custom requests.</p>
                </div>

                {/* FORM FIELDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2 sm:space-y-3">
                    <label className="text-white/40 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest pl-2">Full Name</label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. Ama Serwaa" 
                      className="w-full bg-white/5 border border-white/5 rounded-xl sm:rounded-2xl px-5 sm:px-6 py-3.5 sm:py-4 focus:outline-none focus:border-[#B8860B]/40 transition-all text-white/90 placeholder:text-white/20 text-sm sm:text-base"
                    />
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <label className="text-white/40 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest pl-2">Email Address</label>
                    <input 
                      required
                      type="email" 
                      placeholder="your.email@domain.com" 
                      className="w-full bg-white/5 border border-white/5 rounded-xl sm:rounded-2xl px-5 sm:px-6 py-3.5 sm:py-4 focus:outline-none focus:border-[#B8860B]/40 transition-all text-white/90 placeholder:text-white/20 text-sm sm:text-base"
                    />
                  </div>
                </div>

                {/* SPECIAL WISHES SELECTION */}
                <div className="space-y-4 pt-2 sm:pt-4">
                  <label className="text-white/40 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest pl-2">Special Wishes / Category</label>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {SPECIAL_WISHES.map(wish => (
                      <button
                        key={wish.id}
                        type="button"
                        onClick={() => toggleWish(wish.id)}
                        className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-[8px] sm:text-[10px] uppercase font-bold tracking-[0.1em] flex items-center gap-2 transition-all duration-300 ${
                          selectedWishes.includes(wish.id)
                            ? 'bg-[#E8D3A2] text-[#131A14] shadow-[0_5px_15px_rgba(232,211,162,0.3)]'
                            : 'bg-white/5 text-white/60 hover:bg-white/10'
                        }`}
                      >
                        {wish.icon} {wish.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 sm:space-y-3 pt-2 sm:pt-4">
                  <label className="text-white/40 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest pl-2">The Message / Special Details</label>
                  <textarea 
                    required
                    rows={5}
                    placeholder="Describe your vision, travel styles, preferred dates, or any special requests..." 
                    className="w-full bg-white/5 border border-white/5 rounded-[24px] sm:rounded-[32px] px-6 sm:px-8 py-5 sm:py-6 focus:outline-none focus:border-[#B8860B]/40 transition-all text-white/90 placeholder:text-white/20 resize-none text-sm sm:text-base"
                  />
                </div>

                <div className="pt-4 sm:pt-6">
                  <button 
                    type="submit" 
                    className="w-full bg-[#E8D3A2] hover:bg-[#FAFAF8] text-[#131A14] py-5 sm:py-6 rounded-full font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[10px] sm:text-xs flex items-center justify-center gap-3 sm:gap-4 transition-all hover:scale-[1.01] active:scale-[0.98] shadow-2xl"
                  >
                    Send Special Request <Send size={16} />
                  </button>
                </div>
              </form>
            )}

            {/* Background Texture */}
            <div className="absolute inset-0 bg-[url('/icon.png')] opacity-[0.02] scale-[2] pointer-events-none" />
          </div>
        </div>
      </div>
    </main>
  );
}
