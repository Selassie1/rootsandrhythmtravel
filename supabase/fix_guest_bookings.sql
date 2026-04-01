-- //frontend/supabase/fix_guest_bookings.sql
-- Root & Rhythm Travels: Fix Orphaned Guest Bookings
--
-- This script reassociates bookings that were incorrectly saved as guest checkouts
-- when the user was actually logged in. It matches by email address.
--
-- HOW IT WORKS:
-- 1. Finds bookings where user_id IS NULL (guest bookings)
-- 2. Matches guest_email against the auth.users table
-- 3. If a matching authenticated user exists, updates the booking's user_id
--
-- RUN THIS IN: Supabase SQL Editor (Dashboard → SQL Editor → New Query)

-- Step 1: Preview which bookings would be fixed (DRY RUN)
SELECT 
  b.id AS booking_id,
  b.guest_name,
  b.guest_email,
  b.tour_id,
  t.title AS tour_name,
  b.created_at,
  b.payment_status,
  au.id AS matched_user_id
FROM public.bookings b
LEFT JOIN auth.users au ON LOWER(b.guest_email) = LOWER(au.email)
LEFT JOIN public.tours t ON b.tour_id = t.id
WHERE b.user_id IS NULL
  AND au.id IS NOT NULL
ORDER BY b.created_at DESC;

-- Step 2: Apply the fix (UNCOMMENT BELOW TO EXECUTE)
-- This updates both bookings and payment_transactions tables

/*
-- Fix bookings table
UPDATE public.bookings b
SET user_id = au.id
FROM auth.users au
WHERE b.user_id IS NULL
  AND LOWER(b.guest_email) = LOWER(au.email);

-- Fix payment_transactions table  
UPDATE public.payment_transactions pt
SET user_id = b.user_id
FROM public.bookings b
WHERE pt.booking_id = b.id
  AND pt.user_id IS NULL
  AND b.user_id IS NOT NULL;
*/
