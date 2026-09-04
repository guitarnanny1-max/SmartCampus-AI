"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

type Student = {
  id: string;
  tenantId: string;
  name: string;
  rollNumber: string;
  grade: string;
  parentEmail: string;
  status: string;
  createdAt: string;

  enrollment?: {
    id: string;
    academic_year_id: string;
    class_id: string;
    section_id: string;
    roll_number: string | null;
    status: string;
    enrolled_at: string | null;
  } | null;

  academicYear?: {
    id: string;
    name: string;
    status: string;
  } | null;

  class?: {
    id: string;
    name: string;
    academic_year_id: string;
    status: string;
  } | null;

  section?: {
    id: string;
    name: string;
    class_id: string;
  } | null;
};

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const [name, setName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [grade, setGrade] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [saving, setSaving] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  async function loadStudents() {
    try {
      setLoading(true);
      setError("");

      /*
       * Make sure the browser Supabase session has been restored
       * before calling the protected API.
       */
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        window.location.href =
          `/login?next=${encodeURIComponent("/app/students")}`;
        return;
      }

      const response = await fetch(
        `/api/students?search=${encodeURIComponent(search)}`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to load students."
        );
      }

      setStudents(data.students ?? []);
    } catch (err) {
      console.error("Student loading error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load students."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStudents();
  }, [search]);

  async function addStudent(event: React.FormEvent) {
    event.preventDefault();

    if (!name.trim()) {
      setError("Student name is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        window.location.href =
          `/login?next=${encodeURIComponent("/app/students")}`;
        return;
      }

      const response = await fetch("/api/students", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          rollNumber,
          grade,
          parentEmail,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to create student."
        );
      }

      setName("");
      setRollNumber("");
      setGrade("");
      setParentEmail("");
      setShowAdd(false);

      await loadStudents();
    } catch (err) {
      console.error("Student creation error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create student."
      );
    } finally {
      setSaving(false);
    }
  }

  const activeCount = students.filter(
    (student) => student.status === "ACTIVE"
  ).length;

  const otherCount = students.length - activeCount;

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <a
            href="/app"
            className="text-sm font-medium text-[#64748B] hover:text-black"
          >
            ← Back to dashboard
          </a>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-[#64748B]">
              Student Enrollment & Records
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#0F172A]">
              Students
            </h1>

            <p className="mt-2 text-[#64748B]">
              Manage student profiles, enrollment and academic
              records for your school.
            </p>
          </div>

          <button
            onClick={() => setShowAdd(true)}
            className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-[#1F2937]"
          >
            + Add student
          </button>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border bg-white p-6">
            <p className="text-sm text-[#64748B]">Total students</p>
            <p className="mt-2 text-3xl font-bold">
              {students.length}
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-6">
            <p className="text-sm text-[#64748B]">Active</p>
            <p className="mt-2 text-3xl font-bold">
              {activeCount}
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-6">
            <p className="text-sm text-[#64748B]">
              Other statuses
            </p>
            <p className="mt-2 text-3xl font-bold">
              {otherCount}
            </p>
          </div>
        </div>

        <section className="mt-8 overflow-hidden rounded-2xl border bg-white">
          <div className="flex flex-col gap-4 border-b p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-semibold text-[#0F172A]">
                Enrolled Student Roster
              </h2>
              <p className="mt-1 text-sm text-[#64748B]">
                Search and manage students in your school.
              </p>
            </div>

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search students..."
              className="w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black/10 md:w-72"
            />
          </div>

          {loading ? (
            <div className="px-5 py-16 text-center text-sm text-[#64748B]">
              Loading students...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b bg-[#F8FAFC] text-sm">
                  <tr>
                    <th className="px-5 py-4 font-semibold">
                      Student
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Roll Number
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Class
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Section
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Academic Year
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Parent Email
                    </th>

                    <th className="px-5 py-4 font-semibold">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {students.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-5 py-12 text-center"
                      >
                        <p className="font-medium">
                          No students found
                        </p>

                        <p className="mt-1 text-sm text-[#64748B]">
                          Add your first student to begin building
                          the school roster.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    students.map((student) => (
                      <tr
                        key={student.id}
                        className="hover:bg-[#F8F9FA]"
                      >
                        <td className="px-5 py-4">
                          <Link
                            href={`/app/students/${encodeURIComponent(student.id)}`}
                            className="font-medium text-[#0F172A] hover:text-[#2563EB] hover:underline"
                          >
                            {student.name}
                          </Link>
                        </td>

                        <td className="px-5 py-4 text-sm">
                          {student.enrollment?.roll_number ||
                            student.rollNumber ||
                            "—"}
                        </td>

                        <td className="px-5 py-4 text-sm">
                          {student.class?.name ||
                            student.grade ||
                            "—"}
                        </td>

                        <td className="px-5 py-4 text-sm">
                          {student.section?.name || "—"}
                        </td>

                        <td className="px-5 py-4 text-sm">
                          {student.academicYear?.name || "—"}
                        </td>

                        <td className="px-5 py-4 text-sm text-[#64748B]">
                          {student.parentEmail || "—"}
                        </td>

                        <td className="px-5 py-4">
                          <span className="rounded-full bg-[#F1F5F9] px-3 py-1 text-xs font-semibold">
                            {student.enrollment?.status ||
                              student.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">
                Add student
              </h2>

              <button
                onClick={() => setShowAdd(false)}
                className="text-2xl text-[#64748B]"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={addStudent}
              className="mt-6 space-y-4"
            >
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Student name *"
                className="w-full rounded-xl border px-4 py-3"
              />

              <input
                value={rollNumber}
                onChange={(event) =>
                  setRollNumber(event.target.value)
                }
                placeholder="Roll number"
                className="w-full rounded-xl border px-4 py-3"
              />

              <input
                value={grade}
                onChange={(event) => setGrade(event.target.value)}
                placeholder="Grade / Class"
                className="w-full rounded-xl border px-4 py-3"
              />

              <input
                value={parentEmail}
                onChange={(event) =>
                  setParentEmail(event.target.value)
                }
                placeholder="Parent email"
                type="email"
                className="w-full rounded-xl border px-4 py-3"
              />

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-xl bg-black px-5 py-3 font-semibold text-white disabled:opacity-50"
              >
                {saving ? "Saving..." : "Create student"}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
