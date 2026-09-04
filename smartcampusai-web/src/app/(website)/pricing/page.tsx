import Link from "next/link";
import {
  ArrowRight,
  Check,
  Crown,
  Database,
  GraduationCap,
  Headphones,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";

const plans = [
  {
    name: "Starter",
    description: "For schools beginning their digital transformation.",
    monthly: "₹999",
    annual: "₹9,990",
    icon: GraduationCap,
    popular: false,
    features: [
      "Student management",
      "Academic management",
      "Attendance",
      "Basic examinations",
      "Basic fee management",
      "Parent communication",
      "Standard reports",
    ],
  },
  {
    name: "Growth",
    description:
      "For institutions ready to connect operations, academics and intelligence.",
    monthly: "₹1,999",
    annual: "₹19,990",
    icon: Sparkles,
    popular: true,
    features: [
      "Everything in Starter",
      "Admissions CRM",
      "Advanced academics",
      "Advanced examinations",
      "Finance management",
      "Learning platform",
      "AI-powered insights",
      "Advanced reports",
      "Priority support",
    ],
  },
  {
    name: "Enterprise",
    description:
      "For multi-campus organizations with advanced requirements.",
    monthly: "Custom",
    annual: "Custom",
    icon: Crown,
    popular: false,
    features: [
      "Everything in Growth",
      "Multi-campus management",
      "Advanced permissions",
      "Custom workflows",
      "Enterprise integrations",
      "Dedicated onboarding",
      "Custom reporting",
      "Priority implementation",
      "Dedicated support",
    ],
  },
];

const foundingBenefits = [
  {
    icon: Zap,
    title: "20% OFF annual plans",
    description: "Exclusive launch pricing for founding institutions.",
  },
  {
    icon: Database,
    title: "FREE data import",
    description: "We'll help bring your existing institutional data into SmartCampusAI.",
  },
  {
    icon: Users,
    title: "FREE onboarding",
    description: "Guided setup for your administrators and institution.",
  },
  {
    icon: Headphones,
    title: "Priority support",
    description: "Get closer support during your transition to SmartCampusAI.",
  },
  {
    icon: GraduationCap,
    title: "Administrator training",
    description: "Help your team get productive with the platform.",
  },
  {
    icon: ShieldCheck,
    title: "12-month price lock",
    description: "Your founding launch pricing stays protected for 12 months.",
  },
];

const faqs = [
  {
    question: "Who is SmartCampusAI for?",
    answer:
      "SmartCampusAI is designed for schools, educational institutions and growing campus organizations that want to bring their academic and operational workflows together.",
  },
  {
    question: "What is the Founding School Program?",
    answer:
      "The Founding School Program is a limited launch offer for the first 100 institutions. Founding institutions receive 20% off annual subscriptions, free onboarding, initial data import, administrator training and locked launch pricing for 12 months.",
  },
  {
    question: "Can we start with one module?",
    answer:
      "Yes. You can begin with the capabilities most important to your institution and expand as your requirements grow.",
  },
  {
    question: "Do you support multiple campuses?",
    answer:
      "Yes. Multi-campus management is available with the Enterprise plan.",
  },
  {
    question: "Can SmartCampusAI be customized?",
    answer:
      "Enterprise institutions can work with the SmartCampusAI team on custom workflows, integrations, reporting and implementation requirements.",
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">


      <section className="relative overflow-hidden px-6 pb-20 pt-24 md:pb-28 md:pt-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,rgba(37,99,235,0.12),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(124,58,237,0.12),transparent_28%)]" />

        <div className="mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-xs font-semibold text-violet-700">
            <Sparkles size={14} />
            Founding School Program
          </div>

          <h1 className="mt-8 text-5xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-6xl md:text-8xl">
            Simple pricing.
            <br />
            <span className="bg-gradient-to-r from-[#2563EB] via-[#0891B2] to-[#7C3AED] bg-clip-text text-transparent">
              Powerful campus operations.
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
            Start with the essentials and scale to an intelligent,
            connected operating system for your institution.
          </p>

          <div className="mt-10 inline-flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-700">
            <Check size={17} />
            First 100 schools receive 20% OFF annual subscriptions
          </div>
        </div>
      </section>

      <section className="px-6 pb-28">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-3">
          {plans.map((plan) => {
            const Icon = plan.icon;

            return (
              <div
                key={plan.name}
                className={`relative rounded-[28px] border p-8 transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.10)] ${
                  plan.popular
                    ? "border-blue-300 bg-white shadow-[0_20px_70px_rgba(37,99,235,0.14)]"
                    : "border-slate-200 bg-white"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-8 rounded-full bg-gradient-to-r from-[#2563EB] to-[#7C3AED] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-white">
                    Most Popular
                  </div>
                )}

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
                  <Icon size={21} />
                </div>

                <h2 className="mt-7 text-2xl font-semibold tracking-tight">
                  {plan.name}
                </h2>

                <p className="mt-3 min-h-[56px] text-sm leading-6 text-slate-500">
                  {plan.description}
                </p>

                <div className="mt-8">
                  {plan.monthly === "Custom" ? (
                    <p className="text-4xl font-semibold tracking-tight">
                      Custom
                    </p>
                  ) : (
                    <>
                      <div className="flex items-end gap-2">
                        <span className="text-4xl font-semibold tracking-tight">
                          {plan.monthly}
                        </span>
                        <span className="pb-1 text-sm text-slate-500">
                          / month
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-slate-500">
                        or{" "}
                        <span className="font-semibold text-slate-800">
                          {plan.annual}/year
                        </span>
                      </p>
                    </>
                  )}
                </div>

                <Link
                  href={plan.name === "Enterprise" ? "/contact" : "/demo"}
                  className={`mt-8 flex items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-semibold transition ${
                    plan.popular
                      ? "bg-gradient-to-r from-[#2563EB] via-[#0891B2] to-[#7C3AED] text-white shadow-lg shadow-blue-500/15 hover:-translate-y-0.5"
                      : "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {plan.name === "Enterprise"
                    ? "Talk to sales"
                    : "Start with this plan"}
                  <ArrowRight size={15} />
                </Link>

                <div className="my-8 h-px bg-slate-200" />

                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Included
                </p>

                <ul className="mt-5 space-y-3.5">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm leading-6 text-slate-600"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                        <Check size={12} strokeWidth={2.5} />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      <section className="relative overflow-hidden bg-slate-950 px-6 py-24 text-white md:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(37,99,235,0.28),transparent_30%),radial-gradient(circle_at_85%_80%,rgba(124,58,237,0.28),transparent_30%)]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold text-white/80">
              <Crown size={14} />
              Limited launch opportunity
            </div>

            <h2 className="mt-7 text-4xl font-semibold leading-tight tracking-[-0.045em] md:text-6xl">
              Become one of the first 100 SmartCampusAI institutions.
            </h2>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Get the support you need to move from disconnected systems to
              one intelligent campus platform.
            </p>
          </div>

          <div className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {foundingBenefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <div
                  key={benefit.title}
                  className="rounded-[24px] border border-white/10 bg-white/[0.06] p-6 backdrop-blur-sm"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                    <Icon size={19} />
                  </div>

                  <h3 className="mt-5 text-lg font-semibold">
                    {benefit.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-12 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/demo"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5"
            >
              Claim founding offer
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Talk to our team
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Frequently asked questions
            </p>

            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.045em] md:text-6xl">
              Questions, answered.
            </h2>
          </div>

          <div className="mt-14 divide-y divide-slate-200 border-y border-slate-200">
            {faqs.map((faq) => (
              <div key={faq.question} className="py-7">
                <h3 className="text-lg font-semibold">{faq.question}</h3>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50 px-6 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <Sparkles className="mx-auto" size={34} />

          <h2 className="mt-7 text-4xl font-semibold tracking-[-0.045em] md:text-6xl">
            Ready to build a smarter campus?
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-500">
            Join the first 100 institutions and launch with the SmartCampusAI
            founding program.
          </p>

          <Link
            href="/demo"
            className="mt-9 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#2563EB] via-[#0891B2] to-[#7C3AED] px-8 py-4 text-sm font-semibold text-white shadow-xl shadow-blue-500/20 transition hover:-translate-y-0.5"
          >
            Request a demo
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-200 px-6 py-12">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 text-sm text-slate-500 md:flex-row">
          <p>© {new Date().getFullYear()} SmartCampusAI. All rights reserved.</p>

          <div className="flex flex-wrap gap-6">
            <Link href="/solutions" className="hover:text-slate-950">
              Solutions
            </Link>
            <Link href="/about" className="hover:text-slate-950">
              About
            </Link>
            <Link href="/contact" className="hover:text-slate-950">
              Contact
            </Link>
            <Link href="/login" className="hover:text-slate-950">
              Sign in
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
