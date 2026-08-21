import { prisma } from "@/lib/prisma";




export default async function FinancePage() {
  const invoices = await prisma.invoice.findMany({
    include: { tenant: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
          <div>
            <span className="text-xs uppercase tracking-widest px-3 py-1 bg-blue-500/15 text-blue-400 rounded-full font-semibold border border-blue-500/20">
              Financial Operations & Billing
            </span>
            <h1 className="text-3xl font-extrabold text-white mt-2">Subscription & Revenue Invoices</h1>
            <p className="text-slate-400 text-sm mt-1">Track platform MRR, SaaS subscription payments, and school billing telemetry.</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-xs font-mono text-blue-400">
            Total Invoices: {invoices.length}
          </div>
        </div>

        {/* Invoices Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="px-6 py-4 border-b border-slate-800 font-bold text-sm text-slate-200">
            Recent Invoices
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
                <th className="px-6 py-3 font-semibold">Tenant Workspace</th>
                <th className="px-6 py-3 font-semibold">Amount</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold">Issued At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs">
              {invoices.map((inv: any) => (
                <tr key={inv.id} className="hover:bg-slate-800/40 transition">
                  <td className="px-6 py-4 font-bold text-white">{inv.tenant?.name || "Global Tenant"}</td>
                  <td className="px-6 py-4 font-mono text-emerald-400">${inv.amount.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400">{new Date(inv.createdAt).toLocaleString()}</td>
                </tr>
              ))}
              {invoices.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">No invoices recorded yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
