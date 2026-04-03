'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Price from '@/components/Price';

interface Tour {
  id: string;
  title: string;
  slug: string;
  description_heading?: string;
  description_body?: string;
  description?: string;
  price: number;
  duration_days: number | string;
  location: string;
  hero_image_url: string;
  category?: string; 
}

export default function ToursListing({ initialTours }: { initialTours: Tour[] }) {
  const [activeFilter, setActiveFilter] = useState('ALL');
  
  const filters = ['ALL', 'CELEBRATIONS', 'DIASPORA CONNECTION', 'SPIRITUAL IMMERSION'];

  const filteredTours = initialTours.filter(tour => 
    activeFilter === 'ALL' ? true : tour.category === activeFilter
  );

  return (
    <div className="w-full bg-[#131A14] pt-32 pb-0 font-sans min-h-screen">
      
      {/* 1. Header & Filters Above The Fold */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-12 relative z-10 flex flex-col items-center text-center fade-in">
        <span className="text-[#B8860B] tracking-[0.3em] text-[10px] md:text-xs font-bold uppercase mb-4 block drop-shadow-sm">
          The Collection
        </span>
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-[#FAFAF8] leading-none mb-8">
          Select Your Journey
        </h1>

        <div className="flex flex-wrap items-center justify-center gap-2 p-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] w-max max-w-full mx-auto shadow-2xl overflow-x-auto no-scrollbar">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2.5 rounded-full text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase transition-all duration-300 ${
                activeFilter === filter 
                  ? 'bg-[#E8D3A2] text-[#1A241B] shadow-[0_0_20px_rgba(232,211,162,0.4)]' 
                  : 'text-white/60 border border-transparent hover:border-white/20 hover:text-white bg-transparent'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Scalable Symmetrical Editorial Grid */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto">
        <motion.div layout className="px-6 lg:px-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8 pb-16">
          <AnimatePresence mode="popLayout">
            {filteredTours.length > 0 ? (
              filteredTours.map((tour, index) => (
                <motion.div
                  layout
                  key={tour.id}
                  initial={{ opacity: 0, scale: 0.95, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.6, delay: index * 0.05, ease: [0.21, 0.47, 0.32, 0.98] }}
                >
                  <Link 
                     href={`/tours/${tour.slug}`} 
                     className="relative rounded-3xl overflow-hidden group cursor-pointer block shadow-2xl aspect-[4/5]"
                  >
                    <Image 
                      src={tour.hero_image_url || '/images/Square.jpeg'}
                      alt={tour.title}
                      fill
                      unoptimized={true}
                      className="object-cover w-full h-full transform transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#131A14] via-[#131A14]/70 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="absolute inset-0 p-5 md:p-6 flex flex-col justify-end text-left z-10">
                      <span className="text-[#E8D3A2] text-[10px] font-bold uppercase tracking-[0.2em] mb-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100 flex items-center gap-1.5 line-clamp-1">
                        {tour.duration_days} {typeof tour.duration_days === 'number' ? 'Days' : ''} <span className="text-white/30 px-1">•</span> {tour.location}
                      </span>
                      <h3 className="text-xl md:text-2xl font-serif text-[#FAFAF8] leading-tight mb-2 drop-shadow-sm">
                        {tour.title}
                      </h3>
                      <p className="text-white/60 text-[11px] leading-relaxed mb-4 line-clamp-2 md:max-w-md opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-150">
                        {tour.description_heading || tour.description_body || tour.description}
                      </p>
                      <div className="flex items-center justify-between w-full mt-3 border-t border-white/10 pt-3 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-200">
                        <Price amount={tour.price} className="text-[#FAFAF8] text-sm font-serif group-hover:text-[#E8D3A2] transition-colors" />
                        <span className="text-[#E8D3A2] text-[9px] uppercase font-bold tracking-[0.2em] flex items-center gap-1 group/link">
                          Explore <motion.span className="inline-block transition-transform duration-300 group-hover/link:translate-x-1">→</motion.span>
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-32 text-center">
                 <p className="text-white/40 text-[10px] uppercase font-bold tracking-[0.3em]">No tours found matching this selection.</p>
                 <p className="text-white/20 text-[8px] mt-2 tracking-widest">CHECK BACK SOON FOR NEW CURATED EXPEDITIONS.</p>
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* 3. The Isolated Bespoke Expedition Call to Action block (Sleek Horizontal Variation) */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 mt-8 pb-32 relative z-10">
        <div className="relative w-full rounded-[24px] overflow-hidden group min-h-[350px] md:min-h-[400px] flex items-center shadow-[0_30px_60px_rgba(0,0,0,0.6)] border border-white/5">
          <Image 
            src="/images/Square.jpeg" 
            alt="Build Your Own Expedition" 
            fill
            className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-105" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#131A14] via-[#131A14]/90 to-transparent" />
          
          <div className="relative z-10 p-8 md:p-16 max-w-2xl flex flex-col items-start gap-5">
            <span className="text-[#B8860B] tracking-[0.3em] text-[10px] md:text-xs font-bold uppercase drop-shadow-md">
              Strictly Bespoke
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#FAFAF8] leading-tight">
              Build Your Own Expedition
            </h2>
            <p className="text-white/60 text-sm md:text-base leading-relaxed max-w-lg mb-4">
              Don't see exactly what you're looking for? Work intimately with our elite travel concierge team to design a highly personalized motherland experience tailored precisely to your schedule, budget, and cultural interests.
            </p>
            <Link 
              href="/tours/build-your-own-expedition" 
              className="bg-[#E8D3A2] text-[#131A14] px-8 py-4 md:px-10 md:py-5 rounded-full font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs hover:bg-[#FAFAF8] hover:scale-105 transition-all shadow-xl"
            >
              Start Your Private Build
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
