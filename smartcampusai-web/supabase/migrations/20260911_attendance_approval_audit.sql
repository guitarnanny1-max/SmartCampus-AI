create table if not exists attendance_approval_audit (
  id text primary key,

  "tenantId" text not null
    references "Tenant"(id)
    on delete cascade,

  attendance_student_id text not null
    references class_period_attendance_students(id)
    on delete cascade,

  approval_id text
    references attendance_approvals(id)
    on delete set null,

  action text not null,

  old_status text,

  new_status text not null,

  reason text,

  performed_by text,

  performed_at timestamp without time zone not null default now(),

  created_at timestamp without time zone not null default now(),

  constraint attendance_approval_audit_action_check
    check (
      action in (
        'SUBMITTED',
        'APPROVED',
        'REJECTED',
        'RESUBMITTED'
      )
    ),

  constraint attendance_approval_audit_new_status_check
    check (
      new_status in (
        'PENDING',
        'APPROVED',
        'REJECTED'
      )
    )
);

create index if not exists
  idx_attendance_approval_audit_tenant
  on attendance_approval_audit ("tenantId");

create index if not exists
  idx_attendance_approval_audit_student
  on attendance_approval_audit (attendance_student_id);

create index if not exists
  idx_attendance_approval_audit_approval
  on attendance_approval_audit (approval_id);

create index if not exists
  idx_attendance_approval_audit_performed_at
  on attendance_approval_audit (performed_at);
