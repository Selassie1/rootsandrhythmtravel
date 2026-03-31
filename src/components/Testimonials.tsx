'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const testimonials = [
  { 
    id: 1, 
    text: "Roots and Rhythm didn't just give us a tour; they gave us a homecoming. The naming ceremony brought tears to my eyes. Flawless execution.", 
    name: "Marcus T.", 
    location: "Volta Region", 
    image: "https://i.pravatar.cc/150?img=11",
    bgImage: "/images/volta-weaving.png"
  },
  { 
    id: 2, 
    text: "I wanted to experience the real Accra nightlife, safely and authentically. The team delivered an unforgettable 5 days.", 
    name: "Sarah J.", 
    location: "Accra", 
    image: "https://i.pravatar.cc/150?img=44",
    bgImage: "/images/Art-center.jpeg"
  },
  { 
    id: 3, 
    text: "From the history of Cape Coast to the energy of the festivals, every single detail was curated perfectly.", 
    name: "David & Nia", 
    location: "Cape Coast", 
    image: "https://i.pravatar.cc/150?img=33",
    bgImage: "/images/Cape-Coast-fest.jpeg"
  },
  { 
    id: 4, 
    text: "An immersive dive into our heritage. We felt like royalty experiencing the Ashanti traditions firsthand.", 
    name: "Elena R.", 
    location: "Ashanti Region", 
    image: "https://i.pravatar.cc/150?img=47",
    bgImage: "/images/Drumming.jpeg"
  },
  { 
    id: 5, 
    text: "The local guides felt like old friends. We discovered hidden gems in the Eastern Region we would never have found otherwise.", 
    name: "Kwame & Lisa", 
    location: "Eastern Region", 
    image: "https://i.pravatar.cc/150?img=60",
    bgImage: "/images/Square.jpeg"
  },
  { 
    id: 6, 
    text: "From start to finish, the curation was immaculate. The perfect balance of deep cultural education and pure relaxation.", 
    name: "James W.", 
    location: "Northern Region", 
    image: "https://i.pravatar.cc/150?img=68",
    bgImage: "/images/Volta.jpeg"
  }
];

const Testimonials = () => {
  const [activeId, setActiveId] = useState(1);

  return (
    <section className="w-full py-20 bg-[#FAFAF8] relative overflow-hidden">
      
      {/* Premium Background Blur Accents */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-white to-transparent opacity-80 pointer-events-none"></div>
      <div className="absolute -left-60 top-20 w-[800px] h-[800px] bg-[#E8D3A2]/20 rounded-full blur-[100px] pointer-events-none mix-blend-multiply"></div>

      <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Editorial Split Header Area */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-8"
        >
          <div className="max-w-xl">
            <span className="block text-sm font-bold tracking-[0.3em] text-[#B8860B] uppercase mb-4">
              Voices of the Motherland
            </span>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif text-[#1A241B] leading-[1.05]">
              Stories from the <br className="hidden md:block"/> Diaspora
            </h2>
          </div>
          
          <div className="md:max-w-sm pb-2">
            <p className="text-gray-500 text-lg leading-relaxed font-medium">
              Don't just take our word for it. Hear directly from those who have journeyed across oceans to reconnect, celebrate, and discover the true rhythm of Ghana with us.
            </p>
          </div>
        </motion.div>

        {/* Cinematic Expanding Accordion Layout - Height Reduced */}
        <div className="flex flex-col md:flex-row gap-4 w-full h-[550px] md:h-[480px] relative z-10">
          {testimonials.map((t) => {
            const isActive = activeId === t.id;
            return (
              <div 
                key={t.id}
                onClick={() => setActiveId(t.id)}
                className={`relative overflow-hidden rounded-[2rem] cursor-pointer shadow-xl transition-[flex-grow] duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)] flex flex-col justify-end group ${
                  isActive ? "flex-[6_6_0%] md:flex-[7_7_0%]" : "flex-[1_1_0%] md:flex-[1_1_0%]"
                }`}
              >
                {/* Immersive Background Image Map */}
                <Image 
                  src={t.bgImage} 
                  alt={t.location}
                  fill
                  className="object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-105" 
                />
                
                {/* Smart Gradient Overlays - Cream wash for active, Dark green for inactive */}
                <div 
                  className={`absolute inset-0 transition-colors duration-[800ms] ease-in-out ${
                    isActive ? "bg-gradient-to-r from-white/80 via-white/70 to-[#E8D3A2]/50" : "bg-[#1A241B]/70 group-hover:bg-[#1A241B]/50"
                  }`} 
                />

                {/* Vertical Inactive State Lockup */}
                <div 
                  className={`absolute inset-0 p-6 flex flex-row md:flex-col items-end md:items-center justify-start md:justify-end gap-4 transition-opacity duration-500 z-20 ${
                    isActive ? "opacity-0 pointer-events-none" : "opacity-100 delay-200"
                  }`}
                >
                  <img src={t.image} alt={t.name} className="w-10 h-10 md:w-14 md:h-14 rounded-full border-2 border-[#E8D3A2] object-cover shadow-2xl shrink-0" />
                  <span className="text-white font-bold tracking-[0.2em] uppercase text-xs md:hidden mb-1">
                    {t.location}
                  </span>
                  <span className="text-white font-bold tracking-[0.3em] uppercase text-[10px] md:text-xs hidden md:block md:mb-6" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', whiteSpace: 'nowrap' }}>
                    {t.location}
                  </span>
                </div>

                {/* Massive Hero Active State Data */}
                <div 
                  className={`relative z-20 p-8 md:p-12 lg:p-14 flex flex-col justify-end w-full h-full transition-opacity duration-700 ease-in overflow-hidden ${
                    isActive ? "opacity-100 delay-300 pointer-events-auto" : "opacity-0 pointer-events-none hidden md:flex"
                  }`}
                >
                  {/* Safely constrained fixed width so it seamlessly scales down without text clipping or aggressive wrap-glitches */}
                  <div className="w-[280px] md:w-[400px] lg:w-[480px] xl:w-[600px] pr-4">
                    <span className="absolute -top-10 md:-top-16 left-2 md:left-6 text-[8rem] md:text-[10rem] font-serif text-[#E8D3A2]/40 leading-none pointer-events-none select-none">"</span>
                    
                    <p className="text-xl md:text-2xl lg:text-3xl text-[#1A241B] font-serif italic leading-relaxed md:leading-[1.4] mb-8 relative z-10 w-full pr-2">
                      "{t.text}"
                    </p>
                    
                    <div className="flex items-center gap-4 relative z-10">
                      <img src={t.image} alt={t.name} className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-[#1A241B] object-cover shadow-sm shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-[#1A241B] font-bold text-base md:text-lg">{t.name}</span>
                        <span className="text-[#B8860B] text-[10px] md:text-xs font-bold tracking-widest uppercase mt-0.5">{t.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Testimonials;
