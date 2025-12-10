-- ============================================================================
-- Supabase canonical schema for PromptNX SaaS
-- ----------------------------------------------------------------------------
-- This single SQL file is the source of truth for all database objects.
-- Update it first, then run it through the Supabase SQL editor (or db push)
-- to keep the hosted project in sync.
-- ============================================================================

-- Extensions -----------------------------------------------------------------
create extension if not exists "pgcrypto";

-- Enums ----------------------------------------------------------------------
create type public.user_role as enum ('buyer', 'seller', 'admin', 'ops');
create type public.prompt_status as enum ('draft', 'testing', 'review', 'live', 'archived', 'rejected');
create type public.prompt_visibility as enum ('public', 'private', 'unlisted');
create type public.order_status as enum ('pending', 'paid', 'refunded', 'failed');
create type public.payout_status as enum ('pending', 'processing', 'paid', 'failed');
create type public.review_status as enum ('pending', 'published', 'flagged', 'hidden');

-- Helper functions -----------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$ language plpgsql;

-- Profiles -------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.user_role not null default 'buyer',
  username text unique,
  display_name text,
  avatar_url text,
  bio text,
  country text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;

create policy "profiles_public_view"
on public.profiles for select
using (true);

create policy "profiles_self_update"
on public.profiles for update
using (auth.uid() = id);

-- Seller profiles ------------------------------------------------------------
create table if not exists public.seller_profiles (
  seller_id uuid primary key references public.profiles(id) on delete cascade,
  headline text,
  verification_status text not null default 'unverified',
  completion_percent int not null default 0 check (completion_percent between 0 and 100),
  payout_email text,
  payout_method text,
  fee_split jsonb default jsonb_build_object('platform_percent', 15, 'seller_percent', 85),
  checklist jsonb default '[]'::jsonb,
  metrics jsonb default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger seller_profiles_updated_at
before update on public.seller_profiles
for each row execute function public.set_updated_at();

alter table public.seller_profiles enable row level security;

create policy "seller_profiles_public_view"
on public.seller_profiles for select
using (true);

create policy "seller_profiles_owner_manage"
on public.seller_profiles for all
using (auth.uid() = seller_id);

-- Prompt categories ----------------------------------------------------------
create table if not exists public.prompt_categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  label text not null,
  description text,
  icon text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger prompt_categories_updated_at
before update on public.prompt_categories
for each row execute function public.set_updated_at();

alter table public.prompt_categories enable row level security;

create policy "prompt_categories_public_view"
on public.prompt_categories for select
using (true);

create policy "prompt_categories_admin_write"
on public.prompt_categories for all
using (auth.role() = 'service_role');

-- Prompts --------------------------------------------------------------------
create table if not exists public.prompts (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.profiles(id) on delete cascade,
  category_id uuid references public.prompt_categories(id),
  title text not null,
  slug text unique,
  summary text,
  detailed_brief text,
  price_cents integer not null default 0 check (price_cents >= 0),
  status public.prompt_status not null default 'draft',
  visibility public.prompt_visibility not null default 'public',
  qa_score numeric(5,2),
  metrics jsonb default '{}'::jsonb,
  tags text[] default '{}',
  thumbnail_url text,
  attachments jsonb default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  published_at timestamptz
);

create trigger prompts_updated_at
before update on public.prompts
for each row execute function public.set_updated_at();

alter table public.prompts enable row level security;

create policy "prompts_public_view"
on public.prompts for select
using (prompts.visibility = 'public' or auth.uid() = prompts.seller_id);

create policy "prompts_owner_manage"
on public.prompts for all
using (auth.uid() = prompts.seller_id);

create policy "prompts_admin_manage"
on public.prompts for all
using (auth.role() = 'service_role');

-- Prompt versions ------------------------------------------------------------
create table if not exists public.prompt_versions (
  id uuid primary key default gen_random_uuid(),
  prompt_id uuid not null references public.prompts(id) on delete cascade,
  version_number int not null,
  change_log text,
  instructions text not null,
  inputs_schema jsonb,
  outputs_schema jsonb,
  generated_examples jsonb,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.prompt_versions add constraint prompt_versions_unique_version
unique (prompt_id, version_number);

alter table public.prompt_versions enable row level security;

create policy "prompt_versions_public_view"
on public.prompt_versions for select
using (
  exists (
    select 1 from public.prompts p
    where p.id = prompt_versions.prompt_id
      and (p.visibility = 'public' or auth.uid() = p.seller_id)
  )
);

create policy "prompt_versions_owner_manage"
on public.prompt_versions for all
using (
  exists (
    select 1 from public.prompts p
    where p.id = prompt_versions.prompt_id
      and auth.uid() = p.seller_id
  )
);

-- Prompt assets --------------------------------------------------------------
create table if not exists public.prompt_assets (
  id uuid primary key default gen_random_uuid(),
  prompt_id uuid not null references public.prompts(id) on delete cascade,
  asset_type text not null check (asset_type in ('thumbnail', 'reference', 'dataset', 'pack')),
  url text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.prompt_assets enable row level security;

create policy "prompt_assets_public_view"
on public.prompt_assets for select
using (
  exists (
    select 1 from public.prompts p
    where p.id = prompt_assets.prompt_id
      and (p.visibility = 'public' or auth.uid() = p.seller_id)
  )
);

create policy "prompt_assets_owner_manage"
on public.prompt_assets for all
using (
  exists (
    select 1 from public.prompts p
    where p.id = prompt_assets.prompt_id
      and auth.uid() = p.seller_id
  )
);

-- Prompt favorites -----------------------------------------------------------
create table if not exists public.prompt_favorites (
  prompt_id uuid not null references public.prompts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  primary key (prompt_id, user_id)
);

alter table public.prompt_favorites enable row level security;

create policy "prompt_favorites_owner_manage"
on public.prompt_favorites for all
using (auth.uid() = user_id);

-- Orders & monetization ------------------------------------------------------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references public.profiles(id),
  subtotal_cents integer not null default 0 check (subtotal_cents >= 0),
  fees_cents integer not null default 0 check (fees_cents >= 0),
  total_cents integer not null default 0 check (total_cents >= 0),
  status public.order_status not null default 'pending',
  payment_intent_id text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger orders_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

alter table public.orders enable row level security;

create policy "orders_owner_view"
on public.orders for select using (auth.uid() = buyer_id);

create policy "orders_owner_insert"
on public.orders for insert with check (auth.uid() = buyer_id);

-- Order items ----------------------------------------------------------------
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  prompt_id uuid not null references public.prompts(id),
  seller_id uuid not null references public.profiles(id),
  price_cents integer not null default 0,
  platform_fee_cents integer not null default 0,
  seller_earnings_cents integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.order_items enable row level security;

create policy "order_items_owner_view"
on public.order_items for select
using (
  exists (
    select 1 from public.orders o
    where o.id = order_items.order_id
      and auth.uid() = o.buyer_id
  )
  or auth.uid() = order_items.seller_id
);

-- Reviews --------------------------------------------------------------------
create table if not exists public.prompt_reviews (
  id uuid primary key default gen_random_uuid(),
  prompt_id uuid not null references public.prompts(id) on delete cascade,
  buyer_id uuid not null references public.profiles(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  headline text,
  comment text,
  status public.review_status not null default 'pending',
  moderation_notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger prompt_reviews_updated_at
before update on public.prompt_reviews
for each row execute function public.set_updated_at();

alter table public.prompt_reviews add constraint unique_prompt_review
unique (prompt_id, buyer_id);

alter table public.prompt_reviews enable row level security;

create policy "prompt_reviews_public_view"
on public.prompt_reviews for select
using (status = 'published' or auth.uid() = buyer_id or auth.role() = 'service_role');

create policy "prompt_reviews_owner_manage"
on public.prompt_reviews for all
using (auth.uid() = buyer_id);

-- Chat -----------------------------------------------------------------------
create table if not exists public.chat_threads (
  id uuid primary key default gen_random_uuid(),
  prompt_id uuid references public.prompts(id) on delete cascade,
  creator_id uuid not null references public.profiles(id),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.chat_participants (
  thread_id uuid not null references public.chat_threads(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text default 'member',
  last_read_at timestamptz,
  primary key (thread_id, user_id)
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.chat_threads(id) on delete cascade,
  sender_id uuid not null references public.profiles(id),
  body text not null,
  attachments jsonb default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.chat_threads enable row level security;
alter table public.chat_participants enable row level security;
alter table public.chat_messages enable row level security;

create policy "chat_threads_view"
on public.chat_threads for select
using (
  exists (
    select 1 from public.chat_participants cp
    where cp.thread_id = chat_threads.id
      and cp.user_id = auth.uid()
  )
);

create policy "chat_threads_manage"
on public.chat_threads for all
using (auth.uid() = creator_id);

create policy "chat_participants_view"
on public.chat_participants for select
using (user_id = auth.uid());

create policy "chat_participants_manage"
on public.chat_participants for all
using (
  exists (
    select 1 from public.chat_threads t
    where t.id = chat_participants.thread_id
      and t.creator_id = auth.uid()
  )
);

create policy "chat_messages_view"
on public.chat_messages for select
using (
  exists (
    select 1 from public.chat_participants cp
    where cp.thread_id = chat_messages.thread_id
      and cp.user_id = auth.uid()
  )
);

create policy "chat_messages_insert"
on public.chat_messages for insert
with check (
  exists (
    select 1 from public.chat_participants cp
    where cp.thread_id = chat_messages.thread_id
      and cp.user_id = auth.uid()
  )
);

-- Notifications --------------------------------------------------------------
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  body text,
  type text not null default 'general',
  metadata jsonb default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.notifications enable row level security;

create policy "notifications_owner_access"
on public.notifications for all
using (auth.uid() = user_id);

-- Audit logs -----------------------------------------------------------------
create table if not exists public.audit_logs (
  id bigserial primary key,
  actor_id uuid references public.profiles(id),
  actor_role public.user_role,
  entity_type text not null,
  entity_id uuid,
  action text not null,
  payload jsonb default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.audit_logs enable row level security;

create policy "audit_logs_service_only"
on public.audit_logs for all
using (auth.role() = 'service_role');

-- Auth telemetry -------------------------------------------------------------
create table if not exists public.auth_events (
  id bigserial primary key,
  user_id uuid references auth.users(id) on delete cascade,
  event_type text not null check (
    event_type in ('signup', 'login', 'logout', 'password_reset_request', 'password_reset', 'token_refresh')
  ),
  ip_address inet,
  user_agent text,
  success boolean not null default true,
  error_code text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.auth_events enable row level security;

create policy "auth_events_service_only"
on public.auth_events for all
using (auth.role() = 'service_role');

-- Prompt workbench drafts -----------------------------------------------------
create table if not exists public.prompt_workbench_drafts (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  prompt_text text not null,
  category text,
  variables jsonb default '[]'::jsonb,
  examples jsonb default '[]'::jsonb,
  validation jsonb default '{}'::jsonb,
  ai_suggestions jsonb default '[]'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'testing', 'archived')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger prompt_workbench_drafts_updated_at
before update on public.prompt_workbench_drafts
for each row execute function public.set_updated_at();

alter table public.prompt_workbench_drafts enable row level security;

create policy "prompt_workbench_drafts_owner_access"
on public.prompt_workbench_drafts for all
using (auth.uid() = seller_id);

create table if not exists public.user_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  access_token text not null,
  refresh_token text not null,
  expires_at timestamptz not null,
  ip_address inet,
  user_agent text,
  created_at timestamptz not null default timezone('utc', now()),
  revoked_at timestamptz
);

create index if not exists idx_user_sessions_user_id on public.user_sessions(user_id);

alter table public.user_sessions enable row level security;

create policy "user_sessions_service_only"
on public.user_sessions for all
using (auth.role() = 'service_role');

-- Supabase storage buckets ---------------------------------------------------
insert into storage.buckets (id, name, public)
values ('prompt-assets', 'prompt-assets', true)
on conflict (id) do nothing;

do $$
begin
  begin
    create policy "prompt_assets_public_read"
    on storage.objects for select
    using (bucket_id = 'prompt-assets');
  exception
    when duplicate_object then null;
  end;

  begin
    create policy "prompt_assets_owner_insert"
    on storage.objects for insert
    with check (
      bucket_id = 'prompt-assets'
      and auth.uid() = owner
    );
  exception
    when duplicate_object then null;
  end;

  begin
    create policy "prompt_assets_owner_update"
    on storage.objects for update using (
      bucket_id = 'prompt-assets'
      and auth.uid() = owner
    );
  exception
    when duplicate_object then null;
  end;

  begin
    create policy "prompt_assets_owner_delete"
    on storage.objects for delete using (
      bucket_id = 'prompt-assets'
      and auth.uid() = owner
    );
  exception
    when duplicate_object then null;
  end;
end $$;

-- ============================================================================
-- End of schema
-- ============================================================================

