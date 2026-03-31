'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const NewsletterCTA = () => {
  return (
    <section className="relative w-full py-24 lg:py-32 z-10">
      {/* Top Half: Soft Cream explicitly matching previous Testimonials */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-[#FAFAF8] -z-10"></div>
      
      {/* Bottom Half: Deep Forest explicitly setting up the future Dark Footer overlap */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-[#131A14] -z-10"></div>

      <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 relative flex items-center justify-start min-h-[600px] lg:min-h-[700px]">
        
        {/* The Massive Image Anchor (Background on Mobile, Right-Aligned Overlap on Desktop) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="absolute inset-x-6 inset-y-0 lg:inset-y-12 lg:right-12 lg:left-1/3 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_-15px_rgba(0,0,0,0.4)] group z-0"
        >
          {/* Mobile Overlay Darkener ensures text is always readable before the layout splits on Desktop */}
          <div className="absolute inset-0 bg-black/60 lg:bg-[#1A241B]/10 z-10 transition-colors duration-700 group-hover:bg-[#1A241B]/0 pointer-events-none" />
          
          <Image 
            src="/images/Volta.jpeg" 
            alt="Ghanaian Landscape" 
            fill
            className="object-cover transition-transform duration-[3000ms] ease-out group-hover:scale-[1.03]"
          />
        </motion.div>

        {/* The Overlapping Editorial Block (Full cover on Mobile, Left-Aligned Overlap on Desktop) */}
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="relative z-10 w-full lg:w-[55%] xl:w-[50%] bg-transparent lg:bg-[#0A0F0C]/85 backdrop-blur-none lg:backdrop-blur-2xl border-none lg:border lg:border-white/10 rounded-[2rem] md:rounded-[2.5rem] p-8 sm:p-12 lg:p-20 shadow-none lg:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col justify-center"
        >
          {/* Subtle Inner Glow on the dark box to give the typography ambient luxury lighting */}
          <div className="hidden lg:block absolute -top-40 -left-40 w-96 h-96 bg-[#E8D3A2]/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />

          <div className="relative z-20">
            <span className="text-[#E8D3A2] text-xs md:text-sm font-bold tracking-[0.4em] uppercase mb-6 block">
              Join The Circle
            </span>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-[1.1] mb-8">
              Experience the Magic of the <span className="italic text-[#E8D3A2]">Motherland.</span>
            </h2>
            
            <p className="text-base md:text-lg text-white/70 font-light mb-12 leading-relaxed max-w-md">
              Discover breathtaking views, vibrant festivals, and unforgettable moments. Join our inner circle for exclusive itineraries, cultural insights, and early access.
            </p>

            {/* Ultra-Premium Glass Form Input */}
            <form 
              onSubmit={(e) => e.preventDefault()}
              className="relative flex flex-col sm:flex-row items-center w-full max-w-lg bg-white/5 lg:bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl sm:rounded-full p-2 shadow-2xl transition-all duration-500 focus-within:bg-white/20 focus-within:border-[#E8D3A2]/50 group/form"
            >
              <input 
                type="email" 
                placeholder="Enter your email address..." 
                className="w-full bg-transparent text-white placeholder-white/50 px-6 py-4 outline-none border-none text-sm md:text-base font-medium tracking-wide" 
                required 
              />
              <button 
                type="submit" 
                className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#E8D3A2] text-[#1A241B] hover:bg-white transition-colors duration-300 px-8 py-4 rounded-xl sm:rounded-full font-extrabold text-sm tracking-[0.2em] uppercase cursor-pointer shrink-0"
              >
                Join
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform duration-300 group-hover/form:translate-x-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </form>

            {/* Subtle Trust Indicators */}
            <div className="mt-8 flex items-center gap-4 opacity-50">
              <span className="text-[10px] md:text-xs text-white uppercase tracking-widest font-bold">Unsubscribe Anytime</span>
              <span className="w-1 h-1 rounded-full bg-[#E8D3A2]" />
              <span className="text-[10px] md:text-xs text-white uppercase tracking-widest font-bold">No Spam</span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default NewsletterCTA;
