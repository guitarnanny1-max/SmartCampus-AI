import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

const solutions = [
  [
    "Management",
    "Executive dashboards, AI insights and institution-wide visibility.",
  ],
  [
    "Administrators",
    "Centralized student, attendance, fee and academic management.",
  ],
  [
    "Teachers",
    "Attendance, lessons, assignments, assessments and student insights.",
  ],
  [
    "Students",
    "Learning, assignments, assessments, progress and AI assistance.",
  ],
  [
    "Parents",
    "Attendance, fees, results, assignments and communication.",
  ],
  [
    "Admissions",
    "Leads, enquiries, counselling, follow-ups and conversion analytics.",
  ],
];

export default function Solutions() {
  return (
    <>

      <main className="px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-5xl font-bold tracking-tight">
            Built for everyone on campus.
          </h1>

          <p className="mt-5 text-lg leading-8 text-gray-600">
            SmartCampusAI connects every team, workflow and stakeholder in one
            intelligent education platform.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-7xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {solutions.map(([title, description]) => (
            <div
              key={title}
              className="rounded-3xl border bg-white p-8 shadow-sm"
            >
              <h2 className="text-2xl font-bold">{title}</h2>

              <p className="mt-4 leading-7 text-gray-600">{description}</p>
            </div>
          ))}
        </div>
      </main>

      <CTA />
      <Footer />
    </>
  );
}
