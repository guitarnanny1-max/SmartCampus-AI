"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  GraduationCap,
  Layers3,
  Loader2,
  School,
  ShieldCheck,
} from "lucide-react";

type ClassRow = {
  name: string;
  sections: string[];
};

type FormData = {
  schoolName: string;
  schoolType: string;
  contactEmail: string;
  contactPhone: string;
  academicYear: string;
  startDate: string;
  endDate: string;
  classes: ClassRow[];
};

const initialClasses: ClassRow[] = [
  { name: "Nursery", sections: ["A"] },
  { name: "LKG", sections: ["A"] },
  { name: "UKG", sections: ["A"] },
  { name: "Grade 1", sections: ["A"] },
];

export default function OnboardingPage() {
  const router = useRouter();
  const params = useParams<{ subdomain: string }>();
  const subdomain = params.subdomain;

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<FormData>({
    schoolName: "",
    schoolType: "CBSE",
    contactEmail: "",
    contactPhone: "",
    academicYear: "2026-27",
    startDate: "2026-06-01",
    endDate: "2027-03-31",
    classes: initialClasses,
  });

  useEffect(() => {
    const controller = new AbortController();

    async function loadWorkspace() {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include",
          signal: controller.signal,
        });

        if (!response.ok) {
          router.replace("/login");
          return;
        }

        const data = await response.json();

        if (!data.user || !data.tenant) {
          router.replace("/login");
          return;
        }

        if (data.tenant.status !== "ACTIVE") {
          router.replace("/login");
          return;
        }

        if (data.tenant.onboardingStatus === "COMPLETED") {
          router.replace("/admin");
          return;
        }

        setForm((current) => ({
          ...current,
          schoolName: data.tenant.name || "",
          schoolType: data.tenant.schoolType || "CBSE",
          contactEmail: data.tenant.contactEmail || data.user.email || "",
          contactPhone: data.tenant.contactPhone || "",
        }));
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setError("Unable to load your workspace.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadWorkspace();

    return () => controller.abort();
  }, [router, subdomain]);

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function updateClass(index: number, value: string) {
    setForm((current) => {
      const classes = [...current.classes];
      classes[index] = { ...classes[index], name: value };
      return { ...current, classes };
    });
  }

  function addClass() {
    setForm((current) => ({
      ...current,
      classes: [...current.classes, { name: "", sections: ["A"] }],
    }));
  }

  function removeClass(index: number) {
    setForm((current) => ({
      ...current,
      classes: current.classes.filter((_, i) => i !== index),
    }));
  }

  function addSection(classIndex: number) {
    setForm((current) => {
      const classes = [...current.classes];
      classes[classIndex] = {
        ...classes[classIndex],
        sections: [...classes[classIndex].sections, ""],
      };
      return { ...current, classes };
    });
  }

  function updateSection(
    classIndex: number,
    sectionIndex: number,
    value: string
  ) {
    setForm((current) => {
      const classes = [...current.classes];
      const sections = [...classes[classIndex].sections];
      sections[sectionIndex] = value;
      classes[classIndex] = { ...classes[classIndex], sections };
      return { ...current, classes };
    });
  }

  function removeSection(classIndex: number, sectionIndex: number) {
    setForm((current) => {
      const classes = [...current.classes];
      classes[classIndex] = {
        ...classes[classIndex],
        sections: classes[classIndex].sections.filter(
          (_, i) => i !== sectionIndex
        ),
      };
      return { ...current, classes };
    });
  }

  function validateStep() {
    setError("");

    if (step === 1 && !form.schoolName.trim()) {
      setError("Please enter your school name.");
      return false;
    }

    if (step === 2) {
      if (!form.academicYear.trim()) {
        setError("Please enter the academic year.");
        return false;
      }

      if (!form.startDate || !form.endDate) {
        setError("Please select the academic year dates.");
        return false;
      }

      if (new Date(form.startDate) >= new Date(form.endDate)) {
        setError("End date must be after the start date.");
        return false;
      }
    }

    if (step === 3) {
      const validClasses = form.classes.filter((item) => item.name.trim());

      if (validClasses.length === 0) {
        setError("Add at least one class.");
        return false;
      }

      if (
        validClasses.some(
          (item) =>
            item.sections.filter((section) => section.trim()).length === 0
        )
      ) {
        setError("Each class needs at least one section.");
        return false;
      }
    }

    return true;
  }

  function next() {
    if (!validateStep()) return;
    setStep((current) => Math.min(4, current + 1));
  }

  function back() {
    setError("");
    setStep((current) => Math.max(1, current - 1));
  }

  async function completeOnboarding() {
    if (!validateStep()) return;

    setSaving(true);
    setError("");

    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          subdomain,
          schoolName: form.schoolName,
          schoolType: form.schoolType,
          contactEmail: form.contactEmail,
          contactPhone: form.contactPhone,
          academicYear: {
            name: form.academicYear,
            startDate: form.startDate,
            endDate: form.endDate,
          },
          classes: form.classes
            .filter((item) => item.name.trim())
            .map((item) => ({
              name: item.name.trim(),
              sections: item.sections
                .map((section) => section.trim())
                .filter(Boolean),
            })),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Unable to complete onboarding.");
      }

      router.replace("/admin?onboarding=complete");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to complete onboarding."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-600">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading your workspace...
        </div>
      </main>
    );
  }

  const steps = [
    { number: 1, label: "School", icon: Building2 },
    { number: 2, label: "Academic Year", icon: GraduationCap },
    { number: 3, label: "Classes", icon: Layers3 },
    { number: 4, label: "Review", icon: Check },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg">
              <School className="h-6 w-6" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900">
                SmartCampus AI
              </p>
              <p className="text-xs text-slate-500">
                Empowering every campus with intelligent innovation.
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 sm:flex">
            <ShieldCheck className="h-4 w-4" />
            Secure Workspace
          </div>
        </header>

        <section className="rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
          <div className="border-b border-slate-100 px-6 py-6 sm:px-10">
            <div className="mb-5">
              <p className="text-sm font-medium text-blue-600">
                Welcome to SmartCampus AI
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Set up your school workspace
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Complete these few steps and your school administration
                workspace will be ready.
              </p>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {steps.map((item) => {
                const Icon = item.icon;
                const active = step === item.number;
                const complete = step > item.number;

                return (
                  <div key={item.number} className="relative">
                    <div
                      className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium ${
                        active
                          ? "bg-blue-50 text-blue-700"
                          : complete
                            ? "text-emerald-700"
                            : "text-slate-400"
                      }`}
                    >
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          active
                            ? "bg-blue-600 text-white"
                            : complete
                              ? "bg-emerald-500 text-white"
                              : "bg-slate-100"
                        }`}
                      >
                        {complete ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Icon className="h-4 w-4" />
                        )}
                      </div>
                      <span className="hidden sm:inline">{item.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="px-6 py-8 sm:px-10 sm:py-10">
            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    Tell us about your school
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    These details will appear throughout your SmartCampus
                    workspace.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="sm:col-span-2">
                    <span className="mb-2 block text-sm font-medium text-slate-700">
                      School name *
                    </span>
                    <input
                      value={form.schoolName}
                      onChange={(e) => update("schoolName", e.target.value)}
                      placeholder="e.g. SmartCampus International School"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </label>

                  <label>
                    <span className="mb-2 block text-sm font-medium text-slate-700">
                      Institution type
                    </span>
                    <select
                      value={form.schoolType}
                      onChange={(e) => update("schoolType", e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    >
                      <option>CBSE</option>
                      <option>ICSE</option>
                      <option>State Board</option>
                      <option>IB</option>
                      <option>Cambridge</option>
                      <option>Other</option>
                    </select>
                  </label>

                  <label>
                    <span className="mb-2 block text-sm font-medium text-slate-700">
                      Contact phone
                    </span>
                    <input
                      value={form.contactPhone}
                      onChange={(e) => update("contactPhone", e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </label>

                  <label className="sm:col-span-2">
                    <span className="mb-2 block text-sm font-medium text-slate-700">
                      Contact email
                    </span>
                    <input
                      type="email"
                      value={form.contactEmail}
                      onChange={(e) => update("contactEmail", e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </label>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    Set your academic year
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    This becomes the foundation for classes, students,
                    attendance and fees.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-3">
                  <label className="sm:col-span-3">
                    <span className="mb-2 block text-sm font-medium text-slate-700">
                      Academic year *
                    </span>
                    <input
                      value={form.academicYear}
                      onChange={(e) => update("academicYear", e.target.value)}
                      placeholder="2026-27"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </label>

                  <label>
                    <span className="mb-2 block text-sm font-medium text-slate-700">
                      Start date *
                    </span>
                    <input
                      type="date"
                      value={form.startDate}
                      onChange={(e) => update("startDate", e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </label>

                  <label>
                    <span className="mb-2 block text-sm font-medium text-slate-700">
                      End date *
                    </span>
                    <input
                      type="date"
                      value={form.endDate}
                      onChange={(e) => update("endDate", e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </label>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">
                      Configure classes & sections
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Add the classes your school operates. You can expand
                      this later.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={addClass}
                    className="shrink-0 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    + Add Class
                  </button>
                </div>

                <div className="space-y-3">
                  {form.classes.map((classItem, classIndex) => (
                    <div
                      key={classIndex}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="flex gap-3">
                        <input
                          value={classItem.name}
                          onChange={(e) =>
                            updateClass(classIndex, e.target.value)
                          }
                          placeholder="Class name"
                          className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                        />

                        <button
                          type="button"
                          onClick={() => removeClass(classIndex)}
                          className="rounded-xl px-3 text-sm text-red-600 hover:bg-red-50"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {classItem.sections.map((section, sectionIndex) => (
                          <div
                            key={sectionIndex}
                            className="flex items-center gap-1"
                          >
                            <input
                              value={section}
                              onChange={(e) =>
                                updateSection(
                                  classIndex,
                                  sectionIndex,
                                  e.target.value
                                )
                              }
                              placeholder="A"
                              className="w-24 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                            />
                            {classItem.sections.length > 1 && (
                              <button
                                type="button"
                                onClick={() =>
                                  removeSection(classIndex, sectionIndex)
                                }
                                className="text-xs text-red-500"
                              >
                                ×
                              </button>
                            )}
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={() => addSection(classIndex)}
                          className="rounded-lg border border-dashed border-slate-300 px-3 py-2 text-sm text-slate-600 hover:border-blue-400 hover:text-blue-600"
                        >
                          + Section
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    Review your setup
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Everything looks good? Finish setup to open your school
                    administration dashboard.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      School
                    </p>
                    <p className="mt-2 font-semibold text-slate-900">
                      {form.schoolName}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {form.schoolType}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Academic Year
                    </p>
                    <p className="mt-2 font-semibold text-slate-900">
                      {form.academicYear}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {form.startDate} → {form.endDate}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-5 sm:col-span-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Classes & Sections
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {form.classes
                        .filter((item) => item.name.trim())
                        .map((item) => (
                          <div
                            key={item.name}
                            className="rounded-xl bg-blue-50 px-3 py-2 text-sm"
                          >
                            <span className="font-semibold text-blue-800">
                              {item.name}
                            </span>
                            <span className="ml-2 text-blue-600">
                              {item.sections
                                .filter(Boolean)
                                .map((section) => section.trim())
                                .join(", ")}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-800">
                  <div className="flex gap-3">
                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" />
                    <div>
                      <p className="font-semibold">
                        Your workspace is already activated.
                      </p>
                      <p className="mt-1">
                        Completing this setup will mark onboarding as complete
                        and take you directly to your SmartCampus AI
                        administration dashboard.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-10 flex items-center justify-between border-t border-slate-100 pt-6">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={back}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
              ) : (
                <div />
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={next}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 hover:bg-blue-700"
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={completeOnboarding}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Setting up...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Complete Setup
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </section>

        <footer className="mt-6 text-center text-xs text-slate-400">
          Powered by ThomasG Technologies © 2026 SmartCampus AI
        </footer>
      </div>
    </main>
  );
}
