"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

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
      { label: "Reports & Analytics", href: "/app/reports" },
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
  const [collapsed, setCollapsed] = useState(false);

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
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <div className="flex min-h-screen">

        {/* SIDEBAR */}
        <aside
          className={`hidden shrink-0 border-r border-slate-200 bg-white transition-all duration-300 lg:flex lg:flex-col ${
            collapsed ? "w-[88px]" : "w-72"
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
                collapsed ? "justify-center" : "gap-3"
              }`}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black text-sm font-bold text-white">
                S
              </div>

              {!collapsed && (
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
            {!collapsed && (
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
              <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white text-sm font-bold text-slate-700 shadow-sm ring-1 ring-slate-200">
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

              {!collapsed && (
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
                {!collapsed && (
                  <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                    {section.title}
                  </p>
                )}

                <div className="space-y-1">
                  {section.items.map((item, itemIndex) => {
                    const active =
                      item.href === "/app"
                        ? pathname === "/app"
                        : pathname === item.href ||
                          pathname.startsWith(`${item.href}/`);

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
                            ? "bg-black text-white shadow-sm"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                        }`}
                      >
                        {/* Simple navigation indicator */}
                        <span
                          className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                            active ? "bg-white" : "bg-slate-300"
                          }`}
                        />

                        {!collapsed && (
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
              collapsed ? "p-3" : "p-4"
            }`}
          >
            <div
              className={`rounded-xl bg-slate-50 ${
                collapsed
                  ? "flex justify-center p-2"
                  : "flex items-center gap-3 p-3"
              }`}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black text-xs font-bold text-white">
                {initials}
              </div>

              {!collapsed && (
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

          {/* COLLAPSE BUTTON */}
          <div
            className={`border-t border-slate-200 ${
              collapsed ? "p-3" : "px-4 py-3"
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
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <span className="text-base">
                {collapsed ? "→" : "←"}
              </span>

              {!collapsed && <span>Hide sidebar</span>}
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <div className="flex min-w-0 flex-1 flex-col">

          {/* MOBILE HEADER */}
          <header className="border-b border-slate-200 bg-white px-5 py-4 lg:hidden">
            <Link href="/app" className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black text-sm font-bold text-white">
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
  );
}
