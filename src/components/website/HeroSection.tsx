"use client";

import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

import ThreeDButton from "@/components/website/ThreeDButton";

type HeroSectionProps = {
  onRequestDemo: () => void;
};

export default function HeroSection({
  onRequestDemo,
}: HeroSectionProps) {
  return (
    <section className="relative isolate overflow-hidden bg-slate-950">
      {/* Animated background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-20%] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-3xl animate-pulse" />

        <div className="absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl" />

        <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(148,163,184,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.4) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
        {/* Content */}
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/10 px-4 py-2 text-sm font-semibold text-indigo-200 backdrop-blur">
            <Sparkles className="h-4 w-4" />
            AI-powered school management
          </div>

          <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
            Run your entire school
            <span className="block bg-gradient-to-r from-indigo-300 via-blue-300 to-violet-300 bg-clip-text text-transparent">
              smarter with AI.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
            SmartCampusAI brings students, teachers, admissions, attendance,
            fees, academics, CRM, communication, and school operations into
            one intelligent platform.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <ThreeDButton onClick={onRequestDemo}>
              Book a Demo
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </ThreeDButton>

            <ThreeDButton href="#features" variant="secondary">
              Explore Platform
            </ThreeDButton>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-400">
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              Student Management
            </span>

            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              Admissions CRM
            </span>

            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              AI Insights
            </span>
          </div>
        </div>

        {/* Product visual */}
        <div className="relative">
          <div className="absolute -inset-8 rounded-[3rem] bg-indigo-500/10 blur-3xl" />

          <div className="relative rounded-3xl border border-white/10 bg-white/[0.06] p-3 shadow-2xl backdrop-blur-xl">
            <div className="rounded-2xl border border-white/10 bg-slate-900/95 p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">
                    SmartCampusAI
                  </p>
                  <p className="text-xs text-slate-500">
                    School Intelligence Dashboard
                  </p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-300">
                  <BrainCircuit className="h-5 w-5" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Students", "2,847"],
                  ["Attendance", "96.4%"],
                  ["Admissions", "128"],
                  ["Fees Collected", "₹84.6L"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-xl border border-white/10 bg-white/[0.04] p-4"
                  >
                    <p className="text-xs text-slate-500">{label}</p>
                    <p className="mt-2 text-xl font-bold text-white">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.04] p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-white">
                    AI School Insights
                  </p>

                  <span className="rounded-full bg-emerald-400/10 px-2 py-1 text-[10px] font-semibold text-emerald-300">
                    LIVE
                  </span>
                </div>

                <div className="mt-5 flex h-32 items-end gap-2">
                  {[42, 58, 48, 74, 68, 86, 94, 78, 100].map(
                    (height, index) => (
                      <div
                        key={index}
                        className="flex-1 rounded-t-md bg-gradient-to-t from-indigo-600/30 to-indigo-400"
                        style={{ height: `${height}%` }}
                      />
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Floating cards */}
          <div className="absolute -left-5 top-10 hidden rounded-xl border border-white/10 bg-slate-900/90 p-3 shadow-xl backdrop-blur-xl sm:block">
            <p className="text-[10px] text-slate-500">AI Insight</p>
            <p className="mt-1 text-xs font-bold text-emerald-300">
              Attendance ↑ 4.8%
            </p>
          </div>

          <div className="absolute -right-5 bottom-12 hidden rounded-xl border border-white/10 bg-slate-900/90 p-3 shadow-xl backdrop-blur-xl sm:block">
            <p className="text-[10px] text-slate-500">New Leads</p>
            <p className="mt-1 text-xs font-bold text-white">+24 this week</p>
          </div>
        </div>
      </div>
    </section>
  );
}
