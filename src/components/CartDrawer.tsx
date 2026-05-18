'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingBag, ArrowRight, Calendar, User, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import Price from '@/components/Price';

export default function CartDrawer() {
  const { items, removeItem, updateItem, clearCart, isDrawerOpen, closeDrawer } = useCart();

  const totalDeposit = items.reduce((sum, i) => sum + i.deposit * i.passengers, 0);
  const totalFull = items.reduce((sum, i) => sum + i.price * i.passengers, 0);
  const internationalFee = 0.039;
  const grandTotalDeposit = Math.round((totalDeposit / (1 - internationalFee)) * 100) / 100;
  const grandTotalFull = Math.round((totalFull / (1 - internationalFee)) * 100) / 100;

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="fixed right-0 top-0 bottom-0 z-[90] w-full max-w-[480px] bg-[#131A14] border-l border-white/10 flex flex-col shadow-[0_0_80px_rgba(0,0,0,0.8)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 flex-shrink-0">
              <div className="flex items-center gap-3">
                <ShoppingBag size={18} className="text-[#B8860B]" />
                <h2 className="text-white font-bold text-sm uppercase tracking-[0.2em]">
                  Your Journey Cart
                  {items.length > 0 && (
                    <span className="ml-2 bg-[#B8860B] text-black text-[10px] font-black px-2 py-0.5 rounded-full">
                      {items.length}
                    </span>
                  )}
                </h2>
              </div>
              <button onClick={closeDrawer} className="p-2 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-all">
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center gap-4 text-center py-16">
                  <ShoppingBag size={40} className="text-white/10" />
                  <p className="text-white/40 text-sm">Your cart is empty.</p>
                  <Link
                    href="/tours"
                    onClick={closeDrawer}
                    className="mt-2 text-[#E8D3A2] text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2"
                  >
                    Browse Tours <ArrowRight size={12} />
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {items.map((item) => (
                    <div key={item.tourId} className="bg-[#1A241B] border border-white/5 rounded-2xl overflow-hidden">
                      {/* Tour image + title row */}
                      <div className="flex items-start gap-4 p-4">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                          <Image src={item.heroImageUrl || '/images/Square.jpeg'} alt={item.tourTitle} fill className="object-cover" unoptimized />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/tours/${item.tourSlug}`}
                            onClick={closeDrawer}
                            className="text-white font-bold text-sm leading-tight hover:text-[#E8D3A2] transition-colors line-clamp-2"
                          >
                            {item.tourTitle}
                          </Link>
                          <p className="text-white/40 text-[10px] uppercase tracking-widest mt-1">{item.location} · {item.durationDays} {typeof item.durationDays === 'number' ? 'Days' : ''}</p>
                          <p className="text-[#E8D3A2] text-sm font-bold mt-1.5"><Price amount={item.price} /> <span className="text-white/30 font-normal text-[10px]">/ person</span></p>
                        </div>
                        <button onClick={() => removeItem(item.tourId)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/20 hover:text-red-400 transition-all shrink-0">
                          <Trash2 size={15} />
                        </button>
                      </div>

                      {/* Controls */}
                      <div className="px-4 pb-4 flex flex-col gap-2.5">
                        <div className="flex gap-2">
                          {/* Passengers */}
                          <div className="flex-1 relative">
                            <User size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                            <select
                              value={item.passengers}
                              onChange={(e) => updateItem(item.tourId, { passengers: Number(e.target.value) })}
                              className="w-full bg-[#131A14] border border-white/10 rounded-xl pl-8 pr-3 py-2.5 text-white text-xs focus:outline-none focus:border-[#B8860B] transition-colors appearance-none cursor-pointer"
                            >
                              {[1,2,3,4,5,6,7,8,9,10].map(n => (
                                <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                              ))}
                            </select>
                          </div>
                          {/* Travel Date */}
                          <div className="flex-1 relative">
                            <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 z-10" />
                            <input
                              type="date"
                              value={item.travelDate}
                              onChange={(e) => updateItem(item.tourId, { travelDate: e.target.value })}
                              className="w-full bg-[#131A14] border border-white/10 rounded-xl pl-8 pr-3 py-2.5 text-white text-xs focus:outline-none focus:border-[#B8860B] transition-colors [color-scheme:dark]"
                            />
                          </div>
                        </div>
                        {/* Item subtotal */}
                        <div className="flex items-center justify-between pt-1.5 border-t border-white/5">
                          <span className="text-white/30 text-[10px] uppercase tracking-widest">Subtotal</span>
                          <span className="text-white text-sm font-bold"><Price amount={item.price * item.passengers} /></span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-white/5 p-5 flex flex-col gap-4 flex-shrink-0 bg-[#1A241B]">
                {/* Missing dates warning */}
                {items.some(i => !i.travelDate) && (
                  <div className="flex items-start gap-2 bg-[#B8860B]/10 border border-[#B8860B]/20 rounded-xl px-4 py-3">
                    <AlertCircle size={14} className="text-[#B8860B] shrink-0 mt-0.5" />
                    <p className="text-[#E8D3A2] text-[10px] leading-relaxed">Please set a travel date for each tour before checking out.</p>
                  </div>
                )}

                {/* Price summary */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40">Deposit total</span>
                    <span className="text-white font-bold"><Price amount={grandTotalDeposit} /></span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40">Full total</span>
                    <span className="text-white font-bold"><Price amount={grandTotalFull} /></span>
                  </div>
                  <p className="text-white/20 text-[9px] mt-1">Includes 3.9% international processing fee</p>
                </div>

                <Link
                  href="/checkout/cart"
                  onClick={closeDrawer}
                  className={`w-full py-4 rounded-2xl font-bold uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2 transition-all shadow-xl ${
                    items.some(i => !i.travelDate)
                      ? 'bg-white/10 text-white/30 pointer-events-none'
                      : 'bg-[#E8D3A2] text-[#131A14] hover:bg-white'
                  }`}
                >
                  Proceed to Checkout <ArrowRight size={13} />
                </Link>

                <button
                  onClick={clearCart}
                  className="text-white/20 text-[9px] uppercase tracking-widest hover:text-red-400 transition-colors text-center"
                >
                  Clear cart
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
