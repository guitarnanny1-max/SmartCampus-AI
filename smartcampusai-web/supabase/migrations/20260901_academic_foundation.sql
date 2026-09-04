-- ============================================================
-- SmartCampusAI Academic Foundation
-- V25
--
-- PURPOSE:
--   Class / Section / Subject / Enrollment / Timetable /
--   Class-period student attendance
--
-- SAFETY:
--   Existing Attendance and teacher_attendance are untouched.
--   Existing teacher_assignments is untouched.
-- ============================================================

create table if not exists academic_years (
  id text primary key,
  "tenantId" text not null references "Tenant"(id),
  name text not null,
  start_date date,
  end_date date,
  status text not null default 'ACTIVE',
  created_at timestamp without time zone not null default now(),
  updated_at timestamp without time zone not null default now(),

  constraint academic_years_tenant_name_unique
    unique ("tenantId", name)
);

create index if not exists idx_academic_years_tenant
  on academic_years ("tenantId");


create table if not exists classes (
  id text primary key,
  "tenantId" text not null references "Tenant"(id),
  academic_year_id text not null references academic_years(id),
  name text not null,
  display_order integer not null default 0,
  status text not null default 'ACTIVE',
  created_at timestamp without time zone not null default now(),
  updated_at timestamp without time zone not null default now(),

  constraint classes_year_name_unique
    unique (academic_year_id, name)
);

create index if not exists idx_classes_tenant
  on classes ("tenantId");

create index if not exists idx_classes_academic_year
  on classes (academic_year_id);


create table if not exists sections (
  id text primary key,
  "tenantId" text not null references "Tenant"(id),
  class_id text not null references classes(id) on delete cascade,
  name text not null,
  display_order integer not null default 0,
  status text not null default 'ACTIVE',
  created_at timestamp without time zone not null default now(),
  updated_at timestamp without time zone not null default now(),

  constraint sections_class_name_unique
    unique (class_id, name)
);

create index if not exists idx_sections_tenant
  on sections ("tenantId");

create index if not exists idx_sections_class
  on sections (class_id);


create table if not exists subjects (
  id text primary key,
  "tenantId" text not null references "Tenant"(id),
  name text not null,
  code text,
  status text not null default 'ACTIVE',
  created_at timestamp without time zone not null default now(),
  updated_at timestamp without time zone not null default now(),

  constraint subjects_tenant_name_unique
    unique ("tenantId", name)
);

create index if not exists idx_subjects_tenant
  on subjects ("tenantId");


create table if not exists student_enrollments (
  id text primary key,
  "tenantId" text not null references "Tenant"(id),
  student_id text not null references "Student"(id),
  academic_year_id text not null references academic_years(id),
  class_id text not null references classes(id),
  section_id text not null references sections(id),
  roll_number text,
  status text not null default 'ACTIVE',
  enrolled_at date,
  created_at timestamp without time zone not null default now(),
  updated_at timestamp without time zone not null default now(),

  constraint student_enrollment_unique
    unique (student_id, academic_year_id)
);

create index if not exists idx_student_enrollments_tenant
  on student_enrollments ("tenantId");

create index if not exists idx_student_enrollments_class_section
  on student_enrollments (class_id, section_id);

create index if not exists idx_student_enrollments_student
  on student_enrollments (student_id);


create table if not exists class_subjects (
  id text primary key,
  "tenantId" text not null references "Tenant"(id),
  class_id text not null references classes(id) on delete cascade,
  subject_id text not null references subjects(id) on delete cascade,
  status text not null default 'ACTIVE',
  created_at timestamp without time zone not null default now(),

  constraint class_subject_unique
    unique (class_id, subject_id)
);

create index if not exists idx_class_subjects_tenant
  on class_subjects ("tenantId");


create table if not exists timetables (
  id text primary key,
  "tenantId" text not null references "Tenant"(id),
  academic_year_id text not null references academic_years(id),
  class_id text not null references classes(id),
  section_id text not null references sections(id),
  subject_id text not null references subjects(id),
  teacher_id text,
  day_of_week integer not null,
  period_number integer not null,
  start_time time,
  end_time time,
  status text not null default 'ACTIVE',
  created_at timestamp without time zone not null default now(),
  updated_at timestamp without time zone not null default now(),

  constraint timetable_period_unique
    unique (
      section_id,
      day_of_week,
      period_number,
      academic_year_id
    )
);

create index if not exists idx_timetables_tenant
  on timetables ("tenantId");

create index if not exists idx_timetables_class_section
  on timetables (class_id, section_id);

create index if not exists idx_timetables_teacher
  on timetables (teacher_id);


create table if not exists class_period_attendance (
  id text primary key,
  "tenantId" text not null references "Tenant"(id),
  attendance_date date not null,
  academic_year_id text not null references academic_years(id),
  class_id text not null references classes(id),
  section_id text not null references sections(id),
  subject_id text not null references subjects(id),
  period_number integer not null,
  teacher_id text,
  created_at timestamp without time zone not null default now(),
  updated_at timestamp without time zone not null default now(),

  constraint class_period_attendance_unique
    unique (
      section_id,
      attendance_date,
      subject_id,
      period_number,
      academic_year_id
    )
);

create index if not exists idx_class_period_attendance_tenant
  on class_period_attendance ("tenantId");

create index if not exists idx_class_period_attendance_date
  on class_period_attendance (attendance_date);

create index if not exists idx_class_period_attendance_class
  on class_period_attendance (class_id, section_id);


create table if not exists class_period_attendance_students (
  id text primary key,
  "tenantId" text not null references "Tenant"(id),
  class_period_attendance_id text not null
    references class_period_attendance(id)
    on delete cascade,
  student_id text not null references "Student"(id),
  status text not null,
  notes text,
  created_at timestamp without time zone not null default now(),
  updated_at timestamp without time zone not null default now(),

  constraint class_period_student_attendance_unique
    unique (class_period_attendance_id, student_id),

  constraint class_period_student_attendance_status_check
    check (status in ('PRESENT', 'ABSENT'))
);

create index if not exists idx_class_period_students_tenant
  on class_period_attendance_students ("tenantId");

create index if not exists idx_class_period_students_student
  on class_period_attendance_students (student_id);

create index if not exists idx_class_period_students_attendance
  on class_period_attendance_students (class_period_attendance_id);
