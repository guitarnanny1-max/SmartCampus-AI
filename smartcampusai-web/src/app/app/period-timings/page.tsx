"use client";

import { useEffect, useState } from "react";

type AcademicYear = {
  id: string;
  name: string;
};

type PeriodTiming = {
  id: string;
  academic_year_id: string;
  period_number: number;
  name: string;
  start_time: string;
  end_time: string;
  is_break: boolean;
  status: string;
};

const DEFAULT_PERIODS = [
  ["Period 1", "09:00", "09:50"],
  ["Period 2", "09:50", "10:40"],
  ["Period 3", "10:40", "11:30"],
  ["Period 4", "11:45", "12:35"],
  ["Period 5", "12:35", "13:25"],
  ["Period 6", "14:00", "14:50"],
  ["Period 7", "14:50", "15:40"],
  ["Period 8", "15:40", "16:30"],
];

export default function PeriodTimingsPage() {
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [academicYearId, setAcademicYearId] = useState("");
  const [timings, setTimings] = useState<PeriodTiming[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function loadAcademicYears() {
    try {
      const response = await fetch("/api/academic-years");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to load academic years.");
      }

      const years = data.academic_years ?? [];
      setAcademicYears(years);

      if (!academicYearId && years.length) {
        setAcademicYearId(years[0].id);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load academic years.",
      );
    }
  }

  async function loadTimings() {
    if (!academicYearId) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/period-timings?academic_year_id=${encodeURIComponent(
          academicYearId,
        )}`,
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to load period timings.");
      }

      setTimings(data.period_timings ?? []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load period timings.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAcademicYears();
  }, []);

  useEffect(() => {
    loadTimings();
  }, [academicYearId]);

  function updateTiming(
    periodNumber: number,
    field: keyof PeriodTiming,
    value: string | boolean,
  ) {
    setTimings((current) =>
      current.map((timing) =>
        timing.period_number === periodNumber
          ? { ...timing, [field]: value }
          : timing,
      ),
    );
  }

  async function saveTiming(timing: PeriodTiming) {
    setSaving(true);
    setError("");

    try {
      const isExisting = !timing.id.startsWith("new-");

      const response = await fetch(
        isExisting
          ? `/api/period-timings/${timing.id}`
          : "/api/period-timings",
        {
          method: isExisting ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(
            isExisting
              ? {
                  period_number: timing.period_number,
                  name: timing.name,
                  start_time: timing.start_time,
                  end_time: timing.end_time,
                  is_break: timing.is_break,
                  status: timing.status,
                }
              : {
                  academic_year_id: academicYearId,
                  period_number: timing.period_number,
                  name: timing.name,
                  start_time: timing.start_time,
                  end_time: timing.end_time,
                  is_break: timing.is_break,
                  status: timing.status,
                }
          ),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save period timing.");
      }

      await loadTimings();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save period timing."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteTiming(timing: PeriodTiming) {
    if (timing.id.startsWith("new-")) return;

    if (!window.confirm(`Delete ${timing.name}?`)) {
      return;
    }

    setDeleting(true);
    setError("");

    try {
      const response = await fetch(`/api/period-timings/${timing.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete period timing.");
      }

      await loadTimings();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete period timing."
      );
    } finally {
      setDeleting(false);
    }
  }

  async function createDefaultPeriods() {
    setSaving(true);
    setError("");

    try {
      for (let index = 0; index < DEFAULT_PERIODS.length; index++) {
        const [name, start, end] = DEFAULT_PERIODS[index];

        const response = await fetch("/api/period-timings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            academic_year_id: academicYearId,
            period_number: index + 1,
            name,
            start_time: start,
            end_time: end,
            is_break: false,
            status: "ACTIVE",
          }),
        });

        if (!response.ok && response.status !== 409) {
          const data = await response.json();
          throw new Error(data.error ?? "Failed to create periods.");
        }
      }

      await loadTimings();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create periods.",
      );
    } finally {
      setSaving(false);
    }
  }

  const rows = Array.from({ length: 8 }, (_, index) => {
    const periodNumber = index + 1;
    const existing = timings.find(
      (timing) => timing.period_number === periodNumber,
    );

    return (
      existing ?? {
        id: `new-${periodNumber}`,
        academic_year_id: academicYearId,
        period_number: periodNumber,
        name: `Period ${periodNumber}`,
        start_time: DEFAULT_PERIODS[index][1],
        end_time: DEFAULT_PERIODS[index][2],
        is_break: false,
        status: "ACTIVE",
      }
    );
  });

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm font-medium text-slate-500">
              Academic
            </div>
            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Period Timings
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Configure the school's daily period schedule.
            </p>
          </div>

          <button
            type="button"
            onClick={createDefaultPeriods}
            disabled={saving || !academicYearId}
            className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {saving ? "Saving..." : "Create Default Periods"}
          </button>
        </div>

        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <label className="block max-w-sm text-sm font-medium text-slate-700">
            Academic Year
            <select
              value={academicYearId}
              onChange={(event) => setAcademicYearId(event.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5"
            >
              <option value="">Select academic year</option>
              {academicYears.map((year) => (
                <option key={year.id} value={year.id}>
                  {year.name}
                </option>
              ))}
            </select>
          </label>
        </section>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-4">Period</th>
                  <th className="px-5 py-4">Name</th>
                  <th className="px-5 py-4">Start</th>
                  <th className="px-5 py-4">End</th>
                  <th className="px-5 py-4">Break</th>
                  <th className="px-5 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((timing) => (
                  <tr
                    key={timing.period_number}
                    className="border-b border-slate-100 last:border-0"
                  >
                    <td className="px-5 py-4 text-sm font-semibold text-slate-900">
                      {timing.period_number}
                    </td>

                    <td className="px-5 py-4">
                      <input
                        value={timing.name}
                        onChange={(event) =>
                          updateTiming(
                            timing.period_number,
                            "name",
                            event.target.value,
                          )
                        }
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                      />
                    </td>

                    <td className="px-5 py-4">
                      <input
                        type="time"
                        value={timing.start_time.slice(0, 5)}
                        onChange={(event) =>
                          updateTiming(
                            timing.period_number,
                            "start_time",
                            event.target.value,
                          )
                        }
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                      />
                    </td>

                    <td className="px-5 py-4">
                      <input
                        type="time"
                        value={timing.end_time.slice(0, 5)}
                        onChange={(event) =>
                          updateTiming(
                            timing.period_number,
                            "end_time",
                            event.target.value,
                          )
                        }
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                      />
                    </td>

                    <td className="px-5 py-4">
                      <input
                        type="checkbox"
                        checked={timing.is_break}
                        onChange={(event) =>
                          updateTiming(
                            timing.period_number,
                            "is_break",
                            event.target.checked,
                          )
                        }
                        className="h-4 w-4"
                      />
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => saveTiming(timing)}
                          disabled={saving || deleting}
                          className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
                        >
                          {saving ? "Saving..." : "Save"}
                        </button>

                        {!timing.id.startsWith("new-") && (
                          <button
                            type="button"
                            onClick={() => deleteTiming(timing)}
                            disabled={saving || deleting}
                            className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 disabled:opacity-50"
                          >
                            {deleting ? "Deleting..." : "Delete"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {loading && (
            <div className="border-t border-slate-100 px-5 py-4 text-sm text-slate-500">
              Loading period timings...
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
