export const revalidate = 0;
export const dynamic = 'force-dynamic';
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
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
import LeadStatusSelect from "@/components/crm/LeadStatusSelect";

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
  country: string | null;
  school_type: string | null;
  website: string | null;
  demo_date: string | null;
  last_contacted_at: string | null;
  current_erp: string | null;
  notes: string | null;
  last_activity_at: string | null;
  next_follow_up_at: string | null;
  created_at: string;
  updated_at: string;
};

function formatDate(value: string | null) {
  if (!value) return "Not scheduled";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatDateTime(value: string | null) {
  if (!value) return "Not available";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function normalizeStatus(status: string | null | undefined) {
  return (status || "NEW").toUpperCase().replace(/[-\s]+/g, "_");
}

function statusLabel(status: string | null | undefined) {
  return normalizeStatus(status)
    .toLowerCase()
    .split("_")
    .map((word: any) => word.charAt(0).toUpperCase() + word.slice(1))
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

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div className="flex items-start justify-between gap-6 border-b border-slate-100 py-3 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>

      <span className="text-right text-sm font-medium text-slate-900">
        {value || "—"}
      </span>
    </div>
  );
}

export default async function LeadDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

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
        country,
        school_type,
        website,
        demo_date,
        last_contacted_at,
        current_erp,
        notes,
        last_activity_at,
        next_follow_up_at,
        created_at,
        updated_at
      `,
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    notFound();
  }

  const lead = data as Lead;
  const currentStatus = lead.status || lead.lead_status;

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl space-y-6 p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <Link
              href="/campus-admin/leads"
              className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Leads
            </Link>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                <Building2 className="h-6 w-6" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-3xl font-bold tracking-tight text-slate-950">
                    {lead.school_name}
                  </h1>

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusClass(
                      currentStatus,
                    )}`}
                  >
                    {statusLabel(currentStatus)}
                  </span>

                  <LeadStatusSelect
                    leadId={lead.id}
                    currentStatus={currentStatus}
                  />
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  CRM Lead · Created {formatDate(lead.created_at)}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {lead.contact_phone && (
              <a
                href={`tel:${lead.contact_phone}`}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                <Phone className="h-4 w-4" />
                Call
              </a>
            )}

            {lead.contact_phone && (
              <a
                href={`https://wa.me/${lead.contact_phone.replace(/\D/g, "")}?text=${encodeURIComponent(
                  `Hello ${lead.contact_name || ""}, this is SmartCampusAI. Thank you for your interest in our school management platform. We would be happy to discuss your requirements and arrange a demo.`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
              >
                WhatsApp
              </a>
            )}

            {lead.contact_email && (
              <a
                href={`mailto:${lead.contact_email}`}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
              >
                <Mail className="h-4 w-4" />
                Email
              </a>
            )}
          </div>
        </div>

        {/* Summary */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                <Users className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs text-slate-500">Students</p>
                <p className="text-xl font-bold text-slate-950">
                  {lead.student_count?.toLocaleString("en-IN") || "—"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
                <Target className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs text-slate-500">Priority</p>
                <p className="text-xl font-bold text-slate-950">
                  {lead.priority || "MEDIUM"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-violet-50 p-2 text-violet-600">
                <CalendarClock className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs text-slate-500">Next Follow-up</p>
                <p className="text-sm font-bold text-slate-950">
                  {formatDate(lead.next_follow_up_at)}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>

              <div>
                <p className="text-xs text-slate-500">Lead Source</p>
                <p className="text-sm font-bold text-slate-950">
                  {lead.source || lead.lead_source || "Direct"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Main content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Contact */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                <Building2 className="h-5 w-5" />
              </div>

              <h2 className="font-semibold text-slate-950">
                Contact Information
              </h2>
            </div>

            <DetailRow
              label="Contact Name"
              value={lead.contact_name}
            />

            <DetailRow
              label="Email"
              value={lead.contact_email}
            />

            <DetailRow
              label="Phone"
              value={lead.contact_phone}
            />

            <DetailRow
              label="School Type"
              value={lead.school_type}
            />

            <DetailRow
              label="Current ERP"
              value={lead.current_erp}
            />

            <DetailRow
              label="Website"
              value={lead.website}
            />
          </section>

          {/* School */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-lg bg-violet-50 p-2 text-violet-600">
                <MapPin className="h-5 w-5" />
              </div>

              <h2 className="font-semibold text-slate-950">
                School Information
              </h2>
            </div>

            <DetailRow
              label="School"
              value={lead.school_name}
            />

            <DetailRow
              label="City"
              value={lead.city}
            />

            <DetailRow
              label="State"
              value={lead.state}
            />

            <DetailRow
              label="Country"
              value={lead.country}
            />

            <DetailRow
              label="Students"
              value={
                lead.student_count
                  ? lead.student_count.toLocaleString("en-IN")
                  : null
              }
            />

            <DetailRow
              label="Source"
              value={lead.source || lead.lead_source}
            />
          </section>

          {/* Activity */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
                <Clock3 className="h-5 w-5" />
              </div>

              <h2 className="font-semibold text-slate-950">
                Sales Activity
              </h2>
            </div>

            <DetailRow
              label="Created"
              value={formatDateTime(lead.created_at)}
            />

            <DetailRow
              label="Last Contacted"
              value={formatDateTime(lead.last_contacted_at)}
            />

            <DetailRow
              label="Last Activity"
              value={formatDateTime(lead.last_activity_at)}
            />

            <DetailRow
              label="Next Follow-up"
              value={formatDateTime(lead.next_follow_up_at)}
            />

            <DetailRow
              label="Demo Date"
              value={formatDateTime(lead.demo_date)}
            />

            <DetailRow
              label="Updated"
              value={formatDateTime(lead.updated_at)}
            />
          </section>
        </div>

        {/* Notes */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
              <Clock3 className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-semibold text-slate-950">
                Lead Notes
              </h2>

              <p className="text-xs text-slate-500">
                Internal notes and sales context
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 p-4 text-sm leading-7 text-slate-600">
            {lead.notes || "No notes have been added to this lead yet."}
          </div>
        </section>

        {/* Next action */}
        <section className="rounded-2xl border border-indigo-200 bg-indigo-50 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-semibold text-indigo-950">
                Next Sales Action
              </h2>

              <p className="mt-1 text-sm text-indigo-800">
                Review this lead, contact the school, and schedule the next
                appropriate follow-up.
              </p>
            </div>

            <Link
              href="/campus-admin/leads"
              className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Back to Lead Pipeline
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
