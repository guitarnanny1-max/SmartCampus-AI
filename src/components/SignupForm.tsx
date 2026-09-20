"use client";

import Script from "next/script";
import { useState } from "react";
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

const PLANS: Record<
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

export default function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const requestedPlan = searchParams.get("plan");
  const requestedCycle = searchParams.get("cycle");

  const defaultPlan: PlanId =
    requestedPlan && requestedPlan in PLANS
      ? (requestedPlan as PlanId)
      : "school-growth";

  const defaultCycle: BillingCycle =
    requestedCycle === "annual" ? "annual" : "monthly";

  const [step, setStep] = useState(1);
  const [checkoutReady, setCheckoutReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    schoolName: "",
    subdomain: "",
    institutionType: "CBSE",
    adminName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    plan: defaultPlan,
    cycle: defaultCycle,
  });

  const plan = PLANS[form.plan];

  const price =
    form.cycle === "annual"
      ? plan.annual
      : plan.monthly;

  function update(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));
  }

  function continueToStep2() {
    setError("");

    if (!form.schoolName.trim()) {
      setError("Institution name is required.");
      return;
    }

    if (!form.subdomain.trim()) {
      setError("Workspace subdomain is required.");
      return;
    }

    setStep(2);
  }

  function continueToStep3() {
    setError("");

    if (!form.adminName.trim()) {
      setError("Administrator name is required.");
      return;
    }

    if (!form.email.trim()) {
      setError("Administrator email is required.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setStep(3);
  }

  async function startCheckout(e: React.FormEvent) {
    e.preventDefault();

    setError("");

    if (!checkoutReady || !window.Razorpay) {
      setError(
        "Secure payment gateway is still loading. Please try again."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/billing/create-subscription",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            schoolName: form.schoolName.trim(),
            subdomain: form.subdomain.trim().toLowerCase(),
            schoolType: form.institutionType,
            adminName: form.adminName.trim(),
            email: form.email.trim().toLowerCase(),
            phone: form.phone.trim(),
            password: form.password,
            planId: form.plan,
            billingCycle: form.cycle,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Unable to create subscription."
        );
      }

      const razorpay = new window.Razorpay({
        key: data.razorpayKeyId,
        subscription_id: data.razorpaySubscriptionId,

        name: "SmartCampus AI",
        description: `${data.plan.name} ${data.plan.billingCycle} subscription`,

        prefill: {
          name: form.adminName,
          email: form.email,
        },

        notes: {
          tenantId: data.tenantId,
          schoolName: form.schoolName,
          plan: data.plan.id,
        },

        theme: {
          color: "#2563EB",
        },

        handler: async (paymentResponse: {
          razorpay_payment_id: string;
          razorpay_subscription_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const verifyResponse = await fetch(
              "/api/billing/verify-subscription",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(paymentResponse),
              }
            );

            const verifyData = await verifyResponse.json();

            if (!verifyResponse.ok || !verifyData.success) {
              throw new Error(
                verifyData.error ||
                  "Payment verification failed."
              );
            }

            router.push(
              `/${data.school.subdomain}/admin?payment=success`
            );
          } catch (verificationError) {
            setError(
              verificationError instanceof Error
                ? verificationError.message
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
    } catch (checkoutError) {
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : "Unable to start secure checkout."
      );
      setLoading(false);
    }
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onLoad={() => setCheckoutReady(true)}
        onError={() =>
          setError(
            "Unable to load Razorpay Checkout. Please refresh the page."
          )
        }
      />

      <div className="space-y-6">
        {error && (
          <div className="p-4 text-sm text-red-300 bg-red-950/50 border border-red-900 rounded-xl">
            {error}
          </div>
        )}

        <div className="flex gap-2">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex-1">
              <div
                className={`h-1 rounded-full ${
                  item <= step
                    ? "bg-blue-500"
                    : "bg-gray-700"
                }`}
              />
              <p className="text-[10px] text-gray-500 text-center mt-2">
                {item === 1
                  ? "School"
                  : item === 2
                    ? "Admin"
                    : "Payment"}
              </p>
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              School Details
            </h3>

            <input
              name="schoolName"
              value={form.schoolName}
              onChange={update}
              required
              placeholder="School / Institution Name"
              className="w-full px-3 py-3 bg-gray-700 border border-gray-600 rounded-md text-white"
            />

            <div className="flex">
              <input
                name="subdomain"
                value={form.subdomain}
                onChange={update}
                required
                placeholder="your-school"
                className="w-full px-3 py-3 bg-gray-700 border border-gray-600 rounded-l-md text-white"
              />
              <span className="px-3 py-3 bg-gray-800 border border-gray-600 border-l-0 rounded-r-md text-xs text-gray-400 flex items-center">
                .smartcampus.ai
              </span>
            </div>

            <select
              name="institutionType"
              value={form.institutionType}
              onChange={update}
              className="w-full px-3 py-3 bg-gray-700 border border-gray-600 rounded-md text-white"
            >
              <option value="CBSE">CBSE School</option>
              <option value="ICSE">ICSE / ISC School</option>
              <option value="State">State Board School</option>
              <option value="University">
                University / Higher Education
              </option>
            </select>

            <select
              name="plan"
              value={form.plan}
              onChange={update}
              className="w-full px-3 py-3 bg-gray-700 border border-gray-600 rounded-md text-white"
            >
              {Object.entries(PLANS).map(([id, item]) => (
                <option key={id} value={id}>
                  {item.name} — ₹
                  {(form.cycle === "annual"
                    ? item.annual
                    : item.monthly
                  ).toLocaleString("en-IN")}
                  /{form.cycle === "annual" ? "year" : "month"}
                </option>
              ))}
            </select>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() =>
                  setForm((current) => ({
                    ...current,
                    cycle: "monthly",
                  }))
                }
                className={`py-2 rounded-md text-sm ${
                  form.cycle === "monthly"
                    ? "bg-blue-600"
                    : "bg-gray-700"
                }`}
              >
                Monthly
              </button>

              <button
                type="button"
                onClick={() =>
                  setForm((current) => ({
                    ...current,
                    cycle: "annual",
                  }))
                }
                className={`py-2 rounded-md text-sm ${
                  form.cycle === "annual"
                    ? "bg-blue-600"
                    : "bg-gray-700"
                }`}
              >
                Annual
              </button>
            </div>

            <button
              type="button"
              onClick={continueToStep2}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-md font-semibold"
            >
              Continue →
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              Administrator Account
            </h3>

            <input
              name="adminName"
              value={form.adminName}
              onChange={update}
              required
              placeholder="Administrator Full Name"
              className="w-full px-3 py-3 bg-gray-700 border border-gray-600 rounded-md text-white"
            />

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={update}
              required
              placeholder="admin@school.com"
              className="w-full px-3 py-3 bg-gray-700 border border-gray-600 rounded-md text-white"
            />

            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={update}
              required
              placeholder="+91 98765 43210"
              className="w-full px-3 py-3 bg-gray-700 border border-gray-600 rounded-md text-white"
            />

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={update}
              required
              minLength={8}
              placeholder="Password — minimum 8 characters"
              className="w-full px-3 py-3 bg-gray-700 border border-gray-600 rounded-md text-white"
            />

            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={update}
              required
              minLength={8}
              placeholder="Confirm password"
              className="w-full px-3 py-3 bg-gray-700 border border-gray-600 rounded-md text-white"
            />

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 py-3 bg-gray-700 rounded-md"
              >
                ← Back
              </button>

              <button
                type="button"
                onClick={continueToStep3}
                className="w-2/3 py-3 bg-blue-600 hover:bg-blue-500 rounded-md font-semibold"
              >
                Review →
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <form onSubmit={startCheckout} className="space-y-5">
            <h3 className="text-lg font-semibold">
              Secure Payment
            </h3>

            <div className="bg-gray-700/50 border border-gray-600 rounded-xl p-5 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Institution</span>
                <span className="font-medium">
                  {form.schoolName}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Plan</span>
                <span className="font-medium">
                  {plan.name}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Billing</span>
                <span className="font-medium capitalize">
                  {form.cycle}
                </span>
              </div>

              <div className="border-t border-gray-600 pt-3 flex justify-between">
                <span className="font-bold">Amount</span>
                <span className="font-bold text-emerald-400 text-xl">
                  ₹{price.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-500">
              Payment is processed securely by Razorpay. Your
              SmartCampus workspace is activated only after
              server-side payment verification.
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-1/3 py-3 bg-gray-700 rounded-md"
              >
                ← Back
              </button>

              <button
                type="submit"
                disabled={loading}
                className="w-2/3 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-md font-semibold disabled:opacity-50"
              >
                {loading
                  ? "Opening Razorpay..."
                  : `Pay ₹${price.toLocaleString("en-IN")}`}
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}
