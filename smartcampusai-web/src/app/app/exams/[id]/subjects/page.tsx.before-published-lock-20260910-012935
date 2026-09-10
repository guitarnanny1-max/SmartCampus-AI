"use client";

import { useEffect, useState } from "react";

type Exam = {
  id: string;
  name: string;
  academic_year_id: string;
  exam_type: string;
  start_date: string | null;
  end_date: string | null;
  status: string;
};

type Subject = {
  id: string;
  name: string;
  code: string | null;
  status: string;
};

type ExamSubject = {
  id: string;
  exam_id: string;
  subject_id: string;
  max_marks: number;
  pass_marks: number;
  exam_date: string | null;
  start_time: string | null;
  end_time: string | null;
  subject?: {
    id: string;
    name: string;
    code: string | null;
  } | null;
};

export default function ManageExamSubjectsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [examId, setExamId] = useState("");

  const [exam, setExam] = useState<Exam | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [examSubjects, setExamSubjects] = useState<ExamSubject[]>([]);

  const [subjectId, setSubjectId] = useState("");
  const [maxMarks, setMaxMarks] = useState("100");
  const [passMarks, setPassMarks] = useState("35");
  const [examDate, setExamDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    params.then(({ id }) => setExamId(id));
  }, [params]);

  useEffect(() => {
    if (examId) {
      loadData();
    }
  }, [examId]);

  async function loadData() {
    setLoading(true);
    setError("");

    try {
      const [examResponse, subjectsResponse] = await Promise.all([
        fetch(`/api/exams/${examId}/subjects`),
        fetch("/api/subjects"),
      ]);

      const examData = await examResponse.json();
      const subjectsData = await subjectsResponse.json();

      if (!examResponse.ok || !examData.success) {
        throw new Error(
          examData.error || "Unable to load examination subjects."
        );
      }

      if (!subjectsResponse.ok || !subjectsData.success) {
        throw new Error(
          subjectsData.error || "Unable to load subjects."
        );
      }

      setExam(examData.exam);
      setExamSubjects(examData.examSubjects || []);
      setSubjects(subjectsData.subjects || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load examination subjects."
      );
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setSubjectId("");
    setMaxMarks("100");
    setPassMarks("35");
    setExamDate("");
    setStartTime("");
    setEndTime("");
    setEditingId("");
  }

  function startEdit(item: ExamSubject) {
    setEditingId(item.id);
    setSubjectId(item.subject_id);
    setMaxMarks(String(item.max_marks ?? 100));
    setPassMarks(String(item.pass_marks ?? 35));
    setExamDate(item.exam_date || "");
    setStartTime(item.start_time || "");
    setEndTime(item.end_time || "");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function saveSubject(event: React.FormEvent) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setMessage("");

    try {
      if (!subjectId) {
        throw new Error("Please select a subject.");
      }

      const max = Number(maxMarks);
      const pass = Number(passMarks);

      if (!Number.isFinite(max) || max <= 0) {
        throw new Error("Maximum marks must be greater than 0.");
      }

      if (!Number.isFinite(pass) || pass < 0) {
        throw new Error("Pass marks must be 0 or greater.");
      }

      if (pass > max) {
        throw new Error("Pass marks cannot exceed maximum marks.");
      }

      const response = await fetch(`/api/exams/${examId}/subjects`, {
        method: editingId ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          editingId
            ? {
                exam_subject_id: editingId,
                max_marks: max,
                pass_marks: pass,
                exam_date: examDate || null,
                start_time: startTime || null,
                end_time: endTime || null,
              }
            : {
                subject_id: subjectId,
                max_marks: max,
                pass_marks: pass,
                exam_date: examDate || null,
                start_time: startTime || null,
                end_time: endTime || null,
              }
        ),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Unable to save examination subject."
        );
      }

      setMessage(
        editingId
          ? "Examination subject updated successfully."
          : "Subject added to the examination successfully."
      );

      resetForm();
      await loadData();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save examination subject."
      );
    } finally {
      setSaving(false);
    }
  }

  async function removeSubject(id: string) {
    const confirmed = window.confirm(
      "Remove this subject from the examination?"
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `/api/exams/${examId}/subjects?exam_subject_id=${encodeURIComponent(id)}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Unable to remove examination subject."
        );
      }

      setMessage("Subject removed from the examination.");
      resetForm();
      await loadData();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to remove examination subject."
      );
    }
  }

  const assignedSubjectIds = new Set(
    examSubjects
      .filter((item) => item.id !== editingId)
      .map((item) => item.subject_id)
  );

  const availableSubjects = subjects.filter(
    (subject) =>
      String(subject.status || "").toUpperCase() === "ACTIVE" &&
      !assignedSubjectIds.has(subject.id)
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
            Loading examination subjects...
          </div>
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            {error || "Examination not found."}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <a
            href="/app/exams"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            ← Back to Exams
          </a>

          <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="text-sm font-medium text-blue-600">
                Academic Management
              </div>

              <h1 className="mt-1 text-3xl font-bold text-slate-900">
                {exam.name}
              </h1>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  {exam.exam_type}
                </span>

                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                  {exam.status}
                </span>

                <span className="text-sm text-slate-500">
                  {exam.start_date || "No start date"} →{" "}
                  {exam.end_date || "No end date"}
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
              <div className="font-semibold">
                {examSubjects.length} subject
                {examSubjects.length === 1 ? "" : "s"}
              </div>
              <div className="mt-1 text-xs">
                Configure papers and marks
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {message && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {message}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
              {editingId ? "Edit Exam Subject" : "Add Subject"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {editingId
                ? "Update the paper configuration."
                : "Add a subject from your Subject Master."}
            </p>

            <form onSubmit={saveSubject} className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Subject
                </label>

                <select
                  value={subjectId}
                  disabled={Boolean(editingId)}
                  onChange={(e) => setSubjectId(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 disabled:bg-slate-100"
                >
                  <option value="">Select subject</option>

                  {editingId ? (
                    <option value={subjectId}>
                      {examSubjects.find(
                        (item) => item.id === editingId
                      )?.subject?.name || subjectId}
                    </option>
                  ) : (
                    availableSubjects.map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                        {subject.code ? ` (${subject.code})` : ""}
                      </option>
                    ))
                  )}
                </select>

                {!editingId && availableSubjects.length === 0 && (
                  <p className="mt-1 text-xs text-slate-500">
                    All active subjects are already assigned.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Maximum Marks
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={maxMarks}
                    onChange={(e) => setMaxMarks(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Pass Marks
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={passMarks}
                    onChange={(e) => setPassMarks(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Exam Date
                </label>

                <input
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Start Time
                  </label>

                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    End Time
                  </label>

                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Update Subject"
                      : "Add Subject"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Examination Subjects
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Subjects configured for this examination.
                </p>
              </div>

              <button
                onClick={loadData}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Refresh
              </button>
            </div>

            {examSubjects.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <div className="text-4xl">📘</div>

                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  No subjects configured
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Add subjects using the form.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {examSubjects.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-sm font-bold text-blue-700">
                        {index + 1}
                      </div>

                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {item.subject?.name || item.subject_id}
                        </h3>

                        {item.subject?.code && (
                          <div className="mt-1 text-xs font-medium text-slate-500">
                            Code: {item.subject.code}
                          </div>
                        )}

                        <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-600">
                          <span className="rounded-full bg-slate-100 px-2.5 py-1">
                            Max: {item.max_marks}
                          </span>

                          <span className="rounded-full bg-slate-100 px-2.5 py-1">
                            Pass: {item.pass_marks}
                          </span>

                          {item.exam_date && (
                            <span className="rounded-full bg-slate-100 px-2.5 py-1">
                              Date: {item.exam_date}
                            </span>
                          )}

                          {item.start_time && (
                            <span className="rounded-full bg-slate-100 px-2.5 py-1">
                              {item.start_time}
                              {item.end_time
                                ? ` – ${item.end_time}`
                                : ""}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(item)}
                        className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => removeSubject(item.id)}
                        className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
                      >
                        Remove
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
            Next: Student Marks
          </h3>

          <p className="mt-1 text-sm text-blue-800">
            Once examination subjects are configured, the next stage is
            entering student marks and generating academic performance.
          </p>
        </div>

        <div className="pt-2 text-center text-sm text-slate-400">
          Powered by ThomasG Technologies
        </div>
      </div>
    </div>
  );
}
