-- ─── About Content (singleton row) ──────────────────────────────────────
-- One-row table that stores all about-page chapter content as JSONB.
-- Singleton enforced by a constant primary key value 'singleton'.

create table if not exists public.about_content (
  id          text primary key default 'singleton',
  origin      jsonb not null default '{}'::jsonb,
  guild       jsonb not null default '{}'::jsonb,
  factions    jsonb not null default '[]'::jsonb,
  stats       jsonb not null default '[]'::jsonb,
  save_file   jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now(),
  -- guarantees only one row can ever exist
  constraint about_content_singleton check (id = 'singleton')
);

-- Seed empty row so reads always return something
insert into public.about_content (id) values ('singleton')
on conflict (id) do nothing;

-- ─── RLS ────────────────────────────────────────────────────────────────
alter table public.about_content enable row level security;

-- Public can read
drop policy if exists "about_content_public_read" on public.about_content;
create policy "about_content_public_read"
  on public.about_content
  for select
  using (true);

-- No public writes (all writes go through API routes using service role)
