create table if not exists public."PlatformAuditLog" (
  id text primary key,
  actorUserId text,
  actorEmail text,
  action text not null,
  resourceType text not null,
  resourceId text,
  description text not null,
  metadata jsonb,
  createdAt timestamptz not null default now()
);

create index if not exists "PlatformAuditLog_createdAt_idx"
  on public."PlatformAuditLog" ("createdAt" desc);

create index if not exists "PlatformAuditLog_actorUserId_idx"
  on public."PlatformAuditLog" ("actorUserId");

create index if not exists "PlatformAuditLog_resource_idx"
  on public."PlatformAuditLog" ("resourceType", "resourceId");

grant select, insert, update, delete
on public."PlatformAuditLog"
to service_role;
