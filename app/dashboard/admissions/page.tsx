import { prisma } from "@/lib/prisma";
export const dynamic = 'force-dynamic';




export default async function DashboardAdmissionsPage() {
  let applicants: any[] = [];
  try {
    applicants = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' }
    });
  } catch (err) {
    console.error(err);
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Admissions Pipeline</h1>
          <p className="text-sm text-slate-400">Manage incoming school applications and lead conversions</p>
        </div>
      </div>
      <div className="bg-slate-900 rounded-2xl shadow-sm border border-slate-800 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800 text-xs font-semibold text-slate-400 uppercase border-b border-slate-700">
              <th className="px-6 py-4">School</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4">Temperature</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-sm">
            {applicants.map((lead: any) => (
              <tr key={lead.id} className="hover:bg-slate-800/40 transition">
                <td className="px-6 py-4 font-bold text-white">{lead.school}</td>
                <td className="px-6 py-4 text-slate-300">{lead.name}</td>
                <td className="px-6 py-4 font-mono text-indigo-400">{lead.email}</td>
                <td className="px-6 py-4 text-slate-300">{lead.phone}</td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-amber-900/30 text-amber-400 rounded-lg text-xs font-semibold border border-amber-800/50">
                    {lead.temperature || "🔵 Cold"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-indigo-900/30 text-indigo-400 rounded-lg text-xs font-semibold border border-indigo-800/50">
                    {lead.status || "NEW"}
                  </span>
                </td>
              </tr>
            ))}
            {applicants.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                  No applicants found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
