-- The Craftist Asset Exchange — buyer contact research fields
-- Run once in Supabase SQL Editor if the live buyers table already exists.

alter table public.buyers
  add column if not exists website text,
  add column if not exists country text,
  add column if not exists source_url text;
