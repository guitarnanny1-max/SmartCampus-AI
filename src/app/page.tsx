"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Bot,
  ShieldCheck,
  Users,
  GraduationCap,
  BrainCircuit,
} from "lucide-react";
import AIChatbox from "@/components/website/AIChatbox";
import DemoLeadForm from "@/components/website/DemoLeadForm";
import HeroSection from "@/components/website/HeroSection";

export default function Home() {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">

          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold"
          >
            <div className="rounded-lg bg-indigo-600 p-1.5 text-white">
              <Bot className="h-5 w-5" />
            </div>

            <span>
              SmartCampus
              <span className="text-indigo-600">AI</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex">
            <Link href="#features" className="hover:text-indigo-600">
              Features
            </Link>

            <Link href="#ai" className="hover:text-indigo-600">
              AI System
            </Link>

            <Link href="#schools" className="hover:text-indigo-600">
              For Schools
            </Link>

            <Link href="#pricing" className="hover:text-indigo-600">
              Pricing
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="#demo"
              className="hidden text-sm font-medium text-slate-700 hover:text-indigo-600 sm:block"
            >
              School Login
            </Link>

            <Link
              href="#demo"
              onClick={(event) => {
                event.preventDefault();
                setDemoOpen(true);
              }}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
            >
              Request Demo
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

        </div>
      </header>

      {/* Hero */}
      <HeroSection onRequestDemo={() => setDemoOpen(true)} />

      {/* Trust Metrics */}
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl divide-y divide-slate-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0">

          <div className="p-8 text-center">
            <div className="text-3xl font-bold text-slate-900">
              2,500+
            </div>
            <div className="mt-1 text-sm text-slate-500">
              Students Managed
            </div>
          </div>

          <div className="p-8 text-center">
            <div className="text-3xl font-bold text-slate-900">
              95%+
            </div>
            <div className="mt-1 text-sm text-slate-500">
              Attendance Visibility
            </div>
          </div>

          <div className="p-8 text-center">
            <div className="text-3xl font-bold text-slate-900">
              24/7
            </div>
            <div className="mt-1 text-sm text-slate-500">
              Intelligent Insights
            </div>
          </div>

        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="mx-auto max-w-7xl px-4 py-20 sm:px-6"
      >

        <div className="mx-auto max-w-2xl text-center">

          <span className="text-sm font-semibold text-indigo-600">
            ONE UNIFIED PLATFORM
          </span>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Everything your school needs
          </h2>

          <p className="mt-4 text-slate-600">
            Replace disconnected systems with one modern
            school management platform.
          </p>

        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">

          <FeatureCard
            icon={<Users className="h-6 w-6" />}
            title="Admissions CRM"
            description="Capture school enquiries, website demo requests, prospective families, follow-ups, and admission opportunities in one organized pipeline."
          />

          <FeatureCard
            icon={<GraduationCap className="h-6 w-6" />}
            title="Student Management"
            description="Manage student records, classes, sections, guardians, documents, and complete academic history."
          />

          <FeatureCard
            icon={<Users className="h-6 w-6" />}
            title="School Operations"
            description="Connect teachers, attendance, fees, admissions, communication, and daily school operations."
          />

          <FeatureCard
            icon={<BrainCircuit className="h-6 w-6" />}
            title="AI Intelligence"
            description="Turn school data into actionable insights with intelligent alerts, reports, and recommendations."
          />

          <FeatureCard
            icon={<BarChart3 className="h-6 w-6" />}
            title="Analytics & Reports"
            description="Give administrators clear visibility into attendance, fees, admissions, academics, and performance."
          />

          <FeatureCard
            icon={<ShieldCheck className="h-6 w-6" />}
            title="Enterprise Security"
            description="Designed around role-based access and secure multi-school architecture."
          />

          <FeatureCard
            icon={<Bot className="h-6 w-6" />}
            title="AI Copilot"
            description="Assist school teams with operational questions, summaries, alerts, and intelligent workflows."
          />

        </div>
      </section>

      {/* Dashboard Preview */}
      <section
        id="schools"
        className="border-y border-slate-200 bg-slate-50 px-4 py-20 sm:px-6"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold text-indigo-600">
              BUILT FOR SCHOOL LEADERS
            </span>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Your entire school at a glance.
            </h2>

            <p className="mt-4 text-slate-600">
              Give administrators one clear command center for
              understanding what is happening across the school.
            </p>
          </div>

          <div className="mt-12 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-indigo-600 p-2 text-white">
                  <Bot className="h-5 w-5" />
                </div>

                <div>
                  <div className="text-sm font-bold text-slate-900">
                    School Command Center
                  </div>
                  <div className="text-xs text-slate-500">
                    Academic Year 2026–2027
                  </div>
                </div>
              </div>

              <div className="hidden rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 sm:block">
                ● System Operational
              </div>
            </div>

            <div className="grid gap-4 bg-slate-50 p-5 sm:grid-cols-2 lg:grid-cols-4">
              <DashboardMetric
                title="Total Students"
                value="2,486"
                change="+4.2% from last term"
              />

              <DashboardMetric
                title="Today's Attendance"
                value="94.8%"
                change="2,358 Present"
              />

              <DashboardMetric
                title="Fee Realization"
                value="₹18.6L"
                change="82.4% collected"
              />

              <DashboardMetric
                title="CRM Leads"
                value="124"
                change="+18 new this week"
              />
            </div>

            <div className="grid gap-5 p-5 lg:grid-cols-[1.4fr_0.8fr]">
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900">
                      Attendance Overview
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Weekly attendance performance
                    </p>
                  </div>

                  <BarChart3 className="h-5 w-5 text-indigo-600" />
                </div>

                <div className="mt-7 flex h-36 items-end justify-between gap-3">
                  {[
                    ["Mon", "82%"],
                    ["Tue", "91%"],
                    ["Wed", "87%"],
                    ["Thu", "95%"],
                    ["Fri", "94%"],
                    ["Sat", "89%"],
                  ].map(([day, height]) => (
                    <div
                      key={day}
                      className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                    >
                      <div
                        className="w-full max-w-10 rounded-t-md bg-indigo-500"
                        style={{ height }}
                      />
                      <span className="text-[11px] text-slate-500">
                        {day}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="h-5 w-5 text-indigo-600" />
                  <h3 className="font-bold text-slate-900">
                    AI Insights
                  </h3>
                </div>

                <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <p className="text-xs font-semibold text-amber-800">
                    Attendance Alert
                  </p>

                  <p className="mt-2 text-xs leading-5 text-amber-700">
                    Grade 8 attendance is below the school baseline.
                    Review recurring absences.
                  </p>
                </div>

                <div className="mt-3 rounded-lg border border-indigo-100 bg-indigo-50 p-4">
                  <p className="text-xs font-semibold text-indigo-800">
                    Fee Collection Opportunity
                  </p>

                  <p className="mt-2 text-xs leading-5 text-indigo-700">
                    24 pending accounts may benefit from automated
                    follow-up.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section
        id="pricing"
        className="bg-white px-4 py-20 sm:px-6"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold text-indigo-600">
              SIMPLE, TRANSPARENT PRICING
            </span>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Choose the right plan for your school.
            </h2>

            <p className="mt-4 text-slate-600">
              Start with the essentials and scale SmartCampusAI as
              your school grows.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">

            {/* Starter */}
            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="text-sm font-semibold text-slate-500">
                STARTER
              </div>

              <h3 className="mt-3 text-2xl font-bold text-slate-950">
                Essential
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Core tools for schools beginning their digital
                transformation.
              </p>

              <div className="mt-6">
                <span className="text-3xl font-bold text-slate-950">
                  Custom
                </span>
              </div>

              <Link
                href="#demo"
                className="mt-7 flex w-full items-center justify-center rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Talk to Our Team
              </Link>

              <ul className="mt-7 space-y-3 text-sm text-slate-600">
                <PricingFeature text="Student Management" />
                <PricingFeature text="Teacher Management" />
                <PricingFeature text="Attendance" />
                <PricingFeature text="Basic Reports" />
                <PricingFeature text="School Dashboard" />
              </ul>
            </div>

            {/* Professional */}
            <div className="relative rounded-2xl border-2 border-indigo-600 bg-white p-7 shadow-xl">

              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-4 py-1 text-xs font-bold text-white">
                MOST POPULAR
              </div>

              <div className="text-sm font-semibold text-indigo-600">
                PROFESSIONAL
              </div>

              <h3 className="mt-3 text-2xl font-bold text-slate-950">
                Growth
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Advanced school operations and intelligent insights
                for growing institutions.
              </p>

              <div className="mt-6">
                <span className="text-3xl font-bold text-slate-950">
                  Custom
                </span>
              </div>

              <Link
                href="#demo"
                className="mt-7 flex w-full items-center justify-center rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Request a Demo
              </Link>

              <ul className="mt-7 space-y-3 text-sm text-slate-600">
                <PricingFeature text="Everything in Essential" />
                <PricingFeature text="Admissions CRM" />
                <PricingFeature text="Fee Management" />
                <PricingFeature text="Advanced Analytics" />
                <PricingFeature text="AI Insights" />
                <PricingFeature text="Automated Alerts" />
              </ul>
            </div>

            {/* Enterprise */}
            <div className="rounded-2xl border border-slate-200 bg-slate-900 p-7 text-white shadow-sm">

              <div className="text-sm font-semibold text-indigo-300">
                ENTERPRISE
              </div>

              <h3 className="mt-3 text-2xl font-bold">
                Network
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-300">
                Built for school groups, multi-campus organizations,
                and large education networks.
              </p>

              <div className="mt-6">
                <span className="text-3xl font-bold">
                  Custom
                </span>
              </div>

              <Link
                href="#demo"
                className="mt-7 flex w-full items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100"
              >
                Contact Sales
              </Link>

              <ul className="mt-7 space-y-3 text-sm text-slate-300">
                <PricingFeature text="Everything in Growth" />
                <PricingFeature text="Multi-School Management" />
                <PricingFeature text="Advanced Roles & Permissions" />
                <PricingFeature text="Enterprise Analytics" />
                <PricingFeature text="Priority Support" />
                <PricingFeature text="Custom Integrations" />
              </ul>
            </div>

          </div>

          <p className="mt-8 text-center text-xs text-slate-500">
            Pricing is customized based on school size, modules,
            campuses, and operational requirements.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section
        id="faq"
        className="border-y border-slate-200 bg-slate-50 px-4 py-20 sm:px-6"
      >
        <div className="mx-auto max-w-4xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold text-indigo-600">
              FREQUENTLY ASKED QUESTIONS
            </span>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Everything you need to know.
            </h2>

            <p className="mt-4 text-slate-600">
              Answers to common questions about SmartCampusAI,
              implementation, security, and support.
            </p>
          </div>

          <div className="mt-12 space-y-4">

            <FaqItem
              question="What is SmartCampusAI?"
              answer="SmartCampusAI is an AI-powered school management platform that connects student records, teachers, attendance, admissions, fees, academics, communication, analytics, and school operations in one unified system."
            />

            <FaqItem
              question="Is SmartCampusAI suitable for small and large schools?"
              answer="Yes. The platform is designed to scale from individual schools to multi-campus school groups and larger education networks. Modules and access can be configured according to each institution's requirements."
            />

            <FaqItem
              question="Can SmartCampusAI manage multiple schools?"
              answer="Yes. The enterprise architecture is designed to support multi-school and multi-campus organizations with role-based access and separated school data."
            />

            <FaqItem
              question="How does the AI system help school administrators?"
              answer="AI can help identify operational trends, highlight attendance anomalies, summarize information, surface follow-up opportunities, and turn school data into actionable insights."
            />

            <FaqItem
              question="Is school data secure?"
              answer="SmartCampusAI is designed with role-based access, tenant-aware architecture, secure authentication, and database-level security controls. Production deployments should be configured according to the school's security and compliance requirements."
            />

            <FaqItem
              question="Can SmartCampusAI integrate with existing systems?"
              answer="Yes. The platform can be designed to integrate with existing school systems and external services through APIs and controlled data-import workflows."
            />

            <FaqItem
              question="How is pricing calculated?"
              answer="Pricing can be customized based on the number of students, campuses, selected modules, integrations, and operational requirements of the school."
            />

            <FaqItem
              question="How do we get started?"
              answer="Request a demo and our team can understand your school's requirements, demonstrate the platform, and recommend an appropriate implementation plan."
            />

          </div>
        </div>
      </section>

      {/* AI Section */}
      <section
        id="ai"
        className="border-y border-slate-200 bg-slate-900 px-4 py-20 text-white sm:px-6"
      >

        <div className="mx-auto max-w-6xl">

          <div className="grid items-center gap-12 lg:grid-cols-2">

            <div>

              <div className="mb-4 inline-flex rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300">
                SMARTCAMPUS AI
              </div>

              <h2 className="text-3xl font-bold sm:text-4xl">
                From school data to
                <span className="text-indigo-400">
                  {" "}intelligent decisions.
                </span>
              </h2>

              <p className="mt-5 leading-7 text-slate-300">
                SmartCampusAI helps school leaders identify trends,
                understand operational issues, and act faster using
                intelligent insights.
              </p>

              <Link
                href="#demo"
                className="mt-7 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
              >
                Open Command Center
                <ArrowRight className="h-4 w-4" />
              </Link>

            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6 shadow-xl">

              <div className="flex items-center gap-3 border-b border-slate-700 pb-4">

                <div className="rounded-lg bg-indigo-600 p-2">
                  <Bot className="h-5 w-5" />
                </div>

                <div>
                  <div className="text-sm font-semibold">
                    AI Operational Insight
                  </div>
                  <div className="text-xs text-slate-400">
                    School Command Center
                  </div>
                </div>

              </div>

              <div className="mt-6 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4">

                <div className="text-sm font-semibold text-amber-300">
                  Attendance Anomaly Detected
                </div>

                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Grade 8 attendance is trending below the
                  school baseline. Review recurring absences
                  and contact identified families.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* CTA */}
      <section
        id="demo"
        className="px-4 py-20 text-center sm:px-6"
      >

        <div className="mx-auto max-w-3xl">

          <h2 className="text-3xl font-bold text-slate-950 sm:text-4xl">
            Build a smarter school.
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-slate-600">
            Bring your school operations together with
            SmartCampusAI.
          </p>

          <Link
            href="#demo"
            className="mt-7 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3.5 font-semibold text-white shadow-md hover:bg-indigo-700"
          >
            Explore the Platform
            <ArrowRight className="h-4 w-4" />
          </Link>

        </div>

      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">

        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-sm text-slate-500 sm:px-6 md:flex-row md:items-center md:justify-between">

          <div>
            © 2026 SmartCampusAI. All rights reserved.
          </div>

          <div>
            Powered by ThomasG Technologies
          </div>

        </div>

      </footer>

      <AIChatbox
        onRequestDemo={() => setDemoOpen(true)}
      />

      <DemoLeadForm
        open={demoOpen}
        onClose={() => setDemoOpen(false)}
      />
    </main>
  );
}

function FaqItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <details className="group rounded-xl border border-slate-200 bg-white shadow-sm">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-5 py-5 text-sm font-semibold text-slate-900 [&::-webkit-details-marker]:hidden">
        <span>{question}</span>

        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-200 text-lg font-normal text-slate-500 transition-transform group-open:rotate-45">
          +
        </span>
      </summary>

      <div className="border-t border-slate-100 px-5 py-5 text-sm leading-7 text-slate-600">
        {answer}
      </div>
    </details>
  );
}

function PricingFeature({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3">
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600">
        ✓
      </span>
      <span>{text}</span>
    </li>
  );
}

function DashboardMetric({
  title,
  value,
  change,
}: {
  title: string;
  value: string;
  change: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-xs font-medium text-slate-500">
        {title}
      </div>

      <div className="mt-2 text-2xl font-bold text-slate-900">
        {value}
      </div>

      <div className="mt-1 text-xs font-medium text-green-600">
        {change}
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">

      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
        {icon}
      </div>

      <h3 className="text-lg font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-600">
        {description}
      </p>

</div>
  );
}
