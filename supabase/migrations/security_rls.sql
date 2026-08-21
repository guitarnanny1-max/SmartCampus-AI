
-- =========================================================================
-- PRODUCTION SECURITY AUDIT: MULTI-TENANT ROW-LEVEL SECURITY (RLS)
-- =========================================================================

-- 1. Enable RLS on all tenant-isolated tables
ALTER TABLE "Student" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Invoice" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AuditLog" ENABLE ROW LEVEL SECURITY;

-- 2. Create secure tenant context helper function
-- This extracts the tenant_id from the active Postgres session or JWT custom claims
CREATE OR REPLACE FUNCTION current_tenant_id() 
RETURNS TEXT AS $$
BEGIN
  -- Fallback to current request setting if JWT claim is absent
  RETURN COALESCE(
    nullif(current_setting('request.jwt.claim.tenant_id', true), ''),
    nullif(current_setting('app.current_tenant_id', true), '')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Strict Student Isolation Policy
CREATE POLICY "Tenant Student Isolation Policy" ON "Student"
  AS RESTRICTIVE
  USING ("tenantId" = current_tenant_id())
  WITH CHECK ("tenantId" = current_tenant_id());

-- 4. Strict Invoice & Financial Isolation Policy
CREATE POLICY "Tenant Invoice Isolation Policy" ON "Invoice"
  AS RESTRICTIVE
  USING ("tenantId" = current_tenant_id())
  WITH CHECK ("tenantId" = current_tenant_id());

-- 5. Strict Audit Log Isolation Policy
CREATE POLICY "Tenant AuditLog Isolation Policy" ON "AuditLog"
  AS RESTRICTIVE
  USING ("tenantId" = current_tenant_id())
  WITH CHECK ("tenantId" = current_tenant_id());

-- 6. Lock down service role bypass protection
REVOKE EXECUTE ON FUNCTION current_tenant_id() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION current_tenant_id() TO authenticated, service_role;
