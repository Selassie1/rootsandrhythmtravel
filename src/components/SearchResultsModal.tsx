// src/components/SearchResultsModal.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Globe, MapPin, TreePalm, Timer, ArrowRight, Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { createPortal } from 'react-dom';
import { TourSearchResult } from '@/actions/tours';
import { regionMapping } from '@/utils/tour-mappings';

interface SearchResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  results: TourSearchResult[];
  isLoading: boolean;
}

export default function SearchResultsModal({ isOpen, onClose, results, isLoading }: SearchResultsModalProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  const content = (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-2 md:p-8 pointer-events-auto cursor-pointer"
          onClick={onClose}
        >
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/20 backdrop-blur-sm pointer-events-none"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl max-h-[92vh] md:max-h-[85vh] bg-[#1c221d] border border-white/10 rounded-2xl md:rounded-[32px] shadow-[0_32px_64px_rgba(0,0,0,0.8)] flex flex-col pointer-events-auto cursor-default overflow-hidden mx-auto"
          >
            {/* Header */}
            <div className="p-4 md:p-6 border-b border-white/5 flex items-center justify-between bg-white/5 backdrop-blur-md">
              <div>
                <h2 className="text-xl md:text-2xl font-serif text-white tracking-wide">
                  {isLoading ? 'Searching...' : `${results.length} Journeys Found`}
                </h2>
                <p className="text-white/50 text-[10px] md:text-sm mt-1 uppercase tracking-[0.2em]">Curated for your rhythm</p>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); onClose(); }}
                className="p-2 md:p-3 rounded-full bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              >
                <X size={20} className="md:w-6 md:h-6" />
              </button>
            </div>

            {/* Results Grid */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 no-scrollbar">
              {isLoading ? (
                <div className="h-64 flex flex-col items-center justify-center gap-4">
                  <div className="w-12 h-12 border-4 border-[#B8860B]/20 border-t-[#B8860B] rounded-full animate-spin" />
                  <p className="text-white/40 uppercase tracking-widest animate-pulse">Searching...</p>
                </div>
              ) : results.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.map((tour, i) => (
                    <motion.div
                      key={tour.slug}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="group relative bg-white/5 border border-white/5 rounded-2xl overflow-hidden hover:border-[#B8860B]/30 transition-all hover:bg-white/10"
                    >
                      {/* Image container */}
                      <div className="relative h-48 overflow-hidden">
                        <Image 
                          src={tour.hero_image_url || '/placeholder-tour.jpg'} 
                          alt={tour.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          unoptimized={true}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#131A14] via-transparent to-transparent opacity-80" />
                        
                        <div className="absolute top-4 left-4 px-3 py-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-full">
                          <span className="text-[10px] text-white font-bold tracking-widest uppercase">{regionMapping[tour.region] || tour.region}</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <h3 className="text-lg font-serif text-white group-hover:text-[#E8D3A2] transition-colors line-clamp-1 mb-2">{tour.title}</h3>
                        
                        <div className="flex items-center gap-4 text-white/50 text-[10px] uppercase tracking-widest mb-4">
                          <div className="flex items-center gap-1.5 font-bold">
                            <Clock size={12} className="text-[#B8860B]" />
                            {tour.duration_days} Days
                          </div>
                          <div className="flex items-center gap-1.5 font-bold">
                            <Globe size={12} className="text-[#B8860B]" />
                            {tour.region.split('_').join(' ')}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                          <div>
                            <span className="block text-[8px] text-white/30 uppercase tracking-widest mb-0.5">From</span>
                            <span className="text-[#E8D3A2] font-black tracking-tight text-lg">${tour.price}</span>
                          </div>
                          <Link 
                            href={`/tours/${tour.slug}`}
                            className="flex items-center gap-2 text-white/80 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] transition-all group/btn"
                          >
                            Explore
                            <ArrowRight size={14} className="transition-transform group-hover/btn:translate-x-1" />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-center px-4">
                  <Globe className="text-white/20 mb-4" size={48} />
                  <h3 className="text-xl text-white font-serif mb-2 sans">No Journeys Found</h3>
                  <p className="text-white/40 text-sm max-w-xs mx-auto">None of our hidden treasures match these specific rhythms. Try broadening your horizon.</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 md:p-6 bg-white/5 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-1.5">
                  {['accra', 'adomi', 'aburi'].map(name => (
                    <div key={name} className="w-7 h-7 md:w-8 md:h-8 rounded-full border-2 border-[#141a15] bg-gray-800 overflow-hidden relative">
                      <Image src={`/images/${name}.jpg`} alt="Explorer" fill className="object-cover" unoptimized />
                    </div>
                  ))}
                </div>
                <p className="text-[9px] md:text-[10px] text-white/40 uppercase tracking-widest font-bold">
                  Joined by <span className="text-white">1.2k+</span> Travelers
                </p>
              </div>
              <button 
                onClick={onClose}
                className="w-full md:w-auto px-6 py-2.5 md:px-8 md:py-3 bg-[#E8D3A2] hover:bg-white text-[#1a221b] rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95"
              >
                Close Results
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(content, document.body);
}
