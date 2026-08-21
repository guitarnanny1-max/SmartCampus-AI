import os
import subprocess

print("⚙️ Fixing TypeScript typing in app/admissions/page.tsx...")

page_path = "app/admissions/page.tsx"
os.makedirs(os.path.dirname(page_path), exist_ok=True)

content = """export const dynamic = 'force-dynamic';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function AdmissionsPage() {
  let applicants: any[] = [];
  try {
    applicants = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' }
    });
  } catch (err) {
    console.error(err);
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admissions Pipeline</h1>
          <p className="text-sm text-gray-500">Manage incoming school applications and lead conversions</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase border-b border-gray-200">
              <th className="px-6 py-4">School</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4">Temperature</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm">
            {applicants.map((lead: any) => (
              <tr key={lead.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-bold text-gray-900">{lead.school || lead.schoolName}</td>
                <td className="px-6 py-4 text-gray-700">{lead.name || lead.contactName}</td>
                <td className="px-6 py-4 font-mono text-indigo-600">{lead.email}</td>
                <td className="px-6 py-4 text-gray-700">{lead.phone}</td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-lg text-xs font-semibold border border-amber-200">
                    {lead.temperature || "🔵 Cold"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-semibold border border-indigo-200">
                    {lead.status || "NEW"}
                  </span>
                </td>
              </tr>
            ))}
            {applicants.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No applicants found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
"""

with open(page_path, "w", encoding="utf-8") as f:
    f.write(content)

print("✨ Updated app/admissions/page.tsx with explicit type annotation!")

build_env = os.environ.copy()
build_env["DATABASE_URL"] = "file:./dev.db"

try:
    print("1️⃣ Running Next.js Production Build...")
    subprocess.run(["npx", "prisma", "generate"], check=True, env=build_env)
    subprocess.run(["npm", "run", "build"], check=True, env=build_env)
    
    print("\n🎉 SUCCESS! The entire project compiled successfully with zero errors!")
except subprocess.CalledProcessError as e:
    print(f"\n❌ Build failed with exit code {e.returncode}")
    exit(1)
