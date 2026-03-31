"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const greetings = [
  { text: "Akwaaba", lang: "Twi", meaning: "Welcome" },
  { text: "Oobakɛ", lang: "Ga", meaning: "Welcome" },
  { text: "Woezor", lang: "Ewe", meaning: "Welcome" },
  { text: "Barka da zuwa", lang: "Hausa", meaning: "Welcome" }
];

export default function Hero() {
  const [greetingIndex, setGreetingIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setGreetingIndex((prevIndex) => (prevIndex + 1) % greetings.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative bg-black-star h-[90vh] min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax-style Animation */}
      <motion.div 
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 10, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000"
          style={{ backgroundImage: 'url("/hero-bg.png")' }}
        />
      </motion.div>

      {/* Background Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90 z-10" />
      
      {/* Animated Gradient Orbs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, -30, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-ghana-red/10 rounded-full blur-[120px] z-0" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          x: [0, -60, 0],
          y: [0, 40, 0]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-ghana-gold/10 rounded-full blur-[120px] z-0" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          y: [0, 80, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[20%] right-[15%] w-[400px] h-[400px] bg-ghana-green/10 rounded-full blur-[120px] z-0" 
      />

      <div className="relative z-20 text-center px-6 max-w-6xl mx-auto">
        {/* Animated Greeting */}
        <div className="mb-8 h-10 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={greetingIndex}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-col items-center"
            >
              <h2 className="text-ghana-gold font-semibold text-xl md:text-2xl tracking-[0.2em] uppercase">
                {greetings[greetingIndex].text}
              </h2>
              <span className="text-gray-400 text-xs mt-1 font-light italic">
                {greetings[greetingIndex].lang} • {greetings[greetingIndex].meaning}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-[1.1] tracking-tight"
        >
          Explore the <span className="text-ghana-red">Roots</span>,<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-ghana-gold via-white to-ghana-green">
            Feel the Rhythm
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-lg md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto font-light leading-relaxed font-sans"
        >
          Discover Ghana&apos;s hidden gems through authentic cultural immersions and spiritual journeys designed specifically for the African Diaspora.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <Link 
            href="/tours" 
            className="group relative px-10 py-5 bg-ghana-red text-white rounded-full font-bold text-lg overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-xl w-full sm:w-auto"
          >
            <span className="relative z-10">Discover Our Tours</span>
            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
          </Link>
          <Link 
            href="/about" 
            className="px-10 py-5 bg-transparent border-2 border-ghana-gold text-ghana-gold hover:bg-ghana-gold hover:text-black-star rounded-full font-bold text-lg transition-all backdrop-blur-sm w-full sm:w-auto mt-4 sm:mt-0"
          >
            Our Story
          </Link>
        </motion.div>
      </div>
      
      {/* Kente-inspired Decorative Bottom Border */}
      <div className="absolute bottom-0 w-full h-3 flex z-30">
        <div className="h-full flex-1 bg-ghana-red"></div>
        <div className="h-full flex-1 bg-ghana-gold"></div>
        <div className="h-full flex-1 bg-ghana-green"></div>
        <div className="h-full flex-1 bg-black-star"></div>
        <div className="h-full flex-1 bg-ghana-red"></div>
        <div className="h-full flex-1 bg-ghana-gold"></div>
        <div className="h-full flex-1 bg-ghana-green"></div>
      </div>
    </div>
  );
}
