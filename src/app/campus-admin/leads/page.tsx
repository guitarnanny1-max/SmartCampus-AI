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
  lead_status: string;
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

function formatDate(value: string | null) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

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

export default async function LeadsPage() {
  const supabase = await supabaseServer();

  const { data, error } = await supabase
    .from("crm_leads")
    .select(
      `
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
      `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
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
    (lead) => normalizeStatus(lead.status || lead.lead_status) === "NEW",
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
        <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-indigo-600">
              <Target className="h-4 w-4" />
              CRM
            </div>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
              Leads
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Manage school enquiries, demo requests, prospective customers,
              follow-ups, and admission opportunities from one place.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm">
              Website CRM
            </div>
          </div>
        </section>

        {/* Metrics */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <MetricCard
            title="Total Leads"
            value={totalLeads}
            description="All captured enquiries"
            icon={<Users className="h-5 w-5" />}
          />

          <MetricCard
            title="New"
            value={newLeads}
            description="Needs initial follow-up"
            icon={<Clock3 className="h-5 w-5" />}
          />

          <MetricCard
            title="Qualified"
            value={qualifiedLeads}
            description="Sales-qualified opportunities"
            icon={<CheckCircle2 className="h-5 w-5" />}
          />

          <MetricCard
            title="Demo Scheduled"
            value={demoLeads}
            description="Upcoming demonstrations"
            icon={<CalendarClock className="h-5 w-5" />}
          />

          <MetricCard
            title="Converted"
            value={convertedLeads}
            description="Converted opportunities"
            icon={<ArrowUpRight className="h-5 w-5" />}
          />
        </section>

        {/* Search / filters */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="search"
                placeholder="Search school, contact, email..."
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div className="flex gap-2">
              <select className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-indigo-500">
                <option>All Statuses</option>
                <option>New</option>
                <option>Contacted</option>
                <option>Qualified</option>
                <option>Demo Scheduled</option>
                <option>Converted</option>
                <option>Lost</option>
              </select>

              <select className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-indigo-500">
                <option>All Priorities</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
          </div>
        </section>

        {/* Lead table */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div>
              <h2 className="font-semibold text-slate-950">
                School Leads
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                {totalLeads} lead{totalLeads === 1 ? "" : "s"} in CRM
              </p>
            </div>
          </div>

          {leads.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <Building2 className="h-6 w-6" />
              </div>

              <h3 className="mt-4 font-semibold text-slate-900">
                No leads yet
              </h3>

              <p className="mt-2 max-w-md text-sm text-slate-500">
                Website demo requests and other enquiries will appear here
                when they are submitted.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] text-left">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      School / Contact
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Contact
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Students
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Priority
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Source
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Created
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {leads.map((lead) => {
                    const currentStatus = lead.status || lead.lead_status;

                    return (
                      <tr
                        key={lead.id}
                        className="transition hover:bg-slate-50"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                              <Building2 className="h-4 w-4" />
                            </div>

                            <div className="min-w-0">
                              <Link
                                href={`/campus-admin/leads/${lead.id}`}
                                className="truncate font-semibold text-slate-900 hover:text-indigo-600"
                              >
                                {lead.school_name}
                              </Link>

                              <p className="truncate text-xs text-slate-500">
                                {lead.contact_name || "No contact name"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="space-y-1 text-xs text-slate-600">
                            {lead.contact_email && (
                              <div className="flex items-center gap-2">
                                <Mail className="h-3.5 w-3.5 text-slate-400" />
                                {lead.contact_email}
                              </div>
                            )}

                            {lead.contact_phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="h-3.5 w-3.5 text-slate-400" />
                                {lead.contact_phone}
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="px-5 py-4 text-sm font-medium text-slate-700">
                          {lead.student_count?.toLocaleString("en-IN") || "—"}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusClass(
                              currentStatus,
                            )}`}
                          >
                            {statusLabel(currentStatus)}
                          </span>
                        </td>

                        <td
                          className={`px-5 py-4 text-sm font-semibold ${priorityClass(
                            lead.priority,
                          )}`}
                        >
                          {lead.priority || "MEDIUM"}
                        </td>

                        <td className="px-5 py-4">
                          <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                            {lead.source || lead.lead_source || "Direct"}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-500">
                          {formatDate(lead.created_at)}
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
