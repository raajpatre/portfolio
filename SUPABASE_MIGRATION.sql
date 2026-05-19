-- Enable extension
create extension if not exists "pgcrypto";

-- Projects table
create table public.projects (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  tagline       text not null,
  description   text not null,
  stack         text[] not null default '{}',
  live_url      text,
  repo_url      text,
  screenshots   text[] not null default '{}',
  status        text not null check (status in ('shipped','in_progress')),
  featured      boolean not null default false,
  created_at    timestamptz not null default now()
);

-- Certificates table
create table public.certificates (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  issuer        text not null,
  issued_date   date not null,
  credential_url text,
  image_url     text,
  created_at    timestamptz not null default now()
);

-- Feed entries table
create table public.feed_entries (
  id            uuid primary key default gen_random_uuid(),
  content       text not null,
  category      text not null check (category in ('win','launch','event','contribution')),
  entry_date    date not null,
  link_url      text,
  created_at    timestamptz not null default now()
);

-- Enable RLS
alter table public.projects enable row level security;
alter table public.certificates enable row level security;
alter table public.feed_entries enable row level security;

-- Public read policies (anyone can SELECT)
create policy "public read projects"
  on public.projects for select using (true);
create policy "public read certificates"
  on public.certificates for select using (true);
create policy "public read feed"
  on public.feed_entries for select using (true);

-- No write policies created. All writes go via service role on server only.
-- This means anon key cannot INSERT/UPDATE/DELETE — exactly what we want.
