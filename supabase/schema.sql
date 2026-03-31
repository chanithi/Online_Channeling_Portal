create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text unique not null,
  role text not null check (role in ('patient', 'doctor', 'centre_admin', 'portal_admin')),
  phone text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

