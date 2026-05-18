'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, CreditCard, ShieldCheck, UserCheck, X, ShoppingBag, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Price from '@/components/Price';
import { useCart } from '@/context/CartContext';

const FEE = 0.039;
function withFee(amount: number) {
  return Math.round((amount / (1 - FEE)) * 100) / 100;
}

export default function CartCheckoutEngine({ currentUser }: { currentUser: any }) {
  const { items, clearCart } = useCart();
  const [paymentOption, setPaymentOption] = useState<'pay_deposit' | 'pay_full'>('pay_deposit');
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paystackUrl, setPaystackUrl] = useState<string | null>(null);
  const [guestEmail, setGuestEmail] = useState(currentUser?.email || '');
  const [guestName, setGuestName] = useState(
    currentUser?.user_metadata?.full_name ||
    `${currentUser?.user_metadata?.first_name || ''} ${currentUser?.user_metadata?.last_name || ''}`.trim() || ''
  );
  const [guestPhone, setGuestPhone] = useState(currentUser?.user_metadata?.phone || '');

  // Empty cart — shown after hydration if localStorage has no items
  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto text-center py-24 flex flex-col items-center gap-6">
        <ShoppingBag size={48} className="text-white/10" />
        <h2 className="text-2xl font-serif text-white">Your cart is empty</h2>
        <p className="text-white/40 text-sm">Add some journeys before checking out.</p>
        <Link href="/tours" className="mt-4 bg-[#E8D3A2] text-[#131A14] px-8 py-4 rounded-full font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-white transition-colors flex items-center gap-2">
          Browse Tours <ArrowRight size={13} />
        </Link>
      </div>
    );
  }

  const baseTotal = items.reduce((sum, i) => {
    const perPerson = paymentOption === 'pay_full' ? i.price : i.deposit;
    return sum + perPerson * i.passengers;
  }, 0);
  const fullTotal = items.reduce((sum, i) => sum + i.price * i.passengers, 0);
  const grandTotal = withFee(baseTotal);

  const handleCheckout = async () => {
    if (!guestEmail || !guestPhone || (!currentUser && !guestName)) return;
    setIsProcessing(true);

    try {
      const resp = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // Multi-cart signal
          cartItems: items.map(i => ({
            tourId: i.tourId,
            tourTitle: i.tourTitle,
            passengers: i.passengers,
            travelDate: i.travelDate,
            price: i.price,
            deposit: i.deposit,
          })),
          tourId: items.length === 1 ? items[0].tourId : 'MULTI',
          tourName: items.length === 1 ? items[0].tourTitle : `${items.length} Journeys`,
          paymentOption,
          travelDate: items[0]?.travelDate || '',
          passengers: items.reduce((s, i) => s + i.passengers, 0),
          totalAmount: grandTotal,
          totalFullPrice: withFee(fullTotal),
          tourValuePaid: baseTotal,
          guestEmail,
          guestName: guestName || 'Valued Traveler',
          guestPhone,
          userId: currentUser?.id,
        }),
      });

      const data = await resp.json();
      if (!data.authorization_url) {
        alert(data.error || 'Failed to initialize payment.');
        setIsProcessing(false);
        return;
      }

      setPaystackUrl(data.authorization_url);
    } catch {
      alert('Payment gateway error. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <>
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-16 items-start relative z-10">

      {/* LEFT: Guest info + payment option */}
      <div className="flex flex-col gap-10">

        {/* Cart Summary */}
        <div className="bg-[#1A241B] rounded-[2rem] border border-white/10 p-8 md:p-10">
          <h3 className="text-2xl font-serif text-[#FAFAF8] flex items-center gap-4 mb-8 pb-6 border-b border-white/5">
            <span className="w-8 h-8 rounded-full bg-[#B8860B] flex items-center justify-center text-black font-bold text-xs">
              <ShoppingBag size={14} />
            </span>
            Your Journeys
          </h3>
          <div className="flex flex-col gap-4">
            {items.map((item) => (
              <div key={item.tourId} className="flex items-center gap-4 p-4 bg-[#131A14] rounded-2xl border border-white/5">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0">
                  <Image src={item.heroImageUrl || '/images/Square.jpeg'} alt={item.tourTitle} fill className="object-cover" unoptimized />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-sm leading-tight line-clamp-1">{item.tourTitle}</p>
                  <p className="text-white/40 text-[10px] uppercase tracking-widest mt-0.5">{item.travelDate} · {item.passengers} Guest{item.passengers > 1 ? 's' : ''}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[#E8D3A2] font-bold text-sm">
                    <Price amount={paymentOption === 'pay_full' ? item.price * item.passengers : item.deposit * item.passengers} />
                  </p>
                  <p className="text-white/30 text-[9px] uppercase">{paymentOption === 'pay_full' ? 'full' : 'deposit'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Info (guests only) */}
        {!currentUser && (
          <div className="bg-[#1A241B] rounded-[2rem] border border-white/10 p-8 md:p-10">
            <h3 className="text-2xl font-serif text-[#FAFAF8] flex items-center gap-4 mb-8 pb-6 border-b border-white/5">
              <span className="w-8 h-8 rounded-full bg-[#B8860B] flex items-center justify-center text-black font-bold text-xs">
                <User size={14} />
              </span>
              Contact Details
            </h3>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 flex flex-col gap-2">
                  <label className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-bold ml-1">Full Name</label>
                  <input type="text" value={guestName} onChange={e => setGuestName(e.target.value)} placeholder="John Doe"
                    className="bg-[#131A14] border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#B8860B] transition-colors text-sm" />
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <label className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-bold ml-1">Email</label>
                  <input type="email" value={guestEmail} onChange={e => setGuestEmail(e.target.value)} placeholder="john@example.com"
                    className="bg-[#131A14] border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#B8860B] transition-colors text-sm" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-bold ml-1">WhatsApp / Phone</label>
                <input type="tel" value={guestPhone} onChange={e => setGuestPhone(e.target.value)} placeholder="+233 55 000 0000"
                  className="bg-[#131A14] border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#B8860B] transition-colors text-sm" />
              </div>
            </div>
          </div>
        )}

        {/* Phone for logged-in users */}
        {currentUser && (
          <div className="bg-[#1A241B] rounded-[2rem] border border-white/10 p-8 md:p-10">
            <div className="flex items-center gap-4 mb-6">
              <UserCheck size={20} className="text-[#B8860B]" />
              <span className="text-white font-bold">{guestName || currentUser.email}</span>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-bold ml-1">WhatsApp / Phone</label>
              <input type="tel" value={guestPhone} onChange={e => setGuestPhone(e.target.value)} placeholder="+233 55 000 0000"
                className="bg-[#131A14] border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#B8860B] transition-colors text-sm" />
            </div>
          </div>
        )}

        {/* Payment Option */}
        <div className="bg-[#1A241B] rounded-[2rem] border border-[#B8860B]/40 p-8 md:p-10">
          <h3 className="text-2xl font-serif text-[#FAFAF8] flex items-center gap-4 mb-8 pb-6 border-b border-white/5">
            <span className="w-8 h-8 rounded-full bg-[#B8860B] flex items-center justify-center text-black font-bold text-xs">2</span>
            Payment Option
          </h3>
          <div className="flex flex-col gap-4">
            <div onClick={() => setPaymentOption('pay_deposit')} className={`p-6 rounded-2xl border cursor-pointer transition-all ${paymentOption === 'pay_deposit' ? 'border-[#B8860B] bg-[#B8860B]/5' : 'border-white/10 bg-[#131A14] hover:bg-white/5'}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-white font-bold flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentOption === 'pay_deposit' ? 'border-[#B8860B]' : 'border-white/20'}`}>
                    {paymentOption === 'pay_deposit' && <div className="w-2 h-2 bg-[#E8D3A2] rounded-full" />}
                  </div>
                  Secure Deposits
                </span>
                <span className="text-xl font-serif text-[#E8D3A2]"><Price amount={withFee(items.reduce((s, i) => s + i.deposit * i.passengers, 0))} /></span>
              </div>
              <p className="text-white/40 text-xs ml-7">Lock in all journeys now. Balances due 30 days before each departure.</p>
            </div>
            <div onClick={() => setPaymentOption('pay_full')} className={`p-6 rounded-2xl border cursor-pointer transition-all ${paymentOption === 'pay_full' ? 'border-[#B8860B] bg-[#B8860B]/5' : 'border-white/10 bg-[#131A14] hover:bg-white/5'}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-white font-bold flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentOption === 'pay_full' ? 'border-[#B8860B]' : 'border-white/20'}`}>
                    {paymentOption === 'pay_full' && <div className="w-2 h-2 bg-[#E8D3A2] rounded-full" />}
                  </div>
                  Pay In Full
                </span>
                <span className="text-xl font-serif text-white"><Price amount={withFee(fullTotal)} /></span>
              </div>
              <p className="text-white/40 text-xs ml-7">Pay all journeys upfront. Recommended for streamlined visa applications.</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: Invoice */}
      <div className="w-full lg:w-[400px] shrink-0">
        <div className="sticky top-32">
          <div className="w-full bg-[#1A241B] rounded-[32px] p-8 md:p-10 border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#B8860B] to-transparent opacity-50" />
            <h4 className="text-[#B8860B] text-[10px] font-bold uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
              <CreditCard size={14} /> Combined Invoice
            </h4>

            <div className="flex flex-col gap-3 border-b border-white/5 pb-6 mb-6">
              {items.map(i => (
                <div key={i.tourId} className="flex justify-between items-center text-xs">
                  <span className="text-white/50 line-clamp-1 max-w-[60%]">{i.tourTitle} ×{i.passengers}</span>
                  <span className="text-white"><Price amount={paymentOption === 'pay_full' ? i.price * i.passengers : i.deposit * i.passengers} /></span>
                </div>
              ))}
              <div className="flex justify-between items-center text-xs pt-2 border-t border-white/5">
                <span className="text-white/50">Int. Processing Fee (3.9%)</span>
                <span className="text-[#B8860B] font-mono">+<Price amount={grandTotal - baseTotal} /></span>
              </div>
            </div>

            <div className="flex justify-between items-end mb-8">
              <div>
                <span className="text-white/40 text-[9px] uppercase tracking-widest font-bold block mb-1">Total Authorized</span>
                <span className="text-3xl font-serif text-white"><Price amount={grandTotal} /></span>
              </div>
              <span className="bg-[#B8860B]/10 text-[#E8D3A2] px-3 py-1 rounded-full text-[9px] font-bold uppercase border border-[#B8860B]/20">
                {paymentOption === 'pay_full' ? 'Full' : 'Deposit'}
              </span>
            </div>

            <div className="flex items-start gap-3 mb-6">
              <input type="checkbox" id="agree_cart" checked={agreedToPolicy} onChange={e => setAgreedToPolicy(e.target.checked)}
                className="mt-1 w-4 h-4 bg-black/50 border border-white/20 rounded accent-[#B8860B] flex-shrink-0 cursor-pointer" />
              <label htmlFor="agree_cart" className="text-white/60 text-[10px] leading-relaxed cursor-pointer select-none">
                I agree to the <a href="/refund-policy" target="_blank" className="text-[#E8D3A2] hover:text-white underline">cancellation policy</a> and terms of service.
              </label>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isProcessing || !agreedToPolicy || !guestPhone || (!currentUser && (!guestEmail || !guestName))}
              className="w-full py-5 bg-[#FAFAF8] hover:bg-[#E8D3A2] text-black font-bold uppercase tracking-[0.2em] text-[10px] rounded-2xl flex items-center justify-center gap-3 transition-colors shadow-2xl disabled:opacity-20 disabled:cursor-not-allowed"
            >
              <ShieldCheck size={16} className="text-[#B8860B]" />
              {isProcessing ? 'Initializing...' : `Pay for ${items.length} Journey${items.length > 1 ? 's' : ''}`}
            </button>
            <p className="text-center text-white/30 pt-4 text-[8px] leading-relaxed uppercase tracking-widest font-bold">
              Securely processed by Paystack · PCI-DSS
            </p>
          </div>
        </div>
      </div>
    </div>

    {/* Paystack Iframe Modal */}
    {paystackUrl && (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
        <div className="relative w-full max-w-[480px] rounded-2xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.9)] flex flex-col bg-white" style={{ height: '620px' }}>
          <div className="flex items-center justify-between px-5 py-3 bg-[#131A14] border-b border-white/10 flex-shrink-0">
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-[#B8860B]" />
              <span className="text-white text-[10px] font-bold uppercase tracking-[0.2em]">Secure Checkout · Paystack</span>
            </div>
            <button onClick={() => { setPaystackUrl(null); setIsProcessing(false); }}
              className="p-1.5 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-all">
              <X size={16} />
            </button>
          </div>
          <iframe
            src={paystackUrl}
            className="flex-1 w-full border-0"
            title="Paystack Secure Checkout"
            onLoad={(e) => {
              try {
                const href = (e.currentTarget.contentWindow as Window).location.href;
                // Reading href succeeds only when iframe is on our domain (same-origin).
                // Intercept all same-origin navigations — close modal and take the main window there.
                if (href && href !== 'about:blank') {
                  setPaystackUrl(null);
                  clearCart();
                  window.location.href = href;
                }
              } catch { /* cross-origin — still on Paystack's domain */ }
            }}
          />
        </div>
      </div>
    )}
    </>
  );
}
