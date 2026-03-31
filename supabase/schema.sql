-- Root & Rhythm Travels: Master Supabase Schema (V4 - Map Region Integration)

-- ==========================================
-- 1. Create Strict ENUM Types (The Safeguards)
-- ==========================================
CREATE TYPE user_role AS ENUM ('traveler', 'admin');
CREATE TYPE payment_status AS ENUM ('PENDING', 'DEPOSIT_PAID', 'FULLY_PAID', 'REFUNDED', 'FAILED');
CREATE TYPE booking_status AS ENUM ('PENDING_APPROVAL', 'CONFIRMED', 'CANCELLED', 'COMPLETED');
CREATE TYPE ticket_status AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');

-- NEW: Strict Regions for the Homepage SVG Map Filter
CREATE TYPE tour_region AS ENUM (
  'GREATER_ACCRA', 'ASHANTI', 'VOLTA', 'CENTRAL', 'EASTERN', 
  'WESTERN', 'NORTHERN', 'UPPER_EAST', 'UPPER_WEST', 'SAVANNAH', 
  'BONO', 'BONO_EAST', 'AHAFO', 'NORTH_EAST', 'OTI', 
  'WESTERN_NORTH', 'MULTIPLE'
);

-- ==========================================
-- 2. Core Tables
-- ==========================================

-- Profiles
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  role user_role DEFAULT 'traveler', 
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Tours (Updated with Region)
CREATE TABLE public.tours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description_heading TEXT, 
  description_body TEXT,    
  price NUMERIC NOT NULL,
  deposit NUMERIC NOT NULL,
  duration_days INTEGER NOT NULL,
  region tour_region DEFAULT 'GREATER_ACCRA', -- Strict Map Filter
  location TEXT,                              -- Display Text (e.g., "Kumasi City & Palace")
  hero_image_url TEXT,
  curated_inclusions JSONB DEFAULT '[]'::jsonb, 
  itinerary JSONB DEFAULT '[]'::jsonb,          
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Bookings
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, 
  guest_name TEXT,
  guest_email TEXT,
  guest_phone TEXT,
  tour_id UUID REFERENCES public.tours(id) ON DELETE RESTRICT,
  travel_dates TEXT,
  travelers_count INTEGER DEFAULT 1,
  total_price NUMERIC NOT NULL,
  amount_paid NUMERIC DEFAULT 0,
  payment_status payment_status DEFAULT 'PENDING',   
  booking_status booking_status DEFAULT 'PENDING_APPROVAL', 
  paystack_reference TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Support Tickets
CREATE TABLE public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status ticket_status DEFAULT 'OPEN', 
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Newsletter Leads
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ==========================================
-- 3. Security (Row Level Security - RLS)
-- ==========================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins view all profiles" ON public.profiles FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Anyone can view active tours" ON public.tours FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Admins control tours" ON public.tours USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Users view own bookings" ON public.bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins view all bookings" ON public.bookings FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Users can insert booking" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ==========================================
-- 4. Automated Profile Creation Trigger
-- ==========================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  extracted_first_name TEXT;
  extracted_last_name TEXT;
  full_name_raw TEXT;
BEGIN
  extracted_first_name := new.raw_user_meta_data->>'first_name';
  extracted_last_name := new.raw_user_meta_data->>'last_name';

  IF extracted_first_name IS NULL THEN
    full_name_raw := COALESCE(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name', '');
    extracted_first_name := split_part(full_name_raw, ' ', 1);
    extracted_last_name := substring(full_name_raw FROM length(extracted_first_name) + 2);
  END IF;

  INSERT INTO public.profiles (id, first_name, last_name, phone, role, avatar_url)
  VALUES (
    new.id, 
    extracted_first_name, 
    extracted_last_name, 
    new.raw_user_meta_data->>'phone', 
    'traveler', 
    new.raw_user_meta_data->>'avatar_url'
  );
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();