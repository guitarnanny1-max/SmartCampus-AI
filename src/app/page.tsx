import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const studentCount = await prisma.student.count().catch(() => 0);
  const staffCount = await prisma.staff.count().catch(() => 0);
  const leadCount = await prisma.lead.count().catch(() => 0);
  const libraryCount = await prisma.libraryAsset.count().catch(() => 0);
  const energyLogs = await prisma.energyLog.findMany({ take: 5, orderBy: { createdAt: "desc" } }).catch(() => []);
  const recentStudents = await prisma.student.findMany({ take: 5, orderBy: { createdAt: "desc" } }).catch(() => []);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 lg:p-10">
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Smart Campus AI Command Center
          </h1>
          <p className="text-gray-400 mt-1">Unified administration, biometric security, telemetry, and AI assistant overview.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/login" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium border border-gray-700 transition">Sign In</Link>
          <Link href="/signup" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm font-medium transition">Register</Link>
        </div>
      </header>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl">
          <div className="text-gray-400 text-sm font-medium">Total Students</div>
          <div className="text-3xl font-bold mt-2 text-indigo-400">{studentCount}</div>
          <Link href="/students" className="text-xs text-indigo-400 hover:underline mt-3 inline-block">Manage students &rarr;</Link>
        </div>
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl">
          <div className="text-gray-400 text-sm font-medium">Active Staff</div>
          <div className="text-3xl font-bold mt-2 text-purple-400">{staffCount}</div>
          <Link href="/staff" className="text-xs text-purple-400 hover:underline mt-3 inline-block">Manage staff &rarr;</Link>
        </div>
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl">
          <div className="text-gray-400 text-sm font-medium">Admissions Leads</div>
          <div className="text-3xl font-bold mt-2 text-emerald-400">{leadCount}</div>
          <Link href="/admissions" className="text-xs text-emerald-400 hover:underline mt-3 inline-block">View pipeline &rarr;</Link>
        </div>
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl">
          <div className="text-gray-400 text-sm font-medium">Library Catalog</div>
          <div className="text-3xl font-bold mt-2 text-amber-400">{libraryCount}</div>
          <Link href="/library" className="text-xs text-amber-400 hover:underline mt-3 inline-block">Explore catalog &rarr;</Link>
        </div>
      </div>

      {/* Quick Navigation / Features Grid */}
      <div className="mb-10">
        <h2 className="text-xl font-bold mb-4">Campus Modules & Features</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {[
            { name: "Students", href: "/students", icon: "🎓", color: "hover:border-indigo-500" },
            { name: "Staff", href: "/staff", icon: "👥", color: "hover:border-purple-500" },
            { name: "Admissions", href: "/admissions", icon: "📈", color: "hover:border-emerald-500" },
            { name: "Exams", href: "/exams", icon: "📝", color: "hover:border-blue-500" },
            { name: "Library", href: "/library", icon: "📚", color: "hover:border-amber-500" },
            { name: "Energy", href: "/energy", icon: "⚡", color: "hover:border-yellow-500" },
            { name: "Transport", href: "/transport", icon: "🚌", color: "hover:border-cyan-500" },
            { name: "Finance", href: "/finance", icon: "💳", color: "hover:border-green-500" },
            { name: "Reports", href: "/reports", icon: "📊", color: "hover:border-pink-500" },
            { name: "Settings", href: "/settings", icon: "⚙️", color: "hover:border-gray-500" },
            { name: "Pricing", href: "/pricing", icon: "💎", color: "hover:border-purple-400" },
            { name: "AI Assistant", href: "#", icon: "🤖", color: "hover:border-indigo-400" }
          ].map((mod, idx) => (
            <Link key={idx} href={mod.href} className={`bg-gray-900 border border-gray-800 ${mod.color} p-4 rounded-xl text-center transition group flex flex-col items-center justify-center`}>
              <span className="text-2xl mb-2">{mod.icon}</span>
              <span className="font-semibold text-sm group-hover:text-white">{mod.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Registrations & Energy Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl">
          <h3 className="text-lg font-bold mb-4 flex items-center justify-between">
            <span>Recent Student Registrations</span>
            <Link href="/students" className="text-xs text-indigo-400 hover:underline">View all</Link>
          </h3>
          <div className="space-y-3">
            {recentStudents.length > 0 ? (
              recentStudents.map((s: any) => (
                <div key={s.id} className="flex justify-between items-center p-3 bg-gray-800/50 rounded-xl border border-gray-800">
                  <div>
                    <div className="font-semibold text-sm">{s.name}</div>
                    <div className="text-xs text-gray-400">{s.email || "No email"} • {s.grade}</div>
                  </div>
                  <span className="text-xs px-2.5 py-1 bg-indigo-900/50 text-indigo-300 rounded-full border border-indigo-800">{s.status || "Active"}</span>
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-sm py-4 text-center">No student records found.</div>
            )}
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl">
          <h3 className="text-lg font-bold mb-4 flex items-center justify-between">
            <span>Energy & Telemetry Logs</span>
            <Link href="/energy" className="text-xs text-yellow-400 hover:underline">View logs</Link>
          </h3>
          <div className="space-y-3">
            {energyLogs.length > 0 ? (
              energyLogs.map((l: any) => (
                <div key={l.id} className="flex justify-between items-center p-3 bg-gray-800/50 rounded-xl border border-gray-800">
                  <div>
                    <div className="font-semibold text-sm">{l.source || "Campus Grid"}</div>
                    <div className="text-xs text-gray-400">Consumption: {l.consumption} kWh</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-emerald-400">${(l.cost || 0).toFixed(2)}</div>
                    <div className="text-[10px] text-gray-500">{new Date(l.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-sm py-4 text-center">No energy logs recorded yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
