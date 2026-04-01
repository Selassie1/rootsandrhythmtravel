//frontend/src/components/PremiumHero.tsx
"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, User, Search, MapPin, Timer, TreePalm, Sun, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import VerticalGreetings from './VerticalGreetings';

const destinations = [
  { id: 1, name: "Kintampo Waterfalls", videoSrc: "https://ovvtrasavonyhsidimci.supabase.co/storage/v1/object/public/media/kintampo.mp4", thumbnailSrc: "/images/kintampo.jpg" },
  { id: 2, name: "Adomi Bridge", videoSrc: "https://ovvtrasavonyhsidimci.supabase.co/storage/v1/object/public/media/adomi.mp4", thumbnailSrc: "/images/adomi.jpg" },
  { id: 3, name: "Aburi Gardens", videoSrc: "https://ovvtrasavonyhsidimci.supabase.co/storage/v1/object/public/media/aburi.mp4", thumbnailSrc: "/images/aburi.jpg" }
];

export default function PremiumHero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentDest = destinations[currentIndex];
  
  const [activeTab, setActiveTab] = useState('Tours');

  const [location, setLocation] = useState('');
  const [tourType, setTourType] = useState('');
  const [timeframe, setTimeframe] = useState('');
  const [travelers, setTravelers] = useState('');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const locations = [
    "Anywhere in Ghana", "Greater Accra", "Central Region (Heritage)",
    "Ashanti Region (Culture)", "Eastern Region (Nature)", "Volta Region", "Northern Savannah"
  ];
  const tourTypes = [
    "All Experiences", "Celebration Journeys", "Diaspora Connection",
    "Spiritual Tourism", "Adventure & Nature", "Educational Groups"
  ];
  const timeframes = [
    "Flexible Dates", "This Month", "Next Month", "Festival Season", "Custom Dates"
  ];
  const travelerOptions = [
    "Solo Traveler", "Couple", "Family", "Small Group", "Large / Educational Group"
  ];

  return (
    <div className="relative w-full h-screen min-h-[800px] bg-black overflow-hidden font-sans">
      {/* Background Video Layer */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentDest.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 z-0"
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={currentDest.thumbnailSrc}
            className="object-cover w-full h-full opacity-60"
          >
            <source src={currentDest.videoSrc} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
        </motion.div>
      </AnimatePresence>



      {/* Foreground Content Layer */}
      <div className="relative z-20 w-full h-full flex flex-col justify-between pt-8 pb-12 px-8 md:px-16">

        {/* Vertical Greetings — mirrors social links on the right */}
        <VerticalGreetings />
        
        {/* Header Section (Removed: Now controlled by GlobalNav globally) */}

        {/* Middle Content area */}
        <div className="flex flex-1 items-center justify-between w-full h-full">
          
          {/* Left: Thumbnails Carousel */}
          <div className="flex flex-col gap-6">
            {destinations.map((dest, idx) => (
              <button 
                key={dest.id}
                onClick={() => setCurrentIndex(idx)}
                className={`relative w-12 h-12 md:w-10 md:h-10 rounded-xl overflow-hidden transition-all duration-500 border-[1px] ${
                  idx === currentIndex 
                    ? 'border-transparent scale-110 z-10 shadow-[0_0_15px_rgba(255,255,255,0.4)]' 
                    : 'border-transparent opacity-50 hover:opacity-100 hover:scale-105'
                }`}
              >
                <Image src={dest.thumbnailSrc} alt={dest.name} fill className="object-cover" />
                <div className="absolute inset-0 bg-black/30 w-full h-full" />
              </button>
            ))}
          </div>

          {/* Center: Primary Title (Z-Design) */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0 mt-[-1vh]">
            <AnimatePresence>
              <motion.div
                key={currentDest.id}
                initial={{ opacity: 0, filter: "blur(10px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(10px)" }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="w-full max-w-5xl px-8 flex flex-col items-center absolute inset-0 justify-center pointer-events-none"
              >
                <div className="flex flex-col items-center relative w-full">
                  {/* Top Word */}
                  <h2 
                    className="text-[4vw] lg:text-[6vw] leading-none font-[ui-monospace] font-normal text-white drop-shadow-2xl tracking-wide self-start uppercase ml-[25%]"
                  >
                    {currentDest.name.split(' ')[0]}
                  </h2>

                  {/* Stars in the center gap */}
                  <div 
                    className="flex gap-3 py-2 -mt-1 z-10 ml-[50%]"
                  >
                    <span className="text-white text-3xl font-light scale-y-150 transform">✦</span>
                    <span className="text-white text-3xl font-light scale-y-150 transform">✦</span>
                    <span className="text-white text-3xl font-light scale-y-150 transform">✦</span>
                  </div>

                  {/* Bottom Word */}
                  <h2 
                    className="text-[4vw] lg:text-[6vw] leading-none font-[ui-monospace] font-normal text-white drop-shadow-2xl tracking-wide self-end uppercase mr-[-25%] mt-3"
                  >
                    {currentDest.name.substring(currentDest.name.indexOf(' ') + 1)}
                  </h2>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: Social & Spinning text */}
          <div className="flex items-center">
            {/* Spinning text decoration */}
            <div className="relative w-32 h-32 mr-2 hidden lg:block">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-full h-full"
              >
                {/* SVG text circle */}
                <svg viewBox="0 0 100 100" className="w-full h-full text-white/80 fill-current overflow-visible">
                  <path id="circlePath" d="M 50, 50 m -40, 0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0" fill="none" />
                  <text fontSize="8" letterSpacing="2.5">
                    <textPath href="#circlePath" startOffset="0%">
                      • FEEL THE RHYTHM • EXPLORE THE ROOTS
                    </textPath>
                  </text>
                </svg>
              </motion.div>
            </div>
            {/* Vertical Socials */}
            <div className="flex flex-col gap-30 text-xs tracking-[0.1em] text-white/70 font-medium mb-10 -mr-2">
              <a href="#" className="rotate-90 hover:text-white transition-colors">FACEBOOK</a>
              <a href="#" className="rotate-90 hover:text-white transition-colors">TWITTER</a>
              <a href="#" className="rotate-90 hover:text-white transition-colors">INSTAGRAM</a>
            </div>
          </div>
        </div>

        {/* Bottom Section: Find Journey / Booking Bar */}
        <div className="absolute bottom-[10vh] left-1/2 -translate-x-1/2 w-[1050px] max-w-[95vw] flex flex-col items-center z-30">

            {/* Find Your Journey + Tabs Row */}
            <div className="w-full flex items-end justify-center relative z-20 h-[64px]">

              {/* Find Your Journey — pinned left */}
              <div className="absolute left-4 bottom-6 flex items-center gap-3 text-white z-40">
                <Sun className="text-[#fcfcda] w-10 h-10 drop-shadow-lg" fill="#fcfcda" strokeWidth={1} />
                <div className="flex flex-col leading-tight pt-1">
                  <span className="text-[10px] tracking-widest uppercase font-medium">Find Your</span>
                  <span className="text-xs font-bold tracking-widest uppercase">Journey</span>
                </div>
              </div>

              {/* Tabs — flared folder tab effect for the active tab */}
              <div className="flex items-end gap-0 relative translate-y-[1px] z-10 px-6">
                  {/* Shared background block for inactive tabs to appear combined and swoop into the base */}
                  <div className="absolute left-6 right-6 bottom-0 top-0 bg-[#F2F5D5] rounded-t-2xl -z-10
                    before:content-[''] before:absolute before:w-6 before:h-6 before:bg-transparent before:bottom-0 before:-left-6 before:rounded-br-2xl before:shadow-[15px_15px_0_0_#F2F5D5]
                    after:content-[''] after:absolute after:w-6 after:h-6 after:bg-transparent after:bottom-0 after:-right-6 after:rounded-bl-2xl after:shadow-[-15px_15px_0_0_#F2F5D5]
                  " />

                  {['Tours', 'Events', 'Custom'].map((tab) => (
                    <div key={tab} className="relative z-10 flex">
                      {/* Sliding Active Background */}
                      {activeTab === tab && (
                        <motion.div
                          layoutId="activeTabBubble"
                          transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                          className="absolute inset-0 bg-white rounded-t-2xl z-0 shadow-none
                            before:content-[''] before:absolute before:w-6 before:h-6 before:bg-transparent 
                            before:bottom-0 before:-left-6 before:rounded-br-2xl before:shadow-[15px_15px_0_0_white]
                            after:content-[''] after:absolute after:w-6 after:h-6 after:bg-transparent 
                            after:bottom-0 after:-right-6 after:rounded-bl-2xl after:shadow-[-15px_15px_0_0_white]
                          "
                        />
                      )}
                      
                      {/* Tab Text */}
                      <button
                        onClick={() => setActiveTab(tab)}
                        className={`relative w-full px-12 py-3 text-sm font-semibold transition-colors duration-300 z-10 flex items-center justify-center outline-none
                          ${activeTab === tab ? 'text-gray-900 pointer-events-none' : 'text-gray-600 hover:text-gray-900'}
                        `}
                      >
                        {tab}
                      </button>
                    </div>
                  ))}
              </div>
            </div>

            {/* Inputs Panel (The White Bar itself) — taller with more padding */}
            <div ref={dropdownRef} className="bg-white rounded-[24px] p-4 pl-6 flex items-center justify-between shadow-2xl z-20 relative w-full gap-2">
              
              {/* Location */}
              <div 
                className="relative flex flex-1 items-center justify-between gap-3 bg-gray-50 rounded-2xl px-5 py-3 group hover:bg-[#f1f5f9] transition-colors cursor-pointer"
                onClick={() => setOpenDropdown(openDropdown === 'location' ? null : 'location')}
              >
                <div className="flex items-center gap-3 w-full pr-8">
                  <MapPin className="text-gray-400 flex-shrink-0" size={20} />
                  <span className={`text-sm font-medium tracking-wide flex-1 truncate ${location ? 'text-gray-900' : 'text-gray-500 uppercase'}`}>
                    {location || 'LOCATION'}
                  </span>
                </div>
                <div className="absolute right-3 w-8 h-8 rounded-full bg-[#e2e8ef] group-hover:bg-[#cbd5e1] transition-colors flex items-center justify-center text-[#64748b] flex-shrink-0">
                  <ChevronDown size={16} strokeWidth={2.5} className={`transition-transform duration-300 ${openDropdown === 'location' ? 'rotate-180' : ''}`} />
                </div>
                
                <AnimatePresence>
                  {openDropdown === 'location' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.2 }}
                      className="absolute bottom-full left-0 mb-3 w-64 bg-white rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.2)] border border-gray-100 p-2 z-50 flex flex-col gap-1"
                    >
                      {locations.map((loc) => (
                        <button key={loc} onClick={(e) => { e.stopPropagation(); setLocation(loc); setOpenDropdown(null); }} className={`w-full text-left px-4 py-3 text-sm rounded-xl cursor-pointer transition-colors ${location === loc ? 'bg-[#e2e8ef] font-semibold text-gray-900' : 'text-gray-600 hover:bg-[#f1f5f9] hover:text-gray-900'}`}>{loc}</button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Type */}
              <div 
                className="relative flex flex-1 items-center justify-between gap-3 bg-gray-50 rounded-2xl px-5 py-3 group hover:bg-[#f1f5f9] transition-colors cursor-pointer"
                onClick={() => setOpenDropdown(openDropdown === 'tourType' ? null : 'tourType')}
              >
                <div className="flex items-center gap-3 w-full pr-8">
                  <TreePalm className="text-gray-400 flex-shrink-0" size={20} />
                  <span className={`text-sm font-medium tracking-wide flex-1 truncate ${tourType ? 'text-gray-900' : 'text-gray-500 uppercase'}`}>
                    {tourType || 'TYPE'}
                  </span>
                </div>
                <div className="absolute right-3 w-8 h-8 rounded-full bg-[#e2e8ef] group-hover:bg-[#cbd5e1] transition-colors flex items-center justify-center text-[#64748b] flex-shrink-0">
                  <ChevronDown size={16} strokeWidth={2.5} className={`transition-transform duration-300 ${openDropdown === 'tourType' ? 'rotate-180' : ''}`} />
                </div>

                <AnimatePresence>
                  {openDropdown === 'tourType' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.2 }}
                      className="absolute bottom-full left-0 mb-3 w-64 bg-white rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.2)] border border-gray-100 p-2 z-50 flex flex-col gap-1"
                    >
                      {tourTypes.map((type) => (
                        <button key={type} onClick={(e) => { e.stopPropagation(); setTourType(type); setOpenDropdown(null); }} className={`w-full text-left px-4 py-3 text-sm rounded-xl cursor-pointer transition-colors ${tourType === type ? 'bg-[#e2e8ef] font-semibold text-gray-900' : 'text-gray-600 hover:bg-[#f1f5f9] hover:text-gray-900'}`}>{type}</button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* When */}
              <div 
                className="relative flex flex-1 items-center justify-between gap-3 bg-gray-50 rounded-2xl px-5 py-3 group hover:bg-[#f1f5f9] transition-colors cursor-pointer"
                onClick={() => setOpenDropdown(openDropdown === 'timeframe' ? null : 'timeframe')}
              >
                <div className="flex items-center gap-3 w-full pr-8">
                  <Timer className="text-gray-400 flex-shrink-0" size={20} />
                  <span className={`text-sm font-medium tracking-wide flex-1 truncate ${timeframe ? 'text-gray-900' : 'text-gray-500 uppercase'}`}>
                    {timeframe || 'WHEN'}
                  </span>
                </div>
                <div className="absolute right-3 w-8 h-8 rounded-full bg-[#e2e8ef] group-hover:bg-[#cbd5e1] transition-colors flex items-center justify-center text-[#64748b] flex-shrink-0">
                  <ChevronDown size={16} strokeWidth={2.5} className={`transition-transform duration-300 ${openDropdown === 'timeframe' ? 'rotate-180' : ''}`} />
                </div>

                <AnimatePresence>
                  {openDropdown === 'timeframe' && (
                    <motion.div 
                      onClick={(e) => e.stopPropagation()}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.2 }}
                      className="absolute bottom-full left-0 mb-3 w-64 bg-white rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.2)] border border-gray-100 p-2 z-50 flex flex-col"
                    >
                      <div className="flex flex-col gap-1 mb-2">
                        {timeframes.map((time) => (
                          <button key={time} onClick={() => { setTimeframe(time); setOpenDropdown(null); }} className={`w-full text-left px-4 py-3 text-sm rounded-xl cursor-pointer transition-colors ${timeframe === time ? 'bg-[#e2e8ef] font-semibold text-gray-900' : 'text-gray-600 hover:bg-[#f1f5f9] hover:text-gray-900'}`}>{time}</button>
                        ))}
                      </div>
                      <div className="h-px bg-gray-100 mx-2 mb-2"></div>
                      <div className="px-2 pb-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block px-2">Or select precise date</label>
                        <input 
                          type="date"
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => { 
                            if(e.target.value) {
                              const date = new Date(e.target.value).toLocaleDateString();
                              setTimeframe(date); 
                              setOpenDropdown(null);
                            }
                          }}
                          className="w-full bg-gray-50 border border-gray-100 text-gray-700 text-sm rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#2b3a4a]/20 cursor-pointer"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Travel */}
              <div 
                className="relative flex flex-1 items-center justify-between gap-3 bg-gray-50 rounded-2xl px-5 py-3 group hover:bg-[#f1f5f9] transition-colors cursor-pointer"
                onClick={() => setOpenDropdown(openDropdown === 'travelers' ? null : 'travelers')}
              >
                <div className="flex items-center gap-3 w-full pr-8">
                  <Globe className="text-gray-400 flex-shrink-0" size={20} />
                  <span className={`text-sm font-medium tracking-wide flex-1 truncate ${travelers ? 'text-gray-900' : 'text-gray-500 uppercase'}`}>
                    {travelers || 'TRAVELERS'}
                  </span>
                </div>
                <div className="absolute right-3 w-8 h-8 rounded-full bg-[#e2e8ef] group-hover:bg-[#cbd5e1] transition-colors flex items-center justify-center text-[#64748b] flex-shrink-0">
                  <ChevronDown size={16} strokeWidth={2.5} className={`transition-transform duration-300 ${openDropdown === 'travelers' ? 'rotate-180' : ''}`} />
                </div>

                <AnimatePresence>
                  {openDropdown === 'travelers' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.2 }}
                      className="absolute bottom-full right-0 mb-3 w-64 bg-white rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.2)] border border-gray-100 p-2 z-50 flex flex-col gap-1"
                    >
                      {travelerOptions.map((traveler) => (
                        <button key={traveler} onClick={(e) => { e.stopPropagation(); setTravelers(traveler); setOpenDropdown(null); }} className={`w-full text-left px-4 py-3 text-sm rounded-xl cursor-pointer transition-colors ${travelers === traveler ? 'bg-[#e2e8ef] font-semibold text-gray-900' : 'text-gray-600 hover:bg-[#f1f5f9] hover:text-gray-900'}`}>{traveler}</button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Search Button (Pill Shape) */}
              <button className="w-[120px] h-16 bg-[#2b3a4a] hover:bg-[#1a2530] text-white rounded-[32px] flex items-center justify-center transition-all flex-shrink-0 shadow-lg transform hover:scale-105 ml-2 mr-1">
                <Search size={22} />
              </button>
            </div>
        </div>
      </div>
    </div>
  );
}
