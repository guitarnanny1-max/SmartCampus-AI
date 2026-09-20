export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";

export default async function AdminLeadsPage() {
  let leads: any[] = [];
  try {
    leads = await prisma.tenant.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    console.error("Failed to fetch leads:", err);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-1">thomasG technologies • Command Center</div>
            <h1 className="text-3xl font-black tracking-tight">Onboarding Pipeline & School Leads</h1>
          </div>
          <div className="flex items-center space-x-3">
            <span className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs font-mono">
              Total Leads: {leads.length}
            </span>
            <a href="/" className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold transition">
              ← Back to Landing Page
            </a>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950 text-slate-400 text-xs uppercase font-mono border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Institution</th>
                  <th className="px-6 py-4">Contact Person</th>
                  <th className="px-6 py-4">Board / Volume</th>
                  <th className="px-6 py-4">Subdomain</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Submitted At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      No onboarding leads found yet. Test your landing page form at <span className="text-blue-400 font-mono">http://localhost:3000/#demo</span>!
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-850/50 transition">
                      <td className="px-6 py-4 font-semibold text-white">
                        {lead.name}
                        <div className="text-xs text-slate-500 font-normal">{lead.contactEmail}</div>
                      </td>
                      <td className="px-6 py-4">
                        {lead.contactName}
                        <div className="text-xs text-slate-500 font-mono">{lead.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-medium text-slate-300">{lead.board}</span>
                        <div className="text-[11px] text-slate-500">{lead.studentVolume}</div>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-blue-400">
                        {lead.subdomain}.smartcampusai.in
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          lead.status === "ACTIVE" || lead.status === "LIVE" 
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-400 font-mono">
                        {new Date(lead.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}