'use client';

import { useActionState, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { loginAction, googleLoginAction } from './actions';

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, null);
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  
  const isSignUp = activeTab === 'signup';

  return (
    <div className="relative h-screen bg-[#131A14] flex font-sans overflow-hidden">
      
      {/* LEFT COLUMN: Cinematic Image (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 relative h-full flex-col justify-end p-16">
        <Image 
          src="/images/Square.jpeg" 
          alt="Cinematic Background"
          fill
          className="object-cover object-center scale-105"
          priority
        />
        {/* Gradient overlays to smoothly blend the image back into the dark canvas */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-[#131A14]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#131A14]/90 via-transparent to-black/30" />
        
        {/* Narrative Motivation Text Overlay */}
        <div className="relative z-10 max-w-lg fade-in">
          <h2 className="text-white font-serif text-5xl mb-6 leading-[1.1]">
            Curated journeys <br/>for the discerning traveler.
          </h2>
          <p className="text-white/60 text-sm tracking-widest uppercase font-medium leading-relaxed">
            Gain priority access to limited itineraries, manage your luxury reservations, and immerse yourself in unparalleled authentic cultural experiences.
          </p>
        </div>
      </div>

      {/* RIGHT COLUMN: The Form Container */}
      {/* We use h-full and overflow-y-auto to allow scrolling only on the right panel if content overflows */}
      <div className="w-full lg:w-1/2 h-full overflow-y-auto overflow-x-hidden flex flex-col pt-12 p-6 sm:p-12 lg:p-16 xl:p-24 relative z-10 bg-[#131A14]">
        
        {/* Floating Return Link */}
        <Link href="/" className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors text-[10px] uppercase tracking-[0.2em] font-bold z-20">
          ← Return
        </Link>

        {/* Form specific wrapper ensuring it can center vertically if there is room */}
        <div className="my-auto w-full max-w-[440px] mx-auto flex flex-col items-center">
          
          {/* Brand Logo Header (Side-by-side design) */}
          <Link href="/" className="flex items-center gap-4 outline-none group mb-12 self-start fade-in">
            <div className="relative w-12 h-12 transition-transform duration-500 group-hover:scale-105">
              <Image src="/logo.png" alt="Logo" fill className="object-contain" priority />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[#F9B729] text-xs uppercase font-black tracking-widest">Roots &</span>
              <span className="text-[#E63931] text-xs uppercase font-black tracking-[0.2em]">Rhythm</span>
              <span className="text-[#178548] text-xs uppercase font-black tracking-[0.2em]">Travels</span>
            </div>
          </Link>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="w-full"
          >
            {/* Highly Visible Tab Switcher for Sign Up vs Login */}
            <div className="w-full bg-[#1A241B] rounded-2xl p-1.5 flex mb-10 relative shadow-inner">
              {/* Sliding Active Background Pill */}
              <div 
                className="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-[#B8860B] rounded-xl transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
                style={{ left: isSignUp ? 'calc(50% + 3px)' : '6px' }}
              />
              
              <button 
                type="button"
                onClick={() => setActiveTab('login')}
                className={`flex-1 py-3.5 text-xs font-bold uppercase tracking-[0.2em] relative z-10 transition-colors duration-300 ${!isSignUp ? 'text-black' : 'text-white/50 hover:text-white cursor-pointer'}`}
              >
                Sign In
              </button>
              <button 
                type="button"
                onClick={() => setActiveTab('signup')}
                className={`flex-1 py-3.5 text-xs font-bold uppercase tracking-[0.2em] relative z-10 transition-colors duration-300 ${isSignUp ? 'text-black' : 'text-white/50 hover:text-white cursor-pointer'}`}
              >
                Register
              </button>
            </div>

            {/* Form Core */}
            <form action={formAction} className="w-full flex flex-col gap-5 relative z-10">
              
              <input type="hidden" name="actionType" value={activeTab} />

              <AnimatePresence>
                {isSignUp && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0, y: -10 }} 
                    animate={{ opacity: 1, height: 'auto', y: 0 }} 
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    className="flex flex-col gap-4 w-full"
                  >
                    <div className="flex gap-4 w-full">
                      <div className="flex flex-col gap-2 flex-1">
                        <label className="text-[10px] text-white/50 font-bold uppercase tracking-[0.2em] ml-2 block">First Name</label>
                        <input 
                          type="text" 
                          name="firstName"
                          required={isSignUp}
                          disabled={pending}
                          className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:border-[#B8860B] focus:bg-white/5 transition-all font-medium disabled:opacity-50"
                          placeholder="Kwame"
                        />
                      </div>
                      <div className="flex flex-col gap-2 flex-1">
                        <label className="text-[10px] text-white/50 font-bold uppercase tracking-[0.2em] ml-2 block">Last Name</label>
                        <input 
                          type="text" 
                          name="lastName"
                          required={isSignUp}
                          disabled={pending}
                          className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:border-[#B8860B] focus:bg-white/5 transition-all font-medium disabled:opacity-50"
                          placeholder="Mensah"
                        />
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 relative mt-1">
                      <label className="text-[10px] text-white/50 font-bold uppercase tracking-[0.2em] ml-2 block">Contact / Phone Number</label>
                      <input 
                        type="tel" 
                        name="phoneNumber"
                        required={isSignUp}
                        disabled={pending}
                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-[#B8860B] focus:bg-white/5 transition-all font-medium disabled:opacity-50"
                        placeholder="+233 55 000 0000"
                      />
                    </div>
                    
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] text-white/50 font-bold uppercase tracking-[0.2em] ml-2 block">Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  required
                  disabled={pending}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-[#B8860B] focus:bg-white/5 transition-all font-medium disabled:opacity-50"
                  placeholder="name@example.com"
                />
              </div>

              <div className="flex flex-col gap-2 relative mt-1">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] text-white/50 font-bold uppercase tracking-[0.2em] ml-2 block">Password</label>
                  {!isSignUp && (
                    <button type="button" className="text-[9px] text-[#B8860B] hover:text-[#E8D3A2] uppercase tracking-[0.1em] font-bold mr-2">Forgot?</button>
                  )}
                </div>
                <input 
                  type="password" 
                  name="password"
                  required
                  disabled={pending}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-[#B8860B] focus:bg-white/5 transition-all font-medium disabled:opacity-50"
                  placeholder="••••••••"
                />
              </div>

              {/* Confirm Password (Only visible during Signup) */}
              <AnimatePresence>
                {isSignUp && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0, y: -10 }} 
                    animate={{ opacity: 1, height: 'auto', y: 0 }} 
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    className="flex flex-col gap-2 relative overflow-hidden"
                  >
                    <label className="text-[10px] text-white/50 font-bold uppercase tracking-[0.2em] ml-2 block">Confirm Password</label>
                    <input 
                      type="password" 
                      name="confirmPassword"
                      required={isSignUp}
                      disabled={pending}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-[#B8860B] focus:bg-white/5 transition-all font-medium disabled:opacity-50"
                      placeholder="••••••••"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error Message Space */}
              <AnimatePresence>
                {state?.error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-red-500/10 border border-red-500/20 text-red-200 text-xs px-4 py-3 rounded-xl text-center"
                  >
                    {state.error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Success Message Space (For Email Confirmations) */}
              <AnimatePresence>
                {state?.success && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-[#B8860B]/20 border border-[#B8860B]/40 text-[#E8D3A2] text-xs px-4 py-3 rounded-xl text-center font-bold tracking-wide"
                  >
                    {state.success}
                  </motion.div>
                )}
              </AnimatePresence>

              <button 
                type="submit" 
                disabled={pending}
                className="w-full bg-white hover:bg-[#E8D3A2] text-black font-bold uppercase tracking-[0.2em] text-[11px] h-14 rounded-2xl mt-2 flex items-center justify-center gap-3 transition-colors disabled:opacity-50 shadow-lg group overflow-hidden relative leading-none cursor-pointer"
              >
                {pending ? (
                  <>
                    <Loader2 size={16} className="animate-spin text-black" />
                    Processing...
                  </>
                ) : (
                  <>
                    <span className="relative z-10 transition-transform group-hover:-translate-x-1">
                      {isSignUp ? 'Create Account' : 'Login'}
                    </span>
                    <ArrowRight size={14} className="relative z-10 transition-transform group-hover:translate-x-1" strokeWidth={3} />
                  </>
                )}
              </button>
            </form>

            {/* Setup Divider */}
            <div className="w-full flex items-center gap-4 my-8 relative z-10 opacity-30">
              <span className="h-px w-full bg-white/20" />
              <span className="text-[9px] text-white uppercase tracking-[0.2em] font-bold">Or</span>
              <span className="h-px w-full bg-white/20" />
            </div>

            {/* Native Google OAuth Hook */}
            <form action={googleLoginAction} className="w-full relative z-10">
              <button className="w-full bg-[#1A241B] hover:bg-[#B8860B] text-white hover:text-black border border-white/5 hover:border-transparent h-14 rounded-2xl flex items-center justify-center gap-3 transition-all font-bold uppercase tracking-[0.2em] text-[10px] cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="16px" height="16px" className="shrink-0">
                  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                  <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                  <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                  <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                </svg>
                Continue with Google
              </button>
            </form>
          </motion.div>

        </div>
      </div>

    </div>
  );
}
