"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type AcademicYear = {
  id: string;
  name: string;
  status?: string;
};

type Student = {
  id: string;
  name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  parentEmail?: string | null;
  status?: string | null;
};

type Enrollment = {
  id: string;
  student_id: string;
  academic_year_id: string;
  class_id: string;
  section_id?: string | null;
  roll_number?: string | null;
  status?: string | null;
};

type SchoolClass = {
  id: string;
  name: string;
  academic_year_id: string;
};

type Section = {
  id: string;
  name: string;
  class_id: string;
};

type FeeStructure = {
  id: string;
  academic_year_id: string;
  class_id: string;
  fee_type_id: string;
  amount: number | string;
  frequency: string;
  due_date?: string | null;
  status?: string | null;
};

type FeeType = {
  id: string;
  name: string;
  code?: string | null;
};

type StudentFee = {
  id: string;
  student_id: string;
  enrollment_id: string;
  academic_year_id: string;
  fee_structure_id: string;
  fee_type_id: string;
  amount: number | string;
  discount_amount: number | string;
  net_amount: number | string;
  due_date?: string | null;
  status?: string | null;
  remarks?: string | null;
};

type FeeDiscount = {
  id: string;
  name: string;
  code?: string | null;
  discount_type: "FIXED" | "PERCENTAGE";
  value: number | string;
  description?: string | null;
  status?: string | null;
};

function getStudentName(student: Student) {
  if (student.name?.trim()) {
    return student.name.trim();
  }

  const fullName = [student.first_name, student.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();

  return fullName || "Unnamed Student";
}

function formatFrequency(value: string) {
  return value.replace("_", " ");
}

export default function StudentFeesPage() {
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [feeTypes, setFeeTypes] = useState<FeeType[]>([]);
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
  const [studentFees, setStudentFees] = useState<StudentFee[]>([]);
  const [feeDiscounts, setFeeDiscounts] = useState<FeeDiscount[]>([]);
  const [selectedFeeForDiscount, setSelectedFeeForDiscount] =
    useState<StudentFee | null>(null);
  const [selectedDiscountId, setSelectedDiscountId] = useState("");
  const [discountRemarks, setDiscountRemarks] = useState("");
  const [applyingDiscount, setApplyingDiscount] = useState(false);

  const [academicYearId, setAcademicYearId] = useState("");
  const [studentId, setStudentId] = useState("");
  const [enrollmentId, setEnrollmentId] = useState("");
  const [feeStructureId, setFeeStructureId] = useState("");
  const [discountAmount, setDiscountAmount] = useState("0");
  const [remarks, setRemarks] = useState("");

  const [loading, setLoading] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingEnrollments, setLoadingEnrollments] = useState(false);
  const [loadingStructures, setLoadingStructures] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function applyDiscount() {
    if (!selectedFeeForDiscount || !selectedDiscountId) {
      setError("Please select a discount.");
      return;
    }

    setApplyingDiscount(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `/api/student-fees/${selectedFeeForDiscount.id}/discount`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fee_discount_id: selectedDiscountId,
            remarks: discountRemarks.trim() || null,
          }),
        },
      );

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json?.error || "Unable to apply discount.");
      }

      setStudentFees((current) =>
        current.map((fee) =>
          fee.id === selectedFeeForDiscount.id
            ? {
                ...fee,
                discount_amount: json.studentFee?.discount_amount ?? fee.discount_amount,
                net_amount: json.studentFee?.net_amount ?? fee.net_amount,
                status: json.studentFee?.status ?? fee.status,
              }
            : fee,
        ),
      );

      setSelectedFeeForDiscount(null);
      setSelectedDiscountId("");
      setDiscountRemarks("");
      setSuccess("Discount applied successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to apply discount.",
      );
    } finally {
      setApplyingDiscount(false);
    }
  }

  async function loadInitialData() {
    setLoading(true);
    setError("");

    try {
      const [
        yearsResponse,
        studentsResponse,
        feeTypesResponse,
        structuresResponse,
        studentFeesResponse,
      ] = await Promise.all([
        fetch("/api/academic-years"),
        fetch("/api/students"),
        fetch("/api/fee-types"),
        fetch("/api/fee-structures"),
        fetch("/api/student-fees"),
        fetch("/api/fee-discounts?status=ACTIVE"),
      ]);

      const yearsJson = await yearsResponse.json();
      const studentsJson = await studentsResponse.json();
      const feeTypesJson = await feeTypesResponse.json();
      const structuresJson = await structuresResponse.json();
      const studentFeesJson = await studentFeesResponse.json();
      const feeDiscountsResponse = await fetch("/api/fee-discounts?status=ACTIVE");
      const feeDiscountsJson = await feeDiscountsResponse.json();

      if (!yearsResponse.ok) {
        throw new Error(
          yearsJson?.error || "Unable to load academic years.",
        );
      }

      if (!feeDiscountsResponse.ok) {
        throw new Error(
          feeDiscountsJson?.error || "Unable to load fee discounts.",
        );
      }

      if (!studentsResponse.ok) {
        throw new Error(
          studentsJson?.error || "Unable to load students.",
        );
      }

      if (!feeTypesResponse.ok) {
        throw new Error(
          feeTypesJson?.error || "Unable to load fee types.",
        );
      }

      if (!structuresResponse.ok) {
        throw new Error(
          structuresJson?.error || "Unable to load fee structures.",
        );
      }

      if (!studentFeesResponse.ok) {
        throw new Error(
          studentFeesJson?.error || "Unable to load student fees.",
        );
      }

      const years = yearsJson.academicYears ?? [];
      const nextStudents =
        studentsJson.students ?? studentsJson.data ?? [];
      const nextFeeTypes = feeTypesJson.feeTypes ?? [];
      const nextStructures = structuresJson.feeStructures ?? [];

      setAcademicYears(years);
      setStudents(nextStudents);
      setFeeTypes(nextFeeTypes);
      setFeeStructures(nextStructures);
      setStudentFees(studentFeesJson.studentFees ?? []);

      if (years.length > 0) {
        const activeYear =
          years.find(
            (year: AcademicYear) => year.status === "ACTIVE",
          ) ?? years[0];

        setAcademicYearId(activeYear.id);
      }

      if (nextStudents.length > 0) {
        setStudentId(nextStudents[0].id);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load student fee data.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadStudentEnrollments(
    selectedStudentId: string,
    selectedAcademicYearId: string,
  ) {
    if (!selectedStudentId || !selectedAcademicYearId) {
      setEnrollments([]);
      setEnrollmentId("");
      return;
    }

    setLoadingEnrollments(true);
    setError("");

    try {
      const response = await fetch(
        `/api/student-enrollments?student_id=${encodeURIComponent(
          selectedStudentId,
        )}&academic_year_id=${encodeURIComponent(
          selectedAcademicYearId,
        )}`,
      );

      const json = await response.json();

      if (!response.ok) {
        throw new Error(
          json?.error || "Unable to load student enrollment.",
        );
      }

      const nextEnrollments = json.enrollments ?? [];
      setEnrollments(nextEnrollments);

      setEnrollmentId((current) => {
        if (
          current &&
          nextEnrollments.some(
            (item: Enrollment) => item.id === current,
          )
        ) {
          return current;
        }

        return nextEnrollments[0]?.id ?? "";
      });
    } catch (err) {
      setEnrollments([]);
      setEnrollmentId("");
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load student enrollment.",
      );
    } finally {
      setLoadingEnrollments(false);
    }
  }

  async function loadClasses(selectedAcademicYearId: string) {
    if (!selectedAcademicYearId) {
      setClasses([]);
      setSections([]);
      return;
    }

    try {
      const response = await fetch(
        `/api/classes?academic_year_id=${encodeURIComponent(
          selectedAcademicYearId,
        )}`,
      );

      const json = await response.json();

      if (!response.ok) {
        throw new Error(
          json?.error || "Unable to load classes.",
        );
      }

      setClasses(json.classes ?? []);
    } catch (err) {
      setClasses([]);
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load classes.",
      );
    }
  }

  async function loadSections(selectedClassId: string) {
    if (!selectedClassId) {
      setSections([]);
      return;
    }

    try {
      const response = await fetch(
        `/api/sections?class_id=${encodeURIComponent(
          selectedClassId,
        )}`,
      );

      const json = await response.json();

      if (!response.ok) {
        throw new Error(
          json?.error || "Unable to load sections.",
        );
      }

      setSections(json.sections ?? []);
    } catch (err) {
      setSections([]);
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load sections.",
      );
    }
  }

  async function loadFeeStructures(selectedAcademicYearId: string) {
    if (!selectedAcademicYearId) {
      setFeeStructures([]);
      setFeeStructureId("");
      return;
    }

    setLoadingStructures(true);

    try {
      const response = await fetch(
        `/api/fee-structures?academic_year_id=${encodeURIComponent(
          selectedAcademicYearId,
        )}`,
      );

      const json = await response.json();

      if (!response.ok) {
        throw new Error(
          json?.error || "Unable to load fee structures.",
        );
      }

      const activeStructures = (json.feeStructures ?? []).filter(
        (item: FeeStructure) => item.status === "ACTIVE",
      );

      setFeeStructures(activeStructures);

      setFeeStructureId((current) => {
        if (
          current &&
          activeStructures.some(
            (item: FeeStructure) => item.id === current,
          )
        ) {
          return current;
        }

        return activeStructures[0]?.id ?? "";
      });
    } catch (err) {
      setFeeStructures([]);
      setFeeStructureId("");
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load fee structures.",
      );
    } finally {
      setLoadingStructures(false);
    }
  }

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (academicYearId) {
      loadStudentEnrollments(studentId, academicYearId);
      loadClasses(academicYearId);
      loadFeeStructures(academicYearId);
    }
  }, [academicYearId, studentId]);

  useEffect(() => {
    const selectedEnrollment = enrollments.find(
      (item) => item.id === enrollmentId,
    );

    if (selectedEnrollment?.class_id) {
      loadSections(selectedEnrollment.class_id);
    } else {
      setSections([]);
    }
  }, [enrollmentId, enrollments]);

  const selectedEnrollment = useMemo(
    () => enrollments.find((item) => item.id === enrollmentId),
    [enrollments, enrollmentId],
  );

  const selectedFeeStructure = useMemo(
    () =>
      feeStructures.find(
        (item) => item.id === feeStructureId,
      ),
    [feeStructures, feeStructureId],
  );

  const selectedFeeType = useMemo(
    () =>
      feeTypes.find(
        (item) => item.id === selectedFeeStructure?.fee_type_id,
      ),
    [feeTypes, selectedFeeStructure],
  );

  const selectedClass = useMemo(
    () =>
      classes.find(
        (item) => item.id === selectedEnrollment?.class_id,
      ),
    [classes, selectedEnrollment],
  );

  const selectedSection = useMemo(
    () =>
      sections.find(
        (item) => item.id === selectedEnrollment?.section_id,
      ),
    [sections, selectedEnrollment],
  );

  const selectedStudent = useMemo(
    () => students.find((item) => item.id === studentId),
    [students, studentId],
  );

  const originalAmount = Number(
    selectedFeeStructure?.amount ?? 0,
  );

  const discount = Math.max(
    0,
    Number(discountAmount || 0),
  );

  const netAmount = Math.max(
    0,
    originalAmount - discount,
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!academicYearId) {
      setError("Please select an academic year.");
      return;
    }

    if (!studentId) {
      setError("Please select a student.");
      return;
    }

    if (!enrollmentId) {
      setError("No enrollment found for this student and academic year.");
      return;
    }

    if (!feeStructureId) {
      setError("Please select a fee structure.");
      return;
    }

    if (
      !Number.isFinite(discount) ||
      discount < 0 ||
      discount > originalAmount
    ) {
      setError(
        "Discount must be between ₹0 and the fee amount.",
      );
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/student-fees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          student_id: studentId,
          enrollment_id: enrollmentId,
          academic_year_id: academicYearId,
          fee_structure_id: feeStructureId,
          discount_amount: discount,
          remarks: remarks.trim() || null,
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(
          json?.error || "Unable to assign fee to student.",
        );
      }

      if (json.studentFee) {
        setStudentFees((current) => [
          json.studentFee,
          ...current,
        ]);
      }

      setDiscountAmount("0");
      setRemarks("");
      setSuccess("Fee assigned to student successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to assign fee to student.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500 shadow-sm">
            Loading student fees...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600">
              Fees & Finance
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              Student Fees
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Assign fee structures to individual students and track
              outstanding fees.
            </p>
          </div>

          <a
            href="/app/fees/structures"
            className="inline-flex w-fit items-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            ← Fee Structures
          </a>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {success}
          </div>
        )}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-slate-900">
              Assign Fee to Student
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Select the student&apos;s academic enrollment and an active
              fee structure.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Academic Year
              </label>

              <select
                value={academicYearId}
                onChange={(event) => {
                  setAcademicYearId(event.target.value);
                  setEnrollmentId("");
                  setFeeStructureId("");
                }}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Student
              </label>

              <select
                value={studentId}
                onChange={(event) => {
                  setStudentId(event.target.value);
                  setEnrollmentId("");
                }}
                disabled={loadingStudents || students.length === 0}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none disabled:bg-slate-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Select student</option>

                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {getStudentName(student)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Enrollment
              </label>

              <select
                value={enrollmentId}
                onChange={(event) =>
                  setEnrollmentId(event.target.value)
                }
                disabled={
                  loadingEnrollments ||
                  enrollments.length === 0
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none disabled:bg-slate-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">
                  {loadingEnrollments
                    ? "Loading enrollment..."
                    : "Select enrollment"}
                </option>

                {enrollments.map((enrollment) => (
                  <option
                    key={enrollment.id}
                    value={enrollment.id}
                  >
                    {enrollment.roll_number
                      ? `Roll ${enrollment.roll_number}`
                      : enrollment.id}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Class
              </label>

              <input
                value={
                  selectedClass?.name ??
                  (selectedEnrollment ? "Loading..." : "—")
                }
                readOnly
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Section
              </label>

              <input
                value={selectedSection?.name ?? "—"}
                readOnly
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Fee Structure
              </label>

              <select
                value={feeStructureId}
                onChange={(event) =>
                  setFeeStructureId(event.target.value)
                }
                disabled={
                  loadingStructures ||
                  feeStructures.length === 0
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none disabled:bg-slate-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">
                  {loadingStructures
                    ? "Loading fee structures..."
                    : "Select fee structure"}
                </option>

                {feeStructures.map((structure) => (
                  <option
                    key={structure.id}
                    value={structure.id}
                  >
                    {feeTypes.find(
                      (type) =>
                        type.id === structure.fee_type_id,
                    )?.name ?? "Fee"}
                    {" — "}
                    ₹
                    {Number(structure.amount).toLocaleString(
                      "en-IN",
                    )}
                    {" — "}
                    {formatFrequency(structure.frequency)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Original Amount
              </label>

              <input
                value={`₹${originalAmount.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`}
                readOnly
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-800 outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Discount
              </label>

              <input
                type="number"
                min="0"
                max={originalAmount}
                step="0.01"
                value={discountAmount}
                onChange={(event) =>
                  setDiscountAmount(event.target.value)
                }
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Net Fee
              </label>

              <input
                value={`₹${netAmount.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`}
                readOnly
                className="w-full rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm font-bold text-emerald-800 outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Due Date
              </label>

              <input
                value={selectedFeeStructure?.due_date ?? "—"}
                readOnly
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none"
              />
            </div>

            <div className="md:col-span-2 lg:col-span-3">
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Remarks
              </label>

              <textarea
                rows={3}
                value={remarks}
                onChange={(event) =>
                  setRemarks(event.target.value)
                }
                placeholder="Optional remarks..."
                className="w-full resize-none rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="md:col-span-2 lg:col-span-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Assigning..."
                  : "Assign Fee to Student"}
              </button>
            </div>
          </form>

          {selectedStudent && selectedFeeType && (
            <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
              <span className="font-semibold">
                {getStudentName(selectedStudent)}
              </span>
              {" · "}
              {selectedClass?.name ?? "Class"}
              {selectedSection
                ? ` · ${selectedSection.name}`
                : ""}
              {" · "}
              {selectedFeeType.name}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Student Fee Ledger
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {studentFees.length}{" "}
                {studentFees.length === 1 ? "fee" : "fees"} assigned
              </p>
            </div>
          </div>

          {studentFees.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-sm font-medium text-slate-700">
                No student fees yet
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Assign a fee structure to a student above.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 font-semibold text-slate-600">
                      Student
                    </th>
                    <th className="px-6 py-3 font-semibold text-slate-600">
                      Fee Type
                    </th>
                    <th className="px-6 py-3 font-semibold text-slate-600">
                      Amount
                    </th>
                    <th className="px-6 py-3 font-semibold text-slate-600">
                      Discount
                    </th>
                    <th className="px-6 py-3 font-semibold text-slate-600">
                      Net Amount
                    </th>
                    <th className="px-6 py-3 font-semibold text-slate-600">
                      Due Date
                    </th>
                    <th className="px-6 py-3 font-semibold text-slate-600">
                      Status
                    </th>
                    <th className="px-6 py-3 font-semibold text-slate-600">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {studentFees.map((fee) => {
                    const student = students.find(
                      (item) => item.id === fee.student_id,
                    );

                    const type = feeTypes.find(
                      (item) => item.id === fee.fee_type_id,
                    );

                    return (
                      <tr
                        key={fee.id}
                        className="hover:bg-slate-50"
                      >
                        <td className="px-6 py-4 font-medium text-slate-900">
                          {student
                            ? getStudentName(student)
                            : fee.student_id}
                        </td>

                        <td className="px-6 py-4 text-slate-700">
                          {type?.name ?? "—"}
                        </td>

                        <td className="px-6 py-4 text-slate-700">
                          ₹
                          {Number(fee.amount).toLocaleString(
                            "en-IN",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            },
                          )}
                        </td>

                        <td className="px-6 py-4 text-slate-700">
                          ₹
                          {Number(
                            fee.discount_amount,
                          ).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>

                        <td className="px-6 py-4 font-semibold text-slate-900">
                          ₹
                          {Number(fee.net_amount).toLocaleString(
                            "en-IN",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            },
                          )}
                        </td>

                        <td className="px-6 py-4 text-slate-700">
                          {fee.due_date ?? "—"}
                        </td>

                        <td className="px-6 py-4">
                          <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                            {fee.status ?? "PENDING"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {fee.status !== "PAID" && fee.status !== "CANCELLED" ? (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedFeeForDiscount(fee);
                                setSelectedDiscountId("");
                                setDiscountRemarks("");
                                setError("");
                                setSuccess("");
                              }}
                              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                            >
                              Apply Discount
                            </button>
                          ) : (
                            <span className="text-xs text-slate-400">
                              Locked
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {selectedFeeForDiscount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Apply Discount
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Apply a discount to this student fee.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedFeeForDiscount(null)}
                className="rounded-lg px-2 py-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="mt-5 rounded-xl bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-900">
                {(() => {
                  const student = students.find(
                    (item) => item.id === selectedFeeForDiscount.student_id,
                  );
                  const type = feeTypes.find(
                    (item) => item.id === selectedFeeForDiscount.fee_type_id,
                  );

                  return `${student ? getStudentName(student) : selectedFeeForDiscount.student_id} — ${type?.name ?? "Fee"}`;
                })()}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Original amount: ₹
                {Number(selectedFeeForDiscount.amount).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>

            <div className="mt-5">
              <label className="block text-sm font-medium text-slate-700">
                Discount
              </label>

              <select
                value={selectedDiscountId}
                onChange={(event) => setSelectedDiscountId(event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-500"
              >
                <option value="">Select discount</option>
                {feeDiscounts.map((discount) => (
                  <option key={discount.id} value={discount.id}>
                    {discount.name} —{" "}
                    {discount.discount_type === "PERCENTAGE"
                      ? `${discount.value}%`
                      : `₹${Number(discount.value).toLocaleString("en-IN")}`}
                  </option>
                ))}
              </select>

              {feeDiscounts.length === 0 && (
                <p className="mt-2 text-xs text-amber-600">
                  No active discounts are available. Create one in Discount
                  Master first.
                </p>
              )}
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700">
                Remarks
              </label>

              <textarea
                value={discountRemarks}
                onChange={(event) => setDiscountRemarks(event.target.value)}
                rows={3}
                placeholder="Optional remarks"
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-500"
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedFeeForDiscount(null);
                  setSelectedDiscountId("");
                  setDiscountRemarks("");
                }}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={applyDiscount}
                disabled={!selectedDiscountId || applyingDiscount}
                className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {applyingDiscount ? "Applying..." : "Apply Discount"}
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
