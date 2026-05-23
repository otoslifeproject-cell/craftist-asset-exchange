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
  sold_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_items_status on public.items(status);
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
  tags text[] not null default '{}',
  status text not null default 'prospect' check (status in ('prospect', 'active', 'paused', 'blocked')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_buyers_status on public.buyers(status);
create index if not exists idx_buyers_tags on public.buyers using gin(tags);

create table if not exists public.alert_batches (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.items(id) on delete cascade,
  status text not null default 'created',
  buyer_count integer not null default 0,
  sent_count integer not null default 0,
  failed_count integer not null default 0,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.alert_recipients (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references public.alert_batches(id) on delete cascade,
  item_id uuid not null references public.items(id) on delete cascade,
  buyer_id uuid not null references public.buyers(id) on delete cascade,
  token text not null unique,
  status text not null default 'queued' check (status in ('queued', 'sent', 'opened', 'checkout_started', 'paid', 'expired', 'failed')),
  failure_reason text,
  sent_at timestamptz,
  opened_at timestamptz,
  checkout_started_at timestamptz,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_alert_recipients_token on public.alert_recipients(token);
create index if not exists idx_alert_recipients_item on public.alert_recipients(item_id);
create index if not exists idx_alert_recipients_buyer on public.alert_recipients(buyer_id);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.items(id),
  buyer_id uuid not null references public.buyers(id),
  alert_recipient_id uuid references public.alert_recipients(id),
  stripe_session_id text not null unique,
  stripe_payment_intent_id text,
  stripe_customer_id text,
  status text not null default 'checkout_started' check (status in ('checkout_started', 'paid', 'expired', 'refunded', 'cancelled')),
  amount_pence integer not null,
  currency text not null default 'gbp',
  delivery_postcode_requested text,
  checkout_url text,
  shipping_details jsonb,
  customer_details jsonb,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_orders_item on public.orders(item_id);
create index if not exists idx_orders_buyer on public.orders(buyer_id);
create index if not exists idx_orders_status on public.orders(status);

-- Public bucket for uploaded asset images/files. Uploads use the server-side service key.
insert into storage.buckets (id, name, public)
values ('asset-files', 'asset-files', true)
on conflict (id) do update set public = true;

-- RLS is enabled for safety. The app uses the Supabase service/secret key server-side.
alter table public.items enable row level security;
alter table public.buyers enable row level security;
alter table public.alert_batches enable row level security;
alter table public.alert_recipients enable row level security;
alter table public.orders enable row level security;