import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  FileCheck2,
  FileText,
  GraduationCap,
  MessageSquare,
  Users,
  UserPlus,
} from "lucide-react";

const stages = [
  {
    title: "Enquiry",
    description: "New student or parent enquiry received.",
    icon: MessageSquare,
  },
  {
    title: "Counselling",
    description: "Counsellor follows up and understands requirements.",
    icon: Users,
  },
  {
    title: "Application",
    description: "Applicant begins the admission application.",
    icon: FileText,
  },
  {
    title: "Documents",
    description: "Collect and verify required documents.",
    icon: FileCheck2,
  },
  {
    title: "Review",
    description: "Admissions team reviews the application.",
    icon: GraduationCap,
  },
  {
    title: "Enrolled",
    description: "Approved applicant becomes an enrolled student.",
    icon: UserPlus,
  },
];

export default function AdmissionsPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl space-y-8 p-6 lg:p-8">
        <Link
          href="/product/crm"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to CRM
        </Link>

        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-indigo-600">
                SmartCampusAI Admissions
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                Student Admission Process
              </h1>

              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
                Manage prospective students from the first enquiry through
                counselling, application, document verification, approval,
                and final enrollment.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-950 px-6 py-5 text-white">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Platform
              </p>
              <p className="mt-1 text-lg font-bold">
                SmartCampusAI
              </p>
              <p className="mt-1 text-xs text-slate-400">
                powered by ThomasG Technologies
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-5">
            <h2 className="text-xl font-bold text-slate-950">
              Admission Workflow
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              A complete digital journey from enquiry to enrolled student.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {stages.map((stage, index) => {
              const Icon = stage.icon;

              return (
                <div
                  key={stage.title}
                  className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                      <Icon className="h-6 w-6" />
                    </div>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
                      Step {index + 1}
                    </span>
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-slate-950">
                    {stage.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {stage.description}
                  </p>

                  {index < stages.length - 1 && (
                    <ArrowRight className="mt-5 hidden h-4 w-4 text-slate-300 xl:block" />
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl border border-indigo-100 bg-indigo-50 p-6">
          <h2 className="text-lg font-bold text-slate-950">
            Admission Operations
          </h2>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Student enquiries",
              "Parent counselling",
              "Online applications",
              "Document verification",
              "Admission approval",
              "Fee initiation",
              "Class allocation",
              "Student enrollment",
            ].map((item) => (
              <div
                key={item}
                className="rounded-xl border border-indigo-100 bg-white px-4 py-3 text-sm font-semibold text-slate-700"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-slate-950 p-7 text-white">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Demo Requests
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            Every school enquiry goes to the SmartCampusAI CRM.
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
            Demo requests submitted through the website are captured as CRM
            leads so the ThomasG Technologies team can contact the institution,
            schedule a demonstration, follow up, and convert the opportunity.
          </p>

          <Link
            href="/demo"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-950 hover:bg-slate-100"
          >
            Request a SmartCampusAI Demo
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </div>
    </main>
  );
}
