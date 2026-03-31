'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const HowToBookPremium = () => {
  const steps = [
    {
      num: "01",
      title: "Choose a Package",
      desc: "Browse our highly curated cultural and diaspora experiences."
    },
    {
      num: "02",
      title: "Plan Your Dates",
      desc: "Select your preferred dates and group size. We handle the logistics."
    },
    {
      num: "03",
      title: "Secure Reservation",
      desc: "Confirm your booking safely online. Arrive in Ghana and let the rhythm guide you."
    }
  ];

  return (
    <section className="relative w-full py-32 overflow-hidden bg-[#131A14]">
      {/* Authentic Adinkra Watermark */}
      <div 
        className="absolute top-0 right-0 -translate-y-10 translate-x-20 w-[600px] h-[600px] opacity-[0.04] pointer-events-none z-0"
        style={{
          backgroundColor: '#FFFFFF',
          WebkitMaskImage: "url('/icons/adinkra.svg')",
          WebkitMaskSize: 'contain',
          WebkitMaskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
          maskImage: "url('/icons/adinkra.svg')",
          maskSize: 'contain',
          maskRepeat: 'no-repeat',
          maskPosition: 'center'
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10">
        
        {/* Left Column: Curated Image Card */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative flex flex-col items-center justify-center p-3 bg-white/5 rounded-3xl backdrop-blur-sm border border-white/10 shadow-2xl w-full max-w-md mx-auto lg:mx-0"
        >
          <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-inner">
            <Image 
              src="/images/Cape-Coast-fest.jpeg" 
              alt="Cape Coast Festival Celebration" 
              fill
              className="object-cover"
            />
          </div>
          
          {/* Trust Badge */}
          <div className="absolute -bottom-6 -right-6 bg-[#E8D3A2] text-[#1A241B] p-5 rounded-2xl shadow-xl border-4 border-[#131A14] z-20 flex flex-col justify-center items-center">
            <span className="font-extrabold text-sm whitespace-nowrap tracking-wider uppercase">100% Secure</span>
            <span className="text-[10px] sm:text-[11px] font-bold opacity-80 uppercase tracking-widest mt-1">• Local Experts</span>
          </div>
        </motion.div>

        {/* Right Column: Modular Editorial Steps */}
        <div className="flex flex-col">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[#B8860B] text-sm tracking-[0.3em] uppercase font-bold mb-4 block">
              SEAMLESS CURATION
            </span>
            <h2 className="text-[#FAFAF8] text-4xl lg:text-5xl font-serif leading-tight mb-12">
              Book Your Journey in 3 Simple Steps
            </h2>
          </motion.div>

          <div className="flex flex-col gap-10">
            {steps.map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 0.2 + (idx * 0.15) }}
                className="flex flex-row items-start gap-6"
              >
                {/* Number Circle */}
                <div className="text-[#B8860B] font-serif text-2xl bg-[#B8860B]/10 w-14 h-14 flex items-center justify-center rounded-full shrink-0 border border-[#B8860B]/20">
                  {step.num}
                </div>
                
                {/* Text Content */}
                <div className="flex flex-col mt-1">
                  <h3 className="text-white text-xl font-serif mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default HowToBookPremium;
