import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import VerifyReceiptClient from './VerifyReceiptClient';
import { createClient } from '@supabase/supabase-js';

export default async function CheckoutVerifyPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
  const params = await searchParams;
  // Handle Next.js duplicate query parameter arrays natively guaranteeing clean string output
  const rawReference = params.reference;
  const reference = Array.isArray(rawReference) ? rawReference[0] : rawReference;

  let transactionData: any = null;

  // Execute precise Server-Side rendering directly pinging Paystack bypassing Webhook limits 
  // (Ensuring UI perfectly loads local testing data even if webhooks fail due to localhost domain drops)
  if (reference) {
     try {
        const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
           headers: {
              Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
           },
           next: { revalidate: 0 } 
        });
        const payload = await response.json();
        
        if (payload.status) {
           transactionData = payload.data;
           
           // Explicit Localhost Environment Backup Insertion!
           const supabaseAdmin = createClient(
              process.env.NEXT_PUBLIC_SUPABASE_URL!,
              process.env.SUPABASE_SERVICE_ROLE_KEY!
           );
           
           const extractMeta = (varName: string) => transactionData.metadata?.custom_fields?.find((f: any) => f.variable_name === varName)?.value || '';
           const tourId = extractMeta('tour_id');
           const userId = extractMeta('user_id');
           const travelDate = extractMeta('travel_date');
           const passengers = parseInt(extractMeta('passengers')) || 1;
           const paymentOption = extractMeta('payment_option');
           const customerEmail = transactionData.customer.email;
           const guestName = extractMeta('guest_name');
           const guestPhone = extractMeta('guest_phone');

           const { data: existingBooking } = await supabaseAdmin.from('bookings').select('id').eq('paystack_reference', reference).single();
           
           if (!existingBooking && tourId && tourId !== 'test-1234') {
               // Execute Insertion with graceful fallback for identity parsing
               const { error: insertErr } = await supabaseAdmin.from('bookings').insert({
                  user_id: userId || null, // Allow NULL to bypass strict foreign key lock if the user has no public profiles row
                  guest_name: guestName,
                  guest_email: customerEmail,
                  guest_phone: guestPhone,
                  tour_id: tourId,
                  travel_dates: travelDate,
                  travelers_count: passengers,
                  total_price: (transactionData.amount / 100) / 13.5, 
                  amount_paid: (transactionData.amount / 100) / 13.5,
                  payment_status: paymentOption === 'pay_deposit' ? 'DEPOSIT_PAID' : 'FULLY_PAID',
                  paystack_reference: reference
               });
               
               if (insertErr) {
                   console.error("Booking Table Insert Aggressive Error:", insertErr);
                   
                   // Second-Pass attempt: If the foreign key on user_id blocked it because their Profile is missing, try inserting completely anonymously
                   if (insertErr.code === '23503' && userId) {
                       console.warn("Foreign Key Violation Detected. Falling back to Anonymous Guest Ledger.");
                       await supabaseAdmin.from('bookings').insert({
                          user_id: null,
                          guest_name: guestName,
                          guest_email: customerEmail,
                          guest_phone: guestPhone,
                          tour_id: tourId,
                          travel_dates: travelDate,
                          travelers_count: passengers,
                          total_price: (transactionData.amount / 100) / 13.5, 
                          amount_paid: (transactionData.amount / 100) / 13.5,
                          payment_status: paymentOption === 'pay_deposit' ? 'DEPOSIT_PAID' : 'FULLY_PAID',
                          paystack_reference: reference
                       });
                   }
               }
           }
        }
     } catch (err) {
        console.error("Paystack SSR Verification Fetch Error:", err);
     }
  }

  return (
    <div className="min-h-screen bg-[#131A14] flex flex-col items-center pt-8 pb-24 px-4 sm:px-6 relative w-full overflow-hidden">
      
      <div className="w-full max-w-4xl flex items-center justify-between mb-8 sm:mb-12 relative z-10">
         {/* Return Link */}
         <Link href="/" className="text-white/40 hover:text-white flex items-center gap-2 text-[9px] sm:text-[10px] uppercase font-bold tracking-widest transition-colors">
            <ArrowLeft size={14} /> Back to Homepage
         </Link>

         {/* Highly explicit embedded Brand Mark mirroring Login Pipeline */}
         <Link href="/" className="relative w-10 h-10 sm:w-12 sm:h-12 block hover:scale-105 transition-transform duration-500">
            <Image 
               src="/logo.png" 
               alt="Roots and Rhythm Travels" 
               fill
               className="object-contain"
            />
         </Link>
      </div>

      <div className="max-w-2xl flex flex-col items-center text-center gap-6 w-full relative z-10">
         <span className="text-[#B8860B] tracking-[0.3em] text-[10px] font-bold uppercase drop-shadow-sm flex items-center justify-center gap-2">
           <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B] animate-pulse" />
           Payment Confirmed
         </span>
         
         <h1 className="text-4xl md:text-5xl font-serif text-[#FAFAF8] leading-tight">
           Expedition Secured 
         </h1>
         
         <p className="text-white/60 text-xs sm:text-sm leading-relaxed max-w-md mx-auto mb-2">
           Your logistical configuration has been successfully authorized. Our concierge team is actively preparing your itinerary. Please download this digital receipt for your reference.
         </p>

         {/* Natively mount the Client to permit HTML Canvas printing functionality securely */}
         <VerifyReceiptClient transactionData={transactionData} reference={reference || ''} />

         <div className="flex flex-col md:flex-row gap-4 w-full mt-4 px-2 max-w-2xl">
            <Link href="/dashboard" className="flex-1 bg-transparent border border-white/10 text-white hover:border-[#B8860B] py-4 rounded-full font-bold uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 group hover:shadow-[0_0_20px_rgba(184,134,11,0.2)]">
              Enter Traveler Portal <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
         </div>
      </div>
      
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#B8860B]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-[-10%] w-[600px] h-[600px] bg-[#178548]/5 rounded-full blur-[150px] pointer-events-none" />

    </div>
  );
}
