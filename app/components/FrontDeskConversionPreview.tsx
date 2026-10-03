"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  type AdmissionEnquiryPreview,
  type WalkInVisitor,
  buildFieldMappings,
  enquiryDuplicateKey,
  mapWalkInToAdmissionEnquiry,
  readStoredPreviews,
  validateConversionPreview,
  writeStoredPreviews,
} from "@/lib/admissions/mapVisitorToEnquiry";

type Props = {
  walkIn: WalkInVisitor;
  otherWalkIns: WalkInVisitor[];
  onClose: () => void;
  onPreviewConfirmed: (enquiry: AdmissionEnquiryPreview) => void;
};

export default function FrontDeskConversionPreview({
  walkIn,
  otherWalkIns,
  onClose,
  onPreviewConfirmed,
}: Props) {
  const [step, setStep] = useState<"review" | "confirm">("review");
  const [acknowledged, setAcknowledged] = useState(false);
  const [confirmedPreview, setConfirmedPreview] =
    useState<AdmissionEnquiryPreview | null>(null);

  const enquiry = useMemo(
    () => mapWalkInToAdmissionEnquiry(walkIn),
    [walkIn],
  );

  const mappings = useMemo(
    () => buildFieldMappings(walkIn, enquiry),
    [walkIn, enquiry],
  );

  const existingPreviews = useMemo(() => readStoredPreviews(), []);

  const validation = useMemo(
    () =>
      validateConversionPreview(
        walkIn,
        enquiry,
        otherWalkIns,
        existingPreviews,
      ),
    [walkIn, enquiry, otherWalkIns, existingPreviews],
  );

  const canContinue =
    validation.errors.length === 0 &&
    validation.duplicates.length === 0;

  function handleConfirmPreview() {
    // Block invalid, duplicate, or unacknowledged previews.
    if (
      validation.errors.length > 0 ||
      validation.duplicates.length > 0 ||
      !acknowledged
    ) {
      return;
    }

    // Recheck the latest browser-session data before adding anything.
    const latest = readStoredPreviews();

    const duplicate = latest.some(
      (item) =>
        enquiryDuplicateKey(item) === enquiryDuplicateKey(enquiry) &&
        Boolean(enquiry.studentName.trim())
    );

    if (duplicate) {
      return;
    }

    const next = [enquiry, ...latest];
    writeStoredPreviews(next);
    setConfirmedPreview(enquiry);
    onPreviewConfirmed(enquiry);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 p-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">
              Front Desk → Admissions
            </p>
            <h2 className="mt-1 text-lg font-extrabold text-white">
              Conversion preview
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Maps this walk-in to AdmissionEnquiry fields in the browser only.
              No records are created.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800"
          >
            Close
          </button>
        </div>

        {confirmedPreview ? (
          <div className="space-y-4 p-6">
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">
              Preview confirmed locally. Nothing was written to the database or
              sent to an API.
            </div>
            <PreviewEnquiryCard enquiry={confirmedPreview} />
            <div className="flex flex-wrap gap-3">
              <Link
                href="/admissions"
                className="rounded-xl bg-cyan-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-400"
              >
                View on Admissions pipeline
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-700 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-800"
              >
                Back to Front Desk
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 p-6">
            <div className="flex gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
              <span className={step === "review" ? "text-cyan-400" : ""}>
                1. Review mapping
              </span>
              <span>→</span>
              <span className={step === "confirm" ? "text-cyan-400" : ""}>
                2. Confirm preview
              </span>
            </div>

            {validation.errors.length > 0 && (
              <AlertList
                title="Required fields"
                items={validation.errors}
                tone="error"
              />
            )}
            {validation.duplicates.length > 0 && (
              <AlertList
                title="Possible duplicates"
                items={validation.duplicates}
                tone="warning"
              />
            )}
            {validation.warnings.length > 0 && (
              <AlertList
                title="Warnings"
                items={validation.warnings}
                tone="warning"
              />
            )}

            {step === "review" ? (
              <>
                <div className="overflow-x-auto rounded-xl border border-slate-800">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-950 text-slate-400">
                        <th className="px-4 py-3 font-semibold">Walk-in source</th>
                        <th className="px-4 py-3 font-semibold">Value</th>
                        <th className="px-4 py-3 font-semibold">
                          AdmissionEnquiry
                        </th>
                        <th className="px-4 py-3 font-semibold">Mapped value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mappings.map((row) => (
                        <tr
                          key={`${row.sourceField}-${row.destinationField}`}
                          className="border-b border-slate-800/70"
                        >
                          <td className="px-4 py-2.5 font-mono text-slate-400">
                            {row.sourceField}
                          </td>
                          <td className="px-4 py-2.5 text-slate-200">
                            {row.sourceValue}
                          </td>
                          <td className="px-4 py-2.5 font-mono text-cyan-400">
                            {row.destinationField}
                          </td>
                          <td className="px-4 py-2.5 text-white">
                            {row.destinationValue}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-xl border border-slate-700 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={!canContinue}
                    onClick={() => setStep("confirm")}
                    className="rounded-xl bg-cyan-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Continue to confirmation
                  </button>
                </div>
              </>
            ) : (
              <>
                <PreviewEnquiryCard enquiry={enquiry} />
                <label className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={acknowledged}
                    onChange={(event) => setAcknowledged(event.target.checked)}
                    className="mt-0.5"
                  />
                  <span>
                    I confirm this is a local preview only. It will not create a
                    lead, applicant, student, or AdmissionEnquiry record, and it
                    will not call the admissions convert API.
                  </span>
                </label>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setStep("review")}
                    className="rounded-xl border border-slate-700 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-800"
                  >
                    Back to mapping
                  </button>
                  <button
                    type="button"
                    disabled={!acknowledged}
                    onClick={handleConfirmPreview}
                    className="rounded-xl bg-cyan-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Confirm preview (no save)
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function PreviewEnquiryCard({ enquiry }: { enquiry: AdmissionEnquiryPreview }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs">
      <h3 className="mb-3 text-sm font-bold text-white">
        Preview AdmissionEnquiry payload
      </h3>
      <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {Object.entries(enquiry).map(([key, value]) => (
          <div key={key} className="flex justify-between gap-3 border-b border-slate-800/80 py-1">
            <dt className="font-mono text-slate-500">{key}</dt>
            <dd className="text-right text-slate-200">
              {value === null || value === "" ? "null" : String(value)}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function AlertList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "error" | "warning";
}) {
  const styles =
    tone === "error"
      ? "border-red-500/30 bg-red-500/10 text-red-300"
      : "border-amber-500/30 bg-amber-500/10 text-amber-300";

  return (
    <div className={`rounded-xl border p-4 text-xs ${styles}`}>
      <p className="mb-2 font-bold">{title}</p>
      <ul className="list-disc space-y-1 pl-4">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
