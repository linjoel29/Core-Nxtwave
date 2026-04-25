-- SmartSave Migration: Fix user_id to TEXT (Firebase UID compatible)
-- Run this in Supabase SQL Editor

-- Drop FK constraints and recreate with TEXT user_id

-- 1. income_logs
ALTER TABLE public.income_logs DROP CONSTRAINT income_logs_user_id_fkey;
ALTER TABLE public.income_logs ALTER COLUMN user_id TYPE TEXT;

-- 2. savings
ALTER TABLE public.savings DROP CONSTRAINT savings_user_id_fkey;
ALTER TABLE public.savings ALTER COLUMN user_id TYPE TEXT;

-- 3. loans
ALTER TABLE public.loans DROP CONSTRAINT loans_user_id_fkey;
ALTER TABLE public.loans ALTER COLUMN user_id TYPE TEXT;

-- 4. badges
ALTER TABLE public.badges DROP CONSTRAINT badges_user_id_fkey;
ALTER TABLE public.badges ALTER COLUMN user_id TYPE TEXT;

-- 5. Drop the users table (not needed since we use Firebase Auth)
-- DROP TABLE public.users;  -- Uncomment this line if you want to remove it

-- Done! user_id columns now accept Firebase UID strings.
