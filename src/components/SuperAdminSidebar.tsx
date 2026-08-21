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
              {group.items.map((item: any) => {
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
