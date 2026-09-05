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

  enrollment?: {
    id: string;
    student_id: string;
    academic_year_id: string;
    class_id?: string;
    section_id?: string;
    roll_number?: string;
    status?: string;
  } | null;

  classRecord?: {
    id: string;
    name: string;
  } | null;

  sectionRecord?: {
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
    [student.firstName, student.lastName].filter(Boolean).join(" ") || "—"
  );
}

function formatDate(value?: string) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
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
        <div className="mx-auto max-w-3xl rounded-2xl border bg-white p-8">
          Loading receipt...
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-100 p-6">
        <div className="mx-auto max-w-3xl rounded-2xl border bg-white p-8">
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

  const {
    receipt,
    payment,
    student,
    academicYear,
    feeDetails,
    issuedBy,
    enrollment,
    classRecord,
    sectionRecord,
  } = data;

  const totalAmount = Number(
    receipt.total_amount || payment?.amount || 0
  );

  const paymentMethod =
    payment?.payment_method?.replaceAll("_", " ") || "—";

  const issuerName =
    issuedBy?.name || "School Administrator";

  const receiptStatus =
    receipt.status?.toUpperCase() || "ISSUED";

  return (
    <>
      <style jsx global>{`
        @page {
          size: A4 portrait;
          margin: 0;
        }

        @media print {
          html,
          body {
            width: 210mm;
            min-height: 297mm;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }

          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .no-print {
            display: none !important;
          }

          .print-sheet {
            width: 210mm !important;
            height: 297mm !important;
            margin: 0 !important;
            padding: 8mm !important;
            background: white !important;
          }

          .receipt-page {
            width: 194mm !important;
            height: 138mm !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 7mm !important;
            border: 0.35mm solid #0f172a !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            overflow: hidden !important;
          }

          .receipt-page + .receipt-page {
            margin-top: 5mm !important;
          }

          .receipt-cut-line {
            display: block !important;
            height: 5mm;
            border-top: 0.3mm dashed #94a3b8;
            margin: 0 0 0 0;
          }
        }

        @media screen {
          .receipt-cut-line {
            display: none;
          }
        }
      `}</style>

      {/* SCREEN CONTROLS */}

      <div className="no-print bg-slate-100 px-5 py-6">
        <div className="mx-auto mb-5 flex max-w-4xl items-center justify-between">

          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            ← Back
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            🖨️ Print Receipt
          </button>

        </div>

        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Half-A4 Fee Receipt
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Two receipts can be printed on one A4 sheet.
          </p>
        </div>
      </div>
      {/* PRINT SHEET */}
      <div className="print-sheet bg-slate-100 px-4 py-4">
        {/* RECEIPT */}
        <article className="receipt-page mx-auto max-w-4xl rounded-2xl border border-slate-300 bg-white p-7 shadow-lg">

          {/* HEADER */}
          <div className="flex items-start justify-between border-b-2 border-slate-950 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-lg font-black text-white">
                S
              </div>

              <div>
                <h1 className="text-xl font-black tracking-tight text-slate-950">
                  SmartCampusAI
                </h1>

                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  School Management OS
                </p>

                <p className="mt-1 text-[10px] text-slate-500">
                  Powered by ThomasG Technologies
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-[9px] font-black uppercase tracking-[0.15em] text-emerald-700">
                {receiptStatus}
              </div>

              <h2 className="mt-2 text-lg font-black uppercase tracking-[0.12em] text-slate-950">
                Fee Receipt
              </h2>

              <p className="mt-0.5 text-[9px] text-slate-500">
                Original
              </p>
            </div>
          </div>

          {/* RECEIPT META */}
          <div className="mt-4 grid grid-cols-4 overflow-hidden rounded-xl border border-slate-200">
            <div className="border-r border-slate-200 px-3 py-2.5">
              <p className="text-[8px] font-bold uppercase tracking-wide text-slate-400">
                Receipt No.
              </p>

              <p className="mt-1 truncate text-[11px] font-bold text-slate-900">
                {receipt.receipt_number}
              </p>
            </div>

            <div className="border-r border-slate-200 px-3 py-2.5">
              <p className="text-[8px] font-bold uppercase tracking-wide text-slate-400">
                Receipt Date
              </p>

              <p className="mt-1 text-[11px] font-bold text-slate-900">
                {formatDate(receipt.receipt_date)}
              </p>
            </div>

            <div className="border-r border-slate-200 px-3 py-2.5">
              <p className="text-[8px] font-bold uppercase tracking-wide text-slate-400">
                Academic Year
              </p>

              <p className="mt-1 text-[11px] font-bold text-slate-900">
                {academicYear?.name || "—"}
              </p>
            </div>

            <div className="px-3 py-2.5">
              <p className="text-[8px] font-bold uppercase tracking-wide text-slate-400">
                Payment Method
              </p>

              <p className="mt-1 text-[11px] font-bold uppercase text-slate-900">
                {paymentMethod}
              </p>
            </div>
          </div>

          {/* STUDENT DETAILS */}
          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-500">
                Student Details
              </h3>

              <span className="h-px flex-1 bg-slate-200 ml-3" />
            </div>

            <div className="grid grid-cols-4 gap-2">
              <div className="col-span-2 rounded-lg bg-slate-50 px-3 py-2.5">
                <p className="text-[8px] font-bold uppercase tracking-wide text-slate-400">
                  Student Name
                </p>

                <p className="mt-1 text-[11px] font-bold text-slate-950">
                  {studentName(student)}
                </p>
              </div>

              <div className="rounded-lg bg-slate-50 px-3 py-2.5">
                <p className="text-[8px] font-bold uppercase tracking-wide text-slate-400">
                  Roll / Admission No.
                </p>

                <p className="mt-1 text-[11px] font-bold text-slate-950">
                  {enrollment?.roll_number ||
                    student?.rollNumber ||
                    student?.admissionNumber ||
                    "—"}
                </p>
              </div>

              <div className="rounded-lg bg-slate-50 px-3 py-2.5">
                <p className="text-[8px] font-bold uppercase tracking-wide text-slate-400">
                  Class / Section
                </p>

                <p className="mt-1 text-[11px] font-bold text-slate-950">
                  {classRecord?.name || "—"}
                  {sectionRecord?.name
                    ? ` / ${sectionRecord.name}`
                    : ""}
                </p>
              </div>
            </div>
          </div>

          {/* FEE TABLE */}
          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-500">
                Fee Details
              </h3>

              <span className="h-px flex-1 bg-slate-200 ml-3" />
            </div>

            <table className="w-full border-collapse overflow-hidden rounded-lg border border-slate-200">
              <thead>
                <tr className="bg-slate-950 text-white">
                  <th className="px-3 py-2 text-left text-[8px] font-bold uppercase tracking-wide">
                    #
                  </th>

                  <th className="px-3 py-2 text-left text-[8px] font-bold uppercase tracking-wide">
                    Fee Description
                  </th>

                  <th className="px-3 py-2 text-right text-[8px] font-bold uppercase tracking-wide">
                    Amount
                  </th>
                </tr>
              </thead>

              <tbody>
                {feeDetails.length > 0 ? (
                  feeDetails.map((item, index) => (
                    <tr
                      key={`${item.fee_type?.code || "fee"}-${index}`}
                      className="border-t border-slate-200"
                    >
                      <td className="px-3 py-2 text-[9px] text-slate-500">
                        {index + 1}
                      </td>

                      <td className="px-3 py-2 text-[10px] font-semibold text-slate-900">
                        {item.fee_type?.name || "Fee"}
                        {item.fee_type?.code ? (
                          <span className="ml-2 text-[8px] font-normal text-slate-400">
                            {item.fee_type.code}
                          </span>
                        ) : null}
                      </td>

                      <td className="px-3 py-2 text-right text-[10px] font-bold text-slate-900">
                        {money(item.allocated_amount)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-3 py-3 text-center text-[9px] text-slate-500"
                    >
                      Fee payment
                    </td>
                  </tr>
                )}
              </tbody>

              <tfoot>
                <tr className="border-t-2 border-slate-950 bg-slate-50">
                  <td
                    colSpan={2}
                    className="px-3 py-2.5 text-right text-[10px] font-black uppercase tracking-wide text-slate-900"
                  >
                    Total Paid
                  </td>

                  <td className="px-3 py-2.5 text-right text-base font-black text-slate-950">
                    {money(totalAmount)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* AMOUNT IN WORDS + TRANSACTION */}
          <div className="mt-3 grid grid-cols-3 gap-3">
            <div className="col-span-2 rounded-lg border border-slate-200 px-3 py-2.5">
              <p className="text-[8px] font-bold uppercase tracking-wide text-slate-400">
                Amount in Words
              </p>

              <p className="mt-1 text-[10px] font-semibold leading-4 text-slate-800">
                {amountInWords(totalAmount)}
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 px-3 py-2.5">
              <p className="text-[8px] font-bold uppercase tracking-wide text-slate-400">
                Transaction Ref.
              </p>

              <p className="mt-1 truncate text-[10px] font-semibold text-slate-800">
                {payment?.transaction_reference || "N/A"}
              </p>
            </div>
          </div>

          {/* FOOTER / AUTHENTICATION */}
          <div className="mt-4 flex items-end justify-between border-t border-slate-200 pt-3">
            <div className="max-w-[65%]">
              <p className="text-[8px] font-bold uppercase tracking-wide text-slate-400">
                Payment Received
              </p>

              <p className="mt-1 text-[9px] leading-4 text-slate-500">
                This receipt acknowledges payment received from the above
                student for the fee details listed herein.
              </p>

              {receipt.remarks ? (
                <p className="mt-1 text-[9px] text-slate-500">
                  <span className="font-bold">Remarks:</span>{" "}
                  {receipt.remarks}
                </p>
              ) : null}
            </div>

            <div className="w-40 text-center">
              <div className="mb-2 flex h-8 items-end justify-center">
                <span className="text-[11px] font-semibold italic text-slate-700">
                  {issuerName}
                </span>
              </div>

              <div className="border-t border-slate-900 pt-1.5">
                <p className="text-[8px] font-black uppercase tracking-wide text-slate-900">
                  Authorized Signatory
                </p>

                <p className="mt-0.5 truncate text-[8px] text-slate-400">
                  {issuedBy?.email || "Verified by SmartCampusAI"}
                </p>
              </div>
            </div>
          </div>

          {/* AUTHENTICATED FOOTER */}
          <div className="mt-3 flex items-center justify-between rounded-lg bg-slate-950 px-3 py-2 text-white">
            <span className="text-[8px] font-semibold">
              Receipt ID: {receipt.id}
            </span>

            <span className="text-[8px] font-bold uppercase tracking-[0.12em] text-white/80">
              Digitally recorded by SmartCampusAI
            </span>
          </div>
        </article>

        {/* CUT LINE FOR TWO-UP PRINTING */}
        <div className="receipt-cut-line mx-auto max-w-4xl" />

        {/* SECOND HALF — intentionally blank for future duplicate/counterfoil */}
        <div className="no-print mx-auto mt-8 max-w-4xl rounded-xl border border-dashed border-slate-300 bg-white p-5 text-center text-xs text-slate-400">
          Print layout reserves the second half of A4 for a duplicate receipt/counterfoil.
        </div>
      </div>
    </>
  );
}
