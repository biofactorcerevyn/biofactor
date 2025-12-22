-- Enable RLS
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
alter table public.posts enable row level security;
alter table public.comments enable row level security;

-------------------------
-- PROFILES POLICIES
-------------------------

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY profiles_insert_any
ON public.profiles
FOR INSERT
WITH CHECK (true);

CREATE POLICY profiles_select_own
ON public.profiles
FOR SELECT
USING (id = auth.uid());

CREATE POLICY profiles_update_own
ON public.profiles
FOR UPDATE
USING (id = auth.uid());

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);


-------------------------
-- POSTS POLICIES
-------------------------

drop policy if exists "posts_insert_owner" on public.posts;
create policy "posts_insert_owner"
on public.posts
for insert
to authenticated
with check (auth.uid() = owner);

drop policy if exists "posts_select_published_or_own" on public.posts;
create policy "posts_select_published_or_own"
on public.posts
for select
using (is_published = true OR auth.uid() = owner);

drop policy if exists "posts_update_own" on public.posts;
create policy "posts_update_own"
on public.posts
for update
to authenticated
using (auth.uid() = owner)
with check (auth.uid() = owner);

drop policy if exists "posts_delete_own" on public.posts;
create policy "posts_delete_own"
on public.posts
for delete
to authenticated
using (auth.uid() = owner);


-------------------------
-- COMMENTS POLICIES
-------------------------

drop policy if exists "comments_insert_owner" on public.comments;
create policy "comments_insert_owner"
on public.comments
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "comments_select_public_or_own" on public.comments;
create policy "comments_select_public_or_own"
on public.comments
for select
using (true); -- allow all reads

drop policy if exists "comments_update_own" on public.comments;
create policy "comments_update_own"
on public.comments
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "comments_delete_own" on public.comments;
create policy "comments_delete_own"
on public.comments
for delete
to authenticated
using (auth.uid() = user_id);


DROP POLICY IF EXISTS users_select_admin_or_self ON public.users;
CREATE POLICY users_select_admin_or_self
ON public.users
FOR SELECT
TO authenticated
USING (
  auth.uid() = auth_user_id
  OR EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = 'super_admin'
  )
);

DROP POLICY IF EXISTS users_insert_admin ON public.users;
CREATE POLICY users_insert_admin
ON public.users
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = 'super_admin'
  )
);

DROP POLICY IF EXISTS users_update_admin_or_self ON public.users;
CREATE POLICY users_update_admin_or_self
ON public.users
FOR UPDATE
TO authenticated
USING (
  auth.uid() = auth_user_id
  OR EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = 'super_admin'
  )
)
WITH CHECK (
  auth.uid() = auth_user_id
  OR EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = 'super_admin'
  )
);

DROP POLICY IF EXISTS users_delete_admin ON public.users;
CREATE POLICY users_delete_admin
ON public.users
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = 'super_admin'
  )
);

