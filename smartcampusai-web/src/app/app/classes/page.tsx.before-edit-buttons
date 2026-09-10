"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type AcademicYear = {
  id: string;
  name: string;
  start_date: string | null;
  end_date: string | null;
  status: string;
};

type ClassRecord = {
  id: string;
  academic_year_id: string;
  name: string;
  display_order: number;
  status: string;
};

type SectionRecord = {
  id: string;
  class_id: string;
  name: string;
  display_order: number;
  status: string;
};

type SubjectRecord = {
  id: string;
  name: string;
  code: string | null;
  status: string;
};

type ClassSubjectRecord = {
  id: string;
  class_id: string;
  subject_id: string;
  status: string;
  subjects?: {
    id: string;
    name: string;
    code: string | null;
    status: string;
  } | null;
};

type SectionSubjectRecord = {
  id: string;
  class_id: string;
  section_id: string;
  subject_id: string;
  status: string;
  subjects?: {
    id: string;
    name: string;
    code: string | null;
    status: string;
  } | null;
};

type StudentRosterRecord = {
  id: string;
  name: string;
  rollNumber: string | null;
  status: string;
  enrollment?: {
    academic_year_id: string;
    class_id: string;
    section_id: string;
    roll_number: string | null;
    status: string;
    enrolled_at: string | null;
  } | null;
  class?: {
    id: string;
    name: string;
  } | null;
  section?: {
    id: string;
    name: string;
    class_id: string;
  } | null;
};

export default function ClassesPage() {
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [classes, setClasses] = useState<ClassRecord[]>([]);
  const [sections, setSections] = useState<SectionRecord[]>([]);

  const [rosterStudents, setRosterStudents] =
    useState<StudentRosterRecord[]>([]);
  const [rosterLoading, setRosterLoading] = useState(false);

  const [subjects, setSubjects] = useState<SubjectRecord[]>([]);
  const [classSubjects, setClassSubjects] = useState<
    Record<string, ClassSubjectRecord[]>
  >({});
  const [sectionSubjects, setSectionSubjects] = useState<
    Record<string, SectionSubjectRecord[]>
  >({});
  const [savingSectionSubjects, setSavingSectionSubjects] = useState<
    Record<string, boolean>
  >({});
  const [subjectsLoading, setSubjectsLoading] = useState(false);
  const [savingSubjects, setSavingSubjects] = useState<
    Record<string, boolean>
  >({});

  const [selectedYearId, setSelectedYearId] = useState("");

  const [yearName, setYearName] = useState("");
  const [yearStart, setYearStart] = useState("");
  const [yearEnd, setYearEnd] = useState("");

  const [className, setClassName] = useState("");
  const [classOrder, setClassOrder] = useState("0");

  const [sectionNames, setSectionNames] = useState<
    Record<string, string>
  >({});

  const [loading, setLoading] = useState(true);
  const [savingYear, setSavingYear] = useState(false);
  const [savingClass, setSavingClass] = useState(false);
  const [savingSection, setSavingSection] = useState<
    Record<string, boolean>
  >({});

  const [error, setError] = useState("");

  async function loadAcademicYears() {
    const response = await fetch("/api/academic-years", {
      credentials: "include",
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.error || "Unable to load academic years.",
      );
    }

    const years: AcademicYear[] =
      data?.academicYears ?? [];

    setAcademicYears(years);

    if (!selectedYearId && years.length > 0) {
      setSelectedYearId(years[0].id);
    }
  }

  async function loadClasses(yearId: string) {
    if (!yearId) {
      setClasses([]);
      return;
    }

    const response = await fetch(
      `/api/classes?academic_year_id=${encodeURIComponent(yearId)}`,
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

    setClasses(data?.classes ?? []);
  }

  async function loadSections(classRecords: ClassRecord[]) {
    if (classRecords.length === 0) {
      setSections([]);
      return;
    }

    const results = await Promise.all(
      classRecords.map(async (classRecord) => {
        const response = await fetch(
          `/api/sections?class_id=${encodeURIComponent(classRecord.id)}`,
          {
            credentials: "include",
            cache: "no-store",
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error ||
              `Unable to load sections for ${classRecord.name}.`,
          );
        }

        return data?.sections ?? [];
      }),
    );

    const loadedSections = results.flat();
    setSections(loadedSections);
    await loadSectionSubjects(loadedSections);
  }

  async function loadSubjects() {
    try {
      setSubjectsLoading(true);

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

      console.log("Classes Subject Master response:", {
        status: response.status,
        ok: response.ok,
        data,
        subjects: data?.subjects,
        subjectCount: Array.isArray(data?.subjects)
          ? data.subjects.length
          : "not-array",
      });
      setSubjects(data?.subjects ?? []);
    } catch (subjectError) {
      console.error(
        "Classes subject master loading error:",
        subjectError,
      );
      setSubjects([]);
      setError(
        subjectError instanceof Error
          ? subjectError.message
          : "Unable to load subjects.",
      );
    } finally {
      setSubjectsLoading(false);
    }
  }

  async function loadClassSubjects(classRecords: ClassRecord[]) {
    if (classRecords.length === 0) {
      setClassSubjects({});
      return;
    }

    try {
      const results = await Promise.all(
        classRecords.map(async (classRecord) => {
          const response = await fetch(
            `/api/class-subjects?class_id=${encodeURIComponent(classRecord.id)}`,
            {
              credentials: "include",
              cache: "no-store",
            },
          );

          const data = await response.json();

          if (!response.ok) {
            throw new Error(
              data?.error ||
                `Unable to load subjects for ${classRecord.name}.`,
            );
          }

          return [
            classRecord.id,
            (data?.classSubjects ?? []) as ClassSubjectRecord[],
          ] as const;
        }),
      );

      setClassSubjects(Object.fromEntries(results));
    } catch (subjectError) {
      console.error(
        "Class subjects loading error:",
        subjectError,
      );
      setClassSubjects({});
      setError(
        subjectError instanceof Error
          ? subjectError.message
          : "Unable to load class subjects.",
      );
    }
  }

  async function loadSectionSubjects(sectionRecords: SectionRecord[]) {
    if (sectionRecords.length === 0) {
      setSectionSubjects({});
      return;
    }

    try {
      const results = await Promise.all(
        sectionRecords.map(async (section) => {
          const response = await fetch(
            `/api/section-subjects?section_id=${encodeURIComponent(section.id)}`,
            {
              credentials: "include",
              cache: "no-store",
            },
          );

          const data = await response.json();

          if (!response.ok) {
            throw new Error(
              data?.error ||
                `Unable to load subjects for Section ${section.name}.`,
            );
          }

          return [
            section.id,
            (data?.sectionSubjects ?? []) as SectionSubjectRecord[],
          ] as const;
        }),
      );

      setSectionSubjects(Object.fromEntries(results));
    } catch (sectionSubjectError) {
      console.error(
        "Section subjects loading error:",
        sectionSubjectError,
      );
      setSectionSubjects({});
      setError(
        sectionSubjectError instanceof Error
          ? sectionSubjectError.message
          : "Unable to load section subjects.",
      );
    }
  }

  async function saveSectionSubjects(
    sectionId: string,
    classId: string,
    selectedSubjectIds: string[],
  ) {
    try {
      setSavingSectionSubjects((current) => ({
        ...current,
        [sectionId]: true,
      }));
      setError("");

      const currentAssignments = sectionSubjects[sectionId] ?? [];
      const currentBySubjectId = new Map(
        currentAssignments.map((assignment) => [
          assignment.subject_id,
          assignment,
        ]),
      );

      const selectedIds = new Set(selectedSubjectIds);

      for (const subjectId of selectedIds) {
        const existing = currentBySubjectId.get(subjectId);

        if (existing) {
          if (existing.status !== "ACTIVE") {
            const response = await fetch(
              `/api/section-subjects/${encodeURIComponent(existing.id)}`,
              {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                  status: "ACTIVE",
                }),
              },
            );

            const data = await response.json().catch(() => null);

            if (!response.ok) {
              throw new Error(
                data?.error ||
                  "Unable to reactivate section subject assignment.",
              );
            }
          }

          continue;
        }

        const response = await fetch("/api/section-subjects", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            class_id: classId,
            section_id: sectionId,
            subject_id: subjectId,
          }),
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(
            data?.error ||
              "Unable to assign subject to section.",
          );
        }
      }

      for (const assignment of currentAssignments) {
        if (
          assignment.status === "ACTIVE" &&
          !selectedIds.has(assignment.subject_id)
        ) {
          const response = await fetch(
            `/api/section-subjects/${encodeURIComponent(assignment.id)}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({
                status: "INACTIVE",
              }),
            },
          );

          const data = await response.json().catch(() => null);

          if (!response.ok) {
            throw new Error(
              data?.error ||
                "Unable to deactivate section subject assignment.",
            );
          }
        }
      }

      await loadSectionSubjects(
        sections.filter((section) => section.id === sectionId),
      );
    } catch (sectionSubjectError) {
      console.error(
        "Section subject save error:",
        sectionSubjectError,
      );
      setError(
        sectionSubjectError instanceof Error
          ? sectionSubjectError.message
          : "Unable to save section subjects.",
      );
    } finally {
      setSavingSectionSubjects((current) => ({
        ...current,
        [sectionId]: false,
      }));
    }
  }

  async function saveClassSubjects(
    classId: string,
    selectedSubjectIds: string[],
  ) {
    try {
      setSavingSubjects((current) => ({
        ...current,
        [classId]: true,
      }));
      setError("");

      const currentAssignments = classSubjects[classId] ?? [];

      const currentBySubjectId = new Map(
        currentAssignments.map((assignment) => [
          assignment.subject_id,
          assignment,
        ]),
      );

      const selectedIds = new Set(selectedSubjectIds);

      // Create or reactivate selected subjects.
      for (const subjectId of selectedIds) {
        const existing = currentBySubjectId.get(subjectId);

        if (existing) {
          if (existing.status !== "ACTIVE") {
            const response = await fetch(
              `/api/class-subjects/${encodeURIComponent(existing.id)}`,
              {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                  status: "ACTIVE",
                }),
              },
            );

            const data = await response.json().catch(() => null);

            if (!response.ok) {
              throw new Error(
                data?.error ||
                  "Unable to reactivate subject assignment.",
              );
            }
          }

          continue;
        }

        // New assignment: actually create the class-subject record.
        const response = await fetch("/api/class-subjects", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            class_id: classId,
            subject_id: subjectId,
          }),
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(
            data?.error ||
              "Unable to assign subject to class.",
          );
        }
      }

      // Deactivate subjects that were previously active but are
      // no longer selected.
      for (const assignment of currentAssignments) {
        if (
          assignment.status === "ACTIVE" &&
          !selectedIds.has(assignment.subject_id)
        ) {
          const response = await fetch(
            `/api/class-subjects/${encodeURIComponent(assignment.id)}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({
                status: "INACTIVE",
              }),
            },
          );

          const data = await response.json().catch(() => null);

          if (!response.ok) {
            throw new Error(
              data?.error ||
                "Unable to remove subject assignment.",
            );
          }
        }
      }

      // Reload from the database so the UI reflects the real state.
      const response = await fetch(
        `/api/class-subjects?class_id=${encodeURIComponent(classId)}`,
        {
          credentials: "include",
          cache: "no-store",
        },
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Unable to refresh class subjects.",
        );
      }

      setClassSubjects((current) => ({
        ...current,
        [classId]: data?.classSubjects ?? [],
      }));
    } catch (saveError) {
      console.error(
        "Class subject save error:",
        saveError,
      );

      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save class subjects.",
      );
    } finally {
      setSavingSubjects((current) => ({
        ...current,
        [classId]: false,
      }));
    }
  }

  async function loadRosterStudents() {
    try {
      setRosterLoading(true);

      const response = await fetch("/api/students", {
        credentials: "include",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to load student roster.",
        );
      }

      setRosterStudents(data?.students ?? []);
    } catch (rosterError) {
      console.error(
        "Classes student roster loading error:",
        rosterError,
      );
      setRosterStudents([]);
      setError(
        rosterError instanceof Error
          ? rosterError.message
          : "Unable to load student roster.",
      );
    } finally {
      setRosterLoading(false);
    }
  }

  async function refreshClasses(yearId = selectedYearId) {
    if (!yearId) {
      setClasses([]);
      setSections([]);
      return;
    }

    const response = await fetch(
      `/api/classes?academic_year_id=${encodeURIComponent(yearId)}`,
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

    const nextClasses: ClassRecord[] =
      data?.classes ?? [];

    setClasses(nextClasses);

    await loadSections(nextClasses);
  }

  useEffect(() => {
    let cancelled = false;

    async function loadInitialData() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "/api/academic-years",
          {
            credentials: "include",
            cache: "no-store",
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error ||
              "Unable to load academic years.",
          );
        }

        if (cancelled) {
          return;
        }

        const years: AcademicYear[] =
          data?.academicYears ?? [];

        setAcademicYears(years);

        const initialYearId =
          years.length > 0 ? years[0].id : "";

        setSelectedYearId(initialYearId);
        void loadSubjects();

        await loadRosterStudents();

      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load classes.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadInitialData();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (loading || !selectedYearId) {
      return;
    }

    let cancelled = false;

    async function loadSelectedYear() {
      try {
        setError("");

        await refreshClasses(selectedYearId);

        const response = await fetch(
          `/api/classes?academic_year_id=${encodeURIComponent(selectedYearId)}`,
          {
            credentials: "include",
            cache: "no-store",
          },
        );

        const data = await response.json();

        if (response.ok) {
          await loadClassSubjects(
            data?.classes ?? [],
          );
        }

        if (cancelled) {
          return;
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load classes.",
          );
        }
      }
    }

    void loadSelectedYear();

    return () => {
      cancelled = true;
    };
  }, [selectedYearId, loading]);

  async function createAcademicYear(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!yearName.trim()) {
      setError("Academic year name is required.");
      return;
    }

    try {
      setSavingYear(true);
      setError("");

      const response = await fetch(
        "/api/academic-years",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            name: yearName.trim(),
            start_date: yearStart || null,
            end_date: yearEnd || null,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Unable to create academic year.",
        );
      }

      const created: AcademicYear =
        data.academicYear;

      setAcademicYears((current) => [
        created,
        ...current,
      ]);

      setSelectedYearId(created.id);

      setYearName("");
      setYearStart("");
      setYearEnd("");
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to create academic year.",
      );
    } finally {
      setSavingYear(false);
    }
  }

  async function createClass(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!selectedYearId) {
      setError("Please create or select an academic year.");
      return;
    }

    if (!className.trim()) {
      setError("Class name is required.");
      return;
    }

    try {
      setSavingClass(true);
      setError("");

      const response = await fetch("/api/classes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          academic_year_id: selectedYearId,
          name: className.trim(),
          display_order:
            Number.parseInt(classOrder, 10) || 0,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to create class.",
        );
      }

      setClassName("");
      setClassOrder("0");

      await refreshClasses(selectedYearId);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to create class.",
      );
    } finally {
      setSavingClass(false);
    }
  }

  async function createSection(classId: string) {
    const name = (
      sectionNames[classId] || ""
    ).trim();

    if (!name) {
      setError("Section name is required.");
      return;
    }

    try {
      setSavingSection((current) => ({
        ...current,
        [classId]: true,
      }));

      setError("");

      const response = await fetch("/api/sections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          class_id: classId,
          name,
          display_order: 0,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to create section.",
        );
      }

      setSectionNames((current) => ({
        ...current,
        [classId]: "",
      }));

      await refreshClasses(selectedYearId);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to create section.",
      );
    } finally {
      setSavingSection((current) => ({
        ...current,
        [classId]: false,
      }));
    }
  }

  const selectedYear = useMemo(
    () =>
      academicYears.find(
        (year) => year.id === selectedYearId,
      ) ?? null,
    [academicYears, selectedYearId],
  );

  const sectionsByClass = useMemo(() => {
    const map = new Map<string, SectionRecord[]>();

    for (const section of sections) {
      const current = map.get(section.class_id) ?? [];
      current.push(section);
      map.set(section.class_id, current);
    }

    return map;
  }, [sections]);

  const studentsBySection = useMemo(() => {
    const map = new Map<string, StudentRosterRecord[]>();

    for (const student of rosterStudents) {
      const enrollment = student.enrollment;

      if (!enrollment) {
        continue;
      }

      if (enrollment.status !== "ACTIVE") {
        continue;
      }

      if (enrollment.academic_year_id !== selectedYearId) {
        continue;
      }

      if (!enrollment.class_id || !enrollment.section_id) {
        continue;
      }

      const current = map.get(enrollment.section_id) ?? [];
      current.push(student);
      map.set(enrollment.section_id, current);
    }

    return map;
  }, [rosterStudents, selectedYearId]);


  return (
    <main className="min-h-screen bg-[#F8FAFC] px-6 py-8">
      <div className="mx-auto max-w-7xl">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Academics
          </p>

          <div className="mt-2 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-950">
                Classes & Sections
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-slate-500">
                Manage academic years, classes and
                sections for your school.
              </p>
            </div>

            {selectedYear && (
              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm">
                <div className="text-xs font-medium text-slate-400">
                  Active Academic Year
                </div>
                <div className="mt-1 font-semibold text-slate-900">
                  {selectedYear.name}
                </div>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <h2 className="text-lg font-bold text-slate-950">
                Academic Year
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Select the academic year you want to manage.
              </p>
            </div>

            <div className="mt-5">
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Current year
              </label>

              <select
                value={selectedYearId}
                onChange={(event) =>
                  setSelectedYearId(event.target.value)
                }
                disabled={loading}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500 disabled:bg-slate-50"
              >
                <option value="">
                  Select academic year
                </option>

                {academicYears.map((year) => (
                  <option key={year.id} value={year.id}>
                    {year.name}
                  </option>
                ))}
              </select>
            </div>

            <form
              onSubmit={createAcademicYear}
              className="mt-6 border-t border-slate-100 pt-6"
            >
              <h3 className="text-sm font-bold text-slate-900">
                Add Academic Year
              </h3>

              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <input
                  value={yearName}
                  onChange={(event) =>
                    setYearName(event.target.value)
                  }
                  placeholder="2026–27"
                  className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                />

                <input
                  type="date"
                  value={yearStart}
                  onChange={(event) =>
                    setYearStart(event.target.value)
                  }
                  className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                />

                <input
                  type="date"
                  value={yearEnd}
                  onChange={(event) =>
                    setYearEnd(event.target.value)
                  }
                  className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                />
              </div>

              <button
                type="submit"
                disabled={savingYear}
                className="mt-4 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {savingYear
                  ? "Creating..."
                  : "Add Academic Year"}
              </button>
            </form>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <h2 className="text-lg font-bold text-slate-950">
                Add Class
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Create a class inside the selected academic
                year.
              </p>
            </div>

            <form
              onSubmit={createClass}
              className="mt-5"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Class name
                  </label>

                  <input
                    value={className}
                    onChange={(event) =>
                      setClassName(event.target.value)
                    }
                    placeholder="Grade 1"
                    disabled={!selectedYearId}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-500 disabled:bg-slate-50"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Display order
                  </label>

                  <input
                    type="number"
                    value={classOrder}
                    onChange={(event) =>
                      setClassOrder(event.target.value)
                    }
                    disabled={!selectedYearId}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-500 disabled:bg-slate-50"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={
                  savingClass || !selectedYearId
                }
                className="mt-4 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {savingClass
                  ? "Creating..."
                  : "Add Class"}
              </button>
            </form>
          </div>
        </section>

        <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-950">
                  Classes
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {selectedYear
                    ? `${selectedYear.name} · ${classes.length} class${classes.length === 1 ? "" : "es"}`
                    : "Select an academic year"}
                </p>
              </div>

              {loading && (
                <span className="text-sm text-slate-400">
                  Loading...
                </span>
              )}
            </div>
          </div>

          {!loading && classes.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <div className="text-sm font-semibold text-slate-700">
                No classes yet
              </div>
              <p className="mt-1 text-sm text-slate-500">
                Add the first class for this academic year.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {classes.map((classRecord) => {
                const classSections =
                  sectionsByClass.get(
                    classRecord.id,
                  ) ?? [];

                return (
                  <div
                    key={classRecord.id}
                    className="p-6"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-bold text-slate-950">
                            {classRecord.name}
                          </h3>

                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                            {classRecord.status}
                          </span>
                        </div>

                        <p className="mt-1 text-sm text-slate-500">
                          {classSections.length} section
                          {classSections.length === 1
                            ? ""
                            : "s"}
                        </p>
                      </div>

                      <div className="w-full lg:max-w-2xl">
                        {classSections.length === 0 ? (
                          <span className="text-sm text-slate-400">
                            No sections
                          </span>
                        ) : (
                          <div className="grid gap-3 sm:grid-cols-2">
                            {classSections.map((section) => {
                              const sectionStudents =
                                studentsBySection.get(section.id) ?? [];

                              return (
                                <div
                                  key={section.id}
                                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                                >
                                  <div className="flex items-center justify-between gap-3">
                                    <div>
                                      <p className="font-semibold text-slate-900">
                                        Section {section.name}
                                      </p>
                                      <p className="mt-1 text-xs text-slate-500">
                                        {sectionStudents.length}{" "}
                                        {sectionStudents.length === 1
                                          ? "student"
                                          : "students"}
                                      </p>
                                    </div>

                                    <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-600">
                                      {section.status}
                                    </span>
                                  </div>

                                  {rosterLoading ? (
                                    <p className="mt-3 text-xs text-slate-400">
                                      Loading students...
                                    </p>
                                  ) : sectionStudents.length === 0 ? (
                                    <p className="mt-3 text-xs text-slate-400">
                                      No students enrolled
                                    </p>
                                  ) : (
                                    <div className="mt-3 space-y-2">
                                      {sectionStudents.map((student) => (
                                        <div
                                          key={student.id}
                                          className="flex items-center justify-between gap-3 rounded-lg bg-white px-3 py-2"
                                        >
                                          <div className="min-w-0">
                                            <p className="truncate text-sm font-medium text-slate-900">
                                              {student.name}
                                            </p>
                                            <p className="mt-0.5 text-xs text-slate-500">
                                              Roll{" "}
                                              {student.enrollment?.roll_number ||
                                                student.rollNumber ||
                                                "—"}
                                            </p>
                                          </div>

                                          <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600">
                                            {student.enrollment?.status ||
                                              student.status}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  <div className="mt-4 border-t border-slate-200 pt-4">
                                    <div className="flex items-center justify-between gap-3">
                                      <div>
                                        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                                          Link Subjects
                                        </p>
                                        <p className="mt-1 text-xs text-slate-400">
                                          Assign subjects taught in this section.
                                        </p>
                                      </div>

                                      <span className="text-xs font-semibold text-slate-400">
                                        {(sectionSubjects[section.id] ?? []).filter(
                                          (assignment) =>
                                            assignment.status === "ACTIVE",
                                        ).length}{" "}
                                        assigned
                                      </span>
                                    </div>

                                    {subjectsLoading ? (
                                      <p className="mt-3 text-xs text-slate-400">
                                        Loading subjects...
                                      </p>
                                    ) : subjects.length === 0 ? (
                                      <p className="mt-3 text-xs text-slate-400">
                                        No active subjects are available.
                                      </p>
                                    ) : (
                                      <div className="mt-3 grid gap-2">
                                        {subjects
                                          .filter(
                                            (subject) =>
                                              subject.status === "ACTIVE",
                                          )
                                          .map((subject) => {
                                            const assignments =
                                              sectionSubjects[section.id] ?? [];

                                            const existing =
                                              assignments.find(
                                                (assignment) =>
                                                  assignment.subject_id ===
                                                  subject.id,
                                              );

                                            const checked =
                                              existing?.status === "ACTIVE";

                                            return (
                                              <label
                                                key={`${section.id}-${subject.id}`}
                                                className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2.5 hover:bg-slate-50"
                                              >
                                                <input
                                                  type="checkbox"
                                                  checked={checked}
                                                  onChange={(event) => {
                                                    setSectionSubjects(
                                                      (current) => {
                                                        const currentAssignments =
                                                          current[section.id] ??
                                                          [];

                                                        const existingAssignment =
                                                          currentAssignments.find(
                                                            (assignment) =>
                                                              assignment.subject_id ===
                                                              subject.id,
                                                          );

                                                        if (existingAssignment) {
                                                          return {
                                                            ...current,
                                                            [section.id]:
                                                              currentAssignments.map(
                                                                (assignment) =>
                                                                  assignment.subject_id ===
                                                                  subject.id
                                                                    ? {
                                                                        ...assignment,
                                                                        status:
                                                                          event
                                                                            .target
                                                                            .checked
                                                                            ? "ACTIVE"
                                                                            : "INACTIVE",
                                                                      }
                                                                    : assignment,
                                                              ),
                                                          };
                                                        }

                                                        if (
                                                          !event.target.checked
                                                        ) {
                                                          return current;
                                                        }

                                                        return {
                                                          ...current,
                                                          [section.id]: [
                                                            ...currentAssignments,
                                                            {
                                                              id: "",
                                                              class_id:
                                                                classRecord.id,
                                                              section_id:
                                                                section.id,
                                                              subject_id:
                                                                subject.id,
                                                              status: "ACTIVE",
                                                              subjects: subject,
                                                            },
                                                          ],
                                                        };
                                                      },
                                                    );
                                                  }}
                                                  className="h-4 w-4 rounded border-slate-300"
                                                />

                                                <span className="min-w-0">
                                                  <span className="block truncate text-sm font-semibold text-slate-800">
                                                    {subject.name}
                                                  </span>
                                                  <span className="mt-0.5 block text-xs text-slate-400">
                                                    {subject.code || "No code"}
                                                  </span>
                                                </span>
                                              </label>
                                            );
                                          })}
                                      </div>
                                    )}

                                    <button
                                      type="button"
                                      onClick={() => {
                                        const selectedIds = (
                                          sectionSubjects[section.id] ?? []
                                        )
                                          .filter(
                                            (assignment) =>
                                              assignment.status === "ACTIVE",
                                          )
                                          .map(
                                            (assignment) =>
                                              assignment.subject_id,
                                          );

                                        void saveSectionSubjects(
                                          section.id,
                                          classRecord.id,
                                          selectedIds,
                                        );
                                      }}
                                      disabled={
                                        subjectsLoading ||
                                        savingSectionSubjects[section.id] ===
                                          true
                                      }
                                      className="mt-3 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                      {savingSectionSubjects[section.id]
                                        ? "Saving..."
                                        : "Save Subjects"}
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-5 border-t border-slate-100 pt-5">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">
                            Subjects
                          </h4>
                          <p className="mt-1 text-xs text-slate-500">
                            Assign subjects taught for this class.
                          </p>
                        </div>
                        <span className="text-xs font-semibold text-slate-400">
                          {(classSubjects[classRecord.id] ?? []).filter(
                            (assignment) =>
                              assignment.status === "ACTIVE",
                          ).length}{" "}
                          assigned
                        </span>
                      </div>

                      {subjectsLoading ? (
                        <p className="mt-4 text-xs text-slate-400">
                          Loading subjects...
                        </p>
                      ) : subjects.length === 0 ? (
                        <p className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-4 text-xs text-slate-500">
                          No active subjects are available. Add an active subject from Academics → Subjects, then return here to assign it.
                        </p>
                      ) : (
                        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                          {subjects
                            .filter(
                              (subject) =>
                                subject.status === "ACTIVE",
                            )
                            .map((subject) => {
                              const assignment = (
                                classSubjects[classRecord.id] ?? []
                              ).find(
                                (item) =>
                                  item.subject_id === subject.id,
                              );

                              const checked =
                                assignment?.status === "ACTIVE";

                              return (
                                <label
                                  key={subject.id}
                                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3 hover:bg-slate-50"
                                >
                                  <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={(event) => {
                                      const activeAssignments =
                                        (
                                          classSubjects[
                                            classRecord.id
                                          ] ?? []
                                        ).filter(
                                          (item) =>
                                            item.status === "ACTIVE",
                                        );

                                      const selectedIds =
                                        activeAssignments.map(
                                          (item) =>
                                            item.subject_id,
                                        );

                                      const nextIds = event.target.checked
                                        ? Array.from(
                                            new Set([
                                              ...selectedIds,
                                              subject.id,
                                            ]),
                                          )
                                        : selectedIds.filter(
                                            (id) =>
                                              id !== subject.id,
                                          );

                                      setClassSubjects(
                                        (current) => {
                                          const assignments =
                                            current[
                                              classRecord.id
                                            ] ?? [];

                                          const existing =
                                            assignments.find(
                                              (item) =>
                                                item.subject_id ===
                                                subject.id,
                                            );

                                          if (existing) {
                                            return {
                                              ...current,
                                              [classRecord.id]:
                                                assignments.map(
                                                  (item) =>
                                                    item.subject_id ===
                                                    subject.id
                                                      ? {
                                                          ...item,
                                                          status:
                                                            event.target
                                                              .checked
                                                              ? "ACTIVE"
                                                              : "INACTIVE",
                                                        }
                                                      : item,
                                                ),
                                            };
                                          }

                                          if (!event.target.checked) {
                                            return current;
                                          }

                                          return {
                                            ...current,
                                            [classRecord.id]: [
                                              ...assignments,
                                              {
                                                id: "",
                                                class_id:
                                                  classRecord.id,
                                                subject_id:
                                                  subject.id,
                                                status: "ACTIVE",
                                                subjects: subject,
                                              },
                                            ],
                                          };
                                        },
                                      );
                                    }}
                                    className="h-4 w-4 rounded border-slate-300"
                                  />

                                  <span className="min-w-0">
                                    <span className="block truncate text-sm font-semibold text-slate-800">
                                      {subject.name}
                                    </span>
                                    <span className="mt-0.5 block text-xs text-slate-400">
                                      {subject.code || "No code"}
                                    </span>
                                  </span>
                                </label>
                              );
                            })}
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          const selectedIds = (
                            classSubjects[classRecord.id] ?? []
                          )
                            .filter(
                              (assignment) =>
                                assignment.status === "ACTIVE",
                            )
                            .map(
                              (assignment) =>
                                assignment.subject_id,
                            );

                          void saveClassSubjects(
                            classRecord.id,
                            selectedIds,
                          );
                        }}
                        disabled={
                          subjectsLoading ||
                          savingSubjects[classRecord.id] === true
                        }
                        className="mt-4 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {savingSubjects[classRecord.id]
                          ? "Saving..."
                          : "Save Subjects"}
                      </button>
                    </div>

                    <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row">
                      <input
                        value={
                          sectionNames[
                            classRecord.id
                          ] ?? ""
                        }
                        onChange={(event) =>
                          setSectionNames(
                            (current) => ({
                              ...current,
                              [classRecord.id]:
                                event.target.value,
                            }),
                          )
                        }
                        placeholder="Section name, e.g. A"
                        className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-500 sm:max-w-xs"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          void createSection(
                            classRecord.id,
                          )
                        }
                        disabled={
                          savingSection[
                            classRecord.id
                          ] === true
                        }
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {savingSection[
                          classRecord.id
                        ]
                          ? "Adding..."
                          : "Add Section"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
