//src/components/GhanaMapExplorer.tsx
"use client";

import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// Local GeoJSON for boundaries of Ghana's regions (GADM data)
const geoUrl = "/data/ghana-regions.json";

interface RegionInfo {
  name: string;
  images: string[];
  description: string;
  events: string[];
  color: string;
}

const regionData: Record<string, RegionInfo> = {
  "Greater Accra": {
    name: "Greater Accra",
    images: ["/images/Black-star-square.jpeg", "/images/Square.jpeg", "/images/Nkrumah-museum.jpeg", "/images/Art-center.jpeg"],
    description: "Explore the Black Star Square, Kwame Nkrumah Memorial, and bustling Arts Centre.",
    events: ["City Heritage Tour", "Nightlife Experience", "Street Food Tasting", "Arts Centre Walk"],
    color: "#D4AF37" // Premium Gold
  },
  "Central": {
    name: "Central Region",
    images: ["/images/Cape-Coast-fest.jpeg", "/images/cape-coast.png"],
    description: "Journey through the diaspora roots and vibrant local festivals.",
    events: ["Diaspora Access Trip", "Castle Heritage Tour", "Oguaa Fetu Afahye"],
    color: "#8B5A2B" // Warm Bronze
  },
  "Volta": {
    name: "Volta Region",
    images: ["/images/Volta.jpeg", "/images/volta-weaving.png", "/images/adomi.jpeg"],
    description: "Experience indigenous Kente weaving and breathtaking landscapes.",
    events: ["Kente Weaving Workshop", "Mountain Hiking", "Falls Expedition"],
    color: "#2A3B2C" // Forest Green
  },
  "Ashanti": {
    name: "Ashanti Region",
    images: ["/images/Drumming.jpeg", "/images/aburi.png"], // Proxy images for visually rich showcase
    description: "The heart of the ancient Ashanti Kingdom and legendary cultural heritage.",
    events: ["Palace Tour", "Cultural Drumming", "Kejetia Market Walk"],
    color: "#8C1515" // Royal Red
  },
  "Northern": {
    name: "Northern Region",
    images: ["/images/kintampo.jpeg"], // Using proxy asset
    description: "Discover the sprawling savannas, ancient mosques, and deeply rich diverse traditions.",
    events: ["Safari Expedition", "Laraba Mosque Tour", "Cultural Dance"],
    color: "#CD853F" // Sandy Ochre
  }
};

type HoverState = RegionInfo | { name: string; isEmpty: true } | null;

type TooltipState = {
  show: boolean;
  regionName: string;
  isConfigured: boolean;
  events: string[];
  x: number;
  y: number;
};

const premiumPalette = [
  "#B8860B", "#8B5A2B", "#556B2F", "#CD853F", "#A0522D", "#8C1515",
  "#6B8E23", "#8F9779", "#4A5D23", "#654321", "#C19A6B", "#80461B"
];

const GhanaMapExplorer = () => {
  const router = useRouter();
  const [hoveredRegion, setHoveredRegion] = useState<HoverState>(null);
  const [selectedRegion, setSelectedRegion] = useState<HoverState>(null);
  const [tooltip, setTooltip] = useState<TooltipState>({ show: false, regionName: '', isConfigured: false, events: [], x: 0, y: 0 });

  const handleMouseEnter = (regionState: HoverState, originalName: string, isConfigured: boolean, events: string[]) => {
    setHoveredRegion(regionState);
    setTooltip(prev => ({
      ...prev,
      show: true,
      regionName: originalName,
      isConfigured: isConfigured,
      events: events
    }));
  };

  const handleMouseLeave = () => {
    setHoveredRegion(null);
    setTooltip(prev => ({ ...prev, show: false }));
  };

  const handleRegionClick = (regionState: HoverState) => {
    if (selectedRegion && regionState && selectedRegion.name === regionState.name) {
      setSelectedRegion(null);
    } else {
      setSelectedRegion(regionState);
    }
  };

  const displayRegion = hoveredRegion || selectedRegion;

  return (
    <section className="w-full bg-[#1A2118] py-24 relative overflow-hidden">
      
      {/* Background Ghanaian/Adinkra-inspired symbols (watermarks) */}
      <div 
        className="absolute top-[-5%] left-[-2%] w-[40rem] h-[40rem] bg-[#D4AF37] opacity-[0.06] pointer-events-none rotate-12" 
        style={{ WebkitMaskImage: 'url(/icons/gyenyame.svg)', WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat' }}
      ></div>
      <div 
        className="absolute bottom-[-20%] left-[15%] w-[35rem] h-[35rem] bg-[#D4AF37] opacity-[0.05] pointer-events-none -rotate-12" 
        style={{ WebkitMaskImage: 'url(/icons/akan.svg)', WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat' }}
      ></div>
      <div 
        className="absolute top-[-5%] right-[-20%] w-[35rem] h-[35rem] bg-[#D4AF37] opacity-[0.04] pointer-events-none rotate-45" 
        style={{ WebkitMaskImage: 'url(/icons/adinkra.svg)', WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat' }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row gap-8 bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden border border-gray-100 p-6 sm:p-10 h-auto md:h-[680px]">
        
        {/* Left Column - Map */}
        <div 
          className="w-full md:w-1/2 relative bg-transparent flex items-center justify-center p-0 min-h-[400px] h-full overflow-hidden"
          onMouseMove={(e) => setTooltip(prev => ({ ...prev, x: e.clientX, y: e.clientY }))}
        >
          
          {/* Overlay Text */}
          <div className="absolute top-8 left-4 sm:top-10 sm:left-[2] z-10 max-w-[240px] pointer-events-none">
            <span className="text-[10px] tracking-[0.2em] text-gray-400 font-bold uppercase mb-2 block">The Motherland</span>
            <h2 className="text-4xl sm:text-5xl font-serif text-[#1A2118] leading-none mb-3">Ghana</h2>
            <p className="text-gray-500 text-[13px] leading-relaxed pr-4">
              Discover roots, culture, <br />and rhythm across our <br/>diverse, breathtaking <br /> regions.
            </p>
          </div>

          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              scale: 7600,
              center: [-1.5, 8.0], // Shifted center X to perfectly move the map towards the right
            }}
            width={800}
            height={800}
            className="w-full h-full object-contain drop-shadow-md"
          >
            <Geographies geography={geoUrl}>
              {({ geographies }: { geographies: any[] }) =>
                geographies.map((geo: any, index: number) => {
                  let rName = geo.properties.NAME_1 || "";
                  rName = rName.replace(/([A-Z])/g, ' $1').trim();
                  if (!rName.toLowerCase().includes("region") && !rName.toLowerCase().includes("accra")) {
                    rName += " Region";
                  }

                  let key = "";
                  if (rName.includes("Accra")) key = "Greater Accra";
                  else if (rName.includes("Central")) key = "Central";
                  else if (rName.includes("Volta")) key = "Volta";
                  else if (rName.includes("Ashanti")) key = "Ashanti";
                  else if (rName.includes("Northern")) key = "Northern";

                  const regionState: HoverState = key && regionData[key] 
                    ? regionData[key] 
                    : { name: rName, isEmpty: true };

                  const isConfigured = !!(key && regionData[key]);
                  const activeEvents = isConfigured ? regionData[key].events : [];

                  const isLocked = selectedRegion?.name === regionState.name;

                  let fillHex = "#E5E7EB"; // Default subtle gray
                  let hoverHex = premiumPalette[index % premiumPalette.length]; 
                  
                  if (isConfigured) {
                    fillHex = regionData[key].color;
                    hoverHex = fillHex;
                  }

                  const currentFill = isLocked ? hoverHex : fillHex;

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={() => handleMouseEnter(regionState, rName, isConfigured, activeEvents)}
                      onMouseLeave={handleMouseLeave}
                      onClick={() => handleRegionClick(regionState)}
                      style={{
                        default: {
                          fill: currentFill,
                          outline: "none",
                          stroke: "#FFFFFF",
                          strokeWidth: isLocked ? 2 : 1,
                          filter: isLocked ? "drop-shadow(2px 6px 6px rgba(0,0,0,0.25))" : "none",
                          transform: isLocked ? "translate(-2px, -4px)" : "translate(0px, 0px)",
                          transition: "all 300ms ease"
                        },
                        hover: {
                          fill: hoverHex, 
                          outline: "none",
                          stroke: "#FFFFFF",
                          strokeWidth: 2,
                          filter: "drop-shadow(3px 8px 10px rgba(0,0,0,0.4))",
                          transform: "translate(-3px, -5px)",
                          cursor: "pointer",
                          transition: "all 250ms ease"
                        },
                        pressed: {
                          fill: hoverHex,
                          outline: "none",
                          strokeWidth: 2,
                          filter: "drop-shadow(1px 2px 2px rgba(0,0,0,0.5))",
                          transform: "translate(-1px, -1px)",
                          transition: "all 100ms ease"
                        },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>
        </div>

        {/* Right Column - Showcase Card */}
        <div className="w-full md:w-1/2 h-full flex flex-col justify-center">
          {displayRegion && !('isEmpty' in displayRegion) ? (
            <div className="flex flex-col w-full h-full bg-[#FAFAF8] border border-[#EAE5D9] rounded-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-500 relative">
              {selectedRegion && selectedRegion.name === displayRegion.name && (
                <button 
                  onClick={() => setSelectedRegion(null)}
                  className="absolute top-4 right-4 z-20 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 transition-colors backdrop-blur-md"
                  aria-label="Clear selection"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              <div className="w-full flex overflow-x-auto snap-x snap-mandatory gap-4 mb-6 pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <style dangerouslySetInnerHTML={{ __html: `div::-webkit-scrollbar { display: none; }` }} />
                {displayRegion.images.map((imgSrc: string, idx: number) => (
                  <div key={idx} className="relative flex-none w-[75%] sm:w-[65%] h-56 sm:h-64 lg:h-72 rounded-xl overflow-hidden shadow-md snap-center group">
                    <Image 
                      src={imgSrc} 
                      alt={`${displayRegion.name} ${idx + 1}`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent pointer-events-none"></div>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="text-3xl font-serif text-[#2A3B2C] mb-3 tracking-wide">
                    {displayRegion.name}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed text-sm lg:text-base">
                    {displayRegion.description}
                  </p>
                </div>
                
                <div className="flex flex-col mt-auto">
                  <div className="flex flex-wrap gap-2 mb-6">
                    {displayRegion.events.map((event: string, i: number) => (
                      <span 
                        key={i}
                        className="px-4 py-1.5 bg-[#D4AF37]/10 text-[#B8860B] text-xs font-bold uppercase tracking-wider rounded-lg border border-[#D4AF37]/20"
                      >
                        {event}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 flex justify-center">
                    <button 
                      onClick={() => router.push(`/tours?location=${encodeURIComponent(displayRegion.name)}`)} 
                      className="flex items-center justify-center gap-2 px-8 py-3.5 bg-[#2A3B2C] text-white rounded-full hover:bg-[#1A241B] transition-colors font-semibold shadow-xl shadow-[#2A3B2C]/20 tracking-wide cursor-pointer"
                    >
                      Explore {displayRegion.name} Tours
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : displayRegion && 'isEmpty' in displayRegion ? (
            <div className="flex flex-col items-center justify-center text-center w-full h-full bg-[#FAFAF8] border border-[#EAE5D9] rounded-2xl p-8 gap-6 animate-in fade-in duration-500 relative">
              {selectedRegion && selectedRegion.name === displayRegion.name && (
                <button 
                  onClick={() => setSelectedRegion(null)}
                  className="absolute top-4 right-4 z-20 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-full p-1.5 transition-colors"
                  aria-label="Clear selection"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              <div className="mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-[4.5rem] w-[4.5rem] text-[#8B5A2B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {/* Premium map/curation icon */}
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-3xl font-serif text-[#2A3B2C] max-w-xs">{displayRegion.name}</h3>
              <p className="text-gray-500 max-w-sm leading-relaxed text-[15px]">We are currently curating authentic experiences in this region.<br/>Check back soon!</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center w-full h-full bg-[#F9F8F6] border border-[#EAE5D9] rounded-2xl p-8 gap-8 animate-in fade-in duration-500">
              <div className="animate-pulse flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {/* Stylized compass/sun icon */}
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>
              <div className="flex flex-col items-center space-y-3">
                <span className="text-[10px] tracking-[0.3em] text-gray-400 font-semibold uppercase">
                  Interactive Explorer
                </span>
                <h3 className="text-3xl font-serif text-[#2A3B2C] max-w-xs">
                  Explore the roots of Ghana
                </h3>
              </div>
              <p className="text-gray-500 max-w-sm leading-relaxed text-sm">
                Hover over the interactive map to discover cultural images, experiences, and events across the regions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>

      {/* Mouse Tracking Tooltip */}
      <div 
        className={`fixed pointer-events-none z-50 bg-[#131A14]/40 backdrop-blur-2xl backdrop-saturate-200 border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.4)] rounded-2xl p-5 max-w-[240px] transition-opacity duration-200 ${tooltip.show ? 'opacity-100' : 'opacity-0'}`}
        style={{ top: tooltip.y + 20, left: tooltip.x + 20 }}
      >
        <h4 className="font-serif text-xl text-white leading-tight mb-2 tracking-wide font-medium drop-shadow-md">
          {tooltip.regionName}
        </h4>
        
        {tooltip.isConfigured ? (
          <div className="flex flex-col gap-2 mt-3">
            <div className="h-[3px] w-8 bg-[#D4AF37]"></div>
            {tooltip.events.map((ev, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-[#D4AF37] text-sm mt-0 text-bold drop-shadow-sm">★</span>
                <span className="text-sm text-gray-100 leading-snug font-medium drop-shadow-sm">{ev}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-2">
            <span className="inline-block px-2.5 py-1 bg-white/10 border border-white/10 rounded-lg text-[10px] uppercase tracking-wider text-white font-bold mb-2 shadow-sm">In Curation</span>
            <p className="text-xs text-gray-200 italic leading-relaxed font-medium drop-shadow-sm">
              We are actively developing premium experiences for this region.
            </p>
          </div>
        )}
      </div>

    </section>
  );
};

export default GhanaMapExplorer;
