'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';

interface Tour {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  duration_days: number;
  location: string;
  hero_image_url: string;
}

export default function TourFilters({ initialTours }: { initialTours: Tour[] }) {
  const [activeFilter, setActiveFilter] = useState('All');

  // We can dynamically generate filters based on locations, or hardcode categories
  const filters = ['All', 'Accra', 'Cape Coast', 'Northern Region'];

  // Temporary mock data injection if the Supabase database is empty so the user can easily see the premium UI design
  const displayTours = initialTours.length > 0 ? initialTours : [
    {
      id: '1',
      title: 'The Golden Kingdom Immersion',
      slug: 'golden-kingdom-immersion',
      description: 'A deep dive into the Ashanti Empire. Experience royal protocols, ancient craft villages, and pristine waterfalls.',
      price: 3500,
      duration_days: 10,
      location: 'Kumasi',
      hero_image_url: '/images/kintampo.jpeg'
    },
    {
      id: '2',
      title: 'Diaspora Return Journey',
      slug: 'diaspora-return-journey',
      description: 'Walk the solemn paths of Cape Coast and Elmina. A transformational heritage journey reconnecting you to the roots.',
      price: 2800,
      duration_days: 7,
      location: 'Cape Coast',
      hero_image_url: '/images/Square.jpeg'
    },
    {
      id: '3',
      title: 'Accra Rhythm & Nightlife',
      slug: 'accra-rhythm-nightlife',
      description: 'Pulse with the city. High-end culinary tours, VIP afrobeats access, and contemporary art galleries.',
      price: 1500,
      duration_days: 4,
      location: 'Accra',
      hero_image_url: '/images/kintampo.jpeg'
    }
  ];

  const filteredTours = displayTours.filter(tour => 
    activeFilter === 'All' ? true : tour.location.includes(activeFilter)
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-12 relative z-10">
      
      {/* Filtering Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
        <div>
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-4">Curated Journeys</h2>
          <p className="text-white/50 tracking-widest uppercase text-xs font-bold">Select your immersive experience</p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 md:gap-4">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-3 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 ${
                activeFilter === filter 
                  ? 'bg-[#B8860B] text-black shadow-[0_0_20px_rgba(184,134,11,0.4)]' 
                  : 'bg-[#1A241B] text-white/50 hover:text-white border border-white/5 hover:border-white/20'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Layout Layout */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-16">
        <AnimatePresence mode="popLayout">
          {filteredTours.map((tour, index) => (
            <motion.div
              layout
              key={tour.id}
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group flex flex-col"
            >
              {/* Image Container with Hover Effects */}
              <Link href={`/tours/${tour.slug}`} className="relative w-full aspect-[4/5] rounded-[24px] overflow-hidden mb-6 block">
                <Image 
                  src={tour.hero_image_url || '/images/Square.jpeg'}
                  alt={tour.title}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                
                {/* Gradient overlay specifically for the text tags inside the image */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                {/* Floating Tags */}
                <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                  <div className="flex flex-col gap-2">
                    <span className="flex items-center gap-2 text-white/80 text-[10px] font-bold uppercase tracking-widest bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full w-fit">
                      <MapPin size={12} className="text-[#B8860B]" /> {tour.location}
                    </span>
                    <span className="flex items-center gap-2 text-white/80 text-[10px] font-bold uppercase tracking-widest bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full w-fit">
                      <Calendar size={12} className="text-[#B8860B]" /> {tour.duration_days} Days
                    </span>
                  </div>
                  
                  {/* Circular Hover Arrow */}
                  <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white -translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                     <ArrowRight size={18} />
                  </div>
                </div>
              </Link>

              {/* Data payload below image */}
              <div className="flex flex-col px-2">
                <h3 className="text-2xl font-serif text-white mb-2 group-hover:text-[#E8D3A2] transition-colors">{tour.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed mb-6 line-clamp-2">{tour.description}</p>
                
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex flex-col">
                     <span className="text-[9px] text-white/40 uppercase tracking-[0.2em] font-bold">Starting from</span>
                     <span className="text-[#B8860B] text-lg font-serif">${tour.price.toLocaleString()}</span>
                  </div>
                  
                  <Link href={`/tours/${tour.slug}`} className="text-xs font-bold uppercase tracking-[0.2em] text-white hover:text-[#B8860B] transition-colors border-b border-white/20 hover:border-[#B8860B] pb-1">
                    Discover Tour
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

    </div>
  );
}
