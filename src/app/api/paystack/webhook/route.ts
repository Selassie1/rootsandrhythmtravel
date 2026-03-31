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
      const amountPaid = data.amount / 100; // Return to standard Cedis
      const customerEmail = data.customer.email;
      
      const metadata = data.metadata.custom_fields || [];
      const extractMeta = (varName: string) => metadata.find((f: any) => f.variable_name === varName)?.value || '';

      const tourId = extractMeta('tour_id');
      const travelDate = extractMeta('travel_date');
      const passengerCount = parseInt(extractMeta('passengers')) || 1;
      const paymentOption = extractMeta('payment_option');
      const guestName = extractMeta('guest_name');
      const guestPhone = extractMeta('guest_phone');
      const bookingId = extractMeta('booking_id');

      // 4. Secure DB Operations utilizing Service Role to legally bypass Front-End RLS checks
      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY! // Required to create Ghost Accounts and insert Bookings from Webhook safely
      );

      // A: Auto-generate the Ghost Account if it doesn't exist
      let targetUserId = null;
      let isNewAccount = false;
      let magicLinkUrl = null;
      
      const { data: userSearch } = await supabaseAdmin.from('profiles').select('id').eq('email', customerEmail).single();
      
      if (userSearch) {
         targetUserId = userSearch.id;
      } else {
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
      if (bookingId) {
         // This is a BALANCE payment for an existing booking
         const { data: currentBooking } = await supabaseAdmin.from('bookings').select('amount_paid, total_price').eq('id', bookingId).single();
         
         if (currentBooking) {
            const newAmountPaid = (currentBooking.amount_paid || 0) + amountPaid;
            const newStatus = newAmountPaid >= currentBooking.total_price ? 'COMPLETED' : 'DEPOSIT_PAID';
            
            await supabaseAdmin.from('bookings').update({
               amount_paid: newAmountPaid,
               payment_status: newStatus
            }).eq('id', bookingId);
         }
      } else {
         // This is a NEW booking
         const { error: dbError } = await supabaseAdmin.from('bookings').insert({
            user_id: targetUserId,
            tour_id: tourId === 'test-1234' ? null : tourId,
            travel_dates: travelDate,
            travelers_count: passengerCount,
            total_price: paymentOption === 'pay_deposit' ? (amountPaid * 4) : amountPaid, // Rough estimate if full price not passed, but usually total_price should be explicit. 
            // Better: In initial checkout, total_price is set. In guest checkout we might need to be careful.
            amount_paid: amountPaid,
            payment_status: paymentOption === 'pay_deposit' ? 'DEPOSIT_PAID' : 'COMPLETED',
            paystack_reference: reference
         });

         if (dbError) {
            console.error("Booking Table Insertion Error:", dbError);
            return NextResponse.json({ error: "Failed hooking payment to ticket" }, { status: 500 });
         }
      }

      // C: Log the Transaction to the dedicated Ledger
      const { error: txError } = await supabaseAdmin.from('payment_transactions').insert({
         user_id: targetUserId,
         booking_id: bookingId || null,
         amount: amountPaid,
         currency: 'USD',
         payment_reference: reference,
         status: 'success',
         payment_type: bookingId ? 'BALANCE' : (paymentOption === 'pay_deposit' ? 'DEPOSIT' : 'FULL'),
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
