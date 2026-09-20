-- Allow the GROWTH SaaS plan in PlatformPlan.

ALTER TABLE "PlatformPlan"
DROP CONSTRAINT "PlatformPlan_name_check";

ALTER TABLE "PlatformPlan"
ADD CONSTRAINT "PlatformPlan_name_check"
CHECK (
  name = ANY (
    ARRAY[
      'STARTER'::text,
      'GROWTH'::text,
      'PROFESSIONAL'::text,
      'ENTERPRISE'::text
    ]
  )
);
