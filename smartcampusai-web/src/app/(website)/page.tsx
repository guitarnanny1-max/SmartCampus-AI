import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Brain,
  Building2,
  Check,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

const modules = [
  {
    name: "AI Command Center",
    description:
      "Turn institutional data into decisions, insights and intelligent actions.",
    icon: Brain,
    href: "/product/ai",
  },
  {
    name: "Education ERP",
    description:
      "Students, academics, attendance, examinations, fees and administration.",
    icon: GraduationCap,
    href: "/product/erp",
  },
  {
    name: "Admissions CRM",
    description:
      "Manage enquiries, counselling, applications and admissions from one place.",
    icon: Users,
    href: "/product/crm",
  },
  {
    name: "Learning Platform",
    description:
      "Courses, assignments, assessments and learning progress.",
    icon: Sparkles,
    href: "/product/lms",
  },
  {
    name: "Business Management",
    description:
      "Finance, HR, assets, inventory, procurement and campus operations.",
    icon: Building2,
    href: "/product/bms",
  },
];

const benefits = [
  "One connected campus platform",
  "Real-time institutional intelligence",
  "Role-based access and permissions",
  "Designed for multi-campus organizations",
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-[#202124]">


      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.10),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(124,58,237,0.10),transparent_28%)] px-6 pb-24 pt-24 md:pb-32 md:pt-32">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-5xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-[#F8F9FA] px-4 py-2 text-xs font-medium text-gray-600">
              <span className="h-1.5 w-1.5 rounded-full bg-[#1A73E8]" />
              The intelligent operating system for education
            </div>

            <h1 className="mt-8 text-5xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-6xl md:text-8xl">
              Run your entire
              <br />
              institution{" "}
              <span className="text-[#64748B]">intelligently.</span>
            </h1>

            <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-[#64748B] md:text-xl">
              SmartCampusAI unifies academics, admissions, administration,
              finance, learning and AI into one powerful campus platform.
            </p>

            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/demo"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1A73E8] px-7 py-3.5 text-sm font-medium text-white transition hover:bg-[#185ABC]"
              >
                Request a demo
                <ArrowRight size={16} />
              </Link>

              <Link
                href="/solutions"
                className="inline-flex items-center justify-center rounded-full border border-gray-300 px-7 py-3.5 text-sm font-medium transition hover:bg-[#F8F9FA]"
              >
                Explore platform
              </Link>
            </div>
          </div>

          <div className="relative mx-auto mt-20 max-w-6xl">
            <div className="absolute -inset-10 -z-10 rounded-full bg-gray-100 blur-3xl" />

            <div className="overflow-hidden rounded-[28px] border border-[#E2E8F0] bg-white shadow-[0_35px_100px_rgba(0,0,0,0.12)]">
              <div className="flex h-12 items-center border-b border-[#E2E8F0] bg-[#F8F9FA] px-5">
                <div className="flex gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
                </div>

                <div className="mx-auto hidden rounded-md bg-white px-20 py-1.5 text-[10px] text-[#64748B] shadow-sm sm:block">
                  app.smartcampusai.com
                </div>
              </div>

              <div className="grid min-h-[520px] md:grid-cols-[210px_1fr]">
                <aside className="hidden border-r border-[#E2E8F0] bg-[#F8F9FA]/70 p-5 md:block">
                  <div className="text-sm font-semibold">
                    SmartCampusAI
                  </div>

                  <div className="mt-9 space-y-1 text-xs text-[#64748B]">
                    <div className="rounded-lg bg-white px-3 py-2 font-medium text-gray-900 shadow-sm">
                      Overview
                    </div>
                    <div className="px-3 py-2">Students</div>
                    <div className="px-3 py-2">Academics</div>
                    <div className="px-3 py-2">Admissions</div>
                    <div className="px-3 py-2">Finance</div>
                    <div className="px-3 py-2">Communication</div>
                    <div className="px-3 py-2">AI Command Center</div>
                  </div>
                </aside>

                <div className="p-6 md:p-9">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-[#64748B]">
                        Monday, August 30
                      </p>

                      <h2 className="mt-1 text-2xl font-semibold tracking-tight">
                        Campus overview
                      </h2>
                    </div>

                    <div className="hidden items-center gap-2 rounded-full border border-[#E2E8F0] px-3 py-1.5 text-xs sm:flex">
                      <span className="h-2 w-2 rounded-full bg-[#34A853]" />
                      AI active
                    </div>
                  </div>

                  <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                      ["4,286", "Students", "+8.2%"],
                      ["186", "Faculty", "+4.1%"],
                      ["94.8%", "Attendance", "+2.4%"],
                      ["₹18.4L", "Collections", "+12.8%"],
                    ].map(([value, label, change]) => (
                      <div
                        key={label}
                        className="rounded-2xl border border-[#E2E8F0] bg-[#F8F9FA] p-5"
                      >
                        <p className="text-xs text-[#64748B]">{label}</p>
                        <p className="mt-2 text-2xl font-semibold tracking-tight">
                          {value}
                        </p>
                        <p className="mt-2 text-[11px] text-[#64748B]">
                          {change} this month
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
                    <div className="rounded-2xl border border-[#E2E8F0] p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">
                            Student engagement
                          </p>
                          <p className="mt-1 text-xs text-[#64748B]">
                            Last 30 days
                          </p>
                        </div>

                        <BarChart3 size={18} className="text-[#64748B]" />
                      </div>

                      <div className="relative mt-8 h-44 w-full overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 via-white to-violet-50 p-3">
                        <svg
                          viewBox="0 0 720 180"
                          className="h-full w-full"
                          preserveAspectRatio="none"
                          role="img"
                          aria-label="Student engagement over the last 30 days"
                        >
                          <defs>
                            <linearGradient
                              id="engagementGradient"
                              x1="0"
                              y1="0"
                              x2="1"
                              y2="0"
                            >
                              <stop offset="0%" stopColor="#2563EB" />
                              <stop offset="25%" stopColor="#0891B2" />
                              <stop offset="50%" stopColor="#4F46E5" />
                              <stop offset="75%" stopColor="#7C3AED" />
                              <stop offset="100%" stopColor="#E11D48" />
                            </linearGradient>

                            <linearGradient
                              id="engagementFill"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="0%"
                                stopColor="#7C3AED"
                                stopOpacity="0.25"
                              />
                              <stop
                                offset="100%"
                                stopColor="#2563EB"
                                stopOpacity="0"
                              />
                            </linearGradient>
                          </defs>

                          <line
                            x1="0"
                            y1="35"
                            x2="720"
                            y2="35"
                            stroke="#E2E8F0"
                            strokeWidth="1"
                          />
                          <line
                            x1="0"
                            y1="90"
                            x2="720"
                            y2="90"
                            stroke="#E2E8F0"
                            strokeWidth="1"
                          />
                          <line
                            x1="0"
                            y1="145"
                            x2="720"
                            y2="145"
                            stroke="#E2E8F0"
                            strokeWidth="1"
                          />

                          <path
                            d="M0 138
                               C30 130, 45 112, 70 120
                               S110 135, 130 105
                               S170 92, 190 112
                               S230 122, 250 82
                               S290 68, 310 94
                               S350 108, 370 62
                               S410 58, 430 78
                               S470 92, 490 48
                               S530 55, 550 68
                               S590 72, 610 38
                               S650 45, 670 52
                               S700 35, 720 28
                               L720 180
                               L0 180 Z"
                            fill="url(#engagementFill)"
                          />

                          <path
                            d="M0 138
                               C30 130, 45 112, 70 120
                               S110 135, 130 105
                               S170 92, 190 112
                               S230 122, 250 82
                               S290 68, 310 94
                               S350 108, 370 62
                               S410 58, 430 78
                               S470 92, 490 48
                               S530 55, 550 68
                               S590 72, 610 38
                               S650 45, 670 52
                               S700 35, 720 28"
                            fill="none"
                            stroke="url(#engagementGradient)"
                            strokeWidth="5"
                            strokeLinecap="round"
                          />

                          <circle cx="130" cy="105" r="5" fill="#0891B2" />
                          <circle cx="250" cy="82" r="5" fill="#4F46E5" />
                          <circle cx="370" cy="62" r="5" fill="#7C3AED" />
                          <circle cx="490" cy="48" r="5" fill="#E11D48" />
                          <circle cx="610" cy="38" r="5" fill="#D97706" />
                          <circle cx="720" cy="28" r="6" fill="#059669" />
                        </svg>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8F9FA] p-6">
                      <div className="flex items-center gap-2">
                        <Brain size={18} />
                        <p className="text-sm font-medium">
                          AI insight
                        </p>
                      </div>

                      <p className="mt-5 text-base leading-7 text-gray-600">
                        Attendance has improved across 12 classes. Three
                        classes may benefit from targeted intervention.
                      </p>

                      <Link
                        href="/product/ai"
                        className="mt-6 inline-flex items-center gap-2 text-xs font-semibold"
                      >
                        View insight
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#E2E8F0] bg-[#F8F9FA] px-6 py-24 md:py-32">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-4xl font-semibold leading-tight tracking-[-0.045em] md:text-6xl">
            One platform for every part of your institution.
            <span className="text-[#64748B]">
              {" "}
              From the first enquiry to graduation.
            </span>
          </p>
        </div>
      </section>

      <section className="border-t border-[#E2E8F0] bg-white px-6 py-24 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#64748B]">
                SmartCampusAI Products
              </p>
              <h2 className="mt-5 text-4xl font-semibold tracking-[-0.045em] md:text-6xl">
                Everything connected.
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[#64748B]">
                One intelligent platform connecting admissions, academics,
                learning, business operations and institutional intelligence.
              </p>
            </div>

            <Link
              href="/solutions"
              className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-[#1A73E8] hover:text-[#185ABC]"
            >
              Explore all solutions
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="mt-16 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {modules.map((module, index) => {
              const Icon = module.icon;

              return (
                <Link
                  key={module.name}
                  href={module.href}
                  className={`group relative overflow-hidden rounded-[28px] border border-[#E2E8F0] bg-white p-8 transition duration-300 hover:-translate-y-1 hover:border-[#CBD5E1] hover:shadow-[0_24px_60px_rgba(0,0,0,0.10)] ${
                    index === 0 ? "md:col-span-2 xl:col-span-2" : ""
                  }`}
                >
                  <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-gray-50 blur-2xl transition group-hover:bg-blue-50" />

                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#E2E8F0] bg-[#F8F9FA] text-[#202124]">
                        <Icon size={22} strokeWidth={1.7} />
                      </div>

                      <ArrowUpRight
                        size={18}
                        className="text-[#94A3B8] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#1A73E8]"
                      />
                    </div>

                    <p className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-[#64748B]">
                      {module.name === "AI Command Center"
                        ? "Intelligence"
                        : module.name === "Education ERP"
                          ? "Campus Operations"
                          : module.name === "Admissions CRM"
                            ? "Admissions"
                            : module.name === "Learning Platform"
                              ? "Learning"
                              : "Business Operations"}
                    </p>

                    <h3 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
                      {module.name}
                    </h3>

                    <p className="mt-4 max-w-xl leading-7 text-[#64748B]">
                      {module.description}
                    </p>

                    <div className="mt-8 inline-flex items-center gap-2 text-sm font-semibold">
                      Explore product
                      <ArrowRight
                        size={15}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-8 rounded-[24px] border border-[#E2E8F0] bg-[#F8F9FA] p-6 md:p-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold text-[#202124]">
                  From the first enquiry to graduation.
                </p>
                <p className="mt-1 text-sm leading-6 text-[#64748B]">
                  SmartCampusAI connects the complete institutional journey
                  on one secure platform.
                </p>
              </div>

              <Link
                href="/demo"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#1A73E8] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#185ABC]"
              >
                Request a demo
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-[#202124] px-6 py-28 text-white md:py-40">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
              <Brain size={25} />
            </div>

            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-[#64748B]">
              Intelligence
            </p>

            <h2 className="mt-5 text-5xl font-semibold leading-[1] tracking-[-0.055em] md:text-7xl">
              Intelligence built into every workflow.
            </h2>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-[#64748B]">
              Understand your institution in real time. Identify trends,
              discover opportunities and take action with AI-powered insights.
            </p>
          </div>

          <div className="mt-20 grid gap-5 md:grid-cols-3">
            {[
              ["Predict", "Identify trends before they become problems."],
              ["Understand", "Turn campus data into actionable insights."],
              ["Act", "Move from insight to execution faster."],
            ].map(([title, description]) => (
              <div
                key={title}
                className="rounded-[24px] border border-white/10 bg-white/[0.05] p-7"
              >
                <h3 className="text-2xl font-semibold">{title}</h3>
                <p className="mt-4 leading-7 text-[#64748B]">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#64748B]">
              Built for institutions
            </p>

            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.045em] md:text-6xl">
              Powerful enough for enterprise.
              <span className="text-[#64748B]"> Simple enough for everyone.</span>
            </h2>
          </div>

          <div className="space-y-4">
            {benefits.map((benefit) => (
              <div
                key={benefit}
                className="flex items-center gap-4 border-b border-[#E2E8F0] pb-5"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100">
                  <Check size={14} />
                </div>

                <span className="text-base text-gray-600">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#E2E8F0] bg-[#F8F9FA] px-6 py-28 md:py-36">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <ShieldCheck size={42} strokeWidth={1.5} />

          <h2 className="mt-8 text-4xl font-semibold tracking-[-0.045em] md:text-6xl">
            Designed for trust.
          </h2>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#64748B]">
            Security, permissions, privacy and institutional governance are
            built into the foundation.
          </p>

          <Link
            href="/contact"
            className="mt-8 inline-flex items-center gap-2 text-sm font-medium"
          >
            Learn more
            <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      <section className="px-6 py-32 md:py-44">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#64748B]">
            SmartCampusAI
          </p>

          <h2 className="mt-6 text-5xl font-semibold leading-[0.95] tracking-[-0.055em] md:text-8xl">
            The future of campus management.
          </h2>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-[#64748B]">
            Bring your entire institution together on one intelligent
            platform.
          </p>

          <Link
            href="/demo"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-[#1A73E8] px-8 py-4 text-sm font-medium text-white transition hover:bg-[#185ABC]"
          >
            Request a demo
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <footer className="border-t border-[#E2E8F0] px-6 py-12">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 text-sm text-[#64748B] md:flex-row">
          <div>
            © {new Date().getFullYear()} SmartCampusAI. All rights reserved.
          </div>

          <div className="flex flex-wrap gap-6">
            <Link href="/solutions" className="hover:text-black">
              Solutions
            </Link>
            <Link href="/pricing" className="hover:text-black">
              Pricing
            </Link>
            <Link href="/contact" className="hover:text-black">
              Contact
            </Link>
            <Link href="/login" className="hover:text-black">
              Sign in
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
