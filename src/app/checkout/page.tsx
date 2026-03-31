import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import CheckoutEngine from './CheckoutEngine';

export const dynamic = 'force-dynamic';

export default async function CheckoutPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
  const params = await searchParams;
  const tourId = params.tour;

  if (!tourId || typeof tourId !== 'string') {
    redirect('/tours');
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Try fetching the live tour from the DB
  let { data: tour } = await supabase
    .from('tours')
    .select('*')
    .eq('id', tourId)
    .single();

  // Explicit Fallback for Mock UI testing (matching the mock data from ToursListing)
  if (!tour && tourId === 'test-1234') {
    tour = {
      id: 'test-1234',
      title: 'The Ultimate Return',
      description: 'A profound journey tracing roots from the coastal forts to the Ashanti kingdom.',
      price: 35000,
      deposit: 5000,
      duration_days: '14 Days',
      hero_image_url: '/images/Square.jpeg'
    };
  }

  // If even the mock doesn't match an active tour, abort checkout
  if (!tour) {
    redirect('/tours');
  }

  return (
    <div className="min-h-screen bg-[#131A14]">
      
      {/* Immersive Dark Checkout Header */}
      <div className="w-full bg-[#1A241B] py-16 px-6 lg:px-12 border-b border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,rgba(184,134,11,0.05)_0%,transparent_50%)]" />
        <div className="max-w-6xl mx-auto pt-16 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-[#B8860B] tracking-[0.3em] text-[10px] font-bold uppercase mb-2 block drop-shadow-sm">
              Secure Checkout
            </span>
            <h1 className="text-3xl md:text-5xl font-serif text-[#FAFAF8] leading-tight mb-2">
              Confirm Your Expedition
            </h1>
            <p className="text-white/40 text-xs md:text-sm max-w-md">
              Complete your reservation to secure priority access to the {tour.title} package.
            </p>
          </div>
          
          <div className="bg-[#131A14] border border-white/5 rounded-2xl px-6 py-4 flex items-center gap-4 shadow-xl">
             <div className="w-10 h-10 rounded-full bg-[#B8860B]/10 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#E8D3A2]"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
             </div>
             <div className="flex flex-col">
                <span className="text-white text-sm font-bold">Encrypted Connection</span>
                <span className="text-white/40 text-[10px] uppercase tracking-widest">TLS 1.2 Protocol</span>
             </div>
          </div>
        </div>
      </div>

      <div className="py-12 md:py-24 px-6 lg:px-12">
        <CheckoutEngine tour={tour} currentUser={user} />
      </div>

    </div>
  );
}
