import { prisma } from "@/lib/prisma";

export default async function ReportsPage() {
  const schoolCount = await prisma.school.count();
  const studentCount = await prisma.student.count();
  const staffCount = await prisma.staff.count();
  const invoiceCount = await prisma.invoice.count();

  return (
    <div className="p-8 bg-slate-950 min-h-screen text-slate-100 font-sans">
      <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-full font-semibold border border-cyan-500/20">
            Analytics & Compliance
          </span>
          <h1 className="text-3xl font-extrabold mt-2 tracking-tight">Institutional Reports & Exports</h1>
          <p className="text-slate-400 text-sm mt-1">Generate certified PDF transcripts, financial audit ledgers, and institutional performance summaries.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Indexed Schools</p>
          <p className="text-3xl font-black mt-2 text-blue-400">{schoolCount} Tenants</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Student Records</p>
          <p className="text-3xl font-black mt-2 text-indigo-400">{studentCount} Profiles</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Staff Records</p>
          <p className="text-3xl font-black mt-2 text-purple-400">{staffCount} Faculty</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Financial Invoices</p>
          <p className="text-3xl font-black mt-2 text-emerald-400">{invoiceCount} Records</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg flex flex-col justify-between">
          <div>
            <span className="text-xs px-2.5 py-1 bg-emerald-500/10 text-emerald-400 font-semibold rounded-lg border border-emerald-500/20 uppercase">Financial Audit</span>
            <h3 className="text-xl font-bold mt-3">Comprehensive Fee Ledger Export</h3>
            <p className="text-xs text-slate-400 mt-2">Export complete payment histories, outstanding balances, and monthly revenue breakdowns as a formatted CSV/PDF report.</p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center">
            <span className="text-xs text-slate-400 font-mono">Format: CSV / PDF</span>
            <button className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition shadow">
              Download Audit Report ↓
            </button>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg flex flex-col justify-between">
          <div>
            <span className="text-xs px-2.5 py-1 bg-blue-500/10 text-blue-400 font-semibold rounded-lg border border-blue-500/20 uppercase">Academic Transcript</span>
            <h3 className="text-xl font-bold mt-3">Student Performance Batch Transcript</h3>
            <p className="text-xs text-slate-400 mt-2">Compile student GPA ratings, examination results, and attendance logs into official institutional transcripts.</p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center">
            <span className="text-xs text-slate-400 font-mono">Format: Certified PDF</span>
            <button className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition shadow">
              Generate Transcripts ↓
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
