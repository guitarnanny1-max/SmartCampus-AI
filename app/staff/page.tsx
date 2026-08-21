import { prisma } from "@/lib/prisma";




export default async function StaffPage() {
  const staffMembers = await prisma.staff.findMany({
    include: { tenant: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
          <div>
            <span className="text-xs uppercase tracking-widest px-3 py-1 bg-emerald-500/15 text-emerald-400 rounded-full font-semibold border border-emerald-500/20">
              Staff & Faculty Management
            </span>
            <h1 className="text-3xl font-extrabold text-white mt-2">Faculty & Staff Directory</h1>
            <p className="text-slate-400 text-sm mt-1">Manage school personnel, roles, and administrative permissions.</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-xs font-mono text-emerald-400">
            Total Staff: {staffMembers.length}
          </div>
        </div>

        {/* Staff Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="px-6 py-4 border-b border-slate-800 font-bold text-sm text-slate-200">
            Personnel Directory
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
                <th className="px-6 py-3 font-semibold">Tenant Workspace</th>
                <th className="px-6 py-3 font-semibold">Name</th>
                <th className="px-6 py-3 font-semibold">Role</th>
                <th className="px-6 py-3 font-semibold">Email</th>
                <th className="px-6 py-3 font-semibold">Joined At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs">
              {staffMembers.map((staff: any) => (
                <tr key={staff.id} className="hover:bg-slate-800/40 transition">
                  <td className="px-6 py-4 font-bold text-white">{staff.tenant?.name || "Global Tenant"}</td>
                  <td className="px-6 py-4 font-bold text-indigo-400">{staff.name}</td>
                  <td className="px-6 py-4 text-slate-300 font-mono">{staff.role}</td>
                  <td className="px-6 py-4 text-slate-300 font-mono">{staff.email || "N/A"}</td>
                  <td className="px-6 py-4 text-slate-400">{new Date(staff.createdAt).toLocaleString()}</td>
                </tr>
              ))}
              {staffMembers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No staff members registered yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
