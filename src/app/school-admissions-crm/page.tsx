export const revalidate = 0;
export const dynamic = 'force-dynamic';
import Link from "next/link";
import AdmissionsEnquiryForm from "@/components/website/AdmissionsEnquiryForm";
import {
  ArrowRight,
  BarChart3,
  BellRing,
  CheckCircle2,
  GraduationCap,
  MessageCircle,
  Users,
  Workflow,
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Parent & Student Enquiries",
    description:
      "Capture parent enquiries together with student details, class requirements, contact information, and admission preferences.",
  },
  {
    icon: Workflow,
    title: "Admission Pipeline",
    description:
      "Track every enquiry from New and Contacted through Qualified, Counselling, Application, and final Admission.",
  },
  {
    icon: BellRing,
    title: "Follow-up Management",
    description:
      "Keep admission teams organised with next follow-up dates, activity history, notes, and pending opportunities.",
  },
  {
    icon: MessageCircle,
    title: "Counselling & Communication",
    description:
      "Record counselling conversations and quickly connect with parents through phone, email, or WhatsApp.",
  },
  {
    icon: BarChart3,
    title: "Admission Analytics",
    description:
      "Understand enquiry volume, conversion performance, admission sources, pending follow-ups, and opportunities.",
  },
  {
    icon: GraduationCap,
    title: "Multi-School Admissions",
    description:
      "Support school groups and multiple campuses with a centralised admissions workflow and role-based access.",
  },
];

const pipeline = [
  "New Enquiry",
  "Contacted",
  "Qualified",
  "Counselling",
  "Application",
  "Admission",
];


const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "SmartCampusAI School Admissions CRM",
      "applicationCategory": "BusinessApplication",
      "applicationSubCategory": "School Admissions CRM",
      "operatingSystem": "Web",
      "description":
        "School admissions CRM for managing parent enquiries, prospective students, follow-ups, counselling, applications, and admissions.",
      "brand": {
        "@type": "Brand",
        "name": "SmartCampusAI"
      },
      "publisher": {
        "@type": "Organization",
        "name": "ThomasG Technologies"
      },
      "url": "https://smartcampus.ai/school-admissions-crm"
    },
    {
      "@type": "WebPage",
      "name": "School Admissions CRM",
      "url": "https://smartcampus.ai/school-admissions-crm",
      "description":
        "School-focused admissions CRM for enquiries, parent communication, follow-ups, counselling, applications, and admissions.",
      "isPartOf": {
        "@type": "WebSite",
        "name": "SmartCampusAI",
        "url": "https://smartcampus.ai"
      }
    }
  ]
};

export default function SchoolAdmissionsCRMPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <main className="min-h-screen bg-slate-950 text-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.25),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.18),transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-4 py-2 text-sm font-semibold text-indigo-200">
              <GraduationCap className="h-4 w-4" />
              Admissions CRM for Schools
            </div>

            <h1 className="mt-7 text-4xl font-extrabold tracking-tight sm:text-6xl">
              Turn every school enquiry into an organised admission
              opportunity.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              SmartCampusAI helps schools manage parent enquiries, prospective
              students, follow-ups, counselling, applications, and admissions
              in one connected workflow.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/#demo"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 font-semibold shadow-lg shadow-indigo-950/40 transition hover:bg-indigo-500"
              >
                Request an Admissions Demo
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/#features"
                className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 font-semibold text-white transition hover:bg-white/10"
              >
                Explore SmartCampusAI
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-800 bg-slate-900">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <p className="text-center text-sm font-semibold uppercase tracking-widest text-indigo-300">
            Built for the complete school admission journey
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {pipeline.map((stage, index) => (
              <div key={stage} className="flex items-center gap-3">
                <div className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm font-semibold">
                  {stage}
                </div>

                {index < pipeline.length - 1 && (
                  <ArrowRight className="hidden h-4 w-4 text-slate-500 sm:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white text-slate-950">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-indigo-600">
              School Admissions CRM
            </span>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything your admissions team needs
            </h2>

            <p className="mt-4 text-slate-600">
              Replace spreadsheets, scattered messages, and disconnected
              enquiry records with one school-focused admissions system.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature: any) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-5 text-lg font-bold">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-slate-50">
        <div className="mx-auto max-w-5xl px-6 py-20 lg:px-8">
          <AdmissionsEnquiryForm />
        </div>
      </section>

      <section
        id="faq"
        className="bg-white text-slate-950"
      >
        <div className="mx-auto max-w-4xl px-6 py-20 lg:px-8">
          <div className="text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-indigo-600">
              School Admissions CRM FAQ
            </span>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Questions schools ask before choosing an admissions CRM
            </h2>

            <p className="mt-4 text-slate-600">
              Learn how SmartCampusAI can help your school organise enquiries,
              follow-ups, counselling, applications, and admissions.
            </p>
          </div>

          <div className="mt-12 space-y-4">
            {[
              {
                question: "What is a school admissions CRM?",
                answer:
                  "A school admissions CRM helps schools capture prospective student enquiries, manage parent communication, track follow-ups, organise counselling activities, and monitor applications through the admission journey.",
              },
              {
                question: "Can SmartCampusAI manage parent enquiries?",
                answer:
                  "Yes. SmartCampusAI can capture school enquiries with contact details, student information, enquiry source, requirements, notes, status, priority, and follow-up information.",
              },
              {
                question: "Can schools track admission follow-ups?",
                answer:
                  "Yes. Admission teams can track the current lead status, previous activity, next follow-up date, contact information, notes, and other sales or admission context.",
              },
              {
                question: "Can SmartCampusAI manage multiple campuses?",
                answer:
                  "SmartCampusAI is designed to support school groups and multi-campus organisations with centralised administration, role-based access, analytics, and school-level operational workflows.",
              },
              {
                question: "Can admissions teams contact parents from the CRM?",
                answer:
                  "The CRM can provide direct contact actions such as phone, email, and WhatsApp links so admission teams can quickly respond to prospective families.",
              },
              {
                question: "Can schools see where their admission enquiries come from?",
                answer:
                  "Yes. Lead source information can help schools understand whether enquiries are coming from website forms, campaigns, referrals, or other admission channels.",
              },
              {
                question: "Does the admissions CRM connect with SmartCampusAI?",
                answer:
                  "Yes. The admissions workflow is designed as part of the wider SmartCampusAI platform, connecting admissions intelligence with school operations and administrative workflows.",
              },
              {
                question: "How can our school request a demo?",
                answer:
                  "Schools can request a demonstration through the SmartCampusAI website. The enquiry can then enter the admissions CRM for follow-up by the school or SmartCampusAI team.",
              },
            ].map((item: any) => (
              <details
                key={item.question}
                className="group rounded-2xl border border-slate-200 bg-slate-50 p-5"
              >
                <summary className="cursor-pointer list-none font-semibold text-slate-950">
                  <div className="flex items-center justify-between gap-4">
                    <span>{item.question}</span>
                    <span className="text-xl text-indigo-600 transition group-open:rotate-45">
                      +
                    </span>
                  </div>
                </summary>

                <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 text-slate-950">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center lg:px-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl sm:p-12">
            <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-500" />

            <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
              One admissions workflow. Complete visibility.
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
              Give principals, admission counsellors, and school
              administrators a single place to understand every prospective
              student and every pending admission opportunity.
            </p>

            <Link
              href="/#demo"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 font-semibold text-white shadow-lg transition hover:bg-indigo-700"
            >
              Request a Demo
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
      </main>
    </>
  );
}
