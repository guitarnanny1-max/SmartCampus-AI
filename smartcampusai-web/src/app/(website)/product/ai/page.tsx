import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

const features = [
  {
    title: "AI Command Center",
    description:
      "A central intelligence layer that helps leadership understand what is happening across the institution.",
  },
  {
    title: "Smart Insights",
    description:
      "Turn institutional data into clear insights, trends, alerts, and recommended actions.",
  },
  {
    title: "Predictive Intelligence",
    description:
      "Identify emerging patterns and potential issues before they become larger problems.",
  },
  {
    title: "AI Workflows",
    description:
      "Automate repetitive institutional workflows and help teams move from insight to action faster.",
  },
  {
    title: "Natural Language",
    description:
      "Ask questions about your institution in simple language and receive useful answers.",
  },
  {
    title: "Executive Intelligence",
    description:
      "Give administrators and leadership a real-time view of institutional performance.",
  },
];

export default function Page() {
  return (
    <>

      <main className="min-h-screen bg-white text-slate-950">
        {/* HERO */}
        <section className="relative overflow-hidden px-6 pb-24 pt-24 md:pb-32 md:pt-32">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.12),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(124,58,237,0.12),transparent_30%)]" />

          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-5xl text-center">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-600">
                SmartCampusAI Intelligence
              </p>

              <h1 className="mt-6 text-5xl font-semibold tracking-[-0.05em] md:text-7xl">
                AI that understands
                <span className="block bg-gradient-to-r from-blue-600 via-cyan-600 to-violet-600 bg-clip-text text-transparent">
                  your institution.
                </span>
              </h1>

              <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
                Turn campus data into intelligent insights, predictions,
                recommendations, and actions with SmartCampusAI.
              </p>

              <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
                <a
                  href="/demo"
                  className="rounded-full bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Request a demo
                </a>

                <a
                  href="#features"
                  className="rounded-full border border-slate-300 px-7 py-3.5 text-sm font-semibold transition hover:bg-slate-50"
                >
                  Explore AI features
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* AI OVERVIEW */}
        <section className="border-y border-slate-200 bg-slate-50 px-6 py-24 md:py-32">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-600">
                Intelligence layer
              </p>

              <h2 className="mt-5 text-4xl font-semibold tracking-tight md:text-6xl">
                From campus data to intelligent decisions.
              </h2>

              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                SmartCampusAI connects institutional information and gives
                decision-makers a clearer understanding of performance,
                opportunities, risks, and priorities.
              </p>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-[0_25px_80px_rgba(15,23,42,0.08)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500">AI Command Center</p>
                  <h3 className="mt-2 text-2xl font-semibold">
                    Institutional intelligence
                  </h3>
                </div>

                <div className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
                  AI Active
                </div>
              </div>

              <div className="mt-8 space-y-4">
                {[
                  "Attendance improving across 12 classes",
                  "Three classes may require intervention",
                  "Admissions conversion increased 8.4%",
                  "Fee collection is trending above target",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section
          id="features"
          className="scroll-mt-24 px-6 py-24 md:py-32"
        >
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">
                AI capabilities
              </p>

              <h2 className="mt-5 text-4xl font-semibold tracking-tight md:text-6xl">
                Intelligence built into every workflow.
              </h2>

              <p className="mt-6 text-lg leading-8 text-slate-600">
                Powerful AI capabilities designed specifically for modern
                educational institutions.
              </p>
            </div>

            <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="group rounded-[24px] border border-slate-200 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(15,23,42,0.08)]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-violet-100 text-sm font-bold text-violet-700">
                    0{index + 1}
                  </div>

                  <h3 className="mt-7 text-xl font-semibold">
                    {feature.title}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section
          id="how-it-works"
          className="bg-slate-950 px-6 py-24 text-white md:py-32"
        >
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
                How it works
              </p>

              <h2 className="mt-5 text-4xl font-semibold tracking-tight md:text-6xl">
                Understand. Predict. Act.
              </h2>

              <p className="mt-6 text-lg leading-8 text-slate-400">
                SmartCampusAI transforms institutional information into a
                continuous intelligence cycle.
              </p>
            </div>

            <div className="mt-16 grid gap-5 md:grid-cols-3">
              {[
                [
                  "01",
                  "Understand",
                  "Bring your institutional data together and understand what is happening.",
                ],
                [
                  "02",
                  "Predict",
                  "Identify trends, risks, opportunities, and areas that need attention.",
                ],
                [
                  "03",
                  "Act",
                  "Turn intelligence into decisions and faster institutional action.",
                ],
              ].map(([number, title, description]) => (
                <div
                  key={number}
                  className="rounded-[24px] border border-white/10 bg-white/[0.05] p-7"
                >
                  <p className="text-sm font-bold text-cyan-400">{number}</p>

                  <h3 className="mt-6 text-2xl font-semibold">{title}</h3>

                  <p className="mt-4 leading-7 text-slate-400">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-24 md:py-32">
          <div className="mx-auto max-w-5xl text-center">
            <h2 className="text-4xl font-semibold tracking-tight md:text-6xl">
              Put intelligence at the center of your institution.
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              See how SmartCampusAI can help your institution make faster,
              smarter, data-driven decisions.
            </p>

            <a
              href="/demo"
              className="mt-10 inline-flex rounded-full bg-blue-600 px-8 py-4 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Request a demo
            </a>
          </div>
        </section>

        <CTA />
      </main>

      <Footer />
    </>
  );
}
