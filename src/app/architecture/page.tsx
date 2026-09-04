import {
  ArrowRight,
  BarChart3,
  Bell,
  Bot,
  Bus,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  Database,
  GraduationCap,
  HeartHandshake,
  Layers3,
  LogIn,
  MessageSquare,
  PhoneCall,
  Send,
  Sparkles,
  UserPlus,
  Users,
  Workflow,
} from "lucide-react";

const operations = [
  { icon: UserPlus, title: "Admissions & Sales CRM" },
  { icon: CircleDollarSign, title: "Fees & Collections" },
  { icon: Users, title: "HR & Staff" },
  { icon: Bus, title: "Transport & Fleet" },
];

const academics = [
  { icon: Clock3, title: "Attendance" },
  { icon: BarChart3, title: "Exams & Assessments" },
  { icon: GraduationCap, title: "Results & Gradecards" },
  { icon: CalendarDays, title: "Smart Timetable" },
];

const engagement = [
  { icon: Users, title: "Parent Portal" },
  { icon: GraduationCap, title: "Student App" },
  { icon: MessageSquare, title: "WhatsApp Integration" },
  { icon: Bell, title: "Notifications" },
];

const intelligenceExamples = [
  "Identify students at attendance risk",
  "Detect pending fee collections",
  "Prioritize admission follow-ups",
  "Prepare parent communication",
];

const pricingOptions = [
  {
    name: "Starter",
    description: "Essential school management for smaller schools.",
    price: "₹999",
    features: ["Core school operations", "Student management", "Basic reports"],
  },
  {
    name: "Growth",
    description: "More capabilities for growing school teams.",
    price: "₹1,999",
    features: [
      "Starter features",
      "Admissions CRM",
      "Fees & collections",
      "Communication",
    ],
  },
  {
    name: "Professional",
    description: "Complete school operations in one platform.",
    price: "₹3,999",
    features: [
      "Growth features",
      "Academics",
      "HR & staff",
      "Advanced analytics",
    ],
  },
  {
    name: "AI 360",
    description: "Full operations with AI and automation.",
    price: "₹6,999",
    featured: true,
    features: [
      "Everything in Professional",
      "AI Command Center",
      "AI Chatbot",
      "AI + Automation Engine",
    ],
  },
];

export default function ArchitecturePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-white text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <a href="/architecture" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg shadow-indigo-200">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>

            <div>
              <div className="text-lg font-black tracking-tight text-slate-950">
                SmartCampus <span className="text-indigo-600">AI</span>
              </div>

              <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                360° School Operating System
              </div>
            </div>
          </a>

          <nav className="hidden items-center gap-2 md:flex">
            <a
              href="#architecture"
              className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
            >
              Platform
            </a>

            <a
              href="#pricing"
              className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
            >
              Plans
            </a>

            <a
              href="/campus-admin/login"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-800 transition hover:border-indigo-300 hover:text-indigo-600"
            >
              <LogIn className="h-4 w-4" />
              School Login
            </a>

            <a
              href="/school-admissions-crm"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700"
            >
              Request Demo
              <ArrowRight className="h-4 w-4" />
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-20 pt-20 sm:px-6 lg:px-8 lg:pb-28 lg:pt-28">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_70%_15%,rgba(99,102,241,0.16),transparent_42%),radial-gradient(circle_at_20%_40%,rgba(168,85,247,0.08),transparent_38%)]" />

        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-indigo-700">
              <Sparkles className="h-4 w-4" />
              Intelligent School Technology
            </div>

            <h1 className="text-5xl font-black leading-[1.02] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              SmartCampus{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                AI
              </span>
            </h1>

            <p className="mt-5 text-2xl font-bold text-slate-700 sm:text-3xl">
              360° School Operating System
            </p>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              One intelligent platform connecting school operations,
              academics, engagement, data and automation — with AI helping
              your team make faster, smarter decisions.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="/school-admissions-crm"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-indigo-200 transition hover:bg-indigo-700"
              >
                Request a Demo
                <ArrowRight className="h-4 w-4" />
              </a>

              <a
                href="/campus-admin/login"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-bold text-slate-800 transition hover:border-indigo-300 hover:text-indigo-600"
              >
                <LogIn className="h-4 w-4" />
                Registered School Login
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-5 text-xs font-bold text-slate-500">
              {["Secure", "Multi-Tenant", "Role-Based", "AI-Powered"].map(
                (item) => (
                  <span key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    {item}
                  </span>
                ),
              )}
            </div>
          </div>

          {/* AI Dashboard Visual */}
          <div className="relative">
            <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-r from-indigo-200 via-purple-100 to-blue-200 blur-3xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950 p-4 shadow-2xl">
              <div className="rounded-[1.5rem] border border-white/10 bg-slate-900 p-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-5">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                      School Intelligence
                    </p>

                    <h2 className="mt-1 text-lg font-black text-white">
                      Today&apos;s School Overview
                    </h2>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-600/30">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <DashboardMetric
                    label="Attendance"
                    value="94.2%"
                    status="Healthy"
                  />

                  <DashboardMetric
                    label="Fees Pending"
                    value="₹8.4L"
                    status="Needs Attention"
                  />

                  <DashboardMetric
                    label="Students at Risk"
                    value="37"
                    status="AI Detected"
                  />

                  <DashboardMetric
                    label="Admission Leads"
                    value="14"
                    status="Follow-up"
                  />
                </div>

                <div className="mt-5 rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-4">
                  <div className="flex items-start gap-3">
                    <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-indigo-400" />

                    <div>
                      <p className="text-sm font-bold text-white">
                        AI Recommendation
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-400">
                        37 students are below the attendance threshold.
                        Prepare parent alerts?
                      </p>

                      <button className="mt-3 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-indigo-500">
                        Prepare Alerts
                        <Send className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Customer Journey */}
      <section className="border-y border-slate-200 bg-slate-50 px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-indigo-600">
              Intelligent Customer Experience
            </p>

            <h2 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">
              Connect every enquiry to the right experience.
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={Bot}
              title="AI Chatbot"
              description="Ask questions, explore SmartCampus AI and get instant answers while qualified enquiries become leads."
            />

            <FeatureCard
              icon={Sparkles}
              title="SmartCampus Explorer"
              description="Explore the 360° School Operating System, modules, AI capabilities and workflows interactively."
            />

            <FeatureCard
              icon={PhoneCall}
              title="Voice / AI Call Center"
              description="Handle school enquiries with intelligent voice support and connect qualified prospects with sales."
            />

            <FeatureCard
              icon={UserPlus}
              title="Sales CRM"
              description="Capture, qualify, track and follow up every school enquiry from one sales workspace."
            />
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section id="architecture" className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-indigo-600">
              One Intelligent Platform
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
              The architecture behind your school
            </h2>

            <p className="mt-5 text-slate-600">
              One operating system. One school data foundation. One
              intelligence layer.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-xl">
            <div className="rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 p-[2px] shadow-xl shadow-indigo-100">
              <div className="rounded-[22px] bg-white p-8 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-200">
                  <Bot className="h-8 w-8 text-white" />
                </div>

                <h3 className="mt-5 text-xl font-black uppercase tracking-wide text-slate-950">
                  AI Command Center
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Understand, predict, recommend and automate school
                  decisions.
                </p>

                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  {["Understand", "Predict", "Recommend", "Automate"].map(
                    (item) => (
                      <span
                        key={item}
                        className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700"
                      >
                        {item}
                      </span>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto h-10 w-px bg-indigo-300" />

          <div className="grid gap-5 lg:grid-cols-3">
            <ArchitecturePillar
              title="Operations"
              description="Run the business side of your school."
              icon={Layers3}
              iconClassName="text-blue-600"
              iconBackground="bg-blue-50"
              items={operations}
            />

            <ArchitecturePillar
              title="Academics"
              description="Manage learning, assessment and performance."
              icon={GraduationCap}
              iconClassName="text-emerald-600"
              iconBackground="bg-emerald-50"
              items={academics}
            />

            <ArchitecturePillar
              title="Engagement"
              description="Keep parents, students and staff connected."
              icon={HeartHandshake}
              iconClassName="text-purple-600"
              iconBackground="bg-purple-50"
              items={engagement}
            />
          </div>

          <div className="mx-auto h-10 w-px bg-slate-300" />

          <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-lg shadow-slate-100">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50">
              <Database className="h-6 w-6 text-indigo-600" />
            </div>

            <h3 className="mt-4 text-sm font-black uppercase tracking-[0.15em] text-slate-950">
              School Data Layer
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              Secure, unified and scalable foundation for every school.
            </p>

            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {["Secure", "Multi-Tenant", "Role-Based", "Auditable"].map(
                (item) => (
                  <span
                    key={item}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-600"
                  >
                    {item}
                  </span>
                ),
              )}
            </div>
          </div>

          <div className="mx-auto h-8 w-px bg-indigo-300" />

          <div className="mx-auto max-w-xl rounded-2xl border border-indigo-200 bg-indigo-50 p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600">
              <Workflow className="h-6 w-6 text-white" />
            </div>

            <h3 className="mt-4 text-sm font-black uppercase tracking-[0.15em] text-indigo-950">
              AI + Automation Engine
            </h3>

            <p className="mt-2 text-sm text-indigo-700">
              AI workflows, integrations, scheduled actions, webhooks and
              automated communication.
            </p>
          </div>
        </div>
      </section>

      {/* Intelligence */}
      <section className="bg-slate-950 px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="flex items-center gap-2 text-sm font-bold text-indigo-400">
                <Sparkles className="h-4 w-4" />
                AI IN ACTION
              </div>

              <h2 className="mt-4 text-3xl font-black sm:text-5xl">
                Your school data should work for you.
              </h2>

              <p className="mt-5 max-w-xl leading-7 text-slate-400">
                SmartCampus AI transforms everyday school information into
                practical recommendations and actions.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {intelligenceExamples.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5"
                >
                  <CheckCircle2 className="h-5 w-5 text-indigo-400" />

                  <p className="mt-4 text-sm font-semibold leading-6 text-slate-200">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-indigo-600">
              Flexible Pricing
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Choose what your school needs
            </h2>

            <p className="mt-5 text-slate-600">
              Start with what you need today and expand as your school grows.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {pricingOptions.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-3xl border p-6 ${
                  plan.featured
                    ? "border-indigo-500 bg-indigo-600 text-white shadow-xl shadow-indigo-200"
                    : "border-slate-200 bg-white text-slate-900 shadow-lg shadow-slate-100"
                }`}
              >
                {plan.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-slate-950 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                    Recommended
                  </span>
                )}

                <p
                  className={`text-sm font-bold ${
                    plan.featured ? "text-indigo-100" : "text-indigo-600"
                  }`}
                >
                  {plan.name}
                </p>

                <p
                  className={`mt-3 min-h-12 text-sm leading-5 ${
                    plan.featured ? "text-indigo-100" : "text-slate-600"
                  }`}
                >
                  {plan.description}
                </p>

                <div className="mt-6">
                  <span className="text-3xl font-black">{plan.price}</span>

                  <span
                    className={
                      plan.featured ? "text-indigo-200" : "text-slate-500"
                    }
                  >
                    /month
                  </span>
                </div>

                <div className="mt-6 space-y-2">
                  {plan.features.map((feature) => (
                    <div
                      key={feature}
                      className={`flex items-start gap-2 text-xs ${
                        plan.featured ? "text-indigo-100" : "text-slate-600"
                      }`}
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <a
                  href="/school-admissions-crm"
                  className={`mt-6 flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-bold ${
                    plan.featured
                      ? "bg-white text-indigo-700 hover:bg-indigo-50"
                      : "bg-slate-950 text-white hover:bg-slate-800"
                  }`}
                >
                  Choose {plan.name}
                </a>
              </div>
            ))}
          </div>

          <p className="mt-6 text-center text-xs text-slate-500">
            Final pricing depends on student count, modules, AI usage,
            communication requirements and school configuration.
          </p>
        </div>
      </section>

      {/* Demo CTA */}
      <section className="bg-slate-50 px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-[2rem] bg-gradient-to-r from-indigo-600 to-purple-600 p-1 shadow-2xl shadow-indigo-200">
          <div className="rounded-[1.8rem] bg-white px-6 py-14 text-center sm:px-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50">
              <PhoneCall className="h-7 w-7 text-indigo-600" />
            </div>

            <p className="mt-5 text-sm font-black uppercase tracking-[0.2em] text-indigo-600">
              Talk to SmartCampus AI
            </p>

            <h2 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">
              Let AI help you run your school.
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-slate-600">
              Tell us what your school needs. Our sales team can recommend
              the right configuration, pricing and implementation path.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href="/school-admissions-crm"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white hover:bg-indigo-700"
              >
                Request Demo
                <ArrowRight className="h-4 w-4" />
              </a>

              <a
                href="/campus-admin/login"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-6 py-3.5 text-sm font-bold text-slate-800 hover:border-indigo-300 hover:text-indigo-600"
              >
                <LogIn className="h-4 w-4" />
                Registered School Login
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <div>
            <p className="font-black text-slate-950">
              SmartCampus <span className="text-indigo-600">AI</span>
            </p>

            <p className="mt-1 text-xs text-slate-500">
              360° School Operating System
            </p>
          </div>

          <p className="text-xs font-semibold text-slate-500">
            Powered by ThomasG Technologies
          </p>
        </div>
      </footer>
    </main>
  );
}

type DashboardMetricProps = {
  label: string;
  value: string;
  status: string;
};

function DashboardMetric({
  label,
  value,
  status,
}: DashboardMetricProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-2xl font-black text-white">{value}</p>

      <p className="mt-1 text-[11px] font-medium text-indigo-400">
        {status}
      </p>
    </div>
  );
}

type FeatureCardProps = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
};

function FeatureCard({
  icon: Icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50">
        <Icon className="h-5 w-5 text-indigo-600" />
      </div>

      <h3 className="mt-5 font-black text-slate-950">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-600">
        {description}
      </p>
    </div>
  );
}

type ArchitecturePillarProps = {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  iconClassName: string;
  iconBackground: string;
  items: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
  }[];
};

function ArchitecturePillar({
  title,
  description,
  icon: PillarIcon,
  iconClassName,
  iconBackground,
  items,
}: ArchitecturePillarProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-100">
      <div className="flex items-start gap-4 border-b border-slate-200 pb-5">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconBackground}`}
        >
          <PillarIcon className={`h-5 w-5 ${iconClassName}`} />
        </div>

        <div>
          <h3 className="text-lg font-black uppercase tracking-[0.12em] text-slate-950">
            {title}
          </h3>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {items.map(({ icon: ItemIcon, title: itemTitle }) => (
          <div
            key={itemTitle}
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3"
          >
            <ItemIcon className={`h-4 w-4 shrink-0 ${iconClassName}`} />

            <span className="text-sm font-semibold text-slate-700">
              {itemTitle}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
