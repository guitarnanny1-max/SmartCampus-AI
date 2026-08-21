import { prisma } from "@/lib/prisma";




export default async function TransportPage() {
  const tenants = await prisma.tenant.findMany({ 
    include: { students: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
          <div>
            <span className="text-xs uppercase tracking-widest px-3 py-1 bg-cyan-500/15 text-cyan-400 rounded-full font-semibold border border-cyan-500/20">
              Fleet & Transport Management
            </span>
            <h1 className="text-3xl font-extrabold text-white mt-2">School Bus & Transport Routing</h1>
            <p className="text-slate-400 text-sm mt-1">Monitor bus routes, fleet telemetry, and student transit assignments.</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-xs font-mono text-cyan-400">
            Active Tenants: {tenants.length}
          </div>
        </div>

        {/* Transport / Fleet Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="px-6 py-4 border-b border-slate-800 font-bold text-sm text-slate-200">
            Tenant Transit Roster
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
                <th className="px-6 py-3 font-semibold">Tenant Workspace</th>
                <th className="px-6 py-3 font-semibold">Subdomain</th>
                <th className="px-6 py-3 font-semibold">Plan</th>
                <th className="px-6 py-3 font-semibold">Students Enrolled</th>
                <th className="px-6 py-3 font-semibold">Fleet Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs">
              {tenants.map((t: any) => (
                <tr key={t.id} className="hover:bg-slate-800/40 transition">
                  <td className="px-6 py-4 font-bold text-white">{t.name}</td>
                  <td className="px-6 py-4 font-mono text-indigo-400">{t.subdomain}</td>
                  <td className="px-6 py-4 text-slate-300 capitalize">{t.plan}</td>
                  <td className="px-6 py-4 font-mono text-cyan-400">{t.students?.length || 0}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      ACTIVE / ROUTING
                    </span>
                  </td>
                </tr>
              ))}
              {tenants.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No transport workspaces found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
