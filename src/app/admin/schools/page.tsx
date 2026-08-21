import { prisma } from "@/lib/prisma";
export const revalidate = 0;
export const dynamic = 'force-dynamic';




export default async function SuperAdminDashboard() {
  const tenants = await prisma.tenant.findMany({
    include: { 
      students: true, 
      staff: true, 
      invoices: true, 
      auditLogs: true, 
      announcements: true, 
      alerts: true, 
      energyLogs: true, 
      exams: true, 
      libraryAssets: true,
      backupSnapshots: true
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
          <div>
            <span className="text-xs uppercase tracking-widest px-3 py-1 bg-indigo-500/15 text-indigo-400 rounded-full font-semibold border border-indigo-500/20">
              Tenant Administration & Directory
            </span>
            <h1 className="text-3xl font-extrabold text-white mt-2">School Workspaces</h1>
            <p className="text-slate-400 text-sm mt-1">Manage institutional subscriptions, student rosters, and workspace telemetry.</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-xs font-mono text-indigo-400">
            Total Workspaces: {tenants.length}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="px-6 py-4 border-b border-slate-800 font-bold text-sm text-slate-200">
            Registered School Tenants
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
                <th className="px-6 py-3 font-semibold">School Name</th>
                <th className="px-6 py-3 font-semibold">Subdomain</th>
                <th className="px-6 py-3 font-semibold">Plan</th>
                <th className="px-6 py-3 font-semibold">Students</th>
                <th className="px-6 py-3 font-semibold">Staff</th>
                <th className="px-6 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs">
              {tenants.map((t: any) => (
                <tr key={t.id} className="hover:bg-slate-800/40 transition">
                  <td className="px-6 py-4 font-bold text-white">{t.name}</td>
                  <td className="px-6 py-4 font-mono text-indigo-400">{t.subdomain}</td>
                  <td className="px-6 py-4 text-slate-300 capitalize">{t.plan}</td>
                  <td className="px-6 py-4 font-mono text-purple-400">{t.students?.length || 0}</td>
                  <td className="px-6 py-4 font-mono text-emerald-400">{t.staff?.length || 0}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
              {tenants.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">No school tenants found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
