"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type MeResponse = {
  user?: {
    name?: string;
    email?: string;
    role?: string;
  };
  tenant?: {
    name?: string;
    plan?: string;
    status?: string;
  };
};

type Student = {
  id: string;
  name: string;
  status?: string;
};

type Teacher = {
  id: string;
  name: string;
  status?: string;
};

type FeeDue = {
  id: string;
  student_id?: string;
  outstanding_amount?: number;
};

type FeePayment = {
  id: string;
  student_id: string;
  payment_date: string;
  amount: number;
  payment_method: string;
  status: string;
};

type Exam = {
  id: string;
  name: string;
  start_date?: string;
  end_date?: string;
  status?: string;
};

function formatMoney(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

function formatDate(value?: string) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default function AppDashboard() {
  const [me, setMe] = useState<MeResponse>({});
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [dues, setDues] = useState<FeeDue[]>([]);
  const [totalOutstanding, setTotalOutstanding] = useState(0);
  const [payments, setPayments] = useState<FeePayment[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [
          meResponse,
          studentsResponse,
          teachersResponse,
          duesResponse,
          paymentsResponse,
          examsResponse,
        ] = await Promise.all([
          fetch("/api/auth/me"),
          fetch("/api/students"),
          fetch("/api/teachers"),
          fetch("/api/fee-dues"),
          fetch("/api/fee-payments"),
          fetch("/api/exams"),
        ]);

        const [
          meData,
          studentsData,
          teachersData,
          duesData,
          paymentsData,
          examsData,
        ] = await Promise.all([
          meResponse.json(),
          studentsResponse.json(),
          teachersResponse.json(),
          duesResponse.json(),
          paymentsResponse.json(),
          examsResponse.json(),
        ]);

        if (meResponse.ok) setMe(meData);
        if (studentsResponse.ok) {
          setStudents(studentsData.students || []);
        }
        if (teachersResponse.ok) {
          setTeachers(teachersData.teachers || []);
        }
        if (duesResponse.ok) {
          setDues(duesData.dues || []);
          setTotalOutstanding(Number(duesData.totalOutstanding || 0));
        }
        if (paymentsResponse.ok) {
          setPayments(paymentsData.payments || []);
        }
        if (examsResponse.ok) {
          setExams(examsData.exams || []);
        }
      } catch (error) {
        console.error("Dashboard loading error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const activeStudents = useMemo(
    () => students.filter((student) => student.status === "ACTIVE").length,
    [students]
  );

  const activeTeachers = useMemo(
    () => teachers.filter((teacher) => teacher.status === "ACTIVE").length,
    [teachers]
  );

  const completedPayments = useMemo(
    () => payments.filter((payment) => payment.status === "COMPLETED"),
    [payments]
  );

  const totalCollection = useMemo(
    () =>
      completedPayments.reduce(
        (total, payment) => total + Number(payment.amount || 0),
        0
      ),
    [completedPayments]
  );

  const recentPayments = useMemo(
    () =>
      [...completedPayments]
        .sort(
          (a, b) =>
            new Date(b.payment_date).getTime() -
            new Date(a.payment_date).getTime()
        )
        .slice(0, 5),
    [completedPayments]
  );

  const upcomingExams = useMemo(
    () =>
      [...exams]
        .filter((exam) => exam.status !== "CANCELLED")
        .sort(
          (a, b) =>
            new Date(a.start_date || "9999-12-31").getTime() -
            new Date(b.start_date || "9999-12-31").getTime()
        )
        .slice(0, 5),
    [exams]
  );

  const studentNameById = useMemo(() => {
    const result: Record<string, string> = {};

    students.forEach((student) => {
      result[student.id] = student.name;
    });

    return result;
  }, [students]);

  const userName = me.user?.name || "Administrator";
  const tenantName = me.tenant?.name || "your school";

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <div className="mx-auto max-w-[1500px] px-5 py-6 sm:px-8 sm:py-8">

        {/* PREMIUM HERO */}
        <section className="relative overflow-hidden rounded-[28px] bg-black px-6 py-8 text-white shadow-xl sm:px-9 sm:py-10">
          <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Campus operating normally
              </div>

              <p className="text-sm font-medium text-white/60">
                Campus Dashboard
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Good to see you, {userName}
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-white/65 sm:text-base">
                Welcome back to SmartCampusAI. Monitor your school,
                manage daily operations and make smarter decisions from
                one intelligent workspace.
              </p>
            </div>

            <div className="relative shrink-0">
              <Link
                href="/app/ai"
                className="group flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur transition hover:bg-white/15"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-lg text-black shadow-lg">
                  ✦
                </div>

                <div>
                  <p className="text-sm font-bold">
                    AI Command Center
                  </p>
                  <p className="mt-0.5 text-xs text-white/55">
                    Ask your school anything
                  </p>
                </div>

                <span className="ml-2 text-white/50 transition group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* KPI GRID */}
        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <Link
            href="/app/students"
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Students
                </p>

                <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                  {loading ? "—" : students.length}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {loading ? "Loading..." : `${activeStudents} active students`}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl">
                🎓
              </div>
            </div>
          </Link>

          <Link
            href="/app/teachers"
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Teachers
                </p>

                <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                  {loading ? "—" : teachers.length}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {loading ? "Loading..." : `${activeTeachers} active teachers`}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-xl">
                👨‍🏫
              </div>
            </div>
          </Link>

          <Link
            href="/app/fees/payments"
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Fee Collection
                </p>

                <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                  {loading ? "—" : formatMoney(totalCollection)}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {completedPayments.length} completed payment
                  {completedPayments.length === 1 ? "" : "s"}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-xl">
                ₹
              </div>
            </div>
          </Link>

          <Link
            href="/app/fees/dues"
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Outstanding Dues
                </p>

                <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                  {loading ? "—" : formatMoney(totalOutstanding)}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {dues.length} outstanding fee
                  {dues.length === 1 ? "" : "s"}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-xl">
                !
              </div>
            </div>
          </Link>
        </section>

        {/* QUICK ACTIONS */}
        <section className="mt-8">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-950">
              Quick Actions
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Get common school tasks done faster.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/app/students"
              className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-300 hover:shadow-md"
            >
              <span className="text-lg">🎓</span>
              <p className="mt-3 text-sm font-bold text-slate-900">
                Manage Students
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Student records & 360
              </p>
            </Link>

            <Link
              href="/app/teachers"
              className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-300 hover:shadow-md"
            >
              <span className="text-lg">👨‍🏫</span>
              <p className="mt-3 text-sm font-bold text-slate-900">
                Manage Teachers
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Staff and assignments
              </p>
            </Link>

            <Link
              href="/app/fees/student-fees"
              className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-300 hover:shadow-md"
            >
              <span className="text-lg">📋</span>
              <p className="mt-3 text-sm font-bold text-slate-900">
                Assign Student Fee
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Create a fee assignment
              </p>
            </Link>

            <Link
              href="/app/fees/payments"
              className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-300 hover:shadow-md"
            >
              <span className="text-lg">₹</span>
              <p className="mt-3 text-sm font-bold text-slate-900">
                Record Payment
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Collect school fees
              </p>
            </Link>
          </div>
        </section>

        {/* ACTIVITY */}
        <div className="mt-8 grid gap-6 xl:grid-cols-2">

          {/* FEE COLLECTION */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5">
              <div>
                <h2 className="font-bold text-slate-950">
                  Recent Fee Collections
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Latest completed payments
                </p>
              </div>

              <Link
                href="/app/fees/payments"
                className="text-xs font-bold text-blue-600 hover:text-blue-700"
              >
                View all →
              </Link>
            </div>

            {loading ? (
              <div className="px-5 py-10 text-center text-sm text-slate-500">
                Loading...
              </div>
            ) : recentPayments.length === 0 ? (
              <div className="px-5 py-10 text-center text-sm text-slate-500">
                No fee payments recorded yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between px-5 py-4"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-sm font-bold text-emerald-700">
                        ₹
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {studentNameById[payment.student_id] ||
                            "Unknown student"}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {formatDate(payment.payment_date)} ·{" "}
                          {payment.payment_method.replaceAll("_", " ")}
                        </p>
                      </div>
                    </div>

                    <p className="ml-4 shrink-0 text-sm font-bold text-emerald-600">
                      +{formatMoney(Number(payment.amount || 0))}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* EXAMS */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5">
              <div>
                <h2 className="font-bold text-slate-950">
                  Upcoming Exams
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Examination schedule
                </p>
              </div>

              <Link
                href="/app/exams"
                className="text-xs font-bold text-blue-600 hover:text-blue-700"
              >
                View all →
              </Link>
            </div>

            {loading ? (
              <div className="px-5 py-10 text-center text-sm text-slate-500">
                Loading...
              </div>
            ) : upcomingExams.length === 0 ? (
              <div className="px-5 py-10 text-center text-sm text-slate-500">
                No upcoming exams found.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {upcomingExams.map((exam) => (
                  <Link
                    key={exam.id}
                    href={`/app/exams/${exam.id}`}
                    className="flex items-center justify-between px-5 py-4 transition hover:bg-slate-50"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-sm">
                        📝
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {exam.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {formatDate(exam.start_date)}
                          {exam.end_date
                            ? ` – ${formatDate(exam.end_date)}`
                            : ""}
                        </p>
                      </div>
                    </div>

                    <span className="ml-3 shrink-0 rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-blue-700">
                      {exam.status || "Scheduled"}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* DUES */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5">
            <div>
              <h2 className="font-bold text-slate-950">
                Outstanding Fees
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Accounts requiring attention
              </p>
            </div>

            <Link
              href="/app/fees/dues"
              className="text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              Open dues →
            </Link>
          </div>

          {loading ? (
            <div className="px-5 py-10 text-center text-sm text-slate-500">
              Loading...
            </div>
          ) : dues.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-lg text-emerald-600">
                ✓
              </div>

              <p className="mt-3 text-sm font-bold text-slate-900">
                Everything is up to date
              </p>

              <p className="mt-1 text-xs text-slate-500">
                No outstanding student fees require attention.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {dues.slice(0, 5).map((due) => (
                <div
                  key={due.id}
                  className="flex items-center justify-between px-5 py-4"
                >
                  <p className="text-sm font-semibold text-slate-900">
                    {studentNameById[due.student_id || ""] ||
                      "Unknown student"}
                  </p>

                  <p className="text-sm font-bold text-rose-600">
                    {formatMoney(Number(due.outstanding_amount || 0))}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* FOOTER STATUS */}
        <section className="mt-8 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              {tenantName}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              SmartCampusAI School Management OS
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="rounded-full bg-emerald-50 px-3 py-1.5 font-semibold text-emerald-700">
              {me.tenant?.status || "ACTIVE"}
            </span>

            <span className="text-slate-400">
              {me.tenant?.plan || "STARTER"} plan
            </span>
          </div>
        </section>
      </div>
    </main>
  );
}
