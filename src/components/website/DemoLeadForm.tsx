"use client";

import { FormEvent, useState } from "react";
import {
  Building2,
  CheckCircle2,
  Loader2,
  Mail,
  Phone,
  Users,
  X,
} from "lucide-react";

type DemoLeadFormProps = {
  open: boolean;
  onClose: () => void;
};

export default function DemoLeadForm({
  open,
  onClose,
}: DemoLeadFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      fullName: formData.get("fullName"),
      schoolName: formData.get("schoolName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      studentCount: formData.get("studentCount"),
      requirements: formData.get("requirements"),
      source: "website_demo_form",
    };

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Unable to submit your request."
        );
      }

      setSubmitted(true);
      form.reset();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close demo form"
          className="absolute right-4 top-4 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="h-5 w-5" />
        </button>

        {!submitted ? (
          <>
            <div className="border-b border-slate-200 px-6 py-6 pr-14">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                <Building2 className="h-5 w-5" />
              </div>

              <h2 className="text-xl font-bold text-slate-900">
                Request a SmartCampusAI Demo
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Tell us about your school and our team will help you
                explore the right SmartCampusAI solution.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5 px-6 py-6"
            >
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Your Name
                </label>

                <input
                  id="fullName"
                  name="fullName"
                  required
                  placeholder="Enter your name"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label
                  htmlFor="schoolName"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  School / Organization
                </label>

                <input
                  id="schoolName"
                  name="schoolName"
                  required
                  placeholder="Enter school name"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Work Email
                  </label>

                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />

                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="you@school.com"
                      className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Phone
                  </label>

                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      placeholder="+91"
                      className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="studentCount"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Number of Students
                </label>

                <div className="relative">
                  <Users className="absolute left-3 top-3 h-4 w-4 text-slate-400" />

                  <select
                    id="studentCount"
                    name="studentCount"
                    required
                    defaultValue=""
                    className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  >
                    <option value="" disabled>
                      Select student count
                    </option>
                    <option value="1-250">1–250</option>
                    <option value="251-500">251–500</option>
                    <option value="501-1000">501–1,000</option>
                    <option value="1001-2500">1,001–2,500</option>
                    <option value="2501+">2,501+</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="requirements"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  What are you looking for?
                </label>

                <textarea
                  id="requirements"
                  name="requirements"
                  rows={4}
                  placeholder="Tell us about your school's requirements..."
                  className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending Request...
                  </>
                ) : (
                  "Request Demo"
                )}
              </button>

              <p className="text-center text-xs text-slate-400">
                Your information will only be used to contact you
                about SmartCampusAI.
              </p>
            </form>
          </>
        ) : (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600">
              <CheckCircle2 className="h-7 w-7" />
            </div>

            <h2 className="mt-5 text-2xl font-bold text-slate-900">
              Demo Request Received
            </h2>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
              Thank you for your interest in SmartCampusAI. Our team
              will review your request and contact you shortly.
            </p>

            <button
              type="button"
              onClick={onClose}
              className="mt-6 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Continue Exploring
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
