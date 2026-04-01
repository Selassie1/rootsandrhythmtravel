"use server";

import { createClient } from "@/utils/supabase/server";

export type TourSearchResult = {
  title: string;
  slug: string;
  hero_image_url: string;
  description_body: string;
  price: number;
  duration_days: number;
  region: string;
};

export async function getFilterOptions() {
  const supabase = await createClient();
  
  // Get all dates from travel_window
  const { data } = await supabase.from('tours').select('travel_window').eq('is_active', true);
  
  if (!data) return { months: [] };

  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const uniqueMonths = Array.from(new Set(
    data
      .map(t => {
        const d = new Date(t.travel_window);
        return {
          label: d.toLocaleString('en-US', { month: 'long', year: 'numeric' }),
          date: new Date(d.getFullYear(), d.getMonth(), 1)
        };
      })
      .filter(item => item.date >= currentMonthStart) // Only show current and future months
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .map(item => item.label)
  ));

  return { months: uniqueMonths };
}

export async function searchTours(params: {
  region?: string;
  experience?: string;
  when?: string;
  travelers?: string;
}) {
  const supabase = await createClient();
  let query = supabase.from('tours').select('*').eq('is_active', true);

  if (params.region && params.region !== 'ALL') {
    query = query.eq('region', params.region);
  }
  
  if (params.experience && params.experience !== 'ALL') {
    query = query.eq('experience_type', params.experience);
  }

  if (params.travelers && params.travelers !== 'ALL') {
    query = query.eq('traveler_category', params.travelers);
  }

  if (params.when && params.when !== 'ALL') {
    const [month, year] = params.when.split(' ');
    // Create UTC date boundaries for the month
    const start = new Date(`${month} 1, ${year}`);
    const end = new Date(start);
    end.setMonth(start.getMonth() + 1);
    
    const startDate = start.toISOString().split('T')[0];
    const endDate = end.toISOString().split('T')[0];
    
    query = query.gte('travel_window', startDate).lt('travel_window', endDate);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error("Search error:", error);
    return [];
  }

  return data as TourSearchResult[];
}

export async function getActiveTours() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('tours')
    .select('title, slug, description_body, region, curated_inclusions, hero_image_url, duration_days, experience')
    .eq('is_active', true);

  if (error) {
    console.error("Error fetching active tours:", error);
    return [];
  }

  return data;
}
