"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  tenantId: string;
};

type StudentRecord = {
  linkId: string;
  isPrimary: boolean;
  student: {
    id: string;
    name: string;
    grade: string | null;
    rollNumber: string | null;
    status: string;
  };
  attendance: {
    totalRecords: number;
    presentCount: number;
    absentCount: number;
    rate: number | null;
    recent: Array<{ id: string; date: string; status: string; punchTime: string | null }>;
  };
  fees: {
    recordCount: number;
    totalBilled: number;
    totalPaid: number;
    outstanding: number;
    records: Array<{
      id: string;
      amount: number;
      discountAmount: number;
      netAmount: number;
      dueDate: string | null;
      status: string;
      remarks: string | null;
      feeType: { id: string; name: string } | null;
    }>;
  };
  payments: {
    recordCount: number;
    totalPaid: number;
    records: Array<{
      id: string;
      paymentDate: string;
      amount: number;
      paymentMethod: string | null;
      transactionReference: string | null;
      status: string;
      remarks: string | null;
    }>;
  };
};

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function ParentPortalPage() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadPortal() {
      try {
        setLoading(true);
        setError("");

        const authRes = await fetch("/api/auth/me", { cache: "no-store", credentials: "include" });

        if (authRes.status === 401) {
          router.replace("/login");
          return;
        }

        if (!authRes.ok) {
          throw new Error("Unable to verify your authenticated session.");
        }

        const authData = await authRes.json();
        if (!authData.success || !authData.user || authData.user.role !== "PARENT") {
          router.replace("/login");
          return;
        }

        const studentsRes = await fetch("/api/parent-students", { cache: "no-store", credentials: "include" });
        const studentsData = await studentsRes.json();

        if (!studentsRes.ok || !studentsData.success) {
          throw new Error(studentsData.error || "Unable to load linked students.");
        }

        if (!active) return;

        const linkedStudents = studentsData.students || [];
        setUser(authData.user as SessionUser);
        setStudents(linkedStudents);
        setSelectedStudentId(
          linkedStudents.find((student: StudentRecord) => student.isPrimary)?.student.id || linkedStudents[0]?.student.id || ""
        );
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Unable to load the parent portal.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadPortal();
    return () => {
      active = false;
    };
  }, [router]);

  const selectedStudent = useMemo(
    () => students.find((student) => student.student.id === selectedStudentId) || null,
    [students, selectedStudentId]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <p className="text-sm text-slate-400">Loading your parent portal…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
        <div className="max-w-xl mx-auto bg-slate-900 border border-red-500/30 rounded-2xl p-8">
          <h1 className="text-xl font-bold text-red-400">Parent portal unavailable</h1>
          <p className="mt-3 text-sm text-slate-400">{error}</p>
          <button onClick={() => router.replace("/login")} className="mt-6 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold">
            Return to login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row md:justify-between md:items-center gap-5 shadow-xl">
          <div>
            <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider">Parent Workspace</span>
            <h1 className="text-3xl font-black mt-1">SmartCampus Parent Portal</h1>
            <p className="text-sm text-slate-400 mt-2">Signed in as {user?.name} · {user?.email}</p>
          </div>
          <button onClick={() => { fetch("/api/auth/logout", { method: "POST", credentials: "include" }); router.replace("/login"); }} className="self-start md:self-auto px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 rounded-xl text-xs font-bold uppercase">
            Logout
          </button>
        </header>

        {students.length === 0 ? (
          <section className="bg-slate-900 border border-amber-500/30 rounded-2xl p-8 shadow-xl">
            <h2 className="text-xl font-bold text-amber-300">No linked student</h2>
            <p className="mt-3 text-sm text-slate-400">Your parent account is authenticated, but no active student is linked to this account yet. Please contact the school administrator.</p>
          </section>
        ) : (
          <>
            {students.length > 1 && (
              <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
                <label htmlFor="student-selector" className="block text-xs uppercase tracking-wider text-slate-400 font-bold mb-2">Select student</label>
                <select id="student-selector" value={selectedStudentId} onChange={(event) => setSelectedStudentId(event.target.value)} className="w-full md:w-auto min-w-[280px] bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm">
                  {students.map((item) => (
                    <option key={item.linkId} value={item.student.id}>{item.student.name} — {item.student.grade || "Class not recorded"}</option>
                  ))}
                </select>
              </section>
            )}

            {selectedStudent && (
              <>
                <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
                  <div className="flex flex-col md:flex-row md:justify-between gap-4">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Linked Student</span>
                      <h2 className="text-2xl font-black mt-1">{selectedStudent.student.name}</h2>
                      <p className="text-sm text-slate-400 mt-1">{selectedStudent.student.grade || "Class not recorded"}{selectedStudent.student.rollNumber ? ` · ${selectedStudent.student.rollNumber}` : ""}</p>
                    </div>
                    <span className="self-start px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase">{selectedStudent.student.status}</span>
                  </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
                    <p className="text-xs text-slate-400 uppercase font-bold">Attendance</p>
                    <p className="text-3xl font-black mt-2">{selectedStudent.attendance.rate === null ? "—" : `${selectedStudent.attendance.rate}%`}</p>
                    <p className="text-xs text-slate-500 mt-2">{selectedStudent.attendance.totalRecords === 0 ? "No attendance records yet" : `${selectedStudent.attendance.presentCount} present · ${selectedStudent.attendance.absentCount} absent`}</p>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
                    <p className="text-xs text-slate-400 uppercase font-bold">Fees billed</p>
                    <p className="text-2xl font-black mt-2">{selectedStudent.fees.recordCount === 0 ? "—" : formatMoney(selectedStudent.fees.totalBilled)}</p>
                    <p className="text-xs text-slate-500 mt-2">{selectedStudent.fees.recordCount === 0 ? "No fee records yet" : `${selectedStudent.fees.recordCount} fee record${selectedStudent.fees.recordCount === 1 ? "" : "s"}`}</p>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
                    <p className="text-xs text-slate-400 uppercase font-bold">Outstanding</p>
                    <p className="text-2xl font-black mt-2">{selectedStudent.fees.recordCount === 0 ? "—" : formatMoney(selectedStudent.fees.outstanding)}</p>
                    <p className="text-xs text-slate-500 mt-2">{selectedStudent.fees.recordCount === 0 ? "No fee records yet" : selectedStudent.fees.outstanding > 0 ? "Amount currently outstanding" : "No outstanding balance"}</p>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
                    <p className="text-xs text-slate-400 uppercase font-bold">Payments</p>
                    <p className="text-2xl font-black mt-2">{selectedStudent.payments.recordCount === 0 ? "—" : formatMoney(selectedStudent.payments.totalPaid)}</p>
                    <p className="text-xs text-slate-500 mt-2">{selectedStudent.payments.recordCount === 0 ? "No payment records yet" : `${selectedStudent.payments.recordCount} payment record${selectedStudent.payments.recordCount === 1 ? "" : "s"}`}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                    <div className="mb-4">
                      <h3 className="font-bold text-lg">Fee Status</h3>
                      <p className="text-xs text-slate-500 mt-1">Live records for this linked student</p>
                    </div>
                    {selectedStudent.fees.records.length === 0 ? (
                      <p className="text-sm text-slate-500 py-8 text-center">No fee records yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {selectedStudent.fees.records.map((fee) => (
                          <div key={fee.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                            <div className="flex justify-between gap-4">
                              <div>
                                <p className="font-semibold text-slate-200">{fee.feeType?.name || "Fee"}</p>
                                <p className="text-xs text-slate-500 mt-1">Due {formatDate(fee.dueDate)}</p>
                              </div>
                              <span className="text-xs font-bold uppercase text-slate-300">{fee.status}</span>
                            </div>
                            <div className="flex justify-between mt-3 text-sm">
                              <span className="text-slate-400">Net amount</span>
                              <span className="font-bold">{formatMoney(fee.netAmount)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>

                  <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                    <div className="mb-4">
                      <h3 className="font-bold text-lg">Payment History</h3>
                      <p className="text-xs text-slate-500 mt-1">Recorded payments for this student</p>
                    </div>
                    {selectedStudent.payments.records.length === 0 ? (
                      <p className="text-sm text-slate-500 py-8 text-center">No payment records yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {selectedStudent.payments.records.map((payment) => (
                          <div key={payment.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                            <div className="flex justify-between gap-4">
                              <div>
                                <p className="font-semibold text-slate-200">{formatMoney(payment.amount)}</p>
                                <p className="text-xs text-slate-500 mt-1">{formatDate(payment.paymentDate)} · {payment.paymentMethod || "—"}</p>
                              </div>
                              <span className="text-xs font-bold uppercase text-emerald-400">{payment.status}</span>
                            </div>
                            {payment.transactionReference && <p className="text-xs text-slate-500 mt-3">Reference: {payment.transactionReference}</p>}
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                </div>

                <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                  <div className="mb-4">
                    <h3 className="font-bold text-lg">Attendance History</h3>
                    <p className="text-xs text-slate-500 mt-1">Recent attendance records for this student</p>
                  </div>
                  {selectedStudent.attendance.recent.length === 0 ? (
                    <p className="text-sm text-slate-500 py-8 text-center">No attendance records yet.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-xs uppercase text-slate-500 border-b border-slate-800">
                            <th className="py-3 pr-4">Date</th>
                            <th className="py-3 pr-4">Status</th>
                            <th className="py-3">Punch time</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedStudent.attendance.recent.map((record) => (
                            <tr key={record.id} className="border-b border-slate-800/70">
                              <td className="py-3 pr-4">{formatDate(record.date)}</td>
                              <td className="py-3 pr-4"><span className={record.status.toUpperCase() === "PRESENT" ? "text-emerald-400 font-semibold" : "text-red-400 font-semibold"}>{record.status}</span></td>
                              <td className="py-3 text-slate-400">{record.punchTime || "—"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>

                <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                  <div className="mb-4">
                    <h3 className="font-bold text-lg">Messages</h3>
                    <p className="text-xs text-slate-500 mt-1">This section will be wired to the secure messaging API in the next integration step.</p>
                  </div>
                  <div className="border border-dashed border-slate-700 rounded-xl p-8 text-center text-sm text-slate-500">No messages for this student yet.</div>
                </section>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
