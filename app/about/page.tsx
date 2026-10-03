import Link from "next/link";

const solutions = [
  {
    number: "01",
    title: "School ERP",
    description:
      "Manage everyday school operations through a unified platform for students, staff, academics, attendance, fees, and administration.",
    features: [
      "Student information management",
      "Attendance and academic records",
      "Fee management and receipts",
      "Staff and administrative workflows",
    ],
  },
  {
    number: "02",
    title: "Smart CRM",
    description:
      "Organize admissions, enquiries, follow-ups, parent interactions, and institutional relationships in one centralized workspace.",
    features: [
      "Enquiry and lead management",
      "Admissions tracking",
      "Follow-ups and reminders",
      "Communication management",
    ],
  },
  {
    number: "03",
    title: "Learning Management",
    description:
      "Support connected learning experiences with digital academic resources, classroom information, and learning workflows.",
    features: [
      "Digital learning resources",
      "Academic content management",
      "Teacher and student access",
      "Learning activity support",
    ],
  },
  {
    number: "04",
    title: "AI-Powered Workflows",
    description:
      "Bring intelligent assistance into campus administration to help simplify repetitive tasks and make information easier to access.",
    features: [
      "AI-assisted administrative workflows",
      "Conversational assistance",
      "Information discovery",
      "Workflow productivity support",
    ],
  },
];

const audiences = [
  {
    title: "School Management",
    description:
      "A centralized view of school operations, administrative activities, and institutional information.",
    icon: "01",
  },
  {
    title: "Principals & Administrators",
    description:
      "Organized workflows for academic coordination, staff administration, and daily decision support.",
    icon: "02",
  },
  {
    title: "Teachers & Staff",
    description:
      "Convenient access to academic information, attendance workflows, and relevant school activities.",
    icon: "03",
  },
  {
    title: "Parents & Students",
    description:
      "Connected access to relevant school information, academic updates, and communication channels.",
    icon: "04",
  },
];

const principles = [
  {
    title: "Unified Campus Experience",
    description:
      "Connect important school workflows in a single platform instead of managing disconnected systems.",
  },
  {
    title: "Intelligent Innovation",
    description:
      "Apply AI thoughtfully to support administrative productivity and simplify everyday tasks.",
  },
  {
    title: "Security-First Design",
    description:
      "Build with modern security architecture, responsible data handling, and role-aware access in mind.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* Navigation */}
      <header className="relative z-20 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
          <Link
            href="/"
            className="flex items-center gap-3"
            aria-label="SmartCampusAI Home"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/20">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-6 w-6 text-white"
                aria-hidden="true"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="8.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <ellipse
                  cx="12"
                  cy="12"
                  rx="4"
                  ry="8.5"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
                <path
                  d="M3.8 9h16.4M3.8 15h16.4"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
              </svg>
            </div>

            <span className="text-xl font-bold tracking-tight">
              SmartCampus<span className="text-cyan-400">AI</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-300 md:flex">
            <Link href="/" className="transition hover:text-cyan-400">
              Home
            </Link>
            <Link
              href="/#features"
              className="transition hover:text-cyan-400"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="transition hover:text-cyan-400"
            >
              Pricing
            </Link>
            <Link href="/about" className="text-cyan-400">
              About
            </Link>
          </nav>

          <Link
            href="/login"
            className="rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:scale-[1.03] hover:shadow-cyan-500/20"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section
        className="relative isolate flex min-h-[620px] items-center bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(110deg, rgba(2,6,23,0.96) 0%, rgba(2,6,23,0.88) 45%, rgba(2,6,23,0.58) 100%), url('/images/smartcampus-hero.png')",
        }}
      >
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-950/20 via-transparent to-slate-950" />

        <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-5 py-24 sm:px-8 lg:grid-cols-2 lg:px-10 lg:py-32">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-300">
              <span className="h-2 w-2 rounded-full bg-cyan-400" />
              About SmartCampusAI
            </div>

            <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Empowering every campus with{" "}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">
                intelligent innovation.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              SmartCampusAI brings school administration, academic
              management, communication, and AI-powered workflows together
              in one connected campus management platform.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-7 py-4 font-semibold text-white shadow-xl shadow-blue-500/20 transition hover:scale-[1.02]"
              >
                Explore the Platform
                <span aria-hidden="true">→</span>
              </Link>

              <Link
                href="/#contact"
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-7 py-4 font-semibold text-white backdrop-blur transition hover:border-cyan-400/50 hover:bg-white/10"
              >
                Request a Demo
              </Link>
            </div>

            <p className="mt-6 text-sm text-slate-400">
              A unified campus experience, designed for modern education.
            </p>
          </div>

          {/* Platform Overview Card */}
          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-blue-500/20 via-cyan-500/10 to-emerald-500/20 blur-2xl" />

            <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div>
                  <p className="text-sm text-slate-400">
                    SmartCampusAI
                  </p>
                  <h2 className="mt-1 text-xl font-bold">
                    Campus Management
                  </h2>
                </div>

                <div className="rounded-xl bg-cyan-400/10 p-3 text-cyan-300">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.7"
                      d="M3 10.5 12 4l9 6.5M5.5 9v10h13V9M9 19v-6h6v6"
                    />
                  </svg>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                {[
                  {
                    title: "School ERP",
                    subtitle: "Administration",
                    color: "from-blue-500/20 to-blue-500/5",
                    icon: "🏫",
                  },
                  {
                    title: "Smart CRM",
                    subtitle: "Admissions & Leads",
                    color: "from-cyan-500/20 to-cyan-500/5",
                    icon: "🤝",
                  },
                  {
                    title: "Learning",
                    subtitle: "Academic Workflows",
                    color: "from-emerald-500/20 to-emerald-500/5",
                    icon: "📚",
                  },
                  {
                    title: "AI Assistant",
                    subtitle: "Intelligent Support",
                    color: "from-violet-500/20 to-violet-500/5",
                    icon: "✦",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className={`rounded-2xl border border-white/10 bg-gradient-to-br ${item.color} p-5 transition hover:border-cyan-400/30`}
                  >
                    <div className="mb-4 text-2xl">{item.icon}</div>
                    <h3 className="font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-400">
                      {item.subtitle}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-lg text-cyan-300">
                    ✦
                  </div>
                  <div>
                    <p className="font-semibold text-white">
                      One connected campus
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      Administration, academics, and intelligent
                      workflows.
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-5 text-center text-xs text-slate-500">
                Illustrative platform overview
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About SmartCampusAI */}
      <section className="relative bg-slate-950 px-5 py-24 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-400">
              Who We Are
            </p>

            <h2 className="mt-5 text-3xl font-bold leading-tight sm:text-4xl">
              A connected digital foundation for modern education.
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-400">
              SmartCampusAI is an AI-powered campus management platform
              developed to help educational institutions bring their
              essential administrative and academic activities into a
              unified digital environment.
            </p>

            <p className="mt-5 leading-8 text-slate-400">
              From admissions and student information to attendance,
              fee management, staff workflows, and parent communication,
              the platform is designed to make campus operations more
              organized and accessible.
            </p>

            <p className="mt-5 leading-8 text-slate-400">
              Our approach combines modern software architecture with
              practical education workflows and intelligent assistance,
              supporting institutions as they continue their digital
              transformation.
            </p>

            <Link
              href="/pricing"
              className="mt-8 inline-flex items-center gap-2 font-semibold text-cyan-400 transition hover:text-cyan-300"
            >
              Explore our plans
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {principles.map((item, index) => (
              <div
                key={item.title}
                className={`rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition hover:border-cyan-400/30 hover:bg-white/[0.05] ${
                  index === 0 ? "sm:col-span-2" : ""
                }`}
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-400/20 text-lg font-bold text-cyan-300">
                  0{index + 1}
                </div>

                <h3 className="text-xl font-bold">{item.title}</h3>

                <p className="mt-3 leading-7 text-slate-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions */}
      <section className="relative bg-slate-900/60 px-5 py-24 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-400">
              Our Solutions
            </p>

            <h2 className="mt-5 text-3xl font-bold sm:text-4xl">
              Everything your campus needs, connected.
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-400">
              A modular approach to school management, combining
              administrative operations, academic workflows, and
              intelligent assistance.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {solutions.map((solution) => (
              <article
                key={solution.number}
                className="group rounded-3xl border border-white/10 bg-slate-950/70 p-7 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:shadow-xl hover:shadow-cyan-950/20 sm:p-9"
              >
                <div className="flex items-start justify-between">
                  <span className="text-sm font-bold tracking-widest text-cyan-400">
                    {solution.number}
                  </span>

                  <span className="text-2xl text-slate-600 transition group-hover:text-cyan-400">
                    ↗
                  </span>
                </div>

                <h3 className="mt-6 text-2xl font-bold">
                  {solution.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-400">
                  {solution.description}
                </p>

                <ul className="mt-6 space-y-3">
                  {solution.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm text-slate-300"
                    >
                      <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-cyan-400/10 text-xs text-cyan-400">
                        ✓
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="bg-slate-950 px-5 py-24 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-400">
              Who We Serve
            </p>

            <h2 className="mt-5 text-3xl font-bold sm:text-4xl">
              Built around the people who make education happen.
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-400">
              SmartCampusAI is designed to support the different roles
              within an educational institution through connected,
              role-relevant digital experiences.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {audiences.map((audience) => (
              <article
                key={audience.title}
                className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition hover:border-blue-400/30 hover:bg-white/[0.05]"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-400/20 text-sm font-bold text-cyan-300">
                  {audience.icon}
                </div>

                <h3 className="text-lg font-bold">
                  {audience.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-slate-400">
                  {audience.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Mission and Vision */}
      <section className="relative overflow-hidden bg-slate-900/60 px-5 py-24 sm:px-8 lg:px-10">
        <div className="absolute -left-40 top-20 h-80 w-80 rounded-full bg-blue-600/10 blur-[100px]" />
        <div className="absolute -right-40 bottom-0 h-80 w-80 rounded-full bg-cyan-500/10 blur-[100px]" />

        <div className="relative mx-auto grid max-w-7xl gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-blue-400/20 bg-gradient-to-br from-blue-500/10 to-slate-950/80 p-8 sm:p-12">
            <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/20 text-2xl text-blue-300">
              ◎
            </div>

            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-300">
              Our Mission
            </p>

            <h2 className="mt-5 text-3xl font-bold">
              Simplify campus management through intelligent technology.
            </h2>

            <p className="mt-6 leading-8 text-slate-400">
              Our mission is to empower educational institutions with
              accessible digital tools that streamline administrative
              processes, support academic coordination, and improve
              connectivity across the campus community.
            </p>
          </div>

          <div className="rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/10 to-slate-950/80 p-8 sm:p-12">
            <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/20 text-2xl text-cyan-300">
              ✦
            </div>

            <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">
              Our Vision
            </p>

            <h2 className="mt-5 text-3xl font-bold">
              A future where every campus is intelligently connected.
            </h2>

            <p className="mt-6 leading-8 text-slate-400">
              Our vision is to contribute to an education ecosystem
              where institutions can use connected systems and
              responsible AI to create more organized, accessible,
              and productive campus experiences.
            </p>
          </div>
        </div>
      </section>

      {/* Technology */}
      <section className="bg-slate-950 px-5 py-24 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-400">
              Technology & Innovation
            </p>

            <h2 className="mt-5 text-3xl font-bold leading-tight sm:text-4xl">
              Modern technology. Practical campus workflows.
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-400">
              SmartCampusAI is being developed around a modern web
              application architecture, with a focus on modular
              functionality, connected data, and user-friendly
              experiences.
            </p>

            <p className="mt-5 leading-8 text-slate-400">
              AI-assisted capabilities are intended to complement
              campus workflows, helping users interact with
              information and reduce repetitive administrative effort.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                title: "Modern Web Platform",
                description:
                  "Responsive interfaces designed for desktop and mobile access.",
              },
              {
                title: "Connected Modules",
                description:
                  "Modular school management workflows within a unified platform.",
              },
              {
                title: "AI-Assisted Experience",
                description:
                  "Intelligent assistance for information access and workflows.",
              },
              {
                title: "Security-First Architecture",
                description:
                  "Role-aware access and modern security design principles.",
              },
            ].map((item, index) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
              >
                <div className="mb-4 text-sm font-bold text-cyan-400">
                  0{index + 1}
                </div>

                <h3 className="font-bold">{item.title}</h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo CTA */}
      <section className="px-5 py-20 sm:px-8 lg:px-10">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-cyan-400/20 bg-gradient-to-br from-blue-950 via-slate-900 to-cyan-950 px-7 py-16 text-center sm:px-12 sm:py-20">
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-blue-500/20 blur-[90px]" />
          <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-cyan-400/20 blur-[90px]" />

          <div className="relative mx-auto max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">
              Get Started
            </p>

            <h2 className="mt-5 text-3xl font-extrabold sm:text-5xl">
              Ready to explore a smarter campus experience?
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Discover how SmartCampusAI can support your institution's
              administrative and academic workflows.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-4 font-semibold text-white shadow-xl shadow-blue-500/20 transition hover:scale-[1.02]"
              >
                Request a Demo
                <span aria-hidden="true">→</span>
              </Link>

              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 py-4 font-semibold text-white transition hover:bg-white/10"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-slate-950 px-5 py-10 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
          <Link
            href="/"
            className="text-lg font-bold tracking-tight"
          >
            SmartCampus<span className="text-cyan-400">AI</span>
          </Link>

          <p className="text-sm text-slate-500">
            Empowering every campus with intelligent innovation.
          </p>

          <div className="flex flex-wrap justify-center gap-5 text-sm text-slate-400">
            <Link href="/" className="transition hover:text-cyan-400">
              Home
            </Link>
            <Link
              href="/pricing"
              className="transition hover:text-cyan-400"
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className="transition hover:text-cyan-400"
            >
              About
            </Link>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-7xl border-t border-white/10 pt-6 text-center text-xs text-slate-500">
          Powered by ThomasG Technologies
        </div>
      </footer>
    </main>
  );
}