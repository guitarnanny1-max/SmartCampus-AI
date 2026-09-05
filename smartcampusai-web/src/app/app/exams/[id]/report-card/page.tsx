"use client";

import { useEffect, useState } from "react";

type Result = {
  student: {
    id: string;
    name: string;
    admission_number: string | null;
    parentEmail: string | null;
  };
  subjects: Array<{
    exam_subject_id: string;
    subject?: {
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
  }>;
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

type Exam = {
  id: string;
  name: string;
  exam_type: string;
  academic_year_id: string;
  start_date: string | null;
  end_date: string | null;
  status: string;
};

export default function ReportCardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [examId, setExamId] = useState("");
  const [exam, setExam] = useState<Exam | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");

  const [loading, setLoading] = useState(true);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    params.then((value) => setExamId(value.id));
  }, [params]);

  useEffect(() => {
    if (!examId) return;

    async function loadExam() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/exams");
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.error || "Unable to load examination."
          );
        }

        const currentExam = (data.exams || []).find(
          (item: Exam) => item.id === examId
        );

        if (!currentExam) {
          throw new Error("Examination not found.");
        }

        setExam(currentExam);
      } catch (err: any) {
        setError(
          err?.message || "Unable to load examination."
        );
      } finally {
        setLoading(false);
      }
    }

    loadExam();
  }, [examId]);

  async function loadResults() {
    if (!examId) return;

    try {
      setResultsLoading(true);
      setError("");

      /*
       * We first load the existing results through the same
       * Results API used by the Student Results screen.
       *
       * The API requires class + section for a group result.
       * The report-card screen therefore discovers the first
       * available result through the existing results workflow.
       */

      const classesResponse = await fetch("/api/classes");
      const classesData = await classesResponse.json();

      if (!classesResponse.ok || !classesData.success) {
        throw new Error(
          classesData.error || "Unable to load classes."
        );
      }

      const classes = classesData.classes || [];

      let found: Result[] = [];

      for (const classItem of classes) {
        const sectionsResponse = await fetch(
          `/api/sections?class_id=${encodeURIComponent(
            classItem.id
          )}`
        );

        const sectionsData = await sectionsResponse.json();

        if (!sectionsResponse.ok || !sectionsData.success) {
          continue;
        }

        for (const section of sectionsData.sections || []) {
          const query = new URLSearchParams({
            class_id: classItem.id,
            section_id: section.id,
          });

          const response = await fetch(
            `/api/exams/${examId}/results?${query.toString()}`
          );

          const data = await response.json();

          if (response.ok && data.success && data.students?.length) {
            found = data.students;
            break;
          }
        }

        if (found.length) break;
      }

      setResults(found);

      if (found.length) {
        setSelectedStudentId(found[0].student.id);
      } else {
        setError(
          "No student results are available for this examination."
        );
      }
    } catch (err: any) {
      setError(
        err?.message || "Unable to load report card data."
      );
    } finally {
      setResultsLoading(false);
    }
  }

  useEffect(() => {
    if (exam) {
      loadResults();
    }
  }, [exam]);

  const selectedResult =
    results.find(
      (item) => item.student.id === selectedStudentId
    ) || null;

  function printReport() {
    window.print();
  }

  if (loading) {
    return (
      <div className="p-8 text-center text-sm text-slate-500">
        Loading report card...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }

          .no-print {
            display: none !important;
          }

          .report-card {
            box-shadow: none !important;
            border: 0 !important;
          }
        }
      `}</style>

      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
          <a
            href={`/app/exams/${examId}/results`}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            ← Back to Results
          </a>

          <button
            type="button"
            onClick={printReport}
            disabled={!selectedResult}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Print Report Card
          </button>
        </div>

        {error && (
          <div className="no-print mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {results.length > 0 && (
          <div className="no-print mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Student
              </span>

              <select
                value={selectedStudentId}
                onChange={(e) =>
                  setSelectedStudentId(e.target.value)
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              >
                {results.map((result) => (
                  <option
                    key={result.student.id}
                    value={result.student.id}
                  >
                    {result.student.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}

        {resultsLoading ? (
          <div className="no-print rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">
            Preparing report card...
          </div>
        ) : selectedResult && exam ? (
          <div className="report-card overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
            <div className="border-b-4 border-blue-600 px-8 py-8 text-center">
              <div className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                SmartCampusAI
              </div>

              <h1 className="mt-2 text-3xl font-bold text-slate-900">
                Student Report Card
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Powered by ThomasG Technologies
              </p>
            </div>

            <div className="grid gap-6 border-b border-slate-200 px-8 py-6 md:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Student Name
                </p>
                <p className="mt-1 text-lg font-bold text-slate-900">
                  {selectedResult.student.name}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Admission Number
                </p>
                <p className="mt-1 text-lg font-bold text-slate-900">
                  {selectedResult.student.admission_number ||
                    "—"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Examination
                </p>
                <p className="mt-1 font-semibold text-slate-900">
                  {exam.name}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Exam Type
                </p>
                <p className="mt-1 font-semibold text-slate-900">
                  {exam.exam_type}
                </p>
              </div>
            </div>

            <div className="grid gap-4 border-b border-slate-200 px-8 py-6 sm:grid-cols-4">
              <div className="rounded-xl bg-slate-50 p-4 text-center">
                <p className="text-xs text-slate-500">
                  Total Marks
                </p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {selectedResult.summary.total_marks}
                </p>
              </div>

              <div className="rounded-xl bg-blue-50 p-4 text-center">
                <p className="text-xs text-blue-600">
                  Percentage
                </p>
                <p className="mt-1 text-2xl font-bold text-blue-900">
                  {selectedResult.summary.percentage !==
                  null
                    ? `${selectedResult.summary.percentage.toFixed(
                        2
                      )}%`
                    : "—"}
                </p>
              </div>

              <div className="rounded-xl bg-indigo-50 p-4 text-center">
                <p className="text-xs text-indigo-600">
                  Grade
                </p>
                <p className="mt-1 text-2xl font-bold text-indigo-900">
                  {selectedResult.summary.grade || "—"}
                </p>
              </div>

              <div
                className={`rounded-xl p-4 text-center ${
                  selectedResult.summary.passed === true
                    ? "bg-emerald-50"
                    : selectedResult.summary.passed ===
                      false
                    ? "bg-red-50"
                    : "bg-amber-50"
                }`}
              >
                <p className="text-xs text-slate-600">
                  Result
                </p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {selectedResult.summary.passed === true
                    ? "PASS"
                    : selectedResult.summary.passed ===
                      false
                    ? "FAIL"
                    : "PENDING"}
                </p>
              </div>
            </div>

            <div className="px-8 py-7">
              <h2 className="mb-4 text-xl font-bold text-slate-900">
                Subject-wise Performance
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-slate-300 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      <th className="px-4 py-3">
                        Subject
                      </th>
                      <th className="px-4 py-3">
                        Max Marks
                      </th>
                      <th className="px-4 py-3">
                        Marks
                      </th>
                      <th className="px-4 py-3">
                        Percentage
                      </th>
                      <th className="px-4 py-3">
                        Grade
                      </th>
                      <th className="px-4 py-3">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {selectedResult.subjects.map(
                      (subject) => {
                        const passed =
                          subject.marks_obtained !==
                            null &&
                          subject.marks_obtained >=
                            subject.pass_marks;

                        return (
                          <tr
                            key={subject.exam_subject_id}
                            className="border-b border-slate-200"
                          >
                            <td className="px-4 py-4">
                              <div className="font-semibold text-slate-900">
                                {subject.subject?.name ||
                                  "Subject"}
                              </div>

                              {subject.subject?.code && (
                                <div className="text-xs text-slate-500">
                                  {subject.subject.code}
                                </div>
                              )}
                            </td>

                            <td className="px-4 py-4 text-sm text-slate-700">
                              {subject.max_marks}
                            </td>

                            <td className="px-4 py-4 font-bold text-slate-900">
                              {subject.marks_obtained ??
                                "—"}
                            </td>

                            <td className="px-4 py-4 text-sm text-slate-700">
                              {subject.percentage !==
                              null
                                ? `${subject.percentage.toFixed(
                                    2
                                  )}%`
                                : "—"}
                            </td>

                            <td className="px-4 py-4 font-bold text-blue-700">
                              {subject.grade || "—"}
                            </td>

                            <td className="px-4 py-4">
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
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid gap-6 border-t border-slate-200 px-8 py-8 md:grid-cols-2">
              <div>
                <h3 className="font-semibold text-slate-900">
                  Teacher Remarks
                </h3>

                <div className="mt-3 min-h-20 rounded-xl border border-slate-200 p-4 text-sm text-slate-600">
                  {selectedResult.subjects
                    .map((item) => item.remarks)
                    .filter(Boolean)
                    .join(" ") ||
                    "No teacher remarks entered."}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900">
                  Overall Performance
                </h3>

                <div className="mt-3 rounded-xl bg-slate-50 p-4">
                  <div className="flex justify-between border-b border-slate-200 py-2 text-sm">
                    <span className="text-slate-500">
                      Subjects
                    </span>
                    <span className="font-semibold">
                      {
                        selectedResult.summary
                          .subjects_entered
                      }{" "}
                      /{" "}
                      {
                        selectedResult.summary
                          .subjects_total
                      }
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-slate-200 py-2 text-sm">
                    <span className="text-slate-500">
                      Grade Point
                    </span>
                    <span className="font-semibold">
                      {selectedResult.summary.grade_point ??
                        "—"}
                    </span>
                  </div>

                  <div className="flex justify-between py-2 text-sm">
                    <span className="text-slate-500">
                      Final Result
                    </span>
                    <span className="font-bold">
                      {selectedResult.summary.passed ===
                      true
                        ? "PASS"
                        : selectedResult.summary
                            .passed === false
                        ? "FAIL"
                        : "PENDING"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-12 border-t border-slate-200 px-8 pb-10 pt-16 text-center">
              <div>
                <div className="border-t border-slate-400 pt-2 text-sm text-slate-600">
                  Class Teacher
                </div>
              </div>

              <div>
                <div className="border-t border-slate-400 pt-2 text-sm text-slate-600">
                  Principal / School Head
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 px-8 py-4 text-center text-xs text-slate-400">
              Generated by SmartCampusAI • Powered by
              ThomasG Technologies
            </div>
          </div>
        ) : (
          <div className="no-print rounded-2xl border border-slate-200 bg-white p-16 text-center shadow-sm">
            <div className="text-5xl">📄</div>

            <h2 className="mt-5 text-xl font-semibold text-slate-900">
              Report card unavailable
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Enter examination marks first to generate a
              report card.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
