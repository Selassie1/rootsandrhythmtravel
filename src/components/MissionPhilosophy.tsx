'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Caveat } from 'next/font/google';
import Image from 'next/image';

const caveat = Caveat({ subsets: ['latin'], weight: ['400', '700'] });

const MissionPhilosophy = () => {
  return (
    <section className="w-full relative bg-gradient-to-br from-[#FFFFFF] via-[#FDFBF7] to-[#F0EBE1] py-32 overflow-hidden">
      {/* High-end Subtle Photographic Noise Texture for Premium Editorial Look */}
      <div className="absolute inset-0 z-0 opacity-[0.035] pointer-events-none mix-blend-multiply" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10">
        
        {/* Left Side: Overlapping Editorial Images */}
        <motion.div 
          className="relative aspect-[3/4] w-full max-w-md mx-auto lg:mx-0"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          {/* Decorative Element */}
          <div className="absolute -top-6 -left-6 w-1/2 h-1/2 bg-[#E8D3A2]/40 rounded-3xl z-0"></div>
          
          {/* Main Image (Drummer) */}
          <div className="absolute inset-0 z-10 w-full h-full">
            <Image 
              src="/images/Drumming.jpeg" 
              alt="Cultural Ghanaian Drummer" 
              fill
              className="object-cover rounded-2xl shadow-2xl"
            />
          </div>
          
          {/* Secondary Image (The Overlap) */}
          <div className="absolute -bottom-6 -right-4 sm:-bottom-12 sm:-right-12 w-1/2 h-1/2 z-20 border-4 sm:border-8 border-[#FDFBF7] rounded-2xl overflow-hidden shadow-xl">
            <Image 
              src="/images/Volta.jpeg" 
              alt="Authentic weaving" 
              fill
              className="object-cover"
            />
          </div>
        </motion.div>

        {/* Right Side: Premium Typography */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          <span className="block text-sm font-bold tracking-[0.3em] text-[#B8860B] uppercase mb-6">
            Beyond Tourism
          </span>
          
          <h2 className="text-5xl lg:text-6xl font-serif text-[#1A241B] leading-[1.1] mb-8">
            Experience the true pulse of Ghana.
          </h2>
          
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            Roots and Rhythm Travels goes beyond the standard tourist trail. We curate deeply authentic, immersive experiences designed for anyone seeking a genuine connection to our culture, whether you are returning to your heritage or discovering the magic of West Africa for the first time.
          </p>
          
          <p className="text-lg text-gray-600 leading-relaxed mb-10">
            From sacred cultural ceremonies to the vibrant energy of Accra's nightlife, we handle every detail of your journey. Come as a traveler, leave as family.
          </p>
          
          <p className={`text-4xl lg:text-5xl text-[#B8860B] leading-none tracking-wide pt-2 ${caveat.className}`}>
            Roots and Rhythm Travels
          </p>
        </motion.div>

      </div>
    </section>
  );
};

export default MissionPhilosophy;
