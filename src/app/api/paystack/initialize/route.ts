import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Paystack Initialize Request:", { 
       guestEmail: body.guestEmail, 
       totalAmount: body.totalAmount, 
       paymentOption: body.paymentOption,
       userId: body.userId,
       bookingId: body.bookingId
    });

    const { tourId, tourName, paymentOption, travelDate, passengers, totalAmount, totalFullPrice, tourValuePaid, guestEmail, guestName, guestPhone, userId, bookingId } = body;

    if (!guestEmail || !totalAmount) {
       console.error("Missing required variables:", { guestEmail, totalAmount });
       return NextResponse.json({ error: "Missing required booking variables" }, { status: 400 });
    }

    // GHS Conversion Workaround (Option 2): 1 USD = 13.5 GHS
    const USD_TO_GHS_RATE = 13.5;
    const paystackAmount = Math.round(totalAmount * USD_TO_GHS_RATE * 100);

    // Generating a highly unique invoice reference mapped directly to Root & Rhythm tracking
    const referenceId = `RR-${Date.now()}-${Math.floor(Math.random() * 100000)}`;

    // CRITICAL: Pack financial and identity data into TOP-LEVEL metadata keys
    // Paystack custom_fields has a limit (~5-10 items) and silently drops excess fields.
    // Top-level metadata keys are always preserved in webhooks and verify API responses.
    const metadataPayload = {
       // Top-level keys (always preserved — critical data goes here)
       total_amount_usd: totalAmount,
       total_full_price_usd: totalFullPrice || totalAmount,
       tour_value_paid_usd: tourValuePaid || totalAmount,
       user_id: userId || '',
       booking_id: bookingId || '',
       payment_option: paymentOption,
       tour_id: tourId,
       travel_date: travelDate,
       passengers: passengers,
       guest_name: guestName,
       guest_phone: guestPhone || '',
       // Display-only fields for Paystack dashboard (limited to essential items)
       custom_fields: [
          { display_name: "Tour", variable_name: "tour_name", value: tourName },
          { display_name: "Traveler", variable_name: "guest_name", value: guestName },
          { display_name: "Payment", variable_name: "payment_option", value: paymentOption },
          { display_name: "Travel Date", variable_name: "travel_date", value: travelDate },
          { display_name: "Guests", variable_name: "passengers", value: String(passengers) }
       ]
    };

    console.log("Paystack Initialize: Metadata payload =>", JSON.stringify(metadataPayload));

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: guestEmail,
        amount: paystackAmount,
        currency: 'GHS', // Temporary GHS initialization until USD integration is reviewed
        reference: referenceId,
        callback_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/checkout/verify?reference=${referenceId}`,
        metadata: metadataPayload
      }),
    });

    const payload = await response.json();

    if (payload.status === true) {
      return NextResponse.json({ 
         authorization_url: payload.data.authorization_url,
         access_code: payload.data.access_code,
         reference: payload.data.reference
      });
    } else {
      return NextResponse.json({ error: payload.message }, { status: 400 });
    }

  } catch (error) {
    console.error("Paystack API Initialization Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
