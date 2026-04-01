-- Root & Rhythm Travels: Master Supabase Schema Reference (V6.1)

-- ==========================================
-- 1. Strict ENUM Types
-- ==========================================
CREATE TYPE user_role AS ENUM ('traveler', 'admin');
CREATE TYPE payment_status AS ENUM ('PENDING', 'DEPOSIT_PAID', 'FULLY_PAID', 'REFUNDED', 'FAILED');
CREATE TYPE booking_status AS ENUM ('PENDING_APPROVAL', 'CONFIRMED', 'CANCELLED', 'COMPLETED');
CREATE TYPE ticket_status AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');

CREATE TYPE tour_region AS ENUM (
  'GREATER_ACCRA', 'ASHANTI', 'VOLTA', 'CENTRAL', 'EASTERN', 
  'WESTERN', 'NORTHERN', 'UPPER_EAST', 'UPPER_WEST', 'SAVANNAH', 
  'BONO', 'BONO_EAST', 'AHAFO', 'NORTH_EAST', 'OTI', 
  'WESTERN_NORTH', 'MULTIPLE'
);

CREATE TYPE transaction_status AS ENUM ('success', 'failed', 'pending');
CREATE TYPE transaction_type AS ENUM ('DEPOSIT', 'BALANCE', 'FULL');

CREATE TYPE experience_type AS ENUM (
  'CELEBRATION', 'DIASPORA', 'SPIRITUAL', 'ADVENTURE', 'EDUCATIONAL'
);

CREATE TYPE traveler_category AS ENUM (
  'SOLO', 'COUPLE', 'FAMILY', 'SMALL_GROUP', 'LARGE_GROUP'
);

-- ==========================================
-- 2. Core Tables
-- ==========================================

CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  role user_role DEFAULT 'traveler', 
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE public.tours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description_heading TEXT, 
  description_body TEXT,    
  price NUMERIC NOT NULL,
  deposit NUMERIC NOT NULL,
  duration_days INTEGER NOT NULL,
  region tour_region DEFAULT 'GREATER_ACCRA', 
  experience experience_type DEFAULT 'DIASPORA',
  ideal_for traveler_category DEFAULT 'SMALL_GROUP',
  travel_window DATE, 
  location TEXT,                              
  hero_image_url TEXT,
  curated_inclusions JSONB DEFAULT '[]'::jsonb, 
  itinerary JSONB DEFAULT '[]'::jsonb,          
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

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

CREATE TABLE public.payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'USD',
  payment_reference TEXT UNIQUE NOT NULL,
  status transaction_status NOT NULL DEFAULT 'pending',
  payment_type transaction_type NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status ticket_status DEFAULT 'OPEN', 
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ==========================================
-- 3. Security (Row Level Security - RLS)
-- ==========================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Anyone can view active tours" ON public.tours FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Admins control tours" ON public.tours FOR ALL USING (public.is_admin());

CREATE POLICY "Users view own bookings" ON public.bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert booking" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins view all bookings" ON public.bookings FOR SELECT USING (public.is_admin());

CREATE POLICY "Users view own transactions" ON public.payment_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins view all transactions" ON public.payment_transactions FOR SELECT USING (public.is_admin());

CREATE POLICY "Users view own tickets" ON public.support_tickets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert tickets" ON public.support_tickets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins control tickets" ON public.support_tickets FOR ALL USING (public.is_admin());

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