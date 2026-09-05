"use client";

import { useEffect, useState } from "react";

type Exam = {
  id: string;
  academic_year_id: string;
  name: string;
  exam_type: string;
  start_date: string | null;
  end_date: string | null;
  status: string;
};

type AcademicYear = {
  id: string;
  name: string;
  status?: string;
};

export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [examType, setExamType] = useState("EXAM");
  const [academicYearId, setAcademicYearId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  async function loadData() {
    setLoading(true);
    setError("");

    try {
      const [examsResponse, yearsResponse] = await Promise.all([
        fetch("/api/exams"),
        fetch("/api/academic-years"),
      ]);

      const examsData = await examsResponse.json();
      const yearsData = await yearsResponse.json();

      if (!examsResponse.ok || !examsData.success) {
        throw new Error(examsData.error || "Unable to load exams.");
      }

      setExams(examsData.exams || []);

      if (yearsResponse.ok && yearsData.success) {
        const years = yearsData.academicYears || yearsData.years || [];
        setAcademicYears(years);

        if (!academicYearId && years.length > 0) {
          const activeYear =
            years.find(
              (year: AcademicYear) =>
                String(year.status || "").toUpperCase() === "ACTIVE"
            ) || years[0];

          setAcademicYearId(activeYear.id);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load exams.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function createExam(event: React.FormEvent) {
    event.preventDefault();

    if (!name.trim()) {
      setError("Exam name is required.");
      return;
    }

    if (!academicYearId) {
      setError("Please select an academic year.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await fetch("/api/exams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          exam_type: examType,
          academic_year_id: academicYearId,
          start_date: startDate || null,
          end_date: endDate || null,
          status: "DRAFT",
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Unable to create exam.");
      }

      setName("");
      setExamType("EXAM");
      setStartDate("");
      setEndDate("");

      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create exam.");
    } finally {
      setSaving(false);
    }
  }

    async function publishExam(examId: string, currentStatus: string) {
    const isPublished = currentStatus === "PUBLISHED";

    const confirmed = window.confirm(
      isPublished
        ? "Move this examination back to Draft? Published marks will become editable again."
        : "Publish this examination? After publishing, student marks will be locked."
    );

    if (!confirmed) return;

    try {
      setPublishingId(examId);

      const response = await fetch(`/api/exams/${examId}/publish`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: isPublished ? "DRAFT" : "PUBLISHED",
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Unable to update examination status."
        );
      }

      setExams((current) =>
        current.map((item) =>
          item.id === examId
            ? {
                ...item,
                status:
                  data.exam?.status ||
                  (isPublished ? "DRAFT" : "PUBLISHED"),
              }
            : item
        )
      );
    } catch (error: any) {
      window.alert(
        error?.message || "Unable to update examination status."
      );
    } finally {
      setPublishingId(null);
    }
  }


  function academicYearName(id: string) {
  return (
      academicYears.find((year) => year.id === id)?.name ||
      id
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <div className="text-sm font-medium text-blue-600">
            Academic Management
          </div>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Exams
          </h1>

          <p className="mt-2 text-slate-600">
            Create and manage examinations, subjects, marks and academic
            performance.
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
              Create Exam
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Add a new examination for an academic year.
            </p>

            <form onSubmit={createExam} className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Academic Year
                </label>

                <select
                  value={academicYearId}
                  onChange={(e) => setAcademicYearId(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                >
                  <option value="">Select academic year</option>

                  {academicYears.map((year) => (
                    <option key={year.id} value={year.id}>
                      {year.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Exam Name
                </label>

                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Example: First Term Examination"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Exam Type
                </label>

                <select
                  value={examType}
                  onChange={(e) => setExamType(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                >
                  <option value="EXAM">Exam</option>
                  <option value="UNIT_TEST">Unit Test</option>
                  <option value="MID_TERM">Mid Term</option>
                  <option value="TERM">Term Examination</option>
                  <option value="FINAL">Final Examination</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Start Date
                  </label>

                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    End Date
                  </label>

                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Creating..." : "Create Exam"}
              </button>
            </form>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Examination List
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {exams.length} examination{exams.length === 1 ? "" : "s"}
                </p>
              </div>

              <button
                onClick={loadData}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Refresh
              </button>
            </div>

            {loading ? (
              <div className="px-6 py-12 text-center text-sm text-slate-500">
                Loading exams...
              </div>
            ) : exams.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <div className="text-4xl">📚</div>

                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  No exams yet
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Create your first examination using the form.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {exams.map((exam) => (
                  <div
                    key={exam.id}
                    className="flex flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-slate-900">
                          {exam.name}
                        </h3>

                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                          {exam.exam_type}
                        </span>

                        <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
                          {exam.status}
                        </span>
                      </div>

                      <div className="mt-2 text-sm text-slate-500">
                        Academic Year:{" "}
                        <span className="font-medium text-slate-700">
                          {academicYearName(exam.academic_year_id)}
                        </span>
                      </div>

                      <div className="mt-1 text-sm text-slate-500">
                        {exam.start_date || "No start date"}
                        {" → "}
                        {exam.end_date || "No end date"}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <a
                        href={`/app/exams/${exam.id}/subjects`}
                        className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
                      >
                        Manage Subjects
                      </a>

                      <a
                        href={`/app/exams/${exam.id}/marks`}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                      >
                        Enter Marks
                      </a>

                      <a
                        href={`/app/exams/${exam.id}/results`}
                        className="rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-green-700 hover:bg-green-100"
                      >
                        Results
                      </a>

                      <a
                        href={`/app/exams/${exam.id}/report-card`}
                        className="rounded-lg border border-purple-200 bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-700 hover:bg-purple-100"
                      >
                        Report Card
                      </a>

                      <button
                        type="button"
                        onClick={() => publishExam(exam.id, exam.status)}
                        disabled={publishingId === exam.id}
                        className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                          exam.status === "PUBLISHED"
                            ? "border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                            : "bg-emerald-600 text-white hover:bg-emerald-700"
                        } disabled:cursor-not-allowed disabled:opacity-50`}
                      >
                        {publishingId === exam.id
                          ? "Updating..."
                          : exam.status === "PUBLISHED"
                            ? "Unpublish"
                            : "Publish Results"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
          <h3 className="font-semibold text-blue-900">
            Exams & Academic Performance
          </h3>

          <p className="mt-1 text-sm text-blue-800">
            Foundation ready: Exams → Subjects → Student Marks → Grading →
            Results.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["01", "Exams", "Create examinations"],
              ["02", "Subjects", "Configure papers & marks"],
              ["03", "Student Marks", "Enter student performance"],
              ["04", "Results", "Grades & report cards"],
            ].map(([number, title, description]) => (
              <div
                key={number}
                className="rounded-xl border border-blue-100 bg-white p-4"
              >
                <div className="text-xs font-bold text-blue-600">
                  {number}
                </div>

                <div className="mt-1 font-semibold text-slate-900">
                  {title}
                </div>

                <div className="mt-1 text-xs text-slate-500">
                  {description}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 text-center text-sm text-slate-400">
          Powered by ThomasG Technologies
        </div>
      </div>
    </div>
  );
}
