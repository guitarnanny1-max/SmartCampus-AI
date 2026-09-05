"use client";

import { useEffect, useMemo, useState } from "react";

type AcademicYear = {
  id: string;
  name: string;
  status?: string;
};

type Student = {
  id: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  admissionNumber?: string;
  rollNumber?: string;
};

type StudentFee = {
  id: string;
  student_id: string;
  academic_year_id: string;
  fee_type_id: string;
  amount: number;
  discount_amount: number;
  net_amount: number;
  due_date?: string | null;
  status: string;
  remarks?: string | null;
  fee_types?: {
    id: string;
    name: string;
    code?: string;
  };
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

const money = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(Number(value || 0));

function studentName(student: Student) {
  if (student.name) return student.name;

  return [student.firstName, student.lastName]
    .filter(Boolean)
    .join(" ") || "Unnamed Student";
}

export default function FeePaymentsPage() {
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [studentFees, setStudentFees] = useState<StudentFee[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  const [academicYearId, setAcademicYearId] = useState("");
  const [studentId, setStudentId] = useState("");
  const [studentFeeId, setStudentFeeId] = useState("");

  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [transactionReference, setTransactionReference] = useState("");
  const [remarks, setRemarks] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadAcademicYears() {
    const res = await fetch("/api/academic-years");
    const data = await res.json();

    if (data.success) {
      setAcademicYears(data.academicYears || []);

      const active =
        (data.academicYears || []).find(
          (year: AcademicYear) => year.status === "ACTIVE"
        ) || data.academicYears?.[0];

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

  async function loadStudentFees() {
    if (!studentId || !academicYearId) {
      setStudentFees([]);
      return;
    }

    const res = await fetch(
      `/api/student-fees?student_id=${encodeURIComponent(
        studentId
      )}&academic_year_id=${encodeURIComponent(academicYearId)}`
    );

    const data = await res.json();

    if (data.success) {
      setStudentFees(data.studentFees || []);
    }
  }

  async function loadPayments() {
    const params = new URLSearchParams();

    if (studentId) params.set("student_id", studentId);
    if (academicYearId) params.set("academic_year_id", academicYearId);

    const res = await fetch(`/api/fee-payments?${params.toString()}`);
    const data = await res.json();

    if (data.success) {
      setPayments(data.payments || []);
    }
  }

  useEffect(() => {
    async function load() {
      try {
        await Promise.all([loadAcademicYears(), loadStudents()]);
      } catch {
        setError("Unable to load academic data.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  useEffect(() => {
    loadStudentFees();
    setStudentFeeId("");
    setAmount("");
  }, [studentId, academicYearId]);

  useEffect(() => {
    loadPayments();
  }, [studentId, academicYearId]);

  const selectedFee = useMemo(
    () => studentFees.find((fee) => fee.id === studentFeeId),
    [studentFees, studentFeeId]
  );

  const paidAmount = useMemo(() => {
    if (!selectedFee) return 0;

    return payments
      .filter(
        (payment) =>
          payment.status === "COMPLETED" &&
          payment.student_id === selectedFee.student_id
      )
      .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  }, [payments, selectedFee]);

  const outstanding = selectedFee
    ? Math.max(Number(selectedFee.net_amount || 0) - paidAmount, 0)
    : 0;

  function selectFee(fee: StudentFee) {
    setStudentFeeId(fee.id);

    const balance = Math.max(
      Number(fee.net_amount || 0) -
        payments
          .filter(
            (payment) =>
              payment.status === "COMPLETED" &&
              payment.student_id === fee.student_id
          )
          .reduce((sum, payment) => sum + Number(payment.amount || 0), 0),
      0
    );

    setAmount(balance > 0 ? balance.toFixed(2) : "");
    setMessage("");
    setError("");
  }

  async function recordPayment(e: React.FormEvent) {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!studentId) {
      setError("Please select a student.");
      return;
    }

    if (!academicYearId) {
      setError("Please select an academic year.");
      return;
    }

    if (!studentFeeId) {
      setError("Please select a fee.");
      return;
    }

    const numericAmount = Number(amount);

    if (!numericAmount || numericAmount <= 0) {
      setError("Enter a valid payment amount.");
      return;
    }

    if (numericAmount > outstanding) {
      setError(
        `Payment cannot exceed the outstanding balance of ${money(
          outstanding
        )}.`
      );
      return;
    }

    setSaving(true);

    try {
      const res = await fetch("/api/fee-payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          student_id: studentId,
          academic_year_id: academicYearId,
          student_fee_id: studentFeeId,
          amount: numericAmount,
          payment_method: paymentMethod,
          payment_date: paymentDate,
          transaction_reference:
            transactionReference.trim() || null,
          remarks: remarks.trim() || null,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to record payment.");
      }

      setMessage(
        `Payment recorded successfully. Receipt/payment ID: ${data.payment?.id || "created"}`
      );

      setTransactionReference("");
      setRemarks("");
      setAmount("");

      await Promise.all([loadStudentFees(), loadPayments()]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to record payment."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="rounded-xl border bg-white p-6">
          Loading Fee Payments...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Fee Payments
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Record and manage student fee payments.
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
            Record Payment
          </h2>

          <form onSubmit={recordPayment} className="space-y-5">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Academic Year
                </label>
                <select
                  value={academicYearId}
                  onChange={(e) => setAcademicYearId(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2.5 text-sm"
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
                  Student
                </label>
                <select
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2.5 text-sm"
                >
                  <option value="">Select student</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {studentName(student)}
                      {student.admissionNumber
                        ? ` — ${student.admissionNumber}`
                        : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Fee
                </label>
                <select
                  value={studentFeeId}
                  onChange={(e) => {
                    const fee = studentFees.find(
                      (item) => item.id === e.target.value
                    );

                    if (fee) {
                      selectFee(fee);
                    } else {
                      setStudentFeeId("");
                      setAmount("");
                    }
                  }}
                  className="w-full rounded-lg border px-3 py-2.5 text-sm"
                  disabled={!studentId}
                >
                  <option value="">Select fee</option>
                  {studentFees.map((fee) => (
                    <option
                      key={fee.id}
                      value={fee.id}
                      disabled={fee.status === "PAID"}
                    >
                      {fee.fee_types?.name || "Fee"} —{" "}
                      {money(Number(fee.net_amount || 0))} — {fee.status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedFee && (
              <div className="grid gap-4 md:grid-cols-4">
                <div className="rounded-lg bg-slate-50 p-4">
                  <div className="text-xs text-slate-500">Original Fee</div>
                  <div className="mt-1 text-lg font-semibold">
                    {money(Number(selectedFee.amount || 0))}
                  </div>
                </div>

                <div className="rounded-lg bg-slate-50 p-4">
                  <div className="text-xs text-slate-500">Discount</div>
                  <div className="mt-1 text-lg font-semibold">
                    {money(Number(selectedFee.discount_amount || 0))}
                  </div>
                </div>

                <div className="rounded-lg bg-slate-50 p-4">
                  <div className="text-xs text-slate-500">Net Fee</div>
                  <div className="mt-1 text-lg font-semibold">
                    {money(Number(selectedFee.net_amount || 0))}
                  </div>
                </div>

                <div className="rounded-lg bg-amber-50 p-4">
                  <div className="text-xs text-amber-700">
                    Outstanding Balance
                  </div>
                  <div className="mt-1 text-lg font-bold text-amber-800">
                    {money(outstanding)}
                  </div>
                </div>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Payment Amount
                </label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full rounded-lg border px-3 py-2.5 text-sm"
                  disabled={!selectedFee || outstanding <= 0}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2.5 text-sm"
                >
                  <option value="CASH">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                  <option value="CARD">Card</option>
                  <option value="CHEQUE">Cheque</option>
                  <option value="ONLINE">Online</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Payment Date
                </label>
                <input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2.5 text-sm"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Transaction Reference
                </label>
                <input
                  value={transactionReference}
                  onChange={(e) => setTransactionReference(e.target.value)}
                  placeholder="UPI / bank / cheque reference"
                  className="w-full rounded-lg border px-3 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Remarks
                </label>
                <input
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Optional remarks"
                  className="w-full rounded-lg border px-3 py-2.5 text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving || !selectedFee || outstanding <= 0}
                className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Recording..." : "Record Payment"}
              </button>
            </div>
          </form>
        </div>

        <div className="rounded-xl border bg-white shadow-sm">
          <div className="border-b px-6 py-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Student Fee Ledger
            </h2>
          </div>

          {studentFees.length === 0 ? (
            <div className="p-6 text-sm text-slate-500">
              Select an academic year and student to view assigned fees.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 font-medium">Fee</th>
                    <th className="px-6 py-3 font-medium">Net Fee</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">Due Date</th>
                    <th className="px-6 py-3 font-medium">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {studentFees.map((fee) => (
                    <tr key={fee.id} className="border-b last:border-0">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">
                          {fee.fee_types?.name || "Fee"}
                        </div>
                        {fee.fee_types?.code && (
                          <div className="text-xs text-slate-500">
                            {fee.fee_types.code}
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        {money(Number(fee.net_amount || 0))}
                      </td>

                      <td className="px-6 py-4">
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium">
                          {fee.status}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        {fee.due_date || "—"}
                      </td>

                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() => selectFee(fee)}
                          disabled={fee.status === "PAID"}
                          className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {fee.status === "PAID" ? "Paid" : "Select"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="rounded-xl border bg-white shadow-sm">
          <div className="border-b px-6 py-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Payment History
            </h2>
          </div>

          {payments.length === 0 ? (
            <div className="p-6 text-sm text-slate-500">
              No payments recorded yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 font-medium">Date</th>
                    <th className="px-6 py-3 font-medium">Amount</th>
                    <th className="px-6 py-3 font-medium">Method</th>
                    <th className="px-6 py-3 font-medium">Reference</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id} className="border-b last:border-0">
                      <td className="px-6 py-4">{payment.payment_date}</td>
                      <td className="px-6 py-4 font-medium">
                        {money(Number(payment.amount || 0))}
                      </td>
                      <td className="px-6 py-4">
                        {payment.payment_method.replaceAll("_", " ")}
                      </td>
                      <td className="px-6 py-4">
                        {payment.transaction_reference || "—"}
                      </td>
                      <td className="px-6 py-4">{payment.status}</td>
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
