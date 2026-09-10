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
  Search,
  Target,
  Users,
} from "lucide-react";
import { supabaseServer } from "@/lib/supabase/server";

type Lead = {
  id: string;
  school_name: string;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  lead_status: string | null;
  status: string | null;
  priority: string | null;
  student_count: number | null;
  source: string | null;
  lead_source: string | null;
  city: string | null;
  state: string | null;
  next_follow_up_at: string | null;
  demo_date: string | null;
  created_at: string;
};

function normalizeStatus(status: string | null | undefined) {
  return (status || "NEW").toUpperCase().replace(/[-\s]+/g, "_");
}

function statusLabel(status: string | null | undefined) {
  return normalizeStatus(status)
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function statusClass(status: string | null | undefined) {
  switch (normalizeStatus(status)) {
    case "NEW":
      return "bg-blue-50 text-blue-700 ring-blue-200";
    case "CONTACTED":
      return "bg-amber-50 text-amber-700 ring-amber-200";
    case "QUALIFIED":
      return "bg-violet-50 text-violet-700 ring-violet-200";
    case "DEMO_SCHEDULED":
      return "bg-indigo-50 text-indigo-700 ring-indigo-200";
    case "CONVERTED":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    case "LOST":
      return "bg-red-50 text-red-700 ring-red-200";
    default:
      return "bg-slate-50 text-slate-700 ring-slate-200";
  }
}

function priorityClass(priority: string | null) {
  switch ((priority || "").toUpperCase()) {
    case "HIGH":
      return "text-red-600";
    case "LOW":
      return "text-slate-500";
    default:
      return "text-amber-600";
  }
}

function formatDate(value: string | null) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
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
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
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

export default async function CRMPage() {
  const supabase = await supabaseServer();

  const { data, error } = await supabase
    .from("crm_leads")
    .select(`
      id,
      school_name,
      contact_name,
      contact_email,
      contact_phone,
      lead_status,
      status,
      priority,
      student_count,
      source,
      lead_source,
      city,
      state,
      next_follow_up_at,
      demo_date,
      created_at
    `)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600" />

              <h1 className="text-lg font-semibold text-red-900">
                Unable to load CRM leads
              </h1>
            </div>

            <p className="mt-3 text-sm text-red-700">
              {error.message}
            </p>
          </div>
        </div>
      </main>
    );
  }

  const leads = (data || []) as Lead[];

  const totalLeads = leads.length;

  const newLeads = leads.filter(
    (lead) =>
      normalizeStatus(lead.status || lead.lead_status) === "NEW",
  ).length;

  const qualifiedLeads = leads.filter(
    (lead) =>
      normalizeStatus(lead.status || lead.lead_status) === "QUALIFIED",
  ).length;

  const demoLeads = leads.filter(
    (lead) =>
      normalizeStatus(lead.status || lead.lead_status) ===
      "DEMO_SCHEDULED",
  ).length;

  const convertedLeads = leads.filter(
    (lead) =>
      normalizeStatus(lead.status || lead.lead_status) === "CONVERTED",
  ).length;

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl space-y-6 p-6 lg:p-8">

        {/* Header */}
        <section className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-indigo-600">
              <Target className="h-4 w-4" />
              Admissions CRM
            </div>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
              Leads
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Manage school enquiries, demo requests, prospective
              customers, follow-ups, and admission opportunities.
            </p>
          </div>

          <Link
            href="/demo"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800"
          >
            Create Demo Request
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </section>

        {/* Metrics */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <MetricCard
            title="Total Leads"
            value={totalLeads}
            description="All enquiries"
            icon={<Users className="h-5 w-5" />}
          />

          <MetricCard
            title="New"
            value={newLeads}
            description="Awaiting contact"
            icon={<Clock3 className="h-5 w-5" />}
          />

          <MetricCard
            title="Qualified"
            value={qualifiedLeads}
            description="Sales qualified"
            icon={<Target className="h-5 w-5" />}
          />

          <MetricCard
            title="Demos"
            value={demoLeads}
            description="Demo scheduled"
            icon={<CalendarClock className="h-5 w-5" />}
          />

          <MetricCard
            title="Converted"
            value={convertedLeads}
            description="Won customers"
            icon={<CheckCircle2 className="h-5 w-5" />}
          />
        </section>

        {/* Search / toolbar */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="search"
                placeholder="Search leads..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="font-medium text-slate-900">
                {totalLeads}
              </span>
              leads in pipeline
            </div>
          </div>
        </section>

        {/* Lead table */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="text-lg font-semibold text-slate-950">
              Lead Pipeline
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Recently submitted school enquiries and opportunities.
            </p>
          </div>

          {leads.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <Building2 className="mx-auto h-10 w-10 text-slate-300" />

              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                No leads yet
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Demo requests submitted through SmartCampusAI will appear
                here.
              </p>

              <Link
                href="/demo"
                className="mt-6 inline-flex rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Submit a Demo Request
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-left">
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Institution
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Contact
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Priority
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Students
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Created
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {leads.map((lead) => {
                    const currentStatus =
                      lead.status || lead.lead_status || "NEW";

                    return (
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
                              <Link
                                href={`/product/crm/leads/${lead.id}`}
                                className="font-semibold text-slate-950 hover:text-indigo-600"
                              >
                                {lead.school_name}
                              </Link>

                              <p className="mt-1 text-xs text-slate-500">
                                {[
                                  lead.city,
                                  lead.state,
                                ]
                                  .filter(Boolean)
                                  .join(", ") || "Location not provided"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-slate-900">
                              {lead.contact_name || "—"}
                            </p>

                            {lead.contact_email && (
                              <p className="flex items-center gap-1.5 text-xs text-slate-500">
                                <Mail className="h-3.5 w-3.5" />
                                {lead.contact_email}
                              </p>
                            )}

                            {lead.contact_phone && (
                              <p className="flex items-center gap-1.5 text-xs text-slate-500">
                                <Phone className="h-3.5 w-3.5" />
                                {lead.contact_phone}
                              </p>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${statusClass(
                              currentStatus,
                            )}`}
                          >
                            {statusLabel(currentStatus)}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`text-sm font-semibold ${priorityClass(
                              lead.priority,
                            )}`}
                          >
                            {lead.priority || "MEDIUM"}
                          </span>
                        </td>

                        <td className="px-6 py-5 text-sm text-slate-600">
                          {lead.student_count?.toLocaleString("en-IN") || "—"}
                        </td>

                        <td className="px-6 py-5 text-sm text-slate-500">
                          {formatDate(lead.created_at)}
                        </td>

                        <td className="px-6 py-5">
                          <Link
                            href={`/product/crm/leads/${lead.id}`}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
                          >
                            View
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
