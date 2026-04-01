// src/app/checkout/verify/page.tsx
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import VerifyReceiptClient from './VerifyReceiptClient';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';

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
         // STRATEGY 1: Resolve the authenticated user from the LIVE server session (most reliable)
         // This catches logged-in users whose ID may not survive the Paystack metadata roundtrip
         let sessionUserId: string | null = null;
         try {
            const supabaseServer = await createServerClient();
            const { data: { user: sessionUser } } = await supabaseServer.auth.getUser();
            if (sessionUser?.id) {
               sessionUserId = sessionUser.id;
               console.log('Verify: Authenticated session user found:', sessionUserId);
            }
         } catch (sessionErr) {
            console.warn('Verify: Could not resolve session user (guest checkout):', sessionErr);
         }

         const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: {
               Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            },
            next: { revalidate: 0 } 
         });
         const payload = await response.json();
         
         if (payload.status) {
            transactionData = payload.data;
            
            // Service Role client bypasses RLS for atomic booking insertion
            const supabaseAdmin = createClient(
               process.env.NEXT_PUBLIC_SUPABASE_URL!,
               process.env.SUPABASE_SERVICE_ROLE_KEY!
            );
            
            const extractMeta = (varName: string) => {
               let metadata = transactionData.metadata || {};
               if (typeof metadata === 'string') {
                  try { metadata = JSON.parse(metadata); } catch (e) { metadata = {}; }
               }
               // Priority 1: Top-level metadata key (Reliable)
               if (metadata[varName] !== undefined && metadata[varName] !== null) return String(metadata[varName]);
               // Priority 2: custom_fields array (Legacy/Display fallback)
               return (metadata.custom_fields || [])?.find((f: any) => f.variable_name === varName)?.value || '';
            };

            const tourId = extractMeta('tour_id');
            const metadataUserId = extractMeta('user_id');
            const travelDate = extractMeta('travel_date');
            const passengers = parseInt(extractMeta('passengers')) || 1;
            const paymentOption = extractMeta('payment_option');
            const customerEmail = transactionData.customer.email;
            const guestName = extractMeta('guest_name');
            const guestPhone = extractMeta('guest_phone');

            const { data: existingBooking } = await supabaseAdmin.from('bookings').select('id, user_id, total_price').eq('paystack_reference', reference).single();
            
            if (existingBooking) {
               // Resolve correct USD amounts for potential patching
               const USD_TO_GHS_RATE = 13.5;
               const metaTotalAmountUSD = parseFloat(extractMeta('total_amount_usd'));
               const metaFullPriceUSD = parseFloat(extractMeta('total_full_price_usd'));
               const patchAmountUSD = !isNaN(metaTotalAmountUSD) ? metaTotalAmountUSD : ((transactionData.amount / 100) / USD_TO_GHS_RATE);
               const patchFullPriceUSD = !isNaN(metaFullPriceUSD) ? metaFullPriceUSD : patchAmountUSD;
               
               // Build patch object: fix user identity, amounts, and contact details
               const patchUserId = sessionUserId || (metadataUserId && metadataUserId.trim() !== '' ? metadataUserId : null);
               const patchData: Record<string, any> = {};
               
               // Patch user identity if missing
               if (!existingBooking.user_id && patchUserId) {
                  patchData.user_id = patchUserId;
               }
               // Patch guest details if missing
               if (guestName) patchData.guest_name = guestName;
               if (customerEmail) patchData.guest_email = customerEmail;
               if (guestPhone) patchData.guest_phone = guestPhone;
               // Patch amounts — fix if they look like GHS values (> 10x the expected USD amount)
               if (existingBooking.total_price > patchFullPriceUSD * 5) {
                  patchData.total_price = patchFullPriceUSD;
                  patchData.amount_paid = patchAmountUSD;
               }
               
               if (Object.keys(patchData).length > 0) {
                  console.log('Verify: Patching existing webhook booking:', existingBooking.id, patchData);
                  await supabaseAdmin.from('bookings').update(patchData).eq('id', existingBooking.id);
               }
               
               // Fix orphaned payment_transactions that are missing booking_id or user_id
               const resolvedUserId = patchUserId || existingBooking.user_id;
               const { data: orphanedTx } = await supabaseAdmin.from('payment_transactions')
                  .select('id, user_id, booking_id, amount')
                  .eq('payment_reference', reference)
                  .single();
               
               if (orphanedTx) {
                  const txPatch: Record<string, any> = {};
                  if (!orphanedTx.booking_id) txPatch.booking_id = existingBooking.id;
                  if (!orphanedTx.user_id && resolvedUserId) txPatch.user_id = resolvedUserId;
                  // Fix amount if it looks like GHS (> 10x expected USD)
                  if (orphanedTx.amount > patchAmountUSD * 5) txPatch.amount = patchAmountUSD;
                  
                  if (Object.keys(txPatch).length > 0) {
                     console.log('Verify: Patching orphaned transaction:', orphanedTx.id, txPatch);
                     await supabaseAdmin.from('payment_transactions').update(txPatch).eq('id', orphanedTx.id);
                  }
               }
            }
            
            // BALANCE PAYMENT CHECK: If booking_id is in the metadata, this is a balance settlement
            const metaBookingId = extractMeta('booking_id');
            if (metaBookingId && metaBookingId.trim() !== '' && !existingBooking) {
               console.log('Verify: Balance payment detected for booking:', metaBookingId);
               
               const USD_TO_GHS_RATE = 13.5;
               const metaChargedAmountUSD = parseFloat(extractMeta('total_amount_usd'));
               const metaTourValuePaidUSD = parseFloat(extractMeta('tour_value_paid_usd'));
               // Tour value (fee-free) for the booking amount_paid update
               const tourValueUSD = !isNaN(metaTourValuePaidUSD) ? metaTourValuePaidUSD : (!isNaN(metaChargedAmountUSD) ? metaChargedAmountUSD : ((transactionData.amount / 100) / USD_TO_GHS_RATE));
               // Charged amount (fee-inclusive) for the transaction ledger
               const chargedUSD = !isNaN(metaChargedAmountUSD) ? metaChargedAmountUSD : ((transactionData.amount / 100) / USD_TO_GHS_RATE);
               
               // Fetch the existing booking to update it
               const { data: targetBooking } = await supabaseAdmin.from('bookings')
                  .select('id, amount_paid, total_price, user_id')
                  .eq('id', metaBookingId)
                  .single();
               
               if (targetBooking) {
                  // Add the TOUR VALUE (fee-free) to amount_paid
                  const newAmountPaid = (Number(targetBooking.amount_paid) || 0) + tourValueUSD;
                  const newStatus = newAmountPaid >= (Number(targetBooking.total_price) || 0) ? 'FULLY_PAID' : 'DEPOSIT_PAID';
                  
                  console.log('Verify: Updating booking balance =>', { 
                     bookingId: metaBookingId, 
                     previousPaid: targetBooking.amount_paid, 
                     tourValueAdded: tourValueUSD,
                     chargedAmount: chargedUSD,
                     newAmountPaid, 
                     newStatus 
                  });
                  
                  await supabaseAdmin.from('bookings').update({
                     amount_paid: newAmountPaid,
                     payment_status: newStatus
                  }).eq('id', metaBookingId);
                  
                  // Insert BALANCE transaction linked to the existing booking
                  // Transaction amount = what was CHARGED (fee-inclusive) 
                  const resolvedUserId = sessionUserId || (metadataUserId && metadataUserId.trim() !== '' ? metadataUserId : null) || targetBooking.user_id;
                  const { error: txErr } = await supabaseAdmin.from('payment_transactions').insert({
                     user_id: resolvedUserId,
                     booking_id: metaBookingId,
                     amount: chargedUSD,
                     currency: 'USD',
                     payment_reference: reference,
                     status: transactionData.status === 'success' ? 'success' : 'pending',
                     payment_type: 'BALANCE',
                     metadata: { paystack_channel: transactionData.channel, paystack_id: transactionData.id }
                  });
                  if (txErr) console.error('Verify: Balance transaction insert error:', txErr);
               }
            }
            
            if (!existingBooking && (!metaBookingId || metaBookingId.trim() === '') && tourId && tourId !== 'test-1234') {
                 // USD AMOUNT RESOLUTION: Separate tour value (no fees) from charged amount (with fees)
                 const USD_TO_GHS_RATE = 13.5;
                 const metaChargedAmountUSD = parseFloat(extractMeta('total_amount_usd'));
                 const metaFullPriceUSD = parseFloat(extractMeta('total_full_price_usd'));
                 const metaTourValuePaidUSD = parseFloat(extractMeta('tour_value_paid_usd'));
                 
                 // Charged amount (fee-inclusive) — for transaction ledger
                 const chargedAmountUSD = !isNaN(metaChargedAmountUSD) ? metaChargedAmountUSD : ((transactionData.amount / 100) / USD_TO_GHS_RATE);
                 // Tour value paid (fee-free) — for booking amount_paid
                 const tourValuePaidUSD = !isNaN(metaTourValuePaidUSD) ? metaTourValuePaidUSD : chargedAmountUSD;
                 // Full trip price (fee-free) — for booking total_price
                 const totalFullPriceUSD = !isNaN(metaFullPriceUSD) ? metaFullPriceUSD : tourValuePaidUSD;
                 
                 console.log('Verify: Amount Resolution =>', { chargedAmountUSD, tourValuePaidUSD, totalFullPriceUSD });
                 
                 const resolvedPaymentStatus = paymentOption === 'pay_deposit' ? 'DEPOSIT_PAID' : 'FULLY_PAID';
                 const resolvedPaymentType = paymentOption === 'pay_deposit' ? 'DEPOSIT' : 'FULL';
                 
                 // DUAL IDENTITY RESOLUTION: Session > Metadata > Guest
                 // Priority 1: Live authenticated session (cannot be lost in transit)
                 // Priority 2: Paystack metadata userId (roundtrip from checkout)
                 // Priority 3: null (true guest checkout)
                 let finalUserId = sessionUserId || (metadataUserId && metadataUserId.trim() !== '' ? metadataUserId : null);
                 console.log('Verify: Identity Resolution =>', { sessionUserId, metadataUserId, finalUserId });

                // Execute Insertion with graceful fallback for identity parsing
                const { data: newBooking, error: insertErr } = await supabaseAdmin.from('bookings').insert({
                   user_id: finalUserId,
                   guest_name: guestName,
                   guest_email: customerEmail,
                   guest_phone: guestPhone,
                   tour_id: tourId,
                   travel_dates: travelDate,
                   travelers_count: passengers,
                   total_price: totalFullPriceUSD, 
                   amount_paid: tourValuePaidUSD,
                   payment_status: resolvedPaymentStatus,
                   paystack_reference: reference
                }).select('id').single();
                
                if (insertErr) {
                    console.error("Booking Table Insert Error:", insertErr);
                    
                    // FK violation on user_id — the userId from Paystack metadata may not exist in profiles.
                    // Try session-based user as fallback before resorting to guest mode.
                    if (insertErr.code === '23503' && finalUserId) {
                        console.warn("Foreign Key Violation on user_id:", finalUserId);
                        
                        // If metadata userId caused the FK fail, try sessionUserId instead
                        let retryUserId: string | null = null;
                        if (finalUserId === metadataUserId && sessionUserId && sessionUserId !== metadataUserId) {
                           retryUserId = sessionUserId;
                           console.log("Retrying with session userId:", retryUserId);
                        }
                        
                        finalUserId = retryUserId;
                        const { data: fallbackBooking } = await supabaseAdmin.from('bookings').insert({
                           user_id: retryUserId,
                           guest_name: guestName,
                           guest_email: customerEmail,
                           guest_phone: guestPhone,
                           tour_id: tourId,
                           travel_dates: travelDate,
                           travelers_count: passengers,
                           total_price: totalFullPriceUSD, 
                           amount_paid: tourValuePaidUSD,
                           payment_status: resolvedPaymentStatus,
                           paystack_reference: reference
                        }).select('id').single();

                        // Insert Payment Transaction for fallback booking
                        if (fallbackBooking) {
                           await supabaseAdmin.from('payment_transactions').insert({
                              user_id: retryUserId,
                              booking_id: fallbackBooking.id,
                              amount: chargedAmountUSD,
                              currency: 'USD',
                              payment_reference: reference,
                              status: transactionData.status === 'success' ? 'success' : 'pending',
                              payment_type: resolvedPaymentType,
                              metadata: { paystack_channel: transactionData.channel, paystack_id: transactionData.id }
                           });
                        }
                    }
                }

                // Insert Payment Transaction for primary booking
                if (!insertErr && newBooking) {
                   const { error: txErr } = await supabaseAdmin.from('payment_transactions').insert({
                      user_id: finalUserId,
                      booking_id: newBooking.id,
                      amount: chargedAmountUSD,
                      currency: 'USD',
                      payment_reference: reference,
                      status: transactionData.status === 'success' ? 'success' : 'pending',
                      payment_type: resolvedPaymentType,
                      metadata: { paystack_channel: transactionData.channel, paystack_id: transactionData.id }
                   });
                   if (txErr) console.error("Payment Transaction Insert Error:", txErr);
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
