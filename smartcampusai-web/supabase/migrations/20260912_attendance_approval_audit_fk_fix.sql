alter table attendance_approval_audit
  alter column attendance_student_id drop not null;

alter table attendance_approval_audit
  drop constraint if exists attendance_approval_audit_attendance_student_id_fkey;

create index if not exists
  idx_attendance_approval_audit_student
  on attendance_approval_audit (attendance_student_id);
