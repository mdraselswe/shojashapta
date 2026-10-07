-- 0001_init: extensions, enums and core tables (docs/04-database.md §2–3).
-- Gamification tables (point_events, district_stamps, profiles.points_total) arrive in Phase 6b.1.

create extension if not exists pg_trgm with schema extensions;
create extension if not exists unaccent with schema extensions;
create extension if not exists postgis with schema extensions;

-- Enums -------------------------------------------------------------------------------------------
create type place_type     as enum ('restaurant', 'shop', 'street_food', 'bakery', 'home_kitchen', 'other');
create type content_status as enum ('active', 'pending', 'hidden', 'closed', 'merged');
create type reaction       as enum ('loved', 'okay', 'disliked');
create type claim_type     as enum ('availability', 'price', 'place_status', 'location', 'opening_hours');
create type claim_status   as enum ('unverified', 'confirmed', 'mixed', 'disputed');
create type verdict        as enum ('correct', 'partial', 'wrong');
create type wrong_reason   as enum ('not_available', 'wrong_price', 'wrong_location', 'closed', 'other');
create type evidence_type  as enum ('photo', 'link');
create type entity_type    as enum ('food', 'place', 'dish', 'district', 'experience', 'claim', 'media', 'profile');
create type review_status  as enum ('open', 'approved', 'rejected');
create type user_role      as enum ('user', 'moderator', 'admin');
create type saved_kind     as enum ('want_to_try');

-- Geography (order matters: profiles references districts) ---------------------------------------
create table districts (
  id smallint primary key,
  slug text unique not null,
  name_bn text not null,
  name_en text not null,
  division_bn text not null,
  division_en text not null,
  center extensions.geography(point),
  place_count int not null default 0,
  search_text text not null default '',
  search_key text not null default ''
);

create table areas (
  id serial primary key,
  district_id smallint not null references districts,
  slug text not null,
  name_bn text not null,
  name_en text,
  unique (district_id, slug)
);

-- People -----------------------------------------------------------------------------------------
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text not null,
  avatar_url text,
  role user_role not null default 'user',
  home_district_id smallint references districts,
  is_banned boolean not null default false,
  created_at timestamptz not null default now()
);

-- Catalog ----------------------------------------------------------------------------------------
create table foods (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_bn text not null,
  name_en text,
  about_bn text,
  cover_media_id uuid,
  status content_status not null default 'active',
  search_text text not null default '',
  search_key text not null default '',
  experience_count int not null default 0,
  loved_count int not null default 0,
  created_by uuid references profiles,
  created_at timestamptz not null default now()
);

create table aliases (
  id bigserial primary key,
  entity entity_type not null,
  entity_id text not null,
  alias text not null,
  search_key text not null,
  unique (entity, entity_id, search_key)
);

create table places (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_bn text not null,
  name_en text,
  type place_type not null default 'restaurant',
  district_id smallint not null references districts,
  area_id int references areas,
  address text,
  location extensions.geography(point),
  opening_hours jsonb,
  price_min int,
  price_max int,
  status content_status not null default 'active',
  merged_into uuid references places,
  search_text text not null default '',
  search_key text not null default '',
  created_by uuid references profiles,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table regional_fame (
  id serial primary key,
  district_id smallint not null references districts,
  area_id int references areas,
  food_id uuid not null references foods,
  note_bn text,
  source_url text,
  sort_order smallint not null default 0,
  unique (district_id, food_id)
);

create table dishes (
  id uuid primary key default gen_random_uuid(),
  place_id uuid not null references places on delete cascade,
  food_id uuid not null references foods,
  display_name text,
  price_min int,
  price_max int,
  price_confirmed_at timestamptz,
  loved_count int not null default 0,
  okay_count int not null default 0,
  disliked_count int not null default 0,
  experience_count int generated always as (loved_count + okay_count + disliked_count) stored,
  wilson_score double precision not null default 0,
  last_experience_at timestamptz,
  status content_status not null default 'active',
  created_at timestamptz not null default now(),
  unique (place_id, food_id)
);

-- Contributions ----------------------------------------------------------------------------------
create table experiences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles,
  dish_id uuid not null references dishes on delete cascade,
  reaction reaction not null,
  comment text check (char_length(comment) <= 500),
  price_paid int check (price_paid between 1 and 100000),
  visited_on date,
  status content_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, dish_id)
);

create table claims (
  id uuid primary key default gen_random_uuid(),
  entity entity_type not null check (entity in ('place', 'dish')),
  entity_id uuid not null,
  type claim_type not null,
  value jsonb not null,
  status claim_status not null default 'unverified',
  correct_count int not null default 0,
  partial_count int not null default 0,
  wrong_count int not null default 0,
  last_confirmed_at timestamptz,
  expires_at timestamptz,
  created_by uuid references profiles,
  created_at timestamptz not null default now(),
  unique (entity, entity_id, type)
);

create table claim_votes (
  id uuid primary key default gen_random_uuid(),
  claim_id uuid not null references claims on delete cascade,
  user_id uuid not null references profiles,
  verdict verdict not null,
  reason wrong_reason,
  note text check (char_length(note) <= 300),
  evidence_type evidence_type,
  evidence_media_id uuid,
  evidence_url text,
  created_at timestamptz not null default now(),
  unique (claim_id, user_id)
);

create table media (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles,
  entity entity_type not null,
  entity_id text not null,
  provider text not null,
  provider_key text not null,
  width int not null,
  height int not null,
  dominant_color text,
  status content_status not null default 'active',
  created_at timestamptz not null default now()
);

create table edit_suggestions (
  id uuid primary key default gen_random_uuid(),
  entity entity_type not null,
  entity_id text not null,
  field text not null,
  current_value text,
  proposed_value text not null,
  note text,
  user_id uuid not null references profiles,
  status review_status not null default 'open',
  reviewed_by uuid references profiles,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create table reports (
  id uuid primary key default gen_random_uuid(),
  entity entity_type not null,
  entity_id text not null,
  reason text not null,
  note text,
  user_id uuid not null references profiles,
  status review_status not null default 'open',
  created_at timestamptz not null default now()
);

create table saved_items (
  user_id uuid not null references profiles on delete cascade,
  entity entity_type not null check (entity in ('food', 'dish', 'place')),
  entity_id text not null,
  kind saved_kind not null default 'want_to_try',
  created_at timestamptz not null default now(),
  primary key (user_id, entity, entity_id, kind)
);

-- Operations -------------------------------------------------------------------------------------
create table search_misses (
  search_key text primary key,
  sample_query text not null,
  count int not null default 1,
  last_seen_at timestamptz not null default now()
);

create table rate_limit_events (
  id bigserial primary key,
  user_id uuid not null,
  action text not null,
  created_at timestamptz not null default now()
);
