#!/bin/bash
set -e

echo "🚀 Building Master Super Admin Navigation & Department Layout..."

mkdir -p src/components
mkdir -p src/app/admin/onboarding
mkdir -p src/app/admin/engineering
mkdir -p src/app/admin/success
mkdir -p src/app/admin/marketing
mkdir -p src/app/admin/ai
mkdir -p src/app/admin/security
mkdir -p src/app/admin/thomasg

# 1. Create Super Admin Sidebar Component
cat << 'EOL' > src/components/SuperAdminSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationGroups = [
  {
    title: "Executive",
    items: [
      { name: "📊 Executive Dashboard", href: "/admin/tenants" },
      { name: "🏫 Tenant Management", href: "/admin/tenants" },
    ],
  },
  {
    title: "Operations & Tech",
    items: [
      { name: "🚀 Onboarding Team", href: "/admin/onboarding" },
      { name: "💻 Engineering & Infra", href: "/admin/engineering" },
      { name: "🧠 AI Platform Telemetry", href: "/admin/ai" },
    ],
  },
  {
    title: "Growth & Success",
    items: [
      { name: "📈 Sales Team (CRM)", href: "/dashboard/leads" },
      { name: "🤝 Customer Success", href: "/admin/success" },
      { name: "📣 Marketing & Leads", href: "/admin/marketing" },
    ],
  },
  {
    title: "Governance & Enterprise",
    items: [
      { name: "🔐 Security & Compliance", href: "/admin/security" },
      { name: "🏢 ThomasG Technologies", href: "/admin/thomasg" },
    ],
  },
];

export default function SuperAdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen sticky top-0 border-r border-slate-800">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800">
        <div className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">Enterprise SaaS</div>
        <h2 className="text-lg font-bold text-white mt-1">Super Admin Hub</h2>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {navigationGroups.map((group, idx) => (
          <div key={idx} className="space-y-1">
            <h3 className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              {group.title}
            </h3>
            <div className="space-y-0.5 mt-2">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "hover:bg-slate-800 text-slate-300 hover:text-white"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer User Info */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/50">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-bold text-sm">
            TG
          </div>
          <div className="overflow-hidden">
            <div className="text-sm font-semibold text-white truncate">ThomasG Tech</div>
            <div className="text-xs text-slate-500 truncate">admin@thomasg.tech</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
EOL

# 2. Create Admin Layout Wrapper
cat << 'EOL' > src/app/admin/layout.tsx
export const dynamic = 'force-dynamic';

import SuperAdminSidebar from "@/components/SuperAdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <SuperAdminSidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
EOL

# 3. Create Placeholder Pages for remaining departments so they render cleanly
for dept in onboarding engineering success marketing ai security thomasg; do
cat << EOL > src/app/admin/$dept/page.tsx
export const dynamic = 'force-dynamic';

export default function DepartmentPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 space-y-4">
        <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-semibold uppercase tracking-wider border border-indigo-200">
          Super Admin Department Command Center
        </span>
        <h1 className="text-3xl font-bold text-gray-900 capitalize">$dept Hub</h1>
        <p className="text-gray-600 text-base">
          Dedicated operational metrics, telemetry, tools, and management consoles for the $dept division of SmartCampus AI.
        </p>
        <div className="pt-4 flex gap-4">
          <a href="/admin/tenants" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium shadow-sm transition-colors">
            Return to Executive Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
EOL
done

echo "✨ Created Master Super Admin layout, sidebar navigation, and department placeholders!"
echo "🎉 Super Admin Hub fully operational!"
