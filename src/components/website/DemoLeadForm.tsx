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
  Sparkles,
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
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-[#e8d0a9]/30 bg-[#16102f] shadow-2xl text-white">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            onClose();
          }}
          aria-label="Close demo form"
          className="absolute right-5 top-5 rounded-full bg-white/5 p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {!submitted ? (
          <>
            <div className="border-b border-white/10 px-6 py-6 pr-14">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-[#e8d0a9]/30 bg-[#1f153f] px-3 py-1 text-[10px] font-semibold text-[#e8d0a9] uppercase tracking-wider mb-3">
                <Sparkles className="h-3 w-3" /> Priority Access
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-white">
                Request a SmartCampusAI Demo
              </h2>

              <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
                Tell us about your school and our team will help you
                explore the right SmartCampusAI solution.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-4 px-6 py-6"
            >
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-1 block text-xs font-semibold text-slate-300"
                >
                  Your Name
                </label>

                <input
                  id="fullName"
                  name="fullName"
                  required
                  placeholder="Dr. Rajesh Kumar"
                  className="w-full rounded-xl border border-white/10 bg-[#1f173d] px-4 py-3 text-xs text-white placeholder-slate-500 outline-none focus:border-[#e8d0a9] focus:ring-1 focus:ring-[#e8d0a9]/20"
                />
              </div>

              <div>
                <label
                  htmlFor="schoolName"
                  className="mb-1 block text-xs font-semibold text-slate-300"
                >
                  School / Organization
                </label>

                <input
                  id="schoolName"
                  name="schoolName"
                  required
                  placeholder="Global University / School Group"
                  className="w-full rounded-xl border border-white/10 bg-[#1f173d] px-4 py-3 text-xs text-white placeholder-slate-500 outline-none focus:border-[#e8d0a9] focus:ring-1 focus:ring-[#e8d0a9]/20"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1 block text-xs font-semibold text-slate-300"
                  >
                    Work Email
                  </label>

                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />

                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="rajesh@university.edu"
                      className="w-full rounded-xl border border-white/10 bg-[#1f173d] py-3 pl-10 pr-4 text-xs text-white placeholder-slate-500 outline-none focus:border-[#e8d0a9] focus:ring-1 focus:ring-[#e8d0a9]/20"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-1 block text-xs font-semibold text-slate-300"
                  >
                    Phone Number
                  </label>

                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      className="w-full rounded-xl border border-white/10 bg-[#1f173d] py-3 pl-10 pr-4 text-xs text-white placeholder-slate-500 outline-none focus:border-[#e8d0a9] focus:ring-1 focus:ring-[#e8d0a9]/20"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="studentCount"
                  className="mb-1 block text-xs font-semibold text-slate-300"
                >
                  Number of Students
                </label>

                <div className="relative">
                  <Users className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />

                  <select
                    id="studentCount"
                    name="studentCount"
                    required
                    defaultValue=""
                    className="w-full appearance-none rounded-xl border border-white/10 bg-[#1f173d] py-3 pl-10 pr-4 text-xs text-white outline-none focus:border-[#e8d0a9] focus:ring-1 focus:ring-[#e8d0a9]/20"
                  >
                    <option value="" disabled className="bg-[#16102f]">
                      Select student strength
                    </option>
                    <option value="1-250" className="bg-[#16102f]">1–250 Students</option>
                    <option value="251-500" className="bg-[#16102f]">251–500 Students</option>
                    <option value="501-1000" className="bg-[#16102f]">501–1,000 Students</option>
                    <option value="1001-2500" className="bg-[#16102f]">1,001–2,500 Students</option>
                    <option value="2501+" className="bg-[#16102f]">2,501+ Students</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="requirements"
                  className="mb-1 block text-xs font-semibold text-slate-300"
                >
                  What are you looking for? (Optional)
                </label>

                <textarea
                  id="requirements"
                  name="requirements"
                  rows={3}
                  placeholder="Tell us about your school's requirements or focus modules..."
                  className="w-full resize-none rounded-xl border border-white/10 bg-[#1f173d] px-4 py-3 text-xs text-white placeholder-slate-500 outline-none focus:border-[#e8d0a9] focus:ring-1 focus:ring-[#e8d0a9]/20"
                />
              </div>

              {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-300">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:opacity-95 transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending Request...
                  </>
                ) : (
                  "Schedule Personalized Demo"
                )}
              </button>

              <p className="text-center text-[10px] text-slate-400">
                Your information will only be used to contact you
                about SmartCampusAI.
              </p>
            </form>
          </>
        ) : (
          <div className="px-6 py-16 text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <h3 className="text-2xl font-bold text-white">
              Demo Request Received
            </h3>

            <p className="mx-auto max-w-sm text-xs leading-relaxed text-slate-300">
              Thank you for your interest in SmartCampusAI. Our campus solutions team will review your requirements and contact you shortly.
            </p>

            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="mt-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-xs font-semibold text-white shadow-md hover:opacity-95 transition-opacity"
            >
              Continue Exploring
            </button>
          </div>
        )}
      </div>
    </div>
  );
}