import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function AdminInvoicesPage() {
  const invoices = await prisma.invoice.findMany({
    include: { school: true },
    orderBy: { createdAt: 'desc' },
  });

  const totalRevenue = invoices.reduce((acc, inv) => acc + inv.amount, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                SAAS FINANCIAL METERING
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Global Revenue & Invoicing Portal</h1>
            <p className="text-xs text-slate-400">Track recurring subscriptions, itemized overages, and payment statuses across all tenants.</p>
          </div>
          <Link 
            href="/admin/schools" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to Global Control Center
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-1">
            <span className="text-xs font-medium text-slate-400">Total Processed Revenue</span>
            <div className="text-2xl font-extrabold text-emerald-400 font-mono">${totalRevenue.toLocaleString()}</div>
          </div>
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-1">
            <span className="text-xs font-medium text-slate-400">Active Paid Invoices</span>
            <div className="text-2xl font-extrabold text-cyan-400 font-mono">{invoices.length}</div>
          </div>
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-1">
            <span className="text-xs font-medium text-slate-400">Billing Cycle</span>
            <div className="text-2xl font-extrabold text-white font-mono">Monthly Automated</div>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>💳</span> Itemized Institutional Invoices
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Invoice ID</th>
                  <th className="p-4 font-medium">Institution Tenant</th>
                  <th className="p-4 font-medium">Itemized Breakdown</th>
                  <th className="p-4 font-medium">Amount</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Date</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4 font-mono text-slate-400">{inv.id.substring(0, 8)}...</td>
                    <td className="p-4 font-semibold text-white">{inv.school?.name ?? 'Direct Client'}</td>
                    <td className="p-4 text-slate-300">{inv.title}</td>
                    <td className="p-4 font-mono text-emerald-400 font-bold">${inv.amount.toFixed(2)}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {inv.status}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-slate-400 text-right">
                      {new Date(inv.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
