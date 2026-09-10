create table if not exists attendance_approvals (
  id text primary key,

  "tenantId" text not null
    references "Tenant"(id)
    on delete cascade,

  attendance_student_id text not null
    references class_period_attendance_students(id)
    on delete cascade,

  status text not null default 'PENDING',

  reason text,

  acted_by text,

  acted_at timestamp without time zone,

  created_at timestamp without time zone not null default now(),

  updated_at timestamp without time zone not null default now(),

  constraint attendance_approval_status_check
    check (status in ('PENDING', 'APPROVED', 'REJECTED'))
);

create unique index if not exists
  uq_attendance_approval_student
  on attendance_approvals (attendance_student_id);

create index if not exists
  idx_attendance_approvals_tenant
  on attendance_approvals ("tenantId");

create index if not exists
  idx_attendance_approvals_status
  on attendance_approvals (status);

create index if not exists
  idx_attendance_approvals_student
  on attendance_approvals (attendance_student_id);
