-- SmartCampusAI
-- School Period Timings

create table if not exists period_timings (
  id text primary key,
  "tenantId" text not null references "Tenant"(id) on delete cascade,
  academic_year_id text not null references academic_years(id) on delete cascade,

  period_number integer not null,
  name text not null,
  start_time time not null,
  end_time time not null,

  is_break boolean not null default false,
  status text not null default 'ACTIVE',

  created_at timestamp without time zone not null default now(),
  updated_at timestamp without time zone not null default now(),

  constraint period_timings_period_unique
    unique ("tenantId", academic_year_id, period_number),

  constraint period_timings_period_positive
    check (period_number > 0),

  constraint period_timings_time_order
    check (end_time > start_time)
);

create index if not exists idx_period_timings_tenant
  on period_timings ("tenantId");

create index if not exists idx_period_timings_academic_year
  on period_timings (academic_year_id);

grant select, insert, update, delete
on table public.period_timings
to service_role;
