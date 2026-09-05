"use client";

import { FormEvent, useEffect, useState } from "react";

type FeeType = {
  id: string;
  name: string;
  code: string | null;
  description: string | null;
  status: string;
  created_at: string;
};

export default function FeesPage() {
  const [feeTypes, setFeeTypes] = useState<FeeType[]>([]);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadFeeTypes() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/fee-types", {
        credentials: "include",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to load fee types.",
        );
      }

      setFeeTypes(data?.feeTypes ?? []);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load fee types.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadFeeTypes();
  }, []);

  async function createFeeType(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!name.trim()) {
      setError("Fee type name is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await fetch("/api/fee-types", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: name.trim(),
          code: code.trim() || null,
          description: description.trim() || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to create fee type.",
        );
      }

      setName("");
      setCode("");
      setDescription("");

      await loadFeeTypes();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to create fee type.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] px-6 py-8">
      <div className="mx-auto max-w-6xl">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Fees & Finance
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            Fees
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage fee types and school fee configuration.
          </p>
        </div>

        {error ? (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">
            Add Fee Type
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Create a reusable fee category for your school.
          </p>

          <form
            onSubmit={createFeeType}
            className="mt-5 grid gap-4 sm:grid-cols-[1fr_180px_1.5fr_auto]"
          >
            <input
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="Tuition Fee"
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
            />

            <input
              value={code}
              onChange={(event) =>
                setCode(event.target.value)
              }
              placeholder="TUITION"
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm uppercase outline-none focus:border-slate-500"
            />

            <input
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="Annual tuition fee"
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
            />

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Adding..." : "Add Fee Type"}
            </button>
          </form>
        </section>

        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-5">
            <h2 className="text-lg font-bold text-slate-950">
              Fee Type Master
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {feeTypes.length} fee type
              {feeTypes.length === 1 ? "" : "s"}
            </p>
          </div>

          {loading ? (
            <div className="px-6 py-12 text-center text-sm text-slate-400">
              Loading fee types...
            </div>
          ) : feeTypes.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-sm font-semibold text-slate-700">
                No fee types yet
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Add your first fee type above.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {feeTypes.map((feeType) => (
                <div
                  key={feeType.id}
                  className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold text-slate-900">
                      {feeType.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {feeType.code || "No code"}
                      {feeType.description
                        ? ` • ${feeType.description}`
                        : ""}
                    </p>
                  </div>

                  <span className="w-fit rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                    {feeType.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        <p className="mt-8 text-center text-xs text-slate-400">
          © 2026 SmartCampusAI Powered by ThomasG Technologies
        </p>
      </div>
    </main>
  );
}
