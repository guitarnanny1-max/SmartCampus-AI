import { prisma } from "@/lib/prisma";




export default async function SuperAdminDashboard() {
  const tenants = await prisma.tenant.findMany({
    include: { 
      students: true, 
      invoices: true, 
      announcements: true, 
      alerts: true, 
      energyLogs: true, 
      exams: true, 
      libraryAssets: true 
    },
    orderBy: { createdAt: "desc" }
  });

  const totalMRR = tenants.reduce((acc: any, t: any) => acc + (t.mrr || 0), 0);
  const totalStudents = tenants.reduce((acc: any, t: any) => acc + t.students.length, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
          <div>
            <span className="text-xs uppercase tracking-widest px-3 py-1 bg-indigo-500/15 text-indigo-400 rounded-full font-semibold border border-indigo-500/20">
              Global Control Tower
            </span>
            <h1 className="text-3xl font-extrabold text-white mt-2">SuperAdmin Multi-Tenant Workspace</h1>
            <p className="text-slate-400 text-sm mt-1">Manage school SaaS tenants, billing telemetry, and system-wide provisioning.</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-xs">
              <div className="text-slate-400">Total MRR</div>
              <div className="text-emerald-400 font-mono font-bold text-sm">${totalMRR.toLocaleString()}</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-xs">
              <div className="text-slate-400">Total Tenants</div>
              <div className="text-indigo-400 font-mono font-bold text-sm">{tenants.length}</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-xs">
              <div className="text-slate-400">Enrolled Students</div>
              <div className="text-purple-400 font-mono font-bold text-sm">{totalStudents.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Tenants Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="px-6 py-4 border-b border-slate-800 font-bold text-sm text-slate-200 flex justify-between items-center">
            <span>Active School Tenants</span>
            <span className="text-xs font-mono text-slate-400">{tenants.length} Connected Workspaces</span>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
                <th className="px-6 py-3 font-semibold">School / Institution</th>
                <th className="px-6 py-3 font-semibold">Subdomain</th>
                <th className="px-6 py-3 font-semibold">Plan</th>
                <th className="px-6 py-3 font-semibold">MRR</th>
                <th className="px-6 py-3 font-semibold">Students</th>
                <th className="px-6 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs">
              {tenants.map((tenant: any) => (
                <tr key={tenant.id} className="hover:bg-slate-800/40 transition">
                  <td className="px-6 py-4 font-bold text-white">{tenant.name}</td>
                  <td className="px-6 py-4 font-mono text-indigo-400">{tenant.subdomain}</td>
                  <td className="px-6 py-4 text-slate-300 capitalize">{tenant.plan}</td>
                  <td className="px-6 py-4 font-mono text-emerald-400">${tenant.mrr.toLocaleString()}</td>
                  <td className="px-6 py-4 font-mono text-slate-300">{tenant.students.length}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {tenant.status}
                    </span>
                  </td>
                </tr>
              ))}
              {tenants.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">No school tenants registered yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
