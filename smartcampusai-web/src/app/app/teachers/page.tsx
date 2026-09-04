"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Teacher = {
  id: string;
  tenant_id?: string;
  employee_id?: string;
  salutation?: string;
  first_name?: string;
  last_name?: string;
  name?: string;
  email?: string;
  phone?: string;
  gender?: string;
  designation?: string;
  department?: string;
  status?: string | boolean;
  created_at?: string;
  createdAt?: string;
};

type TeacherForm = {
  salutation: string;
  employee_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  designation: string;
  department: string;
  status: string;
};

function emptyForm(): TeacherForm {
  return {
    salutation: "Mr",
    employee_id: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    gender: "",
    designation: "Teacher",
    department: "",
    status: "ACTIVE",
  };
}

function getTeacherName(teacher: Teacher) {
  const firstLast = [teacher.first_name, teacher.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();

  const baseName = firstLast || teacher.name?.trim() || "Unnamed Teacher";

  const salutation = teacher.salutation?.trim();

  if (!salutation) {
    return baseName;
  }

  const normalizedBase = baseName.toLowerCase();
  const normalizedSalutation = salutation.toLowerCase();

  if (
    normalizedBase === normalizedSalutation ||
    normalizedBase.startsWith(`${normalizedSalutation} `)
  ) {
    return baseName;
  }

  return `${salutation} ${baseName}`.trim();
}

function isActive(status: Teacher["status"]) {
  if (typeof status === "boolean") return status;

  return (
    !status ||
    String(status).toUpperCase() === "ACTIVE"
  );
}

export default function TeachersPage() {
  const router = useRouter();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showAddTeacher, setShowAddTeacher] = useState(false);
  const [saving, setSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState("");
  const [form, setForm] = useState<TeacherForm>(emptyForm());
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  async function loadTeachers() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/teachers", {
        credentials: "include",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to load teachers."
        );
      }

      setTeachers(
        Array.isArray(data?.teachers)
          ? data.teachers
          : []
      );
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load teachers."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTeachers();
  }, []);

  const filteredTeachers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return teachers;

    return teachers.filter((teacher) => {
      const values = [
        getTeacherName(teacher),
        teacher.employee_id,
        teacher.email,
        teacher.phone,
        teacher.designation,
        teacher.department,
      ];

      return values.some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(query)
      );
    });
  }, [teachers, search]);

  const activeCount = teachers.filter((teacher) =>
    isActive(teacher.status)
  ).length;

  const inactiveCount =
    teachers.length - activeCount;

  function updateForm(
    field: keyof TeacherForm,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function createTeacher(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!form.first_name.trim() && !form.last_name.trim()) {
      setError("Please enter the teacher name.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await fetch("/api/teachers", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          salutation: form.salutation,
          employee_id:
            form.employee_id.trim() || null,
          first_name:
            form.first_name.trim() || null,
          last_name:
            form.last_name.trim() || null,
          name: [
            form.first_name.trim(),
            form.last_name.trim(),
          ]
            .filter(Boolean)
            .join(" "),
          email: form.email.trim(),
          phone: form.phone.trim(),
          gender: form.gender,
          designation: form.designation.trim(),
          department: form.department.trim(),
          status: form.status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to create teacher."
        );
      }

      setShowAddTeacher(false);
      setForm(emptyForm());

      await loadTeachers();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to create teacher."
      );
    } finally {
      setSaving(false);
    }
  }

  function startEditingTeacher(teacher: Teacher) {
    const parts = getTeacherName(teacher).split(" ");
    const knownSalutations = ["Mr", "Mrs", "Ms", "Miss", "Dr", "Prof"];
    const firstWord = parts[0] || "";

    const salutation = knownSalutations.includes(firstWord)
      ? firstWord
      : "Mr";

    const firstName =
      teacher.first_name ||
      (salutation === firstWord ? parts[1] : parts[0]) ||
      "";

    const lastName =
      teacher.last_name ||
      (salutation === firstWord
        ? parts.slice(2).join(" ")
        : parts.slice(1).join(" ")) ||
      "";

    setForm({
      salutation,
      employee_id: teacher.employee_id || "",
      first_name: firstName,
      last_name: lastName,
      email: teacher.email || "",
      phone: teacher.phone || "",
      gender: teacher.gender || "",
      designation: teacher.designation || "Teacher",
      department: teacher.department || "",
      status:
        typeof teacher.status === "boolean"
          ? teacher.status
            ? "ACTIVE"
            : "INACTIVE"
          : String(teacher.status || "ACTIVE").toUpperCase(),
    });

    setEditingTeacher(teacher);
    setShowAddTeacher(false);
    setError("");
  }

  async function updateTeacher() {
    if (!editingTeacher?.id) return;

    if (!form.first_name.trim()) {
      setError("First name is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await fetch(
        `/api/teachers/${encodeURIComponent(editingTeacher.id)}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to update teacher."
        );
      }

      setEditingTeacher(null);
      setForm(emptyForm());

      await loadTeachers();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to update teacher."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deactivateTeacher(teacher: Teacher) {
    if (!teacher.id) return;

    const teacherName = getTeacherName(teacher);

    if (
      !window.confirm(
        `Deactivate ${teacherName}? This teacher will remain in the staff directory but will be marked inactive.`
      )
    ) {
      return;
    }

    try {
      setActionLoading(teacher.id);
      setError("");

      const response = await fetch(
        `/api/teachers/${encodeURIComponent(teacher.id)}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "INACTIVE",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to deactivate teacher."
        );
      }

      await loadTeachers();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to deactivate teacher."
      );
    } finally {
      setActionLoading("");
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">

        {/* HEADER */}
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">
              School
            </p>

            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">
              Teacher Management
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Manage teachers, staff profiles, subjects,
              workload and teaching assignments from one
              workspace.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setError("");
              setForm(emptyForm());
              setShowAddTeacher(true);
            }}
            className="inline-flex items-center justify-center rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            + Add teacher
          </button>
        </div>

        {/* ADD TEACHER */}
        {showAddTeacher && (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">
                  Add teacher
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Create a new teacher in your staff directory.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddTeacher(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-950"
              >
                Cancel
              </button>
            </div>

            <form
              onSubmit={createTeacher}
              className="mt-6 space-y-6"
            >
              <div className="grid gap-4 md:grid-cols-4">

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Salutation
                  </label>

                  <select
                    value={form.salutation}
                    onChange={(event) =>
                      updateForm(
                        "salutation",
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-400"
                  >
                    <option value="Mr">Mr.</option>
                    <option value="Mrs">Mrs.</option>
                    <option value="Ms">Ms.</option>
                    <option value="Miss">Miss</option>
                    <option value="Dr">Dr.</option>
                    <option value="Prof">Prof.</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    First name
                  </label>

                  <input
                    value={form.first_name}
                    onChange={(event) =>
                      updateForm(
                        "first_name",
                        event.target.value
                      )
                    }
                    placeholder="John"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Last name
                  </label>

                  <input
                    value={form.last_name}
                    onChange={(event) =>
                      updateForm(
                        "last_name",
                        event.target.value
                      )
                    }
                    placeholder="Smith"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Employee ID
                  </label>

                  <input
                    value={form.employee_id}
                    onChange={(event) =>
                      updateForm(
                        "employee_id",
                        event.target.value
                      )
                    }
                    placeholder="TCH001"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Email
                  </label>

                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) =>
                      updateForm(
                        "email",
                        event.target.value
                      )
                    }
                    placeholder="teacher@school.com"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Phone
                  </label>

                  <input
                    value={form.phone}
                    onChange={(event) =>
                      updateForm(
                        "phone",
                        event.target.value
                      )
                    }
                    placeholder="+91 9876543210"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Gender
                  </label>

                  <select
                    value={form.gender}
                    onChange={(event) =>
                      updateForm(
                        "gender",
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-400"
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Designation
                  </label>

                  <input
                    value={form.designation}
                    onChange={(event) =>
                      updateForm(
                        "designation",
                        event.target.value
                      )
                    }
                    placeholder="Teacher"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Department
                  </label>

                  <input
                    value={form.department}
                    onChange={(event) =>
                      updateForm(
                        "department",
                        event.target.value
                      )
                    }
                    placeholder="Mathematics"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Status
                  </label>

                  <select
                    value={form.status}
                    onChange={(event) =>
                      updateForm(
                        "status",
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-400"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={() =>
                    setShowAddTeacher(false)
                  }
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Creating..."
                    : "Create teacher"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* EDIT TEACHER */}
        {editingTeacher && (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">
                  Edit teacher
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Update this teacher's staff profile.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingTeacher(null);
                  setForm(emptyForm());
                  setError("");
                }}
                className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Salutation
                </label>
                <select
                  value={form.salutation}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      salutation: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-400"
                >
                  <option value="Mr">Mr</option>
                  <option value="Mrs">Mrs</option>
                  <option value="Ms">Ms</option>
                  <option value="Miss">Miss</option>
                  <option value="Dr">Dr</option>
                  <option value="Prof">Prof</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  First name
                </label>
                <input
                  value={form.first_name}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      first_name: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Last name
                </label>
                <input
                  value={form.last_name}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      last_name: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Employee ID
                </label>
                <input
                  value={form.employee_id}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      employee_id: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Phone
                </label>
                <input
                  value={form.phone}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      phone: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Gender
                </label>
                <select
                  value={form.gender}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      gender: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-400"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Designation
                </label>
                <input
                  value={form.designation}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      designation: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Department
                </label>
                <input
                  value={form.department}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      department: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      status: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-400"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setEditingTeacher(null);
                  setForm(emptyForm());
                  setError("");
                }}
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={saving}
                onClick={updateTeacher}
                className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>
        )}

        {/* STATS */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Total teachers
            </p>

            <p className="mt-2 text-3xl font-semibold text-slate-950">
              {teachers.length}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              All teaching staff
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Active
            </p>

            <p className="mt-2 text-3xl font-semibold text-slate-950">
              {activeCount}
            </p>

            <p className="mt-1 text-sm text-green-600">
              Currently active
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Inactive
            </p>

            <p className="mt-2 text-3xl font-semibold text-slate-950">
              {inactiveCount}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Not currently active
            </p>
          </div>
        </div>

        {/* DIRECTORY */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">
                  Teacher Directory
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  View and manage teaching staff.
                </p>
              </div>

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search teachers..."
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none placeholder:text-slate-400 focus:border-slate-400 md:w-80"
              />
            </div>
          </div>

          {loading && (
            <div className="p-10 text-center text-sm text-slate-500">
              Loading teachers...
            </div>
          )}

          {!loading &&
            !error &&
            filteredTeachers.length === 0 && (
              <div className="p-12 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-lg font-semibold">
                  T
                </div>

                <h3 className="mt-4 text-base font-semibold text-slate-950">
                  No teachers found
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {search
                    ? "Try a different search."
                    : "Add your first teacher to start building the staff directory."}
                </p>
              </div>
            )}

          {!loading &&
            !error &&
            filteredTeachers.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px] text-left">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Teacher
                      </th>

                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Employee ID
                      </th>

                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Contact
                      </th>

                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Designation
                      </th>

                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Department
                      </th>

                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Status
                      </th>

                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredTeachers.map((teacher) => {
                      const teacherName =
                        getTeacherName(teacher);

                      const active = isActive(
                        teacher.status
                      );

                      return (
                        <tr
                          key={teacher.id}
                          className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                        >
                          <td className="px-5 py-4">
                            <button
                              type="button"
                              onClick={() =>
                                router.push(`/app/teachers/${teacher.id}`)
                              }
                              className="group flex items-center gap-3 text-left"
                            >
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black text-xs font-bold text-white transition group-hover:scale-105">
                                {teacherName.charAt(0).toUpperCase()}
                              </div>

                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-slate-950 group-hover:underline">
                                  {teacherName}
                                </p>

                                <p className="truncate text-xs text-slate-500">
                                  {teacher.gender || "Teacher"}
                                </p>
                              </div>
                            </button>
                          </td>

                          <td className="px-5 py-4 text-sm text-slate-600">
                            {teacher.employee_id || "—"}
                          </td>

                          <td className="px-5 py-4">
                            <p className="text-sm text-slate-700">
                              {teacher.email || "—"}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              {teacher.phone || "—"}
                            </p>
                          </td>

                          <td className="px-5 py-4 text-sm text-slate-600">
                            {teacher.designation ||
                              "Teacher"}
                          </td>

                          <td className="px-5 py-4 text-sm text-slate-600">
                            {teacher.department || "—"}
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                                active
                                  ? "bg-green-50 text-green-700"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {active
                                ? "Active"
                                : "Inactive"}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex flex-wrap items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  startEditingTeacher(teacher)
                                }
                                className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                              >
                                Edit
                              </button>

                              {active ? (
                                <button
                                  type="button"
                                  disabled={actionLoading === teacher.id}
                                  onClick={() =>
                                    deactivateTeacher(teacher)
                                  }
                                  className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  {actionLoading === teacher.id
                                    ? "Updating..."
                                    : "Deactivate"}
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  disabled={actionLoading === teacher.id}
                                  onClick={async () => {
                                    if (!teacher.id) return;

                                    try {
                                      setActionLoading(teacher.id);
                                      setError("");

                                      const response = await fetch(
                                        `/api/teachers/${encodeURIComponent(
                                          teacher.id
                                        )}`,
                                        {
                                          method: "PATCH",
                                          credentials: "include",
                                          headers: {
                                            "Content-Type":
                                              "application/json",
                                          },
                                          body: JSON.stringify({
                                            status: "ACTIVE",
                                          }),
                                        }
                                      );

                                      const data =
                                        await response.json();

                                      if (!response.ok) {
                                        throw new Error(
                                          data?.error ||
                                            "Unable to activate teacher."
                                        );
                                      }

                                      await loadTeachers();
                                    } catch (err) {
                                      console.error(err);

                                      setError(
                                        err instanceof Error
                                          ? err.message
                                          : "Unable to activate teacher."
                                      );
                                    } finally {
                                      setActionLoading("");
                                    }
                                  }}
                                  className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  {actionLoading === teacher.id
                                    ? "Updating..."
                                    : "Activate"}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
        </div>

        <div className="mt-5 text-xs text-slate-400">
          Showing {filteredTeachers.length} of{" "}
          {teachers.length} teachers
        </div>
      </div>
    </div>
  );
}
