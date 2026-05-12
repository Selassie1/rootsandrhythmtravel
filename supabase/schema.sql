-- Root & Rhythm Travels: Master Supabase Schema Reference (V7.1)
-- Run this entire file on a fresh Supabase project to get a fully working database.

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

-- NOTE: experience_type and traveler_category ENUMs are intentionally NOT used as column types.
-- Both experience and ideal_for are stored as JSONB arrays to support multi-selection.
-- Valid experience values: CELEBRATION, DIASPORA, SPIRITUAL, ADVENTURE, EDUCATIONAL
-- Valid ideal_for values:  SOLO, COUPLE, FAMILY, SMALL_GROUP, LARGE_GROUP

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
  -- Array of experience types: CELEBRATION, DIASPORA, SPIRITUAL, ADVENTURE, EDUCATIONAL
  experience JSONB DEFAULT '["DIASPORA"]'::jsonb,
  -- Array of traveler categories: SOLO, COUPLE, FAMILY, SMALL_GROUP, LARGE_GROUP
  ideal_for JSONB DEFAULT '["SMALL_GROUP"]'::jsonb,
  -- travel_window kept for legacy records; new tours do not populate this field
  travel_window DATE,
  location TEXT,
  hero_image_url TEXT,
  -- Additional gallery images displayed as a slideshow on the tour detail page
  gallery_images JSONB DEFAULT '[]'::jsonb,
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

-- Site-wide key/value config: social links (instagram_url, twitter_url, facebook_url), etc.
-- Managed from Admin → Settings → Social & Footer Links.
CREATE TABLE public.site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT ''
);

CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id UUID REFERENCES public.tours(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reviewer_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  body TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE (tour_id, user_id)
);

-- ==========================================
-- 3. Helper Functions
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

-- ==========================================
-- 4. Row Level Security (RLS)
-- ==========================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins control profiles" ON public.profiles FOR ALL USING (public.is_admin());

-- Tours
CREATE POLICY "Anyone can view active tours" ON public.tours FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Admins control tours" ON public.tours FOR ALL USING (public.is_admin());

-- Bookings
CREATE POLICY "Users view own bookings" ON public.bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert booking" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins view all bookings" ON public.bookings FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins control bookings" ON public.bookings FOR ALL USING (public.is_admin());

-- Payment Transactions
CREATE POLICY "Users view own transactions" ON public.payment_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins view all transactions" ON public.payment_transactions FOR SELECT USING (public.is_admin());

-- Support Tickets
CREATE POLICY "Users view own tickets" ON public.support_tickets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert tickets" ON public.support_tickets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins control tickets" ON public.support_tickets FOR ALL USING (public.is_admin());

-- Leads
CREATE POLICY "Anyone can insert lead" ON public.leads FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admins view leads" ON public.leads FOR SELECT USING (public.is_admin());

-- Site Settings
CREATE POLICY "Public can read site settings" ON public.site_settings FOR SELECT USING (TRUE);
CREATE POLICY "Admins control site settings" ON public.site_settings FOR ALL USING (public.is_admin());

-- Reviews
CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT USING (TRUE);
CREATE POLICY "Authenticated users can insert review" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own review" ON public.reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own review" ON public.reviews FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins control reviews" ON public.reviews FOR ALL USING (public.is_admin());

-- ==========================================
-- 5. Automated Profile Creation Trigger
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

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
