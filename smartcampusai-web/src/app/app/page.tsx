"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Session = {
  authenticated: boolean;
  authUser?: {
    id: string;
    email: string;
    emailConfirmed?: boolean;
  };
  user?: {
    id: string;
    tenantId: string;
    email: string;
    name: string;
    role: string;
  };
  tenant?: {
    id: string;
    subdomain: string;
    name: string;
    plan: string;
    status: string;
    paymentStatus: string;
    onboardingStatus: string;
  };
  error?: string;
};

const modules = [
  {
    title: "Admissions CRM",
    description: "Manage enquiries, leads, applicants and admissions.",
    href: "/app/crm",
    action: "Open CRM →",
  },
  {
    title: "Students",
    description: "Student profiles, enrollment and academic records.",
    href: "/app/students",
    action: "Manage students →",
  },
  {
    title: "Teachers",
    description: "Staff profiles, subjects, attendance and workload.",
    href: "/app/teachers",
    action: "Manage teachers →",
  },
  {
    title: "Attendance",
    description: "Monitor student and staff attendance across campus.",
    href: "/app/attendance",
    action: "Open attendance →",
  },
  {
    title: "Fees & Finance",
    description: "Fees, collections, receipts and financial operations.",
    href: "/app/fees",
    action: "Open finance →",
  },
  {
    title: "Transport",
    description: "Routes, vehicles, drivers and student transport.",
    href: "/app/transport",
    action: "Open transport →",
  },
  {
    title: "Reports & Analytics",
    description: "Institutional reports and operational intelligence.",
    href: "/app/reports",
    action: "View reports →",
  },
  {
    title: "AI Command Center",
    description: "AI-powered insights for your entire institution.",
    href: "/app/ai",
    action: "Open AI →",
  },
];

export default function AppPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadSession() {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include",
          cache: "no-store",
        });

        const data = await response.json();

        if (active) {
          setSession(data);
        }
      } catch (error) {
        console.error("Unable to load session:", error);

        if (active) {
          setSession({
            authenticated: false,
            error: "Unable to load your workspace.",
          });
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadSession();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-[calc(100vh-1px)] items-center justify-center bg-[#F8FAFC]">
        <div className="text-sm text-slate-500">
          Loading your workspace...
        </div>
      </main>
    );
  }

  if (!session?.authenticated || !session.user || !session.tenant) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-6">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-950">
            Workspace unavailable
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            We could not load your SmartCampusAI school workspace.
          </p>

          {session?.error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {session.error}
            </div>
          )}

          <Link
            href="/login"
            className="mt-6 inline-flex rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Return to sign in
          </Link>
        </div>
      </main>
    );
  }

  const { user, tenant } = session;

  return (
    <main className="min-h-full bg-[#F8FAFC] text-slate-950">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {/* HEADER */}
        <section>
          <p className="text-sm font-medium text-slate-500">
            Good to see you, {user.name}
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Campus dashboard
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            Your private SmartCampusAI operating environment for{" "}
            <span className="font-medium text-slate-950">
              {tenant.name}
            </span>
            .
          </p>
        </section>

        {/* STATUS */}
        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
              School
            </div>

            <div className="mt-2 text-xl font-semibold">
              {tenant.name}
            </div>

            <div className="mt-1 text-sm text-slate-500">
              {tenant.subdomain}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Plan
            </div>

            <div className="mt-2 text-xl font-semibold">
              {tenant.plan}
            </div>

            <div className="mt-1 text-sm text-green-600">
              Payment verified
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Account
            </div>

            <div className="mt-2 text-xl font-semibold">
              {tenant.status}
            </div>

            <div className="mt-1 text-sm text-slate-500">
              Onboarding {tenant.onboardingStatus.toLowerCase()}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Administrator
            </div>

            <div className="mt-2 truncate text-xl font-semibold">
              {user.name}
            </div>

            <div className="mt-1 truncate text-sm text-slate-500">
              {user.email}
            </div>
          </div>
        </section>

        {/* MODULES */}
        <section className="mt-10">
          <div>
            <h2 className="text-xl font-semibold">
              School operations
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Manage your complete campus from one workspace.
            </p>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {modules.map((module) => (
              <Link
                key={module.href}
                href={module.href}
                className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-sm font-bold text-slate-700">
                    {module.title.charAt(0)}
                  </div>

                  <span className="text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-slate-950">
                    →
                  </span>
                </div>

                <h3 className="mt-5 text-sm font-semibold text-slate-950">
                  {module.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {module.description}
                </p>

                <div className="mt-5 text-sm font-medium text-slate-950">
                  {module.action}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* WORKSPACE IDENTITY */}
        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-sm font-semibold">
            Workspace identity
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Your school workspace is securely isolated by tenant.
          </p>

          <div className="mt-5 grid gap-5 text-sm sm:grid-cols-3">
            <div>
              <div className="text-xs text-slate-400">
                Role
              </div>

              <div className="mt-1 font-semibold">
                {user.role}
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-400">
                Tenant ID
              </div>

              <div className="mt-1 break-all font-mono text-xs">
                {tenant.id}
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-400">
                Administrator
              </div>

              <div className="mt-1 truncate">
                {user.email}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
