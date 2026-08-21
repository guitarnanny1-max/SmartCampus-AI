"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function SignupForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialPlan = searchParams.get("plan") || "school-growth";
  const initialCycle = searchParams.get("cycle") || "monthly";

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    schoolName: "",
    subdomain: "",
    institutionType: "CBSE",
    adminName: "",
    email: "",
    phone: "",
    plan: initialPlan,
    cycle: initialCycle,
  });

  const planPricing: Record<
    string,
    {
      name: string;
      monthly: number;
      annual: number;
      onboarding: number;
    }
  > = {
    "digital-starter": {
      name: "Digital Starter",
      monthly: 1499,
      annual: 14990,
      onboarding: 7500,
    },
    "school-growth": {
      name: "School Growth",
      monthly: 2999,
      annual: 29990,
      onboarding: 15000,
    },
    "school-professional": {
      name: "School Professional",
      monthly: 5999,
      annual: 59990,
      onboarding: 30000,
    },
    enterprise: {
      name: "AI 360 Enterprise",
      monthly: 25000,
      annual: 250000,
      onboarding: 75000,
    },
  };

  const currentPlanObj =
    planPricing[formData.plan] || planPricing["school-growth"];

  const subscriptionCost =
    formData.cycle === "annual"
      ? currentPlanObj.annual
      : currentPlanObj.monthly;

  const totalDueToday = subscriptionCost + currentPlanObj.onboarding;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/provision", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        router.push(
          "/dashboard?workspace=" + data.data.subdomain
        );
      } else {
        setErrorMsg(
          data.error || "Provisioning failed. Please check inputs."
        );
        setLoading(false);
      }
    } catch {
      setErrorMsg(
        "Network connection error during checkout. Please try again."
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-3xl mx-auto w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <span className="text-xs uppercase tracking-widest px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full font-semibold border border-indigo-500/20">
            SmartCampus AI Provisioning
          </span>

          <h1 className="text-3xl font-extrabold text-white mt-3">
            Configure Your Institution OS
          </h1>

          <p className="text-slate-400 text-sm mt-1">
            Set up your multi-tenant workspace tailored to your educational
            board standards.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 bg-red-950/50 border border-red-900 text-red-300 text-xs p-4 rounded-xl">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleCheckout} className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-2">
                1. Institution Details
              </h2>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                  Institution Name
                </label>

                <input
                  type="text"
                  name="schoolName"
                  required
                  placeholder="e.g., Delhi Public Academy or Apex University"
                  value={formData.schoolName}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                    Subdomain Workspace
                  </label>

                  <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-2">
                    <input
                      type="text"
                      name="subdomain"
                      required
                      placeholder="dpsacademy"
                      value={formData.subdomain}
                      onChange={handleChange}
                      className="bg-transparent text-sm text-white focus:outline-none w-full"
                    />

                    <span className="text-xs text-slate-500 font-mono">
                      .smartcampus.ai
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                    Institution Type / Board
                  </label>

                  <select
                    name="institutionType"
                    value={formData.institutionType}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="CBSE">
                      CBSE School (Central Board)
                    </option>
                    <option value="ICSE">ICSE / ISC School</option>
                    <option value="State">State Board School</option>
                    <option value="University">
                      University / Higher Education
                    </option>
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full mt-6 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl text-sm transition shadow-lg shadow-indigo-600/30"
              >
                Continue to Administrator Setup →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-2">
                2. Administrator Contact
              </h2>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                  Administrator Full Name
                </label>

                <input
                  type="text"
                  name="adminName"
                  required
                  placeholder="e.g., Dr. Rajesh Sharma"
                  value={formData.adminName}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                    Work Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="admin@school.edu"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-3 rounded-xl text-sm transition border border-slate-700"
                >
                  ← Back
                </button>

                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="w-2/3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl text-sm transition shadow-lg shadow-indigo-600/30"
                >
                  Review Order Summary →
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-2">
                3. Secure Checkout & Provisioning
              </h2>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">
                    Institution Type
                  </span>

                  <span className="font-bold text-indigo-400">
                    {formData.institutionType} Standard
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">
                    Selected Plan
                  </span>

                  <span className="font-bold text-white uppercase">
                    {currentPlanObj.name} ({formData.cycle})
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">
                    Subscription Fee
                  </span>

                  <span className="font-semibold text-white">
                    ₹{subscriptionCost.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">
                    One-Time Onboarding & Setup
                  </span>

                  <span className="font-semibold text-white">
                    ₹{currentPlanObj.onboarding.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="border-t border-slate-800 pt-4 flex justify-between items-center">
                  <span className="font-bold text-white text-base">
                    Total Due Today
                  </span>

                  <span className="font-extrabold text-emerald-400 text-xl">
                    ₹{totalDueToday.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-1/3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-3 rounded-xl text-sm transition border border-slate-700"
                >
                  ← Back
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-2/3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl text-sm transition shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
                >
                  {loading
                    ? "Provisioning Workspace..."
                    : "🔒 Pay & Provision Instantly"}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
          <div className="text-sm text-slate-400">
            Loading SmartCampus AI...
          </div>
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  );
}
