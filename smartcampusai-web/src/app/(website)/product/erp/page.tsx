import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <>

      <main className="px-6 py-24">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest
text-gray-500">
            SmartCampusAI
          </p>

          <h1 className="mt-4 text-5xl font-bold tracking-tight
md:text-6xl">
            ERP
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-xl leading-8
text-gray-600">
            Manage students, teachers, parents,
attendance, fees, academics, examinations and administration.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-6xl gap-5
md:grid-cols-3">
          {[
            "Powerful workflows",
            "Real-time analytics",
            "AI-powered insights",
            "Role-based access",
            "Mobile-ready",
            "Integrated platform",
          ].map((feature) => (
            <div
              key={feature}
              className="rounded-2xl border p-7"
            >
              <h2 className="font-bold">{feature}</h2>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Built as part of the unified SmartCampusAI platform.
              </p>
            </div>
          ))}
        </div>
      </main>

      <CTA />
      <Footer />
    </>
  );
}
