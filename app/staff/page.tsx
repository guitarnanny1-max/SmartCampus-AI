import { prisma } from "@/lib/prisma";

export default async function StaffPage() {
  const staffMembers = await prisma.staff.findMany({
    include: { school: true },
    orderBy: { createdAt: "desc" }
  });

  const activeCount = staffMembers.filter(s => s.status === "Active").length;
  const departments = [...new Set(staffMembers.map(s => s.department))];

  return (
    <div className="p-8 bg-slate-950 min-h-screen text-slate-100 font-sans">
      <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full font-semibold border border-purple-500/20">
            Human Resources
          </span>
          <h1 className="text-3xl font-extrabold mt-2 tracking-tight">Staff & HR Management</h1>
          <p className="text-slate-400 text-sm mt-1">Manage faculty directories, departmental roles, staff status, and institutional personnel.</p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Staff Members</p>
          <p className="text-3xl font-black mt-2 text-slate-100">{staffMembers.length}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Active Personnel</p>
          <p className="text-3xl font-black mt-2 text-emerald-400">{activeCount}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Active Departments</p>
          <p className="text-3xl font-black mt-2 text-purple-400">{departments.length}</p>
        </div>
      </div>

      {/* Staff Directory Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-bold mb-4">👔 Faculty & Staff Directory</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                <th className="py-3 px-4">Staff ID</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Institution</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {staffMembers.map((staff) => (
                <tr key={staff.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4 font-mono text-xs text-purple-400">{staff.staffId}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-200">{staff.name}</td>
                  <td className="py-3.5 px-4 text-slate-300">
                    <span className="px-2 py-1 rounded bg-slate-800 text-xs text-slate-300 border border-slate-700">
                      {staff.department}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 font-medium">{staff.role}</td>
                  <td className="py-3.5 px-4 text-blue-400">{staff.email}</td>
                  <td className="py-3.5 px-4 text-slate-400">{staff.school?.name}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                      {staff.status}
                    </span>
                  </td>
                </tr>
              ))}
              {staffMembers.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-500">
                    No staff records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
