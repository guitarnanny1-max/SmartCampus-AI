"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  type AdmissionEnquiryPreview,
  readStoredPreviews,
} from "@/lib/admissions/mapVisitorToEnquiry";

export default function FrontDeskPreviewBanner() {
  const [previews, setPreviews] = useState<AdmissionEnquiryPreview[]>([]);

  useEffect(() => {
    setPreviews(readStoredPreviews());
  }, []);

  if (previews.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-sm font-bold text-cyan-300">
              Front Desk — Simulation Only
            </h2>

            <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-300">
              Preview Only
            </span>
          </div>

          <p className="max-w-2xl text-xs leading-5 text-slate-300">
            This is a browser-session simulation. No admission records have
            been created or saved to the database.
          </p>
        </div>

        <Link
          href="/front-desk"
          className="inline-flex shrink-0 items-center justify-center rounded-lg border border-cyan-500/30 px-4 py-2 text-xs font-semibold text-cyan-300 transition hover:bg-cyan-500/10"
        >
          Return to Front Desk
        </Link>
      </div>

      {/* Preview records */}
      <div className="overflow-x-auto rounded-xl border border-slate-700/60">
        <table className="w-full min-w-[650px] text-left text-xs">
          <thead className="bg-slate-900/50">
            <tr className="text-slate-400">
              <th className="px-4 py-3 font-semibold">
                Student Name (Preview)
              </th>
              <th className="px-4 py-3 font-semibold">
                Parent / Guardian
              </th>
              <th className="px-4 py-3 font-semibold">
                Grade Applying For
              </th>
              <th className="px-4 py-3 font-semibold">
                Source
              </th>
              <th className="px-4 py-3 font-semibold">
                Status
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-700/50">
            {previews.map((preview, index) => (
              <tr
                key={`${preview.studentName}-${index}`}
                className="text-slate-200 transition hover:bg-slate-800/30"
              >
                <td className="px-4 py-3 font-semibold">
                  {preview.studentName || "Not provided"}
                </td>

                <td className="px-4 py-3">
                  {preview.parentName || "—"}
                </td>

                <td className="px-4 py-3">
                  {preview.gradeApplyingFor || "—"}
                </td>

                <td className="px-4 py-3">
                  <span className="rounded-md bg-cyan-500/10 px-2 py-1 font-mono text-cyan-300">
                    {preview.source}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <span className="rounded-md bg-slate-700/50 px-2 py-1 text-slate-300">
                    {preview.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Persistent clarification */}
      <p className="text-[11px] leading-5 text-slate-400">
        These entries are temporary previews stored in this browser session.
        They are not saved admissions, and the Admissions pipeline is not
        updated by this simulation.
      </p>
    </section>
  );
}