//src/components/FeaturedJourneys.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { getActiveTours } from '@/actions/tours';

interface Tour {
  title: string;
  slug: string;
  hero_image_url: string | null;
  description_body: string | null;
  duration_days: number;
  experience: string | string[];
}

const FeaturedJourneys = () => {
  const [journeys, setJourneys] = useState<Tour[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getActiveTours();
      // Show only top 3 as featured
      if (data) setJourneys(data.slice(0, 3) as Tour[]);
    };
    fetchData();
  }, []);

  const formatExperience = (exp: string | string[]) => {
    const values = Array.isArray(exp) ? exp : [exp];
    return values.map(e => e.charAt(0).toUpperCase() + e.slice(1).toLowerCase()).join(' · ');
  };

  return (
    <section className="relative w-full bg-[#FAFAF8] py-32 overflow-hidden">
      {/* Decorative Glow Watermark */}
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[800px] h-[800px] bg-[#F0EBE1] rounded-full blur-3xl opacity-50 pointer-events-none z-0"></div>

      {/* Header Area (Split Layout) */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-16 flex flex-col md:flex-row md:justify-between md:items-end gap-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <span className="block text-sm font-bold tracking-[0.3em] text-[#B8860B] uppercase mb-4">
            Your Adventure Awaits
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-[#1A241B] leading-tight">
            Curated Journeys
          </h2>
        </motion.div>

        <Link 
          href="/tours" 
          className="group flex items-center gap-3 text-sm font-bold tracking-widest uppercase text-[#2A3B2C] hover:text-[#B8860B] transition-colors pb-2"
        >
          View All Itineraries 
          <span className="w-8 h-[1px] bg-current transform origin-left transition-transform duration-300 group-hover:scale-x-150"></span>
        </Link>
      </div>

      {/* The Grid Container */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 relative z-10">
        {journeys.length > 0 ? journeys.map((journey, idx) => (
          <motion.div 
            key={journey.slug}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: idx * 0.15 }}
            className="relative group w-full aspect-[3/4] rounded-[2rem] overflow-hidden cursor-pointer shadow-xl"
          >
            {/* Background Image */}
            <Image 
              src={journey.hero_image_url || "/images/hero-default.jpg"} 
              alt={journey.title}
              fill
              unoptimized
              className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105" 
            />
            
            {/* The Gradient - Rich Forest Green mapping */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A241B]/95 via-[#1A241B]/40 to-transparent transition-opacity duration-500 opacity-90 group-hover:opacity-100 z-0" />
            
            {/* Top Category Pill */}
            <div className="absolute top-6 left-6 bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-[10px] font-bold tracking-[0.2em] uppercase px-4 py-2 rounded-full z-10">
              {formatExperience(journey.experience)}
            </div>

            {/* The Card Content (Bottom Reveal) */}
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10 transform translate-y-12 transition-transform duration-500 group-hover:translate-y-0 z-10 flex flex-col justify-end">
              <h3 className="text-3xl md:text-4xl font-serif text-white leading-tight mb-3 transition-colors duration-300">
                {journey.title}
              </h3>
              
              <div className="flex items-center gap-3 text-[#E8D3A2] text-[10px] md:text-xs font-bold tracking-widest uppercase mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B]"></span>
                {journey.duration_days} Days
              </div>
              
              {/* Hover Reveal Block */}
              <div className="opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <p className="text-gray-300 text-sm line-clamp-2 md:line-clamp-3 mb-6 leading-relaxed">
                  {journey.description_body}
                </p>
                <Link href={`/tours/${journey.slug}`} className="block">
                  <button className="w-full bg-white text-[#1A241B] py-3.5 rounded-xl font-bold hover:bg-[#EAE5D9] transition-colors shadow-xl focus:outline-none">
                    Explore Itinerary
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )) : (
          /* Skeleton Loader */
          [1,2,3].map((i) => (
            <div key={i} className="aspect-[3/4] rounded-[2rem] bg-gray-100 animate-pulse"></div>
          ))
        )}
      </div>
    </section>
  );
};

export default FeaturedJourneys;
