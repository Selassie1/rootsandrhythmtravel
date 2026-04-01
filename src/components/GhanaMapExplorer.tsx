//src/components/GhanaMapExplorer.tsx
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Compass, Sparkles, X, ArrowRight } from 'lucide-react';
import { getActiveTours } from '@/actions/tours';

// Local GeoJSON for boundaries of Ghana's regions (GADM data)
const geoUrl = "/data/ghana-regions.json";

interface Tour {
  title: string;
  slug: string;
  description_body: string | null;
  region: string;
  curated_inclusions: any;
  hero_image_url: string | null;
}

interface TooltipState {
  show: boolean;
  regionName: string;
  tours: string[];
  x: number;
  y: number;
}

// Map database region ENUMs to GeoJSON NAME_1 properties (Corrected CamelCase from GeoJSON)
const dbToGeoMap: Record<string, string> = {
  'GREATER_ACCRA': 'GreaterAccra',
  'ASHANTI': 'Ashanti',
  'CENTRAL': 'Central',
  'VOLTA': 'Volta',
  'NORTHERN': 'Northern',
  'WESTERN': 'Western',
  'WESTERN_NORTH': 'WesternNorth',
  'UPPER_EAST': 'UpperEast',
  'UPPER_WEST': 'UpperWest',
  'EASTERN': 'Eastern',
  'BONO': 'Bono',
  'BONO_EAST': 'BonoEast',
  'AHAFO': 'Ahafo',
  'SAVANNAH': 'Savannah',
  'NORTH_EAST': 'NorthEast',
  'OTI': 'Oti'
};

// Original color dataset mapping
const regionColors: Record<string, string> = {
  'GREATER_ACCRA': "#D4AF37", // Gold
  'CENTRAL': "#8B5A2B",       // Bronze
  'VOLTA': "#2A3B2C",         // Dark Green
  'ASHANTI': "#8C1515",       // Red
  'NORTHERN': "#CD853F"       // Ochre
};

// Inverse map for GeoJSON lookup
const geoToDbMap: Record<string, string> = Object.entries(dbToGeoMap).reduce((acc, [key, val]) => {
  acc[val] = key;
  return acc;
}, {} as Record<string, string>);

const premiumPalette = [
  "#B8860B", "#8B5A2B", "#556B2F", "#CD853F", "#A0522D", "#8C1515",
  "#6B8E23", "#8F9779", "#4A5D23", "#654321", "#C19A6B", "#80461B"
];

// Formatter for display names (handles GreaterAccra, UPPER_SNAKE_CASE, etc.)
const formatRegionName = (name: string) => {
  if (!name) return "";
  
  // Handle UPPER_SNAKE_CASE from DB
  let formatted = name.split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
    
  // Handle CamelCase if it's still stuck (e.g. GreaterAccra)
  formatted = formatted.replace(/([a-z])([A-Z])/g, '$1 $2').trim();
  
  if (!formatted.toLowerCase().includes("region") && !formatted.toLowerCase().includes("accra")) {
    formatted += " Region";
  }
  return formatted;
};

const GhanaMapExplorer = () => {
  const router = useRouter();
  const [activeTours, setActiveTours] = useState<Tour[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [currentTourIndex, setCurrentTourIndex] = useState(0);
  const [tooltip, setTooltip] = useState<TooltipState>({ show: false, regionName: '', tours: [], x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    const fetchData = async () => {
      const tours = await getActiveTours();
      setActiveTours(tours || []);
    };
    fetchData();
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toursByRegion = useMemo(() => {
    const groups: Record<string, Tour[]> = {};
    activeTours.forEach(tour => {
      if (!groups[tour.region]) groups[tour.region] = [];
      groups[tour.region].push(tour);
    });
    return groups;
  }, [activeTours]);

  const activeRegionDbNames = useMemo(() => new Set(Object.keys(toursByRegion)), [toursByRegion]);

  const displayedRegion = hoveredRegion || selectedRegion;
  const regionTours = displayedRegion ? toursByRegion[geoToDbMap[displayedRegion]] || [] : [];
  const currentTour = regionTours[currentTourIndex];

  const handleRegionClick = (geoName: string) => {
    if (selectedRegion === geoName) {
      setSelectedRegion(null);
    } else {
      setSelectedRegion(geoName);
      setCurrentTourIndex(0);
    }
  };

  const nextTour = () => {
    setCurrentTourIndex((prev) => (prev + 1) % regionTours.length);
  };

  const prevTour = () => {
    setCurrentTourIndex((prev) => (prev - 1 + regionTours.length) % regionTours.length);
  };

  const handleMouseMove = (e: React.MouseEvent, geoName: string) => {
    if (isMobile) return;
    
    const dbRegion = geoToDbMap[geoName];
    const regionTours = toursByRegion[dbRegion] || [];
    
    setTooltip({
      show: true,
      regionName: geoName,
      tours: regionTours.map(t => t.title),
      x: e.clientX,
      y: e.clientY
    });
    setHoveredRegion(geoName);
  };

  return (
    <section className="w-full bg-[#1A2118] py-16 md:py-24 relative overflow-hidden">
      {/* Background Adinkra symbols */}
      <div 
        className="absolute top-[-5%] left-[-2%] w-[40rem] h-[40rem] bg-[#D4AF37] opacity-[0.06] pointer-events-none rotate-12" 
        style={{ WebkitMaskImage: 'url(/icons/gyenyame.svg)', WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat' }}
      ></div>
      <div 
        className="absolute bottom-[-20%] left-[15%] w-[35rem] h-[35rem] bg-[#D4AF37] opacity-[0.05] pointer-events-none -rotate-12" 
        style={{ WebkitMaskImage: 'url(/icons/akan.svg)', WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat' }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row gap-8 bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-gray-100 p-4 sm:p-10 min-h-[600px] md:h-[700px]">
          
          {/* Left Column - Map & Heading */}
          <div className="w-full md:w-1/2 relative flex flex-col items-center justify-center min-h-[350px] md:h-full overflow-hidden">
            {/* Typography Overlay */}
            <div className="absolute top-4 left-4 sm:top-0 sm:left-0 z-10 max-w-[280px] pointer-events-none">
              <span className="text-[10px] tracking-[0.2em] text-gray-400 font-bold uppercase mb-1 block">The Motherland</span>
              <h2 className="text-4xl sm:text-6xl font-serif text-[#1A2118] leading-tight mb-2">Ghana</h2>
              <p className="text-gray-500 text-[13px] leading-relaxed pr-4 hidden sm:block">
                Discover roots, culture, and rhythm across our diverse, breathtaking regions.
              </p>
            </div>

            <div className="w-full h-full flex items-center justify-center relative translate-y-4 md:translate-y-8">
              <ComposableMap
                projection="geoMercator"
                projectionConfig={{
                  scale: isMobile ? 6500 : 7800,
                  center: isMobile ? [-1.2, 7.8] : [-1.5, 8.0],
                }}
                width={800}
                height={800}
                className="w-full h-full object-contain cursor-pointer"
              >
                <Geographies geography={geoUrl}>
                  {({ geographies }: { geographies: any[] }) =>
                    geographies.map((geo: any, index: number) => {
                      const geoName = geo.properties.NAME_1;
                      const dbName = geoToDbMap[geoName];
                      const isActive = activeRegionDbNames.has(dbName);
                      const isSelected = selectedRegion === geoName;
                      
                      const baseColor = regionColors[dbName] || premiumPalette[index % premiumPalette.length];
                      let fill = isActive ? baseColor : "#E5E7EB";
                      if (isSelected) fill = "#D4AF37";

                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          onMouseEnter={(e) => handleMouseMove(e, geoName)}
                          onMouseMove={(e) => handleMouseMove(e, geoName)}
                          onMouseLeave={() => {
                            setHoveredRegion(null);
                            setTooltip(prev => ({ ...prev, show: false }));
                          }}
                          onClick={() => handleRegionClick(geoName)}
                          style={{
                            default: {
                              fill: fill,
                              outline: "none",
                              stroke: "#FFFFFF",
                              strokeWidth: isSelected ? 2 : 1,
                              transition: "all 300ms ease"
                            },
                            hover: {
                              fill: isActive ? fill : "#D1D5DB",
                              outline: "none",
                              stroke: "#FFFFFF",
                              strokeWidth: 2,
                              filter: isActive ? "drop-shadow(3px 8px 10px rgba(0,0,0,0.4))" : "none",
                              transform: isActive ? "translate(-3px, -5px)" : "none",
                              cursor: isActive ? "pointer" : "default",
                              transition: "all 250ms ease"
                            },
                            pressed: {
                              fill: "#B8860B",
                              outline: "none",
                              transform: "translate(-1px, -1px)"
                            }
                          }}
                        />
                      );
                    })
                  }
                </Geographies>
              </ComposableMap>

              {/* Mobile Legend/Hint */}
              <div className="absolute bottom-0 right-0 sm:hidden flex items-center gap-2 text-[10px] text-gray-400 font-medium">
                <div className="w-2 h-2 rounded-full bg-[#D4AF37]"></div>
                Active Regions
              </div>
            </div>
          </div>

          {/* Right Column - Detail/Carousel */}
          <div className="w-full md:w-1/2 flex flex-col min-h-[400px]">
            <AnimatePresence mode="wait">
              {currentTour ? (
                <motion.div
                  key={currentTour.slug}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col h-full bg-[#FAFAF8] border border-[#EAE5D9] rounded-2xl p-6 sm:p-8 relative"
                >
                  <button 
                    onClick={() => { setSelectedRegion(null); setHoveredRegion(null); }}
                    className="absolute top-4 right-4 z-20 bg-gray-200/50 hover:bg-gray-300 text-gray-600 rounded-full p-1 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <span className="text-[10px] tracking-[0.2em] text-[#B8860B] font-bold uppercase block mb-1">
                        {formatRegionName(currentTour.region)}
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-serif text-[#2A3B2C] leading-tight">
                        {currentTour.title}
                      </h3>
                    </div>
                    {regionTours.length > 1 && (
                      <div className="flex items-center gap-2">
                        <button onClick={prevTour} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                          <ChevronLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <span className="text-xs font-mono text-gray-400">
                          {currentTourIndex + 1}/{regionTours.length}
                        </span>
                        <button onClick={nextTour} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                          <ChevronRight className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="relative w-full h-48 sm:h-64 rounded-xl overflow-hidden mb-6 shadow-md shadow-black/5">
                    <Image
                      src={currentTour.hero_image_url || "/images/hero-default.jpg"}
                      alt={currentTour.title}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>

                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6 line-clamp-4">
                    {currentTour.description_body}
                  </p>

                  <div className="mt-auto">
                    <div className="flex flex-wrap gap-2 mb-8">
                      {(currentTour.curated_inclusions as string[] || []).slice(0, 3).map((item, i) => (
                        <span 
                          key={i} 
                          className="flex items-center gap-1.5 px-3 py-1 bg-white border border-[#EAE5D9] text-[#2A3B2C] text-[11px] font-semibold rounded-full"
                        >
                          <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                          {item}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => router.push(`/tours/${currentTour.slug}`)}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#2A3B2C] text-white rounded-full hover:bg-[#1A241B] transition-all font-semibold shadow-lg shadow-[#2A3B2C]/10 text-sm sm:text-base group"
                    >
                      Explore This Journey
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </motion.div>
              ) : displayedRegion ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center text-center h-full bg-[#FAFAF8] border border-[#EAE5D9] rounded-2xl p-8 gap-6"
                >
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                    <Compass className="w-8 h-8 text-gray-300" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif text-[#2A3B2C] mb-2">{formatRegionName(displayedRegion)}</h3>
                    <p className="text-gray-500 text-sm max-w-xs mx-auto">
                      We are currently curating authentic, high-end experiences for this region. Check back soon for updates.
                    </p>
                  </div>
                  <button 
                    onClick={() => { setSelectedRegion(null); setHoveredRegion(null); }}
                    className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-widest"
                  >
                    <X className="w-4 h-4" /> Reset Map
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="default"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center text-center h-full bg-[#F9F8F6] border border-[#EAE5D9] rounded-2xl p-8 gap-8"
                >
                  <div className="relative">
                    <div className="absolute inset-0 animate-ping bg-[#D4AF37]/20 rounded-full"></div>
                    <div className="relative w-16 h-16 rounded-full bg-white shadow-xl flex items-center justify-center">
                      <Compass className="w-8 h-8 text-[#D4AF37]" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <span className="text-[10px] tracking-[0.3em] text-gray-400 font-semibold uppercase">Interactive Explorer</span>
                      <h3 className="text-3xl font-serif text-[#2A3B2C]">Explore Ghana</h3>
                    </div>
                    <p className="text-gray-500 text-sm max-w-xs mx-auto leading-relaxed">
                      Select a highlighted region on the map to discover curated heritage journeys and cultural experiences.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Desktop Tooltip - Temporarily disabled to investigate positioning issues */}
      {/* {!isMobile && tooltip.show && (
        <div 
          className="fixed pointer-events-none z-[9999] bg-black/85 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-2xl transition-opacity animate-in fade-in duration-200 min-w-[200px]"
          style={{ top: tooltip.y + 15, left: tooltip.x + 15 }}
        >
          <h4 className="font-serif text-lg text-white mb-2">{formatRegionName(tooltip.regionName)}</h4>
          {tooltip.tours.length > 0 ? (
            <div className="space-y-2">
              <div className="h-[2px] w-6 bg-[#D4AF37] mb-2" />
              {tooltip.tours.map((title, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-gray-100">
                  <div className="w-1 h-1 rounded-full bg-[#D4AF37] mt-1.5 shrink-0" />
                  <span className="font-medium">{title}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Curating Experiences</p>
          )}
        </div>
      )} */}
    </section>
  );
};

export default GhanaMapExplorer;
