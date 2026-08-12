"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";

type FormState = {
  school_name: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  student_count: string;
  city: string;
  state: string;
  current_erp: string;
  requirements: string;
};

const initialForm: FormState = {
  school_name: "",
  contact_name: "",
  contact_email: "",
  contact_phone: "",
  student_count: "",
  city: "",
  state: "",
  current_erp: "",
  requirements: "",
};

export default function AdmissionsEnquiryForm() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          school_name: form.school_name.trim(),
          contact_name: form.contact_name.trim(),
          contact_email: form.contact_email.trim(),
          contact_phone: form.contact_phone.trim(),
          student_count: form.student_count
            ? Number(form.student_count)
            : null,
          city: form.city.trim() || null,
          state: form.state.trim() || null,
          current_erp: form.current_erp.trim() || null,
          notes: form.requirements.trim() || null,
          source: "school_admissions_crm",
          lead_source: "SCHOOL_ADMISSIONS_CRM",
          status: "NEW",
          lead_status: "NEW",
          priority: "MEDIUM",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error || "Unable to submit your enquiry.",
        );
      }

      setSuccess(true);
      setForm(initialForm);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to submit your enquiry.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8 text-center shadow-sm">
        <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />

        <h3 className="mt-4 text-2xl font-bold text-slate-950">
          Enquiry received
        </h3>

        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">
          Thank you for your interest in SmartCampusAI. Your school enquiry
          has been submitted to our admissions CRM for follow-up.
        </p>

        <button
          type="button"
          onClick={() => setSuccess(false)}
          className="mt-6 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Submit another enquiry
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8"
    >
      <div>
        <span className="text-sm font-bold uppercase tracking-widest text-indigo-600">
          Request a Demo
        </span>

        <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
          Talk to our school technology team
        </h2>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          Tell us about your school and our team can understand your
          requirements before the demonstration.
        </p>
      </div>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <Field
          label="School Name"
          value={form.school_name}
          required
          onChange={(value) => updateField("school_name", value)}
        />

        <Field
          label="Contact Person"
          value={form.contact_name}
          required
          onChange={(value) => updateField("contact_name", value)}
        />

        <Field
          label="Email"
          type="email"
          value={form.contact_email}
          required
          onChange={(value) => updateField("contact_email", value)}
        />

        <Field
          label="Phone"
          type="tel"
          value={form.contact_phone}
          required
          onChange={(value) => updateField("contact_phone", value)}
        />

        <Field
          label="Approx. Student Strength"
          type="number"
          min="1"
          value={form.student_count}
          onChange={(value) => updateField("student_count", value)}
        />

        <Field
          label="Current ERP / School Software"
          value={form.current_erp}
          placeholder="Optional"
          onChange={(value) => updateField("current_erp", value)}
        />

        <Field
          label="City"
          value={form.city}
          onChange={(value) => updateField("city", value)}
        />

        <Field
          label="State"
          value={form.state}
          onChange={(value) => updateField("state", value)}
        />

        <div className="sm:col-span-2">
          <label className="block text-sm font-semibold text-slate-800">
            Requirements / Admission Challenges
          </label>

          <textarea
            value={form.requirements}
            onChange={(event) =>
              updateField("requirements", event.target.value)
            }
            rows={5}
            placeholder="Tell us what your school wants to improve..."
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
          />
        </div>
      </div>

      {error && (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Submitting enquiry...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Request a School Demo
          </>
        )}
      </button>

      <p className="mt-3 text-center text-xs leading-5 text-slate-500">
        Your information is used to respond to your school enquiry and
        arrange a suitable demonstration.
      </p>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
  min,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  min?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-800">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <input
        type={type}
        value={value}
        min={min}
        required={required}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
      />
    </div>
  );
}
