// frontend/src/components/CurrencySwitcher.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';

const CURRENCIES = ['USD', 'GHS', 'EUR', 'GBP', 'CAD'];

export default function CurrencySwitcher({ isScrolled, direction = 'down' }: { isScrolled: boolean, direction?: 'up' | 'down' }) {
  const [isOpen, setIsOpen] = useState(false);
  const { currency, setCurrency } = useCurrency();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 rounded-2xl transition-all cursor-pointer group ${
          isScrolled 
            ? 'bg-white/5 hover:bg-white/10 text-white' 
            : 'bg-white/10 hover:bg-white backdrop-blur-md text-white hover:text-black'
        }`}
      >
        <Globe size={18} strokeWidth={2.5} className="group-hover:rotate-12 transition-transform duration-500" />
        <span className="text-[10px] md:text-xs font-black tracking-widest uppercase">{currency}</span>
        <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: direction === 'up' ? -10 : 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: direction === 'up' ? -10 : 10, scale: 0.95 }}
            className={`absolute right-0 ${direction === 'up' ? 'bottom-full mb-4' : 'top-full mt-4'} w-40 p-2 rounded-2xl shadow-2xl z-[60] border border-white/10 bg-[#1A241B]`}
          >
            <div className="flex flex-col gap-1">
              {CURRENCIES.map((code) => (
                <button
                  key={code}
                  onClick={() => {
                    setCurrency(code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all text-left group cursor-pointer ${
                    currency === code 
                      ? 'bg-[#B8860B]/20 text-[#B8860B]' 
                      : 'text-white/60 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="text-xs font-bold tracking-widest">{code}</span>
                  {currency === code && <Check size={14} />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
