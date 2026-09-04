import { Brain, CheckCircle2 } from "lucide-react";

export default function AISection() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-2
lg:items-center">

        <div>
          <div className="inline-flex rounded-full border p-3">
            <Brain size={25} />
          </div>

          <h2 className="mt-6 text-4xl font-bold tracking-tight
md:text-5xl">
            AI that understands your campus.
          </h2>

          <p className="mt-6 text-lg leading-8 text-gray-600">
            Ask questions, generate reports, discover trends and
            identify risks across your entire institution.
          </p>

          <div className="mt-8 space-y-4">
            {[
              "AI Chat",
              "AI Reports",
              "AI Analytics",
              "AI Search",
              "AI Assistant",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle2 size={20} />
                <span className="font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border bg-gray-50 p-5">
          <div className="rounded-2xl border bg-white p-7 shadow-xl">

            <p className="text-sm text-gray-500">
              Ask SmartCampusAI
            </p>

            <div className="mt-5 rounded-xl bg-gray-100 p-4">
              Which students are at risk this month?
            </div>

            <div className="mt-5 rounded-xl border p-5">
              <p className="font-semibold">
                34 students require attention.
              </p>

              <div className="mt-4 space-y-3 text-sm text-gray-600">
                <p>21 have low attendance.</p>
                <p>17 show declining academic performance.</p>
                <p>12 have low LMS engagement.</p>
              </div>

              <button className="mt-6 rounded-lg bg-black px-4 py-2
text-sm font-semibold text-white">
                View AI Insights
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
