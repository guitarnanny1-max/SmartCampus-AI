"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function DemoPage() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    const form = event.currentTarget;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = new FormData(form);

    const name = String(data.get("name") || "").trim();
    const college = String(data.get("college") || "").trim();
    const mobile = String(data.get("mobile") || "").trim();
    const email = String(data.get("email") || "").trim();
    const interest = String(data.get("interest") || "").trim();
    const message = String(data.get("message") || "").trim();

    if (!name || !college || !mobile || !email) {
      setError("Please complete all required fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!/^[+0-9\s()-]{7,20}$/.test(mobile)) {
      setError("Please enter a valid mobile number.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/crm/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          college,
          mobile,
          email,
          requirements: [
            interest ? `Interested in: ${interest}` : null,
            message ? `Message: ${message}` : null,
          ]
            .filter(Boolean)
            .join("\n"),
          source: "website_demo_form",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error || "Unable to submit demo request.",
        );
      }

      setSubmitted(true);
      form.reset();
    } catch (submitError) {
      console.error("Demo request error:", submitError);

      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to submit demo request. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">


      <section className="relative overflow-hidden px-6 py-20 md:py-28">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.10),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(124,58,237,0.10),transparent_28%)]" />

        <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
              SmartCampusAI
            </p>

            <h1 className="mt-5 text-5xl font-semibold leading-[1] tracking-[-0.05em] md:text-6xl">
              See what your institution can do with SmartCampusAI.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Request a personalized demo and discover how SmartCampusAI can
              connect your institution&apos;s academics, administration,
              operations, finance, learning, CRM, and AI.
            </p>

            <div className="mt-10 space-y-4 text-sm text-slate-600">
              <div>✓ Personalized product walkthrough</div>
              <div>✓ Explore the platform for your institution</div>
              <div>✓ Discuss your campus requirements</div>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-[0_25px_80px_rgba(15,23,42,0.10)] md:p-9">
            {submitted ? (
              <div className="py-12 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-600">
                  ✓
                </div>

                <h2 className="mt-6 text-3xl font-semibold">
                  Demo request received
                </h2>

                <p className="mx-auto mt-4 max-w-md leading-7 text-slate-600">
                  Thank you for your interest in SmartCampusAI. Our team will
                  contact you using the details you provided.
                </p>

                <Link
                  href="/"
                  className="mt-8 inline-flex rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Return to SmartCampusAI
                </Link>
              </div>
            ) : (
              <>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">
                    Request a demo
                  </p>

                  <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                    Let&apos;s connect.
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    Fields marked with * are required.
                  </p>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="mt-8 space-y-5"
                >
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-semibold text-slate-800"
                    >
                      Name <span className="text-rose-600">*</span>
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      placeholder="Your full name"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="college"
                      className="mb-2 block text-sm font-semibold text-slate-800"
                    >
                      College / Institution{" "}
                      <span className="text-rose-600">*</span>
                    </label>

                    <input
                      id="college"
                      name="college"
                      type="text"
                      required
                      autoComplete="organization"
                      placeholder="College or institution name"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="mobile"
                      className="mb-2 block text-sm font-semibold text-slate-800"
                    >
                      Mobile <span className="text-rose-600">*</span>
                    </label>

                    <input
                      id="mobile"
                      name="mobile"
                      type="tel"
                      required
                      autoComplete="tel"
                      inputMode="tel"
                      placeholder="+91 98765 43210"
                      pattern="[+0-9\s()-]{7,20}"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-semibold text-slate-800"
                    >
                      Email <span className="text-rose-600">*</span>
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="you@college.edu"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="interest"
                      className="mb-2 block text-sm font-semibold text-slate-800"
                    >
                      Interested in
                    </label>

                    <select
                      id="interest"
                      name="interest"
                      defaultValue=""
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    >
                      <option value="" disabled>
                        Select an option
                      </option>

                      <option value="full-platform">
                        Complete SmartCampusAI Platform
                      </option>

                      <option value="ai">
                        AI Platform
                      </option>

                      <option value="erp">
                        Education ERP
                      </option>

                      <option value="crm">
                        Admissions CRM
                      </option>

                      <option value="lms">
                        Learning Platform
                      </option>

                      <option value="bms">
                        Business Management
                      </option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="mb-2 block text-sm font-semibold text-slate-800"
                    >
                      Message
                    </label>

                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      placeholder="Tell us briefly about your institution or requirements."
                      className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>

                  {error && (
                    <div
                      role="alert"
                      className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700"
                    >
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-full bg-gradient-to-r from-blue-600 via-cyan-600 to-violet-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                  >
                    {loading ? "Submitting request..." : "Request a demo"}
                  </button>

                  <p className="text-center text-xs leading-5 text-slate-500">
                    By submitting this form, you agree to be contacted by the
                    SmartCampusAI team regarding your demo request.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
