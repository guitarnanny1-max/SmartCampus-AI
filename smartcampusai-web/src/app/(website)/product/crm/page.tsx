import Link from "next/link";
import {
  AlertCircle,
  ArrowUpRight,
  Building2,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Mail,
  Phone,
  Target,
  Users,
} from "lucide-react";

type DemoLead = {
  id: string;
  school: string;
  contact: string;
  email: string;
  phone: string;
  status: string;
  priority: string;
  students: number;
  className: string;
  source: string;
  nextFollowUp: string;
};

const demoLeads: DemoLead[] = [
  {
    id: "DEMO-001",
    school: "Green Valley International School",
    contact: "Anita Sharma",
    email: "anita@example.com",
    phone: "+91 90000 10001",
    status: "Demo Scheduled",
    priority: "HIGH",
    students: 1250,
    className: "Class 1–10",
    source: "Website Demo",
    nextFollowUp: "02 Sep 2026",
  },
  {
    id: "DEMO-002",
    school: "Sunrise Public School",
    contact: "Rajesh Kumar",
    email: "rajesh@example.com",
    phone: "+91 90000 10002",
    status: "Qualified",
    priority: "MEDIUM",
    students: 860,
    className: "Class 1–12",
    source: "Website",
    nextFollowUp: "03 Sep 2026",
  },
  {
    id: "DEMO-003",
    school: "Starlight Academy",
    contact: "Priya Reddy",
    email: "priya@example.com",
    phone: "+91 90000 10003",
    status: "Counselling",
    priority: "HIGH",
    students: 640,
    className: "Class 1–10",
    source: "Enquiry",
    nextFollowUp: "04 Sep 2026",
  },
  {
    id: "DEMO-004",
    school: "Oakwood High School",
    contact: "David Thomas",
    email: "david@example.com",
    phone: "+91 90000 10004",
    status: "Application",
    priority: "MEDIUM",
    students: 1480,
    className: "Class 1–12",
    source: "Referral",
    nextFollowUp: "05 Sep 2026",
  },
  {
    id: "DEMO-005",
    school: "Little Stars School",
    contact: "Meena Rao",
    email: "meena@example.com",
    phone: "+91 90000 10005",
    status: "New Enquiry",
    priority: "LOW",
    students: 420,
    className: "Pre-K–8",
    source: "Website",
    nextFollowUp: "06 Sep 2026",
  },
];

function statusClass(status: string) {
  switch (status) {
    case "New Enquiry":
      return "bg-blue-50 text-blue-700 ring-blue-200";
    case "Qualified":
      return "bg-violet-50 text-violet-700 ring-violet-200";
    case "Counselling":
      return "bg-amber-50 text-amber-700 ring-amber-200";
    case "Demo Scheduled":
      return "bg-indigo-50 text-indigo-700 ring-indigo-200";
    case "Application":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    default:
      return "bg-slate-50 text-slate-700 ring-slate-200";
  }
}

function priorityClass(priority: string) {
  switch (priority) {
    case "HIGH":
      return "text-red-600";
    case "LOW":
      return "text-slate-500";
    default:
      return "text-amber-600";
  }
}

function MetricCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            {value}
          </p>
          <p className="mt-1 text-xs text-slate-500">{description}</p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function PublicCRMPage() {
  const total = demoLeads.length;
  const newEnquiries = demoLeads.filter(
    (lead) => lead.status === "New Enquiry",
  ).length;
  const qualified = demoLeads.filter(
    (lead) => lead.status === "Qualified",
  ).length;
  const counselling = demoLeads.filter(
    (lead) => lead.status === "Counselling",
  ).length;
  const applications = demoLeads.filter(
    (lead) => lead.status === "Application",
  ).length;

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl space-y-6 p-6 lg:p-8">
        {/* Demo notice */}
        <div className="flex items-start gap-3 rounded-2xl border border-indigo-200 bg-indigo-50 p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600" />

          <div>
            <p className="text-sm font-bold text-indigo-950">
              Interactive CRM Demo — Sample Data
            </p>

            <p className="mt-1 text-sm text-indigo-800">
              This public product demonstration uses fictional schools,
              contacts, and admissions information. Real school data is
              available only inside authenticated tenant accounts.
            </p>
          </div>
        </div>

        {/* Header */}
        <section className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-indigo-600">
              <Target className="h-4 w-4" />
              SmartCampusAI Admissions CRM
            </div>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
              Admissions & Student Pipeline
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              Manage enquiries, counselling, applications, admissions,
              follow-ups, and prospective students from one connected
              education CRM.
            </p>
          </div>

          <Link
            href="/demo"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800"
          >
            Request a Live Demo
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </section>

        {/* Metrics */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <MetricCard
            title="Enquiries"
            value={total}
            description="Total prospects"
            icon={<Users className="h-5 w-5" />}
          />

          <MetricCard
            title="New"
            value={newEnquiries}
            description="New enquiries"
            icon={<Clock3 className="h-5 w-5" />}
          />

          <MetricCard
            title="Qualified"
            value={qualified}
            description="Sales qualified"
            icon={<Target className="h-5 w-5" />}
          />

          <MetricCard
            title="Counselling"
            value={counselling}
            description="In counselling"
            icon={<CalendarClock className="h-5 w-5" />}
          />

          <MetricCard
            title="Applications"
            value={applications}
            description="Applications started"
            icon={<CheckCircle2 className="h-5 w-5" />}
          />
        </section>

        {/* Pipeline */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">
              Admission Journey
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              From the first enquiry to application and eventual student
              admission.
            </p>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-5">
            {[
              ["01", "New Enquiry", "Capture"],
              ["02", "Qualified", "Evaluate"],
              ["03", "Counselling", "Engage"],
              ["04", "Application", "Process"],
              ["05", "Admission", "Convert"],
            ].map(([number, title, subtitle]) => (
              <div
                key={number}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <p className="text-xs font-bold text-indigo-600">{number}</p>
                <p className="mt-2 text-sm font-bold text-slate-950">
                  {title}
                </p>
                <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Example lead table */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">
                  Example Admission Leads
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Fictional data demonstrating the SmartCampusAI CRM
                  experience.
                </p>
              </div>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                DEMO DATA
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Institution
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Contact
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Admission Stage
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Priority
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Students
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Class
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Next Follow-up
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {demoLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                          <Building2 className="h-5 w-5" />
                        </div>

                        <div>
                          <p className="font-semibold text-slate-950">
                            {lead.school}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {lead.source}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-slate-900">
                          {lead.contact}
                        </p>

                        <p className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Mail className="h-3.5 w-3.5" />
                          {lead.email}
                        </p>

                        <p className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Phone className="h-3.5 w-3.5" />
                          {lead.phone}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${statusClass(
                          lead.status,
                        )}`}
                      >
                        {lead.status}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`text-sm font-semibold ${priorityClass(
                          lead.priority,
                        )}`}
                      >
                        {lead.priority}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-sm font-semibold text-slate-700">
                      {lead.students.toLocaleString("en-IN")}
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-600">
                      {lead.className}
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-500">
                      {lead.nextFollowUp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Tenant CTA */}
        <section className="rounded-3xl bg-slate-950 p-8 text-white shadow-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-indigo-300">
                For schools
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                Your real CRM lives inside your secure school tenant.
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                Each school gets its own isolated admissions, applicants,
                students, parents, follow-ups, and operational data.
              </p>
            </div>

            <Link
              href="/demo"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
            >
              Talk to ThomasG Technologies
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
