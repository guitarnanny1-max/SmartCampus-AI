export type BillingCycle = "monthly" | "annual";

export type PlanId =
  | "school-starter"
  | "school-growth"
  | "school-professional"
  | "enterprise";

export type Plan = {
  id: PlanId;
  name: string;
  monthly: number | null;
  annual: number | null;
  description: string;
  popular?: boolean;
};

export const PLANS: Record<PlanId, Plan> = {
  "school-starter": {
    id: "school-starter",
    name: "Starter",
    monthly: 999,
    annual: 9990,
    description: "Essential school management for smaller schools",
  },

  "school-growth": {
    id: "school-growth",
    name: "Growth",
    monthly: 1999,
    annual: 19990,
    description: "Complete management for growing schools",
    popular: true,
  },

  "school-professional": {
    id: "school-professional",
    name: "Professional",
    monthly: 4999,
    annual: 49990,
    description: "Advanced school operations and AI capabilities",
  },

  enterprise: {
    id: "enterprise",
    name: "Enterprise",
    monthly: null,
    annual: null,
    description: "Custom requirements and enterprise deployment",
  },
};

export function getPlan(planId: string): Plan {
  return PLANS[planId as PlanId] ?? PLANS["school-growth"];
}

export function getPlanPrice(
  planId: string,
  cycle: BillingCycle
): number | null {
  const plan = getPlan(planId);
  return cycle === "annual" ? plan.annual : plan.monthly;
}
