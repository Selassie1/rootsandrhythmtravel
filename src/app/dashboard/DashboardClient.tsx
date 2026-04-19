// src/app/dashboard/DashboardClient.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { LogOut, Map, Compass, User as UserIcon, CalendarDays, Ticket, BookOpen, ExternalLink, CreditCard, Loader2, Save, CheckCircle2 } from 'lucide-react';
import { updateAdminProfile } from '@/actions/admin'; // Reusing the same action for profiles
import Price from '@/components/Price';

export default function DashboardClient({ user, profile, bookings, recentTours = [] }: { user: any, profile: any, bookings: any[], recentTours?: any[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  
  // Sync tab with URL
  const currentTab = searchParams.get('tab') || 'upcoming';
  const setTab = (newTab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', newTab);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const metaFullName = user?.user_metadata?.full_name;
  const metaFirst = user?.user_metadata?.first_name;
  const metaLast = user?.user_metadata?.last_name;

  const firstName = profile?.first_name || metaFirst || (metaFullName ? metaFullName.split(' ')[0] : 'Traveler');
  const lastName = profile?.last_name || metaLast || (metaFullName ? metaFullName.split(' ').slice(1).join(' ') : '');

  const initiateBalancePayment = async (booking: any) => {
    setIsProcessing(booking.id);
    try {
      // Remaining tour cost (both total_price and amount_paid are stored without fees)
      const remainingTourCost = Number(booking.total_price || 0) - Number(booking.amount_paid || 0);
      // Apply 3.9% Paystack international fee for what we charge the customer
      const internationalFee = 0.039;
      const grandTotal = Math.round((remainingTourCost / (1 - internationalFee)) * 100) / 100;

      if (isNaN(grandTotal) || grandTotal <= 0) {
        alert("Unable to calculate valid balance. Please contact support.");
        console.error("Invalid balance calculation:", { remainingTourCost, grandTotal });
        return;
      }

      console.log("Initiating Balance Settlement for:", { bookingId: booking.id, tourBalance: remainingTourCost, chargeAmount: grandTotal });

      const resp = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
           bookingId: booking.id,
           tourId: booking.tour_id,
           tourName: booking.tours?.title || 'Tour Balance',
           paymentOption: 'pay_balance',
           travelDate: booking.travel_dates,
           passengers: booking.travelers_count,
           totalAmount: grandTotal,
           totalFullPrice: booking.total_price,
           tourValuePaid: remainingTourCost,
           guestEmail: user.email,
           guestName: `${firstName} ${lastName}`,
           guestPhone: profile?.phone || user.user_metadata?.phone || '',
           userId: user.id
        })
      });

      const data = await resp.json();
      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        alert("Payment initialization failed: " + (data.error || "Internal Server Error"));
        console.error("Paystack Error:", data);
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to payment gateway.");
    } finally {
      setIsProcessing(null);
    }
  };

  return (
    <>
      <div className="hidden md:flex w-full max-w-[1700px] mx-auto px-4 md:px-8 xl:px-16 relative z-30 -mt-20 lg:-mt-24 mb-10 fade-in flex-col items-end text-right">
        <h2 className="text-xl lg:text-2xl font-serif font-light text-white/70 mb-1 transition-all duration-300">
          {currentTab === 'history' ? 'Journey History' : currentTab === 'settings' ? 'Personal Profile' : currentTab === 'resources' ? 'Resource Vault' : 'Upcoming Itineraries'}
        </h2>
        <p className="text-[#E8D3A2]/80 text-[10px] uppercase font-medium tracking-[0.2em] transition-all duration-300 max-w-[320px]">
          {currentTab === 'history' ? 'View your completed trips and past experiences' : currentTab === 'settings' ? 'Manage your account and profile settings' : currentTab === 'resources' ? 'Essential documents and guides for your travels' : 'Your upcoming journeys and active bookings'}
        </p>
      </div>

      <div className="flex-1 w-full max-w-[1700px] mx-auto px-4 md:px-8 xl:px-16 flex flex-col xl:flex-row gap-8 xl:gap-12 relative z-20 pb-20">
        
        <div className="w-full xl:w-64 flex flex-col gap-6 shrink-0 xl:sticky xl:top-8 h-max z-30 order-2 xl:order-1">
          <div className="hidden md:flex bg-[#1A241B] rounded-2xl p-4 border border-white/5 flex-col gap-2 shadow-2xl">
            <button onClick={() => setTab('upcoming')} className={`flex justify-start items-center gap-4 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-[0.1em] transition-colors ${currentTab === 'upcoming' ? 'bg-[#B8860B] text-[#1A241B]' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}>
              <Map size={18} /> Upcoming
            </button>
            <button onClick={() => setTab('history')} className={`flex justify-start items-center gap-4 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-[0.1em] transition-colors ${currentTab === 'history' ? 'bg-[#B8860B] text-[#1A241B]' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}>
              <Ticket size={18} /> History
            </button>
            <button onClick={() => setTab('settings')} className={`flex justify-start items-center gap-4 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-[0.1em] transition-colors ${currentTab === 'settings' ? 'bg-[#B8860B] text-[#1A241B]' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}>
              <UserIcon size={18} /> Settings
            </button>
            <button onClick={() => setTab('resources')} className={`flex justify-start items-center gap-4 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-[0.1em] transition-colors ${currentTab === 'resources' ? 'bg-[#B8860B] text-[#1A241B]' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}>
              <BookOpen size={18} /> Resources
            </button>
          </div>

          <div className="bg-[#1A241B] rounded-[2rem] p-6 border border-white/5 shadow-2xl flex flex-col gap-4 order-last xl:order-none">
             <h4 className="text-white font-serif font-light text-xl mb-1">Your Concierge</h4>
             <p className="text-white/50 text-xs leading-relaxed mb-1 font-light">Connect with our luxury travel experts for immediate assistance.</p>
             <button className="w-full bg-[#1A241B] border border-[#25D366]/50 text-[#25D366] font-bold uppercase tracking-[0.2em] text-[10px] py-4 rounded-full transition-all hover:bg-[#25D366] hover:text-white flex items-center justify-center gap-2 group">
                <span className="group-hover:scale-105 transition-transform">WhatsApp Chat</span>
             </button>
             <button className="w-full bg-[#B8860B] text-black font-bold uppercase tracking-[0.2em] text-[10px] py-4 rounded-full transition-transform hover:scale-105 mt-2">
                Custom Itinerary
             </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-8 min-w-0 fade-in order-1 xl:order-2">
          
          {currentTab === 'upcoming' && (
             <>
               {(!bookings || bookings.filter(b => b.booking_status !== 'COMPLETED' && b.booking_status !== 'CANCELLED').length === 0) && (
                 <div className="w-full bg-[#1A241B] border border-dashed border-white/10 rounded-[32px] p-10 md:p-16 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden group mb-6">
                   <div className="absolute inset-0 bg-[#B8860B]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                   <div className="w-20 h-20 rounded-full bg-black/40 border border-white/5 flex items-center justify-center mb-6 shadow-inner">
                      <Compass size={32} strokeWidth={1} className="text-white/40" />
                   </div>
                   <h3 className="text-2xl font-serif font-light text-white/90 mb-3">No active bookings found.</h3>
                   <p className="text-white/40 text-sm max-w-sm mb-8 leading-relaxed font-light">You haven't booked a trip yet. Explore our curated experiences to start your journey today.</p>
                   <Link href="/tours" className="px-8 py-4 bg-[#B8860B] hover:bg-[#E8D3A2] text-black font-medium uppercase tracking-[0.2em] text-[10px] rounded-full transition-all shadow-[0_10px_30_rgba(184,134,11,0.3)] hover:shadow-[0_10px_40px_rgba(184,134,11,0.5)]">Explore Journeys</Link>
                 </div>
               )}

                  <div className="flex flex-col gap-6">
                    {bookings?.filter(b => b.booking_status !== 'COMPLETED' && b.booking_status !== 'CANCELLED').map((booking: any) => (
                       <div key={booking.id} className="w-full bg-[#1A241B] border border-[#B8860B]/30 rounded-[2rem] p-6 md:p-8 flex flex-col lg:flex-row gap-6 md:gap-8 justify-between shadow-2xl relative overflow-hidden group hover:border-[#B8860B] transition-colors">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#B8860B]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          
                          <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-3">
                               <span className={`px-2 md:px-3 py-1 rounded-full text-[8px] md:text-[9px] uppercase font-bold tracking-widest ${booking.payment_status === 'DEPOSIT_PAID' ? 'bg-[#B8860B]/20 text-[#E8D3A2] border border-[#B8860B]/30' : 'bg-green-500/10 text-green-400 border border-green-500/20'}`}>
                                 {booking.payment_status.replace('_', ' ')}
                               </span>
                               <span className="text-white/40 text-[9px] md:text-[10px] font-mono tracking-widest truncate max-w-[120px] md:max-w-none">REF: {booking.paystack_reference}</span>
                            </div>
                            <h3 className="text-xl md:text-3xl font-serif font-light text-white/90 leading-tight">{booking.tours?.title || booking.tour_name}</h3>
                            <div className="grid grid-cols-2 lg:flex lg:flex-wrap gap-x-8 gap-y-4">
                              <div className="flex flex-col">
                                 <span className="text-white/40 text-[9px] uppercase tracking-[0.2em] font-medium mb-1">Arrival</span>
                                 <span className="text-white/90 text-xs md:text-sm font-light">{booking.travel_dates || 'To Be Confirmed'}</span>
                              </div>
                              <div className="flex flex-col">
                                 <span className="text-white/40 text-[9px] uppercase tracking-[0.2em] font-medium mb-1">Travelers</span>
                                 <span className="text-white/90 text-xs md:text-sm font-light">{booking.travelers_count} Guest(s)</span>
                              </div>
                              <div className="flex flex-col col-span-2 lg:col-auto">
                                 <span className="text-white/40 text-[9px] uppercase tracking-[0.2em] font-medium mb-1">Total amount</span>
                                 <Price amount={booking.total_price} className="text-[#E8D3A2] text-sm md:text-base font-bold font-serif" />
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col justify-end items-start lg:items-end gap-3 shrink-0 relative z-10">
                             <div className="flex flex-col items-start lg:items-end mb-2">
                                <span className="text-white/40 text-[9px] uppercase tracking-widest font-bold mb-1">Paid to Date</span>
                                <Price amount={booking.amount_paid} className="text-2xl text-white/90 font-serif font-light" />
                             </div>
                             
                             <div className="flex flex-col sm:flex-row lg:flex-row items-center gap-3 w-full lg:w-auto">
                               <Link 
                                 href={booking.id === 'demo-1' ? '/tours' : `/checkout/verify?reference=${booking.paystack_reference}`} 
                                 className="w-full sm:w-auto px-6 py-3 border border-white/10 text-white/80 hover:bg-white hover:text-black rounded-full text-[10px] uppercase font-bold tracking-[0.2em] transition-all bg-black/20 text-center"
                               >
                                 Receipt
                               </Link>
                               {booking.payment_status === 'DEPOSIT_PAID' && (
                                 <button 
                                   onClick={() => initiateBalancePayment(booking)}
                                   disabled={isProcessing === booking.id}
                                   className="w-full sm:w-auto px-8 py-3 bg-[#B8860B] hover:bg-[#D4AF37] text-black rounded-full text-[10px] uppercase font-bold tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-xl"
                                 >
                                   {isProcessing === booking.id ? <Loader2 size={12} className="animate-spin" /> : 'Complete Payment'}
                                 </button>
                               )}
                             </div>
                          </div>
                       </div>
                    ))}
                  </div>

               <div className="mt-8 flex flex-col gap-6 w-full">
                   <div className="flex items-end justify-between border-b border-white/5 pb-4">
                      <div>
                        <h3 className="text-2xl font-serif font-light text-white/90">Curated For You</h3>
                        <p className="text-white/40 text-[10px] uppercase font-medium tracking-widest mt-1">Exclusive access to signature experiences</p>
                      </div>
                      <Link href="/tours" className="text-[#B8860B] text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors">View Directory</Link>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 w-full">
                       {recentTours.map((tour: any) => (
                         <Link key={tour.id} href={`/tours/${tour.slug}`} className="group rounded-3xl overflow-hidden relative h-72 border border-white/5 shadow-2xl block bg-black">
                            {tour.hero_image_url && (
                              <Image src={tour.hero_image_url} alt={tour.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-60 group-hover:opacity-100" />
                            )}
                             <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D0A] via-[#0A0D0A]/40 to-transparent" />
                             <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full z-10 text-left">
                                <span className="text-[#B8860B] text-[8px] md:text-[9px] font-bold uppercase tracking-widest block mb-1 drop-shadow-lg">Curated Tour</span>
                                <h4 className="text-lg md:text-2xl font-serif font-light text-white/90 line-clamp-1 mb-1">{tour.title}</h4>
                                <div className="flex items-center gap-3 text-white/40 text-[8px] md:text-[9px] font-medium tracking-[0.2em] uppercase">
                                  <span>{tour.duration_days} Days</span>
                                  <span className="w-1 h-1 bg-white/20 rounded-full" />
                                  <span>{tour.location}</span>
                                </div>
                             </div>
                         </Link>
                       ))}
                   </div>
               </div>
             </>
          )}

          {currentTab === 'history' && (
             <div className="w-full flex flex-col gap-6">
                 <div className="flex flex-col gap-6">
                   {bookings?.filter(b => b.booking_status === 'COMPLETED' || b.booking_status === 'CANCELLED').length > 0 ? (
                     bookings.filter(b => b.booking_status === 'COMPLETED' || b.booking_status === 'CANCELLED').map((booking: any) => (
                       <div key={booking.id} className="w-full bg-[#1A241B] border border-white/5 rounded-[2rem] p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 justify-between shadow-xl relative overflow-hidden group hover:border-[#B8860B]/30 transition-colors opacity-80">
                          <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-3">
                               <span className="px-2 md:px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 text-[8px] md:text-[9px] uppercase font-bold tracking-widest">Reservation Status: {booking.booking_status}</span>
                               <span className="text-white/30 text-[9px] md:text-[10px] font-mono tracking-widest truncate max-w-[120px] md:max-w-none">REF: {booking.paystack_reference}</span>
                            </div>
                            <h3 className="text-xl md:text-2xl font-serif font-light text-white/70 leading-tight">{booking.tours?.title || booking.tour_name}</h3>
                            <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-2">
                               <div className="flex flex-col">
                                  <span className="text-white/30 text-[9px] uppercase tracking-[0.2em] font-medium mb-1">Traveled</span>
                                  <span className="text-white/60 text-xs md:text-sm font-light">{booking.travel_dates || 'Past Date'}</span>
                               </div>
                               <div className="flex flex-col">
                                  <span className="text-white/30 text-[9px] uppercase tracking-[0.2em] font-medium mb-1">Travelers</span>
                                  <span className="text-white/60 text-xs md:text-sm font-light">{booking.travelers_count} Guest(s)</span>
                               </div>
                            </div>
                          </div>
                          <div className="flex flex-col justify-center items-start md:items-end gap-2 shrink-0">
                             <Link href={`/tours/${booking.tours?.slug || 'directory'}`} className="px-6 py-3 border border-white/10 text-white/50 hover:bg-white/10 hover:text-white rounded-full text-[10px] uppercase font-bold tracking-[0.2em] transition-all bg-transparent">Book Again</Link>
                          </div>
                       </div>
                     ))
                   ) : (
                     <div className="py-20 text-center border border-dashed border-white/10 rounded-[2rem]">
                        <p className="text-white/40 text-sm font-light uppercase tracking-widest">No previous journeys recorded.</p>
                     </div>
                   )}
                 </div>
             </div>
          )}


          {currentTab === 'settings' && <SettingsPane profile={profile} firstName={firstName} lastName={lastName} user={user} />}

          {currentTab === 'resources' && (
             <div className="bg-[#1A241B] border border-white/5 rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#B8860B]/10 to-transparent opacity-50" />
                 <h3 className="text-3xl font-serif font-light text-white/90 mb-2 relative z-10">Travel Protocol Vault</h3>
                 <p className="text-white/40 text-sm mb-12 max-w-xl relative z-10 leading-relaxed text-[10px] font-medium uppercase tracking-[0.2em]">Exhaustive intelligence accelerating your entry and integration into West Africa.</p>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                    <Link href="/documents/Ghana-Visa-Protocol.pdf" target="_blank" className="bg-[#131A14] hover:bg-white/5 transition-colors border border-white/5 rounded-2xl p-8 flex flex-col gap-6 group/card">
                       <div className="w-14 h-14 rounded-2xl bg-[#B8860B]/5 flex items-center justify-center border border-[#B8860B]/10 group-hover/card:border-[#B8860B]/30 mb-auto transition-colors"><BookOpen size={24} strokeWidth={1.5} className="text-[#B8860B]" /></div>
                       <h4 className="text-white font-serif font-light text-xl mt-4">Ghana Visa <br/>Standard Operating</h4>
                       <span className="text-[#E8D3A2] text-[9px] font-medium uppercase tracking-[0.2em] border border-[#E8D3A2]/20 rounded-full px-4 py-1.5 self-start">Official PDF</span>
                    </Link>
                    <Link href="/documents/Luggage-Protocol.pdf" target="_blank" className="bg-[#131A14] hover:bg-white/5 transition-colors border border-white/5 rounded-2xl p-8 flex flex-col gap-6 group/card">
                       <div className="w-14 h-14 rounded-2xl bg-[#B8860B]/5 flex items-center justify-center border border-[#B8860B]/10 group-hover/card:border-[#B8860B]/30 mb-auto transition-colors"><Compass size={24} strokeWidth={1.5} className="text-[#B8860B]" /></div>
                       <h4 className="text-white font-serif font-light text-xl mt-4">Recommended <br/>Packing Strategy</h4>
                       <span className="text-[#E8D3A2] text-[9px] font-medium uppercase tracking-[0.2em] border border-[#E8D3A2]/20 rounded-full px-4 py-1.5 self-start">Official PDF</span>
                    </Link>
                    <Link href="/documents/Cultural-Protocol.pdf" target="_blank" className="bg-[#131A14] hover:bg-white/5 transition-colors border border-white/5 rounded-2xl p-8 flex flex-col gap-6 group/card">
                       <div className="w-14 h-14 rounded-2xl bg-[#E63931]/5 flex items-center justify-center border border-[#E63931]/10 group-hover/card:border-[#E63931]/30 mb-auto transition-colors"><ExternalLink size={24} strokeWidth={1.5} className="text-[#E63931]" /></div>
                       <h4 className="text-white font-serif font-light text-xl mt-4">Cultural Etiquette <br/>Deep Dive</h4>
                       <span className="text-[#E63931] text-[9px] font-medium uppercase tracking-[0.2em] border border-[#E63931]/20 rounded-full px-4 py-1.5 self-start">Exclusive</span>
                    </Link>
                 </div>
             </div>
          )}
        </div>
      </div>
    </>
  );
}

function SettingsPane({ profile, firstName, lastName, user }: { profile: any, firstName: string, lastName: string, user: any }) {
  const [phone, setPhone] = useState(profile?.phone || user.user_metadata?.phone || '');
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateAdminProfile({ 
        first_name: firstName,
        last_name: lastName,
        phone: phone 
      });
      setDone(true);
      setTimeout(() => setDone(false), 3000);
    } catch (e) {
      alert("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-[#1A241B] border border-white/5 rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden text-left fade-in">
        <h3 className="text-3xl font-serif font-light text-white/90 mb-2">Personal Profile</h3>
        <p className="text-white/40 text-[10px] font-medium uppercase tracking-widest mb-10">Manage your personal information.</p>
        <div className="flex flex-col border-t border-white/5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between py-6 border-b border-white/5 gap-4">
                <div className="flex flex-col gap-1 w-full lg:w-1/3">
                    <span className="text-white font-serif font-light text-base md:text-xl">Legal Name</span>
                    <span className="text-white/40 text-[9px] uppercase font-bold tracking-widest">Matches travel passport</span>
                </div>
                <div className="flex-1 flex justify-start lg:justify-end">
                    <div className="bg-[#131A14] w-full lg:w-auto px-6 py-4 rounded-xl border border-white/5 text-white/90 font-light text-sm min-w-[250px] opacity-60 cursor-not-allowed uppercase tracking-widest text-[10px] font-bold">{firstName} {lastName}</div>
                </div>
            </div>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between py-6 border-b border-white/5 gap-4">
                <div className="flex flex-col gap-1 w-full lg:w-1/3">
                    <span className="text-white font-serif font-light text-base md:text-xl">Email Address</span>
                    <span className="text-white/40 text-[9px] uppercase font-bold tracking-widest">Primary communications</span>
                </div>
                <div className="flex-1 flex justify-start lg:justify-end">
                    <div className="bg-[#131A14] w-full lg:w-auto px-6 py-4 rounded-xl border border-white/5 text-white/90 font-light text-sm min-w-[250px] opacity-60 cursor-not-allowed lowecase font-mono">{user.email}</div>
                </div>
            </div>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between py-6 border-b border-white/5 gap-4">
                <div className="flex flex-col gap-1 w-full lg:w-1/3">
                    <span className="text-white font-serif font-light text-base md:text-xl">Phone Number</span>
                    <span className="text-white/40 text-[9px] uppercase font-bold tracking-widest">WhatsApp & Voice Contact</span>
                </div>
                <div className="flex-1 flex justify-start lg:justify-end relative group">
                    <input 
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="bg-[#131A14] w-full lg:w-auto px-6 py-4 rounded-xl border border-white/10 text-[#E8D3A2] font-mono font-light text-sm tracking-widest outline-none focus:border-[#B8860B] transition-all min-w-[250px]"
                      placeholder="e.g. +233..."
                    />
                    <button 
                      onClick={handleSave}
                      disabled={saving}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-[#B8860B]/10 hover:bg-[#B8860B] text-[#B8860B] hover:text-black rounded-lg transition-all border border-[#B8860B]/20 disabled:opacity-50"
                    >
                      {saving ? <Loader2 size={16} className="animate-spin" /> : done ? <CheckCircle2 size={16} /> : <Save size={16} />}
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
}
