//frontend/src/components/layout/Header.tsx
"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-ghana-red rounded-full flex items-center justify-center text-white font-bold tracking-wider">
                R&R
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl text-black-star leading-tight">Roots & Rhythm</span>
                <span className="text-xs text-ghana-green font-medium">Travels</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/tours" className="text-gray-700 hover:text-ghana-gold transition-colors font-medium">Tours</Link>
            <Link href="/destinations" className="text-gray-700 hover:text-ghana-gold transition-colors font-medium">Destinations</Link>
            <Link href="/about" className="text-gray-700 hover:text-ghana-gold transition-colors font-medium">Our Story</Link>
            <Link href="/contact" className="text-gray-700 hover:text-ghana-gold transition-colors font-medium">Contact</Link>
          </nav>

          {/* Call to Action Button */}
          <div className="hidden md:flex items-center">
            <Link href="/book" className="bg-ghana-green text-white px-6 py-2 rounded-full font-medium hover:bg-opacity-90 transition-all shadow-md hover:shadow-lg">
              Book Now
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-ghana-red focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/tours" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-ghana-gold hover:bg-gray-50">Tours</Link>
            <Link href="/destinations" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-ghana-gold hover:bg-gray-50">Destinations</Link>
            <Link href="/about" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-ghana-gold hover:bg-gray-50">Our Story</Link>
            <Link href="/contact" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-ghana-gold hover:bg-gray-50">Contact</Link>
            <Link href="/book" className="block w-full text-center mt-4 bg-ghana-green text-white px-6 py-2 rounded-full font-medium hover:bg-opacity-90">
              Book Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
