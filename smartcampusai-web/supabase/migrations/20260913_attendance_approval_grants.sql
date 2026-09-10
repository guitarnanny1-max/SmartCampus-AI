grant usage on schema public to service_role;

grant select, insert, update, delete
  on public.attendance_approvals
  to service_role;

grant select, insert, update, delete
  on public.attendance_approval_audit
  to service_role;
