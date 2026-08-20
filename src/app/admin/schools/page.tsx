import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function SuperAdminDashboard() {
  const schools = await prisma.school.findMany({
    include: {
      facilities: true,
      students: true,
      apiKeys: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const totalStudents = schools.reduce((acc, s) => acc + s.students.length, 0);
  const totalFacilities = schools.reduce((acc, s) => acc + s.facilities.length, 0);
  const enterpriseCount = schools.filter(s => s.tier === 'ENTERPRISE').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                PLATFORM ROOT ADMIN
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">SmartCampus Global Control Center</h1>
            <p className="text-xs text-slate-400">Manage multi-tenant orchestration, subscriptions, and system health metrics.</p>
          </div>
          <Link 
            href="/?school=dps" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to Tenant Dashboard
          </Link>
        </div>

        {/* Global Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-1">
            <span className="text-xs font-medium text-slate-400">Total Tenants</span>
            <div className="text-2xl font-extrabold text-white font-mono">{schools.length}</div>
          </div>
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-1">
            <span className="text-xs font-medium text-slate-400">Enterprise Plans</span>
            <div className="text-2xl font-extrabold text-cyan-400 font-mono">{enterpriseCount}</div>
          </div>
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-1">
            <span className="text-xs font-medium text-slate-400">Active Students</span>
            <div className="text-2xl font-extrabold text-emerald-400 font-mono">{totalStudents}</div>
          </div>
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-1">
            <span className="text-xs font-medium text-slate-400">IoT Zones Monitored</span>
            <div className="text-2xl font-extrabold text-amber-400 font-mono">{totalFacilities}</div>
          </div>
        </div>

        {/* Tenants Table */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🏢</span> Registered Institutional Tenants
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Institution Name</th>
                  <th className="p-4 font-medium">Subdomain</th>
                  <th className="p-4 font-medium">Subscription Tier</th>
                  <th className="p-4 font-medium">Students</th>
                  <th className="p-4 font-medium">Facilities</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {schools.map((school) => (
                  <tr key={school.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4 font-medium text-white flex items-center gap-3">
                      {school.logoUrl ? (
                        <img src={school.logoUrl} alt="" className="w-7 h-7 rounded-lg object-cover border border-slate-700" />
                      ) : (
                        <div className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">
                          {school.name.charAt(0)}
                        </div>
                      )}
                      {school.name}
                    </td>
                    <td className="p-4 font-mono text-cyan-400">{school.subdomain}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        school.tier === 'ENTERPRISE' 
                          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' 
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {school.tier}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-slate-300">{school.students.length} / {school.maxStudents}</td>
                    <td className="p-4 font-mono text-slate-300">{school.facilities.length}</td>
                    <td className="p-4 text-right">
                      <Link 
                        href={`/?school=${school.subdomain}`} 
                        className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-semibold transition-all"
                      >
                        Launch Portal →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
