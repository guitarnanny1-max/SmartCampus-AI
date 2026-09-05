"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type AcademicYear = {
  id: string;
  name: string;
  status?: string;
};

type SchoolClass = {
  id: string;
  academic_year_id: string;
  name: string;
  display_order?: number;
  status?: string;
};

type FeeType = {
  id: string;
  name: string;
  code?: string | null;
  description?: string | null;
  status?: string;
};

type FeeStructure = {
  id: string;
  academic_year_id: string;
  class_id: string;
  fee_type_id: string;
  amount: number | string;
  frequency: string;
  due_date?: string | null;
  description?: string | null;
  status?: string;
};

const FREQUENCIES = [
  "ANNUAL",
  "TERM",
  "MONTHLY",
  "QUARTERLY",
  "ONE_TIME",
];

function formatFrequency(value: string) {
  return value.replace("_", " ");
}

export default function FeeStructuresPage() {
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [feeTypes, setFeeTypes] = useState<FeeType[]>([]);
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);

  const [academicYearId, setAcademicYearId] = useState("");
  const [classId, setClassId] = useState("");
  const [feeTypeId, setFeeTypeId] = useState("");
  const [amount, setAmount] = useState("");
  const [frequency, setFrequency] = useState("ANNUAL");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(true);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadInitialData() {
    setLoading(true);
    setError("");

    try {
      const [yearsResponse, feeTypesResponse, structuresResponse] =
        await Promise.all([
          fetch("/api/academic-years"),
          fetch("/api/fee-types"),
          fetch("/api/fee-structures"),
        ]);

      const yearsJson = await yearsResponse.json();
      const feeTypesJson = await feeTypesResponse.json();
      const structuresJson = await structuresResponse.json();

      if (!yearsResponse.ok) {
        throw new Error(
          yearsJson?.error || "Unable to load academic years.",
        );
      }

      if (!feeTypesResponse.ok) {
        throw new Error(
          feeTypesJson?.error || "Unable to load fee types.",
        );
      }

      if (!structuresResponse.ok) {
        throw new Error(
          structuresJson?.error || "Unable to load fee structures.",
        );
      }

      const years = yearsJson.academicYears ?? [];
      const types = feeTypesJson.feeTypes ?? [];

      setAcademicYears(years);
      setFeeTypes(types);
      setFeeStructures(structuresJson.feeStructures ?? []);

      if (years.length > 0) {
        const activeYear =
          years.find(
            (year: AcademicYear) => year.status === "ACTIVE",
          ) ?? years[0];

        setAcademicYearId(activeYear.id);
      }

      if (types.length > 0) {
        const activeType =
          types.find((type: FeeType) => type.status === "ACTIVE") ??
          types[0];

        setFeeTypeId(activeType.id);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load fee structure data.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadClasses(yearId: string) {
    if (!yearId) {
      setClasses([]);
      setClassId("");
      return;
    }

    setLoadingClasses(true);
    setError("");

    try {
      const response = await fetch(
        `/api/classes?academic_year_id=${encodeURIComponent(yearId)}`,
      );
      const json = await response.json();

      if (!response.ok) {
        throw new Error(json?.error || "Unable to load classes.");
      }

      const nextClasses = json.classes ?? [];
      setClasses(nextClasses);

      setClassId((current) => {
        if (current && nextClasses.some((item: SchoolClass) => item.id === current)) {
          return current;
        }

        return nextClasses[0]?.id ?? "";
      });
    } catch (err) {
      setClasses([]);
      setClassId("");
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load classes.",
      );
    } finally {
      setLoadingClasses(false);
    }
  }

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (academicYearId) {
      loadClasses(academicYearId);
    }
  }, [academicYearId]);

  const academicYearMap = useMemo(
    () => new Map(academicYears.map((item) => [item.id, item.name])),
    [academicYears],
  );

  const classMap = useMemo(
    () => new Map(classes.map((item) => [item.id, item.name])),
    [classes],
  );

  const feeTypeMap = useMemo(
    () => new Map(feeTypes.map((item) => [item.id, item])),
    [feeTypes],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!academicYearId) {
      setError("Please select an academic year.");
      return;
    }

    if (!classId) {
      setError("Please select a class.");
      return;
    }

    if (!feeTypeId) {
      setError("Please select a fee type.");
      return;
    }

    if (!amount || Number.isNaN(Number(amount)) || Number(amount) < 0) {
      setError("Please enter a valid non-negative amount.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/fee-structures", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          academic_year_id: academicYearId,
          class_id: classId,
          fee_type_id: feeTypeId,
          amount: Number(amount),
          frequency,
          due_date: dueDate || null,
          description: description.trim() || null,
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(
          json?.error || "Unable to create fee structure.",
        );
      }

      const created = json.feeStructure;

      if (created) {
        setFeeStructures((current) => [created, ...current]);
      }

      setAmount("");
      setDueDate("");
      setDescription("");
      setSuccess("Fee structure created successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create fee structure.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Delete this fee structure?",
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `/api/fee-structures?id=${encodeURIComponent(id)}`,
        {
          method: "DELETE",
        },
      );

      const json = await response.json();

      if (!response.ok) {
        throw new Error(
          json?.error || "Unable to delete fee structure.",
        );
      }

      setFeeStructures((current) =>
        current.filter((item) => item.id !== id),
      );

      setSuccess("Fee structure deleted.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete fee structure.",
      );
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500 shadow-sm">
            Loading fee structures...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600">
              Fees & Finance
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              Fee Structures
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Define fees by academic year, class, fee type, and frequency.
            </p>
          </div>

          <a
            href="/app/fees"
            className="inline-flex w-fit items-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            ← Fee Types
          </a>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {success}
          </div>
        )}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-slate-900">
              Create Fee Structure
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Assign a fee to a specific class for an academic year.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Academic Year
              </label>
              <select
                value={academicYearId}
                onChange={(event) => {
                  setAcademicYearId(event.target.value);
                  setClassId("");
                }}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Select academic year</option>
                {academicYears.map((year) => (
                  <option key={year.id} value={year.id}>
                    {year.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Class
              </label>
              <select
                value={classId}
                onChange={(event) => setClassId(event.target.value)}
                disabled={!academicYearId || loadingClasses}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none disabled:bg-slate-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">
                  {loadingClasses ? "Loading classes..." : "Select class"}
                </option>
                {classes.map((schoolClass) => (
                  <option key={schoolClass.id} value={schoolClass.id}>
                    {schoolClass.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Fee Type
              </label>
              <select
                value={feeTypeId}
                onChange={(event) => setFeeTypeId(event.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Select fee type</option>
                {feeTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                    {type.code ? ` (${type.code})` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Amount
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="e.g. 25000"
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Frequency
              </label>
              <select
                value={frequency}
                onChange={(event) => setFrequency(event.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {FREQUENCIES.map((item) => (
                  <option key={item} value={item}>
                    {formatFrequency(item)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="md:col-span-2 lg:col-span-3">
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Optional description..."
                className="w-full resize-none rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="md:col-span-2 lg:col-span-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Creating..." : "Create Fee Structure"}
              </button>
            </div>
          </form>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Fee Structure Master
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {feeStructures.length}{" "}
                {feeStructures.length === 1 ? "structure" : "structures"}
              </p>
            </div>
          </div>

          {feeStructures.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-sm font-medium text-slate-700">
                No fee structures yet
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Create your first fee structure above.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 font-semibold text-slate-600">
                      Academic Year
                    </th>
                    <th className="px-6 py-3 font-semibold text-slate-600">
                      Class
                    </th>
                    <th className="px-6 py-3 font-semibold text-slate-600">
                      Fee Type
                    </th>
                    <th className="px-6 py-3 font-semibold text-slate-600">
                      Amount
                    </th>
                    <th className="px-6 py-3 font-semibold text-slate-600">
                      Frequency
                    </th>
                    <th className="px-6 py-3 font-semibold text-slate-600">
                      Due Date
                    </th>
                    <th className="px-6 py-3 font-semibold text-slate-600">
                      Status
                    </th>
                    <th className="px-6 py-3 font-semibold text-slate-600">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {feeStructures.map((structure) => {
                    const feeType = feeTypeMap.get(structure.fee_type_id);

                    return (
                      <tr key={structure.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 text-slate-700">
                          {academicYearMap.get(
                            structure.academic_year_id,
                          ) ?? "—"}
                        </td>

                        <td className="px-6 py-4 font-medium text-slate-900">
                          {classMap.get(structure.class_id) ?? "—"}
                        </td>

                        <td className="px-6 py-4 text-slate-700">
                          <div>{feeType?.name ?? "—"}</div>
                          {feeType?.code && (
                            <div className="text-xs text-slate-400">
                              {feeType.code}
                            </div>
                          )}
                        </td>

                        <td className="px-6 py-4 font-semibold text-slate-900">
                          ₹
                          {Number(structure.amount).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>

                        <td className="px-6 py-4 text-slate-700">
                          {formatFrequency(structure.frequency)}
                        </td>

                        <td className="px-6 py-4 text-slate-700">
                          {structure.due_date || "—"}
                        </td>

                        <td className="px-6 py-4">
                          <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                            {structure.status ?? "ACTIVE"}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <button
                            type="button"
                            onClick={() => handleDelete(structure.id)}
                            className="text-sm font-semibold text-red-600 hover:text-red-700"
                          >
                            Delete
                          </button>
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
