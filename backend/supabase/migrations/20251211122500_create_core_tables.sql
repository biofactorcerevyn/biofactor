-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.campaigns (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL,
  status text NOT NULL DEFAULT 'planned'::text,
  start_date date,
  end_date date,
  budget numeric,
  spent numeric,
  target numeric,
  achieved numeric,
  area text,
  campaign_run_by text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT campaigns_pkey PRIMARY KEY (id)
);
CREATE TABLE public.dealers (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  business_name text,
  email text,
  phone text NOT NULL,
  address text,
  city text,
  state text,
  region_id uuid,
  gps_lat numeric,
  gps_lng numeric,
  kyc_status text DEFAULT 'pending'::text,
  kyc_documents jsonb DEFAULT '[]'::jsonb,
  credit_limit numeric DEFAULT 0,
  outstanding_balance numeric DEFAULT 0,
  status text DEFAULT 'active'::text,
  user_id uuid,
  created_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  rating real DEFAULT '3.5'::real,
  region text,
  CONSTRAINT dealers_pkey PRIMARY KEY (id),
  CONSTRAINT dealers_region_id_fkey FOREIGN KEY (region_id) REFERENCES public.regions(id),
  CONSTRAINT dealers_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT dealers_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id)
);
CREATE TABLE public.orders (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  dealer_id uuid NOT NULL,
  order_date timestamp with time zone DEFAULT now(),
  expected_delivery date,
  status text DEFAULT 'pending'::text,
  total_amount numeric DEFAULT 0,
  discount_amount numeric DEFAULT 0,
  tax_amount numeric DEFAULT 0,
  net_amount numeric DEFAULT 0,
  payment_status text DEFAULT 'unpaid'::text,
  user_id uuid,
  created_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  zone text,
  area text,
  designation text,
  action text,
  CONSTRAINT orders_pkey PRIMARY KEY (id),
  CONSTRAINT orders_dealer_id_fkey FOREIGN KEY (dealer_id) REFERENCES public.dealers(id),
  CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT orders_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id)
);
CREATE TABLE public.posts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  project_id uuid,
  title text NOT NULL,
  body text,
  published boolean NOT NULL DEFAULT false,
  created_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  deleted_at timestamp with time zone,
  CONSTRAINT posts_pkey PRIMARY KEY (id),
  CONSTRAINT posts_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id),
  CONSTRAINT posts_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  email text NOT NULL,
  password text NOT NULL,
  username text NOT NULL,
  full_name text NOT NULL,
  phone text,
  avatar_url text,
  department text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  role text NOT NULL,
  CONSTRAINT profiles_pkey PRIMARY KEY (id)
);
CREATE TABLE public.projects (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  deleted_at timestamp with time zone,
  CONSTRAINT projects_pkey PRIMARY KEY (id),
  CONSTRAINT projects_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id)
);
CREATE TABLE public.regions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text NOT NULL UNIQUE,
  zone text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT regions_pkey PRIMARY KEY (id)
);
CREATE TABLE public.roles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  permissions jsonb DEFAULT '[]'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT roles_pkey PRIMARY KEY (id)
);

-- -- Migration: create core tables for profiles, projects, posts, comments, files
-- -- Timestamp: 2025-12-11 12:25:00

-- -- Ensure pgcrypto for gen_random_uuid()
-- create extension if not exists pgcrypto;

-- -- Profiles table: one-to-one with auth.users (id = auth.users.id)
-- CREATE TABLE public.profiles (
--   id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
--   email TEXT NOT NULL,
--   password TEXT NOT NULL,
--   username TEXT,
--   full_name TEXT,
--   phone TEXT,
--   avatar_url TEXT,
--   department TEXT,
--   created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
--   updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
-- );

-- create index if not exists profiles_created_at_idx on public.profiles (created_at);

-- -- Projects
-- create table if not exists public.projects (
--   id uuid primary key default gen_random_uuid(),
--   name text not null,
--   description text,
--   created_by uuid references auth.users (id) on delete set null,
--   created_at timestamptz default now() not null,
--   updated_at timestamptz default now() not null,
--   deleted_at timestamptz
-- );
-- create index if not exists projects_created_by_idx on public.projects (created_by);
-- create index if not exists projects_created_at_idx on public.projects (created_at);

-- -- Posts (can be used for blog/announcements)
-- create table if not exists public.posts (
--   id uuid primary key default gen_random_uuid(),
--   project_id uuid references public.projects (id) on delete cascade,
--   title text not null,
--   body text,
--   published boolean default false not null,
--   created_by uuid references auth.users (id) on delete set null,
--   created_at timestamptz default now() not null,
--   updated_at timestamptz default now() not null,
--   deleted_at timestamptz
-- );
-- create index if not exists posts_project_id_idx on public.posts (project_id);
-- create index if not exists posts_created_by_idx on public.posts (created_by);
-- create index if not exists posts_published_idx on public.posts (published);

-- -- Comments
-- create table if not exists public.comments (
--   id uuid primary key default gen_random_uuid(),
--   post_id uuid references public.posts (id) on delete cascade,
--   parent_id uuid references public.comments (id) on delete cascade,
--   body text not null,
--   created_by uuid references auth.users (id) on delete set null,
--   created_at timestamptz default now() not null,
--   updated_at timestamptz default now() not null,
--   deleted_at timestamptz
-- );
-- create index if not exists comments_post_id_idx on public.comments (post_id);

-- -- Files metadata
-- create table if not exists public.files (
--   id uuid primary key default gen_random_uuid(),
--   owner_id uuid references auth.users (id) on delete set null,
--   project_id uuid references public.projects (id) on delete set null,
--   name text not null,
--   mime_type text,
--   url text,
--   size bigint,
--   created_at timestamptz default now() not null,
--   deleted_at timestamptz
-- );
-- create index if not exists files_owner_id_idx on public.files (owner_id);

-- -- Project members (join table)
-- create table if not exists public.project_members (
--   id uuid primary key default gen_random_uuid(),
--   project_id uuid references public.projects (id) on delete cascade,
--   user_id uuid references auth.users (id) on delete cascade,
--   role text,
--   created_at timestamptz default now() not null
-- );
-- create unique index if not exists project_members_unique on public.project_members (project_id, user_id);
