create table public."PlatformSettings" (
  id text primary key,
  "platformName" text not null default 'SmartCampusAI',
  "supportEmail" text,
  "supportPhone" text,
  currency text not null default 'INR',
  timezone text not null default 'Asia/Kolkata',
  "maintenanceMode" boolean not null default false,
  "schoolCreationEnabled" boolean not null default true,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

insert into public."PlatformSettings" (
  id,
  "platformName",
  currency,
  timezone
)
values (
  'platform_settings',
  'SmartCampusAI',
  'INR',
  'Asia/Kolkata'
);

grant select, insert, update, delete
on public."PlatformSettings"
to service_role;
