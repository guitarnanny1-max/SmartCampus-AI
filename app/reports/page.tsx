import { prisma } from "@/lib/prisma";




export default async function ReportsPage() {
  const tenantCount = await prisma.tenant.count();
  const studentCount = await prisma.student.count();
  const staffCount = await prisma.staff.count();
  const invoiceCount = await prisma.invoice.count();

  const tenants = await prisma.tenant.findMany({
    include: { students: true, invoices: true, staff: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
          <div>
            <span className="text-xs uppercase tracking-widest px-3 py-1 bg-indigo-500/15 text-indigo-400 rounded-full font-semibold border border-indigo-500/20">
              Global Analytics & Reports
            </span>
            <h1 className="text-3xl font-extrabold text-white mt-2">Executive Reports & Telemetry</h1>
            <p className="text-slate-400 text-sm mt-1">System-wide performance indicators, enrollment aggregates, and financial metrics.</p>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
            <div className="text-slate-400 text-xs font-mono uppercase tracking-wider">Total Tenants</div>
            <div className="text-3xl font-extrabold text-white mt-2">{tenantCount}</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
            <div className="text-slate-400 text-xs font-mono uppercase tracking-wider">Total Students</div>
            <div className="text-3xl font-extrabold text-purple-400 mt-2">{studentCount}</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
            <div className="text-slate-400 text-xs font-mono uppercase tracking-wider">Total Staff</div>
            <div className="text-3xl font-extrabold text-emerald-400 mt-2">{staffCount}</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
            <div className="text-slate-400 text-xs font-mono uppercase tracking-wider">Total Invoices</div>
            <div className="text-3xl font-extrabold text-blue-400 mt-2">{invoiceCount}</div>
          </div>
        </div>

        {/* Tenant Overview Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="px-6 py-4 border-b border-slate-800 font-bold text-sm text-slate-200">
            Workspace Summary Report
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
                <th className="px-6 py-3 font-semibold">Workspace Name</th>
                <th className="px-6 py-3 font-semibold">Subdomain</th>
                <th className="px-6 py-3 font-semibold">Students</th>
                <th className="px-6 py-3 font-semibold">Staff</th>
                <th className="px-6 py-3 font-semibold">Invoices</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs">
              {tenants.map((t: any) => (
                <tr key={t.id} className="hover:bg-slate-800/40 transition">
                  <td className="px-6 py-4 font-bold text-white">{t.name}</td>
                  <td className="px-6 py-4 font-mono text-indigo-400">{t.subdomain}</td>
                  <td className="px-6 py-4 font-mono text-slate-300">{t.students?.length || 0}</td>
                  <td className="px-6 py-4 font-mono text-slate-300">{t.staff?.length || 0}</td>
                  <td className="px-6 py-4 font-mono text-slate-300">{t.invoices?.length || 0}</td>
                </tr>
              ))}
              {tenants.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No telemetry data available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
