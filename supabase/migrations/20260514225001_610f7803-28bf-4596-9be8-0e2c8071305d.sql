create table if not exists public.stripe_events (
  event_id text primary key,
  type text,
  environment text,
  processed_at timestamptz not null default now()
);
alter table public.stripe_events enable row level security;
create policy "Block client access to stripe events"
  on public.stripe_events for select
  using (false);