-- The Craftist Asset Exchange — add prospect buyer status
-- Run once in Supabase SQL Editor if your buyers table was created before prospect status existed.

alter table public.buyers drop constraint if exists buyers_status_check;

alter table public.buyers
  alter column status set default 'prospect';

alter table public.buyers
  add constraint buyers_status_check
  check (status in ('prospect', 'active', 'paused', 'blocked'));
