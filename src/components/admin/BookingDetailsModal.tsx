// src/components/admin/BookingDetailsModal.tsx
'use client';

import { useState } from 'react';
import { X, Mail, Phone, Calendar, User, CreditCard, Send, Loader2, CheckCircle } from 'lucide-react';
import { resendReceipt } from '@/actions/admin';
import Price from '@/components/Price';

interface BookingDetailsModalProps {
  booking: any;
  onClose: () => void;
}

export default function BookingDetailsModal({ booking, onClose }: BookingDetailsModalProps) {
  const [resending, setResending] = useState(false);
  const [sentStatus, setSentStatus] = useState<'idle' | 'success' | 'error'>('idle');

  if (!booking) return null;

  const handleResendReceipt = async () => {
    setResending(true);
    setSentStatus('idle');
    try {
      const result = await resendReceipt(booking.id);
      if (result.success) {
        setSentStatus('success');
        setTimeout(() => setSentStatus('idle'), 3000);
      } else {
        setSentStatus('error');
      }
    } catch (err) {
      setSentStatus('error');
    }
    setResending(false);
  };

  const travelerName = booking.profiles 
    ? `${booking.profiles.first_name} ${booking.profiles.last_name}`
    : booking.guest_name || 'Guest Traveler';

  const travelerEmail = booking.profiles?.email || booking.guest_email || 'No email provided';
  const travelerPhone = booking.profiles?.phone || booking.guest_phone || 'No phone provided';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" onClick={onClose} />
      
      <div className="bg-[#1A241B] w-full max-w-xl rounded-[2rem] border border-white/10 shadow-3xl overflow-hidden relative z-10 animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh]">
        {/* Header - Reduced padding */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/40 text-left">
          <div className="text-left">
            <h2 className="text-xl font-serif text-white tracking-tight">Booking Resolution</h2>
            <p className="text-[#B8860B] text-[10px] uppercase font-bold tracking-widest mt-1">REF: {booking.paystack_reference}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-all">
            <X size={18} />
          </button>
        </div>

        {/* Content - Reduced padding and gaps | Removed scrollbar */}
        <div className="p-6 overflow-y-auto flex flex-col gap-6 scrollbar-hide text-left" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          
          <div className="flex flex-col gap-3">
             <h3 className="text-white/30 text-[10px] uppercase font-black tracking-[0.2em] flex items-center gap-2">
                <User size={12} /> Traveler Identity
             </h3>
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-white/5 p-4 rounded-xl border border-white/5 shadow-sm text-left">
                    <span className="text-white/40 text-[11px] uppercase tracking-widest font-bold block mb-1.5">Legal Name</span>
                    <span className="text-white text-sm font-serif tracking-wide">{travelerName}</span>
                 </div>
                 <div className="bg-white/5 p-4 rounded-xl border border-white/5 shadow-sm text-left">
                    <span className="text-white/40 text-[11px] uppercase tracking-widest font-bold block mb-1.5">Database ID</span>
                    <span className="text-white/50 text-[11px] font-mono truncate block">{booking.id.split('-')[0]}</span>
                 </div>
                 <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col justify-center shadow-sm text-left">
                    <div className="flex items-center gap-3">
                       <Mail size={14} className="text-[#B8860B]" />
                       <span className="text-white/70 text-sm font-medium truncate">{travelerEmail}</span>
                    </div>
                 </div>
                 <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col justify-center shadow-sm text-left">
                    <div className="flex items-center gap-3">
                       <Phone size={14} className="text-[#B8860B]" />
                       <span className="text-white/70 text-sm font-medium truncate">{travelerPhone}</span>
                    </div>
                 </div>
              </div>
          </div>

          <div className="flex flex-col gap-3 text-left">
             <h3 className="text-white/30 text-[10px] uppercase font-black tracking-[0.2em] flex items-center gap-2">
                <Calendar size={12} /> Experience Parameters
             </h3>
             <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col gap-3 text-left">
                <div className="text-left">
                   <p className="text-white font-serif text-lg leading-tight">{booking.tours?.title || 'Tour Package'}</p>
                </div>
                <div className="flex justify-between border-t border-white/10 pt-4 mt-1">
                   <div className="text-left">
                      <span className="text-white/40 text-[11px] uppercase tracking-widest font-bold">Manifest Date</span>
                      <p className="text-white/80 text-sm mt-1">{booking.travel_dates || 'To Be Confirmed'}</p>
                   </div>
                   <div className="text-right">
                      <span className="text-white/40 text-[11px] uppercase tracking-widest font-bold">Travelers</span>
                      <p className="text-white/80 text-sm mt-1">{booking.travelers_count} Person(s)</p>
                   </div>
                </div>
             </div>
          </div>

          <div className="flex flex-col gap-3 text-left">
             <h3 className="text-white/30 text-[10px] uppercase font-black tracking-[0.2em] flex items-center gap-2">
                <CreditCard size={12} /> Financial Ledger
             </h3>
             <div className="bg-white/5 rounded-xl border border-white/5 overflow-hidden text-left">
                <div className="p-4 grid grid-cols-2 gap-4 border-b border-white/10 bg-white/[0.03]">
                   <div className="text-left">
                      <span className="text-white/40 text-[11px] uppercase tracking-widest font-bold">Transaction</span>
                      <Price amount={booking.total_price} className="text-[#B8860B] font-mono font-bold text-lg mt-1 block" />
                   </div>
                   <div className="text-left">
                      <span className="text-white/40 text-[11px] uppercase tracking-widest font-bold">Captured</span>
                      <Price amount={booking.amount_paid} className="text-white font-mono font-bold text-lg mt-1 block" />
                   </div>
                </div>
                <div className="p-4 grid grid-cols-2 gap-4">
                   <div className="text-left">
                      <span className="text-white/40 text-[11px] uppercase tracking-widest font-bold">Logic: {booking.booking_status}</span>
                   </div>
                   <div className="text-right">
                      <span className="text-white/40 text-[11px] uppercase tracking-widest font-bold">Ledger: {booking.payment_status}</span>
                   </div>
                </div>
             </div>
          </div>

        </div>

        {/* Footer - Reduced padding */}
        <div className="p-6 border-t border-white/5 bg-black/40 flex flex-col gap-3 text-left">
          {sentStatus === 'error' && (
             <p className="text-red-400 text-[11px] text-center font-mono uppercase tracking-widest animate-pulse">Email Pipeline Rejection: Check Resend Domain Policy</p>
          )}
          <button 
             onClick={handleResendReceipt}
             disabled={resending || sentStatus === 'success'}
             className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold uppercase tracking-[0.2em] text-[11px] transition-all ${
               sentStatus === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 
               sentStatus === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.1)]' :
               'bg-[#B88600] hover:bg-[#D4AF37] text-black shadow-[0_10px_30px_rgba(184,134,11,0.2)] cursor-pointer'
             }`}
          >
            {resending ? (
               <><Loader2 size={14} className="animate-spin" /> Dispatching...</>
            ) : sentStatus === 'success' ? (
               <><CheckCircle size={14} /> Itinerary Resent</>
            ) : (
               <><Send size={14} /> Dispatch Itinerary Receipt</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
