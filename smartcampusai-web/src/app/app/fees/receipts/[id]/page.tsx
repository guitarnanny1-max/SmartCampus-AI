"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type ReceiptData = {
  receipt: {
    id: string;
    receipt_number: string;
    receipt_date: string;
    total_amount: number;
    status: string;
    remarks?: string | null;
  };
  payment: {
    id: string;
    payment_date: string;
    amount: number;
    payment_method: string;
    transaction_reference?: string | null;
  } | null;
  student: {
    id: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    admissionNumber?: string;
    rollNumber?: string;
  } | null;
  academicYear: {
    id: string;
    name: string;
  } | null;
  feeDetails: Array<{
    fee_type?: {
      name?: string;
      code?: string;
    } | null;
    allocated_amount: number;
  }>;
  issuedBy?: {
    name?: string;
    email?: string;
  };
};

const money = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(Number(value || 0));

function studentName(student: ReceiptData["student"]) {
  if (!student) return "—";

  if (student.name) return student.name;

  return (
    [student.firstName, student.lastName].filter(Boolean).join(" ") ||
    "—"
  );
}

function amountInWords(amount: number) {
  const number = Math.round(Number(amount || 0));

  if (number === 0) return "Zero Rupees Only";

  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];

  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  function belowHundred(n: number) {
    if (n < 20) return ones[n];

    return (
      tens[Math.floor(n / 10)] +
      (n % 10 ? ` ${ones[n % 10]}` : "")
    );
  }

  function belowThousand(n: number) {
    if (n < 100) return belowHundred(n);

    return (
      `${ones[Math.floor(n / 100)]} Hundred` +
      (n % 100 ? ` ${belowHundred(n % 100)}` : "")
    );
  }

  function indianNumber(n: number): string {
    if (n < 1000) return belowThousand(n);

    if (n < 100000) {
      return (
        `${belowHundred(Math.floor(n / 1000))} Thousand` +
        (n % 1000 ? ` ${belowThousand(n % 1000)}` : "")
      );
    }

    if (n < 10000000) {
      return (
        `${belowHundred(Math.floor(n / 100000))} Lakh` +
        (n % 100000
          ? ` ${indianNumber(n % 100000)}`
          : "")
      );
    }

    return (
      `${belowHundred(Math.floor(n / 10000000))} Crore` +
      (n % 10000000
        ? ` ${indianNumber(n % 10000000)}`
        : "")
    );
  }

  return `${indianNumber(number)} Rupees Only`;
}

export default function FeeReceiptDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [data, setData] = useState<ReceiptData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadReceipt() {
      try {
        const res = await fetch(
          `/api/fee-receipts/${encodeURIComponent(params.id)}`
        );

        const result = await res.json();

        if (!res.ok || !result.success) {
          throw new Error(
            result.error || "Unable to load receipt."
          );
        }

        setData(result);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load receipt."
        );
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      loadReceipt();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 p-6">
        <div className="mx-auto max-w-3xl rounded-xl border bg-white p-8">
          Loading receipt...
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-100 p-6">
        <div className="mx-auto max-w-3xl rounded-xl border bg-white p-8">
          <h1 className="text-xl font-semibold text-red-600">
            Unable to load receipt
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            {error || "Receipt not found."}
          </p>

          <button
            type="button"
            onClick={() => router.back()}
            className="mt-5 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  const { receipt, payment, student, academicYear, feeDetails } =
    data;

  return (
    <>
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }

          .no-print {
            display: none !important;
          }

          .receipt-page {
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
            max-width: none !important;
          }
        }
      `}</style>

      <div className="min-h-screen bg-slate-100 p-6">
        <div className="no-print mx-auto mb-5 flex max-w-3xl justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg border bg-white px-4 py-2 text-sm font-medium text-slate-700"
          >
            ← Back
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-medium text-white"
          >
            🖨️ Print Receipt
          </button>
        </div>

        <div className="receipt-page mx-auto max-w-3xl rounded-xl border bg-white p-8 shadow-sm">
          <div className="border-b-2 border-slate-900 pb-5 text-center">
            <div className="text-3xl font-bold tracking-tight text-slate-900">
              SmartCampusAI
            </div>

            <div className="mt-1 text-sm font-medium text-slate-600">
              School Management System
            </div>

            <div className="mt-3 text-xl font-bold uppercase tracking-wide">
              Fee Receipt
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 rounded-lg bg-slate-50 p-4 text-sm">
            <div>
              <div className="text-xs text-slate-500">
                Receipt Number
              </div>
              <div className="mt-1 font-semibold">
                {receipt.receipt_number}
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs text-slate-500">
                Receipt Date
              </div>
              <div className="mt-1 font-semibold">
                {receipt.receipt_date}
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-500">
                Academic Year
              </div>
              <div className="mt-1 font-semibold">
                {academicYear?.name || "—"}
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs text-slate-500">
                Status
              </div>
              <div className="mt-1 font-semibold">
                {receipt.status}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-700">
              Student Details
            </h2>

            <div className="grid grid-cols-2 gap-x-8 gap-y-4 rounded-lg border p-4 text-sm">
              <div>
                <div className="text-xs text-slate-500">
                  Student Name
                </div>
                <div className="mt-1 font-semibold">
                  {studentName(student)}
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-500">
                  Admission / Roll Number
                </div>
                <div className="mt-1 font-semibold">
                  {student?.admissionNumber ||
                    student?.rollNumber ||
                    "—"}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-700">
              Payment Details
            </h2>

            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-y bg-slate-50">
                  <th className="px-4 py-3 text-left font-semibold">
                    Fee Type
                  </th>
                  <th className="px-4 py-3 text-left font-semibold">
                    Code
                  </th>
                  <th className="px-4 py-3 text-right font-semibold">
                    Amount
                  </th>
                </tr>
              </thead>

              <tbody>
                {feeDetails.length > 0 ? (
                  feeDetails.map((fee, index) => (
                    <tr key={index} className="border-b">
                      <td className="px-4 py-3">
                        {fee.fee_type?.name || "Fee"}
                      </td>
                      <td className="px-4 py-3">
                        {fee.fee_type?.code || "—"}
                      </td>
                      <td className="px-4 py-3 text-right font-medium">
                        {money(Number(fee.allocated_amount || 0))}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-4 text-center text-slate-500"
                    >
                      Payment details
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div className="rounded-lg border p-4">
              <div className="text-xs text-slate-500">
                Payment Method
              </div>
              <div className="mt-1 font-semibold">
                {payment?.payment_method
                  ? payment.payment_method.replaceAll("_", " ")
                  : "—"}
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <div className="text-xs text-slate-500">
                Transaction Reference
              </div>
              <div className="mt-1 font-semibold">
                {payment?.transaction_reference || "—"}
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-lg border-2 border-slate-900 p-5">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold">
                Total Paid
              </span>

              <span className="text-2xl font-bold">
                {money(Number(receipt.total_amount || 0))}
              </span>
            </div>

            <div className="mt-3 border-t pt-3 text-sm">
              <span className="font-medium">
                Amount in Words:
              </span>{" "}
              {amountInWords(Number(receipt.total_amount || 0))}
            </div>
          </div>

          {receipt.remarks && (
            <div className="mt-5 rounded-lg bg-slate-50 p-4 text-sm">
              <div className="font-semibold">Remarks</div>
              <div className="mt-1 text-slate-600">
                {receipt.remarks}
              </div>
            </div>
          )}

          <div className="mt-12 grid grid-cols-2 gap-8 text-center text-sm">
            <div>
              <div className="mx-auto mb-8 w-40 border-b border-slate-400" />
              <div className="font-medium">Parent / Student</div>
            </div>

            <div>
              <div className="mx-auto mb-8 w-40 border-b border-slate-400" />
              <div className="font-medium">Authorized Signatory</div>
            </div>
          </div>

          <div className="mt-10 border-t pt-4 text-center text-xs text-slate-500">
            Generated by SmartCampusAI • Powered by ThomasG Technologies
          </div>
        </div>
      </div>
    </>
  );
}
