/**
 * SaaS Tier Entitlement Matrix & Subscription State Enforcement
 */

const TIER_MODULES: Record<string, string[]> = {
  "digital-starter": ["students", "teachers", "attendance"],
  "school-growth": ["students", "teachers", "attendance", "fees", "exams", "timetable", "admissions"],
  "school-professional": ["students", "teachers", "attendance", "fees", "exams", "timetable", "admissions", "transport", "automation", "analytics"],
  "enterprise": ["students", "teachers", "attendance", "fees", "exams", "timetable", "admissions", "transport", "automation", "analytics", "ai-copilot", "ai-chatbot", "enterprise-ai"]
};

export function verifyTenantEntitlement(plan: string, subscriptionStatus: string, requestedModule: string) {
  // 1. Enforce Subscription Lifecycle States
  if (subscriptionStatus === "SUSPENDED" || subscriptionStatus === "CANCELLED") {
    return {
      allowed: false,
      reason: "SUBSCRIPTION_INACTIVE",
      redirectUrl: "/billing/reactivate"
    };
  }

  if (subscriptionStatus === "PAST_DUE") {
    // Allow grace access to billing, but restrict advanced features
    if (requestedModule !== "billing" && requestedModule !== "dashboard") {
      return {
        allowed: false,
        reason: "PAYMENT_PAST_DUE",
        redirectUrl: "/billing/update-payment"
      };
    }
  }

  // 2. Enforce Tier-Based Module Access
  const allowedModules = TIER_MODULES[plan] || TIER_MODULES["digital-starter"];
  
  if (!allowedModules.includes(requestedModule)) {
    return {
      allowed: false,
      reason: "MODULE_NOT_IN_TIER",
      requiredPlanUpgrade: "Please upgrade your plan to access " + requestedModule
    };
  }

  return { allowed: true };
}
