"use client";

import { useEffect, useState } from "react";

type Due = {
  id: string;
  student_id: string;
  fee_type_id: string;
  amount: number | string;
  discount_amount: number | string;
  net_amount: number | string;
  paid_amount: number | string;
  outstanding_amount: number | string;
  due_date?: string | null;
  calculated_status?: string | null;
};

type Student = {
  id: string;
  name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
};

type FeeType = {
  id: string;
  name: string;
};

function getStudentName(student: Student) {
  if (student.name?.trim()) return student.name.trim();

  return (
    [student.first_name, student.last_name]
      .filter(Boolean)
      .join(" ")
      .trim() || "Unnamed Student"
  );
}

function formatMoney(value: number | string) {
  return `₹${Number(value ?? 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function FeeDuesPage() {
  const [dues, setDues] = useState<Due[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [feeTypes, setFeeTypes] = useState<FeeType[]>([]);
  const [totalOutstanding, setTotalOutstanding] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadData() {
    setLoading(true);
    setError("");

    try {
      const [duesResponse, studentsResponse, feeTypesResponse] =
        await Promise.all([
          fetch("/api/fee-dues"),
          fetch("/api/students"),
          fetch("/api/fee-types"),
        ]);

      const duesJson = await duesResponse.json();
      const studentsJson = await studentsResponse.json();
      const feeTypesJson = await feeTypesResponse.json();

      if (!duesResponse.ok) {
        throw new Error(duesJson?.error || "Unable to load fee dues.");
      }

      if (!studentsResponse.ok) {
        throw new Error(studentsJson?.error || "Unable to load students.");
      }

      if (!feeTypesResponse.ok) {
        throw new Error(feeTypesJson?.error || "Unable to load fee types.");
      }

      setDues(duesJson?.dues ?? []);
      setTotalOutstanding(Number(duesJson?.totalOutstanding ?? 0));
      setStudents(studentsJson?.students ?? []);
      setFeeTypes(feeTypesJson?.feeTypes ?? []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load fee dues.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div>
          <p className="text-sm font-semibold text-slate-500">
            Fees & Finance
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Fee Dues
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Track outstanding student fees and overdue balances.
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <section className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Total Outstanding
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {formatMoney(totalOutstanding)}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Outstanding Fees
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {dues.length}
            </p>
          </div>
        </section>

        <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="text-lg font-semibold text-slate-900">
              Outstanding Fee Ledger
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {dues.length} {dues.length === 1 ? "fee" : "fees"} outstanding
            </p>
          </div>

          {loading ? (
            <div className="px-6 py-12 text-center text-sm text-slate-500">
              Loading fee dues...
            </div>
          ) : dues.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-sm font-semibold text-slate-700">
                No outstanding fees
              </p>

              <p className="mt-1 text-sm text-slate-500">
                All assigned fees are currently paid.
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
                      Original
                    </th>
                    <th className="px-6 py-3 font-semibold text-slate-600">
                      Discount
                    </th>
                    <th className="px-6 py-3 font-semibold text-slate-600">
                      Net Fee
                    </th>
                    <th className="px-6 py-3 font-semibold text-slate-600">
                      Paid
                    </th>
                    <th className="px-6 py-3 font-semibold text-slate-600">
                      Outstanding
                    </th>
                    <th className="px-6 py-3 font-semibold text-slate-600">
                      Due Date
                    </th>
                    <th className="px-6 py-3 font-semibold text-slate-600">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {dues.map((due) => {
                    const student = students.find(
                      (item) => item.id === due.student_id,
                    );

                    const feeType = feeTypes.find(
                      (item) => item.id === due.fee_type_id,
                    );

                    return (
                      <tr key={due.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium text-slate-900">
                          {student
                            ? getStudentName(student)
                            : due.student_id}
                        </td>

                        <td className="px-6 py-4 text-slate-700">
                          {feeType?.name ?? "—"}
                        </td>

                        <td className="px-6 py-4 text-slate-700">
                          {formatMoney(due.amount)}
                        </td>

                        <td className="px-6 py-4 text-slate-700">
                          {formatMoney(due.discount_amount)}
                        </td>

                        <td className="px-6 py-4 font-semibold text-slate-900">
                          {formatMoney(due.net_amount)}
                        </td>

                        <td className="px-6 py-4 text-slate-700">
                          {formatMoney(due.paid_amount)}
                        </td>

                        <td className="px-6 py-4 font-bold text-slate-900">
                          {formatMoney(due.outstanding_amount)}
                        </td>

                        <td className="px-6 py-4 text-slate-700">
                          {due.due_date ?? "—"}
                        </td>

                        <td className="px-6 py-4">
                          <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                            {due.calculated_status ?? "PENDING"}
                          </span>
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
    </main>
  );
}
