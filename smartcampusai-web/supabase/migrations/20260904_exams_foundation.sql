-- SmartCampusAI - Exams & Academic Performance Foundation
-- Existing Student, academic and timetable tables are NOT modified.

create table if not exists exams (
  id text primary key,
  "tenantId" text not null references "Tenant"(id) on delete cascade,
  academic_year_id text not null references academic_years(id) on delete cascade,
  name text not null,
  exam_type text not null default 'EXAM',
  start_date date,
  end_date date,
  status text not null default 'DRAFT',
  created_at timestamp without time zone not null default now(),
  updated_at timestamp without time zone not null default now()
);

create index if not exists idx_exams_tenant
  on exams ("tenantId");

create index if not exists idx_exams_academic_year
  on exams (academic_year_id);

create table if not exists exam_subjects (
  id text primary key,
  "tenantId" text not null references "Tenant"(id) on delete cascade,
  exam_id text not null references exams(id) on delete cascade,
  subject_id text not null references subjects(id) on delete cascade,
  max_marks numeric(8,2) not null default 100,
  pass_marks numeric(8,2) not null default 35,
  exam_date date,
  start_time time,
  end_time time,
  created_at timestamp without time zone not null default now(),
  updated_at timestamp without time zone not null default now(),

  constraint exam_subjects_unique
    unique (exam_id, subject_id)
);

create index if not exists idx_exam_subjects_tenant
  on exam_subjects ("tenantId");

create index if not exists idx_exam_subjects_exam
  on exam_subjects (exam_id);

create index if not exists idx_exam_subjects_subject
  on exam_subjects (subject_id);

create table if not exists student_marks (
  id text primary key,
  "tenantId" text not null references "Tenant"(id) on delete cascade,
  exam_id text not null references exams(id) on delete cascade,
  student_id text not null references "Student"(id) on delete cascade,
  subject_id text not null references subjects(id) on delete cascade,
  exam_subject_id text references exam_subjects(id) on delete cascade,
  marks_obtained numeric(8,2),
  max_marks numeric(8,2) not null default 100,
  grade text,
  remarks text,
  created_at timestamp without time zone not null default now(),
  updated_at timestamp without time zone not null default now(),

  constraint student_marks_unique
    unique (exam_id, student_id, subject_id)
);

create index if not exists idx_student_marks_tenant
  on student_marks ("tenantId");

create index if not exists idx_student_marks_exam
  on student_marks (exam_id);

create index if not exists idx_student_marks_student
  on student_marks (student_id);

create index if not exists idx_student_marks_subject
  on student_marks (subject_id);

create table if not exists grading_scales (
  id text primary key,
  "tenantId" text not null references "Tenant"(id) on delete cascade,
  name text not null,
  min_percentage numeric(5,2) not null,
  max_percentage numeric(5,2) not null,
  grade text not null,
  grade_point numeric(5,2),
  description text,
  created_at timestamp without time zone not null default now(),
  updated_at timestamp without time zone not null default now()
);

create index if not exists idx_grading_scales_tenant
  on grading_scales ("tenantId");

create index if not exists idx_grading_scales_percentage
  on grading_scales ("tenantId", min_percentage, max_percentage);

-- Reuse the existing updated_at trigger function when available.
drop trigger if exists trg_exams_updated_at on exams;

create trigger trg_exams_updated_at
before update on exams
for each row
execute function update_updated_at_column();

drop trigger if exists trg_exam_subjects_updated_at on exam_subjects;

create trigger trg_exam_subjects_updated_at
before update on exam_subjects
for each row
execute function update_updated_at_column();

drop trigger if exists trg_student_marks_updated_at on student_marks;

create trigger trg_student_marks_updated_at
before update on student_marks
for each row
execute function update_updated_at_column();

drop trigger if exists trg_grading_scales_updated_at on grading_scales;

create trigger trg_grading_scales_updated_at
before update on grading_scales
for each row
execute function update_updated_at_column();
