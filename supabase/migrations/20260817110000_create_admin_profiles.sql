create table public.admin_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.admin_profiles enable row level security;

create policy "Users can read their own admin profile"
  on public.admin_profiles
  for select
  to authenticated
  using ((select auth.uid()) = id);

create unique index admin_profiles_single_admin
  on public.admin_profiles ((is_admin))
  where is_admin;

comment on table public.admin_profiles is
  'Single-admin authorization contract. Exactly zero or one profile may have is_admin = true.';
