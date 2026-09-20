"use client";

import Script from "next/script";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
    };
  }
}

type PlanId =
  | "school-starter"
  | "school-growth"
  | "school-professional";

type BillingCycle = "monthly" | "annual";

const plans: Record<
  PlanId,
  {
    name: string;
    monthly: number;
    annual: number;
  }
> = {
  "school-starter": {
    name: "Starter",
    monthly: 999,
    annual: 9990,
  },
  "school-growth": {
    name: "Growth",
    monthly: 1999,
    annual: 19990,
  },
  "school-professional": {
    name: "Professional",
    monthly: 4999,
    annual: 49990,
  },
};

function SignupForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const requestedPlan = searchParams.get("plan") || "school-growth";
  const requestedCycle =
    searchParams.get("cycle") === "annual" ? "annual" : "monthly";

  const initialPlan: PlanId =
    requestedPlan in plans
      ? (requestedPlan as PlanId)
      : "school-growth";

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [checkoutReady, setCheckoutReady] = useState(false);

  const [formData, setFormData] = useState({
    schoolName: "",
    subdomain: "",
    institutionType: "CBSE",
    adminName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    plan: initialPlan,
    cycle: requestedCycle as BillingCycle,
  });

  const currentPlan = plans[formData.plan];

  const subscriptionCost =
    formData.cycle === "annual"
      ? currentPlan.annual
      : currentPlan.monthly;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (formData.password.length < 8) {
      setErrorMsg("Password must contain at least 8 characters.");
      setStep(2);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Passwords do not match.");
      setStep(2);
      return;
    }

    if (!checkoutReady || !window.Razorpay) {
      setErrorMsg(
        "Secure payment gateway is still loading. Please try again in a moment."
      );
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/billing/create-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          schoolName: formData.schoolName,
          subdomain: formData.subdomain,
          schoolType: formData.institutionType,
          adminName: formData.adminName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          planId: formData.plan,
          billingCycle: formData.cycle,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data.error || "Unable to create your subscription."
        );
      }

      const razorpay = new window.Razorpay({
        key: data.razorpayKeyId,
        subscription_id: data.razorpaySubscriptionId,
        name: "SmartCampus AI",
        description: `${data.plan.name} — ${data.plan.billingCycle}`,
        image: "/logo.png",
        prefill: {
          name: formData.adminName,
          email: formData.email,
          contact: formData.phone,
        },
        notes: {
          tenantId: data.tenantId,
          schoolName: formData.schoolName,
        },
        theme: {
          color: "#2563EB",
        },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_subscription_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const verifyRes = await fetch(
              "/api/billing/verify-subscription",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(response),
              }
            );

            const verifyData = await verifyRes.json();

            if (!verifyRes.ok || !verifyData.success) {
              throw new Error(
                verifyData.error ||
                  "Payment was received but verification failed."
              );
            }

            router.push(
              `/${data.school.subdomain}/admin?payment=success`
            );
          } catch (error) {
            setErrorMsg(
              error instanceof Error
                ? error.message
                : "Payment verification failed."
            );
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      });

      razorpay.open();
    } catch (error) {
      setErrorMsg(
        error instanceof Error
          ? error.message
          : "Unable to start secure checkout."
      );
      setLoading(false);
    }
  };

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onLoad={() => setCheckoutReady(true)}
        onError={() =>
          setErrorMsg("Unable to load the secure payment gateway.")
        }
      />

      <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 flex items-center">
        <div className="max-w-3xl mx-auto w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <span className="text-xs uppercase tracking-widest px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full font-semibold border border-blue-500/20">
              SmartCampus AI
            </span>

            <h1 className="text-3xl font-extrabold text-white mt-4">
              Create Your School Workspace
            </h1>

            <p className="text-slate-400 text-sm mt-2">
              Launch your SmartCampus Cloud ERP with secure self-service
              onboarding.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 bg-red-950/50 border border-red-900 text-red-300 text-sm p-4 rounded-xl">
              {errorMsg}
            </div>
          )}

          <div className="flex items-center gap-2 mb-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex-1">
                <div
                  className={`h-1 rounded-full ${
                    item <= step ? "bg-blue-500" : "bg-slate-800"
                  }`}
                />
                <div className="text-[10px] text-slate-500 mt-2 text-center">
                  {item === 1
                    ? "Institution"
                    : item === 2
                      ? "Administrator"
                      : "Payment"}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleCheckout} className="space-y-6">
            {step === 1 && (
              <div className="space-y-5">
                <h2 className="text-lg font-bold">1. Institution Details</h2>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">
                    Institution Name
                  </label>
                  <input
                    type="text"
                    name="schoolName"
                    required
                    value={formData.schoolName}
                    onChange={handleChange}
                    placeholder="e.g. ABC Public School"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">
                    Workspace Subdomain
                  </label>

                  <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-4">
                    <input
                      type="text"
                      name="subdomain"
                      required
                      value={formData.subdomain}
                      onChange={handleChange}
                      placeholder="abcpreschool"
                      className="bg-transparent text-sm py-3 focus:outline-none w-full"
                    />
                    <span className="text-xs text-slate-500 whitespace-nowrap">
                      .smartcampus.ai
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">
                    Board / Institution Type
                  </label>

                  <select
                    name="institutionType"
                    value={formData.institutionType}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="CBSE">CBSE School</option>
                    <option value="ICSE">ICSE / ISC School</option>
                    <option value="State">State Board School</option>
                    <option value="University">
                      University / Higher Education
                    </option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl text-sm"
                >
                  Continue to Administrator →
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <h2 className="text-lg font-bold">
                  2. Administrator Account
                </h2>

                <input
                  type="text"
                  name="adminName"
                  required
                  value={formData.adminName}
                  onChange={handleChange}
                  placeholder="Administrator full name"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                />

                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@school.edu"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                />

                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="password"
                    name="password"
                    required
                    minLength={8}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password (8+ characters)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                  />

                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    minLength={8}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-1/3 bg-slate-800 text-slate-300 font-semibold py-3 rounded-xl text-sm"
                  >
                    ← Back
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setErrorMsg("");
                      setStep(3);
                    }}
                    className="w-2/3 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl text-sm"
                  >
                    Review & Pay →
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold">
                  3. Secure Subscription Checkout
                </h2>

                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">School</span>
                    <span className="font-semibold">
                      {formData.schoolName}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400">Plan</span>
                    <span className="font-semibold">
                      {currentPlan.name}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400">Billing</span>
                    <span className="font-semibold capitalize">
                      {formData.cycle}
                    </span>
                  </div>

                  <div className="border-t border-slate-800 pt-5 flex justify-between">
                    <span className="font-bold">Amount</span>
                    <span className="font-extrabold text-emerald-400 text-xl">
                      ₹{subscriptionCost.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500">
                    Secure payment powered by Razorpay. Your workspace is
                    activated only after server-side payment verification.
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-1/3 bg-slate-800 text-slate-300 font-semibold py-3 rounded-xl text-sm"
                  >
                    ← Back
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-2/3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl text-sm"
                  >
                    {loading
                      ? "Opening Secure Checkout..."
                      : `Pay ₹${subscriptionCost.toLocaleString("en-IN")}`}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
          Loading secure signup...
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  );
}
