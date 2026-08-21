#!/bin/bash
set -e

echo "🚀 Building ThomasG Technologies & SmartCampus AI Master Command Center..."

mkdir -p src/components
mkdir -p src/app/admin/research
mkdir -p src/app/admin/evidence
mkdir -p src/app/admin/sales
mkdir -p src/app/admin/settings

# 1. Update Super Admin Sidebar with the 11 Core Sections
cat << 'EOL' > src/components/SuperAdminSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationGroups = [
  {
    title: "Executive & SaaS",
    items: [
      { name: "📊 Executive Dashboard", href: "/admin/tenants" },
      { name: "🏫 Tenant Management", href: "/admin/tenants" },
    ],
  },
  {
    title: "Operations & Teams",
    items: [
      { name: "📈 Sales Pipeline", href: "/dashboard/leads/kanban" },
      { name: "🚀 Onboarding Team", href: "/admin/onboarding" },
      { name: "🤝 Customer Success", href: "/admin/success" },
    ],
  },
  {
    title: "Engineering & Infrastructure",
    items: [
      { name: "💻 Engineering & Infra", href: "/admin/engineering" },
      { name: "🧠 AI Platform Telemetry", href: "/admin/ai" },
      { name: "🔐 Security & Compliance", href: "/admin/security" },
    ],
  },
  {
    title: "ThomasG R&D & Enterprise",
    items: [
      { name: "🎓 Research & Innovation", href: "/admin/research" },
      { name: "🏆 Awards & Evidence Vault", href: "/admin/evidence" },
      { name: "⚙️ System Settings", href: "/admin/settings" },
    ],
  },
];

export default function SuperAdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen sticky top-0 border-r border-slate-800">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800">
        <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">ThomasG Technologies</div>
        <h2 className="text-base font-bold text-white mt-1">Super Admin Hub</h2>
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
            <div className="text-sm font-semibold text-white truncate">Thomas G.</div>
            <div className="text-xs text-slate-500 truncate">Lincoln University PhD Track</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
EOL

# 2. Create Research & Innovation Command Center (PhD Track)
cat << 'EOL' > src/app/admin/research/page.tsx
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function ResearchInnovationPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-semibold uppercase tracking-wider border border-purple-200">
            Lincoln University Malaysia • PhD Track
          </span>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">Research & Innovation Hub</h1>
          <p className="text-sm text-gray-500">Autonomous research management, literature reviews, methodology tracking, and publications</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold border border-green-200">
            🟢 Status: Active Candidature
          </span>
        </div>
      </div>

      {/* Research Profile Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500 font-semibold uppercase">Registered Research Topic</span>
            <div className="text-sm font-bold text-slate-900 mt-1">
              AI-Driven Multi-Tenant Architecture & Automated Acquisition in Educational ERP Systems
            </div>
            <span className="text-xs text-indigo-600 mt-2 block font-medium">Supervisor: Appointed Committee</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500 font-semibold uppercase">Candidature Milestone</span>
            <div className="text-sm font-bold text-slate-900 mt-1">Chapter 4: Empirical Evaluation & Results</div>
            <span className="text-xs text-green-600 mt-2 block font-medium">78% Thesis Completion</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500 font-semibold uppercase">Official Certification Note</span>
            <div className="text-xs text-slate-600 mt-1 leading-relaxed">
              *Note: Official degree certificates are issued exclusively by Lincoln University Malaysia upon board approval.
            </div>
          </div>
        </div>
      </div>

      {/* Research Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-3">
          <h3 className="font-bold text-gray-900 text-base">📚 Literature & Proposal</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span>Research Proposal</span>
              <span className="text-xs font-bold text-green-600">Approved</span>
            </li>
            <li className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span>Literature Review</span>
              <span className="text-xs font-bold text-green-600">142 Sources</span>
            </li>
            <li className="flex justify-between items-center">
              <span>Methodology Framework</span>
              <span className="text-xs font-bold text-indigo-600">Active</span>
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-3">
          <h3 className="font-bold text-gray-900 text-base">🔬 Experiments & Data</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span>Multi-Tenant Benchmarks</span>
              <span className="text-xs font-bold text-purple-600">1.8M Requests</span>
            </li>
            <li className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span>Ethics & Approvals</span>
              <span className="text-xs font-bold text-green-600">Cleared</span>
            </li>
            <li className="flex justify-between items-center">
              <span>Supervisor Feedback</span>
              <span className="text-xs font-bold text-blue-600">3 Reviews Pending</span>
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-3">
          <h3 className="font-bold text-gray-900 text-base">📄 Publications & IP</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span>Indexed Journals</span>
              <span className="text-xs font-bold text-indigo-600">3 Published</span>
            </li>
            <li className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span>Conference Papers</span>
              <span className="text-xs font-bold text-indigo-600">2 Accepted</span>
            </li>
            <li className="flex justify-between items-center">
              <span>Intellectual Property</span>
              <span className="text-xs font-bold text-green-600">2 Filed</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
EOL

# 3. Create Awards & Evidence Vault Command Center
cat << 'EOL' > src/app/admin/evidence/page.tsx
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function EvidenceVaultPage() {
  const evidenceCategories = [
    { title: "📸 Product Screenshots", count: "48 Artifacts", desc: "High-resolution UI captures of ERP modules, AI Chat, and CRM." },
    { title: "🏛️ Architecture Blueprints", count: "12 Diagrams", desc: "Multi-tenant isolation, database schemas, and AI pipeline flow." },
    { title: "🚀 Release History", count: "v3.4.0 Live", desc: "Changelogs, deployment velocity, and uptime records." },
    { title: "💬 Customer Testimonials", count: "34 Schools", desc: "Principal and administrator reviews across 18 states." },
    { title: "📊 Usage & Impact Metrics", count: "1.8M AI Calls", desc: "Quantifiable administrative time saved and conversion lift." },
    { title: "📑 Case Studies", count: "6 Published", desc: "Deep-dive ROI reports on institutional digital transformation." },
    { title: "🔬 Research Papers", count: "3 Papers", desc: "Peer-reviewed publications supporting platform innovations." },
    { title: "🏆 Awards & Recognition", count: "5 Nominations", desc: "EdTech innovation and entrepreneurship accolades." },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-semibold uppercase tracking-wider border border-amber-200">
            Global Recognition & Compliance
          </span>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">Awards & Evidence Vault</h1>
          <p className="text-sm text-gray-500">Auditable repository of product milestones, research, customer metrics, and IP for award submissions</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-semibold border border-indigo-200">
            🔒 Secure Vault Storage
          </span>
        </div>
      </div>

      {/* Evidence Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {evidenceCategories.map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-3 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-sm">{item.title}</h3>
              <span className="text-[11px] font-bold px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md border border-gray-200">
                {item.count}
              </span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
            <div className="pt-2 border-t border-gray-100 flex justify-end">
              <span className="text-xs font-semibold text-indigo-600 hover:underline cursor-pointer">
                View Repository &rarr;
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
EOL

echo "✨ Created Research & Innovation and Awards Evidence Vault modules successfully!"
echo "🎉 ThomasG Technologies Master Command Center fully operational!"
