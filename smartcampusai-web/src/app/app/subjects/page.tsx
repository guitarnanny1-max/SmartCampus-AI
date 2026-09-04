"use client";

import { FormEvent, useEffect, useState } from "react";

type Subject = {
  id: string;
  name: string;
  code: string | null;
  status: string;
  created_at: string;
};

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadSubjects() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/subjects", {
        credentials: "include",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to load subjects.",
        );
      }

      setSubjects(data?.subjects ?? []);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load subjects.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadSubjects();
  }, []);

  async function createSubject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim()) {
      setError("Subject name is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await fetch("/api/subjects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: name.trim(),
          code: code.trim() || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to create subject.",
        );
      }

      setName("");
      setCode("");

      await loadSubjects();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to create subject.",
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
            Academics
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            Subjects
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage the subject master for your school.
          </p>
        </div>

        {error ? (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">
            Add Subject
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Create a reusable subject that can later be assigned to classes.
          </p>

          <form
            onSubmit={createSubject}
            className="mt-5 grid gap-4 sm:grid-cols-[1fr_220px_auto]"
          >
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Mathematics"
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
            />

            <input
              value={code}
              onChange={(event) => setCode(event.target.value)}
              placeholder="MATH"
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm uppercase outline-none focus:border-slate-500"
            />

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Adding..." : "Add Subject"}
            </button>
          </form>
        </section>

        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-5">
            <h2 className="text-lg font-bold text-slate-950">
              Subject Master
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {subjects.length} subject
              {subjects.length === 1 ? "" : "s"}
            </p>
          </div>

          {loading ? (
            <div className="px-6 py-12 text-center text-sm text-slate-400">
              Loading subjects...
            </div>
          ) : subjects.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-sm font-semibold text-slate-700">
                No subjects yet
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Add your first subject above.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {subjects.map((subject) => (
                <div
                  key={subject.id}
                  className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold text-slate-900">
                      {subject.name}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {subject.code || "No code"}
                    </p>
                  </div>

                  <span className="w-fit rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                    {subject.status}
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
