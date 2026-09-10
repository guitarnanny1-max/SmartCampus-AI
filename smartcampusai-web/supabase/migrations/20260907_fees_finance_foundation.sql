-- ============================================================
-- SmartCampusAI
-- Fees & Finance Foundation
-- ============================================================

-- ------------------------------------------------------------
-- 1. Fee Types
-- ------------------------------------------------------------
create table if not exists fee_types (
  id text primary key,
  "tenantId" text not null references "Tenant"(id),
  name text not null,
  code text,
  description text,
  status text not null default 'ACTIVE',
  created_at timestamp without time zone not null default now(),
  updated_at timestamp without time zone not null default now(),

  constraint fee_types_tenant_name_unique
    unique ("tenantId", name)
);

create index if not exists idx_fee_types_tenant
  on fee_types ("tenantId");


-- ------------------------------------------------------------
-- 2. Fee Structures
-- Defines what a fee costs for an academic year/class.
-- ------------------------------------------------------------
create table if not exists fee_structures (
  id text primary key,
  "tenantId" text not null references "Tenant"(id),
  academic_year_id text not null references academic_years(id),
  class_id text not null references classes(id),
  fee_type_id text not null references fee_types(id),
  amount numeric(12,2) not null default 0,
  frequency text not null default 'ANNUAL',
  due_date date,
  description text,
  status text not null default 'ACTIVE',
  created_at timestamp without time zone not null default now(),
  updated_at timestamp without time zone not null default now(),

  constraint fee_structures_amount_nonnegative
    check (amount >= 0),

  constraint fee_structures_unique
    unique (
      academic_year_id,
      class_id,
      fee_type_id,
      frequency
    )
);

create index if not exists idx_fee_structures_tenant
  on fee_structures ("tenantId");

create index if not exists idx_fee_structures_year_class
  on fee_structures (academic_year_id, class_id);

create index if not exists idx_fee_structures_fee_type
  on fee_structures (fee_type_id);


-- ------------------------------------------------------------
-- 3. Student Fees
-- Actual fee obligations assigned to students.
-- ------------------------------------------------------------
create table if not exists student_fees (
  id text primary key,
  "tenantId" text not null references "Tenant"(id),
  student_id text not null references "Student"(id),
  enrollment_id text references student_enrollments(id),
  academic_year_id text not null references academic_years(id),
  fee_structure_id text references fee_structures(id),
  fee_type_id text not null references fee_types(id),
  amount numeric(12,2) not null default 0,
  discount_amount numeric(12,2) not null default 0,
  net_amount numeric(12,2) not null default 0,
  due_date date,
  status text not null default 'PENDING',
  remarks text,
  created_at timestamp without time zone not null default now(),
  updated_at timestamp without time zone not null default now(),

  constraint student_fees_amount_nonnegative
    check (amount >= 0),

  constraint student_fees_discount_nonnegative
    check (discount_amount >= 0),

  constraint student_fees_net_nonnegative
    check (net_amount >= 0)
);

create index if not exists idx_student_fees_tenant
  on student_fees ("tenantId");

create index if not exists idx_student_fees_student
  on student_fees (student_id);

create index if not exists idx_student_fees_enrollment
  on student_fees (enrollment_id);

create index if not exists idx_student_fees_year
  on student_fees (academic_year_id);

create index if not exists idx_student_fees_status
  on student_fees (status);


-- ------------------------------------------------------------
-- 4. Fee Payments
-- Individual collections against student fee obligations.
-- ------------------------------------------------------------
create table if not exists fee_payments (
  id text primary key,
  "tenantId" text not null references "Tenant"(id),
  student_id text not null references "Student"(id),
  academic_year_id text not null references academic_years(id),
  payment_date date not null default current_date,
  amount numeric(12,2) not null default 0,
  payment_method text not null default 'CASH',
  transaction_reference text,
  status text not null default 'COMPLETED',
  remarks text,
  collected_by text references "User"(id),
  created_at timestamp without time zone not null default now(),
  updated_at timestamp without time zone not null default now(),

  constraint fee_payments_amount_positive
    check (amount > 0)
);

create index if not exists idx_fee_payments_tenant
  on fee_payments ("tenantId");

create index if not exists idx_fee_payments_student
  on fee_payments (student_id);

create index if not exists idx_fee_payments_year
  on fee_payments (academic_year_id);

create index if not exists idx_fee_payments_date
  on fee_payments (payment_date);

create index if not exists idx_fee_payments_status
  on fee_payments (status);


-- ------------------------------------------------------------
-- 5. Fee Payment Allocations
-- Allows one payment to be allocated across multiple fees.
-- ------------------------------------------------------------
create table if not exists fee_payment_allocations (
  id text primary key,
  "tenantId" text not null references "Tenant"(id),
  payment_id text not null references fee_payments(id) on delete cascade,
  student_fee_id text not null references student_fees(id),
  amount numeric(12,2) not null default 0,
  created_at timestamp without time zone not null default now(),

  constraint fee_payment_allocations_amount_positive
    check (amount > 0),

  constraint fee_payment_allocations_unique
    unique (payment_id, student_fee_id)
);

create index if not exists idx_fee_payment_allocations_tenant
  on fee_payment_allocations ("tenantId");

create index if not exists idx_fee_payment_allocations_payment
  on fee_payment_allocations (payment_id);

create index if not exists idx_fee_payment_allocations_student_fee
  on fee_payment_allocations (student_fee_id);


-- ------------------------------------------------------------
-- 6. Fee Receipts
-- Printable receipt generated for a payment.
-- ------------------------------------------------------------
create table if not exists fee_receipts (
  id text primary key,
  "tenantId" text not null references "Tenant"(id),
  payment_id text not null references fee_payments(id),
  receipt_number text not null,
  receipt_date date not null default current_date,
  issued_to_student_id text not null references "Student"(id),
  total_amount numeric(12,2) not null default 0,
  status text not null default 'ISSUED',
  remarks text,
  created_at timestamp without time zone not null default now(),
  updated_at timestamp without time zone not null default now(),

  constraint fee_receipts_amount_nonnegative
    check (total_amount >= 0),

  constraint fee_receipts_tenant_number_unique
    unique ("tenantId", receipt_number),

  constraint fee_receipts_payment_unique
    unique (payment_id)
);

create index if not exists idx_fee_receipts_tenant
  on fee_receipts ("tenantId");

create index if not exists idx_fee_receipts_payment
  on fee_receipts (payment_id);

create index if not exists idx_fee_receipts_student
  on fee_receipts (issued_to_student_id);

create index if not exists idx_fee_receipts_date
  on fee_receipts (receipt_date);
