import { NextResponse } from "next/server";
import { headers } from "next/headers";

/**
 * Server-Side Tenant & RBAC Authorization Guard
 *
 * Development / enterprise RBAC roles:
 * SUPER_ADMIN
 * ADMIN
 * PRINCIPAL
 * FINANCE
 * TEACHER
 * BURSAR
 * STUDENT
 * PARENT
 * GUEST
 */
export async function verifyTenantAccess(
  requiredRole: string = "ADMIN",
) {
  const headersList = await headers();

  const host = headersList.get("host") || "";
  const tenantSubdomain = host.split(".")[0];

  /*
   * Current SmartCampusAI session sends the role through
   * x-user-role when available.
   *
   * During local development there may be no authentication
   * header yet, so use SUPER_ADMIN as the development fallback.
   *
   * This keeps the application usable while the production
   * authentication/session layer is being implemented.
   */
  const userRoleHeader =
    headersList.get("x-user-role") || "SUPER_ADMIN";

  const tenantIdHeader =
    headersList.get("x-tenant-id") || "";

  const normalizedUserRole =
    userRoleHeader.trim().toUpperCase();

  const normalizedRequiredRole =
    requiredRole.trim().toUpperCase();

  /*
   * Enterprise RBAC hierarchy.
   */
  const roleHierarchy: Record<string, number> = {
    GUEST: 0,
    STUDENT: 1,
    PARENT: 1,
    TEACHER: 2,
    BURSAR: 3,
    FINANCE: 3,
    PRINCIPAL: 4,
    ADMIN: 4,
    SUPER_ADMIN: 5,
  };

  const userLevel =
    roleHierarchy[normalizedUserRole] ?? 0;

  const requiredLevel =
    roleHierarchy[normalizedRequiredRole] ?? 4;

  /*
   * Super Admin has platform-wide access.
   *
   * Do not require a tenant subdomain for Super Admin.
   */
  if (normalizedUserRole === "SUPER_ADMIN") {
    return {
      authorized: true,
      scope: "SUPER_ADMIN",
      tenantId: tenantIdHeader || null,
      subdomain: tenantSubdomain,
      role: normalizedUserRole,
    };
  }

  /*
   * Unknown roles are denied.
   */
  if (userLevel === 0) {
    return {
      authorized: false,
      response: NextResponse.json(
        {
          success: false,
          error: "Forbidden: Unknown or unauthenticated user role.",
        },
        { status: 403 },
      ),
    };
  }

  /*
   * Enforce RBAC.
   */
  if (userLevel < requiredLevel) {
    return {
      authorized: false,
      response: NextResponse.json(
        {
          success: false,
          error:
            "Forbidden: Insufficient privileges for requested scope.",
        },
        { status: 403 },
      ),
    };
  }

  /*
   * Non-Super-Admin users require tenant context.
   */
  if (!tenantIdHeader) {
    return {
      authorized: false,
      response: NextResponse.json(
        {
          success: false,
          error:
            "Forbidden: Tenant workspace is required for this role.",
        },
        { status: 403 },
      ),
    };
  }

  return {
    authorized: true,
    scope: "TENANT",
    tenantId: tenantIdHeader,
    subdomain: tenantSubdomain,
    role: normalizedUserRole,
  };
}
