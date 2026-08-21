import { prisma } from "@/lib/prisma";
export const dynamic = 'force-dynamic';
export const revalidate = 0;





export default async function LeadsDashboardPage() {
  let leads: any[] = [];
  try {
    leads = await (prisma as any).lead.findMany({
      orderBy: { createdAt: 'desc' }
    });
  } catch (err) {
    console.error("Failed to fetch leads from CRM:", err);
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales CRM & Inbound Leads</h1>
          <p className="text-sm text-gray-500">Automated capture pipeline powered by SmartCampus AI Chatbot</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-semibold border border-red-200">
            🔥 Hot: {leads.filter((l: any) => l.temperature.includes("Hot")).length}
          </span>
          <span className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-semibold border border-orange-200">
            🟠 Warm: {leads.filter((l: any) => l.temperature.includes("Warm")).length}
          </span>
          <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold border border-blue-200">
            🔵 Cold: {leads.filter((l: any) => l.temperature.includes("Cold")).length}
          </span>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider border-b border-gray-200">
                <th className="py-3 px-4 font-semibold">Temperature</th>
                <th className="py-3 px-4 font-semibold">Visitor / School</th>
                <th className="py-3 px-4 font-semibold">Contact Info</th>
                <th className="py-3 px-4 font-semibold">Students</th>
                <th className="py-3 px-4 font-semibold">Interest</th>
                <th className="py-3 px-4 font-semibold">Score</th>
                <th className="py-3 px-4 font-semibold">Captured</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-400">
                    No leads captured yet. Interact with the website AI Chat widget to test the pipeline!
                  </td>
                </tr>
              ) : (
                leads.map((lead: any) => (
                  <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-medium whitespace-nowrap">
                      <span className="inline-block px-2.5 py-1 rounded-md text-xs font-bold bg-gray-100 border border-gray-200">
                        {lead.temperature}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-gray-900">{lead.name}</div>
                      <div className="text-xs text-gray-500">{lead.school} ({lead.location || 'N/A'})</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-gray-900">{lead.email}</div>
                      <div className="text-xs text-gray-500">{lead.phone}</div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {lead.studentStrength ? lead.studentStrength.toLocaleString() : 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-gray-600 max-w-xs truncate">
                      {lead.interest || 'General Inquiry'}
                    </td>
                    <td className="py-3 px-4 font-bold text-indigo-600">
                      {lead.score} / 100
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-500 whitespace-nowrap">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
