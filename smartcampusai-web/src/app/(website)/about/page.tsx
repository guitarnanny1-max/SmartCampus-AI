import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <section className="relative overflow-hidden px-6 py-24 lg:px-8 lg:py-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.12),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(124,58,237,0.12),transparent_30%)]" />

        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              About SmartCampusAI
            </div>

            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Reimagining how
              <span className="block bg-gradient-to-r from-blue-600 via-cyan-600 to-violet-600 bg-clip-text text-transparent">
                education operates.
              </span>
            </h1>

            <p className="mt-8 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl">
              SmartCampusAI is building intelligent education technology that
              connects people, processes, data, and AI in one powerful platform.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/demo"
                className="rounded-xl bg-slate-950 px-6 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Request a Demo
              </Link>

              <Link
                href="/solutions"
                className="rounded-xl border border-slate-200 px-6 py-3.5 text-center text-sm font-semibold transition hover:border-blue-300 hover:bg-blue-50"
              >
                Explore Solutions
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-100 bg-slate-50 px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
                Our mission
              </p>

              <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
                Make every campus more intelligent.
              </h2>
            </div>

            <div className="space-y-6 text-lg leading-8 text-slate-600">
              <p>
                Education institutions manage enormous amounts of information
                every day.
              </p>

              <p>
                SmartCampusAI brings those experiences together through a
                unified platform designed to simplify operations and improve
                decision-making.
              </p>

              <p>
                Our goal is simple:
                <strong className="text-slate-950">
                  {" "}
                  less complexity, better decisions, and more time for
                  education.
                </strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-600">
            What we believe
          </p>

          <h2 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            Technology should make education simpler.
          </h2>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <div className="text-sm font-bold text-blue-600">01</div>
              <h3 className="mt-8 text-xl font-bold">
                One connected platform
              </h3>
              <p className="mt-4 leading-7 text-slate-600">
                Connect academics, administration, communication, operations,
                and intelligence in one modern environment.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <div className="text-sm font-bold text-cyan-600">02</div>
              <h3 className="mt-8 text-xl font-bold">
                Built for education
              </h3>
              <p className="mt-4 leading-7 text-slate-600">
                Designed around the real workflows of modern educational
                institutions.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <div className="text-sm font-bold text-violet-600">03</div>
              <h3 className="mt-8 text-xl font-bold">
                Intelligence everywhere
              </h3>
              <p className="mt-4 leading-7 text-slate-600">
                Use AI and institutional data to automate work and support
                better decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 px-6 py-24 text-white lg:px-8 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-400">
              The future
            </p>

            <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Build smarter campuses.
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-300">
              SmartCampusAI is designed to help institutions operate with
              clarity, intelligence, and confidence.
            </p>

            <Link
              href="/demo"
              className="mt-8 inline-flex rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-50"
            >
              See SmartCampusAI in Action
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
