-- Migration: seed sample data for development/testing
-- Timestamp: 2025-12-11 12:40:00

-- NOTE: This seed creates sample rows but does NOT create auth users or secrets.
-- Create a sample project, a published post, a comment and a file record.

insert into public.projects (id, name, description, created_by, created_at)
values
  ('00000000-0000-0000-0000-000000000001', 'Sample Project', 'This is a seeded sample project.', null, now())
on conflict (id) do nothing;

insert into public.posts (id, project_id, title, body, published, created_by, created_at)
values
  ('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000001', 'Welcome', 'This is a seeded welcome post.', true, null, now())
on conflict (id) do nothing;

insert into public.comments (id, post_id, body, created_by, created_at)
values
  ('00000000-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000011', 'Nice post!', null, now())
on conflict (id) do nothing;

insert into public.files (id, owner_id, project_id, name, mime_type, url, size, created_at)
values
  ('00000000-0000-0000-0000-000000000031', null, '00000000-0000-0000-0000-000000000001', 'readme.md', 'text/markdown', 'https://example.com/readme.md', 1024, now())
on conflict (id) do nothing;

-- Create a public profile row for a pseudo-user to make testing easier (no auth link)
insert into public.profiles (id, username, full_name, created_at)
values
  ('00000000-0000-0000-0000-0000000000ff', 'seed.user', 'Seed User', now())
on conflict (id) do nothing;
