create table if not exists public."PlatformCustomBill" (
  id text primary key,
  "tenantId" text not null references public."Tenant"(id),
  description text not null,
  amount numeric(12,2) not null,
  "dueDate" date,
  status text not null default 'PENDING',
  notes text,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now(),

  constraint "PlatformCustomBill_amount_check"
    check (amount >= 0),

  constraint "PlatformCustomBill_status_check"
    check (status in ('PENDING', 'PAID', 'OVERDUE', 'CANCELED'))
);

create index if not exists "PlatformCustomBill_tenantId_idx"
  on public."PlatformCustomBill" ("tenantId");

grant select, insert, update, delete
  on public."PlatformCustomBill"
  to service_role;
