import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// Native Node API config to consume raw buffer for HMAC cryptographic checking
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  try {
    // 1. Explicitly grab the text strictly for secure cryptographic hashing matching Paystack docs
    const bodyText = await req.text();
    const signature = req.headers.get('x-paystack-signature');

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    const secret = process.env.PAYSTACK_SECRET_KEY as string;
    
    // 2. Compute the precise HMAC SHA-512 array matching the raw body payload
    const hash = crypto.createHmac('sha512', secret).update(bodyText).digest('hex');

    if (hash !== signature) {
      return NextResponse.json({ error: "Unauthorized / Invalid Signature" }, { status: 401 });
    }

    // 3. Webhook verified! Parse the exact payload to manipulate the database natively
    const event = JSON.parse(bodyText);

    if (event.event === 'charge.success') {
      const data = event.data;
      
      const reference = data.reference;
      const amountGHS = data.amount / 100; // Raw pesewas to GHS
      const customerEmail = data.customer.email;
      
      // Robust Metadata Extraction (Handle both Object and Stringified Meta)
      let metadata = data.metadata || {};
      if (typeof metadata === 'string') {
        try { metadata = JSON.parse(metadata); } catch (e) { metadata = {}; }
      }
      
      const customFields = metadata.custom_fields || [];
      const extractMeta = (varName: string) => {
         // Priority 1: Top-level metadata key (Reliable)
         if (metadata[varName] !== undefined && metadata[varName] !== null) return String(metadata[varName]);
         // Priority 2: custom_fields array (Legacy/Display fallback)
         return customFields.find((f: any) => f.variable_name === varName)?.value || '';
      };

      const tourId = extractMeta('tour_id');
      const travelDate = extractMeta('travel_date');
      const passengerCount = parseInt(extractMeta('passengers')) || 1;
      const paymentOption = extractMeta('payment_option');
      const guestName = extractMeta('guest_name');
      const guestPhone = extractMeta('guest_phone');
      const bookingId = extractMeta('booking_id');

      // USD AMOUNT RESOLUTION: Separate tour value (no fees) from charged amount (with fees)
      const USD_TO_GHS_RATE = 13.5;
      const metaChargedAmountUSD = parseFloat(extractMeta('total_amount_usd'));   // What Paystack charged (with 3.9% fee)
      const metaFullPriceUSD = parseFloat(extractMeta('total_full_price_usd'));   // Full tour cost (no fees)
      const metaTourValuePaidUSD = parseFloat(extractMeta('tour_value_paid_usd')); // Tour value being paid now (no fees)
      
      // Charged amount: what customer paid via Paystack (fee-inclusive) — for transaction ledger
      const chargedAmountUSD = !isNaN(metaChargedAmountUSD) ? metaChargedAmountUSD : (amountGHS / USD_TO_GHS_RATE);
      // Tour value paid: the actual tour cost being covered (fee-free) — for booking amount_paid
      const tourValuePaidUSD = !isNaN(metaTourValuePaidUSD) ? metaTourValuePaidUSD : (chargedAmountUSD / 1.039); 
      // Full trip price: total tour cost (fee-free) — for booking total_price
      const fullTripPriceUSD = !isNaN(metaFullPriceUSD) ? metaFullPriceUSD : tourValuePaidUSD;
      
      console.log('Webhook: Amount Resolution =>', { 
         amountGHS, chargedAmountUSD, tourValuePaidUSD, fullTripPriceUSD,
         meta: { metaChargedAmountUSD, metaFullPriceUSD, metaTourValuePaidUSD },
         ids: { bookingId, tourId }
      });

      // 4. Secure DB Operations utilizing Service Role to legally bypass Front-End RLS checks
      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY! // Required to create Ghost Accounts and insert Bookings from Webhook safely
      );

      // DEDUP CHECK: If the verify page already created this booking, skip entirely
      const { data: existingBooking } = await supabaseAdmin.from('bookings').select('id, user_id').eq('paystack_reference', reference).single();
      
      if (existingBooking) {
         console.log('Webhook: Booking already exists for reference', reference, '- skipping duplicate insert.');
         
         // Still log the transaction if it doesn't exist yet
         const { data: existingTx } = await supabaseAdmin.from('payment_transactions').select('id').eq('payment_reference', reference).single();
         if (!existingTx) {
            await supabaseAdmin.from('payment_transactions').insert({
               user_id: existingBooking.user_id || null,
               booking_id: existingBooking.id,
               amount: chargedAmountUSD,
               currency: 'USD',
               payment_reference: reference,
               status: 'success',
               payment_type: paymentOption === 'pay_deposit' ? 'DEPOSIT' : (paymentOption === 'pay_balance' ? 'BALANCE' : 'FULL'),
               metadata: data
            }).then(({ error }) => { if (error) console.error('Webhook tx insert error:', error); });
         }
         return NextResponse.json({ status: "success", message: "Booking already processed by verify page." });
      }

      // A: Resolve user identity — Priority: metadata user_id > auth email lookup > ghost account creation
      const metadataUserId = extractMeta('user_id');
      let targetUserId: string | null = (metadataUserId && metadataUserId.trim() !== '') ? metadataUserId : null;
      let isNewAccount = false;
      let magicLinkUrl = null;
      
      // If no userId from metadata, search auth.users by email (NOT profiles table which has no email column)
      if (!targetUserId) {
         const { data: authListData } = await supabaseAdmin.auth.admin.listUsers();
         const matchedUser = authListData?.users?.find(u => u.email === customerEmail);
         if (matchedUser) {
            targetUserId = matchedUser.id;
         }
      }

      if (!targetUserId) {
         // Create Ghost Profile User (Admin Only Action)
         const { data: authCreation } = await supabaseAdmin.auth.admin.createUser({
            email: customerEmail,
            email_confirm: true,
            user_metadata: { full_name: guestName, phone: guestPhone, is_ghost: true }
         });
         
         if (authCreation?.user) {
            targetUserId = authCreation.user.id;
            isNewAccount = true;
            // The ON_AUTH_USER_CREATED postgres trigger naturally spins up the Profile
            
            try {
               // Aggressively generate an action link hooking into our NextJS /auth/callback
               const { data: linkData } = await supabaseAdmin.auth.admin.generateLink({
                  type: 'magiclink',
                  email: customerEmail,
                  options: {
                    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard`
                  }
               });
               magicLinkUrl = linkData?.properties?.action_link;
            } catch (err) {
               console.error("Magic link generation failed", err);
            }
         }
      }

      // B: Execute Database Booking Operations
      let resolvedBookingId: string | null = bookingId && bookingId.trim() !== '' ? bookingId : null;
       
      if (resolvedBookingId) {
         // This is a BALANCE payment for an existing booking
         // Dedup: Check if verify page already processed this balance payment
         const { data: existingBalanceTx } = await supabaseAdmin.from('payment_transactions').select('id').eq('payment_reference', reference).single();
         if (existingBalanceTx) {
            console.log('Webhook: Balance payment already processed for reference', reference);
            return NextResponse.json({ status: "success", message: "Balance already processed by verify page." });
         }
         
         const { data: currentBooking } = await supabaseAdmin.from('bookings').select('amount_paid, total_price').eq('id', resolvedBookingId).single();
         
         if (currentBooking) {
            // Add the TOUR VALUE (fee-free) to amount_paid, not the Paystack charge
            const newAmountPaid = (Number(currentBooking.amount_paid) || 0) + tourValuePaidUSD;
            const newStatus = newAmountPaid >= (Number(currentBooking.total_price) || 0) ? 'FULLY_PAID' : 'DEPOSIT_PAID';
            
            console.log('Webhook: Balance update =>', { previousPaid: currentBooking.amount_paid, tourValueAdded: tourValuePaidUSD, newAmountPaid, newStatus });
            
            await supabaseAdmin.from('bookings').update({
               amount_paid: newAmountPaid,
               payment_status: newStatus
            }).eq('id', resolvedBookingId);
         }
      } else {
         // This is a NEW booking — include all guest contact details
         // total_price = full trip cost (no fees), amount_paid = tour value paid now (no fees)
         const { data: newBooking, error: dbError } = await supabaseAdmin.from('bookings').insert({
            user_id: targetUserId,
            guest_name: guestName,
            guest_email: customerEmail,
            guest_phone: guestPhone,
            tour_id: tourId === 'test-1234' ? null : tourId,
            travel_dates: travelDate,
            travelers_count: passengerCount,
            total_price: fullTripPriceUSD,
            amount_paid: tourValuePaidUSD,
            payment_status: paymentOption === 'pay_deposit' ? 'DEPOSIT_PAID' : 'FULLY_PAID',
            paystack_reference: reference
         }).select('id').single();

         if (dbError) {
            console.error("Booking Table Insertion Error:", dbError);
            return NextResponse.json({ error: "Failed hooking payment to ticket" }, { status: 500 });
         }
         
         // Capture the new booking's actual DB ID for the transaction insert
         resolvedBookingId = newBooking?.id || null;
         console.log('Webhook: New booking created with ID:', resolvedBookingId);
      }

      // C: Log the Transaction to the dedicated Ledger
      // Transaction amount = what was actually CHARGED to the customer (fee-inclusive USD)
      const isBalancePayment = bookingId && bookingId.trim() !== '';
      const { error: txError } = await supabaseAdmin.from('payment_transactions').insert({
         user_id: targetUserId,
         booking_id: resolvedBookingId,
         amount: chargedAmountUSD,
         currency: 'USD',
         payment_reference: reference,
         status: 'success',
         payment_type: isBalancePayment ? 'BALANCE' : (paymentOption === 'pay_deposit' ? 'DEPOSIT' : 'FULL'),
         metadata: data
      });

      if (txError) {
         console.error("CRITICAL: Payment Transaction Logging Failed:", txError);
         // We still return success to Paystack because the booking itself might have succeeded
      }

      // 5. Phase 6: Automated Transactional Email Dispatch (Resend)
      if (process.env.RESEND_API_KEY) {
         try {
           const resend = new Resend(process.env.RESEND_API_KEY);
           
           const dynamicFooterBlock = (isNewAccount && magicLinkUrl)
              ? `<div style="background: #1A241B; padding: 24px; border-radius: 12px; border: 1px solid rgba(184,134,11,0.3); margin-top: 32px;">
                   <h2 style="color: #E8D3A2; margin-top: 0; font-size: 18px;">Claim Your Traveler Portal</h2>
                   <p style="color: #ffffff; opacity: 0.8; line-height: 1.6; font-size: 14px;">Since you checked out as a Guest, we have securely generated a private traveler account for you. Click the link below to instantly access your tickets and itinerary without a password.</p>
                   <a href="${magicLinkUrl}" style="display: inline-block; background: #E8D3A2; color: #131A14; text-decoration: none; padding: 14px 28px; border-radius: 50px; font-weight: bold; margin-top: 16px; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">Auto-Login to Portal</a>
                 </div>`
              : `<p style="color: #ffffff; opacity: 0.8; line-height: 1.6; margin-top: 24px; font-size: 14px;">Your receipt and tickets have been safely added to your existing traveler account.</p>
                 <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/login" style="display: inline-block; background: transparent; border: 1px solid #B8860B; color: #E8D3A2; text-decoration: none; padding: 14px 28px; border-radius: 50px; font-weight: bold; margin-top: 16px; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">Log In to Portal</a>`;

           await resend.emails.send({
             from: 'concierge@rootsandrhythmtravel.com', // Update with verified sender domain if available, or 'onboarding@resend.dev' for testing
             to: customerEmail,
             subject: `Roots & Rhythm Travels: Itinerary Confirmed [${reference}]`,
             html: `
               <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #131A14; color: #FAFAF8; padding: 40px; border-radius: 16px;">
                 <h1 style="color: #E8D3A2; margin-bottom: 24px;">Expedition Authorized.</h1>
                 <p style="color: #ffffff; opacity: 0.8; line-height: 1.6;">Dear ${guestName || 'Traveler'},</p>
                 <p style="color: #ffffff; opacity: 0.8; line-height: 1.6;">Your payment of $ {amountPaid.toLocaleString()} was successfully securely routed.</p>
                 <div style="background: #1A241B; padding: 24px; border-radius: 12px; margin: 32px 0;">
                   <p style="margin: 0 0 12px 0;"><strong style="color: #B8860B; font-size: 10px; text-transform: uppercase; letter-spacing: 1px;">Tracking Reference</strong><br/>${reference}</p>
                   <p style="margin: 0 0 12px 0;"><strong style="color: #B8860B; font-size: 10px; text-transform: uppercase; letter-spacing: 1px;">Type</strong><br/>${bookingId ? 'Balance Settlement' : 'Initial Reservation'}</p>
                   <p style="margin: 0 0 12px 0;"><strong style="color: #B8860B; font-size: 10px; text-transform: uppercase; letter-spacing: 1px;">Passengers</strong><br/>${passengerCount} Guest(s)</p>
                   <p style="margin: 0;"><strong style="color: #B8860B; font-size: 10px; text-transform: uppercase; letter-spacing: 1px;">Arrival Date</strong><br/>${travelDate || 'TBD'}</p>
                 </div>
                 ${dynamicFooterBlock}
               </div>
             `
           });
         } catch (emailError) {
           console.error("Resend Dispatch Error:", emailError);
           // We do not fail the webhook just because email dropped
         }
      } else {
         console.warn("Resend API Key missing. Skipping email dispatch.");
      }

      // 6. Success! Return 200 early to stop Paystack from endlessly retrying
      return NextResponse.json({ status: "success", message: "Transaction routed to backend successfully." });
    }

    return NextResponse.json({ status: "ignored", message: "Event not tracked" });

  } catch (err) {
    console.error("Webhook processing error:", err);
    return NextResponse.json({ error: "Webhook Error" }, { status: 500 });
  }
}
