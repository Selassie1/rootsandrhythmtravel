import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tourId, tourName, paymentOption, travelDate, passengers, totalAmount, guestEmail, guestName, guestPhone, userId, bookingId } = body;

    if (!guestEmail || !totalAmount) {
       return NextResponse.json({ error: "Missing required booking variables" }, { status: 400 });
    }

    // GHS Conversion Workaround (Option 2): 1 USD = 13.5 GHS
    const USD_TO_GHS_RATE = 13.5;
    const paystackAmount = Math.round(totalAmount * USD_TO_GHS_RATE * 100);

    // Generating a highly unique invoice reference mapped directly to Root & Rhythm tracking
    const referenceId = `RR-${Date.now()}-${Math.floor(Math.random() * 100000)}`;

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
        metadata: {
           custom_fields: [
              { display_name: "Tour ID", variable_name: "tour_id", value: tourId },
              { display_name: "Tour Name", variable_name: "tour_name", value: tourName },
              { display_name: "Traveler Name", variable_name: "guest_name", value: guestName },
              { display_name: "Phone / WhatsApp", variable_name: "guest_phone", value: guestPhone },
              { display_name: "Travel Date", variable_name: "travel_date", value: travelDate },
              { display_name: "Passenger Count", variable_name: "passengers", value: passengers },
              { display_name: "Payment Plan", variable_name: "payment_option", value: paymentOption },
              { display_name: "User ID", variable_name: "user_id", value: userId || '' },
              { display_name: "Booking ID", variable_name: "booking_id", value: bookingId || '' }
           ]
        }
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
