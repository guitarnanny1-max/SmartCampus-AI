import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="overflow-hidden px-6 py-24 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-4xl text-center">

          <div className="mb-6 inline-flex items-center gap-2 rounded-full
border px-4 py-2 text-sm">
            <Sparkles size={15} />
            AI-powered education platform
          </div>

          <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
            One Intelligent Platform
            <br />
            for Your Entire Campus
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8
text-gray-600 md:text-xl">
            SmartCampusAI brings CRM, ERP, LMS, BMS and AI together
            to manage admissions, students, learning, finance and
            campus operations from one powerful platform.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-4
sm:flex-row">
            <Link
              href="/demo"
              className="inline-flex items-center justify-center gap-2
rounded-xl bg-black px-7 py-4 font-semibold text-white"
            >
              Book a Demo
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/pricing"
              className="rounded-xl border px-7 py-4 font-semibold"
            >
              Explore Platform
            </Link>
          </div>
        </div>

        <div className="mx-auto mt-20 max-w-6xl rounded-3xl border
bg-gray-50 p-4 shadow-2xl">
          <div className="rounded-2xl border bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">SmartCampusAI</p>
                <h2 className="text-2xl font-bold">
                  Institution Overview
                </h2>
              </div>

              <span className="rounded-full border px-3 py-1 text-xs">
                Live
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Students", "2,450"],
                ["Admissions", "48"],
                ["Attendance", "93.4%"],
                ["LMS Engagement", "87%"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-2xl border p-5"
                >
                  <p className="text-sm text-gray-500">{label}</p>
                  <p className="mt-2 text-3xl font-bold">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
