-- KMB birthday wall: run this once in Supabase → SQL Editor → New query → Run.

create table if not exists public.messages (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null check (char_length(btrim(name)) between 1 and 30),
  message     text not null check (char_length(btrim(message)) between 1 and 400),
  vibe        text not null default 'hype' check (vibe in ('hype','roast','vibes'))
);

alter table public.messages enable row level security;

-- Anyone with the page can read the wall...
drop policy if exists "read messages" on public.messages;
create policy "read messages" on public.messages
  for select to anon, authenticated using (true);

-- ...and post a message. No updates or deletes from the page (you moderate in the dashboard).
drop policy if exists "post messages" on public.messages;
create policy "post messages" on public.messages
  for insert to anon, authenticated
  with check (
    char_length(btrim(name)) between 1 and 30
    and char_length(btrim(message)) between 1 and 400
    and vibe in ('hype','roast','vibes')
  );

-- Live updates so new messages pop in without a refresh.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'messages'
  ) then
    alter publication supabase_realtime add table public.messages;
  end if;
end $$;
