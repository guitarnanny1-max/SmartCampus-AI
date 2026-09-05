"use client";

import { useEffect, useMemo, useState } from "react";

type Exam = {
  id: string;
  name: string;
  exam_type: string;
  academic_year_id: string;
  start_date: string | null;
  end_date: string | null;
  status: string;
};

type ExamSubject = {
  id: string;
  subject_id: string;
  max_marks: number;
  pass_marks: number;
  subject?: {
    id: string;
    name: string;
    code: string | null;
  } | null;
};

type ClassItem = {
  id: string;
  name: string;
  grade?: string | null;
  academic_year_id?: string | null;
};

type Section = {
  id: string;
  name: string;
  class_id: string;
};

type SubjectResult = {
  exam_subject_id: string;
  subject_id: string;
  subject?: {
    id: string;
    name: string;
    code: string | null;
  } | null;
  max_marks: number;
  pass_marks: number;
  marks_obtained: number | null;
  percentage: number | null;
  grade: string | null;
  remarks: string | null;
  entered: boolean;
};

type StudentResult = {
  student: {
    id: string;
    name: string;
    admission_number: string | null;
    parentEmail: string | null;
    status: string;
  };
  subjects: SubjectResult[];
  summary: {
    subjects_total: number;
    subjects_entered: number;
    total_marks: number;
    total_max_marks: number;
    percentage: number | null;
    passed: boolean | null;
    grade?: string | null;
    grade_point?: number | null;
  };
};

export default function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [examId, setExamId] = useState("");

  const [exam, setExam] = useState<Exam | null>(null);
  const [examSubjects, setExamSubjects] = useState<ExamSubject[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [results, setResults] = useState<StudentResult[]>([]);

  const [classId, setClassId] = useState("");
  const [sectionId, setSectionId] = useState("");

  const [loading, setLoading] = useState(true);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedStudentId, setSelectedStudentId] =
    useState("");

  useEffect(() => {
    params.then((value) => setExamId(value.id));
  }, [params]);

  useEffect(() => {
    if (!examId) return;

    async function loadInitialData() {
      try {
        setLoading(true);
        setError("");

        const [examResponse, subjectsResponse, classesResponse] =
          await Promise.all([
            fetch("/api/exams"),
            fetch(`/api/exams/${examId}/subjects`),
            fetch("/api/classes"),
          ]);

        const examData = await examResponse.json();
        const subjectsData = await subjectsResponse.json();
        const classesData = await classesResponse.json();

        if (!examResponse.ok || !examData.success) {
          throw new Error(
            examData.error || "Unable to load examination."
          );
        }

        if (!subjectsResponse.ok || !subjectsData.success) {
          throw new Error(
            subjectsData.error ||
              "Unable to load examination subjects."
          );
        }

        if (!classesResponse.ok || !classesData.success) {
          throw new Error(
            classesData.error || "Unable to load classes."
          );
        }

        const currentExam = (examData.exams || []).find(
          (item: Exam) => item.id === examId
        );

        setExam(currentExam || null);
        setExamSubjects(subjectsData.examSubjects || []);

        const filteredClasses = (classesData.classes || []).filter(
          (item: ClassItem) =>
            !currentExam?.academic_year_id ||
            !item.academic_year_id ||
            item.academic_year_id ===
              currentExam.academic_year_id
        );

        setClasses(filteredClasses);
      } catch (err: any) {
        setError(
          err?.message || "Unable to load examination results."
        );
      } finally {
        setLoading(false);
      }
    }

    loadInitialData();
  }, [examId]);

  useEffect(() => {
    if (!classId) {
      setSections([]);
      setSectionId("");
      return;
    }

    async function loadSections() {
      try {
        const response = await fetch(
          `/api/sections?class_id=${encodeURIComponent(classId)}`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.error || "Unable to load sections."
          );
        }

        setSections(data.sections || []);
      } catch (err: any) {
        setError(err?.message || "Unable to load sections.");
        setSections([]);
      }
    }

    loadSections();
  }, [classId]);

  async function loadResults() {
    if (!examId || !classId || !sectionId) {
      setResults([]);
      return;
    }

    try {
      setResultsLoading(true);
      setError("");

      const query = new URLSearchParams({
        class_id: classId,
        section_id: sectionId,
      });

      const response = await fetch(
        `/api/exams/${examId}/results?${query.toString()}`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Unable to load results."
        );
      }

      const loadedResults = data.students || [];

      setResults(loadedResults);

      if (
        loadedResults.length > 0 &&
        !loadedResults.some(
          (item: StudentResult) =>
            item.student.id === selectedStudentId
        )
      ) {
        setSelectedStudentId(loadedResults[0].student.id);
      }
    } catch (err: any) {
      setError(
        err?.message || "Unable to load examination results."
      );
      setResults([]);
    } finally {
      setResultsLoading(false);
    }
  }

  useEffect(() => {
    loadResults();
  }, [examId, classId, sectionId]);

  const selectedResult = useMemo(
    () =>
      results.find(
        (item) => item.student.id === selectedStudentId
      ) || null,
    [results, selectedStudentId]
  );

  if (loading) {
    return (
      <div className="p-8 text-center text-sm text-slate-500">
        Loading results...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6">
          <a
            href={`/app/exams/${examId}/marks`}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            ← Back to Student Marks
          </a>
        </div>

        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
              Academic Management
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Student Results
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              {exam?.name ||
                "Examination"}{" "}
              — review student academic performance.
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Class
              </span>

              <select
                value={classId}
                onChange={(e) => {
                  setClassId(e.target.value);
                  setSelectedStudentId("");
                  setResults([]);
                }}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              >
                <option value="">Select class</option>

                {classes.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Section
              </span>

              <select
                value={sectionId}
                onChange={(e) => {
                  setSectionId(e.target.value);
                  setSelectedStudentId("");
                }}
                disabled={!classId}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 disabled:bg-slate-100"
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

          {exam && (
            <div className="mt-5 grid gap-3 md:grid-cols-4">
              <div className="rounded-xl bg-blue-50 p-4">
                <p className="text-xs text-blue-600">
                  Examination
                </p>
                <p className="mt-1 font-semibold text-blue-900">
                  {exam.name}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">
                  Exam Type
                </p>
                <p className="mt-1 font-semibold text-slate-900">
                  {exam.exam_type}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">
                  Subjects
                </p>
                <p className="mt-1 font-semibold text-slate-900">
                  {examSubjects.length}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">
                  Status
                </p>
                <p className="mt-1 font-semibold text-slate-900">
                  {exam.status}
                </p>
              </div>
            </div>
          )}
        </section>

        {resultsLoading ? (
          <section className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <p className="text-sm text-slate-500">
              Loading student results...
            </p>
          </section>
        ) : classId && sectionId ? (
          <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 p-5">
                <h2 className="font-semibold text-slate-900">
                  Students
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {results.length} result
                  {results.length === 1 ? "" : "s"}
                </p>
              </div>

              {results.length === 0 ? (
                <div className="p-8 text-center text-sm text-slate-500">
                  No enrolled students found.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {results.map((result) => {
                    const active =
                      result.student.id === selectedStudentId;

                    return (
                      <button
                        key={result.student.id}
                        type="button"
                        onClick={() =>
                          setSelectedStudentId(
                            result.student.id
                          )
                        }
                        className={`w-full px-5 py-4 text-left transition ${
                          active
                            ? "bg-blue-50"
                            : "hover:bg-slate-50"
                        }`}
                      >
                        <div className="font-semibold text-slate-900">
                          {result.student.name}
                        </div>

                        <div className="mt-1 text-xs text-slate-500">
                          {result.student.admission_number ||
                            "No admission number"}
                        </div>

                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-xs text-slate-500">
                            {result.summary.total_marks}/
                            {result.summary.total_max_marks}
                          </span>

                          <span className="text-xs font-semibold text-blue-700">
                            {result.summary.percentage !==
                            null
                              ? `${result.summary.percentage.toFixed(
                                  1
                                )}%`
                              : "Pending"}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </section>

            {selectedResult && (
              <section className="space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                        Student Result
                      </p>

                      <h2 className="mt-1 text-2xl font-bold text-slate-900">
                        {selectedResult.student.name}
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        Admission No:{" "}
                        {selectedResult.student
                          .admission_number || "—"}
                      </p>
                    </div>

                    <div
                      className={`rounded-full px-4 py-2 text-sm font-bold ${
                        selectedResult.summary.passed ===
                        true
                          ? "bg-emerald-50 text-emerald-700"
                          : selectedResult.summary.passed ===
                            false
                          ? "bg-red-50 text-red-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {selectedResult.summary.passed === true
                        ? "PASS"
                        : selectedResult.summary.passed ===
                          false
                        ? "FAIL"
                        : "PENDING"}
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-xs text-slate-500">
                        Total Marks
                      </p>
                      <p className="mt-1 text-xl font-bold text-slate-900">
                        {selectedResult.summary.total_marks}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-xs text-slate-500">
                        Maximum
                      </p>
                      <p className="mt-1 text-xl font-bold text-slate-900">
                        {
                          selectedResult.summary
                            .total_max_marks
                        }
                      </p>
                    </div>

                    <div className="rounded-xl bg-blue-50 p-4">
                      <p className="text-xs text-blue-600">
                        Percentage
                      </p>
                      <p className="mt-1 text-xl font-bold text-blue-900">
                        {selectedResult.summary.percentage !==
                        null
                          ? `${selectedResult.summary.percentage.toFixed(
                              2
                            )}%`
                          : "—"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-indigo-50 p-4">
                      <p className="text-xs text-indigo-600">
                        Grade
                      </p>
                      <p className="mt-1 text-xl font-bold text-indigo-900">
                        {selectedResult.summary.grade ||
                          "—"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-emerald-50 p-4">
                      <p className="text-xs text-emerald-600">
                        Grade Point
                      </p>
                      <p className="mt-1 text-xl font-bold text-emerald-900">
                        {selectedResult.summary.grade_point ??
                          "—"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-200 p-5">
                    <h2 className="font-semibold text-slate-900">
                      Subject-wise Performance
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      {selectedResult.summary.subjects_entered}{" "}
                      of{" "}
                      {selectedResult.summary.subjects_total}{" "}
                      subjects have marks entered.
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[850px]">
                      <thead className="bg-slate-50">
                        <tr className="border-b border-slate-200 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          <th className="px-5 py-4">
                            Subject
                          </th>
                          <th className="px-5 py-4">
                            Marks
                          </th>
                          <th className="px-5 py-4">
                            Percentage
                          </th>
                          <th className="px-5 py-4">
                            Grade
                          </th>
                          <th className="px-5 py-4">
                            Status
                          </th>
                          <th className="px-5 py-4">
                            Remarks
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-200">
                        {selectedResult.subjects.map(
                          (subject) => {
                            const passed =
                              subject.marks_obtained !==
                                null &&
                              subject.marks_obtained >=
                                subject.pass_marks;

                            return (
                              <tr
                                key={
                                  subject.exam_subject_id
                                }
                                className="hover:bg-slate-50"
                              >
                                <td className="px-5 py-4">
                                  <div className="font-semibold text-slate-900">
                                    {subject.subject?.name ||
                                      "Subject"}
                                  </div>

                                  {subject.subject?.code && (
                                    <div className="mt-1 text-xs text-slate-500">
                                      {
                                        subject.subject
                                          .code
                                      }
                                    </div>
                                  )}
                                </td>

                                <td className="px-5 py-4 font-semibold text-slate-900">
                                  {subject.marks_obtained ??
                                    "—"}{" "}
                                  / {subject.max_marks}
                                </td>

                                <td className="px-5 py-4 text-sm text-slate-700">
                                  {subject.percentage !==
                                  null
                                    ? `${subject.percentage.toFixed(
                                        2
                                      )}%`
                                    : "—"}
                                </td>

                                <td className="px-5 py-4">
                                  <span className="font-bold text-blue-700">
                                    {subject.grade || "—"}
                                  </span>
                                </td>

                                <td className="px-5 py-4">
                                  <span
                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                      !subject.entered
                                        ? "bg-amber-50 text-amber-700"
                                        : passed
                                        ? "bg-emerald-50 text-emerald-700"
                                        : "bg-red-50 text-red-700"
                                    }`}
                                  >
                                    {!subject.entered
                                      ? "Pending"
                                      : passed
                                      ? "Pass"
                                      : "Fail"}
                                  </span>
                                </td>

                                <td className="px-5 py-4 text-sm text-slate-600">
                                  {subject.remarks || "—"}
                                </td>
                              </tr>
                            );
                          }
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            )}
          </div>
        ) : (
          <section className="rounded-2xl border border-slate-200 bg-white p-16 text-center shadow-sm">
            <div className="text-5xl">📊</div>

            <h2 className="mt-5 text-xl font-semibold text-slate-900">
              Select class and section
            </h2>

            <p className="mx-auto mt-2 max-w-lg text-sm text-slate-500">
              Choose a class and section above to review
              student examination results.
            </p>
          </section>
        )}

        <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">
          <h3 className="font-semibold text-blue-900">
            Academic Performance
          </h3>

          <p className="mt-1 text-sm text-blue-800">
            Results are calculated automatically from
            entered examination marks and the configured
            grading scale.
          </p>
        </div>

        <div className="pt-5 text-center text-sm text-slate-400">
          Powered by ThomasG Technologies
        </div>
      </div>
    </div>
  );
}
