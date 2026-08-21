import { prisma } from "@/lib/prisma";
import { verifyTenantAccess } from "../lib/auth-guard";

export const dynamic = "force-dynamic";

export default async function StudentsPage() {
  const access = await verifyTenantAccess("ADMIN");

  if (!access.authorized) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-slate-900 border border-red-500/20 rounded-2xl p-8">
            <h1 className="text-2xl font-extrabold text-white">
              Access Denied
            </h1>

            <p className="text-slate-400 mt-2">
              You are not authorized to access the Student Directory.
            </p>
          </div>
        </div>
      </div>
    );
  }

  /*
   * SUPER_ADMIN can see students across every tenant.
   *
   * Tenant users only see students belonging to their tenant.
   */
  const students =
    access.scope === "SUPER_ADMIN"
      ? await prisma.student.findMany({
          include: {
            tenant: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        })
      : access.tenantId
        ? await prisma.student.findMany({
            where: {
              tenantId: access.tenantId,
            },
            include: {
              tenant: true,
            },
            orderBy: {
              createdAt: "desc",
            },
          })
        : [];

  const isSuperAdmin = access.scope === "SUPER_ADMIN";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
          <div>
            <span className="text-xs uppercase tracking-widest px-3 py-1 bg-purple-500/15 text-purple-400 rounded-full font-semibold border border-purple-500/20">
              Student Enrollment &amp; Records
            </span>

            <h1 className="text-3xl font-extrabold text-white mt-2">
              Student Directory
            </h1>

            <p className="text-slate-400 text-sm mt-1">
              {isSuperAdmin
                ? "Platform-wide student directory across all tenant workspaces."
                : "Manage active student rosters, admission numbers, and grade placements."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isSuperAdmin && (
              <div className="bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-xl text-xs font-semibold text-amber-400">
                SUPER ADMIN
              </div>
            )}

            <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-xs font-mono text-purple-400">
              Total Students: {students.length}
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="px-6 py-4 border-b border-slate-800 font-bold text-sm text-slate-200">
            Enrolled Student Roster
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
                  {isSuperAdmin && (
                    <th className="px-6 py-3 font-semibold">
                      Tenant Workspace
                    </th>
                  )}

                  <th className="px-6 py-3 font-semibold">
                    Admission No
                  </th>

                  <th className="px-6 py-3 font-semibold">
                    Student Name
                  </th>

                  <th className="px-6 py-3 font-semibold">
                    Grade
                  </th>

                  <th className="px-6 py-3 font-semibold">
                    Guardian
                  </th>

                  <th className="px-6 py-3 font-semibold">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800 text-xs">
                {students.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-slate-800/40 transition"
                  >
                    {isSuperAdmin && (
                      <td className="px-6 py-4 font-bold text-white">
                        {student.tenant?.name || "Unknown Tenant"}
                      </td>
                    )}

                    <td className="px-6 py-4 font-mono text-indigo-400">
                      {student.admissionNumber}
                    </td>

                    <td className="px-6 py-4 font-bold text-slate-200">
                      {student.name}
                    </td>

                    <td className="px-6 py-4 text-slate-300">
                      {student.grade}
                    </td>

                    <td className="px-6 py-4 text-slate-300">
                      {student.guardianName}
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {student.status}
                      </span>
                    </td>
                  </tr>
                ))}

                {students.length === 0 && (
                  <tr>
                    <td
                      colSpan={isSuperAdmin ? 6 : 5}
                      className="px-6 py-12 text-center"
                    >
                      <div className="text-slate-400 font-semibold">
                        No students registered yet.
                      </div>

                      <div className="text-slate-600 text-xs mt-2">
                        Student records will appear here once enrollment data
                        is created.
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
