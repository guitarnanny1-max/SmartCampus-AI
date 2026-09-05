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

type ExamSubject = {
  id: string;
  subject_id: string;
  max_marks: number;
  pass_marks: number;
  exam_date: string | null;
  subject?: {
    id: string;
    name: string;
    code: string | null;
  } | null;
};

type ClassItem = {
  id: string;
  academic_year_id: string;
  name: string;
  status: string;
};

type Section = {
  id: string;
  class_id: string;
  name: string;
  status: string;
};

type StudentMark = {
  id: string;
  marks_obtained: number | null;
  max_marks: number;
  grade: string | null;
  remarks: string | null;
};

type StudentRow = {
  enrollment_id: string;
  student_id: string;
  student_name: string;
  roll_number: string | null;
  grade_class: string | null;
  marks: StudentMark | null;
};

export default function StudentMarksPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [examId, setExamId] = useState("");

  const [exam, setExam] = useState<Exam | null>(null);
  const [examSubjects, setExamSubjects] = useState<ExamSubject[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [students, setStudents] = useState<StudentRow[]>([]);

  const [markInputs, setMarkInputs] = useState<
    Record<string, string>
  >({});

  const [examSubjectId, setExamSubjectId] = useState("");
  const [classId, setClassId] = useState("");
  const [sectionId, setSectionId] = useState("");

  const [loading, setLoading] = useState(true);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [savingId, setSavingId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    params.then(({ id }) => setExamId(id));
  }, [params]);

  useEffect(() => {
    if (examId) {
      loadInitialData();
    }
  }, [examId]);

  async function loadInitialData() {
    setLoading(true);
    setError("");

    try {
      const [examSubjectsResponse, classesResponse] =
        await Promise.all([
          fetch(`/api/exams/${examId}/subjects`),
          fetch("/api/classes"),
        ]);

      const examSubjectsData =
        await examSubjectsResponse.json();

      const classesData =
        await classesResponse.json();

      if (
        !examSubjectsResponse.ok ||
        !examSubjectsData.success
      ) {
        throw new Error(
          examSubjectsData.error ||
            "Unable to load examination subjects."
        );
      }

      if (!classesResponse.ok || !classesData.success) {
        throw new Error(
          classesData.error ||
            "Unable to load classes."
        );
      }

      setExam(examSubjectsData.exam);
      setExamSubjects(
        examSubjectsData.examSubjects || []
      );

      const filteredClasses = (
        classesData.classes || []
      ).filter(
        (item: ClassItem) =>
          item.academic_year_id ===
          examSubjectsData.exam.academic_year_id
      );

      setClasses(filteredClasses);

      if (
        examSubjectsData.examSubjects?.length > 0
      ) {
        setExamSubjectId(
          examSubjectsData.examSubjects[0].id
        );
      }

      if (filteredClasses.length > 0) {
        setClassId(filteredClasses[0].id);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load marks setup."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!classId) {
      setSections([]);
      setSectionId("");
      return;
    }

    loadSections(classId);
  }, [classId]);

  async function loadSections(selectedClassId: string) {
    setError("");

    try {
      const response = await fetch(
        `/api/sections?class_id=${encodeURIComponent(
          selectedClassId
        )}`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Unable to load sections."
        );
      }

      const activeSections = (
        data.sections || []
      ).filter(
        (section: Section) =>
          String(section.status || "").toUpperCase() ===
          "ACTIVE"
      );

      setSections(activeSections);

      if (activeSections.length > 0) {
        setSectionId(activeSections[0].id);
      } else {
        setSectionId("");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load sections."
      );
    }
  }

  useEffect(() => {
    if (
      examId &&
      examSubjectId &&
      classId &&
      sectionId
    ) {
      loadStudents();
    } else {
      setStudents([]);
    }
  }, [
    examId,
    examSubjectId,
    classId,
    sectionId,
  ]);

  async function loadStudents() {
    setStudentsLoading(true);
    setError("");
    setMessage("");

    try {
      const params = new URLSearchParams({
        exam_subject_id: examSubjectId,
        class_id: classId,
        section_id: sectionId,
      });

      const response = await fetch(
        `/api/exams/${examId}/marks?${params.toString()}`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Unable to load students."
        );
      }

      const loadedStudents = (data.students || []).map(
        (student: StudentRow) => ({
          ...student,
          marks: student.marks
            ? {
                ...student.marks,
                marks_obtained:
                  student.marks.marks_obtained ?? null,
              }
            : null,
        })
      );

      setStudents(loadedStudents);

      const nextInputs: Record<string, string> = {};

      loadedStudents.forEach((student: StudentRow) => {
        nextInputs[student.student_id] =
          student.marks?.marks_obtained != null
            ? String(student.marks.marks_obtained)
            : "";
      });

      setMarkInputs(nextInputs);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load students."
      );
      setStudents([]);
      setMarkInputs({});
    } finally {
      setStudentsLoading(false);
    }
  }

  function updateLocalMarks(
    studentId: string,
    value: string
  ) {
    setMarkInputs((current) => ({
      ...current,
      [studentId]: value,
    }));

    setStudents((current) =>
      current.map((student) => {
        if (student.student_id !== studentId) {
          return student;
        }

        return {
          ...student,
          marks: {
            ...(student.marks || {
              id: "",
              max_marks:
                selectedSubject?.max_marks || 0,
              grade: null,
              remarks: null,
            }),
            marks_obtained:
              value === "" ? null : Number(value),
          },
        };
      })
    );
  }

  function updateLocalRemarks(
    studentId: string,
    value: string
  ) {
    setStudents((current) =>
      current.map((student) => {
        if (student.student_id !== studentId) {
          return student;
        }

        return {
          ...student,
          marks: {
            ...(student.marks || {
              id: "",
              marks_obtained: null,
              max_marks:
                selectedSubject?.max_marks || 0,
              grade: null,
            }),
            remarks: value,
          },
        };
      })
    );
  }

  async function saveStudentMark(
    student: StudentRow
  ) {
    if (!selectedSubject) {
      return;
    }

    const marks = student.marks?.marks_obtained ?? null;

    if (
      marks !== null &&
      (marks < 0 ||
        marks > Number(selectedSubject.max_marks))
    ) {
      setError(
        `${student.student_name}: marks must be between 0 and ${selectedSubject.max_marks}.`
      );
      return;
    }

    setSavingId(student.student_id);
    setError("");
    setMessage("");

    try {
      const existingMarkId =
        student.marks?.id || "";

      const response = await fetch(
        `/api/exams/${examId}/marks`,
        {
          method: existingMarkId
            ? "PATCH"
            : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(
            existingMarkId
              ? {
                  id: existingMarkId,
                  marks_obtained: marks,
                  remarks:
                    student.marks?.remarks || null,
                }
              : {
                  exam_subject_id:
                    examSubjectId,
                  student_id:
                    student.student_id,
                  marks_obtained: marks,
                  remarks:
                    student.marks?.remarks || null,
                }
          ),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ||
            "Unable to save student marks."
        );
      }

      setMessage(
        `Marks saved for ${student.student_name}.`
      );

      await loadStudents();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save student marks."
      );
    } finally {
      setSavingId("");
    }
  }

  const selectedSubject =
    examSubjects.find(
      (subject) => subject.id === examSubjectId
    ) || null;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
            Loading student marks...
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
            href={`/app/exams/${examId}/subjects`}
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            ← Back to Exam Subjects
          </a>

          <div className="mt-4">
            <div className="text-sm font-medium text-blue-600">
              Academic Management
            </div>

            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Student Marks
            </h1>

            <p className="mt-2 text-slate-600">
              {exam.name} — enter student performance
              for each examination paper.
            </p>
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

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Exam Subject
              </label>

              <select
                value={examSubjectId}
                onChange={(e) =>
                  setExamSubjectId(e.target.value)
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              >
                <option value="">
                  Select exam subject
                </option>

                {examSubjects.map((subject) => (
                  <option
                    key={subject.id}
                    value={subject.id}
                  >
                    {subject.subject?.name ||
                      subject.subject_id}
                    {" — "}
                    {subject.max_marks} marks
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Class
              </label>

              <select
                value={classId}
                onChange={(e) =>
                  setClassId(e.target.value)
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
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
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Section
              </label>

              <select
                value={sectionId}
                onChange={(e) =>
                  setSectionId(e.target.value)
                }
                disabled={!classId}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 disabled:bg-slate-100"
              >
                <option value="">
                  Select section
                </option>

                {sections.map((section) => (
                  <option
                    key={section.id}
                    value={section.id}
                  >
                    {section.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedSubject && (
            <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-600">
              <span className="rounded-full bg-blue-50 px-3 py-1.5 font-medium text-blue-700">
                Max Marks: {selectedSubject.max_marks}
              </span>

              <span className="rounded-full bg-slate-100 px-3 py-1.5">
                Pass Marks: {selectedSubject.pass_marks}
              </span>

              {selectedSubject.exam_date && (
                <span className="rounded-full bg-slate-100 px-3 py-1.5">
                  Exam Date: {selectedSubject.exam_date}
                </span>
              )}
            </div>
          )}
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Student Performance
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {students.length} enrolled student
                {students.length === 1 ? "" : "s"}
              </p>
            </div>

            <button
              onClick={loadStudents}
              disabled={
                studentsLoading ||
                !examSubjectId ||
                !classId ||
                !sectionId
              }
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Refresh
            </button>
          </div>

          {studentsLoading ? (
            <div className="px-6 py-12 text-center text-sm text-slate-500">
              Loading students...
            </div>
          ) : !examSubjectId ||
            !classId ||
            !sectionId ? (
            <div className="px-6 py-16 text-center">
              <div className="text-4xl">📝</div>

              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                Select exam, class and section
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Choose the filters above to load
                enrolled students.
              </p>
            </div>
          ) : students.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="text-4xl">👨‍🎓</div>

              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                No enrolled students
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                There are no active students enrolled
                in this class and section.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1200px]">
                <thead className="bg-slate-50">
                  <tr className="border-b border-slate-200 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="px-6 py-4">#</th>
                    <th className="px-6 py-4">Student</th>
                    <th className="px-6 py-4">Roll Number</th>
                    <th className="px-6 py-4">Marks</th>
                    <th className="px-6 py-4">Percentage</th>
                    <th className="px-6 py-4">Grade</th>
                    <th className="px-6 py-4">Grade Point</th>
                    <th className="px-6 py-4">Remarks</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200">
                  {students.map((student, index) => {
                    const marksObtained =
                      student.marks?.marks_obtained != null
                        ? Number(student.marks.marks_obtained)
                        : null;

                    const maxMarks =
                      selectedSubject?.max_marks != null
                        ? Number(selectedSubject.max_marks)
                        : null;

                    const percentage =
                      marksObtained !== null &&
                      maxMarks !== null &&
                      maxMarks > 0
                        ? (marksObtained / maxMarks) * 100
                        : null;

                    const grade = student.marks?.grade ?? null;

                    const gradePoints: Record<string, number> = {
                      "A+": 10,
                      A: 9,
                      "B+": 8,
                      B: 7,
                      "C+": 6,
                      C: 5,
                      D: 4,
                      F: 0,
                    };

                    const gradePoint =
                      grade && gradePoints[grade] !== undefined
                        ? gradePoints[grade]
                        : null;

                    return (
                      <tr
                        key={student.student_id}
                        className="hover:bg-slate-50"
                      >
                        <td className="px-6 py-4 text-sm text-slate-500">
                          {index + 1}
                        </td>

                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-900">
                            {student.student_name}
                          </div>

                          {student.grade_class && (
                            <div className="mt-1 text-xs text-slate-500">
                              {student.grade_class}
                            </div>
                          )}
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-600">
                          {student.roll_number || "—"}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">
                              {student.marks?.marks_obtained ?? "—"}
                            </span>

                            <input
                              key={`${student.student_id}-${student.marks?.marks_obtained ?? "empty"}`}
                              type="number"
                              min="0"
                              max={selectedSubject?.max_marks}
                              step="0.01"
                              defaultValue={
                                markInputs[student.student_id] ??
                                student.marks?.marks_obtained ??
                                ""
                              }
                              onChange={(e) =>
                                updateLocalMarks(
                                  student.student_id,
                                  e.target.value
                                )
                              }
                              className="w-24 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                            />

                            <span className="text-xs text-slate-500">
                              / {selectedSubject?.max_marks}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span className="font-semibold text-slate-700">
                            {percentage !== null
                              ? `${percentage.toFixed(2)}%`
                              : "—"}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-700">
                            {grade ?? "—"}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <span className="font-semibold text-slate-700">
                            {gradePoint !== null ? gradePoint : "—"}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <input
                            value={student.marks?.remarks || ""}
                            onChange={(e) =>
                              updateLocalRemarks(
                                student.student_id,
                                e.target.value
                              )
                            }
                            placeholder="Optional"
                            className="w-48 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                          />
                        </td>

                        <td className="px-6 py-4">
                          <button
                            onClick={() => saveStudentMark(student)}
                            disabled={savingId === student.student_id}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {savingId === student.student_id
                              ? "Saving..."
                              : student.marks?.id
                                ? "Update"
                                : "Save"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
          <h3 className="font-semibold text-blue-900">
            Academic Performance
          </h3>

          <p className="mt-1 text-sm text-blue-800">
            Marks are stored against the student,
            examination and examination subject.
            Grades are calculated automatically from
            the configured grading scale when marks are saved.
          </p>
        </div>

        <div className="pt-2 text-center text-sm text-slate-400">
          Powered by ThomasG Technologies
        </div>
      </div>
    </div>
  );
}
