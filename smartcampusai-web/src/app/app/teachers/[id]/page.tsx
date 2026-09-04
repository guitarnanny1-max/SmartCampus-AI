"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type Teacher = {
  id: string;
  salutation?: string;
  employee_id?: string;
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

type Assignment = {
  id: string;
  teacher_id: string;
  subject_name: string;
  class_name?: string | null;
  section_name?: string | null;
  academic_year?: string | null;
  periods_per_week?: number | null;
  assignment_type?: string | null;
  status?: string | null;
  created_at?: string;
};

type AcademicYearOption = {
  id: string;
  name: string;
  status?: string | null;
};

type ClassOption = {
  id: string;
  name: string;
  academic_year_id: string;
  status?: string | null;
};

type SectionOption = {
  id: string;
  name: string;
  class_id: string;
  status?: string | null;
};

type SectionSubjectOption = {
  id: string;
  subject_id: string;
  status?: string | null;
  subjects?: {
    id: string;
    name: string;
    code?: string | null;
    status?: string | null;
  } | null;
};

type TeacherAttendance = {
  id: string;
  teacher_id: string;
  attendance_date: string;
  status: "PRESENT" | "ABSENT" | "LATE" | "HALF_DAY" | "LEAVE";
  check_in_time?: string | null;
  check_out_time?: string | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
};

type AttendanceStatus = TeacherAttendance["status"];

function teacherName(teacher: Teacher) {
  const firstLast = [teacher.first_name, teacher.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();

  const base = firstLast || teacher.name?.trim() || "Unnamed Teacher";
  const salutation = teacher.salutation?.trim();

  if (!salutation) return base;

  if (
    base.toLowerCase() === salutation.toLowerCase() ||
    base.toLowerCase().startsWith(`${salutation.toLowerCase()} `)
  ) {
    return base;
  }

  return `${salutation} ${base}`;
}

function activeTeacher(status: Teacher["status"]) {
  if (typeof status === "boolean") return status;
  return !status || String(status).toUpperCase() === "ACTIVE";
}

type TeacherActivity = {
  id: string;
  teacher_id: string;
  action: string;
  description: string;
  metadata?: Record<string, unknown> | null;
  created_at: string;
};

export default function TeacherProfilePage() {
  const params = useParams();
  const id = String(params?.id ?? "");

  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingProfile, setEditingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [activities, setActivities] = useState<TeacherActivity[]>([]);
  const [attendance, setAttendance] = useState<TeacherAttendance[]>([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [attendanceError, setAttendanceError] = useState("");


  const [profileForm, setProfileForm] = useState({
    salutation: "",
    first_name: "",
    last_name: "",
    employee_id: "",
    email: "",
    phone: "",
    gender: "",
    designation: "",
    department: "",
    status: "ACTIVE",
  });

  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [editingAssignmentId, setEditingAssignmentId] = useState<string | null>(
    null
  );

  const [savingAssignment, setSavingAssignment] = useState(false);
  const [assignmentError, setAssignmentError] = useState("");

  const [academicYears, setAcademicYears] = useState<AcademicYearOption[]>([]);
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [sections, setSections] = useState<SectionOption[]>([]);
  const [sectionSubjects, setSectionSubjects] = useState<SectionSubjectOption[]>([]);
  const [assignmentOptionsLoading, setAssignmentOptionsLoading] = useState({
    academicYears: false,
    classes: false,
    sections: false,
    subjects: false,
  });


  const [assignmentForm, setAssignmentForm] = useState({
    subject_name: "",
    class_name: "",
    section_name: "",
    academic_year: "",
    periods_per_week: "0",
    assignment_type: "PRIMARY",
  });

  async function loadAssignmentAcademicYears() {
    try {
      setAssignmentOptionsLoading((current) => ({
        ...current,
        academicYears: true,
      }));

      const response = await fetch("/api/academic-years", {
        credentials: "include",
        cache: "no-store",
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || "Unable to load academic years.");
      }

      const years = (data?.academicYears ?? []).filter(
        (year: AcademicYearOption) =>
          !year.status || String(year.status).toUpperCase() === "ACTIVE",
      );

      setAcademicYears(years);

      if (!assignmentForm.academic_year && years.length > 0) {
        setAssignmentForm((current) => ({
          ...current,
          academic_year: years[0].name,
        }));
      }
    } catch (err) {
      console.error("Teacher assignment academic years error:", err);
      setAssignmentError(
        err instanceof Error
          ? err.message
          : "Unable to load academic years.",
      );
    } finally {
      setAssignmentOptionsLoading((current) => ({
        ...current,
        academicYears: false,
      }));
    }
  }

  async function loadAssignmentClasses(yearName: string) {
    const year = academicYears.find((item) => item.name === yearName);

    if (!year) {
      setClasses([]);
      setSections([]);
      setSectionSubjects([]);
      return;
    }

    try {
      setAssignmentOptionsLoading((current) => ({
        ...current,
        classes: true,
      }));

      const response = await fetch(
        `/api/classes?academic_year_id=${encodeURIComponent(year.id)}`,
        {
          credentials: "include",
          cache: "no-store",
        },
      );
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || "Unable to load classes.");
      }

      setClasses(
        (data?.classes ?? []).filter(
          (item: ClassOption) =>
            !item.status || String(item.status).toUpperCase() === "ACTIVE",
        ),
      );
    } catch (err) {
      console.error("Teacher assignment classes error:", err);
      setClasses([]);
      setAssignmentError(
        err instanceof Error ? err.message : "Unable to load classes.",
      );
    } finally {
      setAssignmentOptionsLoading((current) => ({
        ...current,
        classes: false,
      }));
    }
  }

  async function loadAssignmentSections(className: string) {
    const classRecord = classes.find((item) => item.name === className);

    if (!classRecord) {
      setSections([]);
      setSectionSubjects([]);
      return;
    }

    try {
      setAssignmentOptionsLoading((current) => ({
        ...current,
        sections: true,
      }));

      const response = await fetch(
        `/api/sections?class_id=${encodeURIComponent(classRecord.id)}`,
        {
          credentials: "include",
          cache: "no-store",
        },
      );
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || "Unable to load sections.");
      }

      setSections(
        (data?.sections ?? []).filter(
          (item: SectionOption) =>
            !item.status || String(item.status).toUpperCase() === "ACTIVE",
        ),
      );
    } catch (err) {
      console.error("Teacher assignment sections error:", err);
      setSections([]);
      setAssignmentError(
        err instanceof Error ? err.message : "Unable to load sections.",
      );
    } finally {
      setAssignmentOptionsLoading((current) => ({
        ...current,
        sections: false,
      }));
    }
  }

  async function loadAssignmentSubjects(sectionName: string) {
    const section = sections.find((item) => item.name === sectionName);

    if (!section) {
      setSectionSubjects([]);
      return;
    }

    try {
      setAssignmentOptionsLoading((current) => ({
        ...current,
        subjects: true,
      }));

      const response = await fetch(
        `/api/section-subjects?section_id=${encodeURIComponent(section.id)}`,
        {
          credentials: "include",
          cache: "no-store",
        },
      );
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || "Unable to load section subjects.");
      }

      setSectionSubjects(
        (data?.sectionSubjects ?? []).filter(
          (item: SectionSubjectOption) =>
            item.status === "ACTIVE" &&
            item.subjects &&
            (!item.subjects.status ||
              String(item.subjects.status).toUpperCase() === "ACTIVE"),
        ),
      );
    } catch (err) {
      console.error("Teacher assignment subjects error:", err);
      setSectionSubjects([]);
      setAssignmentError(
        err instanceof Error
          ? err.message
          : "Unable to load section subjects.",
      );
    } finally {
      setAssignmentOptionsLoading((current) => ({
        ...current,
        subjects: false,
      }));
    }
  }

  useEffect(() => {
    if (!showAssignmentForm) return;
    void loadAssignmentAcademicYears();
  }, [showAssignmentForm]);

  useEffect(() => {
    if (!showAssignmentForm || !assignmentForm.academic_year) return;
    void loadAssignmentClasses(assignmentForm.academic_year);
  }, [showAssignmentForm, assignmentForm.academic_year, academicYears.length]);

  useEffect(() => {
    if (!showAssignmentForm || !assignmentForm.class_name) return;
    void loadAssignmentSections(assignmentForm.class_name);
  }, [showAssignmentForm, assignmentForm.class_name, classes.length]);

  useEffect(() => {
    if (!showAssignmentForm || !assignmentForm.section_name) return;
    void loadAssignmentSubjects(assignmentForm.section_name);
  }, [showAssignmentForm, assignmentForm.section_name, sections.length]);

  async function toggleTeacherStatus() {
    if (!teacher) return;

    const nextStatus =
      activeTeacher(teacher.status) ? "INACTIVE" : "ACTIVE";

    const confirmed = window.confirm(
      nextStatus === "ACTIVE"
        ? "Activate this teacher?"
        : "Deactivate this teacher?"
    );

    if (!confirmed) return;

    try {
      setError("");

      const response = await fetch(
        `/api/teachers/${encodeURIComponent(id)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            status: nextStatus,
          }),
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to update teacher status."
        );
      }

      setTeacher(data.teacher ?? null);
      await loadActivity();
    } catch (err) {
      console.error("Teacher status update error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update teacher status."
      );
    }
  }

  async function deleteTeacher() {
    if (!teacher) return;

    const confirmed = window.confirm(
      `Delete ${teacherName(teacher)}? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setError("");

      const response = await fetch(
        `/api/teachers/${encodeURIComponent(id)}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to delete teacher."
        );
      }

      window.location.href = "/app/teachers";
    } catch (err) {
      console.error("Teacher delete error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete teacher."
      );
    }
  }

  function startEditProfile() {
    if (!teacher) return;

    setProfileError("");
    setProfileForm({
      salutation: teacher.salutation || "",
      first_name: teacher.first_name || "",
      last_name: teacher.last_name || "",
      employee_id: teacher.employee_id || "",
      email: teacher.email || "",
      phone: teacher.phone || "",
      gender: teacher.gender || "",
      designation: teacher.designation || "",
      department: teacher.department || "",
      status:
        typeof teacher.status === "string"
          ? teacher.status
          : teacher.status
            ? "ACTIVE"
            : "INACTIVE",
    });
    setEditingProfile(true);
  }

  async function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!id) {
      setProfileError("Teacher ID is missing.");
      return;
    }

    if (!profileForm.first_name.trim()) {
      setProfileError("First name is required.");
      return;
    }

    try {
      setSavingProfile(true);
      setProfileError("");

      const response = await fetch(
        `/api/teachers/${encodeURIComponent(id)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(profileForm),
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to update teacher profile."
        );
      }

      setTeacher(data.teacher);
      setEditingProfile(false);
      setProfileError("");
      await loadActivity();
    } catch (err) {
      console.error("Save teacher profile error:", err);
      setProfileError(
        err instanceof Error
          ? err.message
          : "Unable to update teacher profile."
      );
    } finally {
      setSavingProfile(false);
    }
  }

  async function loadActivity() {
    if (!id) return;

    try {
      const response = await fetch(
        `/api/teachers/${encodeURIComponent(id)}/activity`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to load teacher activity."
        );
      }

      setActivities(
        Array.isArray(data?.activities)
          ? data.activities
          : []
      );
    } catch (err) {
      console.error("Teacher activity load error:", err);
      setActivities([]);
    }
  }

  async function loadProfile() {
    try {
      setLoading(true);
      setError("");

      const [
        teacherResponse,
        assignmentsResponse,
        attendanceResponse,
      ] = await Promise.all([
        fetch(`/api/teachers/${encodeURIComponent(id)}`, {
          credentials: "include",
          cache: "no-store",
        }),
        fetch(
          `/api/teachers/assignments?teacher_id=${encodeURIComponent(id)}`,
          {
            credentials: "include",
            cache: "no-store",
          }
        ),
        fetch(
          `/api/teachers/${encodeURIComponent(id)}/attendance`,
          {
            credentials: "include",
            cache: "no-store",
          }
        ),
      ]);

      const teacherData = await teacherResponse.json();
      const assignmentsData = await assignmentsResponse.json();
      const attendanceData = await attendanceResponse.json();

      if (!teacherResponse.ok) {
        throw new Error(
          teacherData?.error || "Unable to load teacher profile."
        );
      }

      if (!assignmentsResponse.ok) {
        throw new Error(
          assignmentsData?.error || "Unable to load teaching assignments."
        );
      }

      setTeacher(teacherData?.teacher ?? null);
      setAssignments(
        Array.isArray(assignmentsData?.assignments)
          ? assignmentsData.assignments
          : []
      );

      if (!attendanceResponse.ok) {
        setAttendance([]);
        setAttendanceError(
          attendanceData?.error || "Unable to load teacher attendance."
        );
      } else {
        setAttendance(
          Array.isArray(attendanceData?.attendance)
            ? attendanceData.attendance
            : []
        );
        setAttendanceError("");
      }
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load teacher profile."
      );
    } finally {
      setLoading(false);
    }
  }

  async function saveAttendance(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!id) return;

    const form = event.currentTarget;
    const formData = new FormData(form);

    const attendanceDate = String(
      formData.get("attendance_date") ?? "",
    ).trim();

    const status = String(
      formData.get("status") ?? "PRESENT",
    )
      .trim()
      .toUpperCase();

    const checkInTime =
      String(formData.get("check_in_time") ?? "").trim() || null;

    const checkOutTime =
      String(formData.get("check_out_time") ?? "").trim() || null;

    const notes =
      String(formData.get("notes") ?? "").trim() || null;

    if (!attendanceDate) {
      setAttendanceError("Attendance date is required.");
      return;
    }

    if (
      ![
        "PRESENT",
        "ABSENT",
        "LATE",
        "HALF_DAY",
        "LEAVE",
      ].includes(status)
    ) {
      setAttendanceError("Invalid attendance status.");
      return;
    }

    try {
      setAttendanceLoading(true);
      setAttendanceError("");

      const response = await fetch(
        `/api/teachers/${encodeURIComponent(id)}/attendance`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            attendance_date: attendanceDate,
            status,
            check_in_time: checkInTime,
            check_out_time: checkOutTime,
            notes,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to mark teacher attendance.",
        );
      }

      setAttendance((current) => [
        data.attendance,
        ...current,
      ]);

      form.reset();

      const dateInput = form.elements.namedItem(
        "attendance_date",
      ) as HTMLInputElement | null;

      if (dateInput) {
        dateInput.value = new Date()
          .toISOString()
          .slice(0, 10);
      }

      await loadActivity();
    } catch (err) {
      console.error("Teacher attendance save error:", err);
      setAttendanceError(
        err instanceof Error
          ? err.message
          : "Unable to mark teacher attendance.",
      );
    } finally {
      setAttendanceLoading(false);
    }
  }

  async function deleteAttendance(attendanceId: string) {
    if (!id || !attendanceId) return;

    const confirmed = window.confirm(
      "Delete this attendance record?",
    );

    if (!confirmed) return;

    try {
      setAttendanceLoading(true);
      setAttendanceError("");

      const response = await fetch(
        `/api/teachers/${encodeURIComponent(id)}/attendance?id=${encodeURIComponent(attendanceId)}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Unable to delete attendance record.",
        );
      }

      setAttendance((current) =>
        current.filter((item) => item.id !== attendanceId),
      );

      await loadActivity();
    } catch (err) {
      console.error(
        "Teacher attendance delete error:",
        err,
      );

      setAttendanceError(
        err instanceof Error
          ? err.message
          : "Unable to delete attendance record.",
      );
    } finally {
      setAttendanceLoading(false);
    }
  }

  async function updateAssignment(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!editingAssignmentId) {
      setAssignmentError("Assignment ID is missing.");
      return;
    }

    const subjectName = assignmentForm.subject_name.trim();

    if (!subjectName) {
      setAssignmentError("Subject name is required.");
      return;
    }

    const periods = Number(assignmentForm.periods_per_week);

    if (!Number.isInteger(periods) || periods < 0) {
      setAssignmentError("Periods per week must be a valid number.");
      return;
    }

    try {
      setSavingAssignment(true);
      setAssignmentError("");

      const response = await fetch(
        `/api/teachers/assignments?id=${encodeURIComponent(
          editingAssignmentId
        )}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            id: editingAssignmentId,
            subject_name: subjectName,
            class_name: assignmentForm.class_name.trim() || null,
            section_name: assignmentForm.section_name.trim() || null,
            academic_year: assignmentForm.academic_year.trim() || null,
            periods_per_week: periods,
            assignment_type:
              assignmentForm.assignment_type.trim().toUpperCase() || "PRIMARY",
            status: "ACTIVE",
          }),
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to update teaching assignment."
        );
      }

      setAssignments((current) =>
        current.map((assignment) =>
          assignment.id === editingAssignmentId
            ? data.assignment
            : assignment
        )
      );

      setEditingAssignmentId(null);
      setShowAssignmentForm(false);
      setAssignmentError("");
      await loadActivity();
    } catch (err) {
      console.error("Update assignment error:", err);

      setAssignmentError(
        err instanceof Error
          ? err.message
          : "Unable to update teaching assignment."
      );
    } finally {
      setSavingAssignment(false);
    }
  }

  async function saveAssignment(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!id) {
      setAssignmentError("Teacher ID is missing.");
      return;
    }

    const subjectName = assignmentForm.subject_name.trim();

    if (!subjectName) {
      setAssignmentError("Subject name is required.");
      return;
    }

    const periods = Number(assignmentForm.periods_per_week);

    if (!Number.isInteger(periods) || periods < 0) {
      setAssignmentError("Periods per week must be a valid number.");
      return;
    }

    try {
      setSavingAssignment(true);
      setAssignmentError("");

      const payload = {
        teacher_id: id,
        subject_name: subjectName,
        class_name: assignmentForm.class_name.trim() || null,
        section_name: assignmentForm.section_name.trim() || null,
        academic_year: assignmentForm.academic_year.trim() || null,
        periods_per_week: periods,
        assignment_type:
          assignmentForm.assignment_type.trim().toUpperCase() || "PRIMARY",
        status: "ACTIVE",
      };

      console.log("Saving teacher assignment:", payload);

      const response = await fetch("/api/teachers/assignments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);

      console.log("Teacher assignment response:", response.status, data);

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to save teaching assignment."
        );
      }

      setAssignments((current) => [
        ...current,
        data.assignment,
      ]);

      setAssignmentForm({
        subject_name: "",
        class_name: "",
        section_name: "",
        academic_year: "",
        periods_per_week: "0",
        assignment_type: "PRIMARY",
      });

      setShowAssignmentForm(false);
      setAssignmentError("");
      await loadActivity();
    } catch (err) {
      console.error("Save assignment error:", err);

      setAssignmentError(
        err instanceof Error
          ? err.message
          : "Unable to save teaching assignment."
      );
    } finally {
      setSavingAssignment(false);
    }
  }

  function startEditAssignment(assignment: Assignment) {
    setAssignmentError("");

    setEditingAssignmentId(assignment.id);

    setAssignmentForm({
      subject_name: assignment.subject_name || "",
      class_name: assignment.class_name || "",
      section_name: assignment.section_name || "",
      academic_year: assignment.academic_year || "",
      periods_per_week: String(
        assignment.periods_per_week ?? 0
      ),
      assignment_type:
        assignment.assignment_type || "PRIMARY",
    });

    setShowAssignmentForm(true);
  }

  async function deleteAssignment(assignmentId: string) {
    const confirmed = window.confirm(
      "Delete this teaching assignment?"
    );

    if (!confirmed) return;

    try {
      setAssignmentError("");

      const response = await fetch("/api/teachers/assignments", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          id: assignmentId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to delete assignment."
        );
      }

      setAssignments((current) =>
        current.filter(
          (assignment) => assignment.id !== assignmentId
        )
      );

      if (editingAssignmentId === assignmentId) {
        setEditingAssignmentId(null);
      }

      await loadActivity();
    } catch (err) {
      console.error(err);
      setAssignmentError(
        err instanceof Error
          ? err.message
          : "Unable to delete assignment."
      );
    }
  }

  useEffect(() => {
    if (id) loadProfile();
  }, [id]);

  const totalPeriods = useMemo(
    () =>
      assignments.reduce(
        (total, assignment) =>
          total + Number(assignment.periods_per_week ?? 0),
        0
      ),
    [assignments]
  );

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <p className="text-sm text-slate-500">Loading teacher profile...</p>
      </div>
    );
  }

  if (error || !teacher) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <Link
          href="/app/teachers"
          className="text-sm font-medium text-slate-600 hover:text-slate-950"
        >
          ← Back to teachers
        </Link>

        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          {error || "Teacher not found."}
        </div>
      </div>
    );
  }

  const name = teacherName(teacher);
  const isActive = activeTeacher(teacher.status);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <Link
          href="/app/teachers"
          className="text-sm font-medium text-slate-500 hover:text-slate-950"
        >
          ← Teacher Directory
        </Link>

        <div className="mt-5 overflow-hidden rounded-3xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 bg-slate-50 px-6 py-7">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-black text-xl font-bold text-white">
                  {name.charAt(0).toUpperCase()}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
                      {name}
                    </h1>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        isActive
                          ? "bg-green-50 text-green-700"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    {teacher.designation || "Teacher"}
                    {teacher.department
                      ? ` · ${teacher.department}`
                      : ""}
                  </p>

                  {teacher.employee_id && (
                    <p className="mt-1 text-xs text-slate-400">
                      Employee ID: {teacher.employee_id}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={startEditProfile}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Edit profile
                </button>

                <button
                  type="button"
                  onClick={toggleTeacherStatus}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                  {activeTeacher(teacher.status) ? "Deactivate" : "Activate"}
                </button>

                <button
                  type="button"
                  onClick={deleteTeacher}
                  className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
                >
                  Delete Teacher
                </button>

                <Link
                  href="/app/teachers"
                  className="rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Back
                </Link>
              </div>
            </div>
          </div>

          {editingProfile && (
            <form
              onSubmit={saveProfile}
              className="border-t border-slate-200 bg-slate-50 p-6"
            >
              <div className="mb-5">
                <h2 className="text-base font-semibold text-slate-950">
                  Edit teacher profile
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Update the teacher's staff information.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Salutation
                  </label>
                  <select
                    value={profileForm.salutation}
                    onChange={(e) =>
                      setProfileForm((current) => ({
                        ...current,
                        salutation: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                  >
                    <option value="">None</option>
                    <option value="Mr">Mr</option>
                    <option value="Ms">Ms</option>
                    <option value="Mrs">Mrs</option>
                    <option value="Dr">Dr</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    First Name *
                  </label>
                  <input
                    value={profileForm.first_name}
                    onChange={(e) =>
                      setProfileForm((current) => ({
                        ...current,
                        first_name: e.target.value,
                      }))
                    }
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Last Name
                  </label>
                  <input
                    value={profileForm.last_name}
                    onChange={(e) =>
                      setProfileForm((current) => ({
                        ...current,
                        last_name: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Employee ID
                  </label>
                  <input
                    value={profileForm.employee_id}
                    onChange={(e) =>
                      setProfileForm((current) => ({
                        ...current,
                        employee_id: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) =>
                      setProfileForm((current) => ({
                        ...current,
                        email: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Phone
                  </label>
                  <input
                    value={profileForm.phone}
                    onChange={(e) =>
                      setProfileForm((current) => ({
                        ...current,
                        phone: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Gender
                  </label>
                  <select
                    value={profileForm.gender}
                    onChange={(e) =>
                      setProfileForm((current) => ({
                        ...current,
                        gender: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500"
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
                    value={profileForm.designation}
                    onChange={(e) =>
                      setProfileForm((current) => ({
                        ...current,
                        designation: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Department
                  </label>
                  <input
                    value={profileForm.department}
                    onChange={(e) =>
                      setProfileForm((current) => ({
                        ...current,
                        department: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Status
                  </label>
                  <select
                    value={profileForm.status}
                    onChange={(e) =>
                      setProfileForm((current) => ({
                        ...current,
                        status: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>

              </div>

              {profileError && (
                <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {profileError}
                </p>
              )}

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditingProfile(false);
                    setProfileError("");
                  }}
                  disabled={savingProfile}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={savingProfile}
                  className="rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {savingProfile ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          )}

          <div className="grid gap-6 p-6 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Email
              </p>
              <p className="mt-2 text-sm font-medium text-slate-900">
                {teacher.email || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Phone
              </p>
              <p className="mt-2 text-sm font-medium text-slate-900">
                {teacher.phone || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Gender
              </p>
              <p className="mt-2 text-sm font-medium text-slate-900">
                {teacher.gender || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Department
              </p>
              <p className="mt-2 text-sm font-medium text-slate-900">
                {teacher.department || "—"}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Subjects
            </p>
            <p className="mt-2 text-3xl font-semibold text-slate-950">
              {assignments.length}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Teaching assignments
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Weekly periods
            </p>
            <p className="mt-2 text-3xl font-semibold text-slate-950">
              {totalPeriods}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Assigned teaching periods
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Status
            </p>
            <p className="mt-2 text-3xl font-semibold text-slate-950">
              {isActive ? "Active" : "Inactive"}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Current staff status
            </p>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="flex flex-col gap-4 border-b border-slate-200 p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">
                Teaching assignments
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Subjects, classes, sections and weekly workload.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAssignmentForm(true)}
              className="rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
            >
              + Add assignment
            </button>
          </div>

          {showAssignmentForm && (
            <form
              onSubmit={(event) => {
                event.preventDefault();

                if (editingAssignmentId) {
                  void updateAssignment(event);
                } else {
                  void saveAssignment(event);
                }
              }}
              className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-5"
            >
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Subject
                  </label>
                  <select
                    value={assignmentForm.subject_name}
                    onChange={(event) =>
                      setAssignmentForm((current) => ({
                        ...current,
                        subject_name: event.target.value,
                      }))
                    }
                    disabled={
                      !assignmentForm.section_name ||
                      assignmentOptionsLoading.subjects
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500 disabled:cursor-not-allowed disabled:bg-slate-100"
                  >
                    <option value="">
                      {assignmentOptionsLoading.subjects
                        ? "Loading subjects..."
                        : !assignmentForm.section_name
                          ? "Select section first"
                          : sectionSubjects.length === 0
                            ? "No subjects linked"
                            : "Select subject"}
                    </option>
                    {sectionSubjects.map((item) => (
                      <option key={item.subject_id} value={item.subjects?.name ?? ""}>
                        {item.subjects?.name ?? "Unnamed subject"}
                        {item.subjects?.code ? ` (${item.subjects.code})` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Class
                  </label>
                  <select
                    value={assignmentForm.class_name}
                    onChange={(event) =>
                      setAssignmentForm((current) => ({
                        ...current,
                        class_name: event.target.value,
                        section_name: "",
                        subject_name: "",
                      }))
                    }
                    disabled={
                      !assignmentForm.academic_year ||
                      assignmentOptionsLoading.classes
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500 disabled:cursor-not-allowed disabled:bg-slate-100"
                  >
                    <option value="">
                      {assignmentOptionsLoading.classes
                        ? "Loading classes..."
                        : !assignmentForm.academic_year
                          ? "Select academic year first"
                          : "Select class"}
                    </option>
                    {classes.map((item) => (
                      <option key={item.id} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Section
                  </label>
                  <select
                    value={assignmentForm.section_name}
                    onChange={(event) =>
                      setAssignmentForm((current) => ({
                        ...current,
                        section_name: event.target.value,
                        subject_name: "",
                      }))
                    }
                    disabled={
                      !assignmentForm.class_name ||
                      assignmentOptionsLoading.sections
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500 disabled:cursor-not-allowed disabled:bg-slate-100"
                  >
                    <option value="">
                      {assignmentOptionsLoading.sections
                        ? "Loading sections..."
                        : !assignmentForm.class_name
                          ? "Select class first"
                          : "Select section"}
                    </option>
                    {sections.map((item) => (
                      <option key={item.id} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Academic Year
                  </label>
                  <select
                    value={assignmentForm.academic_year}
                    onChange={(event) =>
                      setAssignmentForm((current) => ({
                        ...current,
                        academic_year: event.target.value,
                        class_name: "",
                        section_name: "",
                        subject_name: "",
                      }))
                    }
                    disabled={assignmentOptionsLoading.academicYears}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500 disabled:cursor-not-allowed disabled:bg-slate-100"
                  >
                    <option value="">
                      {assignmentOptionsLoading.academicYears
                        ? "Loading academic years..."
                        : "Select academic year"}
                    </option>
                    {academicYears.map((item) => (
                      <option key={item.id} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Periods / Week
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={assignmentForm.periods_per_week}
                    onChange={(event) =>
                      setAssignmentForm((current) => ({
                        ...current,
                        periods_per_week: event.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Assignment Type
                  </label>
                  <select
                    value={assignmentForm.assignment_type}
                    onChange={(event) =>
                      setAssignmentForm((current) => ({
                        ...current,
                        assignment_type: event.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                  >
                    <option value="PRIMARY">Primary</option>
                    <option value="SECONDARY">Secondary</option>
                    <option value="CLASS_TEACHER">
                      Class Teacher
                    </option>
                  </select>
                </div>

              </div>

              {assignmentError && (
                <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {assignmentError}
                </p>
              )}

              <div className="mt-5 flex justify-end">
                <button
                  type="submit"
                  disabled={savingAssignment}
                  className="rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {savingAssignment
                    ? "Saving..."
                    : editingAssignmentId
                      ? "Save Changes"
                      : "Save Assignment"}
                </button>
              </div>
            </form>
          )}

          {assignments.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-lg font-semibold">
                +
              </div>
              <h3 className="mt-4 text-base font-semibold text-slate-950">
                No teaching assignments
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Assign subjects and classes to this teacher.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Class
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Section
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Academic Year
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Periods
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Type
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Status
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {assignments.map((assignment) => (
                    <tr
                      key={assignment.id}
                      className="border-b border-slate-100 last:border-0"
                    >
                      <td className="px-6 py-4 text-sm font-semibold text-slate-950">
                        {assignment.subject_name}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {assignment.class_name || "—"}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {assignment.section_name || "—"}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {assignment.academic_year || "—"}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {assignment.periods_per_week ?? 0}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {assignment.assignment_type || "PRIMARY"}
                      </td>

                      <td className="px-6 py-4">
                        <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                          {assignment.status || "ACTIVE"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              startEditAssignment(assignment)
                            }
                            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              deleteAssignment(assignment.id)
                            }
                            className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        <section
          id="teacher-activity"
          className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">
                Teacher audit timeline
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Complete history of changes and actions for this teacher.
              </p>
            </div>

            <span className="w-fit rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
        {/* PROFESSIONAL TEACHER ATTENDANCE UI */}
        <section className="mt-6 space-y-6">

          {(() => {
            const total = attendance.length;

            const present = attendance.filter(
              (item) => item.status === "PRESENT",
            ).length;

            const absent = attendance.filter(
              (item) => item.status === "ABSENT",
            ).length;

            const late = attendance.filter(
              (item) => item.status === "LATE",
            ).length;

            const halfDay = attendance.filter(
              (item) => item.status === "HALF_DAY",
            ).length;

            const leave = attendance.filter(
              (item) => item.status === "LEAVE",
            ).length;

            const attendancePercentage =
              total > 0
                ? Math.round((present / total) * 100)
                : 0;

            function formatTime(value?: string | null) {
              if (!value) return "—";

              const parts = value.split(":");

              if (parts.length >= 2) {
                return `${parts[0]}:${parts[1]}`;
              }

              return value;
            }

            function calculateHours(
              checkIn?: string | null,
              checkOut?: string | null,
            ) {
              if (!checkIn || !checkOut) return "—";

              const [inHour, inMinute] = checkIn
                .split(":")
                .map(Number);

              const [outHour, outMinute] = checkOut
                .split(":")
                .map(Number);

              if (
                Number.isNaN(inHour) ||
                Number.isNaN(inMinute) ||
                Number.isNaN(outHour) ||
                Number.isNaN(outMinute)
              ) {
                return "—";
              }

              const start = inHour * 60 + inMinute;
              const end = outHour * 60 + outMinute;

              let minutes = end - start;

              if (minutes < 0) {
                minutes += 24 * 60;
              }

              const hours = Math.floor(minutes / 60);
              const remainingMinutes = minutes % 60;

              return `${hours}h ${String(
                remainingMinutes,
              ).padStart(2, "0")}m`;
            }

            function statusLabel(status: string) {
              return status
                .replaceAll("_", " ")
                .toLowerCase()
                .replace(/\b\w/g, (char) =>
                  char.toUpperCase(),
                );
            }

            function statusClass(status: string) {
              switch (status) {
                case "PRESENT":
                  return "border-emerald-200 bg-emerald-50 text-emerald-700";

                case "ABSENT":
                  return "border-red-200 bg-red-50 text-red-700";

                case "LATE":
                  return "border-amber-200 bg-amber-50 text-amber-700";

                case "HALF_DAY":
                  return "border-orange-200 bg-orange-50 text-orange-700";

                case "LEAVE":
                  return "border-blue-200 bg-blue-50 text-blue-700";

                default:
                  return "border-slate-200 bg-slate-50 text-slate-700";
              }
            }

            return (
              <>
                {/* Header */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white">
                          A
                        </div>

                        <div>
                          <h2 className="text-lg font-semibold text-slate-950">
                            Teacher attendance
                          </h2>

                          <p className="mt-0.5 text-sm text-slate-500">
                            Daily attendance, working hours and attendance history.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Attendance rate
                      </p>

                      <p className="mt-1 text-2xl font-bold text-slate-950">
                        {attendancePercentage}%
                      </p>
                    </div>
                  </div>

                  {/* Summary cards */}
                  <div className="grid grid-cols-2 gap-px bg-slate-200 sm:grid-cols-3 lg:grid-cols-6">

                    <div className="bg-white p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Total
                      </p>

                      <p className="mt-2 text-2xl font-bold text-slate-950">
                        {total}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Records
                      </p>
                    </div>

                    <div className="bg-white p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                        Present
                      </p>

                      <p className="mt-2 text-2xl font-bold text-slate-950">
                        {present}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        On duty
                      </p>
                    </div>

                    <div className="bg-white p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-red-600">
                        Absent
                      </p>

                      <p className="mt-2 text-2xl font-bold text-slate-950">
                        {absent}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Not present
                      </p>
                    </div>

                    <div className="bg-white p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">
                        Late
                      </p>

                      <p className="mt-2 text-2xl font-bold text-slate-950">
                        {late}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Late arrivals
                      </p>
                    </div>

                    <div className="bg-white p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-orange-600">
                        Half day
                      </p>

                      <p className="mt-2 text-2xl font-bold text-slate-950">
                        {halfDay}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Partial days
                      </p>
                    </div>

                    <div className="bg-white p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                        Leave
                      </p>

                      <p className="mt-2 text-2xl font-bold text-slate-950">
                        {leave}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Approved leave
                      </p>
                    </div>

                  </div>
                </div>

                {/* Mark attendance */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-200 p-5 sm:p-6">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-700">
                        +
                      </div>

                      <div>
                        <h3 className="text-base font-semibold text-slate-950">
                          Mark attendance
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          Record today's attendance and working hours.
                        </p>
                      </div>
                    </div>
                  </div>

                  <form
                    onSubmit={saveAttendance}
                    className="grid gap-4 p-5 sm:p-6 md:grid-cols-2 lg:grid-cols-5"
                  >
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Date
                      </label>

                      <input
                        name="attendance_date"
                        type="date"
                        defaultValue={new Date()
                          .toISOString()
                          .slice(0, 10)}
                        required
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Status
                      </label>

                      <select
                        name="status"
                        defaultValue="PRESENT"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                      >
                        <option value="PRESENT">Present</option>
                        <option value="ABSENT">Absent</option>
                        <option value="LATE">Late</option>
                        <option value="HALF_DAY">Half Day</option>
                        <option value="LEAVE">Leave</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Check-in
                      </label>

                      <input
                        name="check_in_time"
                        type="time"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Check-out
                      </label>

                      <input
                        name="check_out_time"
                        type="time"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                      />
                    </div>

                    <div className="flex items-end md:col-span-2 lg:col-span-1">
                      <button
                        type="submit"
                        disabled={attendanceLoading}
                        className="w-full rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {attendanceLoading
                          ? "Saving..."
                          : "Save Attendance"}
                      </button>
                    </div>

                    <div className="md:col-span-2 lg:col-span-5">
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Notes
                      </label>

                      <textarea
                        name="notes"
                        rows={3}
                        placeholder="Optional attendance notes..."
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                      />
                    </div>

                    {attendanceError && (
                      <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 md:col-span-2 lg:col-span-5">
                        <div className="text-sm font-semibold text-red-700">
                          Error
                        </div>

                        <p className="text-sm text-red-700">
                          {attendanceError}
                        </p>
                      </div>
                    )}
                  </form>
                </div>

                {/* Attendance history */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="flex flex-col gap-3 border-b border-slate-200 p-5 sm:p-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-slate-950">
                        Attendance history
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        Review attendance records, working hours and notes.
                      </p>
                    </div>

                    <span className="w-fit rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                      {total} {total === 1 ? "record" : "records"}
                    </span>
                  </div>

                  {attendance.length === 0 ? (
                    <div className="px-6 py-14 text-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-lg text-slate-500">
                        A
                      </div>

                      <h4 className="mt-4 text-sm font-semibold text-slate-950">
                        No attendance records
                      </h4>

                      <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
                        Attendance records for this teacher will appear here after the first entry is saved.
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Desktop table */}
                      <div className="hidden overflow-x-auto md:block">
                        <table className="w-full min-w-[900px] text-left">
                          <thead>
                            <tr className="border-b border-slate-200 bg-slate-50">
                              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Date
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

                              <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Actions
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            {attendance.map((record) => (
                              <tr
                                key={record.id}
                                className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70"
                              >
                                <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                                  {record.attendance_date}
                                </td>

                                <td className="px-6 py-4">
                                  <span
                                    className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClass(
                                      record.status,
                                    )}`}
                                  >
                                    {statusLabel(record.status)}
                                  </span>
                                </td>

                                <td className="px-6 py-4 text-sm text-slate-600">
                                  {formatTime(record.check_in_time)}
                                </td>

                                <td className="px-6 py-4 text-sm text-slate-600">
                                  {formatTime(record.check_out_time)}
                                </td>

                                <td className="px-6 py-4 text-sm font-medium text-slate-700">
                                  {calculateHours(
                                    record.check_in_time,
                                    record.check_out_time,
                                  )}
                                </td>

                                <td className="max-w-[240px] px-6 py-4 text-sm text-slate-500">
                                  <span className="block truncate">
                                    {record.notes || "—"}
                                  </span>
                                </td>

                                <td className="px-6 py-4">
                                  <div className="flex justify-end gap-2">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const nextStatus =
                                          window.prompt(
                                            "Status (PRESENT, ABSENT, LATE, HALF_DAY, LEAVE):",
                                            record.status,
                                          );

                                        if (!nextStatus) return;

                                        const normalized =
                                          nextStatus
                                            .trim()
                                            .toUpperCase();

                                        if (
                                          ![
                                            "PRESENT",
                                            "ABSENT",
                                            "LATE",
                                            "HALF_DAY",
                                            "LEAVE",
                                          ].includes(normalized)
                                        ) {
                                          window.alert(
                                            "Invalid attendance status.",
                                          );
                                          return;
                                        }

                                        fetch(
                                          `/api/teachers/${encodeURIComponent(
                                            id,
                                          )}/attendance?id=${encodeURIComponent(
                                            record.id,
                                          )}`,
                                          {
                                            method: "PATCH",
                                            headers: {
                                              "Content-Type":
                                                "application/json",
                                            },
                                            credentials: "include",
                                            body: JSON.stringify({
                                              status: normalized,
                                            }),
                                          },
                                        )
                                          .then(async (response) => {
                                            const data =
                                              await response
                                                .json()
                                                .catch(() => null);

                                            if (!response.ok) {
                                              throw new Error(
                                                data?.error ||
                                                  "Unable to update attendance.",
                                              );
                                            }

                                            setAttendance(
                                              (current) =>
                                                current.map(
                                                  (item) =>
                                                    item.id ===
                                                    record.id
                                                      ? data.attendance
                                                      : item,
                                                ),
                                            );

                                            await loadActivity();
                                          })
                                          .catch((error) => {
                                            console.error(
                                              "Teacher attendance update error:",
                                              error,
                                            );

                                            setAttendanceError(
                                              error instanceof Error
                                                ? error.message
                                                : "Unable to update attendance.",
                                            );
                                          });
                                      }}
                                      disabled={attendanceLoading}
                                      className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                                    >
                                      Edit
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() =>
                                        deleteAttendance(record.id)
                                      }
                                      disabled={attendanceLoading}
                                      className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Mobile cards */}
                      <div className="divide-y divide-slate-100 md:hidden">
                        {attendance.map((record) => (
                          <div
                            key={record.id}
                            className="space-y-4 p-5"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-sm font-semibold text-slate-950">
                                  {record.attendance_date}
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                  {calculateHours(
                                    record.check_in_time,
                                    record.check_out_time,
                                  )}{" "}
                                  working time
                                </p>
                              </div>

                              <span
                                className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClass(
                                  record.status,
                                )}`}
                              >
                                {statusLabel(record.status)}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="rounded-xl bg-slate-50 p-3">
                                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                  Check-in
                                </p>

                                <p className="mt-1 text-sm font-semibold text-slate-800">
                                  {formatTime(
                                    record.check_in_time,
                                  )}
                                </p>
                              </div>

                              <div className="rounded-xl bg-slate-50 p-3">
                                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                  Check-out
                                </p>

                                <p className="mt-1 text-sm font-semibold text-slate-800">
                                  {formatTime(
                                    record.check_out_time,
                                  )}
                                </p>
                              </div>
                            </div>

                            {record.notes && (
                              <div className="rounded-xl border border-slate-200 px-3 py-2.5">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                  Notes
                                </p>

                                <p className="mt-1 text-sm text-slate-600">
                                  {record.notes}
                                </p>
                              </div>
                            )}

                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  const nextStatus =
                                    window.prompt(
                                      "Status (PRESENT, ABSENT, LATE, HALF_DAY, LEAVE):",
                                      record.status,
                                    );

                                  if (!nextStatus) return;

                                  const normalized =
                                    nextStatus
                                      .trim()
                                      .toUpperCase();

                                  if (
                                    ![
                                      "PRESENT",
                                      "ABSENT",
                                      "LATE",
                                      "HALF_DAY",
                                      "LEAVE",
                                    ].includes(normalized)
                                  ) {
                                    window.alert(
                                      "Invalid attendance status.",
                                    );
                                    return;
                                  }

                                  fetch(
                                    `/api/teachers/${encodeURIComponent(
                                      id,
                                    )}/attendance?id=${encodeURIComponent(
                                      record.id,
                                    )}`,
                                    {
                                      method: "PATCH",
                                      headers: {
                                        "Content-Type":
                                          "application/json",
                                      },
                                      credentials: "include",
                                      body: JSON.stringify({
                                        status: normalized,
                                      }),
                                    },
                                  )
                                    .then(async (response) => {
                                      const data =
                                        await response
                                          .json()
                                          .catch(() => null);

                                      if (!response.ok) {
                                        throw new Error(
                                          data?.error ||
                                            "Unable to update attendance.",
                                        );
                                      }

                                      setAttendance(
                                        (current) =>
                                          current.map(
                                            (item) =>
                                              item.id ===
                                              record.id
                                                ? data.attendance
                                                : item,
                                          ),
                                      );

                                      await loadActivity();
                                    })
                                    .catch((error) => {
                                      console.error(
                                        "Teacher attendance update error:",
                                        error,
                                      );

                                      setAttendanceError(
                                        error instanceof Error
                                          ? error.message
                                          : "Unable to update attendance.",
                                      );
                                    });
                                }}
                                disabled={attendanceLoading}
                                className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  deleteAttendance(record.id)
                                }
                                disabled={attendanceLoading}
                                className="flex-1 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </>
            );
          })()}

        </section>

              {activities.length}{" "}
              {activities.length === 1 ? "event" : "events"}
            </span>
          </div>

          {activities.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
              <p className="text-sm font-semibold text-slate-700">
                No audit activity yet
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Changes to this teacher will appear here automatically.
              </p>
            </div>
          ) : (
            <div className="relative space-y-5">
              {activities.map((activity, index) => {
                const metadata = activity.metadata ?? {};
                const action = activity.action || "ACTIVITY";

                const isCreated = action.includes("CREATED");
                const isUpdated = action.includes("UPDATED");
                const isDeleted = action.includes("DELETED");
                const isStatus = action.includes("STATUS");

                const label = isCreated
                  ? "Created"
                  : isUpdated
                    ? "Updated"
                    : isDeleted
                      ? "Deleted"
                      : isStatus
                        ? "Status"
                        : "Activity";

                const displayAction = action
                  .replace(/^TEACHER_/, "")
                  .replaceAll("_", " ");

                return (
                  <div key={activity.id} className="relative flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-xs font-bold text-slate-700 shadow-sm">
                        {isDeleted ? "×" : isCreated ? "+" : isUpdated ? "↻" : "•"}
                      </div>

                      {index < activities.length - 1 && (
                        <div className="mt-2 h-full min-h-8 w-px bg-slate-200" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm font-semibold text-slate-950">
                              {displayAction}
                            </p>

                            <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500 ring-1 ring-slate-200">
                              {label}
                            </span>
                          </div>

                          <p className="mt-1 text-sm text-slate-600">
                            {activity.description}
                          </p>
                        </div>

                        <time
                          dateTime={activity.created_at}
                          className="shrink-0 text-xs font-medium text-slate-400"
                        >
                          {new Date(activity.created_at).toLocaleString(
                            undefined,
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </time>
                      </div>

                      {Object.keys(metadata).length > 0 && (
                        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                          {Object.entries(metadata)
                            .filter(([key]) => key !== "assignment_id")
                            .map(([key, value]) => (
                              <div
                                key={key}
                                className="rounded-lg border border-slate-200 bg-white px-3 py-2"
                              >
                                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                  {key.replaceAll("_", " ")}
                                </p>

                                <p className="mt-0.5 break-words text-xs font-medium text-slate-700">
                                  {String(value)}
                                </p>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>


        </div>
      </div>
    </div>
  );
}
