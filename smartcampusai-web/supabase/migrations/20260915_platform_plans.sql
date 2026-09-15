create table if not exists public."PlatformPlan" (
  id text primary key,
  name text not null unique,
  "monthlyPrice" numeric(12,2),
  "annualPrice" numeric(12,2),
  "studentLimit" integer,
  "teacherLimit" integer,
  "isActive" boolean not null default true,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now(),
  constraint "PlatformPlan_name_check"
    check (name in ('STARTER', 'PROFESSIONAL', 'ENTERPRISE')),
  constraint "PlatformPlan_studentLimit_check"
    check ("studentLimit" is null or "studentLimit" >= 0),
  constraint "PlatformPlan_teacherLimit_check"
    check ("teacherLimit" is null or "teacherLimit" >= 0),
  constraint "PlatformPlan_monthlyPrice_check"
    check ("monthlyPrice" is null or "monthlyPrice" >= 0),
  constraint "PlatformPlan_annualPrice_check"
    check ("annualPrice" is null or "annualPrice" >= 0)
);

insert into public."PlatformPlan" (id, name)
values
  ('platform_plan_starter', 'STARTER'),
  ('platform_plan_professional', 'PROFESSIONAL'),
  ('platform_plan_enterprise', 'ENTERPRISE')
on conflict (name) do nothing;

grant select, insert, update, delete on public."PlatformPlan" to service_role;
