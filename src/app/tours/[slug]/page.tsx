import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Calendar, MapPin } from 'lucide-react';
import TourDetailClient from '../TourDetailClient';

export const dynamic = 'force-dynamic';

export default async function TourSetupPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  let { data: tour } = await supabase
    .from('tours')
    .select('*')
    .eq('slug', slug)
    .single();

  // Temporary mock data injection so you can visualize the UI without needing active database rows yet!
  if (!tour) {
    const validSlugs = ['the-ultimate-return', 'accra-nights-nuptials', 'ancestral-naming-ceremony', 'build-your-own-expedition', 'ashanti-royal-engagement'];
    if (validSlugs.includes(slug)) {
       const isCustom = slug === 'build-your-own-expedition';
       tour = {
          id: 'test-1234',
          title: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
          description: isCustom ? 'Work closely with our travel concierge team to design a highly personalized motherland experience tailored precisely to your schedule, budget, and cultural interests.' : 'A deeply immersive cultural journey into the heart of West Africa tailored by Roots & Rhythm Travels.',
          location: slug.includes('accra') ? 'Accra' : 'Ghana',
          duration_days: slug === 'build-your-own-expedition' ? 'Flexible' : 7,
          price: isCustom ? 0 : 35000,
          deposit: isCustom ? 0 : 5000,
          hero_image_url: '/images/Square.jpeg',
          isCustom,
          // Highly realistic mock itinerary array based on standard Root & Rhythm models
          itinerary: isCustom ? [] : [
            { day: 1, title: 'Arrival & Ancestral Welcome', description: 'Touch down at Kotoka International Airport where our VIP concierge escorts you past immigration into a private armored fleet. Evening welcome dinner featuring high-end Ghanaian culinary fusion.' },
            { day: 2, title: 'City Roots & Independence', description: 'Explore the historic heart of Accra. Deep-dive tours of Independence Square, the W.E.B Du Bois Centre, and immersive bargaining at Makola Market accompanied by your private guide.' },
            { day: 3, title: 'Coastal Forts & Heritage', description: 'Travel the scenic coastal route to Elmina. Walk through the solemn solemn dungeons of Cape Coast Castle culminating in the powerful "Door of Return" ceremony.' },
            { day: 4, title: 'Rhythm, Nightlife & Departure', description: 'Experience the pulse of contemporary Africa. Exclusive reservations at leading afrobeats lounges followed by private transfers back to Kotoka for departure.' }
          ]
       };
    } else {
       notFound();
    }
  }

  return (
    <div className="min-h-screen bg-[#131A14]">
      
      {/* 1. Immersive Cinematic Hero */}
      <div className="relative w-full h-screen min-h-[600px] overflow-hidden">
        
        {/* Render hero image with extreme cinematic grading */}
        <Image 
          src={tour.hero_image_url || '/images/Square.jpeg'}
          alt={tour.title}
          fill
          unoptimized={true}
          className="object-cover object-center scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#131A14] via-black/40 to-black/60" />

        {/* Floating Data Payload */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 lg:p-24 pb-32 max-w-7xl mx-auto z-10 w-full fade-in">
          
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="flex items-center gap-2 text-white text-[10px] font-bold uppercase tracking-widest bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
              <MapPin size={14} className="text-[#B8860B]" /> {tour.location}
            </span>
            <span className="flex items-center gap-2 text-white text-[10px] font-bold uppercase tracking-widest bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
              <Calendar size={14} className="text-[#B8860B]" /> {tour.duration_days} Days
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-[#FAFAF8] max-w-4xl drop-shadow-2xl leading-[0.9]">
            {tour.title}
          </h1>

        </div>
      </div>

      {/* 2. Client Side Interaction Shell */}
      <TourDetailClient tour={tour} />
    </div>
  );
}
