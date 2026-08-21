import { prisma } from "@/lib/prisma";




export default async function ExamsPage() {
  const exams = await prisma.exam.findMany({
    include: { tenant: true },
    orderBy: { date: "asc" }
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
          <div>
            <span className="text-xs uppercase tracking-widest px-3 py-1 bg-purple-500/15 text-purple-400 rounded-full font-semibold border border-purple-500/20">
              Academic Evaluation & Exams
            </span>
            <h1 className="text-3xl font-extrabold text-white mt-2">Exam Schedule & Assessments</h1>
            <p className="text-slate-400 text-sm mt-1">Manage school test schedules, grading sheets, and examination metrics.</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-xs font-mono text-purple-400">
            Total Exams: {exams.length}
          </div>
        </div>

        {/* Exams Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="px-6 py-4 border-b border-slate-800 font-bold text-sm text-slate-200">
            Scheduled Examinations
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
                <th className="px-6 py-3 font-semibold">Tenant Workspace</th>
                <th className="px-6 py-3 font-semibold">Exam Title</th>
                <th className="px-6 py-3 font-semibold">Subject</th>
                <th className="px-6 py-3 font-semibold">Date & Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs">
              {exams.map((exam: any) => (
                <tr key={exam.id} className="hover:bg-slate-800/40 transition">
                  <td className="px-6 py-4 font-bold text-white">{exam.tenant?.name || "Global Tenant"}</td>
                  <td className="px-6 py-4 font-bold text-indigo-400">{exam.title}</td>
                  <td className="px-6 py-4 text-slate-300">{exam.subject}</td>
                  <td className="px-6 py-4 font-mono text-slate-400">{new Date(exam.date).toLocaleString()}</td>
                </tr>
              ))}
              {exams.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">No examinations scheduled yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
