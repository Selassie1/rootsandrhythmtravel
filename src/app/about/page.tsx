// src/app/about/page.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Music, History, Heart, Users } from 'lucide-react';

const missionValues = [
  {
    icon: <Music className="text-[#B8860B]" size={32} />,
    title: "The Rhythm of Ghana",
    description: "We don't just visit places; we feel them. From the heartbeat of traditional drumming to the pulse of contemporary life, we immerse you in the sounds and songs of the motherland."
  },
  {
    icon: <History className="text-[#B8860B]" size={32} />,
    title: "Deep-Rooted Heritage",
    description: "Our journeys dive deep into the ancient history and spiritual heritage of West Africa, connecting you with the ancestral stories that define our identity."
  },
  {
    icon: <Heart className="text-[#B8860B]" size={32} />,
    title: "Authentic Immersion",
    description: "We bypass the generic to bring you the real. Meet the artisans, healers, and elders who keep our culture alive, and experience Ghana through their eyes."
  },
  {
    icon: <Users className="text-[#B8860B]" size={32} />,
    title: "Diaspora Reconnection",
    description: "A specialized focus on building bridges for Africans abroad, facilitating powerful 'Return' experiences that go beyond sightseeing to true connection."
  }
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#131A14] text-white pb-20 md:pb-32">
      
      {/* 1. HERO SECTION — Full bleed, image behind nav */}
      <section className="relative h-[70vh] sm:h-[80vh] md:h-screen flex items-end justify-center overflow-hidden">
        <Image 
          src="/images/accra.jpg"
          alt="Roots and Rhythm Story"
          fill
          priority
          unoptimized
          className="object-cover"
        />
        {/* Subtle bottom fade only — no top bar */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#131A14] via-[#131A14]/60 to-[#131A14]" />
        
        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 pb-12 sm:pb-16 md:pb-24 text-left">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#B8860B] tracking-[0.3em] sm:tracking-[0.4em] text-[10px] sm:text-xs font-bold uppercase mb-4 sm:mb-6 block"
          >
            The Legacy
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif leading-[0.9] text-[#FAFAF8] drop-shadow-2xl"
          >
            Explore the Roots,<br/>Feel the Rhythm
          </motion.h1>
        </div>
      </section>

      {/* 2. OUR STORY SECTION */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 lg:gap-24 items-center mt-16 sm:mt-20 md:mt-24">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative aspect-[4/5] sm:aspect-[3/4] rounded-[28px] sm:rounded-[40px] overflow-hidden border border-white/5 shadow-2xl"
        >
          <Image 
            src="/images/Nkrumah-museum.jpeg" 
            alt="Roots and Rhythm Mission"
            fill
            className="object-cover"
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col gap-6 md:gap-8"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#FAFAF8] leading-tight">
            Why Roots & Rhythm Travels Exists
          </h2>
          <p className="text-white/60 text-base sm:text-lg leading-relaxed font-light">
            Roots & Rhythm Travels was born from a deep-seated cultural mission: to provide authentic, immersive experiences that transcend traditional tourism. 
          </p>
          <p className="text-white/60 text-base sm:text-lg leading-relaxed font-light">
            We believe that travel should be a dialogue between the soul and the soil. Our focus is on the heartbeat of West Africa—its music, dance, history, and spiritual traditions. Whether you are seeking your ancestral roots or exploring the vibrant rhythm of modern Ghana, we are your elite cultural stewardship partners.
          </p>
          
          <div className="grid grid-cols-2 gap-8 mt-4 pt-8 border-t border-white/10">
            <div>
              <span className="text-3xl font-serif text-[#B8860B] block mb-2">31-70+</span>
              <span className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Inclusive Age Reach</span>
            </div>
            <div>
              <span className="text-3xl font-serif text-[#B8860B] block mb-2">Bespoke</span>
              <span className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Curated Adventures</span>
            </div>
          </div>
        </motion.div>
      </section>
      {/* 2b. THE VISIONARY / OWNER SECTION */}
      <section className="bg-[#1A241B]/30 py-24 sm:py-32 mt-20 sm:mt-28 md:mt-40 border-y border-white/5 relative overflow-hidden">
        {/* Subtle Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#B8860B]/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#B8860B]/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
        
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1"
          >
            <span className="text-[#B8860B] tracking-[0.3em] text-[10px] font-bold uppercase mb-6 block">Meet the Visionary</span>
            <h2 className="text-4xl sm:text-5xl font-serif text-[#FAFAF8] leading-tight mb-8">
              "Roots & Rhythm is a dialogue between the soul and the soil."
            </h2>
            
            <div className="space-y-6 text-white/70 text-base sm:text-lg leading-relaxed font-light">
              <p>
                From a young age, I was captivated by the deep resonance of Ghanaian drumming and the stories etched into our ancient landscapes. Roots & Rhythm Travels was founded on the belief that travel should be more than a checklist; it should be a transformation.
              </p>
              <p>
                As a curator of cultural experiences, my mission is to bridge the gap between global travelers and the authentic pulse of West Africa. We don't just show you Ghana; we help you find your personal rhythm within its timeless traditions.
              </p>
            </div>

            <div className="mt-12 flex flex-col items-start gap-1">
              <span className="text-xl font-serif text-[#FAFAF8]">Elikem</span>
              <span className="text-[#B8860B] text-[10px] uppercase tracking-widest font-bold">Founder & Cultural Steward</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="order-1 lg:order-2 relative aspect-[4/5] rounded-[24px] sm:rounded-[32px] overflow-hidden group shadow-[0_32px_64px_rgba(0,0,0,0.6)]"
          >
            <Image 
              src="/images/elikem1.jpeg" 
              alt="Elikem — Founder of Roots & Rhythm"
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
              unoptimized
            />
            {/* Elite Image Gradient Overlay */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent" />
            
            <div className="absolute bottom-8 left-8 right-8">
              <div className="w-12 h-[1px] bg-[#B8860B] mb-4" />
              <p className="text-white/40 text-xs italic leading-relaxed">
                Dedicated to preserving and promoting the profound cultural heritage of West Africa through high-end, immersive stewardship.
              </p>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 3. MISSION & VALUES GRID */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 mt-20 sm:mt-28 md:mt-40">
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <span className="text-[#B8860B] tracking-[0.3em] text-[10px] font-bold uppercase mb-4 block">Our Philosophy</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif mb-6 text-[#FAFAF8]">Core Values & Cultural Mission</h2>
          <p className="text-white/40 leading-relaxed italic">"Rhythm and roots are the eternal pulse of the motherland. We are here to help you find your place within that cycle."</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          {missionValues.map((value, i) => (
            <motion.div 
              key={value.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group p-6 sm:p-8 md:p-10 bg-white/5 backdrop-blur-xl rounded-[24px] sm:rounded-[32px] border border-white/5 hover:border-[#FCD116]/30 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
            >
              <div className="mb-8 transform transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-1">
                {value.icon}
              </div>
              <h3 className="text-2xl font-serif mb-4 text-[#FAFAF8] group-hover:text-[#FCD116] transition-colors">{value.title}</h3>
              <p className="text-white/60 leading-relaxed font-light">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. CALL TO ACTION */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 mt-20 sm:mt-28 md:mt-40">
        <div className="relative w-full rounded-[24px] sm:rounded-[40px] overflow-hidden group min-h-[320px] sm:min-h-[400px] flex items-center justify-center text-center shadow-[0_30px_60px_rgba(0,0,0,0.6)] border border-white/5 bg-[#1A241B]">
           <div className="relative z-10 p-8 max-w-3xl">
              <span className="text-[#B8860B] tracking-[0.3em] text-[10px] font-bold uppercase mb-6 block">Ready to Connect?</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-[#FAFAF8] mb-6 sm:mb-10 leading-tight">Begin Your Authentic Ghanaian Immersion</h2>
              <div className="flex flex-wrap items-center justify-center gap-6">
                <a 
                  href="/tours" 
                  className="bg-[#E8D3A2] text-[#131A14] px-10 py-5 rounded-full font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-[#FAFAF8] transition-all transform hover:scale-105"
                >
                  View Collections
                </a>
                <a 
                  href="/contact" 
                  className="border border-white/20 text-white px-10 py-5 rounded-full font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-white hover:text-black transition-all transform hover:scale-105"
                >
                  Get In Touch
                </a>
              </div>
           </div>
           {/* Background Overlay */}
           <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/60" />
           <div className="absolute inset-0 bg-[url('/icon.png')] opacity-[0.03] scale-150 rotate-12" />
        </div>
      </section>

    </main>
  );
}
