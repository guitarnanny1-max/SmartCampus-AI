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

type StudentProfile = {
  id: string;
  tenantId: string;
  student_id: string;
  first_name: string | null;
  middle_name: string | null;
  last_name: string | null;
  date_of_birth: string | null;
  gender: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postal_code: string | null;
  created_at: string;
  updated_at: string;
};

type Guardian = {
  id: string;
  tenantId: string;
  student_id: string;
  name: string;
  relationship: string | null;
  email: string | null;
  phone: string | null;
  is_primary: boolean;
  is_emergency_contact: boolean;
  created_at: string;
  updated_at: string;
};


type StudentAcademicTeacher = {
  id: string;
  name: string;
  status?: string;
};

type StudentAcademicAssignment = {
  teacher_id: string;
  subject_name?: string | null;
  periods_per_week?: number | null;
  class_name?: string | null;
  section_name?: string | null;
  academic_year?: string | null;
  status?: string | null;
};

type StudentAcademicTimetableEntry = {
  id: string;
  academic_year_id: string;
  class_id: string;
  section_id: string;
  subject_id: string;
  teacher_id?: string | null;
  day_of_week: number;
  period_number: number;
  start_time?: string | null;
  end_time?: string | null;
  status: string;
  subjects?: {
    id: string;
    name: string;
    code?: string | null;
  } | {
    id: string;
    name: string;
    code?: string | null;
  }[] | null;
};

type StudentAcademicSubjectRow = {
  subjectName: string;
  requiredPeriods: number;
  scheduledPeriods: number;
  status: "Complete" | "Missing" | "Over";
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


  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");

  const [profileEditing, setProfileEditing] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaveError, setProfileSaveError] = useState("");

  const [profileForm, setProfileForm] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    date_of_birth: "",
    gender: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    country: "India",
    postal_code: "",
  });

  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [guardiansLoading, setGuardiansLoading] = useState(false);
  const [guardiansError, setGuardiansError] = useState("");

  
  const [academicTeachers, setAcademicTeachers] = useState<
    StudentAcademicTeacher[]
  >([]);
  const [academicAssignments, setAcademicAssignments] = useState<
    StudentAcademicAssignment[]
  >([]);
  const [academicTimetable, setAcademicTimetable] = useState<
    StudentAcademicTimetableEntry[]
  >([]);
  const [academicLoading, setAcademicLoading] = useState(false);
  const [academicError, setAcademicError] = useState("");

const [guardianEditing, setGuardianEditing] = useState(false);
  const [guardianSaving, setGuardianSaving] = useState(false);
  const [guardianSaveError, setGuardianSaveError] = useState("");
  const [editingGuardianId, setEditingGuardianId] = useState<string | null>(null);

  const [guardianForm, setGuardianForm] = useState({
    name: "",
    relationship: "",
    email: "",
    phone: "",
    is_primary: false,
    is_emergency_contact: false,
  });

  async function loadStudent360Data(id: string) {
    setProfileLoading(true);
    setGuardiansLoading(true);
    setProfileError("");
    setGuardiansError("");

    try {
      const [profileResponse, guardiansResponse] = await Promise.all([
        fetch(`/api/students/${encodeURIComponent(id)}/profile`, {
          credentials: "include",
          cache: "no-store",
        }),
        fetch(`/api/students/${encodeURIComponent(id)}/guardians`, {
          credentials: "include",
          cache: "no-store",
        }),
      ]);

      const profileData = await profileResponse.json();
      const guardiansData = await guardiansResponse.json();

      if (!profileResponse.ok) {
        throw new Error(
          profileData?.error || "Unable to load student profile.",
        );
      }

      if (!guardiansResponse.ok) {
        throw new Error(
          guardiansData?.error || "Unable to load student guardians.",
        );
      }

      setProfile(profileData.profile ?? null);
      setGuardians(guardiansData.guardians ?? []);
    } catch (err) {
      console.error("Student 360 loading error:", err);

      const message =
        err instanceof Error
          ? err.message
          : "Unable to load Student 360 data.";

      setProfileError(message);
      setGuardiansError(message);
    } finally {
      setProfileLoading(false);
      setGuardiansLoading(false);
    }
  }

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

  function startProfileEdit() {
    setProfileSaveError("");
    setProfileForm({
      first_name: profile?.first_name ?? "",
      middle_name: profile?.middle_name ?? "",
      last_name: profile?.last_name ?? "",
      date_of_birth: profile?.date_of_birth ?? "",
      gender: profile?.gender ?? "",
      address_line1: profile?.address_line1 ?? "",
      address_line2: profile?.address_line2 ?? "",
      city: profile?.city ?? "",
      state: profile?.state ?? "",
      country: profile?.country ?? "India",
      postal_code: profile?.postal_code ?? "",
    });
    setProfileEditing(true);
  }

  function cancelProfileEdit() {
    setProfileEditing(false);
    setProfileSaveError("");
  }

  async function saveProfile() {
    if (!studentId) {
      setProfileSaveError("Student ID is missing.");
      return;
    }

    try {
      setProfileSaving(true);
      setProfileSaveError("");

      const response = await fetch(
        `/api/students/${encodeURIComponent(studentId)}/profile`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(profileForm),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to save student profile.",
        );
      }

      setProfile(data.profile ?? null);
      setProfileEditing(false);
    } catch (err) {
      console.error("Student profile save error:", err);
      setProfileSaveError(
        err instanceof Error
          ? err.message
          : "Unable to save student profile.",
      );
    } finally {
      setProfileSaving(false);
    }
  }


  async function loadStudentAcademics(currentEnrollments: StudentEnrollment[]) {
    const activeEnrollment =
      currentEnrollments.find(
        (enrollment) =>
          String(enrollment.status ?? "").toUpperCase() === "ACTIVE",
      ) ?? currentEnrollments[0];

    if (!activeEnrollment) {
      setAcademicTeachers([]);
      setAcademicAssignments([]);
      setAcademicTimetable([]);
      setAcademicError("");
      return;
    }

    const academicYearId = activeEnrollment.academic_year_id;
    const classId = activeEnrollment.class_id;
    const sectionId = activeEnrollment.section_id;

    if (!academicYearId || !classId || !sectionId) {
      setAcademicTeachers([]);
      setAcademicAssignments([]);
      setAcademicTimetable([]);
      setAcademicError(
        "The student's current enrollment is missing academic year, class or section information.",
      );
      return;
    }

    setAcademicLoading(true);
    setAcademicError("");

    try {
      const academicYear = academicYears.find(
        (year) => year.id === academicYearId,
      );
      const selectedClass = classes.find((item) => item.id === classId);
      const selectedSection = sections.find((item) => item.id === sectionId);

      const [
        teachersResponse,
        assignmentsResponse,
        timetableResponse,
      ] = await Promise.all([
        fetch("/api/teachers"),
        fetch("/api/teachers/assignments"),
        fetch(
          `/api/timetable?academic_year_id=${encodeURIComponent(
            academicYearId,
          )}&class_id=${encodeURIComponent(
            classId,
          )}&section_id=${encodeURIComponent(sectionId)}`,
        ),
      ]);

      const teachersData = await teachersResponse.json();
      const assignmentsData = await assignmentsResponse.json();
      const timetableData = await timetableResponse.json();

      if (!teachersResponse.ok) {
        throw new Error(
          teachersData.error ?? "Failed to load teachers.",
        );
      }

      if (!assignmentsResponse.ok) {
        throw new Error(
          assignmentsData.error ?? "Failed to load teacher assignments.",
        );
      }

      if (!timetableResponse.ok) {
        throw new Error(
          timetableData.error ?? "Failed to load timetable.",
        );
      }

      const teachers = (teachersData.teachers ?? []).filter(
        (teacher: StudentAcademicTeacher) =>
          teacher.status?.toUpperCase() === "ACTIVE",
      );

      const allAssignments =
        assignmentsData.assignments ?? [];

      const yearName =
        academicYear?.name?.trim().toLowerCase() ?? "";
      const className =
        selectedClass?.name?.trim().toLowerCase() ?? "";
      const sectionName =
        selectedSection?.name?.trim().toLowerCase() ?? "";

      const matchingAssignments = allAssignments.filter(
        (assignment: StudentAcademicAssignment) =>
          assignment.status?.toUpperCase() === "ACTIVE" &&
          assignment.subject_name?.trim() &&
          assignment.class_name?.trim().toLowerCase() === className &&
          assignment.section_name?.trim().toLowerCase() === sectionName &&
          assignment.academic_year?.trim().toLowerCase() === yearName,
      );

      setAcademicTeachers(teachers);
      setAcademicAssignments(matchingAssignments);
      setAcademicTimetable(timetableData.timetables ?? []);
    } catch (err) {
      setAcademicError(
        err instanceof Error
          ? err.message
          : "Failed to load academic information.",
      );
      setAcademicTeachers([]);
      setAcademicAssignments([]);
      setAcademicTimetable([]);
    } finally {
      setAcademicLoading(false);
    }
  }

  function startAddGuardian() {
    setGuardianSaveError("");
    setEditingGuardianId(null);
    setGuardianForm({
      name: "",
      relationship: "",
      email: "",
      phone: "",
      is_primary: guardians.length === 0,
      is_emergency_contact: false,
    });
    setGuardianEditing(true);
  }

  function startEditGuardian(guardian: Guardian) {
    setGuardianSaveError("");
    setEditingGuardianId(guardian.id);
    setGuardianForm({
      name: guardian.name,
      relationship: guardian.relationship ?? "",
      email: guardian.email ?? "",
      phone: guardian.phone ?? "",
      is_primary: guardian.is_primary,
      is_emergency_contact: guardian.is_emergency_contact,
    });
    setGuardianEditing(true);
  }

  function cancelGuardianEdit() {
    setGuardianEditing(false);
    setEditingGuardianId(null);
    setGuardianSaveError("");
  }

  async function saveGuardian() {
    if (!studentId) {
      setGuardianSaveError("Student ID is missing.");
      return;
    }

    if (!guardianForm.name.trim()) {
      setGuardianSaveError("Guardian name is required.");
      return;
    }

    try {
      setGuardianSaving(true);
      setGuardianSaveError("");

      const isEditing = Boolean(editingGuardianId);

      const url = isEditing
        ? `/api/students/${encodeURIComponent(studentId)}/guardians/${encodeURIComponent(editingGuardianId!)}`
        : `/api/students/${encodeURIComponent(studentId)}/guardians`;

      const response = await fetch(url, {
        method: isEditing ? "PATCH" : "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(guardianForm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to save guardian.",
        );
      }

      const refreshed = await fetch(
        `/api/students/${encodeURIComponent(studentId)}/guardians`,
        {
          credentials: "include",
          cache: "no-store",
        },
      );

      const refreshedData = await refreshed.json();

      if (!refreshed.ok) {
        throw new Error(
          refreshedData?.error || "Guardian saved, but refresh failed.",
        );
      }

      setGuardians(refreshedData.guardians ?? []);
      setGuardianEditing(false);
      setEditingGuardianId(null);
    } catch (err) {
      console.error("Student guardian save error:", err);
      setGuardianSaveError(
        err instanceof Error
          ? err.message
          : "Unable to save guardian.",
      );
    } finally {
      setGuardianSaving(false);
    }
  }

  async function deleteGuardian(guardian: Guardian) {
    if (!studentId) return;

    if (guardian.is_primary) {
      setGuardiansError(
        "Primary guardian cannot be deleted. Assign another primary guardian first.",
      );
      return;
    }

    const confirmed = window.confirm(
      `Delete guardian "${guardian.name}"? This action cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      setGuardiansError("");

      const response = await fetch(
        `/api/students/${encodeURIComponent(studentId)}/guardians/${encodeURIComponent(guardian.id)}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to delete guardian.",
        );
      }

      setGuardians((current) =>
        current.filter((item) => item.id !== guardian.id),
      );
    } catch (err) {
      console.error("Student guardian delete error:", err);
      setGuardiansError(
        err instanceof Error
          ? err.message
          : "Unable to delete guardian.",
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
          method: enrollments.some(
            (enrollment) =>
              enrollment.academic_year_id === selectedAcademicYearId,
          )
            ? "PATCH"
            : "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...(enrollments.some(
              (enrollment) =>
                enrollment.academic_year_id === selectedAcademicYearId,
            )
              ? {
                  id: enrollments.find(
                    (enrollment) =>
                      enrollment.academic_year_id === selectedAcademicYearId,
                  )!.id,
                }
              : {}),
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
    if (!enrollmentLoading && enrollments.length > 0) {
      void loadStudentAcademics(enrollments);
    } else if (!enrollmentLoading && enrollments.length === 0) {
      setAcademicTeachers([]);
      setAcademicAssignments([]);
      setAcademicTimetable([]);
    }
  }, [
    enrollments,
    enrollmentLoading,
    academicYears,
    classes,
    sections,
  ]);

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

        await Promise.all([
          loadEnrollmentData(id),
          loadStudent360Data(id),
        ]);

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

          {/* Student 360 — Personal Information */}
          <section className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-[#0F172A]">
                  Personal Information
                </h2>
                <p className="mt-1 text-sm text-[#64748B]">
                  Student identity, date of birth, gender and address details.
                </p>
              </div>

              {!profileEditing && (
                <button
                  type="button"
                  onClick={startProfileEdit}
                  disabled={profileLoading}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Edit
                </button>
              )}
            </div>

            {profileLoading ? (
              <div className="rounded-xl border border-[#E2E8F0] bg-slate-50 p-4 text-sm text-slate-600">
                Loading personal information...
              </div>
            ) : profileError ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {profileError}
              </div>
            ) : profileEditing ? (
              <div className="space-y-5">
                {profileSaveError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {profileSaveError}
                  </div>
                )}

                <div className="grid gap-4 md:grid-cols-3">
                  {[
                    ["first_name", "First Name"],
                    ["middle_name", "Middle Name"],
                    ["last_name", "Last Name"],
                  ].map(([field, label]) => (
                    <div key={field}>
                      <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
                        {label}
                      </label>
                      <input
                        type="text"
                        value={profileForm[field as keyof typeof profileForm]}
                        onChange={(e) =>
                          setProfileForm((current) => ({
                            ...current,
                            [field]: e.target.value,
                          }))
                        }
                        className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                      />
                    </div>
                  ))}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={profileForm.date_of_birth}
                      onChange={(e) =>
                        setProfileForm((current) => ({
                          ...current,
                          date_of_birth: e.target.value,
                        }))
                      }
                      className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
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
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
                      Address Line 1
                    </label>
                    <input
                      type="text"
                      value={profileForm.address_line1}
                      onChange={(e) =>
                        setProfileForm((current) => ({
                          ...current,
                          address_line1: e.target.value,
                        }))
                      }
                      className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      value={profileForm.address_line2}
                      onChange={(e) =>
                        setProfileForm((current) => ({
                          ...current,
                          address_line2: e.target.value,
                        }))
                      }
                      className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-4">
                  {[
                    ["city", "City"],
                    ["state", "State"],
                    ["country", "Country"],
                    ["postal_code", "Postal Code"],
                  ].map(([field, label]) => (
                    <div key={field}>
                      <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
                        {label}
                      </label>
                      <input
                        type="text"
                        value={profileForm[field as keyof typeof profileForm]}
                        onChange={(e) =>
                          setProfileForm((current) => ({
                            ...current,
                            [field]: e.target.value,
                          }))
                        }
                        className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
                  <button
                    type="button"
                    onClick={cancelProfileEdit}
                    disabled={profileSaving}
                    className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={saveProfile}
                    disabled={profileSaving}
                    className="rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {profileSaving ? "Saving..." : "Save Personal Information"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  ["First Name", profile?.first_name],
                  ["Middle Name", profile?.middle_name],
                  ["Last Name", profile?.last_name],
                  ["Date of Birth", profile?.date_of_birth],
                  ["Gender", profile?.gender],
                  ["Country", profile?.country],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      {label}
                    </p>
                    <p className="mt-1 font-semibold text-slate-900">
                      {value || "—"}
                    </p>
                  </div>
                ))}

                <div className="md:col-span-2">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Address
                  </p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {[profile?.address_line1, profile?.address_line2]
                      .filter(Boolean)
                      .join(", ") || "—"}
                  </p>
                </div>

                {[
                  ["City", profile?.city],
                  ["State", profile?.state],
                  ["Postal Code", profile?.postal_code],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      {label}
                    </p>
                    <p className="mt-1 font-semibold text-slate-900">
                      {value || "—"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Student 360 — Guardians */}
          <section className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-[#0F172A]">
                  Guardians
                </h2>
                <p className="mt-1 text-sm text-[#64748B]">
                  Parents, guardians and emergency contacts associated with this student.
                </p>
              </div>

              {!guardianEditing && (
                <button
                  type="button"
                  onClick={startAddGuardian}
                  className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
                >
                  + Add Guardian
                </button>
              )}
            </div>

            {guardiansError && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {guardiansError}
              </div>
            )}

            {guardianEditing && (
              <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="mb-4">
                  <h3 className="font-semibold text-slate-900">
                    {editingGuardianId ? "Edit Guardian" : "Add Guardian"}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Maintain parent, guardian and emergency contact information.
                  </p>
                </div>

                {guardianSaveError && (
                  <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {guardianSaveError}
                  </div>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
                      Name
                    </label>
                    <input
                      type="text"
                      value={guardianForm.name}
                      onChange={(e) =>
                        setGuardianForm((current) => ({
                          ...current,
                          name: e.target.value,
                        }))
                      }
                      placeholder="Guardian name"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
                      Relationship
                    </label>
                    <input
                      type="text"
                      value={guardianForm.relationship}
                      onChange={(e) =>
                        setGuardianForm((current) => ({
                          ...current,
                          relationship: e.target.value,
                        }))
                      }
                      placeholder="Parent, Father, Mother, Guardian..."
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
                      Email
                    </label>
                    <input
                      type="email"
                      value={guardianForm.email}
                      onChange={(e) =>
                        setGuardianForm((current) => ({
                          ...current,
                          email: e.target.value,
                        }))
                      }
                      placeholder="guardian@example.com"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={guardianForm.phone}
                      onChange={(e) =>
                        setGuardianForm((current) => ({
                          ...current,
                          phone: e.target.value,
                        }))
                      }
                      placeholder="+91..."
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                    />
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-5">
                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={guardianForm.is_primary}
                      onChange={(e) =>
                        setGuardianForm((current) => ({
                          ...current,
                          is_primary: e.target.checked,
                        }))
                      }
                    />
                    Primary guardian
                  </label>

                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={guardianForm.is_emergency_contact}
                      onChange={(e) =>
                        setGuardianForm((current) => ({
                          ...current,
                          is_emergency_contact: e.target.checked,
                        }))
                      }
                    />
                    Emergency contact
                  </label>
                </div>

                <div className="mt-5 flex justify-end gap-3 border-t border-slate-200 pt-5">
                  <button
                    type="button"
                    onClick={cancelGuardianEdit}
                    disabled={guardianSaving}
                    className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={saveGuardian}
                    disabled={guardianSaving}
                    className="rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {guardianSaving
                      ? "Saving..."
                      : editingGuardianId
                        ? "Save Guardian"
                        : "Add Guardian"}
                  </button>
                </div>
              </div>
            )}

            {guardiansLoading ? (
              <div className="rounded-xl border border-[#E2E8F0] bg-slate-50 p-4 text-sm text-slate-600">
                Loading guardians...
              </div>
            ) : guardians.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                <p className="text-sm font-semibold text-slate-700">
                  No guardians added yet.
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Use Add Guardian to create the first guardian record.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {guardians.map((guardian) => (
                  <div
                    key={guardian.id}
                    className="rounded-xl border border-[#E2E8F0] bg-white p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {guardian.name}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          {guardian.relationship || "Guardian"}
                        </p>
                      </div>

                      <div className="flex flex-wrap justify-end gap-2">
                        {guardian.is_primary && (
                          <span className="rounded-full bg-slate-900 px-2.5 py-1 text-[11px] font-semibold text-white">
                            Primary
                          </span>
                        )}

                        {guardian.is_emergency_contact && (
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                            Emergency
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 space-y-3">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          Email
                        </p>
                        <p className="mt-1 text-sm font-medium text-slate-900">
                          {guardian.email || "—"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          Phone
                        </p>
                        <p className="mt-1 text-sm font-medium text-slate-900">
                          {guardian.phone || "—"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex justify-end gap-2 border-t border-slate-100 pt-4">
                      <button
                        type="button"
                        onClick={() => startEditGuardian(guardian)}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteGuardian(guardian)}
                        disabled={guardian.is_primary}
                        className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                        title={
                          guardian.is_primary
                            ? "Assign another primary guardian before deleting this guardian."
                            : "Delete guardian"
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Student 360 — Academics & Timetable */}
          <section className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-[#0F172A]">
                Academics & Timetable
              </h2>
              <p className="mt-1 text-sm text-[#64748B]">
                Current academic enrollment, subject requirements and weekly
                timetable for this student.
              </p>
            </div>

            {academicError && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {academicError}
              </div>
            )}

            {academicLoading ? (
              <div className="rounded-xl border border-[#E2E8F0] bg-slate-50 p-6 text-center text-sm text-slate-600">
                Loading academic information...
              </div>
            ) : !enrollments.length ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                <p className="text-sm font-semibold text-slate-700">
                  No academic enrollment found.
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Add an enrollment to view this student's academics and
                  timetable.
                </p>
              </div>
            ) : (
              <>
                {(() => {
                  const activeEnrollment =
                    enrollments.find(
                      (enrollment) =>
                        String(enrollment.status ?? "").toUpperCase() ===
                        "ACTIVE",
                    ) ?? enrollments[0];

                  const academicYear = academicYears.find(
                    (year) =>
                      year.id === activeEnrollment?.academic_year_id,
                  );

                  const selectedClass = classes.find(
                    (item) =>
                      item.id === activeEnrollment?.class_id,
                  );

                  const selectedSection = sections.find(
                    (item) =>
                      item.id === activeEnrollment?.section_id,
                  );

                  const subjectMap = new Map<
                    string,
                    {
                      subjectName: string;
                      requiredPeriods: number;
                    }
                  >();

                  for (const assignment of academicAssignments) {
                    const subjectName =
                      assignment.subject_name?.trim() ?? "";

                    if (!subjectName) continue;

                    const key = subjectName.toLowerCase();
                    const existing = subjectMap.get(key);

                    subjectMap.set(key, {
                      subjectName:
                        existing?.subjectName ?? subjectName,
                      requiredPeriods:
                        (existing?.requiredPeriods ?? 0) +
                        Number(assignment.periods_per_week ?? 0),
                    });
                  }

                  const scheduledCounts = new Map<string, number>();

                  for (const entry of academicTimetable) {
                    const subject = Array.isArray(entry.subjects)
                      ? entry.subjects[0]
                      : entry.subjects;

                    const subjectName =
                      subject?.name?.trim().toLowerCase() ?? "";

                    if (!subjectName) continue;

                    scheduledCounts.set(
                      subjectName,
                      (scheduledCounts.get(subjectName) ?? 0) + 1,
                    );
                  }

                  const subjectRows: StudentAcademicSubjectRow[] =
                    Array.from(subjectMap.entries()).map(
                      ([key, value]) => {
                        const scheduledPeriods =
                          scheduledCounts.get(key) ?? 0;
                        const requiredPeriods =
                          value.requiredPeriods;

                        let status: "Complete" | "Missing" | "Over";

                        if (scheduledPeriods === requiredPeriods) {
                          status = "Complete";
                        } else if (scheduledPeriods < requiredPeriods) {
                          status = "Missing";
                        } else {
                          status = "Over";
                        }

                        return {
                          subjectName: value.subjectName,
                          requiredPeriods,
                          scheduledPeriods,
                          status,
                        };
                      },
                    );

                  const teacherName = (teacherId?: string | null) =>
                    academicTeachers.find(
                      (teacher) => teacher.id === teacherId,
                    )?.name ?? teacherId ?? "Not assigned";

                  const subjectNameForEntry = (
                    entry: StudentAcademicTimetableEntry,
                  ) => {
                    const subject = Array.isArray(entry.subjects)
                      ? entry.subjects[0]
                      : entry.subjects;

                    return subject?.name ?? entry.subject_id;
                  };

                  const dayLabels: Record<number, string> = {
                    1: "Monday",
                    2: "Tuesday",
                    3: "Wednesday",
                    4: "Thursday",
                    5: "Friday",
                    6: "Saturday",
                  };

                  return (
                    <>
                      {/* Current enrollment */}
                      <div className="grid gap-4 md:grid-cols-3">
                        {[
                          [
                            "Academic Year",
                            academicYear?.name ?? "—",
                          ],
                          [
                            "Class",
                            selectedClass?.name ?? "—",
                          ],
                          [
                            "Section",
                            selectedSection?.name ?? "—",
                          ],
                        ].map(([label, value]) => (
                          <div
                            key={label}
                            className="rounded-xl border border-[#E2E8F0] bg-slate-50 p-4"
                          >
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                              {label}
                            </p>
                            <p className="mt-1 font-semibold text-slate-900">
                              {value}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Subject summary */}
                      <div className="mt-6">
                        <div className="mb-3">
                          <h3 className="font-semibold text-slate-900">
                            Subject Summary
                          </h3>
                          <p className="mt-1 text-xs text-slate-500">
                            Weekly subject requirements compared with the
                            published timetable.
                          </p>
                        </div>

                        {subjectRows.length === 0 ? (
                          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-600">
                            No active subject assignments found for this
                            enrollment.
                          </div>
                        ) : (
                          <div className="overflow-hidden rounded-xl border border-[#E2E8F0]">
                            <div className="hidden grid-cols-[1.6fr_1fr_1fr_1fr] gap-4 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 md:grid">
                              <div>Subject</div>
                              <div>Required</div>
                              <div>Scheduled</div>
                              <div>Status</div>
                            </div>

                            {subjectRows.map((row) => (
                              <div
                                key={row.subjectName}
                                className="grid gap-3 border-t border-[#E2E8F0] px-4 py-4 first:border-t-0 md:grid-cols-[1.6fr_1fr_1fr_1fr] md:items-center md:gap-4"
                              >
                                <div>
                                  <p className="font-semibold text-slate-900">
                                    {row.subjectName}
                                  </p>
                                </div>

                                <div>
                                  <span className="text-xs text-slate-400 md:hidden">
                                    Required{" "}
                                  </span>
                                  <span className="font-medium text-slate-700">
                                    {row.requiredPeriods}
                                  </span>
                                  <span className="ml-1 text-xs text-slate-400">
                                    periods/week
                                  </span>
                                </div>

                                <div>
                                  <span className="text-xs text-slate-400 md:hidden">
                                    Scheduled{" "}
                                  </span>
                                  <span className="font-medium text-slate-700">
                                    {row.scheduledPeriods}
                                  </span>
                                  <span className="ml-1 text-xs text-slate-400">
                                    periods
                                  </span>
                                </div>

                                <div>
                                  <span
                                    className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                                      row.status === "Complete"
                                        ? "bg-emerald-50 text-emerald-700"
                                        : row.status === "Missing"
                                          ? "bg-amber-50 text-amber-700"
                                          : "bg-blue-50 text-blue-700"
                                    }`}
                                  >
                                    {row.status}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Weekly timetable */}
                      <div className="mt-7">
                        <div className="mb-3">
                          <h3 className="font-semibold text-slate-900">
                            Weekly Timetable
                          </h3>
                          <p className="mt-1 text-xs text-slate-500">
                            Published periods for the student's current class
                            and section.
                          </p>
                        </div>

                        {academicTimetable.length === 0 ? (
                          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-600">
                            No timetable periods have been published for this
                            enrollment yet.
                          </div>
                        ) : (
                          <div className="space-y-5">
                            {Object.entries(dayLabels).map(
                              ([dayValue, dayName]) => {
                                const dayNumber = Number(dayValue);

                                const dayEntries =
                                  academicTimetable
                                    .filter(
                                      (entry) =>
                                        entry.day_of_week === dayNumber,
                                    )
                                    .sort(
                                      (a, b) =>
                                        a.period_number -
                                        b.period_number,
                                    );

                                if (dayEntries.length === 0) {
                                  return null;
                                }

                                return (
                                  <div
                                    key={dayNumber}
                                    className="overflow-hidden rounded-xl border border-[#E2E8F0]"
                                  >
                                    <div className="border-b border-[#E2E8F0] bg-slate-50 px-4 py-3">
                                      <h4 className="font-semibold text-slate-900">
                                        {dayName}
                                      </h4>
                                    </div>

                                    <div className="divide-y divide-slate-100">
                                      {dayEntries.map((entry) => (
                                        <div
                                          key={entry.id}
                                          className="grid gap-3 px-4 py-4 md:grid-cols-[70px_150px_1.5fr_1.5fr] md:items-center"
                                        >
                                          <div>
                                            <span className="rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-white">
                                              P{entry.period_number}
                                            </span>
                                          </div>

                                          <div>
                                            <p className="text-sm font-medium text-slate-700">
                                              {entry.start_time &&
                                              entry.end_time
                                                ? `${entry.start_time} – ${entry.end_time}`
                                                : "Time not set"}
                                            </p>
                                          </div>

                                          <div>
                                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                              Subject
                                            </p>
                                            <p className="mt-1 font-semibold text-slate-900">
                                              {subjectNameForEntry(entry)}
                                            </p>
                                          </div>

                                          <div>
                                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                              Teacher
                                            </p>
                                            <p className="mt-1 font-medium text-slate-700">
                                              {teacherName(entry.teacher_id)}
                                            </p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                );
                              },
                            )}
                          </div>
                        )}
                      </div>
                    </>
                  );
                })()}
              </>
            )}
          </section>

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
