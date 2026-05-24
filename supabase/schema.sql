-- The Craftist Asset Exchange — Supabase schema
-- Run this once in Supabase SQL Editor before deploying.

create extension if not exists pgcrypto;

create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text,
  description text,
  category text,
  tags text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'live', 'reserved', 'sold', 'expired')),
  dimensions text,
  dispatch_postcode text,
  location_notes text,
  availability_start timestamptz,
  decision_deadline timestamptz,
  guide_price_pence integer not null default 0,
  transport_price_pence integer not null default 0,
  reservation_deposit_pence integer not null default 0,
  currency text not null default 'gbp',
  image_urls text[] not null default '{}',
  files jsonb not null default '[]'::jsonb,
  included text,
  exclusions text,
  compliance_notes text,
  transport_notes text,
  condition_notes text,
  assembly_notes text,
  reserved_until timestamptz,
  reserved_token text,
  reservation_status text not null default 'none' check (reservation_status in ('none','deposit_pending','deposit_paid','balance_pending','paid_full','expired','released')),
  sold_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.items add column if not exists reservation_deposit_pence integer not null default 0;
alter table public.items add column if not exists reservation_status text not null default 'none';

create index if not exists idx_items_status on public.items(status);
create index if not exists idx_items_category on public.items(category);
create index if not exists idx_items_tags on public.items using gin(tags);
create index if not exists idx_items_deadline on public.items(decision_deadline);

create table if not exists public.buyers (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  contact_name text,
  email text not null unique,
  phone text,
  website text,
  country text,
  source_url text,
  postcode text,
  buyer_type text,
  preferred_categories text[] not null default '{}',
  preferred_tags text[] not null default '{}',
  tags text[] not null default '{}',
  status text not null default 'prospect' check (status in ('prospect', 'active', 'paused', 'blocked')),
  alert_consent_at timestamptz,
  terms_accepted_at timestamptz,
  terms_version text,
  buyer_portal_token text unique default encode(gen_random_bytes(24), 'hex'),
  last_alerted_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.buyers add column if not exists preferred_categories text[] not null default '{}';
alter table public.buyers add column if not exists preferred_tags text[] not null default '{}';
alter table public.buyers add column if not exists alert_consent_at timestamptz;
alter table public.buyers add column if not exists terms_accepted_at timestamptz;
alter table public.buyers add column if not exists terms_version text;
alter table public.buyers add column if not exists buyer_portal_token text unique default encode(gen_random_bytes(24), 'hex');
alter table public.buyers add column if not exists last_alerted_at timestamptz;

create index if not exists idx_buyers_status on public.buyers(status);
create index if not exists idx_buyers_categories on public.buyers using gin(preferred_categories);
create index if not exists idx_buyers_preferred_tags on public.buyers using gin(preferred_tags);
create index if not exists idx_buyers_tags on public.buyers using gin(tags);
create index if not exists idx_buyers_portal_token on public.buyers(buyer_portal_token);

create table if not exists public.alert_batches (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.items(id) on delete cascade,
  status text not null default 'created',
  buyer_count integer not null default 0,
  sent_count integer not null default 0,
  failed_count integer not null default 0,
  previewed_at timestamptz,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.alert_batches add column if not exists previewed_at timestamptz;

create table if not exists public.alert_recipients (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references public.alert_batches(id) on delete cascade,
  item_id uuid not null references public.items(id) on delete cascade,
  buyer_id uuid not null references public.buyers(id) on delete cascade,
  token text not null unique,
  status text not null default 'queued' check (status in ('queued', 'sent', 'opened', 'checkout_started', 'paid', 'expired', 'failed', 'suppressed')),
  match_reason text,
  failure_reason text,
  suppressed_at timestamptz,
  sent_at timestamptz,
  opened_at timestamptz,
  checkout_started_at timestamptz,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  unique (item_id, buyer_id)
);

alter table public.alert_recipients add column if not exists match_reason text;
alter table public.alert_recipients add column if not exists suppressed_at timestamptz;

create index if not exists idx_alert_recipients_token on public.alert_recipients(token);
create index if not exists idx_alert_recipients_item on public.alert_recipients(item_id);
create index if not exists idx_alert_recipients_buyer on public.alert_recipients(buyer_id);
create index if not exists idx_alert_recipients_unique_item_buyer on public.alert_recipients(item_id, buyer_id);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.items(id),
  buyer_id uuid not null references public.buyers(id),
  alert_recipient_id uuid references public.alert_recipients(id),
  stripe_session_id text not null unique,
  stripe_payment_intent_id text,
  stripe_customer_id text,
  status text not null default 'checkout_started' check (status in ('checkout_started','deposit_pending','deposit_paid','balance_pending','paid','expired','refunded','cancelled')),
  payment_mode text not null default 'full' check (payment_mode in ('deposit','full','balance')),
  amount_pence integer not null,
  deposit_amount_pence integer not null default 0,
  balance_due_pence integer not null default 0,
  currency text not null default 'gbp',
  delivery_postcode_requested text,
  checkout_url text,
  shipping_details jsonb,
  customer_details jsonb,
  reserved_until timestamptz,
  deposit_paid_at timestamptz,
  balance_paid_at timestamptz,
  paid_at timestamptz,
  released_at timestamptz,
  release_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.orders add column if not exists payment_mode text not null default 'full';
alter table public.orders add column if not exists deposit_amount_pence integer not null default 0;
alter table public.orders add column if not exists balance_due_pence integer not null default 0;
alter table public.orders add column if not exists reserved_until timestamptz;
alter table public.orders add column if not exists deposit_paid_at timestamptz;
alter table public.orders add column if not exists balance_paid_at timestamptz;
alter table public.orders add column if not exists released_at timestamptz;
alter table public.orders add column if not exists release_reason text;

create index if not exists idx_orders_item on public.orders(item_id);
create index if not exists idx_orders_buyer on public.orders(buyer_id);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_reserved_until on public.orders(reserved_until);

insert into storage.buckets (id, name, public)
values ('asset-files', 'asset-files', true)
on conflict (id) do update set public = true;

alter table public.items enable row level security;
alter table public.buyers enable row level security;
alter table public.alert_batches enable row level security;
alter table public.alert_recipients enable row level security;
alter table public.orders enable row level security;