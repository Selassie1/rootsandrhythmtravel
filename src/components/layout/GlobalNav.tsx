'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, User, X, Map, Ticket, User as UserIcon, BookOpen, LogOut, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import CurrencySwitcher from '@/components/CurrencySwitcher';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Tours', href: '/tours' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' }
];

export default function GlobalNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
        setIsMenuOpen(false); 
        setIsProfileOpen(false);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  if (pathname === '/login' || pathname.startsWith('/checkout/verify') || pathname.startsWith('/admin')) return null;

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
        className={`fixed z-50 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] flex items-center ${
          isScrolled 
            ? 'top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-[1000px] h-[72px] bg-[#131A14]/50 backdrop-blur-xl border border-white/10 rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.5)] px-4 md:px-8'
            : 'top-0 left-0 w-full h-[100px] bg-transparent border border-transparent px-6 md:px-16'
        }`}
      >
        <div className={`w-full h-full flex items-center justify-between relative transition-opacity duration-300 ${isMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          
          {/* --- LEFT SECTION --- */}
          <div className="flex items-center w-[120px] md:w-[150px] overflow-hidden">
            <AnimatePresence mode="wait">
              {!isScrolled ? (
                <motion.button 
                  key="hamburger"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center gap-4 text-white hover:text-[#B8860B] transition-colors outline-none cursor-pointer"
                >
                  <div className="flex flex-col gap-1.5 w-8">
                    <span className="h-[2px] w-full bg-current rounded-full" />
                    <span className="h-[2px] w-3/4 bg-current rounded-full" />
                  </div>
                  <span className="text-sm font-medium tracking-widest uppercase hidden md:block">Menu</span>
                </motion.button>
              ) : (
                <motion.div 
                  key="scrolled-logo"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                >
                  <Link href="/" className="flex items-center gap-3 outline-none group cursor-pointer">
                    <div className="relative w-8 h-8 sm:w-10 sm:h-10 transition-transform duration-500 group-hover:scale-105">
                      <Image src="/logo.png" alt="Logo" fill className="object-contain" priority unoptimized />
                    </div>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* --- CENTER SECTION --- */}
          <div className="flex-1 flex justify-center h-full relative">
            <AnimatePresence mode="wait">
              {!isScrolled ? (
                <motion.div
                  key="dome-logo"
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50, transition: { duration: 0.2 } }}
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-30 h-[64px] md:w-32 md:h-[90px] bg-white/20 backdrop-blur-md rounded-b-[100px] flex items-center justify-center shadow-2xl"
                >
                  <Link href="/" className="relative w-9 h-9 md:w-14 md:h-14 mt-[-6px] md:mt-[-10px] group transition-transform duration-500 hover:scale-110 cursor-pointer">
                    <Image src="/logo.png" alt="Roots & Rhythm Travels" fill className="object-contain" priority unoptimized />
                  </Link>
                </motion.div>
              ) : (
                <motion.div
                  key="pill-links"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
                  className="hidden md:flex items-center h-full gap-8 lg:gap-12"
                >
                  {navLinks.map((link) => (
                    <Link 
                      key={link.name} 
                      href={link.href}
                      className="text-white/80 hover:text-[#E8D3A2] text-xs font-bold tracking-[0.2em] uppercase transition-colors cursor-pointer"
                    >
                      {link.name}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* --- RIGHT SECTION --- */}
          <div className="flex justify-end items-center gap-2 md:gap-4 w-[160px] md:w-[200px]">
            <div className="hidden md:block">
              <CurrencySwitcher isScrolled={isScrolled} />
            </div>
            
            {user ? (
              <div className="relative group flex items-center justify-center">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center text-[#1A241B] font-bold text-lg font-serif transition-colors cursor-pointer bg-[#E8D3A2] hover:bg-white shadow-lg`}
                >
                  {(user.user_metadata?.first_name?.charAt(0) || user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || 'U').toUpperCase()}
                </button>
                
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div 
                      key="profile-dropdown"
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-[110%] w-56 bg-[#1A241B] border border-white/10 rounded-2xl p-2 z-[60] shadow-2xl"
                    >
                      <div className="px-4 py-3 border-b border-white/5 mb-1">
                        <p className="text-[10px] text-white/30 uppercase tracking-widest font-black mb-1">Authenticated As</p>
                        <p className="text-white text-xs truncate font-mono">{user.email}</p>
                      </div>

                      <Link href="/dashboard?tab=upcoming" onClick={() => setIsProfileOpen(false)} className="flex items-center justify-between px-4 py-3 hover:bg-white/5 rounded-xl text-white font-bold text-[10px] uppercase tracking-widest transition-colors mb-1 group">
                        <div className="flex items-center gap-3">
                          <Map size={14} className="text-[#B8860B]" />
                          <span>Upcoming Journeys</span>
                        </div>
                        <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                      </Link>

                      <Link href="/dashboard?tab=history" onClick={() => setIsProfileOpen(false)} className="flex items-center justify-between px-4 py-3 hover:bg-white/5 rounded-xl text-white font-bold text-[10px] uppercase tracking-widest transition-colors mb-1 group">
                        <div className="flex items-center gap-3">
                          <Ticket size={14} className="text-[#B8860B]" />
                          <span>Journey History</span>
                        </div>
                        <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                      </Link>

                      <Link href="/dashboard?tab=settings" onClick={() => setIsProfileOpen(false)} className="flex items-center justify-between px-4 py-3 hover:bg-white/5 rounded-xl text-white font-bold text-[10px] uppercase tracking-widest transition-colors mb-1 group">
                        <div className="flex items-center gap-3">
                          <UserIcon size={14} className="text-[#B8860B]" />
                          <span>Manage Identity</span>
                        </div>
                        <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                      </Link>

                      <div className="w-full h-px bg-white/5 my-1" />
                      <form action="/auth/signout" method="post" className="w-full m-0">
                        <button type="submit" className="w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-red-500/10 rounded-xl text-red-400 font-bold text-[10px] uppercase tracking-widest transition-colors cursor-pointer group">
                          <LogOut size={14} />
                          <span>Sign Out</span>
                        </button>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link href="/login" className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center text-white transition-all cursor-pointer ${isScrolled ? 'bg-white/5 hover:bg-[#B8860B] hover:text-[#1A241B]' : 'bg-white/10 hover:bg-[#B8860B] backdrop-blur-md hover:text-[#1A241B]'}`}>
                <User size={18} strokeWidth={2.5} />
              </Link>
            )}

            <AnimatePresence>
              {isScrolled && (
                <motion.button
                  key="pill-hamburger"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => setIsMenuOpen(true)}
                  className="md:hidden w-10 h-10 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors cursor-pointer"
                >
                  <div className="flex flex-col gap-1 w-[18px]">
                    <span className="h-[2px] w-full bg-current rounded-full" />
                    <span className="h-[2px] w-[14px] bg-current rounded-full mx-auto" />
                    <span className="h-[2px] w-full bg-current rounded-full" />
                  </div>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            key="mobile-menu"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[100] bg-[#131A14] flex flex-col items-center justify-center"
          >
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-8 right-8 text-white/50 hover:text-white transition-all p-4 rounded-full hover:bg-white/5 z-[110] group cursor-pointer"
            >
              <X size={32} strokeWidth={1.5} className="transition-transform duration-500 group-hover:rotate-90" />
            </button>

            <div className="flex flex-col items-center gap-10 text-center w-full max-w-xl px-6 relative z-10">
              <div className="mb-4">
                <Link href="/" onClick={() => setIsMenuOpen(false)} className="relative w-16 h-16 block group transition-transform duration-500 hover:scale-110 cursor-pointer">
                  <Image src="/logo.png" alt="Roots & Rhythm Travels" fill className="object-contain" priority unoptimized />
                </Link>
              </div>
              
              <div className="flex flex-col gap-6 md:gap-8 w-full items-center">
                {/* Mobile Currency Selection - Moved Upwards & Direction UP */}
                <div className="mb-4">
                  <CurrencySwitcher isScrolled={true} direction="up" />
                </div>

                {navLinks.map((link, i) => (
                  <motion.div 
                    key={link.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * i, ease: [0.21, 0.47, 0.32, 0.98] }}
                  >
                    <Link 
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="text-4xl md:text-7xl font-serif text-white hover:text-[#E8D3A2] transition-colors leading-none tracking-tight block relative group cursor-pointer"
                    >
                      {link.name}
                      <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-[#B8860B] transition-all duration-500 group-hover:w-[40px]" />
                    </Link>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="mt-12 flex flex-col gap-4 items-center"
              >
                {user ? (
                   <Link href="/dashboard?tab=upcoming" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-center gap-3 px-8 py-4 bg-[#B8860B] active:scale-95 text-black rounded-full font-bold text-xs tracking-[0.2em] transition-all uppercase shadow-xl">
                      <Map size={18} /> My Dashboard
                   </Link>
                ) : (
                  <Link href="/login" onClick={() => setIsMenuOpen(false)} className="px-8 py-4 border border-white/20 text-white hover:bg-white hover:text-black rounded-full font-bold text-[10px] md:text-xs tracking-[0.2em] transition-all uppercase inline-flex items-center gap-3 cursor-pointer">
                    <User size={16} /> Sign In to Portal
                  </Link>
                )}
              </motion.div>
            </div>
            
            <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-[#B8860B]/10 rounded-full blur-[140px] pointer-events-none" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
