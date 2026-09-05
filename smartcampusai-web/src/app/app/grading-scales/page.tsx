"use client";

import { useEffect, useState } from "react";

type GradingScale = {
  id: string;
  name: string;
  min_percentage: number;
  max_percentage: number;
  grade: string;
  grade_point: number | null;
  description: string | null;
};

const emptyForm = {
  name: "",
  min_percentage: "",
  max_percentage: "",
  grade: "",
  grade_point: "",
  description: "",
};

export default function GradingScalesPage() {
  const [scales, setScales] = useState<GradingScale[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadScales() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/grading-scales");
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Unable to load grading scales."
        );
      }

      setScales(data.scales || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load grading scales."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadScales();
  }, []);

  function resetForm() {
    setForm(emptyForm);
    setEditingId("");
  }

  function editScale(scale: GradingScale) {
    setEditingId(scale.id);
    setForm({
      name: scale.name,
      min_percentage: String(scale.min_percentage),
      max_percentage: String(scale.max_percentage),
      grade: scale.grade,
      grade_point:
        scale.grade_point !== null
          ? String(scale.grade_point)
          : "",
      description: scale.description || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function saveScale(e: React.FormEvent) {
    e.preventDefault();

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const payload = {
        name: form.name.trim(),
        min_percentage: Number(form.min_percentage),
        max_percentage: Number(form.max_percentage),
        grade: form.grade.trim(),
        grade_point:
          form.grade_point.trim() === ""
            ? null
            : Number(form.grade_point),
        description:
          form.description.trim() || null,
      };

      const response = await fetch(
        editingId
          ? `/api/grading-scales?id=${encodeURIComponent(editingId)}`
          : "/api/grading-scales",
        {
          method: editingId ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Unable to save grading scale."
        );
      }

      setMessage(
        editingId
          ? "Grading scale updated successfully."
          : "Grading scale created successfully."
      );

      resetForm();
      await loadScales();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save grading scale."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteScale(id: string) {
    if (
      !window.confirm(
        "Are you sure you want to remove this grading scale?"
      )
    ) {
      return;
    }

    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `/api/grading-scales?id=${encodeURIComponent(id)}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Unable to remove grading scale."
        );
      }

      setMessage("Grading scale removed successfully.");

      if (editingId === id) {
        resetForm();
      }

      await loadScales();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to remove grading scale."
      );
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <div className="text-sm font-semibold text-blue-600">
            Academic Management
          </div>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Grading Scales
          </h1>

          <p className="mt-2 max-w-3xl text-sm text-slate-600">
            Define percentage ranges, grades and grade points used
            for examination performance.
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {message && (
          <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        )}

        <form
          onSubmit={saveScale}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-slate-900">
              {editingId
                ? "Edit Grading Scale"
                : "Add Grading Scale"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Example: 90–100% = A+.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">
                Scale Name
              </span>

              <input
                required
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                placeholder="Primary School Scale"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">
                Minimum %
              </span>

              <input
                required
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={form.min_percentage}
                onChange={(e) =>
                  setForm({
                    ...form,
                    min_percentage: e.target.value,
                  })
                }
                placeholder="90"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">
                Maximum %
              </span>

              <input
                required
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={form.max_percentage}
                onChange={(e) =>
                  setForm({
                    ...form,
                    max_percentage: e.target.value,
                  })
                }
                placeholder="100"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">
                Grade
              </span>

              <input
                required
                value={form.grade}
                onChange={(e) =>
                  setForm({
                    ...form,
                    grade: e.target.value,
                  })
                }
                placeholder="A+"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-slate-700">
                Grade Point
              </span>

              <input
                type="number"
                min="0"
                step="0.01"
                value={form.grade_point}
                onChange={(e) =>
                  setForm({
                    ...form,
                    grade_point: e.target.value,
                  })
                }
                placeholder="10"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
            </label>

            <label className="block md:col-span-2">
              <span className="mb-1 block text-sm font-medium text-slate-700">
                Description
              </span>

              <input
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
                placeholder="Outstanding performance"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
            </label>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Scale"
                  : "Add Scale"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="font-semibold text-slate-900">
              Configured Grades
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-center text-sm text-slate-500">
              Loading grading scales...
            </div>
          ) : scales.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">
              No grading scales configured yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-6 py-3">Scale</th>
                    <th className="px-6 py-3">Range</th>
                    <th className="px-6 py-3">Grade</th>
                    <th className="px-6 py-3">Point</th>
                    <th className="px-6 py-3">Description</th>
                    <th className="px-6 py-3 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {scales.map((scale) => (
                    <tr key={scale.id}>
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {scale.name}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {scale.min_percentage}–{scale.max_percentage}%
                      </td>

                      <td className="px-6 py-4 font-semibold text-slate-900">
                        {scale.grade}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {scale.grade_point ?? "—"}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {scale.description || "—"}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => editScale(scale)}
                            className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              deleteScale(scale.id)
                            }
                            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100"
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="text-center text-xs text-slate-500">
          Powered by ThomasG Technologies
        </div>
      </div>
    </div>
  );
}
