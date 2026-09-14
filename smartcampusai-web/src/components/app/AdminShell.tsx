"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { supabaseBrowser } from "@/lib/supabase/client";

type AdminShellProps = {
  children: React.ReactNode;
  schoolName?: string;
  schoolLogo?: string;
  adminName?: string;
  adminEmail?: string;
  adminRole?: string;
};

const navigation = [
  {
    title: "Overview",
    items: [{ label: "Dashboard", href: "/app" }],
  },
  {
    title: "School",
    items: [
      { label: "Students", href: "/app/students" },
      { label: "Teachers", href: "/app/teachers" },
      { label: "Parents", href: "/app/parents" },
    ],
  },
  {
    title: "Academics",
    items: [
      { label: "Classes", href: "/app/classes" },
      { label: "Subjects", href: "/app/subjects" },
      { label: "Attendance", href: "/app/attendance" },
      { label: "Exams", href: "/app/exams" },
      { label: "Grading Scales", href: "/app/grading-scales" },
      { label: "Timetable", href: "/app/timetable" },
    ],
  },
  {
    title: "Operations",
    items: [
      { label: "Admissions CRM", href: "/app/crm" },
      { label: "Fees & Finance", href: "/app/fees" },
      { label: "Fee Structures", href: "/app/fees/structures" },
      { label: "Student Fees", href: "/app/fees/student-fees" },
      { label: "Fee Discounts", href: "/app/fees/discounts" },
      { label: "Fee Payments", href: "/app/fees/payments" },
      { label: "Fee Receipts", href: "/app/fees/receipts" },
      { label: "Fee Dues", href: "/app/fees/dues" },
      { label: "Transport", href: "/app/transport" },
      { label: "Library", href: "/app/library" },
    ],
  },
  {
    title: "Intelligence",
    items: [
      { label: "Reports & Analytics", href: "/app/reports/attendance" },
      { label: "AI Command Center", href: "/app/ai" },
    ],
  },
];

export default function AdminShell({
  children,
  schoolName = "School",
  schoolLogo,
  adminName = "Admin",
  adminEmail = "",
  adminRole = "School Administrator",
}: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState<boolean | null>(null);
  const { activeOccasion } = useTheme();
  const [showIdleWarning, setShowIdleWarning] = useState(false);

  useEffect(() => {
    const supabase = supabaseBrowser();

    let warningTimer: number | undefined;
    let logoutTimer: number | undefined;
    let activityTimer: number | undefined;

    const WARNING_AFTER = 28 * 60 * 1000;
    const LOGOUT_AFTER = 30 * 60 * 1000;

    const logout = async () => {
      await supabase.auth.signOut();
      router.push("/login");
    };

    const resetIdleTimer = () => {
      setShowIdleWarning(false);

      if (warningTimer) {
        window.clearTimeout(warningTimer);
      }

      if (logoutTimer) {
        window.clearTimeout(logoutTimer);
      }

      warningTimer = window.setTimeout(() => {
        setShowIdleWarning(true);
      }, WARNING_AFTER);

      logoutTimer = window.setTimeout(() => {
        void logout();
      }, LOGOUT_AFTER);
    };

    const handleActivity = () => {
      if (activityTimer) {
        window.clearTimeout(activityTimer);
      }

      activityTimer = window.setTimeout(resetIdleTimer, 500);
    };

    const events = [
      "mousedown",
      "mousemove",
      "keydown",
      "scroll",
      "touchstart",
      "click",
    ] as const;

    events.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    resetIdleTimer();

    return () => {
      if (warningTimer) {
        window.clearTimeout(warningTimer);
      }

      if (logoutTimer) {
        window.clearTimeout(logoutTimer);
      }

      if (activityTimer) {
        window.clearTimeout(activityTimer);
      }

      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [router]);

  const handleSignOut = async () => {
    const supabase = supabaseBrowser();
    await supabase.auth.signOut();
    router.push("/login");
  };

  const initials =
    adminName
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "A";

  const schoolInitial = schoolName.trim().charAt(0).toUpperCase() || "S";

  return (
    <div className="relative min-h-screen">
      {activeOccasion && (
        <div
          className="fixed inset-x-0 top-0 z-[100] h-1"
          style={{
            background: `linear-gradient(90deg, ${activeOccasion.colors[0]}, ${activeOccasion.colors[1]}, ${activeOccasion.colors[2]})`,
          }}
          aria-label={`${activeOccasion.name} occasion theme`}
        />
      )}
      {showIdleWarning && (
        <div className="fixed inset-x-0 top-4 z-[200] flex justify-center px-4">
          <div
            role="alert"
            className="flex w-full max-w-xl items-center justify-between gap-4 rounded-2xl border border-amber-200 bg-white px-5 py-4 shadow-xl"
          >
            <div>
              <p className="text-sm font-bold text-slate-950">
                You will be signed out soon
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Your session will expire after 30 minutes of inactivity.
                Move the mouse, press a key, or touch the screen to stay signed in.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowIdleWarning(false)}
              className="shrink-0 rounded-lg bg-[var(--sc-primary)] px-3 py-2 text-xs font-bold text-white"
            >
              Stay signed in
            </button>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-[var(--sc-primary-soft)] via-white to-[var(--sc-secondary-soft)] text-[#0F172A]">
      <div className="flex min-h-screen">

        {/* SIDEBAR */}
        <aside
          className={`hidden shrink-0 border-r border-slate-200 bg-white transition-all duration-300 lg:flex lg:flex-col ${
            collapsed === true ? "w-[88px]" : "w-72"
          }`}
        >
          {/* BRAND */}
          <div
            className={`border-b border-slate-200 py-5 ${
              collapsed ? "px-3" : "px-6"
            }`}
          >
            <Link
              href="/app"
              className={`flex items-center ${
                collapsed === true ? "justify-center" : "gap-3"
              }`}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--sc-primary)] via-[var(--sc-secondary)] to-[var(--sc-accent)] text-sm font-bold text-white shadow-lg">
                S
              </div>

              {collapsed !== true && (
                <div className="min-w-0">
                  <div className="truncate text-base font-bold tracking-tight text-slate-950">
                    SmartCampusAI
                  </div>

                  <div className="text-xs text-slate-500">
                    School Management OS
                  </div>
                </div>
              )}
            </Link>
          </div>

          {/* SCHOOL IDENTITY */}
          <div
            className={`border-b border-slate-200 ${
              collapsed ? "px-3 py-5" : "px-5 py-5"
            }`}
          >
            {collapsed !== true && (
              <p className="mb-3 px-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                School
              </p>
            )}

            <div
              className={`rounded-2xl border border-slate-200 bg-slate-50 ${
                collapsed
                  ? "flex justify-center p-2"
                  : "flex items-center gap-3 p-3"
              }`}
            >
              {/* SCHOOL LOGO */}
              <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white text-sm font-bold text-[var(--sc-primary)] shadow-sm ring-2 ring-[var(--sc-primary-soft)]">
                {schoolLogo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={schoolLogo}
                    alt={`${schoolName} logo`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  schoolInitial
                )}
              </div>

              {collapsed !== true && (
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-950">
                    {schoolName}
                  </p>

                  <p className="mt-0.5 text-xs font-medium text-slate-500">
                    School Admin
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* NAVIGATION */}
          <nav className="flex-1 overflow-y-auto px-3 py-5">
            {navigation.map((section, sectionIndex) => (
              <div
                key={`navigation-section-${section.title}-${sectionIndex}`}
                className="mb-6"
              >
                {collapsed !== true && (
                  <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                    {section.title}
                  </p>
                )}

                <div className="space-y-1">
                  {section.items.map((item, itemIndex) => {
                    const active = pathname === item.href;

                    return (
                      <Link
                        key={`navigation-item-${sectionIndex}-${itemIndex}-${item.href}`}
                        href={item.href}
                        title={collapsed ? item.label : undefined}
                        className={`flex items-center rounded-xl text-sm font-medium transition ${
                          collapsed
                            ? "justify-center px-2 py-3"
                            : "px-3 py-2.5"
                        } ${
                          active
                            ? "bg-gradient-to-r from-[var(--sc-primary)] via-[var(--sc-secondary)] to-[var(--sc-accent)] text-white shadow-lg"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                        }`}
                      >
                        {/* Simple navigation indicator */}
                        <span
                          className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                            active ? "bg-white" : "bg-slate-300"
                          }`}
                        />

                        {collapsed !== true && (
                          <span className="ml-3 truncate">{item.label}</span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* ADMIN PROFILE */}
          <div
            className={`border-t border-slate-200 ${
              collapsed === true ? "p-3" : "p-4"
            }`}
          >
            <div
              className={`rounded-xl bg-slate-50 ${
                collapsed === true
                  ? "flex justify-center p-2"
                  : "flex items-center gap-3 p-3"
              }`}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--sc-secondary)] to-[var(--sc-accent)] text-xs font-bold text-white shadow-md">
                {initials}
              </div>

              {collapsed !== true && (
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-950">
                    {adminName}
                  </p>

                  <p className="truncate text-xs font-medium text-slate-600">
                    {adminRole}
                  </p>

                  {adminEmail && (
                    <p className="mt-0.5 truncate text-xs text-slate-400">
                      {adminEmail}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ACCOUNT CONTROLS */}
          <div className="border-t border-slate-200 px-4 py-3">
            <div className="grid gap-2">
              <Link
                href="/app/settings/theme"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
              >
                <span aria-hidden="true">🎨</span>
                <span>Theme & Appearance</span>
              </Link>
              <button
                type="button"
                onClick={() => void handleSignOut()}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
              >
                <span aria-hidden="true">↪</span>
                <span>Sign out</span>
              </button>
            </div>
          </div>
          {/* COLLAPSE BUTTON */}
          <div
            className={`border-t border-slate-200 ${
              collapsed === true ? "p-3" : "px-4 py-3"
            }`}
          >
            <button
              type="button"
              onClick={() => setCollapsed((value) => !value)}
              className={`flex w-full items-center rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 ${
                collapsed
                  ? "justify-center p-2.5"
                  : "justify-center gap-2 px-3 py-2.5"
              }`}
              title={collapsed === true ? "Expand sidebar" : "Collapse sidebar"}
              aria-label={collapsed === true ? "Expand sidebar" : "Collapse sidebar"}
            >
              <span className="text-base">
                {collapsed === true ? "→" : "←"}
              </span>

              {collapsed !== true && <span>Hide sidebar</span>}
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <div className="flex min-w-0 flex-1 flex-col">

          {/* MOBILE HEADER */}
          <header className="border-b border-slate-200 bg-white px-5 py-4 lg:hidden">
            <Link href="/app" className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--sc-primary)] text-sm font-bold text-white">
                S
              </div>

              <div className="min-w-0">
                <div className="text-sm font-bold text-slate-950">
                  SmartCampusAI
                </div>

                <div className="truncate text-xs text-slate-500">
                  {schoolName}
                </div>
              </div>
            </Link>
          </header>

          {/* PAGE CONTENT */}
          <main className="flex-1">{children}</main>

          {/* FOOTER */}
          <footer className="border-t border-slate-200 bg-white px-6 py-5">
            <div className="flex flex-col gap-2 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <span>
                © {new Date().getFullYear()} SmartCampusAI
              </span>

              <span>
                Powered by{" "}
                <span className="font-semibold text-slate-700">
                  ThomasG Technologies
                </span>
              </span>
            </div>
          </footer>
        </div>
      </div>
      </div>
    </div>
  );
}
