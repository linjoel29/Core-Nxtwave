-- SmartSave Schema (Firebase UID compatible)
-- Run in Supabase SQL Editor → New Query

-- income_logs: unified table for daily entries
CREATE TABLE IF NOT EXISTS public.income_logs (
    id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id        TEXT NOT NULL,
    income         NUMERIC NOT NULL DEFAULT 0,
    expense        NUMERIC NOT NULL DEFAULT 0,
    saved          NUMERIC NOT NULL DEFAULT 0,
    suggestion     NUMERIC NOT NULL DEFAULT 0,
    ai_explanation TEXT DEFAULT '',
    date           DATE NOT NULL,
    created_at     TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- savings (legacy – kept for badge queries if needed)
CREATE TABLE IF NOT EXISTS public.savings (
    id      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    saving  NUMERIC NOT NULL DEFAULT 0,
    date    DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- loans
CREATE TABLE IF NOT EXISTS public.loans (
    id        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id   TEXT NOT NULL,
    loan_name TEXT NOT NULL,
    amount    NUMERIC NOT NULL DEFAULT 0,
    emi       NUMERIC NOT NULL DEFAULT 0,
    due_date  INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- badges
CREATE TABLE IF NOT EXISTS public.badges (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     TEXT NOT NULL,
    badge_name  TEXT NOT NULL,
    achieved_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_income_logs_user_id ON public.income_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_income_logs_date    ON public.income_logs(date);
CREATE INDEX IF NOT EXISTS idx_loans_user_id       ON public.loans(user_id);
CREATE INDEX IF NOT EXISTS idx_badges_user_id      ON public.badges(user_id);
