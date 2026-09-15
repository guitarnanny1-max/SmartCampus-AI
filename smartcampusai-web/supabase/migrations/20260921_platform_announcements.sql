create table public."PlatformAnnouncement" (
  id text primary key,
  title text not null,
  message text not null,
  type text not null default 'INFO'
    check (type in ('INFO', 'SUCCESS', 'WARNING', 'CRITICAL')),
  status text not null default 'DRAFT'
    check (status in ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
  startsAt timestamptz,
  endsAt timestamptz,
  createdByUserId text,
  createdAt timestamptz not null default now(),
  updatedAt timestamptz not null default now()
);

create index "PlatformAnnouncement_status_idx"
  on public."PlatformAnnouncement" (status);

create index "PlatformAnnouncement_startsAt_idx"
  on public."PlatformAnnouncement" ("startsAt");

create index "PlatformAnnouncement_createdAt_idx"
  on public."PlatformAnnouncement" ("createdAt" desc);

grant select, insert, update, delete
on public."PlatformAnnouncement"
to service_role;
