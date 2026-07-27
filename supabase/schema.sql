-- Tsigoura Verde Resort e-menu database
-- Run this once in Supabase SQL Editor.

create table if not exists public.tv_menu_state (
  id text primary key default 'main',
  state jsonb not null,
  revision bigint not null default 0,
  updated_by text,
  updated_at timestamptz not null default now(),
  constraint tv_menu_state_singleton check (id = 'main')
);

create table if not exists public.tv_bookings (
  id uuid primary key default gen_random_uuid(),
  booking_ref text unique,
  name text not null,
  phone text not null,
  email text,
  booking_date date not null,
  booking_time time not null,
  people integer not null check (people between 1 and 80),
  message text,
  status text not null default 'new' check (status in ('new','confirmed','cancelled','completed','no_show')),
  source text,
  ip text,
  user_agent text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tv_orders (
  id uuid primary key default gen_random_uuid(),
  order_no text,
  table_id text,
  state text not null default 'new' check (state in ('new','scanned','sent','done','cancelled')),
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.tv_menu_state enable row level security;
alter table public.tv_bookings enable row level security;
alter table public.tv_orders enable row level security;

drop policy if exists "public read current menu" on public.tv_menu_state;
create policy "public read current menu"
on public.tv_menu_state
for select
using (id = 'main');

-- Bookings/orders are intentionally not public. Vercel functions use the
-- Supabase service role key server-side for writes.

create or replace function public.tv_touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists tv_menu_state_touch on public.tv_menu_state;
create trigger tv_menu_state_touch
before update on public.tv_menu_state
for each row execute function public.tv_touch_updated_at();

drop trigger if exists tv_bookings_touch on public.tv_bookings;
create trigger tv_bookings_touch
before update on public.tv_bookings
for each row execute function public.tv_touch_updated_at();

drop trigger if exists tv_orders_touch on public.tv_orders;
create trigger tv_orders_touch
before update on public.tv_orders
for each row execute function public.tv_touch_updated_at();
