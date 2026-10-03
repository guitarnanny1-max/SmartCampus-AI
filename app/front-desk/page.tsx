"use client";

import { FormEvent, useMemo, useState } from "react";
import Header from "@/app/components/Header";
import Sidebar from "@/app/components/Sidebar";
import FrontDeskConversionPreview from "@/app/components/FrontDeskConversionPreview";
import {
  type AdmissionEnquiryPreview,
  type WalkInVisitor,
} from "@/lib/admissions/mapVisitorToEnquiry";

const INITIAL_WALK_INS: WalkInVisitor[] = [
  {
    id: "walkin-mock-1",
    visitorName: "Aarav Malhotra",
    studentName: "Aarav Malhotra",
    hostName: "Admissions Counselor",
    purpose: "Admission enquiry for Grade 9",
    badgeNo: "VIS-1101",
    parentName: "Neha Malhotra",
    parentEmail: "neha.malhotra@example.com",
    parentPhone: "+91 98100 11111",
    dateOfBirth: "2012-04-18",
    gender: "Male",
    gradeApplyingFor: "Grade 9",
    academicYear: "2026-2027",
    checkedInAt: "2026-09-28T09:15:00.000Z",
  },
  {
    id: "walkin-mock-2",
    visitorName: "Priya Nair",
    studentName: "",
    hostName: "Facilities Desk",
    purpose: "Vendor delivery at admin block",
    badgeNo: "VIS-1102",
    parentName: "",
    parentEmail: "",
    parentPhone: "",
    dateOfBirth: "",
    gender: "",
    gradeApplyingFor: "",
    academicYear: "",
    checkedInAt: "2026-09-28T09:40:00.000Z",
  },
];

const emptyForm = {
  visitorName: "",
  studentName: "",
  hostName: "",
  purpose: "",
  badgeNo: "",
  parentName: "",
  parentEmail: "",
  parentPhone: "",
  dateOfBirth: "",
  gender: "",
  gradeApplyingFor: "",
  academicYear: "2026-2027",
};

export default function FrontDeskPage() {
  const [walkIns, setWalkIns] = useState<WalkInVisitor[]>(INITIAL_WALK_INS);
  const [form, setForm] = useState(emptyForm);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [confirmedCount, setConfirmedCount] = useState(0);

  const selectedWalkIn = useMemo(
    () => walkIns.find((item) => item.id === selectedId) ?? null,
    [walkIns, selectedId],
  );

  function updateField(field: keyof typeof emptyForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleCheckIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const walkIn: WalkInVisitor = {
      id: `walkin-local-${Date.now()}`,
      visitorName: form.visitorName.trim(),
      studentName: form.studentName.trim(),
      hostName: form.hostName.trim(),
      purpose: form.purpose.trim(),
      badgeNo: form.badgeNo.trim() || `VIS-${String(walkIns.length + 1103)}`,
      parentName: form.parentName.trim(),
      parentEmail: form.parentEmail.trim(),
      parentPhone: form.parentPhone.trim(),
      dateOfBirth: form.dateOfBirth,
      gender: form.gender,
      gradeApplyingFor: form.gradeApplyingFor,
      academicYear: form.academicYear,
      checkedInAt: new Date().toISOString(),
    };
    setWalkIns((current) => [walkIn, ...current]);
    setForm(emptyForm);
  }

  function handlePreviewConfirmed(_enquiry: AdmissionEnquiryPreview) {
    setConfirmedCount((count) => count + 1);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="p-6 md:p-8 space-y-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">
                Local walk-in capture
              </p>
              <h1 className="text-2xl font-extrabold text-white">Front Desk</h1>
              <p className="mt-1 max-w-2xl text-xs text-slate-400">
                Check in visitors in this browser session, then preview how the
                record would map onto AdmissionEnquiry. Nothing is saved to the
                database.
              </p>
            </div>
            {confirmedCount > 0 && (
              <p className="text-xs text-emerald-400">
                {confirmedCount} preview{confirmedCount === 1 ? "" : "s"}{" "}
                confirmed locally
              </p>
            )}
          </div>

          <form
            onSubmit={handleCheckIn}
            className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-4"
          >
            <h2 className="text-sm font-bold text-white">Register walk-in</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Field
                label="Visitor name"
                required
                value={form.visitorName}
                onChange={(value) => updateField("visitorName", value)}
              />
              <Field
                label="Student name (for admissions only)"
                placeholder="Enter student name, if applicable"
                value={form.studentName}
                onChange={(value) => updateField("studentName", value)}
              />
              <Field
                label="Campus host"
                required
                value={form.hostName}
                onChange={(value) => updateField("hostName", value)}
              />
              <Field
                label="Purpose of visit"
                required
                placeholder="e.g. Admission enquiry for Grade 6"
                value={form.purpose}
                onChange={(value) => updateField("purpose", value)}
              />
              <Field
                label="Badge number"
                value={form.badgeNo}
                onChange={(value) => updateField("badgeNo", value)}
              />
              <Field
                label="Parent / guardian name"
                value={form.parentName}
                onChange={(value) => updateField("parentName", value)}
              />
              <Field
                label="Parent email"
                type="email"
                value={form.parentEmail}
                onChange={(value) => updateField("parentEmail", value)}
              />
              <Field
                label="Parent phone"
                value={form.parentPhone}
                onChange={(value) => updateField("parentPhone", value)}
              />
              <Field
                label="Date of birth"
                type="date"
                value={form.dateOfBirth}
                onChange={(value) => updateField("dateOfBirth", value)}
              />
              <label className="space-y-1.5 text-xs">
                <span className="text-slate-400">Gender</span>
                <select
                  value={form.gender}
                  onChange={(event) => updateField("gender", event.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-slate-100"
                >
                  <option value="">Select</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </label>
              <label className="space-y-1.5 text-xs">
                <span className="text-slate-400">Grade applying for</span>
                <select
                  value={form.gradeApplyingFor}
                  onChange={(event) =>
                    updateField("gradeApplyingFor", event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-slate-100"
                >
                  <option value="">Select</option>
                  {["Grade 1", "Grade 6", "Grade 9", "Grade 11", "Grade 12"].map(
                    (grade) => (
                      <option key={grade} value={grade}>
                        {grade}
                      </option>
                    ),
                  )}
                </select>
              </label>
              <Field
                label="Academic year"
                value={form.academicYear}
                onChange={(value) => updateField("academicYear", value)}
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="rounded-xl bg-cyan-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-400"
              >
                Check in locally
              </button>
            </div>
          </form>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
            <h2 className="text-sm font-bold text-white">
              Today&apos;s walk-ins ({walkIns.length})
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="p-3">Visitor</th>
                    <th className="p-3">Host</th>
                    <th className="p-3">Purpose</th>
                    <th className="p-3">Grade</th>
                    <th className="p-3">Badge</th>
                    <th className="p-3 text-right">Admissions</th>
                  </tr>
                </thead>
                <tbody>
                  {walkIns.map((walkIn) => (
                    <tr
                      key={walkIn.id}
                      className="border-b border-slate-800/60 hover:bg-slate-950/40"
                    >
                      <td className="p-3 font-semibold text-white">
                        {walkIn.visitorName}
                      </td>
                      <td className="p-3 text-slate-300">{walkIn.hostName}</td>
                      <td className="p-3 text-slate-400">{walkIn.purpose}</td>
                      <td className="p-3 text-slate-300">
                        {walkIn.gradeApplyingFor || "—"}
                      </td>
                      <td className="p-3 font-mono text-cyan-400">
                        {walkIn.badgeNo}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedId(walkIn.id)}
                          className="rounded-lg border border-cyan-500/30 px-3 py-1.5 font-semibold text-cyan-400 hover:bg-cyan-500/10"
                        >
                          Preview conversion
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>

      {selectedWalkIn && (
        <FrontDeskConversionPreview
          walkIn={selectedWalkIn}
          otherWalkIns={walkIns.filter((item) => item.id !== selectedWalkIn.id)}
          onClose={() => setSelectedId(null)}
          onPreviewConfirmed={handlePreviewConfirmed}
        />
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="space-y-1.5 text-xs">
      <span className="text-slate-400">
        {label}
        {required ? " *" : ""}
      </span>
      <input
        type={type}
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-slate-100 focus:border-cyan-500 focus:outline-none"
      />
    </label>
  );
}
