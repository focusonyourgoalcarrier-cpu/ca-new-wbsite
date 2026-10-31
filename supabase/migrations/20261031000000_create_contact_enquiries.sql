create table if not exists public.contact_enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  business text,
  email text not null,
  phone text,
  service text,
  message text,
  created_at timestamptz not null default now()
);

alter table public.contact_enquiries enable row level security;

-- Enquiries are inserted only by the Edge Function using the server-side service role.
-- No anon/authenticated table policies are granted, so browser clients cannot read submissions.
revoke all on table public.contact_enquiries from public, anon, authenticated;
grant insert on table public.contact_enquiries to service_role;

