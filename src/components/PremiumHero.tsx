//frontend/src/components/PremiumHero.tsx
"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, User, Search, MapPin, Timer, TreePalm, Sun, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import VerticalGreetings from './VerticalGreetings';
import { getFilterOptions, searchTours, TourSearchResult } from '@/actions/tours';
import { regionMapping, experienceMapping, travelerMapping } from '@/utils/tour-mappings';
import SearchResultsModal from './SearchResultsModal';

const destinations = [
  { id: 1, name: "Kintampo Waterfalls", videoSrc: "https://ovvtrasavonyhsidimci.supabase.co/storage/v1/object/public/media/kintampo.mp4", thumbnailSrc: "/images/kintampo.jpg" },
  { id: 2, name: "Adomi Bridge", videoSrc: "https://ovvtrasavonyhsidimci.supabase.co/storage/v1/object/public/media/adomi.mp4", thumbnailSrc: "/images/adomi.jpg" },
  { id: 3, name: "Aburi Gardens", videoSrc: "https://ovvtrasavonyhsidimci.supabase.co/storage/v1/object/public/media/aburi.mp4", thumbnailSrc: "/images/aburi.jpg" }
];

export default function PremiumHero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentDest = destinations[currentIndex];
  
  const [activeTab, setActiveTab] = useState('Tours');

  const [region, setRegion] = useState('');
  const [experience, setExperience] = useState('');
  const [when, setWhen] = useState('');
  const [travelers, setTravelers] = useState('');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Dynamic filter state
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<TourSearchResult[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadFilters() {
      try {
        const { months } = await getFilterOptions();
        setAvailableMonths(months);
      } catch (error) {
        console.error("Failed to load filters:", error);
      }
    }
    loadFilters();
  }, []);

  const handleSearch = async () => {
    setIsSearchLoading(true);
    setIsModalOpen(true);
    try {
      const results = await searchTours({
        region: region === 'ALL' ? undefined : region,
        experience: experience === 'ALL' ? undefined : experience,
        when: when === 'ALL' ? undefined : when,
        travelers: travelers === 'ALL' ? undefined : travelers,
      });
      setSearchResults(results);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearchLoading(false);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Use keys from mappings for internal state, display names for UI
  const regions = ['ALL', ...Object.keys(regionMapping)];
  const experiences = ['ALL', ...Object.keys(experienceMapping)];
  const travelerOptions = ['ALL', ...Object.keys(travelerMapping)];
  const months = ['ALL', ...availableMonths];

  return (
    <div className={`relative w-full h-screen min-h-[800px] bg-black overflow-hidden font-sans ${isModalOpen ? 'z-50' : 'z-0'}`}>
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

        <VerticalGreetings />
        
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
                <Image src={dest.thumbnailSrc} alt={dest.name} fill className="object-cover" unoptimized={true} />
                <div className="absolute inset-0 bg-black/30 w-full h-full" />
              </button>
            ))}
          </div>

          {/* ... (title section remains unchanged) ... */}
          {/* Middle Section (Approx lines 139-205) - skipping for brevity in target search but ensuring I match the context) */}

          {/* Center: Primary Title */}
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
                  <h2 className="text-4xl sm:text-5xl md:text-[6vw] leading-none font-[ui-monospace] font-normal text-white drop-shadow-2xl tracking-wide self-center md:self-start uppercase md:ml-[25%]">
                    {currentDest.name.split(' ')[0]}
                  </h2>
                  <div className="flex gap-2 md:gap-3 py-2 -mt-1 z-10 md:ml-[50%]">
                    <span className="text-white text-xl md:text-3xl font-light scale-y-150 transform">✦</span>
                    <span className="text-white text-xl md:text-3xl font-light scale-y-150 transform">✦</span>
                    <span className="text-white text-xl md:text-3xl font-light scale-y-150 transform">✦</span>
                  </div>
                  <h2 className="text-4xl sm:text-5xl md:text-[6vw] leading-none font-[ui-monospace] font-normal text-white drop-shadow-2xl tracking-wide self-center md:self-end uppercase md:mr-[-25%] mt-1 md:mt-3">
                    {currentDest.name.substring(currentDest.name.indexOf(' ') + 1)}
                  </h2>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center">
            <div className="relative w-32 h-32 mr-2 hidden lg:block">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="w-full h-full">
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
            <div className="hidden lg:flex flex-col gap-30 text-xs tracking-[0.1em] text-white/70 font-medium mb-10 -mr-2">
              <a href="#" className="rotate-90 hover:text-white transition-colors">FACEBOOK</a>
              <a href="#" className="rotate-90 hover:text-white transition-colors">TWITTER</a>
              <a href="#" className="rotate-90 hover:text-white transition-colors">INSTAGRAM</a>
            </div>
          </div>
        </div>

        {/* Bottom Section: Find Journey / Booking Bar */}
        <div className="absolute bottom-[5vh] md:bottom-[10vh] left-1/2 -translate-x-1/2 w-full max-w-[95vw] lg:w-[1050px] flex flex-col items-center z-30">
            <div className="w-full flex items-end justify-center relative z-20 h-[64px]">
              <div className="absolute left-1/2 -translate-x-1/2 -top-10 md:top-auto md:translate-x-0 md:left-4 md:bottom-2 lg:bottom-6 flex items-center gap-2 md:gap-3 text-white z-40 scale-75 md:scale-100 origin-center md:origin-left">
                <Sun className="text-[#fcfcda] w-8 h-8 md:w-10 md:h-10 drop-shadow-lg" fill="#fcfcda" strokeWidth={1} />
                <div className="flex flex-col leading-tight pt-1">
                  <span className="text-[10px] tracking-widest uppercase font-medium">Find Your</span>
                  <span className="text-xs font-bold tracking-widest uppercase">Journey</span>
                </div>
              </div>

              <div className="flex items-end gap-0 relative translate-y-[1px] z-10 md:px-6 w-full md:w-auto">
                  <div className="absolute left-0 md:left-6 right-0 md:right-6 bottom-0 top-0 bg-[#F2F5D5] rounded-t-xl md:rounded-t-2xl -z-10
                    before:content-[''] before:absolute before:w-4 before:h-4 before:bg-transparent before:bottom-0 before:-left-4 before:rounded-br-xl before:shadow-[10px_10px_0_0_#F2F5D5]
                    after:content-[''] after:absolute after:w-4 after:h-4 after:bg-transparent after:bottom-0 after:-right-4 after:rounded-bl-xl after:shadow-[-10px_10px_0_0_#F2F5D5]
                  " />

                  {['Tours', 'Events', 'Custom'].map((tab) => (
                    <div key={tab} className="relative z-10 flex-1 md:flex-none flex">
                      {activeTab === tab && (
                        <motion.div
                          layoutId="activeTabBubble"
                          transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                          className="absolute inset-0 bg-white rounded-t-xl md:rounded-t-2xl z-0 shadow-none
                            before:content-[''] before:absolute before:w-4 before:h-4 before:bg-transparent before:bottom-0 before:-left-4 before:rounded-br-xl before:shadow-[10px_10px_0_0_white]
                            after:content-[''] after:absolute after:w-4 after:h-4 after:bg-transparent after:bottom-0 after:-right-4 after:rounded-bl-xl after:shadow-[-10px_10px_0_0_white]
                          "
                        />
                      )}
                      <button onClick={() => setActiveTab(tab)} className={`relative w-full px-2 md:px-12 py-2 md:py-3 text-[10px] md:text-sm font-semibold transition-colors duration-300 z-10 flex items-center justify-center outline-none ${activeTab === tab ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}>
                        {tab}
                      </button>
                    </div>
                  ))}
              </div>
            </div>
            
            <div ref={dropdownRef} className="bg-white rounded-[24px] p-2 md:p-4 lg:pl-6 flex flex-col lg:flex-row items-stretch lg:items-center justify-between shadow-2xl z-20 relative w-full gap-2 transition-all">
              <div className="grid grid-cols-2 lg:flex lg:flex-1 gap-2 md:gap-3">
                {/* Region */}
                <div className="relative flex items-center justify-between gap-2 bg-gray-50 rounded-xl md:rounded-2xl px-3 md:px-5 py-2.5 md:py-3 group hover:bg-[#f1f5f9] transition-colors cursor-pointer min-h-[50px] md:min-h-0" onClick={() => setOpenDropdown(openDropdown === 'region' ? null : 'region')}>
                  <div className="flex items-center gap-2 md:gap-3 w-full pr-4 md:pr-8">
                    <MapPin className="text-gray-400 flex-shrink-0" size={16} />
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-[8px] uppercase tracking-tighter text-gray-400 font-bold lg:hidden">Region</span>
                      <span className={`text-[10px] md:text-sm font-medium tracking-wide truncate ${region ? 'text-gray-900' : 'text-gray-500 uppercase'}`}>
                        {region === 'ALL' ? 'Anywhere' : (regionMapping[region] || 'LOCATION')}
                      </span>
                    </div>
                  </div>
                  <div className="absolute right-2 md:right-3 w-6 h-6 md:w-8 md:h-8 rounded-full bg-[#e2e8ef] flex items-center justify-center text-[#64748b]">
                    <ChevronDown size={14} className={`transition-transform ${openDropdown === 'region' ? 'rotate-180' : ''}`} />
                  </div>
                  <AnimatePresence>
                    {openDropdown === 'region' && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.2 }}
                        className="absolute bottom-full left-0 mb-3 w-48 md:w-64 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 flex flex-col gap-1 max-h-[300px] overflow-y-auto no-scrollbar"
                      >
                        {regions.map((reg) => (
                          <button key={reg} onClick={(e) => { e.stopPropagation(); setRegion(reg); setOpenDropdown(null); }} className={`w-full text-left px-3 py-2 text-xs md:text-sm rounded-xl transition-colors ${region === reg ? 'bg-[#2b3a4a] text-white' : 'text-gray-600 hover:bg-[#f1f5f9]'}`}>
                            {reg === 'ALL' ? 'Anywhere' : regionMapping[reg]}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Experience */}
                <div className="relative flex items-center justify-between gap-2 bg-gray-50 rounded-xl md:rounded-2xl px-3 md:px-5 py-2.5 md:py-3 group hover:bg-[#f1f5f9] transition-colors cursor-pointer min-h-[50px] md:min-h-0" onClick={() => setOpenDropdown(openDropdown === 'experience' ? null : 'experience')}>
                  <div className="flex items-center gap-2 md:gap-3 w-full pr-4 md:pr-8">
                    <TreePalm className="text-gray-400 flex-shrink-0" size={16} />
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-[8px] uppercase tracking-tighter text-gray-400 font-bold lg:hidden">Experience</span>
                      <span className={`text-[10px] md:text-sm font-medium tracking-wide truncate ${experience ? 'text-gray-900' : 'text-gray-500 uppercase'}`}>
                        {experience === 'ALL' ? 'All Types' : (experienceMapping[experience] || 'TYPE')}
                      </span>
                    </div>
                  </div>
                  <div className="absolute right-2 md:right-3 w-6 h-6 md:w-8 md:h-8 rounded-full bg-[#e2e8ef] flex items-center justify-center text-[#64748b]">
                    <ChevronDown size={14} className={`transition-transform ${openDropdown === 'experience' ? 'rotate-180' : ''}`} />
                  </div>
                  <AnimatePresence>
                    {openDropdown === 'experience' && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.2 }}
                        className="absolute bottom-full lg:left-0 right-0 mb-3 w-48 md:w-64 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 flex flex-col gap-1 no-scrollbar overflow-y-auto"
                      >
                        {experiences.map((exp) => (
                          <button key={exp} onClick={(e) => { e.stopPropagation(); setExperience(exp); setOpenDropdown(null); }} className={`w-full text-left px-3 py-2 text-xs md:text-sm rounded-xl transition-colors ${experience === exp ? 'bg-[#2b3a4a] text-white' : 'text-gray-600 hover:bg-[#f1f5f9]'}`}>
                            {exp === 'ALL' ? 'All Experiences' : experienceMapping[exp]}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* When */}
                <div className="relative flex items-center justify-between gap-2 bg-gray-50 rounded-xl md:rounded-2xl px-3 md:px-5 py-2.5 md:py-3 group hover:bg-[#f1f5f9] transition-colors cursor-pointer min-h-[50px] md:min-h-0" onClick={() => setOpenDropdown(openDropdown === 'when' ? null : 'when')}>
                  <div className="flex items-center gap-2 md:gap-3 w-full pr-4 md:pr-8">
                    <Timer className="text-gray-400 flex-shrink-0" size={16} />
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-[8px] uppercase tracking-tighter text-gray-400 font-bold lg:hidden">When</span>
                      <span className={`text-[10px] md:text-sm font-medium tracking-wide truncate ${when ? 'text-gray-900' : 'text-gray-500 uppercase'}`}>
                        {when === 'ALL' ? 'Anytime' : (when || 'WHEN')}
                      </span>
                    </div>
                  </div>
                  <div className="absolute right-2 md:right-3 w-6 h-6 md:w-8 md:h-8 rounded-full bg-[#e2e8ef] flex items-center justify-center text-[#64748b]">
                    <ChevronDown size={14} className={`transition-transform ${openDropdown === 'when' ? 'rotate-180' : ''}`} />
                  </div>
                  <AnimatePresence>
                    {openDropdown === 'when' && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} 
                        className="absolute bottom-full left-0 mb-3 w-48 md:w-64 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 flex flex-col gap-1 no-scrollbar overflow-y-auto"
                      >
                        {months.map((m) => (
                          <button key={m} onClick={() => { setWhen(m); setOpenDropdown(null); }} className={`w-full text-left px-3 py-2 text-xs md:text-sm rounded-xl transition-colors ${when === m ? 'bg-[#2b3a4a] text-white' : 'text-gray-600 hover:bg-[#f1f5f9]'}`}>
                            {m === 'ALL' ? 'Anytime' : m}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Travelers */}
                <div className="relative flex items-center justify-between gap-2 bg-gray-50 rounded-xl md:rounded-2xl px-3 md:px-5 py-2.5 md:py-3 group hover:bg-[#f1f5f9] transition-colors cursor-pointer min-h-[50px] md:min-h-0" onClick={() => setOpenDropdown(openDropdown === 'travelers' ? null : 'travelers')}>
                  <div className="flex items-center gap-2 md:gap-3 w-full pr-4 md:pr-8">
                    <Globe className="text-gray-400 flex-shrink-0" size={16} />
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-[8px] uppercase tracking-tighter text-gray-400 font-bold lg:hidden">Travelers</span>
                      <span className={`text-[10px] md:text-sm font-medium tracking-wide truncate ${travelers ? 'text-gray-900' : 'text-gray-500 uppercase'}`}>
                        {travelers === 'ALL' ? 'Anyone' : (travelerMapping[travelers] || 'TRAVELERS')}
                      </span>
                    </div>
                  </div>
                  <div className="absolute right-2 md:right-3 w-6 h-6 md:w-8 md:h-8 rounded-full bg-[#e2e8ef] flex items-center justify-center text-[#64748b]">
                    <ChevronDown size={14} className={`transition-transform ${openDropdown === 'travelers' ? 'rotate-180' : ''}`} />
                  </div>
                  <AnimatePresence>
                    {openDropdown === 'travelers' && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} 
                        className="absolute bottom-full right-0 mb-3 w-48 md:w-64 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 flex flex-col gap-1 no-scrollbar overflow-y-auto"
                      >
                        {travelerOptions.map((opt) => (
                          <button key={opt} onClick={(e) => { e.stopPropagation(); setTravelers(opt); setOpenDropdown(null); }} className={`w-full text-left px-3 py-2 text-xs md:text-sm rounded-xl transition-colors ${travelers === opt ? 'bg-[#2b3a4a] text-white' : 'text-gray-600 hover:bg-[#f1f5f9]'}`}>
                            {opt === 'ALL' ? 'Any Group Size' : travelerMapping[opt]}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <button onClick={handleSearch} disabled={isSearchLoading} className="w-full lg:w-[120px] h-12 md:h-16 bg-[#2b3a4a] hover:bg-[#1a2530] disabled:bg-gray-400 text-white rounded-xl md:rounded-[32px] flex items-center justify-center transition-all flex-shrink-0 shadow-lg transform hover:scale-105 active:scale-95">
                {isSearchLoading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Search size={22} />}
              </button>
            </div>
        </div>
      </div>
      
      <SearchResultsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} results={searchResults} isLoading={isSearchLoading} />
    </div>
  );
}
