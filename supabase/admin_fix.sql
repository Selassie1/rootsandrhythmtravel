-- //frontend/supabase/admin_fix.sql
-- Root & Rhythm Travels: ABSOLUTE NUCLEAR RLS Reset (V3)
-- 
-- Previous scripts failed because old policies with unknown names survived.
-- This script dynamically discovers and removes ALL policies on ALL tables.

-- ==========================================
-- STEP 1: DYNAMICALLY DROP EVERY SINGLE POLICY (no name guessing)
-- ==========================================
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN 
    SELECT policyname, tablename 
    FROM pg_policies 
    WHERE schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.policyname, pol.tablename);
    RAISE NOTICE 'Dropped policy: % on %', pol.policyname, pol.tablename;
  END LOOP;
END $$;

-- ==========================================
-- STEP 2: Create the SECURITY DEFINER helper function
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
-- STEP 3: Ensure RLS is enabled
-- ==========================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- STEP 4: Recreate ALL policies (RECURSION-FREE)
-- NO admin policies on the profiles table!
-- ==========================================

-- === PROFILES (simple user-level only, NO is_admin calls!) ===
CREATE POLICY "Users view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- === TOURS ===
CREATE POLICY "Anyone can view active tours" ON public.tours
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Admins control tours" ON public.tours
  FOR ALL USING (public.is_admin());

-- === BOOKINGS ===
CREATE POLICY "Users view own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert booking" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins view all bookings" ON public.bookings
  FOR SELECT USING (public.is_admin());

-- === PAYMENT TRANSACTIONS ===
CREATE POLICY "Users view own transactions" ON public.payment_transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins view all transactions" ON public.payment_transactions
  FOR SELECT USING (public.is_admin());

-- === SUPPORT TICKETS ===
CREATE POLICY "Users view own tickets" ON public.support_tickets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users insert tickets" ON public.support_tickets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins view all tickets" ON public.support_tickets
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins update tickets" ON public.support_tickets
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins delete tickets" ON public.support_tickets
  FOR DELETE USING (public.is_admin());

-- ==========================================
-- STEP 5: Confirm admin user
-- ==========================================
UPDATE public.profiles
SET role = 'admin'
WHERE id = '1d69ed8a-0615-4ed4-bd93-08d6eae81870';

-- ==========================================
-- STEP 6: Verification - List all current policies
-- ==========================================
SELECT tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;
