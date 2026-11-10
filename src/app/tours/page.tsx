import { createClient } from '@/utils/supabase/server';
import ToursListing from './ToursListing';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: "Ghana Tours & Day Trips | Roots & Rhythm Travels",
  description:
    "Browse Ghana tours with Roots & Rhythm Travels, from Accra city experiences to Cape Coast, Kakum and cultural journeys. Find your next adventure.",
  alternates: { canonical: "/tours" },
  openGraph: {
    type: "website",
    url: "/tours",
    title: "Ghana Tours & Day Trips | Roots & Rhythm Travels",
    description:
      "Browse Ghana tours with Roots & Rhythm Travels, from Accra city experiences to Cape Coast, Kakum and cultural journeys.",
    images: [{ url: "/images/kintampo.jpg", alt: "Ghana tours with Roots & Rhythm Travels" }],
  },
};
export default async function ToursPage() {
  const supabase = await createClient();

  // Actively pipeline Server Side execution natively
  const { data: tours } = await supabase
    .from('tours')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  // Returning ONLY the listing so the tours are strictly "Above The Fold" without massive scrolling
  return (
    <div className="min-h-screen bg-[#131A14]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(184,134,11,0.03)_0%,rgba(19,26,20,1)_50%)] pointer-events-none" />
      <ToursListing initialTours={tours || []} />
    </div>
  );
}
