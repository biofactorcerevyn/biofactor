-- Migration: functions and triggers (auto-create profile on signup)
-- Timestamp: 2025-12-11 12:35:00

-- Function to create a profile record when a new auth user is created
create or replace function public.on_auth_user_created()
returns trigger
language plpgsql
as $$
begin
  -- Insert a profile record for the new user; if it exists, do nothing
  insert into public.profiles (id, username, full_name, created_at)
  values (new.id, coalesce(new.email, ''), coalesce(new.user_metadata->> 'full_name', ''), now())
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Trigger on auth.users to call the function after insert
-- Note: Supabase allows triggers on auth.users; this will run on signup
drop trigger if exists auth_user_created on auth.users;
create trigger auth_user_created
  after insert on auth.users
  for each row execute procedure public.on_auth_user_created();

-- Function to update updated_at on modified rows for convenience
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Attach touch_updated_at to projects, posts, comments, files
drop trigger if exists projects_touch_updated_at on public.projects;
create trigger projects_touch_updated_at
  before update on public.projects
  for each row execute procedure public.touch_updated_at();

drop trigger if exists posts_touch_updated_at on public.posts;
create trigger posts_touch_updated_at
  before update on public.posts
  for each row execute procedure public.touch_updated_at();

drop trigger if exists comments_touch_updated_at on public.comments;
create trigger comments_touch_updated_at
  before update on public.comments
  for each row execute procedure public.touch_updated_at();

drop trigger if exists files_touch_updated_at on public.files;
create trigger files_touch_updated_at
  before update on public.files
  for each row execute procedure public.touch_updated_at();
