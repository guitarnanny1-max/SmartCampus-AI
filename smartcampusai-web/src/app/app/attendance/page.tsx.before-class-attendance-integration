"use client";

import Link from "next/link";

import { useEffect, useMemo, useState } from "react";

type AttendanceStatus =
  | "PRESENT"
  | "ABSENT"
  | "LATE"
  | "HALF_DAY"
  | "LEAVE";

type RoleFilter = "ALL" | "Teacher" | "Student";

type AttendanceStudent = {
  id: string;
  name: string | null;
  rollNumber: string | null;
  grade: string | null;
  status: string | null;
};

type AttendanceRecord = {
  id: string;
  personId: string;
  personName: string;
  employeeId?: string | null;
  role: "Teacher" | "Student";
  date: string;
  status: AttendanceStatus;
  checkIn?: string | null;
  checkOut?: string | null;
  notes?: string | null;
  hours?: string | null;
};

type Summary = {
  total: number;
  present: number;
  absent: number;
  late: number;
  halfDay: number;
  leave: number;
  attendanceRate: number;
};

const STATUS_CONFIG: Record<
  AttendanceStatus,
  {
    label: string;
    description: string;
    className: string;
  }
> = {
  PRESENT: {
    label: "Present",
    description: "On duty",
    className:
      "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
  },
  ABSENT: {
    label: "Absent",
    description: "Not present",
    className:
      "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200",
  },
  LATE: {
    label: "Late",
    description: "Late arrival",
    className:
      "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
  },
  HALF_DAY: {
    label: "Half Day",
    description: "Partial day",
    className:
      "bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-200",
  },
  LEAVE: {
    label: "Leave",
    description: "Approved leave",
    className:
      "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200",
  },
};

function formatTime(value?: string | null) {
  if (!value) return "—";

  const match = value.match(/^(\d{2}):(\d{2})/);

  if (!match) return value;

  return `${match[1]}:${match[2]}`;
}

function calculateHours(
  checkIn?: string | null,
  checkOut?: string | null,
) {
  if (!checkIn || !checkOut) return "—";

  const inMatch = checkIn.match(/^(\d{2}):(\d{2})/);
  const outMatch = checkOut.match(/^(\d{2}):(\d{2})/);

  if (!inMatch || !outMatch) return "—";

  const inMinutes =
    Number(inMatch[1]) * 60 + Number(inMatch[2]);

  const outMinutes =
    Number(outMatch[1]) * 60 + Number(outMatch[2]);

  let difference = outMinutes - inMinutes;

  if (difference < 0) {
    difference += 24 * 60;
  }

  const hours = Math.floor(difference / 60);
  const minutes = difference % 60;

  return `${hours}h ${String(minutes).padStart(2, "0")}m`;
}

function formatDate(value: string) {
  if (!value) return "—";

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function shiftDate(value: string, amount: number) {
  const date = new Date(`${value}T00:00:00`);

  date.setDate(date.getDate() + amount);

  return date.toISOString().slice(0, 10);
}

export default function AttendancePage() {
  const [date, setDate] = useState(
    new Date().toISOString().slice(0, 10),
  );

  const [role, setRole] = useState<RoleFilter>("ALL");

  const [status, setStatus] = useState<
    "ALL" | AttendanceStatus
  >("ALL");

  const [teacherId, setTeacherId] = useState("ALL");

  const [records, setRecords] = useState<
    AttendanceRecord[]
  >([]);

  const [summary, setSummary] = useState<Summary>({
    total: 0,
    present: 0,
    absent: 0,
    late: 0,
    halfDay: 0,
    leave: 0,
    attendanceRate: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [editingRecord, setEditingRecord] =
    useState<AttendanceRecord | null>(null);
  const [editStatus, setEditStatus] =
    useState<AttendanceStatus>("PRESENT");
  const [editPunchTime, setEditPunchTime] =
    useState("");
  const [editNotes, setEditNotes] =
    useState("");
  const [editSaving, setEditSaving] =
    useState(false);

  const [creatingStudentAttendance, setCreatingStudentAttendance] =
    useState(false);
  const [createStudentId, setCreateStudentId] =
    useState("");
  const [createStatus, setCreateStatus] =
    useState<AttendanceStatus>("PRESENT");
  const [createPunchTime, setCreatePunchTime] =
    useState("");
  const [createNotes, setCreateNotes] =
    useState("");
  const [createSaving, setCreateSaving] =
    useState(false);
  const [createError, setCreateError] =
    useState("");

  // V11 — class-wise manual attendance UI state.
  // UI only for now. No database/API changes.
  const [classAttendanceClass, setClassAttendanceClass] =
    useState("");
  const [classAttendanceSection, setClassAttendanceSection] =
    useState("");
  const [classAttendancePeriod, setClassAttendancePeriod] =
    useState("");
  const [classAttendanceSubject, setClassAttendanceSubject] =
    useState("");
  const [classAttendanceMarks, setClassAttendanceMarks] =
    useState<Record<string, "PRESENT" | "ABSENT">>({});

  const [attendanceStudents, setAttendanceStudents] =
    useState<AttendanceStudent[]>([]);
  const [attendanceStudentsLoading, setAttendanceStudentsLoading] =
    useState(false);
  const [attendanceStudentsError, setAttendanceStudentsError] =
    useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadAttendanceStudents() {
      try {
        setAttendanceStudentsLoading(true);
        setAttendanceStudentsError("");

        const response = await fetch("/api/students", {
          credentials: "include",
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error || "Unable to load students.",
          );
        }

        if (cancelled) return;

        const students: AttendanceStudent[] = (
          data?.students ?? []
        )
          .filter(
            (student: AttendanceStudent) =>
              student.status === "ACTIVE",
          )
          .map((student: AttendanceStudent) => ({
            id: student.id,
            name: student.name ?? null,
            rollNumber: student.rollNumber ?? null,
            grade: student.grade ?? null,
            status: student.status ?? null,
          }));

        setAttendanceStudents(students);
      } catch (error) {
        if (cancelled) return;

        setAttendanceStudentsError(
          error instanceof Error
            ? error.message
            : "Unable to load students.",
        );
      } finally {
        if (!cancelled) {
          setAttendanceStudentsLoading(false);
        }
      }
    }

    loadAttendanceStudents();

    return () => {
      cancelled = true;
    };
  }, []);


  useEffect(() => {
    let cancelled = false;

    async function loadAttendance() {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams();

        params.set("date", date);

        if (status !== "ALL") {
          params.set("status", status);
        }

        if (teacherId !== "ALL") {
          params.set("teacher_id", teacherId);
        }

        const response = await fetch(
          `/api/attendance?${params.toString()}`,
          {
            credentials: "include",
            cache: "no-store",
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error ||
              "Unable to load attendance records.",
          );
        }

        if (cancelled) return;

        const normalized: AttendanceRecord[] = (
          data?.records ?? []
        ).map((item: AttendanceRecord) => ({
          id: item.id,
          personId: item.personId,
          personName: item.personName,
          employeeId: item.employeeId ?? null,
          role: item.role,
          date: item.date,
          status: item.status,
          checkIn:
            item.checkIn ??
            null,
          checkOut:
            item.checkOut ??
            null,
          notes: item.notes ?? null,
          hours:
            item.hours ??
            calculateHours(
              item.checkIn,
              item.checkOut,
            ),
        }));

        setRecords(normalized);

        setSummary({
          total:
            Number(data?.summary?.total) ||
            normalized.length,
          present:
            Number(data?.summary?.present) || 0,
          absent:
            Number(data?.summary?.absent) || 0,
          late:
            Number(data?.summary?.late) || 0,
          halfDay:
            Number(data?.summary?.halfDay) || 0,
          leave:
            Number(data?.summary?.leave) || 0,
          attendanceRate:
            Number(data?.summary?.attendanceRate) || 0,
        });

        console.log(
          "Central attendance API:",
          {
            date,
            recordCount: data?.records?.length ?? 0,
            normalizedCount: normalized.length,
            summary: data?.summary,
          },
        );
      } catch (err) {
        console.error(
          "Central attendance load error:",
          err,
        );

        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load attendance records.",
          );

          setRecords([]);

          setSummary({
            total: 0,
            present: 0,
            absent: 0,
            late: 0,
            halfDay: 0,
            leave: 0,
            attendanceRate: 0,
          });
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadAttendance();

    return () => {
      cancelled = true;
    };
  }, [date, status, teacherId]);

  function setClassStudentAttendance(
    studentId: string,
    value: "PRESENT" | "ABSENT",
  ) {
    setClassAttendanceMarks((current) => ({
      ...current,
      [studentId]: value,
    }));
  }

  function markAllClassStudentsPresent() {
    const next: Record<string, "PRESENT" | "ABSENT"> = {};

    attendanceStudents
      .filter((student) =>
        classAttendanceClass
          ? student.grade === classAttendanceClass
          : true,
      )
      .forEach((student) => {
        next[student.id] = "PRESENT";
      });

    setClassAttendanceMarks(next);
  }

  function clearClassAttendanceMarks() {
    setClassAttendanceMarks({});
  }

  async function createStudentAttendance() {
    if (!createStudentId) {
      setCreateError("Please select a student.");
      return;
    }

    if (createSaving) {
      return;
    }

    const studentId = createStudentId.trim();

    if (!studentId) {
      setCreateError("Student ID is required.");
      return;
    }

    try {
      setCreateSaving(true);
      setError("");

      const response = await fetch(
        `/api/students/${encodeURIComponent(studentId)}/attendance`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          cache: "no-store",
          body: JSON.stringify({
            date,
            status: createStatus,
            punchTime: createPunchTime || null,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          setCreateError(
            data?.error ||
              "Attendance already exists for this student and date.",
          );
          return;
        }

        throw new Error(
          data?.error ||
            "Unable to create student attendance.",
        );
      }

      setCreateStudentId("");
      setCreateStatus("PRESENT");
      setCreatePunchTime("");
      setCreateNotes("");

      setError("");

      // Reload the currently selected date so the new
      // student attendance record appears immediately.
      const refreshParams = new URLSearchParams();
      refreshParams.set("date", date);

      if (status !== "ALL") {
        refreshParams.set("status", status);
      }

      if (teacherId !== "ALL") {
        refreshParams.set("teacher_id", teacherId);
      }

      const refreshResponse = await fetch(
        `/api/attendance?${refreshParams.toString()}`,
        {
          credentials: "include",
          cache: "no-store",
        },
      );

      const refreshData = await refreshResponse.json();

      if (refreshResponse.ok) {
        const refreshedRecords: AttendanceRecord[] = (
          refreshData?.records ?? []
        ).map((item: AttendanceRecord) => ({
          id: item.id,
          personId: item.personId,
          personName: item.personName,
          employeeId: item.employeeId ?? null,
          role: item.role,
          date: item.date,
          status: item.status,
          checkIn: item.checkIn ?? null,
          checkOut: item.checkOut ?? null,
          notes: item.notes ?? null,
          hours: item.hours ?? null,
        }));

        setRecords(refreshedRecords);

        if (refreshData?.summary) {
          setSummary(refreshData.summary);
        }
      }
    } catch (err) {
      console.error(
        "Create student attendance error:",
        err,
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to create student attendance.",
      );
    } finally {
      setCreateSaving(false);
    }
  }

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      if (
        role !== "ALL" &&
        record.role !== role
      ) {
        return false;
      }

      return true;
    });
  }, [records, role]);

  const filteredSummary = useMemo<Summary>(() => {
    const total = filteredRecords.length;
    const present = filteredRecords.filter(
      (item) => item.status === "PRESENT",
    ).length;
    const absent = filteredRecords.filter(
      (item) => item.status === "ABSENT",
    ).length;
    const late = filteredRecords.filter(
      (item) => item.status === "LATE",
    ).length;
    const halfDay = filteredRecords.filter(
      (item) => item.status === "HALF_DAY",
    ).length;
    const leave = filteredRecords.filter(
      (item) => item.status === "LEAVE",
    ).length;

    return {
      total,
      present,
      absent,
      late,
      halfDay,
      leave,
      attendanceRate:
        total > 0
          ? Math.round((present / total) * 100)
          : 0,
    };
  }, [filteredRecords]);

  const teacherOptions = useMemo(() => {
    const map = new Map<string, string>();

    records.forEach((record) => {
      if (record.role === "Teacher") {
        map.set(
          record.personId,
          record.personName,
        );
      }
    });

    return Array.from(map.entries()).sort(
      ([, a], [, b]) =>
        a.localeCompare(b),
    );
  }, [records]);

  function openEdit(record: AttendanceRecord) {
    if (record.role !== "Student") return;

    setEditingRecord(record);
    setEditStatus(record.status);
    setEditPunchTime(record.checkIn || "");
    setEditNotes(record.notes || "");
  }

  function closeEdit() {
    setEditingRecord(null);
  }

  async function saveEdit() {
    if (!editingRecord || editSaving) return;

    try {
      setEditSaving(true);
      setError("");

      const response = await fetch(
        `/api/students/${encodeURIComponent(editingRecord.personId)}/attendance`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          cache: "no-store",
          body: JSON.stringify({
            attendanceId: editingRecord.id,
            date: editingRecord.date,
            status: editStatus,
            punchTime: editPunchTime.trim() || null,
            notes: editNotes.trim() || null,
          }),
        },
      );

      const text = await response.text();

      let data: {
        success?: boolean;
        error?: string;
      } = {};

      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          throw new Error(
            "The server returned an invalid response.",
          );
        }
      }

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to update student attendance.",
        );
      }

      setEditingRecord(null);

      // Refresh the central attendance register.
      const params = new URLSearchParams();
      params.set("date", date);

      const refreshResponse = await fetch(
        `/api/attendance?${params.toString()}`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        },
      );

      const refreshText =
        await refreshResponse.text();

      if (!refreshResponse.ok) {
        throw new Error(
          "Attendance was updated, but the register could not be refreshed.",
        );
      }

      const refreshData =
        refreshText
          ? JSON.parse(refreshText)
          : {};

      setRecords(refreshData.records || []);

      setSummary(
        refreshData.summary || {
          total: 0,
          present: 0,
          absent: 0,
          late: 0,
          halfDay: 0,
          leave: 0,
          attendanceRate: 0,
        },
      );
    } catch (err) {
      console.error(
        "Student attendance save error:",
        err,
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to update student attendance.",
      );
    } finally {
      setEditSaving(false);
    }
  }

  const cards = [
    {
      label: "Attendance rate",
      value: `${filteredSummary.attendanceRate}%`,
      description: "Overall attendance",
    },
    {
      label: "Present",
      value: filteredSummary.present,
      description: "On duty",
    },
    {
      label: "Absent",
      value: filteredSummary.absent,
      description: "Not present",
    },
    {
      label: "Late",
      value: filteredSummary.late,
      description: "Late arrivals",
    },
    {
      label: "Leave",
      value: filteredSummary.leave,
      description: "Approved leave",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Academics
              </p>

              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
                Attendance
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-slate-500">
                Monitor daily teacher and student attendance
                across the school.
              </p>
            </div>

            <div className="flex flex-wrap items-end gap-3">
              <button
                type="button"
                onClick={() =>
                  setDate(
                    shiftDate(date, -1),
                  )
                }
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                ← Previous
              </button>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Date
                </label>

                <input
                  type="date"
                  value={date}
                  onChange={(event) =>
                    setDate(event.target.value)
                  }
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                />
              </div>

              <button
                type="button"
                onClick={() =>
                  setDate(
                    shiftDate(date, 1),
                  )
                }
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Next →
              </button>

              <button
                type="button"
                onClick={() =>
                  setDate(
                    new Date()
                      .toISOString()
                      .slice(0, 10),
                  )
                }
                className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Today
              </button>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {cards.map((card) => (
            <div
              key={card.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                {card.label}
              </p>

              <p className="mt-2 text-2xl font-semibold text-slate-950">
                {card.value}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {card.description}
              </p>
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">
                Daily register
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {formatDate(date)}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Role
                </label>

                <select
                  value={role}
                  onChange={(event) =>
                    setRole(
                      event.target.value as RoleFilter,
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                >
                  <option value="ALL">
                    Everyone
                  </option>
                  <option value="Teacher">
                    Teachers
                  </option>
                  <option value="Student">
                    Students
                  </option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Teacher
                </label>

                <select
                  value={teacherId}
                  onChange={(event) =>
                    setTeacherId(
                      event.target.value,
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                >
                  <option value="ALL">
                    All teachers
                  </option>

                  {teacherOptions.map(
                    ([id, name]) => (
                      <option
                        key={id}
                        value={id}
                      >
                        {name}
                      </option>
                    ),
                  )}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </label>

                <select
                  value={status}
                  onChange={(event) =>
                    setStatus(
                      event.target.value as
                        | "ALL"
                        | AttendanceStatus,
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                >
                  <option value="ALL">
                    All statuses
                  </option>
                  <option value="PRESENT">
                    Present
                  </option>
                  <option value="ABSENT">
                    Absent
                  </option>
                  <option value="LATE">
                    Late
                  </option>
                  <option value="HALF_DAY">
                    Half Day
                  </option>
                  <option value="LEAVE">
                    Leave
                  </option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {error && (
          <section className="rounded-2xl border border-red-200 bg-red-50 p-5">
            <p className="text-sm font-semibold text-red-800">
              Unable to load attendance
            </p>

            <p className="mt-1 text-sm text-red-700">
              {error}
            </p>
          </section>
        )}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:p-6">
          <div className="border-b border-slate-200 p-5 sm:p-6">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  V11 · Manual Class Attendance
                </p>
                <h2 className="mt-1 text-lg font-semibold text-slate-900">
                  Class-wise Attendance
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Mark an entire class Present or Absent using quick tick marks.
                </p>
              </div>

              <span className="w-fit rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                UI Preview
              </span>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-4">
              <div>
                <label
                  htmlFor="class-attendance-class"
                  className="mb-1.5 block text-sm font-semibold text-slate-700"
                >
                  Class
                </label>
                <select
                  id="class-attendance-class"
                  value={classAttendanceClass}
                  onChange={(event) => {
                    setClassAttendanceClass(event.target.value);
                    clearClassAttendanceMarks();
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                >
                  <option value="">Select class</option>

                  {Array.from(
                    new Set(
                      attendanceStudents
                        .map((student) => student.grade)
                        .filter(Boolean),
                    ),
                  ).map((grade) => (
                    <option key={grade} value={grade ?? ""}>
                      {grade}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="class-attendance-section"
                  className="mb-1.5 block text-sm font-semibold text-slate-700"
                >
                  Section
                </label>
                <select
                  id="class-attendance-section"
                  value={classAttendanceSection}
                  onChange={(event) =>
                    setClassAttendanceSection(event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                >
                  <option value="">Select section</option>
                  <option value="A">Section A</option>
                  <option value="B">Section B</option>
                  <option value="C">Section C</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="class-attendance-period"
                  className="mb-1.5 block text-sm font-semibold text-slate-700"
                >
                  Period
                </label>
                <select
                  id="class-attendance-period"
                  value={classAttendancePeriod}
                  onChange={(event) =>
                    setClassAttendancePeriod(event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                >
                  <option value="">Select period</option>
                  <option value="1">Period 1</option>
                  <option value="2">Period 2</option>
                  <option value="3">Period 3</option>
                  <option value="4">Period 4</option>
                  <option value="5">Period 5</option>
                  <option value="6">Period 6</option>
                  <option value="7">Period 7</option>
                  <option value="8">Period 8</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="class-attendance-subject"
                  className="mb-1.5 block text-sm font-semibold text-slate-700"
                >
                  Subject
                </label>
                <select
                  id="class-attendance-subject"
                  value={classAttendanceSubject}
                  onChange={(event) =>
                    setClassAttendanceSubject(event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                >
                  <option value="">Select subject</option>
                  <option value="MATHEMATICS">Mathematics</option>
                  <option value="ENGLISH">English</option>
                  <option value="SCIENCE">Science</option>
                  <option value="SOCIAL">Social Studies</option>
                  <option value="COMPUTER">Computer</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-800">
                {classAttendanceClass
                  ? `${classAttendanceClass} · ${classAttendanceSection || "All Sections"}`
                  : "Select a class"}
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                {classAttendancePeriod
                  ? `Period ${classAttendancePeriod}`
                  : "Select a period"}{" "}
                {classAttendanceSubject
                  ? `· ${classAttendanceSubject}`
                  : ""}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={markAllClassStudentsPresent}
                disabled={!classAttendanceClass || attendanceStudentsLoading}
                className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                ✓ Mark All Present
              </button>

              <button
                type="button"
                onClick={clearClassAttendanceMarks}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {attendanceStudents
              .filter((student) =>
                classAttendanceClass
                  ? student.grade === classAttendanceClass
                  : false,
              )
              .map((student) => {
                const currentStatus =
                  classAttendanceMarks[student.id];

                return (
                  <div
                    key={student.id}
                    className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900">
                        {student.name || student.id}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {student.rollNumber || "No roll number"}
                        {student.grade
                          ? ` · ${student.grade}`
                          : ""}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setClassStudentAttendance(
                            student.id,
                            "PRESENT",
                          )
                        }
                        className={`min-w-28 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                          currentStatus === "PRESENT"
                            ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        ✓ Present
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setClassStudentAttendance(
                            student.id,
                            "ABSENT",
                          )
                        }
                        className={`min-w-28 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                          currentStatus === "ABSENT"
                            ? "border-red-300 bg-red-50 text-red-700"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        ✕ Absent
                      </button>
                    </div>
                  </div>
                );
              })}

            {!classAttendanceClass && (
              <div className="p-8 text-center">
                <p className="text-sm font-semibold text-slate-700">
                  Select a class to see students
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  The student roster will appear here.
                </p>
              </div>
            )}

            {classAttendanceClass &&
              attendanceStudents.filter(
                (student) =>
                  student.grade === classAttendanceClass,
              ).length === 0 && (
                <div className="p-8 text-center">
                  <p className="text-sm font-semibold text-slate-700">
                    No students found
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    There are no active students for this class.
                  </p>
                </div>
              )}
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <p className="text-sm font-semibold text-slate-800">
                Manual attendance
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                {Object.values(classAttendanceMarks).filter(
                  (value) => value === "PRESENT",
                ).length}{" "}
                present ·{" "}
                {Object.values(classAttendanceMarks).filter(
                  (value) => value === "ABSENT",
                ).length}{" "}
                absent
              </p>
            </div>

            <button
              type="button"
              disabled={
                !classAttendanceClass ||
                !classAttendancePeriod ||
                !classAttendanceSubject
              }
              onClick={() => {
                alert(
                  "V11 UI preview only. Bulk attendance API will be connected after the class/period data model is finalized.",
                );
              }}
              className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Save Class Attendance
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Mark Student Attendance
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Record attendance for a student for the selected date.
            </p>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-4">
            <div>
              <label
                htmlFor="create-student-id"
                className="mb-1.5 block text-sm font-semibold text-slate-700"
              >
                Student
              </label>
              <select
                id="create-student-id"
                value={createStudentId}
                onChange={(event) => {
                  setCreateStudentId(event.target.value);
                  setCreateError("");
                }}
                disabled={attendanceStudentsLoading}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500 disabled:cursor-not-allowed disabled:bg-slate-50"
              >
                <option value="">
                  {attendanceStudentsLoading
                    ? "Loading students..."
                    : "Select a student"}
                </option>

                {attendanceStudents.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name || student.id}
                    {student.grade
                      ? ` — Grade ${student.grade}`
                      : ""}
                    {student.rollNumber
                      ? ` — Roll ${student.rollNumber}`
                      : ""}
                  </option>
                ))}
              </select>

              {attendanceStudentsError && (
                <p className="mt-1.5 text-xs text-red-600">
                  {attendanceStudentsError}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="create-attendance-status"
                className="mb-1.5 block text-sm font-semibold text-slate-700"
              >
                Status
              </label>
              <select
                id="create-attendance-status"
                value={createStatus}
                onChange={(event) => {
                  setCreateStatus(
                    event.target.value as AttendanceStatus,
                  );
                  setCreateError("");
                }}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500"
              >
                <option value="PRESENT">Present</option>
                <option value="ABSENT">Absent</option>
                <option value="LATE">Late</option>
                <option value="HALF_DAY">Half Day</option>
                <option value="LEAVE">Leave</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="create-attendance-time"
                className="mb-1.5 block text-sm font-semibold text-slate-700"
              >
                Punch time
              </label>
              <input
                id="create-attendance-time"
                type="time"
                value={createPunchTime}
                onChange={(event) =>
                  setCreatePunchTime(event.target.value)
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500"
              />
            </div>

            <div>
              <label
                htmlFor="create-attendance-notes"
                className="mb-1.5 block text-sm font-semibold text-slate-700"
              >
                Notes
              </label>
              <input
                id="create-attendance-notes"
                type="text"
                value={createNotes}
                onChange={(event) =>
                  setCreateNotes(event.target.value)
                }
                placeholder="Optional"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500"
              />
            </div>
          </div>

          {createError && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm font-semibold text-red-800">
                Unable to save attendance
              </p>
              <p className="mt-1 text-sm text-red-700">
                {createError}
              </p>
            </div>
          )}

          <div className="mt-5 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setCreateStudentId("");
                setCreateStatus("PRESENT");
                setCreatePunchTime("");
                setCreateNotes("");
              }}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Clear
            </button>

            <button
              type="button"
              onClick={createStudentAttendance}
              disabled={createSaving || !createStudentId.trim()}
              className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {createSaving ? "Saving..." : "Save Attendance"}
            </button>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">
                  Attendance history
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Attendance records for{" "}
                  {formatDate(date)}.
                </p>
              </div>

              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                {filteredRecords.length}{" "}
                {filteredRecords.length === 1
                  ? "record"
                  : "records"}
              </span>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />

              <p className="mt-4 text-sm font-medium text-slate-600">
                Loading attendance...
              </p>
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-500">
                A
              </div>

              <h3 className="mt-4 text-sm font-semibold text-slate-950">
                No attendance records
              </h3>

              <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
                There are no attendance records matching
                the selected date and filters.
              </p>
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[900px] text-left">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Person
                      </th>

                      <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Role
                      </th>

                      <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Status
                      </th>

                      <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Check-in
                      </th>

                      <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Check-out
                      </th>

                      <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Hours
                      </th>

                      <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Notes
                      </th>
                      <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredRecords.map(
                      (record) => {
                        const config =
                          STATUS_CONFIG[
                            record.status
                          ];

                        return (
                          <tr
                            key={record.id}
                            className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                          >
                            <td className="px-6 py-4">
                              <p className="text-sm font-semibold text-slate-900">
                                {
                                  record.personName
                                }
                              </p>

                              {record.employeeId && (
                                <p className="mt-0.5 text-xs text-slate-500">
                                  {
                                    record.employeeId
                                  }
                                </p>
                              )}
                            </td>

                            <td className="px-6 py-4 text-sm text-slate-600">
                              {record.role}
                            </td>

                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${config.className}`}
                              >
                                {
                                  config.label
                                }
                              </span>
                            </td>

                            <td className="px-6 py-4 text-sm text-slate-600">
                              {formatTime(
                                record.checkIn,
                              )}
                            </td>

                            <td className="px-6 py-4 text-sm text-slate-600">
                              {formatTime(
                                record.checkOut,
                              )}
                            </td>

                            <td className="px-6 py-4 text-sm font-medium text-slate-700">
                              {record.hours ||
                                calculateHours(
                                  record.checkIn,
                                  record.checkOut,
                                )}
                            </td>

                            <td className="max-w-[240px] px-6 py-4 text-sm text-slate-500">
                              {record.notes ||
                                "—"}
                            </td>

                            <td className="px-6 py-4">
                              {record.role === "Student" ? (
                                <div className="flex flex-wrap gap-2">
                                  <Link
                                    href={`/app/students/${encodeURIComponent(record.personId)}`}
                                    className="inline-flex rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                                  >
                                    View
                                  </Link>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      openEdit(record)
                                    }
                                    className="inline-flex rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-700"
                                  >
                                    Edit
                                  </button>

                                  <button
                                    type="button"
                                    onClick={async () => {
                                      const confirmed =
                                        window.confirm(
                                          `Delete attendance for ${record.personName} on ${formatDate(record.date)}?`,
                                        );

                                      if (!confirmed) return;

                                      try {
                                        setError("");

                                        const response =
                                          await fetch(
                                            `/api/students/${encodeURIComponent(record.personId)}/attendance?attendanceId=${encodeURIComponent(record.id)}`,
                                            {
                                              method: "DELETE",
                                              credentials: "include",
                                              cache: "no-store",
                                            },
                                          );

                                        const text =
                                          await response.text();

                                        let data: {
                                          success?: boolean;
                                          error?: string;
                                        } = {};

                                        if (text) {
                                          try {
                                            data =
                                              JSON.parse(text);
                                          } catch {
                                            throw new Error(
                                              "The server returned an invalid response.",
                                            );
                                          }
                                        }

                                        if (!response.ok) {
                                          throw new Error(
                                            data.error ||
                                              "Unable to delete attendance.",
                                          );
                                        }

                                        const refresh =
                                          await fetch(
                                            `/api/attendance?date=${encodeURIComponent(date)}`,
                                            {
                                              credentials:
                                                "include",
                                              cache: "no-store",
                                            },
                                          );

                                        if (!refresh.ok) {
                                          throw new Error(
                                            "Attendance was deleted, but the register could not be refreshed.",
                                          );
                                        }

                                        const refreshed =
                                          await refresh.json();

                                        setRecords(
                                          refreshed.records ??
                                            [],
                                        );
                                        setSummary(
                                          refreshed.summary ?? {
                                            total: 0,
                                            present: 0,
                                            absent: 0,
                                            late: 0,
                                            halfDay: 0,
                                            leave: 0,
                                            attendanceRate: 0,
                                          },
                                        );
                                      } catch (err) {
                                        console.error(
                                          "Delete attendance error:",
                                          err,
                                        );

                                        setError(
                                          err instanceof Error
                                            ? err.message
                                            : "Unable to delete attendance.",
                                        );
                                      }
                                    }}
                                    className="inline-flex rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                                  >
                                    Delete
                                  </button>
                                </div>
                              ) : (
                                <span className="text-xs text-slate-400">
                                  —
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      },
                    )}
                  </tbody>
                </table>
              </div>

              <div className="divide-y divide-slate-100 md:hidden">
                {filteredRecords.map(
                  (record) => {
                    const config =
                      STATUS_CONFIG[
                        record.status
                      ];

                    return (
                      <article
                        key={record.id}
                        className="p-5"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-semibold text-slate-950">
                              {
                                record.personName
                              }
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {record.employeeId ||
                                record.role}
                            </p>
                          </div>

                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${config.className}`}
                          >
                            {
                              config.label
                            }
                          </span>
                        </div>

                        <div className="mt-4 grid grid-cols-3 gap-3">
                          <div className="rounded-xl bg-slate-50 p-3">
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                              Check-in
                            </p>

                            <p className="mt-1 text-sm font-semibold text-slate-800">
                              {formatTime(
                                record.checkIn,
                              )}
                            </p>
                          </div>

                          <div className="rounded-xl bg-slate-50 p-3">
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                              Check-out
                            </p>

                            <p className="mt-1 text-sm font-semibold text-slate-800">
                              {formatTime(
                                record.checkOut,
                              )}
                            </p>
                          </div>

                          <div className="rounded-xl bg-slate-50 p-3">
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                              Hours
                            </p>

                            <p className="mt-1 text-sm font-semibold text-slate-800">
                              {record.hours ||
                                calculateHours(
                                  record.checkIn,
                                  record.checkOut,
                                )}
                            </p>
                          </div>
                        </div>

                        {record.notes && (
                          <p className="mt-4 text-sm text-slate-500">
                            {record.notes}
                          </p>
                        )}

                        {record.role === "Student" && (
                          <Link
                            href={`/app/students/${encodeURIComponent(record.personId)}`}
                            className="mt-4 inline-flex rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            View student
                          </Link>
                        )}
                      </article>
                    );
                  },
                )}
              </div>
            </>
          )}
        </section>

        {editingRecord && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-attendance-title"
          >
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2
                    id="edit-attendance-title"
                    className="text-lg font-semibold text-slate-950"
                  >
                    Edit attendance
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {editingRecord.personName} · {editingRecord.date}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeEdit}
                  className="rounded-lg px-2 py-1 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              <div className="mt-6 grid gap-5">
                <div>
                  <label
                    htmlFor="edit-attendance-status"
                    className="mb-1.5 block text-sm font-semibold text-slate-700"
                  >
                    Status
                  </label>

                  <select
                    id="edit-attendance-status"
                    value={editStatus}
                    onChange={(event) =>
                      setEditStatus(
                        event.target.value as AttendanceStatus,
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                  >
                    <option value="PRESENT">Present</option>
                    <option value="ABSENT">Absent</option>
                    <option value="LATE">Late</option>
                    <option value="HALF_DAY">Half Day</option>
                    <option value="LEAVE">Leave</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="edit-attendance-time"
                    className="mb-1.5 block text-sm font-semibold text-slate-700"
                  >
                    Punch time
                  </label>

                  <input
                    id="edit-attendance-time"
                    type="time"
                    value={editPunchTime.slice(0, 5)}
                    onChange={(event) =>
                      setEditPunchTime(event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="edit-attendance-notes"
                    className="mb-1.5 block text-sm font-semibold text-slate-700"
                  >
                    Notes
                  </label>

                  <textarea
                    id="edit-attendance-notes"
                    value={editNotes}
                    onChange={(event) =>
                      setEditNotes(event.target.value)
                    }
                    rows={3}
                    placeholder="Add an optional note"
                    className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeEdit}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={saveEdit}
                  disabled={editSaving}
                  className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {editSaving
                    ? "Saving..."
                    : "Save changes"}
                </button>
              </div>
            </div>
          </div>
        )}

        <section className="rounded-2xl border border-dashed border-slate-200 bg-white p-5 sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-800">
                Central attendance
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Teacher and student attendance are connected
                to the tenant-aware attendance service.
              </p>
            </div>

            <span className="w-fit rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
              Live
            </span>
          </div>
        </section>
      </div>
    </main>
  );
}
