-- ============================================================
-- SmartCampusAI - Student 360 Foundation
-- Adds student profile and guardian relationships.
-- Existing Student and Applicant tables are NOT modified.
-- ============================================================

-- ------------------------------------------------------------
-- 1. STUDENT PROFILES
-- One profile per Student.
-- ------------------------------------------------------------

create table if not exists student_profiles (
  id text primary key,
  "tenantId" text not null references "Tenant"(id) on delete cascade,
  student_id text not null references "Student"(id) on delete cascade,

  first_name text,
  middle_name text,
  last_name text,

  date_of_birth date,
  gender text,

  address_line1 text,
  address_line2 text,
  city text,
  state text,
  country text default 'India',
  postal_code text,

  created_at timestamp without time zone not null default now(),
  updated_at timestamp without time zone not null default now(),

  constraint student_profiles_student_unique
    unique (student_id)
);

create index if not exists student_profiles_tenant_idx
  on student_profiles ("tenantId");

create index if not exists student_profiles_student_idx
  on student_profiles (student_id);


-- ------------------------------------------------------------
-- 2. STUDENT GUARDIANS
-- Multiple guardians can belong to one Student.
-- ------------------------------------------------------------

create table if not exists student_guardians (
  id text primary key,
  "tenantId" text not null references "Tenant"(id) on delete cascade,
  student_id text not null references "Student"(id) on delete cascade,

  name text not null,
  relationship text,

  email text,
  phone text,

  is_primary boolean not null default false,
  is_emergency_contact boolean not null default false,

  created_at timestamp without time zone not null default now(),
  updated_at timestamp without time zone not null default now()
);

create index if not exists student_guardians_tenant_idx
  on student_guardians ("tenantId");

create index if not exists student_guardians_student_idx
  on student_guardians (student_id);

create index if not exists student_guardians_primary_idx
  on student_guardians (student_id, is_primary);

create index if not exists student_guardians_emergency_idx
  on student_guardians (student_id, is_emergency_contact);


-- ------------------------------------------------------------
-- 3. UPDATED_AT TRIGGER FUNCTION
-- Reuse existing function if the project already has one.
-- ------------------------------------------------------------

create or replace function update_student_360_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;


-- ------------------------------------------------------------
-- 4. UPDATED_AT TRIGGERS
-- ------------------------------------------------------------

drop trigger if exists student_profiles_updated_at
  on student_profiles;

create trigger student_profiles_updated_at
before update on student_profiles
for each row
execute function update_student_360_updated_at();


drop trigger if exists student_guardians_updated_at
  on student_guardians;

create trigger student_guardians_updated_at
before update on student_guardians
for each row
execute function update_student_360_updated_at();
