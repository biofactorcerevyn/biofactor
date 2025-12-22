-- Migration: create core tables for profiles, projects, posts, comments, files
-- Timestamp: 2025-12-11 12:25:00

-- Ensure pgcrypto for gen_random_uuid()
create extension if not exists pgcrypto;

-- Profiles table: one-to-one with auth.users (id = auth.users.id)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  username TEXT,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  department TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

create index if not exists profiles_created_at_idx on public.profiles (created_at);

-- Projects
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  deleted_at timestamptz
);
create index if not exists projects_created_by_idx on public.projects (created_by);
create index if not exists projects_created_at_idx on public.projects (created_at);

-- Posts (can be used for blog/announcements)
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects (id) on delete cascade,
  title text not null,
  body text,
  published boolean default false not null,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  deleted_at timestamptz
);
create index if not exists posts_project_id_idx on public.posts (project_id);
create index if not exists posts_created_by_idx on public.posts (created_by);
create index if not exists posts_published_idx on public.posts (published);

-- Comments
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.posts (id) on delete cascade,
  parent_id uuid references public.comments (id) on delete cascade,
  body text not null,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  deleted_at timestamptz
);
create index if not exists comments_post_id_idx on public.comments (post_id);

-- Files metadata
create table if not exists public.files (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users (id) on delete set null,
  project_id uuid references public.projects (id) on delete set null,
  name text not null,
  mime_type text,
  url text,
  size bigint,
  created_at timestamptz default now() not null,
  deleted_at timestamptz
);
create index if not exists files_owner_id_idx on public.files (owner_id);

-- Project members (join table)
create table if not exists public.project_members (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects (id) on delete cascade,
  user_id uuid references auth.users (id) on delete cascade,
  role text,
  created_at timestamptz default now() not null
);
create unique index if not exists project_members_unique on public.project_members (project_id, user_id);
