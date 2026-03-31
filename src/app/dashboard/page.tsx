// src/app/dashboard/page.tsx
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import DashboardClient from './DashboardClient';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch the extended profile created by our new Supabase Postgres Trigger
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  console.log('DASHBOARD PROFILE CHECK:', profile, user.id);

  // Route protection for Administrators
  if (profile?.role === 'admin') {
    redirect('/admin');
  }

  // Actively Fetch User Specific Travel Manifests exclusively locked to their UUID natively bypassing false positives
  const { data: bookings } = await supabase
    .from('bookings')
    .select('*, tours(title, slug)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  // Fetch the 2 most recent active tours for the "Curated For You" section
  const { data: recentTours } = await supabase
    .from('tours')
    .select('id, title, location, hero_image_url, price, duration_days, slug')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(2);

  const firstName = profile?.first_name || user.user_metadata?.first_name || user.user_metadata?.full_name?.split(' ')[0] || 'Traveler';

  return (
    <div className="min-h-screen bg-[#131A14] flex flex-col font-sans">
      
      {/* Immersive Welcome Area */}
      <div className="relative w-full h-[40vh] min-h-[350px] overflow-hidden">
        <Image 
          src="/images/Square.jpeg" 
          alt="Cinematic Background"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#131A14] via-[#131A14]/60 to-[#131A14]/10" />
        
        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 xl:p-24 max-w-[1700px] mx-auto w-full z-10 fade-in">
          <div className="flex items-end justify-between w-full">
            <div>
              <h1 className="text-white/90 text-5xl md:text-7xl font-serif font-light leading-none tracking-tight">
                Welcome back,<br/>{firstName}.
              </h1>
            </div>
          </div>
        </div>
      </div>

      <DashboardClient 
        user={user} 
        profile={profile} 
        bookings={bookings || []} 
        recentTours={recentTours || []} 
      />

    </div>
  );
}
