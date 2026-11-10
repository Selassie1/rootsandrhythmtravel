import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import { Calendar, MapPin } from 'lucide-react';
import TourDetailClient from '../TourDetailClient';
import TourImageCarousel from '../TourImageCarousel';
import TourReviews from '../TourReviews';
import { getReviewsForTour } from '@/actions/tours';

export const dynamic = 'force-dynamic';
const SITE_URL = 'https://www.rootsandrhythmtravel.com';

function cleanText(html: unknown, max = 160) {
  return String(html || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

function absoluteImage(url?: string | null) {
  if (!url) return `${SITE_URL}/images/kintampo.jpg`;
  return url.startsWith('http') ? url : `${SITE_URL}${url}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: tour } = await supabase
    .from('tours')
    .select('title, description_body, hero_image_url')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  const path = `/tours/${slug}`;

  let title: string;
  let description: string;
  let image: string;

  if (!tour?.title) {
    if (slug !== 'build-your-own-expedition') return {};
    title = 'Build Your Own Expedition | Roots & Rhythm Travel';
    description =
      'Design a personalised Ghana trip with Roots & Rhythm Travel, tailored to your schedule, budget and cultural interests.';
    image = absoluteImage(null);
  } else {
    title = `${tour.title} | Roots & Rhythm Travel`;
    description =
      cleanText(tour.description_body) ||
      `Explore ${tour.title} with Roots & Rhythm Travel in Ghana.`;
    image = absoluteImage(tour.hero_image_url);
  }

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      url: path,
      title,
      description,
      images: [{ url: image, alt: tour?.title || 'Roots & Rhythm Travel tour' }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export default async function TourSetupPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

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
          description: isCustom ? 'Work closely with our travel concierge team to design a highly personalized motherland experience tailored precisely to your schedule, budget, and cultural interests.' : 'A deeply immersive cultural journey into the heart of West Africa tailored by Roots & Rhythm Travel.',
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

  const allImages = [
    tour.hero_image_url || '/images/Square.jpeg',
    ...((tour.gallery_images as string[] | null) ?? []).filter(Boolean),
  ];

  const reviews = tour.id === 'test-1234' ? [] : await getReviewsForTour(tour.id);
  const userExistingReview = user ? (reviews.find(r => r.user_id === user.id) ?? null) : null;

    const tripSchema = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: tour.title,
    url: `${SITE_URL}/tours/${slug}`,
    image: absoluteImage(tour.hero_image_url),
    description: cleanText(tour.description_body || tour.description, 300),
    provider: {
      '@type': 'TravelAgency',
      name: 'Roots & Rhythm Travel',
      url: `${SITE_URL}/`,
    },
    touristDestination: {
      '@type': 'TouristDestination',
      name: tour.location ? `${tour.location}, Ghana` : 'Ghana',
    },
    ...(Number(tour.price) > 0 && {
      offers: {
        '@type': 'Offer',
        price: String(tour.price),
        priceCurrency: 'USD',
        url: `${SITE_URL}/tours/${slug}`,
        availability: 'https://schema.org/InStock',
      },
    }),
  };

  return (
    <div className="min-h-screen bg-[#131A14]">
            <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(tripSchema) }}
      />

      {/* 1. Immersive Cinematic Hero — carousel if multiple images, static otherwise */}
      <div className="relative">
        <TourImageCarousel images={allImages} title={tour.title} />

        {/* Floating Data Payload overlaid on the carousel */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 lg:p-24 pb-32 max-w-7xl mx-auto z-10 w-full pointer-events-none fade-in">
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

      {/* 3. Reviews Section */}
      <TourReviews
        tourId={tour.id}
        initialReviews={reviews}
        currentUserId={user?.id ?? null}
        userExistingReview={userExistingReview}
      />
    </div>
  );
}
