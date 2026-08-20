import { prisma } from "@/lib/prisma";

export default async function AdmissionsPage() {
  const applicants = await prisma.applicant.findMany({
    include: { school: true },
    orderBy: { createdAt: "desc" }
  });

  const reviewingCount = applicants.filter(a => a.status === "Reviewing").length;
  const acceptedCount = applicants.filter(a => a.status === "Accepted").length;
  const enrolledCount = applicants.filter(a => a.status === "Enrolled").length;

  return (
    <div className="p-8 bg-slate-950 min-h-screen text-slate-100 font-sans">
      <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full font-semibold border border-blue-500/20">
            Admissions Pipeline
          </span>
          <h1 className="text-3xl font-extrabold mt-2 tracking-tight">Admissions CRM & Enrollment</h1>
          <p className="text-slate-400 text-sm mt-1">Track prospective student applications, evaluations, and institutional onboarding funnels.</p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Applicants</p>
          <p className="text-3xl font-black mt-2 text-slate-100">{applicants.length}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Under Review</p>
          <p className="text-3xl font-black mt-2 text-amber-400">{reviewingCount}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Accepted</p>
          <p className="text-3xl font-black mt-2 text-blue-400">{acceptedCount}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Enrolled</p>
          <p className="text-3xl font-black mt-2 text-emerald-400">{enrolledCount}</p>
        </div>
      </div>

      {/* Admissions Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-bold mb-4">📋 Prospective Student Applications</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                <th className="py-3 px-4">Application ID</th>
                <th className="py-3 px-4">Candidate Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Grade Applied</th>
                <th className="py-3 px-4">Institution</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {applicants.map((app) => (
                <tr key={app.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4 font-mono text-xs text-blue-400">{app.applicantId}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-200">{app.name}</td>
                  <td className="py-3.5 px-4 text-slate-300">{app.email}</td>
                  <td className="py-3.5 px-4 text-slate-400">{app.gradeApplied}</td>
                  <td className="py-3.5 px-4 text-slate-300">{app.school?.name}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                      app.status === "Enrolled" 
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                        : app.status === "Accepted"
                        ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    }`}>
                      {app.status}
                    </span>
                  </td>
                </tr>
              ))}
              {applicants.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-500">
                    No applicant records found.
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
