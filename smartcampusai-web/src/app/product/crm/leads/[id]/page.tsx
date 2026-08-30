import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Building2,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  Phone,
  Target,
  Users,
} from "lucide-react";

import { supabaseServer } from "@/lib/supabase/server";
import LeadControls from "@/components/crm/LeadControls";
import LeadActivityTimeline from "@/components/crm/LeadActivityTimeline";
import ScheduleFollowUp from "@/components/crm/ScheduleFollowUp";
import SendFollowUpWhatsApp from "@/components/crm/SendFollowUpWhatsApp";

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
  notes: string | null;
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
  if (!value) return "Not scheduled";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not scheduled";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-slate-900">{value}</p>
    </div>
  );
}

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

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
      notes,
      created_at
    `)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 p-6 lg:p-8">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/product/crm"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to CRM
          </Link>

          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <h1 className="text-lg font-semibold text-red-900">
              Unable to load lead
            </h1>
            <p className="mt-2 text-sm text-red-700">{error.message}</p>
          </div>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen bg-slate-50 p-6 lg:p-8">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/product/crm"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to CRM
          </Link>

          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <Building2 className="mx-auto h-12 w-12 text-slate-300" />
            <h1 className="mt-4 text-xl font-bold text-slate-950">
              Lead not found
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              This lead may have been deleted or the ID is invalid.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const lead = data as Lead;
  const currentStatus = lead.status || lead.lead_status || "NEW";

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl space-y-6 p-6 lg:p-8">
        <Link
          href="/product/crm"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-indigo-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Leads
        </Link>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <Building2 className="h-7 w-7" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-indigo-600">
                    Admissions CRM
                  </span>

                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${statusClass(
                      currentStatus,
                    )}`}
                  >
                    {statusLabel(currentStatus)}
                  </span>
                </div>

                <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                  {lead.school_name}
                </h1>

                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
                  {lead.city || lead.state ? (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      {[lead.city, lead.state].filter(Boolean).join(", ")}
                    </span>
                  ) : null}

                  <span className="inline-flex items-center gap-1.5">
                    <Clock3 className="h-4 w-4" />
                    Created {formatDate(lead.created_at)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {lead.contact_phone && (
                <a
                  href={`tel:${lead.contact_phone}`}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
                >
                  <Phone className="h-4 w-4" />
                  Call
                </a>
              )}

              {lead.contact_email && (
                <a
                  href={`mailto:${lead.contact_email}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  <Mail className="h-4 w-4" />
                  Email
                </a>
              )}
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Status</p>
                <p className="mt-1 text-sm font-bold text-slate-950">
                  {statusLabel(currentStatus)}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600">
                <Clock3 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Priority</p>
                <p
                  className={`mt-1 text-sm font-bold ${priorityClass(
                    lead.priority,
                  )}`}
                >
                  {lead.priority || "MEDIUM"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-violet-50 p-2.5 text-violet-600">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">
                  Students
                </p>
                <p className="mt-1 text-sm font-bold text-slate-950">
                  {lead.student_count?.toLocaleString("en-IN") || "Not provided"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Source</p>
                <p className="mt-1 truncate text-sm font-bold text-slate-950">
                  {lead.lead_source || lead.source || "Website"}
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-3">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-950">
                  Lead Information
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Contact and institution details.
                </p>
              </div>
            </div>

            <div className="grid gap-6 pt-6 sm:grid-cols-2">
              <DetailItem
                label="Institution"
                value={lead.school_name || "—"}
              />

              <DetailItem
                label="Contact Person"
                value={lead.contact_name || "—"}
              />

              <DetailItem
                label="Email"
                value={lead.contact_email || "—"}
              />

              <DetailItem
                label="Phone"
                value={lead.contact_phone || "—"}
              />

              <DetailItem
                label="City"
                value={lead.city || "—"}
              />

              <DetailItem
                label="State"
                value={lead.state || "—"}
              />

              <DetailItem
                label="Lead Source"
                value={lead.lead_source || lead.source || "—"}
              />

              <DetailItem
                label="Student Count"
                value={
                  lead.student_count
                    ? lead.student_count.toLocaleString("en-IN")
                    : "—"
                }
              />
            </div>
          </section>

          <section id="lead-follow-up" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <CalendarClock className="h-5 w-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-950">
                Follow-up
              </h2>
            </div>

            <div className="mt-6 space-y-5">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Next Follow-up
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {formatDate(lead.next_follow_up_at)}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Demo Date
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {formatDate(lead.demo_date)}
                </p>
              </div>

              <ScheduleFollowUp
                leadId={lead.id}
                initialDate={lead.next_follow_up_at}
                initialDemoDate={lead.demo_date}
              />

              <div className="mt-3">
                <SendFollowUpWhatsApp leadId={lead.id} />
              </div>
            </div>
          </section>
        </div>

        <LeadControls
          leadId={lead.id}
          initialStatus={currentStatus}
          initialPriority={lead.priority || "MEDIUM"}
        />

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">Requirements & Notes</h2>

          <div className="mt-4 rounded-xl bg-slate-50 p-5">
            {lead.notes ? (
              <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                {lead.notes}
              </p>
            ) : (
              <p className="text-sm text-slate-500">
                No requirements or notes have been added to this lead.
              </p>
            )}
          </div>
        </section>

        <LeadActivityTimeline leadId={lead.id} />
        <div className="flex justify-between">
          <Link
            href="/product/crm"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Leads
          </Link>

          <Link
            href="/demo"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            New Demo Request
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
