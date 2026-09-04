"use client";

import { useEffect, useMemo, useState } from "react";

type PeriodTiming = {
  id: string;
  academic_year_id: string;
  period_number: number;
  name: string;
  start_time: string;
  end_time: string;
  is_break: boolean;
  status: string;
};

type AcademicYear = {
  id: string;
  name?: string;
  label?: string;
  year?: string;
};

type ClassRecord = {
  id: string;
  name: string;
};

type Section = {
  id: string;
  name: string;
  class_id?: string;
};

type Subject = {
  id: string;
  name: string;
  code?: string;
};

type Teacher = {
  id: string;
  name: string;
  status?: string;
};

type TeacherAssignment = {
  teacher_id: string;
  subject_name?: string | null;
  periods_per_week?: number | null;
  class_name?: string | null;
  section_name?: string | null;
  academic_year?: string | null;
  status?: string | null;
};

type TimetableEntry = {
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
  subjects?: Subject | Subject[] | null;
};

type TimetableSuggestion = {
  id: string;
  day_of_week: number;
  day_name: string;
  period_number: number;
  period_name: string;
  start_time: string;
  end_time: string;
  teacher_id: string;
  score: number;
  reason: string;
};

type AutoGeneratePreviewRow = {
  subject_id: string;
  subject_name: string;
  teacher_id: string;
  day_of_week: number;
  day_name: string;
  period_number: number;
  period_name: string;
  start_time: string;
  end_time: string;
};

type AutoGenerateUnresolved = {
  subject_id: string;
  subject_name: string;
  required_additional_periods: number;
  generated_periods: number;
  missing_periods: number;
};

const DAYS = [
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

const PERIODS = Array.from({ length: 8 }, (_, index) => index + 1);

function getName(item: AcademicYear) {
  return item.name ?? item.label ?? item.year ?? "";
}

function getSubjectName(entry: TimetableEntry) {
  if (Array.isArray(entry.subjects)) {
    return entry.subjects[0]?.name ?? "Subject";
  }

  return entry.subjects?.name ?? "Subject";
}

function formatTime(value?: string | null) {
  if (!value) return "";

  return value.slice(0, 5);
}

const DEFAULT_PERIODS: number[] = [
  1, 2, 3, 4, 5, 6, 7, 8,
];

export default function TimetablePage() {
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [classes, setClasses] = useState<ClassRecord[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [teacherAssignments, setTeacherAssignments] = useState<
    TeacherAssignment[]
  >([]);
  const [timetables, setTimetables] = useState<TimetableEntry[]>([]);

  const [academicYearId, setAcademicYearId] = useState("");
  const [periodTimings, setPeriodTimings] = useState<PeriodTiming[]>([]);

  function getPeriodTiming(periodNumber: number) {
    return periodTimings.find(
      (timing) => timing.period_number === periodNumber
    );
  }

  function isBreakPeriod(periodNumber: number) {
    return getPeriodTiming(periodNumber)?.is_break === true;
  }

  function formatTime(value?: string | null) {
    if (!value) return "";
    return value.slice(0, 5);
  }

  const [classId, setClassId] = useState("");
  const [sectionId, setSectionId] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimetableEntry | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [suggestionSubjectId, setSuggestionSubjectId] = useState("");
  const [suggestions, setSuggestions] = useState<TimetableSuggestion[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [suggestionError, setSuggestionError] = useState("");
  const [schedulingSuggestionId, setSchedulingSuggestionId] = useState("");

  const [autoGeneratePreview, setAutoGeneratePreview] =
    useState<AutoGeneratePreviewRow[]>([]);
  const [autoGenerateUnresolved, setAutoGenerateUnresolved] =
    useState<AutoGenerateUnresolved[]>([]);
  const [autoGenerateLoading, setAutoGenerateLoading] = useState(false);
  const [autoGenerateError, setAutoGenerateError] = useState("");

  const [validationLoading, setValidationLoading] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    valid: boolean;
    errors: Array<{
      code: string;
      message: string;
      row?: number;
      subject_name?: string;
      day_of_week?: number;
      period_number?: number;
    }>;
    warnings: Array<{
      code: string;
      message: string;
      subject_name?: string;
    }>;
    summary: {
      total: number;
      valid: number;
      errors: number;
      warnings: number;
    };
  } | null>(null);
  const [validationError, setValidationError] = useState("");

  const [form, setForm] = useState({
    subject_id: "",
    teacher_id: "",
    day_of_week: "1",
    period_number: "1",
    start_time: "09:00",
    end_time: "09:45",
  });

  useEffect(() => {
    void loadAcademicYears();
    void loadClasses();
    void loadTeachers();
  }, []);

  useEffect(() => {
    if (!classId) {
      setSections([]);
      setSectionId("");
      return;
    }

    void loadSections(classId);
  }, [classId]);

  useEffect(() => {
    if (!sectionId) {
      setSubjects([]);
      return;
    }

    void loadSubjects(sectionId);
  }, [sectionId]);

  useEffect(() => {
    if (!academicYearId || !classId || !sectionId) {
      setTimetables([]);
      return;
    }

    void loadTimetable();
  }, [academicYearId, classId, sectionId]);

  async function loadAcademicYears() {
    try {
      const response = await fetch("/api/academic-years");
      const data = await response.json();

      const rows = data.academicYears ?? data.years ?? [];
      setAcademicYears(rows);

      const active =
        rows.find(
          (row: AcademicYear) =>
            row.name === "2026-27" ||
            row.label === "2026-27" ||
            row.year === "2026-27",
        ) ?? rows[0];

      if (active) {
        setAcademicYearId(active.id);
      }
    } catch {
      setError("Failed to load academic years.");
    }
  }

  async function loadClasses() {
    try {
      const response = await fetch("/api/classes");
      const data = await response.json();
      setClasses(data.classes ?? []);
    } catch {
      setError("Failed to load classes.");
    }
  }

  async function loadSections(selectedClassId: string) {
    try {
      const response = await fetch(
        `/api/sections?class_id=${encodeURIComponent(selectedClassId)}`,
      );
      const data = await response.json();

      const rows = data.sections ?? [];
      setSections(rows);

      if (rows.length > 0) {
        setSectionId(rows[0].id);
      } else {
        setSectionId("");
      }
    } catch {
      setError("Failed to load sections.");
    }
  }

  async function loadSubjects(selectedSectionId: string) {
    try {
      const response = await fetch(
        `/api/section-subjects?section_id=${encodeURIComponent(selectedSectionId)}`,
      );
      const data = await response.json();

      const rows = data.sectionSubjects ?? [];

      const mapped = rows
        .map((row: { subjects?: Subject | Subject[] }) => {
          if (Array.isArray(row.subjects)) return row.subjects[0];
          return row.subjects;
        })
        .filter(Boolean);

      setSubjects(mapped);

      if (mapped.length > 0) {
        setForm((current) => ({
          ...current,
          subject_id: current.subject_id || mapped[0].id,
        }));
      }
    } catch {
      setError("Failed to load section subjects.");
    }
  }

  async function loadTeachers() {
    try {
      const [teachersResponse, assignmentsResponse] = await Promise.all([
        fetch("/api/teachers"),
        fetch("/api/teachers/assignments"),
      ]);

      const teachersData = await teachersResponse.json();
      const assignmentsData = await assignmentsResponse.json();

      setTeachers(
        (teachersData.teachers ?? []).filter(
          (teacher: Teacher) => teacher.status === "ACTIVE",
        ),
      );

      setTeacherAssignments(assignmentsData.assignments ?? []);
    } catch {
      setError("Failed to load teachers and assignments.");
    }
  }

  async function loadPeriodTimings(yearId: string) {
    if (!yearId) {
      setPeriodTimings([]);
      return;
    }

    try {
      const response = await fetch(
        `/api/period-timings?academic_year_id=${encodeURIComponent(yearId)}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load period timings.");
      }

      setPeriodTimings(data.timings || []);
    } catch (err) {
      console.error("Failed to load period timings:", err);
      setPeriodTimings([]);
    }
  }

  async function loadTimetable() {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        academic_year_id: academicYearId,
        class_id: classId,
        section_id: sectionId,
      });

      const response = await fetch(`/api/timetable?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to load timetable.");
      }

      setTimetables(data.timetables ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load timetable.");
    } finally {
      setLoading(false);
    }
  }

  function openEditForm(entry: TimetableEntry) {
    setError("");
    setEditingEntry(entry);

    setForm({
      subject_id: entry.subject_id,
      teacher_id: entry.teacher_id ?? "",
      day_of_week: String(entry.day_of_week),
      period_number: String(entry.period_number),
      start_time: formatTime(entry.start_time) || "09:00",
      end_time: formatTime(entry.end_time) || "09:45",
    });

    setShowForm(true);
  }

  async function savePeriod(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!academicYearId || !classId || !sectionId || !form.subject_id) {
      setError("Academic year, class, section and subject are required.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const isEditing = Boolean(editingEntry);
      const url = isEditing
        ? `/api/timetable/${editingEntry!.id}`
        : "/api/timetable";

      const response = await fetch(url, {
        method: isEditing ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          academic_year_id: academicYearId,
          class_id: classId,
          section_id: sectionId,
          subject_id: form.subject_id,
          teacher_id: form.teacher_id || null,
          day_of_week: Number(form.day_of_week),
          period_number: Number(form.period_number),
          start_time: form.start_time || null,
          end_time: form.end_time || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ??
            (isEditing
              ? "Failed to update timetable period."
              : "Failed to save timetable period."),
        );
      }

      setShowForm(false);
      setEditingEntry(null);
      await loadTimetable();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save timetable period.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function deletePeriod(entry: TimetableEntry) {
    if (!window.confirm(`Delete ${getSubjectName(entry)} from this period?`)) {
      return;
    }

    setDeleting(true);
    setError("");

    try {
      const response = await fetch(`/api/timetable/${entry.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to delete timetable period.");
      }

      setShowForm(false);
      setEditingEntry(null);
      await loadTimetable();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete timetable period.",
      );
    } finally {
      setDeleting(false);
    }
  }

  async function validateAutoTimetablePreview() {
    if (!academicYearId || !classId || !sectionId) {
      setValidationError(
        "Select academic year, class and section first.",
      );
      return;
    }

    if (autoGeneratePreview.length === 0) {
      setValidationError(
        "Generate a timetable preview before validating it.",
      );
      return;
    }

    setValidationLoading(true);
    setValidationError("");
    setValidationResult(null);

    try {
      const response = await fetch(
        "/api/timetable/auto-generate/validate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            academic_year_id: academicYearId,
            class_id: classId,
            section_id: sectionId,
            generated: autoGeneratePreview,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ?? "Failed to validate timetable preview.",
        );
      }

      setValidationResult(data);
    } catch (err) {
      setValidationError(
        err instanceof Error
          ? err.message
          : "Failed to validate timetable preview.",
      );
    } finally {
      setValidationLoading(false);
    }
  }

  async function generateAutoTimetablePreview() {
    if (!academicYearId || !classId || !sectionId) {
      setAutoGenerateError(
        "Select academic year, class and section first.",
      );
      return;
    }

    setAutoGenerateLoading(true);
    setAutoGenerateError("");
    setAutoGeneratePreview([]);
    setAutoGenerateUnresolved([]);

    try {
      const params = new URLSearchParams({
        academic_year_id: academicYearId,
        class_id: classId,
        section_id: sectionId,
      });

      const response = await fetch(
        `/api/timetable/auto-generate?${params.toString()}`,
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ?? "Failed to generate timetable preview.",
        );
      }

      setAutoGeneratePreview(data.generated ?? []);
      setAutoGenerateUnresolved(data.unresolved ?? []);
    } catch (err) {
      setAutoGenerateError(
        err instanceof Error
          ? err.message
          : "Failed to generate timetable preview.",
      );
    } finally {
      setAutoGenerateLoading(false);
    }
  }

  async function scheduleSuggestion(
    suggestion: TimetableSuggestion,
  ) {
    if (!suggestionSubjectId || !academicYearId || !classId || !sectionId) {
      return;
    }

    setSchedulingSuggestionId(suggestion.id);
    setSuggestionError("");
    setError("");

    try {
      const response = await fetch("/api/timetable", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          academic_year_id: academicYearId,
          class_id: classId,
          section_id: sectionId,
          subject_id: suggestionSubjectId,
          teacher_id: suggestion.teacher_id,
          day_of_week: suggestion.day_of_week,
          period_number: suggestion.period_number,
          start_time: suggestion.start_time,
          end_time: suggestion.end_time,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ?? "Failed to schedule the suggested period.",
        );
      }

      await loadTimetable();
      await loadSuggestions(suggestionSubjectId);

      setSuggestionError("");
    } catch (err) {
      setSuggestionError(
        err instanceof Error
          ? err.message
          : "Failed to schedule the suggested period.",
      );
    } finally {
      setSchedulingSuggestionId("");
    }
  }

  async function loadSuggestions(subjectId: string) {
    if (!academicYearId || !classId || !sectionId || !subjectId) {
      setSuggestions([]);
      return;
    }

    setLoadingSuggestions(true);
    setSuggestionError("");

    try {
      const params = new URLSearchParams({
        academic_year_id: academicYearId,
        class_id: classId,
        section_id: sectionId,
        subject_id: subjectId,
      });

      const response = await fetch(
        `/api/timetable/suggestions?${params.toString()}`,
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ?? "Failed to generate timetable suggestions.",
        );
      }

      setSuggestions(data.suggestions ?? []);

      if ((data.suggestions ?? []).length === 0) {
        setSuggestionError(
          data.message ??
            "No conflict-free slots are currently available.",
        );
      }
    } catch (err) {
      setSuggestions([]);
      setSuggestionError(
        err instanceof Error
          ? err.message
          : "Failed to generate timetable suggestions.",
      );
    } finally {
      setLoadingSuggestions(false);
    }
  }

  const timetableMap = useMemo(() => {
    const map = new Map<string, TimetableEntry>();

    for (const entry of timetables) {
      map.set(`${entry.day_of_week}-${entry.period_number}`, entry);
    }

    return map;
  }, [timetables]);

  const selectedClass = classes.find((item) => item.id === classId);
  const selectedSection = sections.find((item) => item.id === sectionId);
  const selectedAcademicYear = academicYears.find(
    (year) => year.id === academicYearId,
  );

  const selectedAcademicYearName = selectedAcademicYear
    ? getName(selectedAcademicYear)
    : "";

  const selectedSubject = subjects.find(
    (subject) => subject.id === form.subject_id,
  );

  const validTeacherIds = new Set(
    teacherAssignments
      .filter((assignment) => {
        const assignmentSubject =
          assignment.subject_name?.trim().toLowerCase() ?? "";

        const assignmentClass =
          assignment.class_name?.trim().toLowerCase() ?? "";

        const assignmentSection =
          assignment.section_name?.trim().toLowerCase() ?? "";

        return (
          assignment.status?.toUpperCase() === "ACTIVE" &&
          assignmentSubject ===
            (selectedSubject?.name?.trim().toLowerCase() ?? "") &&
          assignmentClass ===
            (selectedClass?.name?.trim().toLowerCase() ?? "") &&
          assignmentSection ===
            (selectedSection?.name?.trim().toLowerCase() ?? "") &&
          assignment.academic_year?.trim() === selectedAcademicYearName.trim()
        );
      })
      .map((assignment) => assignment.teacher_id),
  );

  const filteredTeachers = teachers.filter((teacher) =>
    validTeacherIds.has(teacher.id),
  );

  const completenessRows = useMemo(() => {
    if (!academicYearId || !classId || !sectionId) {
      return [];
    }

    const selectedClassName =
      selectedClass?.name?.trim().toLowerCase() ?? "";
    const selectedSectionName =
      selectedSection?.name?.trim().toLowerCase() ?? "";
    const selectedYearName =
      selectedAcademicYearName.trim().toLowerCase();

    const assignedSubjects = new Map<
      string,
      {
        subjectName: string;
        requiredPeriods: number;
      }
    >();

    for (const assignment of teacherAssignments) {
      if (assignment.status?.toUpperCase() !== "ACTIVE") {
        continue;
      }

      const assignmentClass =
        assignment.class_name?.trim().toLowerCase() ?? "";
      const assignmentSection =
        assignment.section_name?.trim().toLowerCase() ?? "";
      const assignmentYear =
        assignment.academic_year?.trim().toLowerCase() ?? "";

      if (
        assignmentClass !== selectedClassName ||
        assignmentSection !== selectedSectionName ||
        assignmentYear !== selectedYearName ||
        !assignment.subject_name?.trim()
      ) {
        continue;
      }

      const subjectName = assignment.subject_name.trim();
      const key = subjectName.toLowerCase();

      const existing = assignedSubjects.get(key);

      assignedSubjects.set(key, {
        subjectName,
        requiredPeriods:
          (existing?.requiredPeriods ?? 0) +
          Number(assignment.periods_per_week ?? 0),
      });
    }

    const scheduledCounts = new Map<string, number>();

    for (const entry of timetables) {
      const subject = subjects.find(
        (item) => item.id === entry.subject_id,
      );

      const subjectName =
        subject?.name?.trim().toLowerCase() ?? "";

      if (!subjectName) {
        continue;
      }

      scheduledCounts.set(
        subjectName,
        (scheduledCounts.get(subjectName) ?? 0) + 1,
      );
    }

    return Array.from(assignedSubjects.entries())
      .map(([key, assignment]) => {
        const scheduledPeriods = scheduledCounts.get(key) ?? 0;
        const requiredPeriods = assignment.requiredPeriods;
        const difference = scheduledPeriods - requiredPeriods;

        let status: "Complete" | "Missing" | "Over";

        if (difference === 0) {
          status = "Complete";
        } else if (difference < 0) {
          status = "Missing";
        } else {
          status = "Over";
        }

        return {
          subjectName: assignment.subjectName,
          requiredPeriods,
          scheduledPeriods,
          missingPeriods: Math.max(0, -difference),
          overPeriods: Math.max(0, difference),
          status,
        };
      })
      .sort((a, b) =>
        a.subjectName.localeCompare(b.subjectName),
      );
  }, [
    academicYearId,
    classId,
    sectionId,
    selectedClass,
    selectedSection,
    selectedAcademicYearName,
    teacherAssignments,
    timetables,
    subjects,
  ]);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600">Academic</p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Timetable
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage weekly class schedules and teacher periods.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setError("");
              setEditingEntry(null);
              setForm((current) => ({
                ...current,
                day_of_week: "1",
                period_number: "1",
              }));
              setShowForm(true);
            }}
            disabled={!sectionId || subjects.length === 0}
            className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            + Add Period
          </button>
        </div>

        <section className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-3">
            <label className="text-sm font-medium text-slate-700">
              Academic Year
              <select
                value={academicYearId}
                onChange={(event) => setAcademicYearId(event.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm"
              >
                <option value="">Select academic year</option>
                {academicYears.map((year) => (
                  <option key={year.id} value={year.id}>
                    {getName(year)}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm font-medium text-slate-700">
              Class
              <select
                value={classId}
                onChange={(event) => {
                  setClassId(event.target.value);
                  setSectionId("");
                }}
                className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm"
              >
                <option value="">Select class</option>
                {classes.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm font-medium text-slate-700">
              Section
              <select
                value={sectionId}
                onChange={(event) => setSectionId(event.target.value)}
                disabled={!classId}
                className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm disabled:bg-slate-100"
              >
                <option value="">Select section</option>
                {sections.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        {sectionId && (
          <section className="mb-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-slate-900">
                    Timetable Completeness
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Compare assigned periods per week with scheduled periods.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-medium text-emerald-700">
                    Complete
                  </span>
                  <span className="rounded-full bg-amber-50 px-2.5 py-1 font-medium text-amber-700">
                    Missing
                  </span>
                  <span className="rounded-full bg-red-50 px-2.5 py-1 font-medium text-red-700">
                    Over
                  </span>
                </div>
              </div>
            </div>

            {completenessRows.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500">
                No active teacher assignments found for this section.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px]">
                  <thead className="bg-slate-50">
                    <tr className="border-b border-slate-200 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      <th className="px-5 py-3">Subject</th>
                      <th className="px-5 py-3 text-center">
                        Required / Week
                      </th>
                      <th className="px-5 py-3 text-center">
                        Scheduled
                      </th>
                      <th className="px-5 py-3 text-center">
                        Difference
                      </th>
                      <th className="px-5 py-3 text-center">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {completenessRows.map((row) => (
                      <tr
                        key={row.subjectName}
                        className="border-b border-slate-100 last:border-b-0"
                      >
                        <td className="px-5 py-3.5 font-medium text-slate-900">
                          {row.subjectName}
                        </td>

                        <td className="px-5 py-3.5 text-center text-slate-700">
                          {row.requiredPeriods}
                        </td>

                        <td className="px-5 py-3.5 text-center font-semibold text-slate-900">
                          {row.scheduledPeriods}
                        </td>

                        <td className="px-5 py-3.5 text-center">
                          {row.status === "Complete" ? (
                            <span className="text-slate-500">—</span>
                          ) : row.status === "Missing" ? (
                            <span className="font-medium text-amber-700">
                              Missing {row.missingPeriods}
                            </span>
                          ) : (
                            <span className="font-medium text-red-700">
                              Over by {row.overPeriods}
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-3.5 text-center">
                          {row.status === "Complete" ? (
                            <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                              Complete
                            </span>
                          ) : row.status === "Missing" ? (
                            <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                              Missing
                            </span>
                          ) : (
                            <span className="inline-flex rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
                              Over
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {sectionId && completenessRows.some((row) => row.status === "Missing") && (
          <section className="mb-6 overflow-hidden rounded-xl border border-blue-200 bg-white shadow-sm">
            <div className="border-b border-blue-100 bg-blue-50/50 px-5 py-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="font-semibold text-slate-900">
                    Smart Timetable Assistant
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Find available slots for subjects that still need periods.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={suggestionSubjectId}
                    onChange={(event) => {
                      setSuggestionSubjectId(event.target.value);
                      setSuggestions([]);
                      setSuggestionError("");
                    }}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                  >
                    <option value="">Select missing subject</option>
                    {completenessRows
                      .filter((row) => row.status === "Missing")
                      .map((row) => {
                        const subject = subjects.find(
                          (item) =>
                            item.name.trim().toLowerCase() ===
                            row.subjectName.trim().toLowerCase(),
                        );

                        if (!subject) {
                          return null;
                        }

                        return (
                          <option key={subject.id} value={subject.id}>
                            {row.subjectName} — missing {row.missingPeriods}
                          </option>
                        );
                      })}
                  </select>

                  <button
                    type="button"
                    disabled={
                      !suggestionSubjectId || loadingSuggestions
                    }
                    onClick={() =>
                      void loadSuggestions(suggestionSubjectId)
                    }
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {loadingSuggestions
                      ? "Finding..."
                      : "Suggest Slots"}
                  </button>
                </div>
              </div>
            </div>

            {suggestionError && (
              <div className="px-5 py-4 text-sm text-amber-700">
                {suggestionError}
              </div>
            )}

            {suggestions.length > 0 && (
              <div className="p-5">
                <div className="mb-3">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Recommended available slots
                  </h3>
                  <p className="text-xs text-slate-500">
                    These slots are currently free for both the section and
                    the assigned teacher.
                  </p>
                </div>

                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {suggestions.map((suggestion) => {
                    const teacher = teachers.find(
                      (item) => item.id === suggestion.teacher_id,
                    );

                    return (
                      <div
                        key={suggestion.id}
                        className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold text-slate-900">
                              {suggestion.day_name}
                            </p>
                            <p className="text-sm text-slate-600">
                              Period {suggestion.period_number} ·{" "}
                              {suggestion.period_name}
                            </p>
                          </div>

                          <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                            Available
                          </span>
                        </div>

                        <div className="mt-3 text-sm text-slate-700">
                          <p>
                            {formatTime(suggestion.start_time)} –{" "}
                            {formatTime(suggestion.end_time)}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            Teacher: {teacher?.name ?? suggestion.teacher_id}
                          </p>
                        </div>

                        <button
                          type="button"
                          disabled={
                            schedulingSuggestionId === suggestion.id
                          }
                          onClick={() =>
                            void scheduleSuggestion(suggestion)
                          }
                          className="mt-4 w-full rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {schedulingSuggestionId === suggestion.id
                            ? "Scheduling..."
                            : "Schedule This Slot"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </section>
        )}

        {sectionId && (
          <section className="mb-6 overflow-hidden rounded-xl border border-violet-200 bg-white shadow-sm">
            <div className="border-b border-violet-100 bg-violet-50/50 px-5 py-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="font-semibold text-slate-900">
                    AI Timetable Generator
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Generate a conflict-aware timetable proposal without changing the live schedule.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => void generateAutoTimetablePreview()}
                    disabled={autoGenerateLoading}
                    className="rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {autoGenerateLoading
                      ? "Generating..."
                      : "AI Generate Preview"}
                  </button>

                  <button
                    type="button"
                    onClick={() => void validateAutoTimetablePreview()}
                    disabled={
                      validationLoading ||
                      autoGeneratePreview.length === 0
                    }
                    className="rounded-lg border border-violet-200 bg-white px-4 py-2.5 text-sm font-semibold text-violet-700 hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {validationLoading
                      ? "Validating..."
                      : "Validate Preview"}
                  </button>
                </div>
              </div>
            </div>

            {autoGenerateError && (
              <div className="border-b border-amber-100 bg-amber-50 px-5 py-3 text-sm text-amber-800">
                {autoGenerateError}
              </div>
            )}

            {autoGeneratePreview.length > 0 && (
              <div className="p-5">
                <div className="mb-4 flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      Proposed Timetable
                    </h3>
                    <p className="text-xs text-slate-500">
                      Preview only — nothing has been saved.
                    </p>
                  </div>

                  <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                    {autoGeneratePreview.length} proposed periods
                  </span>
                </div>

                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="min-w-[850px] w-full">
                    <thead className="bg-slate-50">
                      <tr className="border-b border-slate-200 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        <th className="px-4 py-3">Subject</th>
                        <th className="px-4 py-3">Teacher</th>
                        <th className="px-4 py-3">Day</th>
                        <th className="px-4 py-3">Period</th>
                        <th className="px-4 py-3">Time</th>
                      </tr>
                    </thead>

                    <tbody>
                      {autoGeneratePreview.map((row, index) => {
                        const teacher = teachers.find(
                          (item) => item.id === row.teacher_id,
                        );

                        return (
                          <tr
                            key={`${row.subject_id}-${row.day_of_week}-${row.period_number}-${index}`}
                            className="border-b border-slate-100 last:border-b-0"
                          >
                            <td className="px-4 py-3 font-medium text-slate-900">
                              {row.subject_name}
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-600">
                              {teacher?.name ?? row.teacher_id}
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-700">
                              {row.day_name}
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-700">
                              {row.period_number} · {row.period_name}
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-700">
                              {formatTime(row.start_time)} –{" "}
                              {formatTime(row.end_time)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {autoGenerateUnresolved.length > 0 && (
                  <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
                    <h4 className="text-sm font-semibold text-amber-900">
                      Some periods could not be placed
                    </h4>

                    <div className="mt-2 space-y-1">
                      {autoGenerateUnresolved.map((row) => (
                        <p
                          key={row.subject_id}
                          className="text-xs text-amber-800"
                        >
                          {row.subject_name}: missing{" "}
                          {row.missing_periods} period
                          {row.missing_periods === 1 ? "" : "s"}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4 flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-xs text-slate-500">
                    Review the proposed schedule before publishing.
                  </p>

                  <span className="text-xs font-semibold text-slate-600">
                    PREVIEW ONLY
                  </span>
                </div>

                {validationError && (
                  <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {validationError}
                  </div>
                )}

                {validationResult && (
                  <div
                    className={`mt-4 rounded-xl border p-4 ${
                      validationResult.valid
                        ? "border-emerald-200 bg-emerald-50"
                        : "border-red-200 bg-red-50"
                    }`}
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h4
                          className={`font-semibold ${
                            validationResult.valid
                              ? "text-emerald-900"
                              : "text-red-900"
                          }`}
                        >
                          {validationResult.valid
                            ? "✓ Timetable Preview Passed Validation"
                            : "✕ Timetable Preview Has Conflicts"}
                        </h4>

                        <p
                          className={`mt-1 text-xs ${
                            validationResult.valid
                              ? "text-emerald-700"
                              : "text-red-700"
                          }`}
                        >
                          {validationResult.valid
                            ? "This proposal is ready for the approval stage."
                            : "Resolve the issues below before approval."}
                        </p>
                      </div>

                      <div className="flex gap-2 text-xs font-semibold">
                        <span className="rounded-full bg-white px-3 py-1 text-slate-700">
                          {validationResult.summary.total} total
                        </span>
                        <span className="rounded-full bg-white px-3 py-1 text-emerald-700">
                          {validationResult.summary.valid} valid
                        </span>
                        <span className="rounded-full bg-white px-3 py-1 text-red-700">
                          {validationResult.summary.errors} errors
                        </span>
                      </div>
                    </div>

                    {validationResult.errors.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {validationResult.errors.map((item, index) => (
                          <div
                            key={`${item.code}-${item.row ?? index}-${index}`}
                            className="rounded-lg border border-red-200 bg-white px-3 py-2"
                          >
                            <div className="text-xs font-semibold text-red-800">
                              {item.code.replaceAll("_", " ")}
                              {item.row
                                ? ` · Row ${item.row}`
                                : ""}
                            </div>

                            <div className="mt-0.5 text-xs text-red-700">
                              {item.message}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {validationResult.valid && (
                      <div className="mt-4 rounded-lg border border-emerald-200 bg-white px-4 py-3">
                        <div className="text-sm font-semibold text-emerald-800">
                          Ready for Approval
                        </div>
                        <div className="mt-1 text-xs text-emerald-700">
                          No database records have been changed. The next step
                          will be to approve and publish this timetable.
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div>
              <h2 className="font-semibold text-slate-900">
                {selectedClass?.name ?? "Class"}{" "}
                {selectedSection ? `• ${selectedSection.name}` : ""}
              </h2>
              <p className="text-xs text-slate-500">
                {loading
                  ? "Loading timetable..."
                  : `${timetables.length} scheduled period${
                      timetables.length === 1 ? "" : "s"
                    }`}
              </p>
            </div>

            <button
              type="button"
              onClick={() => void loadTimetable()}
              disabled={!sectionId || loading}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 disabled:opacity-40"
            >
              Refresh
            </button>
          </div>

          {!sectionId ? (
            <div className="p-12 text-center text-sm text-slate-500">
              Select an academic year, class and section to view the timetable.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[1050px] w-full border-collapse">
                <thead>
                  <tr>
                    <th className="w-28 border-b border-r border-slate-200 bg-slate-50 p-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Period
                    </th>

                    {DAYS.map((day) => (
                      <th
                        key={day.value}
                        className="border-b border-r border-slate-200 bg-slate-50 p-3 text-left text-sm font-semibold text-slate-700"
                      >
                        {day.label}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {(periodTimings.length > 0
                    ? [...periodTimings]
                        .sort((a, b) => a.period_number - b.period_number)
                        .map((timing) => timing.period_number)
                    : DEFAULT_PERIODS
                  ).map((period) => (
                    <tr key={period}>
                      <td className="border-b border-r border-slate-200 bg-slate-50 p-3 align-top">
                        <div className="text-sm font-semibold text-slate-800">
                          {getPeriodTiming(period)?.name || `Period ${period}`}
                        </div>
                      </td>

                      {DAYS.map((day) => {
                        const entry = timetableMap.get(
                          `${day.value}-${period}`,
                        );

                        return (
                          <td
                            key={`${day.value}-${period}`}
                            className="h-28 border-b border-r border-slate-200 p-2 align-top"
                          >
                            {entry ? (
                              <button
                                type="button"
                                onClick={() => openEditForm(entry)}
                                className="h-full min-h-24 w-full rounded-lg border border-blue-200 bg-blue-50 p-3 text-left transition hover:border-blue-400 hover:bg-blue-100"
                              >
                                <div className="text-sm font-semibold text-blue-900">
                                  {getSubjectName(entry)}
                                </div>

                                <div className="mt-1 text-xs text-blue-700">
                                  {formatTime(entry.start_time)}
                                  {entry.start_time && entry.end_time
                                    ? " – "
                                    : ""}
                                  {formatTime(entry.end_time)}
                                </div>

                                {entry.teacher_id && (
                                  <div className="mt-2 text-xs text-slate-600">
                                    {teachers.find(
                                      (teacher) =>
                                        teacher.id === entry.teacher_id,
                                    )?.name ?? entry.teacher_id}
                                  </div>
                                )}
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setForm((current) => ({
                                    ...current,
                                    day_of_week: String(day.value),
                                    period_number: String(period),
                                  }));
                                  setShowForm(true);
                                }}
                                className="flex h-full min-h-24 w-full items-center justify-center rounded-lg border border-dashed border-slate-200 text-xs text-slate-400 hover:border-slate-400 hover:text-slate-600"
                              >
                                + Add
                              </button>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {editingEntry ? "Edit Timetable Period" : "Add Timetable Period"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {selectedClass?.name} • {selectedSection?.name}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingEntry(null);
                }}
                className="text-xl text-slate-400 hover:text-slate-700"
              >
                ×
              </button>
            </div>

            <form onSubmit={savePeriod} className="space-y-4">
              <label className="block text-sm font-medium text-slate-700">
                Subject
                <select
                  value={form.subject_id}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      subject_id: event.target.value,
                    }))
                  }
                  className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5"
                  required
                >
                  <option value="">Select subject</option>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                      {subject.code ? ` (${subject.code})` : ""}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Teacher
                <select
                  value={form.teacher_id}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      teacher_id: event.target.value,
                    }))
                  }
                  className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5"
                >
                  <option value="">No teacher assigned</option>
                  {filteredTeachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </option>
                  ))}
                </select>
              </label>

              <div className="grid grid-cols-2 gap-4">
                <label className="text-sm font-medium text-slate-700">
                  Day
                  <select
                    value={form.day_of_week}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        day_of_week: event.target.value,
                      }))
                    }
                    className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5"
                  >
                    {DAYS.map((day) => (
                      <option key={day.value} value={day.value}>
                        {day.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="text-sm font-medium text-slate-700">
                  Period
                  <select
                    value={form.period_number}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        period_number: event.target.value,
                      }))
                    }
                    className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5"
                  >
                    {DEFAULT_PERIODS.map((period) => (
                      <option key={period} value={period}>
                        Period {period}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <label className="text-sm font-medium text-slate-700">
                  Start time
                  <input
                    type="time"
                    value={form.start_time}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        start_time: event.target.value,
                      }))
                    }
                    className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5"
                  />
                </label>

                <label className="text-sm font-medium text-slate-700">
                  End time
                  <input
                    type="time"
                    value={form.end_time}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        end_time: event.target.value,
                      }))
                    }
                    className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5"
                  />
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                {editingEntry && (
                  <button
                    type="button"
                    onClick={() => deletePeriod(editingEntry)}
                    disabled={saving || deleting}
                    className="mr-auto rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    {deleting ? "Deleting..." : "Delete"}
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingEntry(null);
                  }}
                  className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {saving
                    ? editingEntry
                      ? "Updating..."
                      : "Saving..."
                    : editingEntry
                      ? "Update Period"
                      : "Save Period"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
