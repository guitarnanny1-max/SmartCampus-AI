import { prisma } from "@/lib/prisma";

import { revalidatePath } from "next/cache";



export default async function TenantDashboard({ params }: { params: { subdomain: string } }) {
  const { subdomain } = params;

  // Fetch tenant workspace
  const tenant = await prisma.tenant.findUnique({
    where: { subdomain },
    include: { students: true, invoices: true }
  });

  if (!tenant) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-8 flex items-center justify-center">
        <h1 className="text-xl font-bold text-red-400">404 | Tenant Workspace Not Found</h1>
      </div>
    );
  }

  async function handleAddStudent(formData: FormData) {
    "use server";
    if (!tenant) return;

    const name = formData.get("name") as string;
    const grade = formData.get("grade") as string;
    const phone = formData.get("phone") as string;
    const guardianName = formData.get("guardianName") as string;

    if (name && grade) {
      await prisma.student.create({
        data: {
          tenantId: tenant.id,
          admissionNumber: "ADM-2026-" + Math.floor(1000 + Math.random() * 9000),
          name,
          grade,
          guardianName: guardianName || "Parent / Guardian",
          phone: phone || "+91 99999 99999",
          status: "ACTIVE",
          feeStatus: "PENDING"
        }
      });
      revalidatePath(`/${subdomain}`);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
          <div>
            <span className="text-xs uppercase tracking-widest px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full font-semibold border border-indigo-500/20">
              Tenant Portal: {tenant.subdomain}
            </span>
            <h1 className="text-3xl font-extrabold text-white mt-2">{tenant.name}</h1>
            <p className="text-slate-400 text-sm mt-1">Multi-tenant isolated workspace managed under plan: <span className="text-white font-semibold">{tenant.plan}</span></p>
          </div>
          <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-xs font-mono text-emerald-400">
            Status: {tenant.status}
          </div>
        </div>

        {/* Add Student Form */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl mb-8 shadow-xl">
          <h2 className="text-lg font-bold text-white mb-4">Enroll New Student</h2>
          <form action={handleAddStudent} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <input type="text" name="name" placeholder="Student Full Name" required className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500" />
            <input type="text" name="grade" placeholder="Target Grade (e.g. Grade 10-A)" required className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500" />
            <input type="text" name="guardianName" placeholder="Guardian Name" className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500" />
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl px-4 py-3 text-xs transition shadow">
              Enroll Student
            </button>
          </form>
        </div>

        {/* Student Records Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="px-6 py-4 border-b border-slate-800 font-bold text-sm text-slate-200">
            Enrolled Students ({tenant.students.length})
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
                <th className="px-6 py-3 font-semibold">Admission ID</th>
                <th className="px-6 py-3 font-semibold">Student Name</th>
                <th className="px-6 py-3 font-semibold">Grade</th>
                <th className="px-6 py-3 font-semibold">Guardian</th>
                <th className="px-6 py-3 font-semibold">Fee State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs">
              {tenant.students.map((s: any) => (
                <tr key={s.id} className="hover:bg-slate-800/40 transition">
                  <td className="px-6 py-4 font-mono font-bold text-indigo-400">{s.admissionNumber}</td>
                  <td className="px-6 py-4 font-bold text-white">{s.name}</td>
                  <td className="px-6 py-4 text-slate-300">{s.grade}</td>
                  <td className="px-6 py-4 text-slate-300">{s.guardianName}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {s.feeStatus}
                    </span>
                  </td>
                </tr>
              ))}
              {tenant.students.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No students enrolled yet for this tenant workspace.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
