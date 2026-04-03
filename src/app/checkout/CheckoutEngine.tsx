'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Calendar, CreditCard, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import Price from '@/components/Price';

export default function CheckoutEngine({ tour, currentUser }: { tour: any, currentUser: any }) {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Checkout Form State natively tied to DB booking table expectations
  const [passengers, setPassengers] = useState(1);
  const [travelDate, setTravelDate] = useState('');
  const [paymentOption, setPaymentOption] = useState<'pay_deposit' | 'pay_full'>('pay_deposit');
  
  // Explicit Ghost Account mapping if standard session isn't found
  const [guestEmail, setGuestEmail] = useState(currentUser?.email || '');
  const [guestName, setGuestName] = useState(currentUser?.user_metadata?.full_name || '');
  const [guestPhone, setGuestPhone] = useState(currentUser?.user_metadata?.phone || '');

  const totalFullPrice = tour.price * passengers;
  const totalDeposit = tour.deposit * passengers;
  const baseTotal = paymentOption === 'pay_full' ? totalFullPrice : totalDeposit;
  
  // Paystack International USD Fee (3.9%)
  const internationalFee = 0.039;
  const grandTotal = Math.round((baseTotal / (1 - internationalFee)) * 100) / 100;

  const resolveFullName = () => {
    if (currentUser?.user_metadata?.full_name) return currentUser.user_metadata.full_name;
    if (currentUser?.user_metadata?.first_name) {
       return `${currentUser.user_metadata.first_name} ${currentUser.user_metadata.last_name || ''}`.trim();
    }
    return '';
  };

  const handleCheckoutInit = async () => {
    setIsProcessing(true);
    
    // Aggressively pinging our /api/paystack/initialize endpoint
    try {
      const resp = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
           tourId: tour.id,
           tourName: tour.title || tour.name,
           paymentOption,
           travelDate,
           passengers,
           totalAmount: grandTotal,
           totalFullPrice,
           tourValuePaid: baseTotal,
           guestEmail,
           guestName: guestName || resolveFullName() || 'Valued Traveler',
           guestPhone,
           userId: currentUser?.id
        })
      });

      const { authorization_url } = await resp.json();
      
      if (authorization_url) {
        // Redirect directly to Paystack Secure Portal
        window.location.href = authorization_url;
      } else {
        alert("Failed to initialize payment gateway.");
        setIsProcessing(false);
      }
    } catch (err) {
      console.error(err);
      alert("System error communicating with Paystack.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-16 items-start relative z-10">
      
      {/* LEFT COLUMN: MULTI-STEP FORM */}
      <div className="flex flex-col gap-12">
        
        {/* Step 1: Traveler Details */}
        <div className={`p-8 md:p-12 rounded-[2rem] border transition-all duration-500 ${step >= 1 ? 'bg-[#1A241B] border-white/10 shadow-2xl' : 'bg-[#131A14] border-white/5 opacity-50'}`}>
           <div className="flex items-center justify-between mb-8 pb-8 border-b border-white/5">
             <h3 className="text-2xl font-serif text-[#FAFAF8] flex items-center gap-4">
                <span className="w-8 h-8 rounded-full bg-[#B8860B] flex items-center justify-center text-black font-bold text-xs">1</span>
                Passenger Information
             </h3>
             {step > 1 && (
               <button onClick={() => setStep(1)} className="text-[#E8D3A2] text-[10px] uppercase font-bold tracking-widest hover:text-white transition-colors">Edit</button>
             )}
           </div>

           {step === 1 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
                
                {!currentUser && (
                  <div className="flex flex-col gap-6 mb-4">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-1 flex flex-col gap-3">
                        <label className="text-white/40 uppercase tracking-[0.2em] text-[10px] font-bold ml-2">Full Name</label>
                        <input 
                          type="text" 
                          value={guestName} 
                          onChange={(e) => setGuestName(e.target.value)}
                          placeholder="John Doe" 
                          className="w-full bg-[#131A14] border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#B8860B] transition-colors" 
                        />
                      </div>
                      <div className="flex-1 flex flex-col gap-3">
                        <label className="text-white/40 uppercase tracking-[0.2em] text-[10px] font-bold ml-2">Email Address</label>
                        <input 
                          type="email" 
                          value={guestEmail} 
                          onChange={(e) => setGuestEmail(e.target.value)}
                          placeholder="john@example.com" 
                          className="w-full bg-[#131A14] border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#B8860B] transition-colors" 
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1 flex flex-col gap-3">
                    <label className="text-white/40 uppercase tracking-[0.2em] text-[10px] font-bold ml-2">Arrival Date</label>
                    <div className="relative">
                       <Calendar size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/30" />
                       <input 
                         type="date" 
                         value={travelDate}
                         onChange={(e) => setTravelDate(e.target.value)}
                         className="w-full bg-[#131A14] border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white focus:outline-none focus:border-[#B8860B] transition-colors [color-scheme:dark]" 
                       />
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col gap-3">
                    <label className="text-white/40 uppercase tracking-[0.2em] text-[10px] font-bold ml-2">Total Passengers</label>
                    <div className="relative">
                       <User size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/30" />
                       <select 
                         value={passengers}
                         onChange={(e) => setPassengers(Number(e.target.value))}
                         className="w-full bg-[#131A14] border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white focus:outline-none focus:border-[#B8860B] transition-colors appearance-none cursor-pointer"
                       >
                         {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>)}
                       </select>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 mt-2">
                    <label className="text-white/40 uppercase tracking-[0.2em] text-[10px] font-bold ml-2">WhatsApp / Contact Number (Required)</label>
                    <input 
                       type="tel" 
                       value={guestPhone} 
                       onChange={(e) => setGuestPhone(e.target.value)}
                       placeholder="+233 55 000 0000" 
                       className="w-full bg-[#131A14] border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#B8860B] transition-colors" 
                    />
                </div>

                <div className="mt-8 flex justify-end">
                   <button 
                     disabled={!travelDate || !guestPhone || (!currentUser && (!guestEmail || !guestName))}
                     onClick={() => setStep(2)}
                     className="bg-[#E8D3A2] text-[#131A14] px-10 py-4 rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-white transition-colors disabled:opacity-30 flex items-center gap-3"
                   >
                     Continue To Payment <ArrowRight size={14} />
                   </button>
                </div>
              </motion.div>
           ) : (
              <div className="flex items-center gap-4 text-white/60">
                <UserCheck size={20} className="text-[#B8860B]" />
                <span className="text-sm">Passenger Details Confirmed</span>
              </div>
           )}
        </div>

        {/* Step 2: Payment Plan Initialization */}
        <div className={`p-8 md:p-12 rounded-[2rem] border transition-all duration-500 ${step === 2 ? 'bg-[#1A241B] border-[#B8860B]/40 shadow-[0_0_40px_rgba(184,134,11,0.1)]' : 'bg-[#131A14] border-white/5 opacity-50'}`}>
           <div className="flex items-center justify-between mb-8 pb-8 border-b border-white/5">
             <h3 className="text-2xl font-serif text-[#FAFAF8] flex items-center gap-4">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step === 2 ? 'bg-[#B8860B] text-black' : 'bg-white/10 text-white/50'}`}>2</span>
                Payment Milestones
             </h3>
           </div>

           {step === 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
                 
                 {/* Secure Deposit Tier */}
                 <div 
                   onClick={() => setPaymentOption('pay_deposit')}
                   className={`p-6 md:p-8 rounded-2xl border cursor-pointer transition-all ${paymentOption === 'pay_deposit' ? 'border-[#B8860B] bg-[#B8860B]/5' : 'border-white/10 bg-[#131A14] hover:bg-white/5'}`}
                 >
                    <div className="flex items-center justify-between mb-2">
                       <span className="text-white font-bold text-lg flex items-center gap-3">
                         <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentOption === 'pay_deposit' ? 'border-[#B8860B]' : 'border-white/20'}`}>
                            {paymentOption === 'pay_deposit' && <div className="w-2 h-2 bg-[#E8D3A2] rounded-full" />}
                         </div>
                         Secure Deposit
                       </span>
                       <span className="text-2xl font-serif text-[#E8D3A2]"><Price amount={totalDeposit} /></span>
                    </div>
                    <p className="text-white/50 text-xs leading-relaxed ml-7">Lock in your dates immediately. The remaining balance of <Price amount={totalFullPrice - totalDeposit} /> will be automatically processed 30 days prior to your arrival.</p>
                 </div>

                 {/* Full Payment Tier */}
                 <div 
                   onClick={() => setPaymentOption('pay_full')}
                   className={`p-6 md:p-8 rounded-2xl border cursor-pointer transition-all ${paymentOption === 'pay_full' ? 'border-[#B8860B] bg-[#B8860B]/5' : 'border-white/10 bg-[#131A14] hover:bg-white/5'}`}
                 >
                    <div className="flex items-center justify-between mb-2">
                       <span className="text-white font-bold text-lg flex items-center gap-3">
                         <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentOption === 'pay_full' ? 'border-[#B8860B]' : 'border-white/20'}`}>
                            {paymentOption === 'pay_full' && <div className="w-2 h-2 bg-[#E8D3A2] rounded-full" />}
                         </div>
                         Pay In Full
                       </span>
                       <span className="text-2xl font-serif text-white"><Price amount={totalFullPrice} /></span>
                    </div>
                    <p className="text-white/50 text-xs leading-relaxed ml-7">Settle the complete balance upfront. Recommended for streamlined visa applications and fixed budgeting.</p>
                 </div>

              </motion.div>
           )}
        </div>

      </div>


      {/* RIGHT COLUMN: STICKY INVOICE */}
      <div className="w-full lg:w-[400px] shrink-0">
        <div className="sticky top-32 flex flex-col gap-6">
          
          <div className="w-full bg-[#1A241B] rounded-[32px] p-8 md:p-10 border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#B8860B] to-transparent opacity-50" />
            
            <h4 className="text-[#B8860B] text-[10px] font-bold uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
               <CreditCard size={14} /> Official Invoice
            </h4>

            <div className="flex flex-col gap-4 border-b border-white/5 pb-6 mb-6">
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/60">Base Journey ({tour.duration_days})</span>
                <span className="text-white"><Price amount={tour.price} /></span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/60">Total Travelers</span>
                <span className="text-white">x{passengers}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/60">Int. Processing Fee (3.9%)</span>
                <span className="text-[#B8860B] font-mono">+<Price amount={grandTotal - baseTotal} /></span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/60">Taxes & Logistics</span>
                <span className="text-white font-mono opacity-50">Included</span>
              </div>
            </div>

            <div className="flex justify-between items-end mb-10">
               <div className="flex flex-col">
                 <span className="text-white/40 text-[9px] uppercase tracking-widest font-bold mb-1">Total Authorized</span>
                 <span className="text-3xl font-serif text-white"><Price amount={grandTotal} /></span>
               </div>
               <span className="bg-[#B8860B]/10 text-[#E8D3A2] px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border border-[#B8860B]/20">
                 {paymentOption === 'pay_full' ? 'Full' : 'Deposit'}
               </span>
            </div>

            <button 
              onClick={handleCheckoutInit}
              disabled={step !== 2 || isProcessing}
              className="w-full relative overflow-hidden group py-5 bg-[#FAFAF8] hover:bg-[#E8D3A2] text-black font-bold uppercase tracking-[0.2em] text-[10px] rounded-2xl flex items-center justify-center gap-3 transition-colors shadow-2xl disabled:opacity-20 disabled:cursor-not-allowed"
            >
              <span className="relative z-10">{isProcessing ? 'Initializing Secure Engine...' : 'Authorize via Paystack'}</span>
              {!isProcessing && step === 2 && <ShieldCheck size={16} className="relative z-10 text-[#B8860B]" strokeWidth={2.5} />}
            </button>
            <p className="text-center text-white/30 pt-5 text-[8px] leading-relaxed uppercase tracking-widest font-bold">
              Securely processed by Paystack<br/>PCI-DSS Compliant Execution
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
