'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "📊 Main Dashboard" },
  { href: "/admissions", label: "📋 Admissions CRM" },
  { href: "/students", label: "👨‍🎓 Student Management" },
  { href: "/staff", label: "👔 Staff & HR" },
  { href: "/exams", label: "📝 Examinations" },
  { href: "/library", label: "📚 Library & Assets" },
  { href: "/energy", label: "⚡ Energy & Power" },
  { href: "/transport", label: "🚌 Transport & Fleet" },
  { href: "/finance", label: "💳 Fee & Finance" },
  { href: "/reports", label: "📈 Reports & Exports" },
  { href: "/settings", label: "⚙️ Settings & API" },
  { href: "/pricing", label: "🏷️ Pricing & Tiers" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between hidden md:flex p-6 shrink-0">
      <div>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-blue-600/30">
            🎓
          </div>
          <div>
            <h2 className="font-extrabold text-sm tracking-tight text-white">SmartCampusAI</h2>
            <p className="text-[10px] text-slate-400">Enterprise Campus ERP</p>
          </div>
        </div>

        <nav className="space-y-1">
          {navItems.map((item: any) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-600/10 text-blue-400 font-semibold border border-blue-600/20 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-6 border-t border-slate-800">
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
          <p className="font-semibold text-slate-300">Campus Admin</p>
          <p className="text-emerald-400 text-[10px] mt-0.5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            PostgreSQL DB Connected
          </p>
        </div>
      </div>
    </aside>
  );
}
