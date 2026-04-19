-- ─── Profiles ─────────────────────────────────────────────────────────────────
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text unique not null,
  role text not null check (role in ('patient', 'doctor', 'centre_admin', 'portal_admin')),
  phone text,
  specialization text,       -- doctors only
  qualifications text,       -- doctors only
  bio text,                  -- doctors only
  experience_years int,      -- doctors only
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ─── Channeling centres ───────────────────────────────────────────────────────
create table public.channeling_centres (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text not null,
  phone text,
  email text,
  is_active boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ─── Doctor schedules at centres ─────────────────────────────────────────────
-- One row = a doctor available at a specific centre on a specific day of week
create table public.doctor_centre_schedules (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid not null references public.profiles(id) on delete cascade,
  centre_id uuid not null references public.channeling_centres(id) on delete cascade,
  day_of_week int not null check (day_of_week between 0 and 6),
  start_time time not null,
  end_time time not null,
  slot_duration_minutes int not null default 30,
  total_slots int not null default 6,
  consultation_fee numeric(10,2) not null default 0,
  is_active boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (doctor_id, centre_id, day_of_week)
);

-- ─── Appointments ─────────────────────────────────────────────────────────────
create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.profiles(id) on delete cascade,
  doctor_id uuid not null references public.profiles(id),
  centre_id uuid not null references public.channeling_centres(id),
  schedule_id uuid not null references public.doctor_centre_schedules(id),
  appointment_date date not null,
  appointment_time time not null,
  status text not null default 'pending_payment'
    check (status in ('pending_payment','confirmed','completed','cancelled','rescheduled')),
  reason_for_visit text,
  consultation_fee numeric(10,2) not null default 0,
  booking_reference text not null unique,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Prevent double-booking the same slot
create unique index appointments_slot_unique
  on public.appointments (schedule_id, appointment_date, appointment_time)
  where status in ('pending_payment', 'confirmed');

-- ─── Row Level Security ───────────────────────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.channeling_centres enable row level security;
alter table public.doctor_centre_schedules enable row level security;
alter table public.appointments enable row level security;

create policy "profiles: own row" on public.profiles
  for all using (auth.uid() = id);

create policy "centres: read" on public.channeling_centres
  for select using (auth.role() = 'authenticated');

create policy "schedules: read" on public.doctor_centre_schedules
  for select using (auth.role() = 'authenticated' and is_active = true);

create policy "appointments: patient select" on public.appointments
  for select using (auth.uid() = patient_id);

create policy "appointments: patient insert" on public.appointments
  for insert with check (auth.uid() = patient_id);

create policy "appointments: patient update" on public.appointments
  for update using (auth.uid() = patient_id);

-- ─── auto-update updated_at ───────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_updated_at_profiles
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger set_updated_at_centres
  before update on public.channeling_centres
  for each row execute function public.set_updated_at();

create trigger set_updated_at_schedules
  before update on public.doctor_centre_schedules
  for each row execute function public.set_updated_at();

create trigger set_updated_at_appointments
  before update on public.appointments
  for each row execute function public.set_updated_at();
