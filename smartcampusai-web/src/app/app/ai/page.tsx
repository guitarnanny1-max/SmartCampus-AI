"use client";

import { FormEvent, useEffect, useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type Analytics = {
  studentsByGrade: Array<{
    grade: string;
    count: number;
  }>;
  studentsByStatus: Array<{
    status: string;
    count: number;
  }>;
  fees: {
    assigned: number;
    collected: number;
    outstanding: number;
  };
  paymentsByMethod: Array<{
    method: string;
    amount: number;
  }>;
  upcomingExams: Array<{
    id: string;
    name: string;
    examType: string | null;
    startDate: string | null;
    endDate: string | null;
    status: string | null;
  }>;
};

type AIContext = {
  success: boolean;
  school?: {
    administrator?: {
      name?: string | null;
      role?: string | null;
    };
  };
  students?: {
    total: number;
    active: number;
  };
  teachers?: {
    total: number;
    active: number;
  };
  fees?: {
    assignedTotal: number;
    collectedTotal: number;
    outstandingAmount: number;
    outstandingCount: number;
  };
  payments?: {
    completedCount: number;
    totalCollected: number;
  };
  exams?: {
    total: number;
    upcoming: Array<{
      id: string;
      name: string;
      exam_type: string | null;
      start_date: string | null;
      end_date: string | null;
      status: string | null;
    }>;
  };
  analytics?: Analytics;
  error?: string;
};

const suggestions = [
  "Give me a summary of today's school operations.",
  "What should I check before the next examination?",
  "Help me understand the school's fee situation.",
  "Tell me about John Test",
];

function formatCurrency(value: number) {
  return `₹${value.toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })}`;
}

function formatDate(value: string | null) {
  if (!value) return "Date not set";

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getCollectionPercentage(
  collected: number,
  assigned: number
) {
  if (assigned <= 0) return 0;

  return Math.min(100, Math.round((collected / assigned) * 100));
}

export default function AICommandCenterPage() {
  const [context, setContext] = useState<AIContext | null>(null);
  const [contextLoading, setContextLoading] = useState(true);
  const [contextError, setContextError] = useState("");

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm SmartCampusAI. I can help you understand and manage your school operations using your school's live data.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadContext() {
      try {
        setContextLoading(true);

        const response = await fetch("/api/ai/context", {
          cache: "no-store",
        });

        const data: AIContext = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.error || "Unable to load school analytics."
          );
        }

        setContext(data);
        setContextError("");
      } catch (error) {
        setContextError(
          error instanceof Error
            ? error.message
            : "Unable to load school analytics."
        );
      } finally {
        setContextLoading(false);
      }
    }

    loadContext();
  }, []);

  async function sendMessage(messageOverride?: string) {
    const message = (messageOverride ?? input).trim();

    if (!message || loading) return;

    setMessages((current) => [
      ...current,
      {
        role: "user",
        content: message,
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Unable to get an AI response."
        );
      }

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: data.answer,
        },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            error instanceof Error
              ? error.message
              : "Unable to connect to SmartCampusAI.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await sendMessage();
  }

  const students = context?.students;
  const teachers = context?.teachers;
  const fees = context?.fees;
  const exams = context?.exams;
  const analytics = context?.analytics;

  const collectionPercentage = getCollectionPercentage(
    fees?.collectedTotal ?? 0,
    fees?.assignedTotal ?? 0
  );

  const maxGradeCount = Math.max(
    ...(analytics?.studentsByGrade.map((item) => item.count) ?? [1])
  );

  return (
    <main className="min-h-screen bg-[#f6f7f9]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-black px-6 py-8 text-white sm:px-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  AI Command Center
                </div>

                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  SmartCampusAI
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70 sm:text-base">
                  Live school intelligence for students, teachers, finance,
                  examinations, and daily operations.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 lg:min-w-64">
                <p className="text-xs uppercase tracking-wider text-white/50">
                  Intelligence Status
                </p>

                <p className="mt-1 text-sm font-medium">
                  {contextLoading
                    ? "Loading live data..."
                    : contextError
                      ? "Data connection issue"
                      : "Live school data connected"}
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-8">
            {contextError && (
              <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {contextError}
              </div>
            )}

            <section>
              <div className="mb-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  School overview
                </p>

                <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-900">
                  Live operating snapshot
                </h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-100 p-5 shadow-sm">
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                    Students
                  </p>
                  <p className="mt-3 text-3xl font-semibold text-slate-950">
                    {contextLoading ? "—" : students?.total ?? 0}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {students?.active ?? 0} active
                  </p>
                </div>

                <div className="rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-fuchsia-100 p-5 shadow-sm">
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                    Teachers
                  </p>
                  <p className="mt-3 text-3xl font-semibold text-slate-950">
                    {contextLoading ? "—" : teachers?.total ?? 0}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {teachers?.active ?? 0} active
                  </p>
                </div>

                <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-100 p-5 shadow-sm">
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                    Fee collected
                  </p>
                  <p className="mt-3 text-2xl font-semibold text-slate-950">
                    {contextLoading
                      ? "—"
                      : formatCurrency(fees?.collectedTotal ?? 0)}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {collectionPercentage}% of assigned
                  </p>
                </div>

                <div className="rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-amber-100 p-5 shadow-sm">
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                    Outstanding
                  </p>
                  <p className="mt-3 text-2xl font-semibold text-slate-950">
                    {contextLoading
                      ? "—"
                      : formatCurrency(fees?.outstandingAmount ?? 0)}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {fees?.outstandingCount ?? 0} fee records
                  </p>
                </div>

                <div className="rounded-2xl border border-rose-200 bg-gradient-to-br from-rose-50 to-pink-100 p-5 shadow-sm">
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                    Exams
                  </p>
                  <p className="mt-3 text-3xl font-semibold text-slate-950">
                    {contextLoading
                      ? "—"
                      : analytics?.upcomingExams.length ??
                        exams?.upcoming.length ??
                        0}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    upcoming
                  </p>
                </div>
              </div>
            </section>

            <section className="mt-8 grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Students
                    </p>
                    <h2 className="mt-1 text-lg font-semibold text-slate-950">
                      Students by grade
                    </h2>
                  </div>

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                    Live
                  </span>
                </div>

                <div className="mt-6 space-y-4">
                  {analytics?.studentsByGrade.length ? (
                    analytics.studentsByGrade.map((item) => (
                      <div key={item.grade}>
                        <div className="mb-1 flex items-center justify-between text-xs">
                          <span className="font-medium text-slate-700">
                            {item.grade}
                          </span>
                          <span className="text-slate-500">
                            {item.count}
                          </span>
                        </div>

                        <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all"
                            style={{
                              width: `${Math.max(
                                5,
                                (item.count / maxGradeCount) * 100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl bg-slate-50 p-6 text-center text-sm text-slate-500">
                      No student grade data available yet.
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Finance
                  </p>
                  <h2 className="mt-1 text-lg font-semibold text-slate-950">
                    Fee collection health
                  </h2>
                </div>

                <div className="mt-6">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-3xl font-semibold text-slate-950">
                        {collectionPercentage}%
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        collection progress
                      </p>
                    </div>

                    <p className="text-sm font-medium text-slate-700">
                      {formatCurrency(fees?.collectedTotal ?? 0)}
                    </p>
                  </div>

                  <div className="mt-5 h-5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all"
                      style={{
                        width: `${collectionPercentage}%`,
                      }}
                    />
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-3">
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs text-slate-500">Assigned</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {formatCurrency(fees?.assignedTotal ?? 0)}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs text-slate-500">Collected</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {formatCurrency(fees?.collectedTotal ?? 0)}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs text-slate-500">Outstanding</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {formatCurrency(fees?.outstandingAmount ?? 0)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Examinations
                  </p>
                  <h2 className="mt-1 text-lg font-semibold text-slate-950">
                    Upcoming examinations
                  </h2>
                </div>

                <div className="mt-5 space-y-3">
                  {analytics?.upcomingExams.length ? (
                    analytics.upcomingExams.map((exam) => (
                      <div
                        key={exam.id}
                        className="flex items-center justify-between gap-4 rounded-2xl border border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50 p-4 shadow-sm"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900">
                            {exam.name}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {exam.examType || "Examination"} ·{" "}
                            {formatDate(exam.startDate)}
                          </p>
                        </div>

                        <span className="shrink-0 rounded-full bg-white px-3 py-1 text-[11px] font-medium text-slate-600">
                          {exam.status || "Scheduled"}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl bg-slate-50 p-6 text-center text-sm text-slate-500">
                      No upcoming examinations found.
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Payments
                  </p>
                  <h2 className="mt-1 text-lg font-semibold text-slate-950">
                    Collection by method
                  </h2>
                </div>

                <div className="mt-5 space-y-4">
                  {analytics?.paymentsByMethod.length ? (
                    analytics.paymentsByMethod.map((item) => {
                      const total = fees?.collectedTotal ?? 0;
                      const percentage =
                        total > 0
                          ? Math.round((item.amount / total) * 100)
                          : 0;

                      return (
                        <div key={item.method}>
                          <div className="mb-1 flex justify-between text-xs">
                            <span className="font-medium text-slate-700">
                              {item.method}
                            </span>
                            <span className="text-slate-500">
                              {formatCurrency(item.amount)}
                            </span>
                          </div>

                          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-600"
                              style={{
                                width: `${Math.max(
                                  percentage > 0 ? 5 : 0,
                                  percentage
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="rounded-2xl bg-slate-50 p-6 text-center text-sm text-slate-500">
                      No completed payment data available yet.
                    </div>
                  )}
                </div>
              </div>
            </section>

            <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    AI Intelligence
                  </p>

                  <h2 className="mt-1 text-lg font-semibold text-slate-950">
                    Ask SmartCampusAI
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Ask questions about your live school data.
                  </p>
                </div>

                <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  {context?.school?.administrator?.role ||
                    "School Administrator"}
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => sendMessage(suggestion)}
                    disabled={loading}
                    className="rounded-2xl border border-violet-100 bg-white p-4 text-left text-sm leading-5 text-slate-700 shadow-sm transition hover:border-violet-300 hover:bg-violet-50 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>

              <div className="mt-6 rounded-3xl border border-violet-200 bg-gradient-to-br from-violet-50 via-white to-indigo-50 shadow-sm">
                <div className="max-h-[420px] space-y-4 overflow-y-auto p-5">
                  {messages.map((message, index) => (
                    <div
                      key={`${message.role}-${index}`}
                      className={`flex ${
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                          message.role === "user"
                            ? "bg-black text-white"
                            : "border border-slate-200 bg-white text-slate-700"
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}

                  {loading && (
                    <div className="flex justify-start">
                      <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">
                        SmartCampusAI is thinking...
                      </div>
                    </div>
                  )}
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="border-t border-slate-200 bg-white p-4 sm:p-5"
                >
                  <div className="flex gap-3">
                    <input
                      value={input}
                      onChange={(event) =>
                        setInput(event.target.value)
                      }
                      placeholder="Ask SmartCampusAI anything..."
                      maxLength={4000}
                      disabled={loading}
                      className="min-w-0 flex-1 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-black focus:ring-2 focus:ring-black/10 disabled:bg-slate-100"
                    />

                    <button
                      type="submit"
                      disabled={!input.trim() || loading}
                      className="rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-purple-200 transition hover:-translate-y-0.5 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {loading ? "Sending..." : "Send"}
                    </button>
                  </div>

                  <p className="mt-2 px-1 text-[11px] text-slate-400">
                    SmartCampusAI may make mistakes. Verify important
                    school decisions before acting.
                  </p>
                </form>
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
