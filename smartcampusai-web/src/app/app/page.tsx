"use client";

import { useTheme } from "@/components/theme/ThemeProvider";

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
  gender?: string;
};

type Teacher = {
  id: string;
  name: string;
  status?: string;
  gender?: string;
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

type AttendanceRecord = {
  id: string;
  personId: string;
  personName: string;
  role: "Student" | "Teacher";
  date: string;
  status:
    | "PRESENT"
    | "ABSENT"
    | "LATE"
    | "HALF_DAY"
    | "LEAVE";
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
  const { theme } = useTheme();

  const heroTextColor = (() => {
    const hex = theme.primary.replace("#", "");
    if (hex.length !== 6) return "#FFFFFF";

    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance > 0.62 ? "#0F172A" : "#FFFFFF";
  })();

  const heroMutedColor =
    heroTextColor === "#FFFFFF"
      ? "rgba(255,255,255,0.70)"
      : "rgba(15,23,42,0.70)";


  const [me, setMe] = useState<MeResponse>({});
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [dues, setDues] = useState<FeeDue[]>([]);
  const [, setTotalOutstanding] = useState(0);
  const [payments, setPayments] = useState<FeePayment[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [attendanceRecords, setAttendanceRecords] =
    useState<AttendanceRecord[]>([]);
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
          attendanceResponse,
        ] = await Promise.all([
          fetch("/api/auth/me"),
          fetch("/api/students"),
          fetch("/api/teachers"),
          fetch("/api/fee-dues"),
          fetch("/api/fee-payments"),
          fetch("/api/exams"),
          fetch("/api/attendance"),
        ]);

        const [
          meData,
          studentsData,
          teachersData,
          duesData,
          paymentsData,
          examsData,
          attendanceData,
        ] = await Promise.all([
          meResponse.json(),
          studentsResponse.json(),
          teachersResponse.json(),
          duesResponse.json(),
          paymentsResponse.json(),
          examsResponse.json(),
          attendanceResponse.json(),
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

        if (attendanceResponse.ok) {
          setAttendanceRecords(attendanceData.records || []);
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

  const attendanceStats = useMemo(() => {
    const present = attendanceRecords.filter(
      (record) => record.status === "PRESENT"
    ).length;

    const absent = attendanceRecords.filter(
      (record) => record.status === "ABSENT"
    ).length;

    const late = attendanceRecords.filter(
      (record) => record.status === "LATE"
    ).length;

    const halfDay = attendanceRecords.filter(
      (record) => record.status === "HALF_DAY"
    ).length;

    const leave = attendanceRecords.filter(
      (record) => record.status === "LEAVE"
    ).length;

    const total = attendanceRecords.length;

    return {
      total,
      present,
      absent,
      late,
      halfDay,
      leave,
      rate: total > 0 ? Math.round((present / total) * 100) : 0,
    };
  }, [attendanceRecords]);

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

  const [heroSlide, setHeroSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setHeroSlide((current) => (current + 1) % 2);
    }, 6000);

    return () => window.clearInterval(timer);
  }, []);

  const tenantName = me.tenant?.name || "your school";

  return (
    <main className="min-h-screen bg-gradient-to-br from-[var(--sc-primary-soft)] via-white to-[var(--sc-secondary-soft)]">
      <div className="mx-auto max-w-[1500px] px-5 py-6 sm:px-8 sm:py-8">

        {/* HERO CAROUSEL — ADMIN + SMARTCAMPUSAI */}
        <section className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${heroSlide * 100}%)` }}
          >
            {/* SLIDE 1 — SCHOOL ADMIN WELCOME */}
            <div className="w-full shrink-0">
              <section
                className="relative min-h-[300px] overflow-hidden rounded-[30px] bg-[var(--sc-primary)] px-6 py-8 shadow-[0_30px_70px_-25px_var(--sc-primary)] sm:min-h-[320px] sm:px-9 sm:py-10"
                style={{ color: heroTextColor }}
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-[var(--sc-accent)]/30 blur-3xl"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-[var(--sc-secondary)]/25 blur-3xl"
                />

                <div className="relative z-10 flex h-full min-h-[260px] flex-col justify-center gap-7 lg:flex-row lg:items-center lg:justify-between">
                  <div className="max-w-2xl">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/85 backdrop-blur-xl">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,.9)]" />
                      Campus operating normally
                    </div>

                    <p
                      className="text-sm font-semibold"
                      style={{ color: heroMutedColor }}
                    >
                      Campus Dashboard
                    </p>

                    <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                      Good to see you, School Administrator
                    </h1>

                    <p
                      className="mt-3 max-w-xl text-sm leading-6 sm:text-base"
                      style={{ color: heroMutedColor }}
                    >
                      Welcome back to SmartCampusAI. Monitor your school,
                      manage daily operations and make smarter decisions from
                      one intelligent workspace.
                    </p>
                  </div>

                  <div className="relative shrink-0">
                    <Link
                      href="/app/ai"
                      className="group flex items-center gap-4 rounded-2xl border border-white/20 bg-white/10 px-5 py-4 shadow-[0_20px_45px_rgba(0,0,0,.2),inset_0_1px_1px_rgba(255,255,255,.25)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-white/15"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-lg text-black shadow-[0_8px_20px_rgba(0,0,0,.2)]">
                        ✦
                      </div>

                      <div>
                        <p className="text-sm font-bold">
                          AI Command Center
                        </p>
                        <p
                          className="mt-0.5 text-xs"
                          style={{ color: heroMutedColor }}
                        >
                          Ask your school anything
                        </p>
                      </div>

                      <span className="ml-2 text-white/60 transition group-hover:translate-x-1">
                        →
                      </span>
                    </Link>
                  </div>
                </div>
              </section>
            </div>

            {/* SLIDE 2 — SMARTCAMPUSAI BROADCAST */}
            <div className="w-full shrink-0">
              <section
                className="relative isolate min-h-[300px] overflow-hidden rounded-[30px] bg-[var(--sc-primary)] px-6 py-7 shadow-[0_35px_90px_-25px_var(--sc-primary)] sm:min-h-[320px] sm:px-9 sm:py-8"
                style={{ color: heroTextColor }}
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-28 -top-32 h-80 w-80 rounded-full bg-[var(--sc-accent)]/40 blur-3xl"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-[var(--sc-secondary)]/35 blur-3xl"
                />

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 overflow-hidden"
                >
                  <div
                    className="absolute right-[8%] top-[8%] h-44 w-44 rounded-full border border-white/30 bg-white/10 shadow-[inset_-24px_-28px_55px_rgba(0,0,0,.25),inset_18px_18px_35px_rgba(255,255,255,.3),0_30px_70px_rgba(0,0,0,.3)] backdrop-blur-md"
                    style={{
                      transform:
                        "perspective(800px) rotateX(18deg) rotateY(-24deg)",
                    }}
                  >
                    <div className="absolute left-8 top-6 h-9 w-20 rotate-[-25deg] rounded-full bg-white/35 blur-md" />
                    <div className="absolute inset-7 flex items-center justify-center rounded-full border border-white/15">
                      <span className="text-3xl font-black text-white/80">
                        S
                      </span>
                    </div>
                  </div>

                  <div
                    className="absolute right-[19%] top-[39%] w-52 rounded-[22px] border border-white/25 bg-white/10 p-4 shadow-[0_25px_55px_rgba(0,0,0,.3)] backdrop-blur-xl"
                    style={{
                      transform:
                        "perspective(900px) rotateX(16deg) rotateY(-20deg) rotateZ(5deg)",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
                        ✦
                      </span>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                          SmartCampusAI
                        </p>
                        <p className="text-xs font-bold text-white">
                          Latest Update
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 h-1.5 w-28 rounded-full bg-white/25" />
                    <div className="mt-2 h-1.5 w-20 rounded-full bg-[var(--sc-accent)]/60" />
                  </div>

                  <div
                    className="absolute bottom-[10%] right-[7%] rounded-2xl border border-white/25 bg-white/10 px-4 py-3 shadow-[0_20px_45px_rgba(0,0,0,.25)] backdrop-blur-xl"
                    style={{
                      transform:
                        "perspective(700px) rotateX(-8deg) rotateY(-18deg) rotateZ(-3deg)",
                    }}
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-white/55">
                      Subscription
                    </p>
                    <p className="mt-0.5 text-sm font-bold text-white">
                      STARTER · ACTIVE
                    </p>
                  </div>

                  <div
                    className="absolute -right-4 top-[18%] h-80 w-80 rounded-full border border-white/20"
                    style={{
                      transform:
                        "perspective(800px) rotateX(68deg) rotateY(-12deg) rotateZ(-20deg)",
                    }}
                  />
                </div>

                <div className="relative z-10 grid min-h-[260px] items-center gap-8 lg:grid-cols-[1fr_auto]">
                  <div className="max-w-2xl">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white/85 backdrop-blur-xl">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                      SmartCampusAI Broadcast
                    </div>

                    <p
                      className="text-sm font-semibold"
                      style={{ color: heroMutedColor }}
                    >
                      Platform News & Subscription
                    </p>

                    <h2 className="mt-2 max-w-xl text-3xl font-bold tracking-tight sm:text-4xl">
                      Smarter school management keeps getting better.
                    </h2>

                    <p
                      className="mt-3 max-w-xl text-sm leading-6 sm:text-base"
                      style={{ color: heroMutedColor }}
                    >
                      Stay up to date with SmartCampusAI news, new capabilities,
                      important platform announcements and subscription reminders.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <a
                        href="https://www.smartcampusai.in/"
                        className="rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-slate-950 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
                      >
                        Explore SmartCampusAI →
                      </a>

                      <a
                        href="https://www.smartcampusai.in/pricing"
                        className="rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white shadow-lg backdrop-blur-xl transition hover:bg-white/15"
                      >
                        Subscription & Pricing
                      </a>
                    </div>
                  </div>

                  <div className="relative z-20 w-full max-w-sm">
                    <div className="rounded-[24px] border border-white/20 bg-white/10 p-5 shadow-[0_25px_55px_rgba(0,0,0,.25)] backdrop-blur-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-white/55">
                            Current plan
                          </p>
                          <p className="mt-1 text-xl font-bold text-white">
                            STARTER
                          </p>
                        </div>

                        <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-[11px] font-bold text-emerald-200">
                          ACTIVE
                        </span>
                      </div>

                      <div className="mt-5 h-px bg-white/10" />

                      <p className="mt-4 text-xs text-white/55">
                        Your SmartCampusAI workspace is active.
                      </p>

                      <p className="mt-1 text-sm font-semibold text-white/90">
                        Watch this space for product news and important
                        subscription reminders.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Carousel controls */}
          <div className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/15 bg-black/15 px-2.5 py-1.5 backdrop-blur-md">
            <button
              type="button"
              aria-label="Show admin welcome banner"
              onClick={() => setHeroSlide(0)}
              className={`h-2 rounded-full transition-all ${
                heroSlide === 0 ? "w-6 bg-white" : "w-2 bg-white/40"
              }`}
            />
            <button
              type="button"
              aria-label="Show SmartCampusAI broadcast banner"
              onClick={() => setHeroSlide(1)}
              className={`h-2 rounded-full transition-all ${
                heroSlide === 1 ? "w-6 bg-white" : "w-2 bg-white/40"
              }`}
            />
          </div>
        </section>

        {/* GRAPHICAL CAMPUS STATISTICS */}
        <section className="mb-8">
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--sc-primary)]">
              Campus Intelligence
            </p>
            <h2 className="mt-1 text-xl font-bold text-slate-900">
              Campus Statistics
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Live student and teacher demographics at a glance.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {/* STUDENTS */}
            <div className="rounded-[28px] border border-slate-200/70 bg-white/85 p-6 shadow-[0_18px_50px_-30px_rgba(15,23,42,.35)] backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    Students
                  </p>
                  <p className="mt-1 text-3xl font-bold text-slate-900">
                    {activeStudents}
                  </p>
                  <p className="text-xs text-slate-500">Active students</p>
                </div>

                <div
                  className="flex h-24 w-24 items-center justify-center rounded-full"
                  style={{
                    background: `conic-gradient(
                      var(--sc-primary) ${
                        activeStudents
                          ? (students.filter(
                              (student) =>
                                student.status === "ACTIVE" &&
                                student.gender?.toLowerCase() === "male"
                            ).length /
                              activeStudents) *
                            100
                          : 0
                      }%,
                      var(--sc-accent) ${
                        activeStudents
                          ? (students.filter(
                              (student) =>
                                student.status === "ACTIVE" &&
                                student.gender?.toLowerCase() !== "male"
                            ).length /
                              activeStudents) *
                            100
                          : 0
                      }%,
                      var(--sc-primary-soft) 0
                    )`,
                  }}
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-sm font-bold text-slate-800">
                    {activeStudents}
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  {
                    label: "Male",
                    value: students.filter(
                      (student) =>
                        student.status === "ACTIVE" &&
                        student.gender?.toLowerCase() === "male"
                    ).length,
                  },
                  {
                    label: "Female",
                    value: students.filter(
                      (student) =>
                        student.status === "ACTIVE" &&
                        student.gender?.toLowerCase() === "female"
                    ).length,
                  },
                  {
                    label: "Other",
                    value: students.filter(
                      (student) =>
                        student.status === "ACTIVE" &&
                        !["male", "female"].includes(
                          student.gender?.toLowerCase() || ""
                        )
                    ).length,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl bg-[var(--sc-primary-soft)] px-3 py-4 text-center"
                  >
                    <p className="text-xl font-bold text-slate-900">
                      {item.value}
                    </p>
                    <p className="mt-1 text-xs font-medium text-slate-500">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* TEACHERS */}
            <div className="rounded-[28px] border border-slate-200/70 bg-white/85 p-6 shadow-[0_18px_50px_-30px_rgba(15,23,42,.35)] backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    Teachers
                  </p>
                  <p className="mt-1 text-3xl font-bold text-slate-900">
                    {activeTeachers}
                  </p>
                  <p className="text-xs text-slate-500">Active teachers</p>
                </div>

                <div
                  className="flex h-24 w-24 items-center justify-center rounded-full"
                  style={{
                    background: `conic-gradient(
                      var(--sc-secondary) ${
                        activeTeachers
                          ? (teachers.filter(
                              (teacher) =>
                                teacher.status === "ACTIVE" &&
                                teacher.gender?.toLowerCase() === "male"
                            ).length /
                              activeTeachers) *
                            100
                          : 0
                      }%,
                      var(--sc-accent) ${
                        activeTeachers
                          ? (teachers.filter(
                              (teacher) =>
                                teacher.status === "ACTIVE" &&
                                teacher.gender?.toLowerCase() !== "male"
                            ).length /
                              activeTeachers) *
                            100
                          : 0
                      }%,
                      var(--sc-secondary-soft) 0
                    )`,
                  }}
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-sm font-bold text-slate-800">
                    {activeTeachers}
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  {
                    label: "Male",
                    value: teachers.filter(
                      (teacher) =>
                        teacher.status === "ACTIVE" &&
                        teacher.gender?.toLowerCase() === "male"
                    ).length,
                  },
                  {
                    label: "Female",
                    value: teachers.filter(
                      (teacher) =>
                        teacher.status === "ACTIVE" &&
                        teacher.gender?.toLowerCase() === "female"
                    ).length,
                  },
                  {
                    label: "Other",
                    value: teachers.filter(
                      (teacher) =>
                        teacher.status === "ACTIVE" &&
                        !["male", "female"].includes(
                          teacher.gender?.toLowerCase() || ""
                        )
                    ).length,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl bg-[var(--sc-secondary-soft)] px-3 py-4 text-center"
                  >
                    <p className="text-xl font-bold text-slate-900">
                      {item.value}
                    </p>
                    <p className="mt-1 text-xs font-medium text-slate-500">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ATTENDANCE INTELLIGENCE */}
        <section className="mb-8">
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--sc-primary)]">
              Operational Intelligence
            </p>
            <h2 className="mt-1 text-xl font-bold text-slate-900">
              Attendance Intelligence
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Live attendance activity across students and teachers.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1.35fr_.65fr]">
            {/* ATTENDANCE TREND */}
            <div className="rounded-[28px] border border-slate-200/70 bg-white/85 p-6 shadow-[0_18px_50px_-30px_rgba(15,23,42,.35)] backdrop-blur-xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    Attendance Overview
                  </p>
                  <p className="mt-1 text-3xl font-bold text-slate-900">
                    {attendanceStats.rate}%
                  </p>
                  <p className="text-xs text-slate-500">
                    Present attendance rate
                  </p>
                </div>

                <div className="rounded-2xl bg-[var(--sc-primary-soft)] px-4 py-3 text-right">
                  <p className="text-xs font-medium text-slate-500">
                    Total Records
                  </p>
                  <p className="mt-1 text-xl font-bold text-slate-900">
                    {attendanceStats.total}
                  </p>
                </div>
              </div>

              <div className="mt-7 h-44">
                {attendanceStats.total > 0 ? (
                  <svg
                    viewBox="0 0 700 180"
                    className="h-full w-full overflow-visible"
                    role="img"
                    aria-label="Attendance status graph"
                  >
                    <line
                      x1="20"
                      y1="145"
                      x2="680"
                      y2="145"
                      stroke="currentColor"
                      className="text-slate-200"
                      strokeWidth="2"
                    />

                    <line
                      x1="20"
                      y1="90"
                      x2="680"
                      y2="90"
                      stroke="currentColor"
                      className="text-slate-100"
                      strokeWidth="2"
                    />

                    <line
                      x1="20"
                      y1="35"
                      x2="680"
                      y2="35"
                      stroke="currentColor"
                      className="text-slate-100"
                      strokeWidth="2"
                    />

                    <polyline
                      fill="none"
                      stroke="var(--sc-primary)"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={`20,${145 - Math.min(attendanceStats.present * 12, 110)}
                        185,${145 - Math.min(attendanceStats.late * 12, 110)}
                        350,${145 - Math.min(attendanceStats.absent * 12, 110)}
                        515,${145 - Math.min(attendanceStats.halfDay * 12, 110)}
                        680,${145 - Math.min(attendanceStats.leave * 12, 110)}`}
                    />

                    {[
                      {
                        x: 20,
                        value: attendanceStats.present,
                        label: "Present",
                      },
                      {
                        x: 185,
                        value: attendanceStats.late,
                        label: "Late",
                      },
                      {
                        x: 350,
                        value: attendanceStats.absent,
                        label: "Absent",
                      },
                      {
                        x: 515,
                        value: attendanceStats.halfDay,
                        label: "Half Day",
                      },
                      {
                        x: 680,
                        value: attendanceStats.leave,
                        label: "Leave",
                      },
                    ].map((point) => (
                      <g key={point.label}>
                        <circle
                          cx={point.x}
                          cy={145 - Math.min(point.value * 12, 110)}
                          r="7"
                          fill="var(--sc-primary)"
                        />
                        <text
                          x={point.x}
                          y="170"
                          textAnchor="middle"
                          className="fill-slate-400 text-[10px]"
                        >
                          {point.label}
                        </text>
                      </g>
                    ))}
                  </svg>
                ) : (
                  <div className="flex h-full items-center justify-center rounded-2xl bg-[var(--sc-primary-soft)] text-sm text-slate-500">
                    No attendance records available yet.
                  </div>
                )}
              </div>
            </div>

            {/* STATUS BREAKDOWN */}
            <div className="rounded-[28px] border border-slate-200/70 bg-white/85 p-6 shadow-[0_18px_50px_-30px_rgba(15,23,42,.35)] backdrop-blur-xl">
              <p className="text-sm font-semibold text-slate-500">
                Status Breakdown
              </p>

              <div className="mt-5 space-y-4">
                {[
                  {
                    label: "Present",
                    value: attendanceStats.present,
                    className: "bg-[var(--sc-primary)]",
                  },
                  {
                    label: "Absent",
                    value: attendanceStats.absent,
                    className: "bg-red-500",
                  },
                  {
                    label: "Late",
                    value: attendanceStats.late,
                    className: "bg-amber-500",
                  },
                  {
                    label: "Half Day",
                    value: attendanceStats.halfDay,
                    className: "bg-[var(--sc-secondary)]",
                  },
                  {
                    label: "Leave",
                    value: attendanceStats.leave,
                    className: "bg-[var(--sc-accent)]",
                  },
                ].map((item) => {
                  const percentage =
                    attendanceStats.total > 0
                      ? Math.round(
                          (item.value / attendanceStats.total) * 100
                        )
                      : 0;

                  return (
                    <div key={item.label}>
                      <div className="mb-1.5 flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-600">
                          {item.label}
                        </span>
                        <span className="font-bold text-slate-900">
                          {item.value} · {percentage}%
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full ${item.className}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
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
              className="group rounded-2xl border border-[var(--sc-primary)]/20 bg-gradient-to-br from-[var(--sc-primary-soft)] to-[var(--sc-secondary-soft)] p-4 shadow-sm transition hover:border-[var(--sc-primary)] hover:shadow-md"
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
              className="group rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-fuchsia-50 p-4 shadow-sm transition hover:border-purple-400 hover:shadow-md"
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
              className="group rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50 p-4 shadow-sm transition hover:border-emerald-400 hover:shadow-md"
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
              className="group rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 p-4 shadow-sm transition hover:border-orange-400 hover:shadow-md"
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
          <section className="overflow-hidden rounded-2xl border border-[var(--sc-primary)]/15 bg-gradient-to-br from-white via-[var(--sc-primary-soft)] to-[var(--sc-secondary-soft)] shadow-sm">
            <div className="flex items-center justify-between border-b border-[var(--sc-primary)]/15 bg-gradient-to-r from-[var(--sc-primary-soft)] via-white to-[var(--sc-secondary-soft)] px-5 py-5">
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
                className="text-xs font-bold text-[var(--sc-primary)] hover:text-[var(--sc-primary-dark)]"
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
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-sm font-bold text-white shadow-md">
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

                    <p className="ml-4 shrink-0 text-sm font-bold text-emerald-700">
                      +{formatMoney(Number(payment.amount || 0))}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* EXAMS */}
          <section className="overflow-hidden rounded-2xl border border-[var(--sc-primary)]/15 bg-gradient-to-br from-white via-[var(--sc-primary-soft)] to-[var(--sc-secondary-soft)] shadow-sm">
            <div className="flex items-center justify-between border-b border-[var(--sc-primary)]/15 bg-gradient-to-r from-[var(--sc-primary-soft)] via-white to-[var(--sc-secondary-soft)] px-5 py-5">
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
                className="text-xs font-bold text-[var(--sc-primary)] hover:text-[var(--sc-primary-dark)]"
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
          <div className="flex items-center justify-between border-b border-[var(--sc-primary)]/15 bg-gradient-to-r from-[var(--sc-primary-soft)] via-white to-[var(--sc-secondary-soft)] px-5 py-5">
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
              className="text-xs font-bold text-[var(--sc-primary)] hover:text-[var(--sc-primary-dark)]"
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
