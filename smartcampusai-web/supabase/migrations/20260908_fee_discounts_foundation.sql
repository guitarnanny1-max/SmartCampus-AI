-- SmartCampusAI
-- Fee Discounts / Concessions / Scholarships Foundation

CREATE TABLE IF NOT EXISTS public.fee_discounts (
  id text PRIMARY KEY,
  "tenantId" text NOT NULL REFERENCES public."Tenant"(id),
  name text NOT NULL,
  code text,
  discount_type text NOT NULL DEFAULT 'FIXED'
    CHECK (discount_type IN ('FIXED', 'PERCENTAGE')),
  value numeric(12,2) NOT NULL
    CHECK (value >= 0),
  description text,
  status text NOT NULL DEFAULT 'ACTIVE'
    CHECK (status IN ('ACTIVE', 'INACTIVE')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE ("tenantId", name)
);

CREATE TABLE IF NOT EXISTS public.student_fee_discounts (
  id text PRIMARY KEY,
  "tenantId" text NOT NULL REFERENCES public."Tenant"(id),
  student_fee_id text NOT NULL REFERENCES public.student_fees(id) ON DELETE CASCADE,
  fee_discount_id text NOT NULL REFERENCES public.fee_discounts(id),
  discount_amount numeric(12,2) NOT NULL
    CHECK (discount_amount >= 0),
  remarks text,
  status text NOT NULL DEFAULT 'APPLIED'
    CHECK (status IN ('APPLIED', 'REVOKED')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (student_fee_id, fee_discount_id)
);

CREATE INDEX IF NOT EXISTS idx_fee_discounts_tenant
  ON public.fee_discounts ("tenantId");

CREATE INDEX IF NOT EXISTS idx_fee_discounts_status
  ON public.fee_discounts ("tenantId", status);

CREATE INDEX IF NOT EXISTS idx_student_fee_discounts_tenant
  ON public.student_fee_discounts ("tenantId");

CREATE INDEX IF NOT EXISTS idx_student_fee_discounts_fee
  ON public.student_fee_discounts (student_fee_id);

CREATE INDEX IF NOT EXISTS idx_student_fee_discounts_discount
  ON public.student_fee_discounts (fee_discount_id);

GRANT USAGE ON SCHEMA public TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE
  ON public.fee_discounts TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE
  ON public.student_fee_discounts TO service_role;
