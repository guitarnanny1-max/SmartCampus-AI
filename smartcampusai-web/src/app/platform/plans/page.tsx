"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type ApiPlan = {
  id: string;
  name: "STARTER" | "PROFESSIONAL" | "ENTERPRISE";
  monthlyPrice: number | string | null;
  annualPrice: number | string | null;
  studentLimit: number | null;
  teacherLimit: number | null;
  isActive: boolean;
};

type Plan = ApiPlan & {
  description: string;
  monthly: string;
  annual: string;
  students: string;
  teachers: string;
  saving: boolean;
  saved: boolean;
  error: string;
};

const descriptions: Record<ApiPlan["name"], string> = {
  STARTER: "Core SmartCampusAI school management.",
  PROFESSIONAL: "Advanced school operations and capabilities.",
  ENTERPRISE: "Custom configuration for larger deployments.",
};

function toInputValue(value: number | string | null) {
  return value === null || value === undefined ? "" : String(value);
}

function createPlan(plan: ApiPlan): Plan {
  return {
    ...plan,
    description: descriptions[plan.name],
    monthly: toInputValue(plan.monthlyPrice),
    annual: toInputValue(plan.annualPrice),
    students: toInputValue(plan.studentLimit),
    teachers: toInputValue(plan.teacherLimit),
    saving: false,
    saved: false,
    error: "",
  };
}

export default function PlatformPlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    async function loadPlans() {
      try {
        const response = await fetch("/api/platform/plans", {
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to load plans");
        }

        setPlans((result.plans ?? []).map(createPlan));
      } catch (error) {
        setLoadError(
          error instanceof Error ? error.message : "Failed to load plans",
        );
      } finally {
        setLoading(false);
      }
    }

    loadPlans();
  }, []);

  function updatePlan(
    index: number,
    field: "monthly" | "annual" | "students" | "teachers",
    value: string,
  ) {
    setPlans((current) =>
      current.map((plan, planIndex) =>
        planIndex === index
          ? { ...plan, [field]: value, saved: false, error: "" }
          : plan,
      ),
    );
  }

  async function savePlan(index: number) {
    const plan = plans[index];

    if (!plan) {
      return;
    }

    setPlans((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? { ...item, saving: true, saved: false, error: "" }
          : item,
      ),
    );

    try {
      const response = await fetch("/api/platform/plans", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: plan.id,
          monthlyPrice: plan.monthly,
          annualPrice: plan.annual,
          studentLimit: plan.students,
          teacherLimit: plan.teachers,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save plan");
      }

      setPlans((current) =>
        current.map((item, itemIndex) =>
          itemIndex === index
            ? {
                ...createPlan(result.plan),
                saving: false,
                saved: true,
                error: "",
              }
            : item,
        ),
      );
    } catch (error) {
      setPlans((current) =>
        current.map((item, itemIndex) =>
          itemIndex === index
            ? {
                ...item,
                saving: false,
                saved: false,
                error:
                  error instanceof Error
                    ? error.message
                    : "Failed to save plan",
              }
            : item,
        ),
      );
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <Link
            href="/platform"
            className="text-sm font-medium text-violet-400 hover:text-violet-300"
          >
            ← Platform Control Center
          </Link>

          <h1 className="mt-3 text-4xl font-bold tracking-tight">
            Plans & Pricing
          </h1>

          <p className="mt-2 text-slate-400">
            Configure the plans available to SmartCampusAI schools.
          </p>
        </div>

        {loading && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-400">
            Loading plans…
          </div>
        )}

        {loadError && (
          <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-5 text-sm text-red-200">
            {loadError}
          </div>
        )}

        {!loading && !loadError && (
          <div className="grid gap-6 lg:grid-cols-3">
            {plans.map((plan, index) => (
              <section
                key={plan.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
              >
                <h2 className="text-2xl font-semibold">{plan.name}</h2>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {plan.description}
                </p>

                <div className="mt-6 space-y-4">
                  <label className="block">
                    <span className="text-sm text-slate-400">
                      Monthly Price (₹)
                    </span>
                    <input
                      value={plan.monthly}
                      onChange={(event) =>
                        updatePlan(index, "monthly", event.target.value)
                      }
                      inputMode="decimal"
                      placeholder="Not configured"
                      className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-violet-400"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm text-slate-400">
                      Annual Price (₹)
                    </span>
                    <input
                      value={plan.annual}
                      onChange={(event) =>
                        updatePlan(index, "annual", event.target.value)
                      }
                      inputMode="decimal"
                      placeholder="Not configured"
                      className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-violet-400"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm text-slate-400">
                      Student Limit
                    </span>
                    <input
                      value={plan.students}
                      onChange={(event) =>
                        updatePlan(index, "students", event.target.value)
                      }
                      inputMode="numeric"
                      placeholder="Not configured"
                      className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-violet-400"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm text-slate-400">
                      Teacher Limit
                    </span>
                    <input
                      value={plan.teachers}
                      onChange={(event) =>
                        updatePlan(index, "teachers", event.target.value)
                      }
                      inputMode="numeric"
                      placeholder="Not configured"
                      className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none placeholder:text-slate-600"
                    />
                  </label>
                </div>

                <button
                  type="button"
                  onClick={() => savePlan(index)}
                  disabled={plan.saving}
                  className="mt-6 w-full rounded-xl bg-violet-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {plan.saving
                    ? "Saving…"
                    : plan.saved
                      ? "Saved ✓"
                      : "Save Plan"}
                </button>

                {plan.error && (
                  <p className="mt-3 text-sm text-red-300">{plan.error}</p>
                )}
              </section>
            ))}
          </div>
        )}

        {!loading && !loadError && (
          <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-5 text-sm text-emerald-200">
            Pricing and limits are connected to the platform database.
          </div>
        )}
      </div>
    </main>
  );
}
