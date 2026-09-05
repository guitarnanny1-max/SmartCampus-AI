"use client";

import { useEffect, useState } from "react";

type AcademicYear = {
  id: string;
  name: string;
  status?: string;
};

type Student = {
  id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  admissionNumber?: string;
};

type Payment = {
  id: string;
  student_id: string;
  academic_year_id: string;
  payment_date: string;
  amount: number;
  payment_method: string;
  transaction_reference?: string | null;
  status: string;
  remarks?: string | null;
};

type Receipt = {
  id: string;
  payment_id: string;
  receipt_number: string;
  receipt_date: string;
  issued_to_student_id: string;
  total_amount: number;
  status: string;
  remarks?: string | null;
};

const money = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(Number(value || 0));

function getStudentName(student?: Student) {
  if (!student) return "Unknown Student";
  if (student.name) return student.name;

  return (
    [student.firstName, student.lastName].filter(Boolean).join(" ") ||
    "Unnamed Student"
  );
}

export default function FeeReceiptsPage() {
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [receipts, setReceipts] = useState<Receipt[]>([]);

  const [academicYearId, setAcademicYearId] = useState("");
  const [studentId, setStudentId] = useState("");

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadAcademicYears() {
    const res = await fetch("/api/academic-years");
    const data = await res.json();

    if (data.success) {
      const years = data.academicYears || [];
      setAcademicYears(years);

      const active =
        years.find((year: AcademicYear) => year.status === "ACTIVE") ||
        years[0];

      if (active) {
        setAcademicYearId(active.id);
      }
    }
  }

  async function loadStudents() {
    const res = await fetch("/api/students");
    const data = await res.json();

    if (data.success) {
      setStudents(data.students || []);
    }
  }

  async function loadPayments() {
    const params = new URLSearchParams();

    if (studentId) params.set("student_id", studentId);
    if (academicYearId) params.set("academic_year_id", academicYearId);

    const res = await fetch(`/api/fee-payments?${params.toString()}`);
    const data = await res.json();

    if (data.success) {
      setPayments(
        (data.payments || []).filter(
          (payment: Payment) => payment.status === "COMPLETED"
        )
      );
    }
  }

  async function loadReceipts() {
    const params = new URLSearchParams();

    if (studentId) params.set("student_id", studentId);
    if (academicYearId) params.set("academic_year_id", academicYearId);

    const res = await fetch(`/api/fee-receipts?${params.toString()}`);
    const data = await res.json();

    if (data.success) {
      setReceipts(data.receipts || []);
    }
  }

  async function loadAll() {
    try {
      await Promise.all([
        loadAcademicYears(),
        loadStudents(),
      ]);
    } catch {
      setError("Unable to load academic data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  useEffect(() => {
    if (!academicYearId && !studentId) return;

    Promise.all([loadPayments(), loadReceipts()]).catch(() => {
      setError("Unable to load payment or receipt data.");
    });
  }, [academicYearId, studentId]);

  const receiptPaymentIds = new Set(
    receipts.map((receipt) => receipt.payment_id)
  );

  async function generateReceipt(payment: Payment) {
    setGenerating(payment.id);
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/fee-receipts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payment_id: payment.id,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to generate receipt.");
      }

      setMessage(
        data.existing
          ? "Receipt already exists for this payment."
          : `Receipt ${data.receipt.receipt_number} generated successfully.`
      );

      await loadReceipts();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to generate receipt."
      );
    } finally {
      setGenerating(null);
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="rounded-xl border bg-white p-6">
          Loading Fee Receipts...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Fee Receipts
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Generate and manage receipts for completed fee payments.
          </p>
        </div>

        {message && (
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-semibold text-slate-900">
            Filters
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Academic Year
              </label>

              <select
                value={academicYearId}
                onChange={(e) => setAcademicYearId(e.target.value)}
                className="w-full rounded-lg border px-3 py-2.5 text-sm"
              >
                <option value="">All academic years</option>

                {academicYears.map((year) => (
                  <option key={year.id} value={year.id}>
                    {year.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Student
              </label>

              <select
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full rounded-lg border px-3 py-2.5 text-sm"
              >
                <option value="">All students</option>

                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {getStudentName(student)}
                    {student.admissionNumber
                      ? ` — ${student.admissionNumber}`
                      : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white shadow-sm">
          <div className="border-b px-6 py-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Completed Payments
            </h2>
          </div>

          {payments.length === 0 ? (
            <div className="p-6 text-sm text-slate-500">
              No completed payments found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 font-medium">Payment Date</th>
                    <th className="px-6 py-3 font-medium">Student</th>
                    <th className="px-6 py-3 font-medium">Amount</th>
                    <th className="px-6 py-3 font-medium">Method</th>
                    <th className="px-6 py-3 font-medium">Reference</th>
                    <th className="px-6 py-3 font-medium">Receipt</th>
                  </tr>
                </thead>

                <tbody>
                  {payments.map((payment) => {
                    const receiptExists = receiptPaymentIds.has(payment.id);

                    const student = students.find(
                      (item) => item.id === payment.student_id
                    );

                    return (
                      <tr
                        key={payment.id}
                        className="border-b last:border-0"
                      >
                        <td className="px-6 py-4">
                          {payment.payment_date}
                        </td>

                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-900">
                            {getStudentName(student)}
                          </div>

                          {student?.admissionNumber && (
                            <div className="text-xs text-slate-500">
                              {student.admissionNumber}
                            </div>
                          )}
                        </td>

                        <td className="px-6 py-4 font-semibold">
                          {money(Number(payment.amount || 0))}
                        </td>

                        <td className="px-6 py-4">
                          {payment.payment_method.replaceAll("_", " ")}
                        </td>

                        <td className="px-6 py-4">
                          {payment.transaction_reference || "—"}
                        </td>

                        <td className="px-6 py-4">
                          {receiptExists ? (
                            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                              Generated
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => generateReceipt(payment)}
                              disabled={generating === payment.id}
                              className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
                            >
                              {generating === payment.id
                                ? "Generating..."
                                : "Generate Receipt"}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="rounded-xl border bg-white shadow-sm">
          <div className="border-b px-6 py-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Generated Receipts
            </h2>
          </div>

          {receipts.length === 0 ? (
            <div className="p-6 text-sm text-slate-500">
              No receipts generated yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 font-medium">
                      Receipt Number
                    </th>
                    <th className="px-6 py-3 font-medium">
                      Receipt Date
                    </th>
                    <th className="px-6 py-3 font-medium">
                      Amount
                    </th>
                    <th className="px-6 py-3 font-medium">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {receipts.map((receipt) => (
                    <tr
                      key={receipt.id}
                      className="border-b last:border-0"
                    >
                      <td className="px-6 py-4 font-medium">
                        {receipt.receipt_number}
                      </td>

                      <td className="px-6 py-4">
                        {receipt.receipt_date}
                      </td>

                      <td className="px-6 py-4 font-semibold">
                        {money(Number(receipt.total_amount || 0))}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                            {receipt.status}
                          </span>

                          <a
                            href={`/app/fees/receipts/${receipt.id}`}
                            className="rounded-lg border px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                          >
                            View / Print
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
