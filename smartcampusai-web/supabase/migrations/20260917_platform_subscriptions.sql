create table if not exists public."Subscription" (
  id text primary key,
  "tenantId" text not null references public."Tenant"(id),
  "planId" text not null references public."PlatformPlan"(id),
  status text not null default 'ACTIVE',
  "billingCycle" text not null default 'MONTHLY',
  "startedAt" timestamptz not null default now(),
  "currentPeriodStart" timestamptz not null default now(),
  "currentPeriodEnd" timestamptz,
  "canceledAt" timestamptz,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now(),

  constraint "Subscription_status_check"
    check (status in ('TRIALING', 'ACTIVE', 'PAST_DUE', 'CANCELED', 'EXPIRED')),

  constraint "Subscription_billingCycle_check"
    check ("billingCycle" in ('MONTHLY', 'ANNUAL'))
);

create unique index if not exists "Subscription_one_active_per_tenant"
  on public."Subscription" ("tenantId")
  where status in ('TRIALING', 'ACTIVE', 'PAST_DUE');

grant select, insert, update, delete
  on public."Subscription"
  to service_role;
