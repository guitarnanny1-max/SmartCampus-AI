import { prisma } from '@/lib/prisma';

export default async function FinancePage() {
  const invoices = await prisma.invoice.findMany({
    include: { school: true },
    orderBy: { createdAt: 'desc' }
  });

  const totalCollected = invoices
    .filter(inv => inv.status === 'Paid')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const totalPending = invoices
    .filter(inv => inv.status === 'Pending')
    .reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className="p-8 bg-slate-950 min-h-screen text-slate-100 font-sans">
      <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full font-semibold border border-emerald-500/20">
            Financial Ledger
          </span>
          <h1 className="text-3xl font-extrabold mt-2 tracking-tight">Fee & Finance Operations</h1>
          <p className="text-slate-400 text-sm mt-1">Manage student tuition invoicing, payment tracking, and multi-tenant revenue flows.</p>
        </div>
      </div>

      {/* Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Revenue Collected</p>
          <p className="text-3xl font-black mt-2 text-emerald-400">₹{totalCollected.toLocaleString()}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Pending Dues</p>
          <p className="text-3xl font-black mt-2 text-amber-400">₹{totalPending.toLocaleString()}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Invoices Issued</p>
          <p className="text-3xl font-black mt-2 text-blue-400">{invoices.length} Invoices</p>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-bold mb-4">💳 Recent Student Invoices & Fee Status</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                <th className="py-3 px-4">Invoice ID</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Grade</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Institution</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4 font-mono text-xs text-blue-400">{inv.invoiceId}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-200">{inv.studentName}</td>
                  <td className="py-3.5 px-4 text-slate-400">{inv.grade}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-100">₹{inv.amount.toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-slate-300">{inv.school?.name}</td>
                  <td className="py-3.5 px-4 text-slate-400 text-xs">{new Date(inv.dueDate).toLocaleDateString()}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                      inv.status === 'Paid' 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                </tr>
              ))}
              {invoices.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-500">
                    No invoices recorded in the database yet.
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
