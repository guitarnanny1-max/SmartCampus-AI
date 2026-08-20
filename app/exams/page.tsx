import { prisma } from "@/lib/prisma";

export default async function ExamsPage() {
  const exams = await prisma.exam.findMany({
    include: { school: true },
    orderBy: { date: "asc" }
  });

  const subjects = [...new Set(exams.map(e => e.subject))];

  return (
    <div className="p-8 bg-slate-950 min-h-screen text-slate-100 font-sans">
      <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest px-3 py-1 bg-amber-500/10 text-amber-400 rounded-full font-semibold border border-amber-500/20">
            Assessment Engine
          </span>
          <h1 className="text-3xl font-extrabold mt-2 tracking-tight">Examinations & Grading</h1>
          <p className="text-slate-400 text-sm mt-1">Schedule midterms, finals, track evaluation metrics, and monitor institutional testing calendars.</p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Scheduled Exams</p>
          <p className="text-3xl font-black mt-2 text-slate-100">{exams.length}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Active Subjects</p>
          <p className="text-3xl font-black mt-2 text-amber-400">{subjects.length}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Evaluation Standard</p>
          <p className="text-3xl font-black mt-2 text-blue-400">100 Marks</p>
        </div>
      </div>

      {/* Exams Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-bold mb-4">📝 Examination Schedule & Assessments</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                <th className="py-3 px-4">Exam ID</th>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Grade</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Max Marks</th>
                <th className="py-3 px-4">Institution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {exams.map((exam) => (
                <tr key={exam.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4 font-mono text-xs text-amber-400">{exam.examId}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-200">{exam.title}</td>
                  <td className="py-3.5 px-4 text-slate-300">
                    <span className="px-2 py-1 rounded bg-slate-800 text-xs text-slate-300 border border-slate-700">
                      {exam.subject}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">{exam.grade}</td>
                  <td className="py-3.5 px-4 text-slate-300 font-mono text-xs">
                    {new Date(exam.date).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-100">{exam.maxMarks}</td>
                  <td className="py-3.5 px-4 text-slate-400">{exam.school?.name}</td>
                </tr>
              ))}
              {exams.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-500">
                    No examination records found.
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
