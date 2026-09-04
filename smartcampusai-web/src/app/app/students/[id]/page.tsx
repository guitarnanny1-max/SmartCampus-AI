"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Student = {
  id: string;
  tenantId: string;
  name: string;
  rollNumber: string | null;
  grade: string | null;
  parentEmail: string | null;
  status: string;
  createdAt: string;
};

type Props = {
  params: Promise<{ id: string }>;
};

type AttendanceRecord = {
  id: string;
  tenantId: string;
  studentId: string;
  studentName: string;
  date: string;
  status: "PRESENT" | "ABSENT" | "LATE" | "HALF_DAY" | "LEAVE";
  punchTime: string | null;
  createdAt: string;
};

type AttendanceSummary = {
  total: number;
  present: number;
  absent: number;
  late: number;
  halfDay: number;
  leave: number;
  attendanceRate: number;
};


type AcademicYear = {
  id: string;
  tenantId: string;
  name: string;
  start_date: string | null;
  end_date: string | null;
  status: string;
};

type ClassRow = {
  id: string;
  tenantId: string;
  academic_year_id: string;
  name: string;
  display_order: number;
  status: string;
};

type SectionRow = {
  id: string;
  tenantId: string;
  class_id: string;
  name: string;
  display_order: number;
  status: string;
};

type StudentEnrollment = {
  id: string;
  tenantId: string;
  student_id: string;
  academic_year_id: string;
  class_id: string;
  section_id: string;
  roll_number: string | null;
  status: string;
  enrolled_at: string | null;
  created_at: string;
  updated_at: string;
};

export default function StudentDetailPage({ params }: Props) {
  const [studentId, setStudentId] = useState("");
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [attendanceSummary, setAttendanceSummary] = useState<AttendanceSummary>({
    total: 0,
    present: 0,
    absent: 0,
    late: 0,
    halfDay: 0,
    leave: 0,
    attendanceRate: 0,
  });
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [attendanceError, setAttendanceError] = useState("");
  const [enrollments, setEnrollments] = useState<StudentEnrollment[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [sections, setSections] = useState<SectionRow[]>([]);
  const [enrollmentLoading, setEnrollmentLoading] = useState(false);
  const [enrollmentSaving, setEnrollmentSaving] = useState(false);
  const [enrollmentError, setEnrollmentError] = useState("");
  const [showEnrollmentForm, setShowEnrollmentForm] = useState(false);
  const [selectedAcademicYearId, setSelectedAcademicYearId] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [enrollmentRollNumber, setEnrollmentRollNumber] = useState("");
  const [enrollmentDate, setEnrollmentDate] = useState("");
  const [enrollmentStatus, setEnrollmentStatus] = useState("ACTIVE");

  async function loadEnrollmentData(id: string) {
    try {
      setEnrollmentLoading(true);
      setEnrollmentError("");

      const [
        enrollmentResponse,
        academicYearsResponse,
      ] = await Promise.all([
        fetch(
          `/api/student-enrollments?student_id=${encodeURIComponent(id)}`,
          {
            credentials: "include",
            cache: "no-store",
          },
        ),
        fetch("/api/academic-years", {
          credentials: "include",
          cache: "no-store",
        }),
      ]);

      const enrollmentData = await enrollmentResponse.json();
      const academicYearsData = await academicYearsResponse.json();

      if (!enrollmentResponse.ok) {
        throw new Error(
          enrollmentData?.error ||
            "Unable to load student enrollment.",
        );
      }

      if (!academicYearsResponse.ok) {
        throw new Error(
          academicYearsData?.error ||
            "Unable to load academic years.",
        );
      }

      const loadedEnrollments =
        enrollmentData.enrollments ?? [];

      setEnrollments(loadedEnrollments);
      setAcademicYears(
        academicYearsData.academicYears ?? [],
      );

      const activeEnrollment =
        loadedEnrollments.find(
          (item: StudentEnrollment) =>
            item.status === "ACTIVE",
        ) ?? loadedEnrollments[0];

      if (activeEnrollment) {
        setSelectedAcademicYearId(
          activeEnrollment.academic_year_id,
        );
        setSelectedClassId(activeEnrollment.class_id);
        setSelectedSectionId(
          activeEnrollment.section_id,
        );
        setEnrollmentRollNumber(
          activeEnrollment.roll_number ?? "",
        );
        setEnrollmentDate(
          activeEnrollment.enrolled_at ?? "",
        );
        setEnrollmentStatus(
          activeEnrollment.status || "ACTIVE",
        );

        const [
          classesResponse,
          sectionsResponse,
        ] = await Promise.all([
          fetch(
            `/api/classes?academic_year_id=${encodeURIComponent(
              activeEnrollment.academic_year_id,
            )}`,
            {
              credentials: "include",
              cache: "no-store",
            },
          ),
          fetch(
            `/api/sections?class_id=${encodeURIComponent(
              activeEnrollment.class_id,
            )}`,
            {
              credentials: "include",
              cache: "no-store",
            },
          ),
        ]);

        const classesData = await classesResponse.json();
        const sectionsData = await sectionsResponse.json();

        if (classesResponse.ok) {
          setClasses(classesData.classes ?? []);
        }

        if (sectionsResponse.ok) {
          setSections(sectionsData.sections ?? []);
        }
      }
    } catch (err) {
      console.error(
        "Student enrollment loading error:",
        err,
      );
      setEnrollmentError(
        err instanceof Error
          ? err.message
          : "Unable to load enrollment.",
      );
    } finally {
      setEnrollmentLoading(false);
    }
  }

  async function handleAcademicYearChange(
    academicYearId: string,
  ) {
    setSelectedAcademicYearId(academicYearId);
    setSelectedClassId("");
    setSelectedSectionId("");
    setClasses([]);
    setSections([]);

    if (!academicYearId) {
      return;
    }

    try {
      const response = await fetch(
        `/api/classes?academic_year_id=${encodeURIComponent(
          academicYearId,
        )}`,
        {
          credentials: "include",
          cache: "no-store",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to load classes.",
        );
      }

      setClasses(data.classes ?? []);
    } catch (err) {
      setEnrollmentError(
        err instanceof Error
          ? err.message
          : "Unable to load classes.",
      );
    }
  }

  async function handleClassChange(classId: string) {
    setSelectedClassId(classId);
    setSelectedSectionId("");
    setSections([]);

    if (!classId) {
      return;
    }

    try {
      const response = await fetch(
        `/api/sections?class_id=${encodeURIComponent(
          classId,
        )}`,
        {
          credentials: "include",
          cache: "no-store",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to load sections.",
        );
      }

      setSections(data.sections ?? []);
    } catch (err) {
      setEnrollmentError(
        err instanceof Error
          ? err.message
          : "Unable to load sections.",
      );
    }
  }

  async function saveEnrollment() {
    if (
      !studentId ||
      !selectedAcademicYearId ||
      !selectedClassId ||
      !selectedSectionId
    ) {
      setEnrollmentError(
        "Academic year, class and section are required.",
      );
      return;
    }

    try {
      setEnrollmentSaving(true);
      setEnrollmentError("");

      const response = await fetch(
        "/api/student-enrollments",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            student_id: studentId,
            academic_year_id:
              selectedAcademicYearId,
            class_id: selectedClassId,
            section_id: selectedSectionId,
            roll_number:
              enrollmentRollNumber.trim() || null,
            status: enrollmentStatus,
            enrolled_at:
              enrollmentDate || null,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Unable to save student enrollment.",
        );
      }

      setShowEnrollmentForm(false);
      await loadEnrollmentData(studentId);
    } catch (err) {
      console.error(
        "Student enrollment save error:",
        err,
      );
      setEnrollmentError(
        err instanceof Error
          ? err.message
          : "Unable to save enrollment.",
      );
    } finally {
      setEnrollmentSaving(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function loadStudent() {
      try {
        const { id } = await params;

        if (!id) {
          throw new Error("Student ID is missing.");
        }

        if (!cancelled) {
          setStudentId(id);
        }

        const response = await fetch(
          `/api/students/${encodeURIComponent(id)}`,
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          },
        );

        const text = await response.text();

        let data: {
          student?: Student;
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
            data.error || "Unable to load student.",
          );
        }

        if (!data.student) {
          throw new Error("Student record was not returned.");
        }

        if (!cancelled) {
          setStudent(data.student);
        }

        await loadEnrollmentData(id);

        if (!cancelled) {
          setAttendanceLoading(true);
          setAttendanceError("");
        }

        try {
          const attendanceResponse = await fetch(
            `/api/students/${encodeURIComponent(id)}/attendance`,
            {
              method: "GET",
              credentials: "include",
              cache: "no-store",
            },
          );

          const attendanceData = await attendanceResponse.json();

          if (!attendanceResponse.ok) {
            throw new Error(
              attendanceData.error ||
                "Unable to load student attendance.",
            );
          }

          if (!cancelled) {
            setAttendanceRecords(attendanceData.records ?? []);
            setAttendanceSummary(
              attendanceData.summary ?? {
                total: 0,
                present: 0,
                absent: 0,
                late: 0,
                halfDay: 0,
                leave: 0,
                attendanceRate: 0,
              },
            );
          }
        } catch (attendanceErr) {
          console.error(
            "Student attendance loading error:",
            attendanceErr,
          );

          if (!cancelled) {
            setAttendanceError(
              attendanceErr instanceof Error
                ? attendanceErr.message
                : "Unable to load student attendance.",
            );
          }
        } finally {
          if (!cancelled) {
            setAttendanceLoading(false);
          }
        }
      } catch (err) {
        console.error("Student detail loading error:", err);

        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load student.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadStudent();

    return () => {
      cancelled = true;
    };
  }, [params]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F8FAFC]">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <p className="text-sm text-[#64748B]">
            Loading student profile...
          </p>
        </div>
      </main>
    );
  }

  if (error || !student) {
    return (
      <main className="min-h-screen bg-[#F8FAFC]">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <Link
            href="/app/students"
            className="text-sm font-medium text-[#2563EB] hover:underline"
          >
            ← Back to students
          </Link>

          <section className="mt-6 rounded-2xl border border-red-200 bg-white p-8 shadow-sm">
            <h1 className="text-xl font-semibold text-[#0F172A]">
              Unable to load student
            </h1>

            <p className="mt-2 text-sm text-red-600">
              {error || "Student record not found."}
            </p>

            <p className="mt-2 text-xs text-[#64748B]">
              Student ID: {studentId || "unknown"}
            </p>
          </section>
        </div>
      </main>
    );
  }

  const currentEnrollment =
    enrollments.find(
      (item) => item.status === "ACTIVE",
    ) ?? enrollments[0];

  const enrolledClass = currentEnrollment
    ? classes.find(
        (item) =>
          item.id === currentEnrollment.class_id,
      )
    : undefined;

  const enrolledSection = currentEnrollment
    ? sections.find(
        (item) =>
          item.id === currentEnrollment.section_id,
      )
    : undefined;

  const enrolledAcademicYear = currentEnrollment
    ? academicYears.find(
        (item) =>
          item.id ===
          currentEnrollment.academic_year_id,
      )
    : undefined;

  const displayRollNumber =
    currentEnrollment?.roll_number ||
    student.rollNumber ||
    "—";

  const displayClass =
    enrolledClass?.name ||
    student.grade ||
    "—";

  const displaySection =
    enrolledSection?.name ||
    "—";

  const displayAcademicYear =
    enrolledAcademicYear?.name ||
    "—";

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <Link
          href="/app/students"
          className="text-sm font-medium text-[#2563EB] hover:underline"
        >
          ← Back to students
        </Link>

        <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-medium text-[#64748B]">
              Student 360°
            </p>

            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#0F172A]">
              {student.name}
            </h1>

            <p className="mt-2 text-sm text-[#64748B]">
              Complete student profile, enrollment and academic
              workspace.
            </p>
          </div>

          <span className="inline-flex w-fit rounded-full bg-[#DCFCE7] px-4 py-2 text-xs font-semibold text-[#166534]">
            {student.status}
          </span>
        </div>

        <section className="mt-8 grid gap-5 md:grid-cols-4">
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-[#64748B]">
              Roll number
            </p>
            <p className="mt-2 text-lg font-semibold text-[#0F172A]">
              {displayRollNumber}
            </p>
          </div>

          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-[#64748B]">
              Grade / Class
            </p>
            <p className="mt-2 text-lg font-semibold text-[#0F172A]">
              {displayClass}
            </p>
          </div>

          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-[#64748B]">
              Parent email
            </p>
            <p className="mt-2 break-all text-sm font-semibold text-[#0F172A]">
              {student.parentEmail || "—"}
            </p>
          </div>

          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-[#64748B]">
              Enrollment
            </p>
            <p className="mt-2 text-lg font-semibold text-[#0F172A]">
              Active record
            </p>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
          <div className="border-b border-[#E2E8F0] px-6 py-5">
            <h2 className="text-lg font-semibold text-[#0F172A]">
              Student profile
            </h2>
            <p className="mt-1 text-sm text-[#64748B]">
              Core identity and enrollment information.
            </p>
          </div>

          <div className="grid gap-6 p-6 md:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#64748B]">
                Student ID
              </p>
              <p className="mt-2 break-all text-sm font-medium text-[#0F172A]">
                {student.id}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#64748B]">
                Tenant
              </p>
              <p className="mt-2 break-all text-sm font-medium text-[#0F172A]">
                {student.tenantId}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#64748B]">
                Student name
              </p>
              <p className="mt-2 text-sm font-medium text-[#0F172A]">
                {student.name}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#64748B]">
                Created
              </p>
              <p className="mt-2 text-sm font-medium text-[#0F172A]">
                {student.createdAt
                  ? new Date(student.createdAt).toLocaleString(
                      "en-IN",
                    )
                  : "—"}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-[#0F172A]">
                  Attendance
                </p>
                <p className="mt-1 text-sm text-[#64748B]">
                  Attendance history and daily status.
                </p>
              </div>

              <div className="text-right">
                <p className="text-2xl font-bold text-[#0F172A]">
                  {attendanceSummary.attendanceRate}%
                </p>
                <p className="text-xs text-[#64748B]">
                  attendance rate
                </p>
              </div>
            </div>

            {attendanceLoading ? (
              <p className="mt-5 text-sm text-[#64748B]">
                Loading attendance...
              </p>
            ) : attendanceError ? (
              <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">
                {attendanceError}
              </p>
            ) : (
              <>
                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-[#64748B]">Present</p>
                    <p className="mt-1 text-lg font-bold text-[#0F172A]">
                      {attendanceSummary.present}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-[#64748B]">Absent</p>
                    <p className="mt-1 text-lg font-bold text-[#0F172A]">
                      {attendanceSummary.absent}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-[#64748B]">Late</p>
                    <p className="mt-1 text-lg font-bold text-[#0F172A]">
                      {attendanceSummary.late}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-[#64748B]">Leave</p>
                    <p className="mt-1 text-lg font-bold text-[#0F172A]">
                      {attendanceSummary.leave}
                    </p>
                  </div>
                </div>

                <div className="mt-5 border-t border-[#E2E8F0] pt-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-[#0F172A]">
                      Recent attendance
                    </p>
                    <p className="text-xs text-[#64748B]">
                      {attendanceSummary.total} record
                      {attendanceSummary.total === 1 ? "" : "s"}
                    </p>
                  </div>

                  {attendanceRecords.length === 0 ? (
                    <p className="mt-3 text-sm text-[#64748B]">
                      No attendance records yet.
                    </p>
                  ) : (
                    <div className="mt-3 space-y-2">
                      {attendanceRecords.slice(0, 5).map((record) => (
                        <div
                          key={record.id}
                          className="flex items-center justify-between gap-3 rounded-xl border border-[#E2E8F0] px-3 py-3"
                        >
                          <div>
                            <p className="text-sm font-medium text-[#0F172A]">
                              {record.date}
                            </p>
                            <p className="mt-1 text-xs text-[#64748B]">
                              {record.punchTime
                                ? `Punch: ${record.punchTime}`
                                : "No punch time"}
                            </p>
                          </div>

                          <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-[#334155]">
                            {record.status.replace("_", " ")}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm md:col-span-2">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-[#0F172A]">
                  Academic Enrollment
                </p>
                <p className="mt-2 text-sm text-[#64748B]">
                  Academic year, class, section and enrollment details.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowEnrollmentForm((value) => !value)}
                className="rounded-xl bg-[#0F172A] px-4 py-2 text-sm font-semibold text-white hover:bg-black"
              >
                {showEnrollmentForm
                  ? "Cancel"
                  : enrollments.length
                    ? "Change Enrollment"
                    : "Add Enrollment"}
              </button>
            </div>

            {enrollmentError && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {enrollmentError}
              </div>
            )}

            {enrollmentLoading ? (
              <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                Loading enrollment...
              </div>
            ) : enrollments.length > 0 ? (
              <div className="mt-5 space-y-3">
                {enrollments.map((enrollment) => {
                  const year =
                    academicYears.find(
                      (item) =>
                        item.id ===
                        enrollment.academic_year_id,
                    );

                  const classRow =
                    classes.find(
                      (item) =>
                        item.id ===
                        enrollment.class_id,
                    );

                  const section =
                    sections.find(
                      (item) =>
                        item.id ===
                        enrollment.section_id,
                    );

                  return (
                    <div
                      key={enrollment.id}
                      className="rounded-xl border border-[#E2E8F0] bg-slate-50 p-4"
                    >
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Academic Year
                          </p>
                          <p className="mt-1 font-semibold text-slate-900">
                            {year?.name ||
                              enrollment.academic_year_id}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Class
                          </p>
                          <p className="mt-1 font-semibold text-slate-900">
                            {classRow?.name ||
                              enrollment.class_id}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Section
                          </p>
                          <p className="mt-1 font-semibold text-slate-900">
                            {section?.name ||
                              enrollment.section_id}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Roll Number
                          </p>
                          <p className="mt-1 font-semibold text-slate-900">
                            {enrollment.roll_number || "—"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span className="rounded-full bg-white px-3 py-1 font-semibold text-slate-700">
                          {enrollment.status}
                        </span>

                        {enrollment.enrolled_at && (
                          <span>
                            Enrolled{" "}
                            {enrollment.enrolled_at}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="mt-5 rounded-xl border border-dashed border-slate-300 p-5 text-sm text-slate-500">
                This student has no academic enrollment yet.
              </div>
            )}

            {showEnrollmentForm && (
              <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Academic Year
                    </span>
                    <select
                      value={selectedAcademicYearId}
                      onChange={(event) =>
                        handleAcademicYearChange(
                          event.target.value,
                        )
                      }
                      className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 text-sm outline-none focus:border-slate-500"
                    >
                      <option value="">
                        Select academic year
                      </option>
                      {academicYears.map((year) => (
                        <option
                          key={year.id}
                          value={year.id}
                        >
                          {year.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Class
                    </span>
                    <select
                      value={selectedClassId}
                      onChange={(event) =>
                        handleClassChange(
                          event.target.value,
                        )
                      }
                      disabled={!selectedAcademicYearId}
                      className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 text-sm outline-none disabled:bg-slate-100 focus:border-slate-500"
                    >
                      <option value="">
                        Select class
                      </option>
                      {classes.map((item) => (
                        <option
                          key={item.id}
                          value={item.id}
                        >
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Section
                    </span>
                    <select
                      value={selectedSectionId}
                      onChange={(event) =>
                        setSelectedSectionId(
                          event.target.value,
                        )
                      }
                      disabled={!selectedClassId}
                      className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 text-sm outline-none disabled:bg-slate-100 focus:border-slate-500"
                    >
                      <option value="">
                        Select section
                      </option>
                      {sections.map((item) => (
                        <option
                          key={item.id}
                          value={item.id}
                        >
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Roll Number
                    </span>
                    <input
                      value={enrollmentRollNumber}
                      onChange={(event) =>
                        setEnrollmentRollNumber(
                          event.target.value,
                        )
                      }
                      placeholder="ADM001"
                      className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 text-sm outline-none focus:border-slate-500"
                    />
                  </label>

                  <label className="block">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Enrollment Date
                    </span>
                    <input
                      type="date"
                      value={enrollmentDate}
                      onChange={(event) =>
                        setEnrollmentDate(
                          event.target.value,
                        )
                      }
                      className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 text-sm outline-none focus:border-slate-500"
                    />
                  </label>

                  <label className="block">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </span>
                    <select
                      value={enrollmentStatus}
                      onChange={(event) =>
                        setEnrollmentStatus(
                          event.target.value,
                        )
                      }
                      className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 text-sm outline-none focus:border-slate-500"
                    >
                      <option value="ACTIVE">
                        ACTIVE
                      </option>
                      <option value="INACTIVE">
                        INACTIVE
                      </option>
                      <option value="COMPLETED">
                        COMPLETED
                      </option>
                    </select>
                  </label>
                </div>

                <div className="mt-5 flex justify-end">
                  <button
                    type="button"
                    onClick={saveEnrollment}
                    disabled={enrollmentSaving}
                    className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {enrollmentSaving
                      ? "Saving..."
                      : "Save Enrollment"}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-[#0F172A]">
              Fees
            </p>
            <p className="mt-2 text-sm text-[#64748B]">
              Student fee and payment information.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
