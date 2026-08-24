export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

const RESERVED_SUBDOMAINS = [
  "admin", 
  "api", 
  "dashboard", 
  "auth", 
  "login", 
  "signup", 
  "_next", 
  "favicon.ico", 
  "robots.txt"
];

export default async function TenantDashboard(props: {
  params: Promise<{ subdomain?: string }>;
}) {
  const resolvedParams = await props.params;
  const subdomain = resolvedParams?.subdomain;

  if (
    !subdomain || 
    typeof subdomain !== "string" || 
    RESERVED_SUBDOMAINS.includes(subdomain.toLowerCase())
  ) {
    notFound();
  }

  const tenant = await prisma.tenant.findUnique({
    where: { subdomain: subdomain.toLowerCase() },
    include: { students: true, invoices: true },
  });

  if (!tenant) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-blue-400 uppercase tracking-wider">Dedicated Tenant Workspace</span>
            <h1 className="text-3xl font-black mt-1">{tenant.name}</h1>
            <p className="text-sm text-slate-400 font-mono mt-1">{tenant.subdomain}.smartcampusai.in</p>
          </div>
          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-bold uppercase">
            {tenant.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <h2 className="text-lg font-bold mb-4">Enrolled Students ({tenant.students?.length || 0})</h2>
            {tenant.students?.length === 0 ? (
              <p className="text-sm text-slate-500">No students registered yet.</p>
            ) : (
              <ul className="space-y-2">
                {tenant.students?.map((student: any) => (
                  <li key={student.id} className="text-sm text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800">
                    {student.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <h2 className="text-lg font-bold mb-4">Invoices & Billing ({tenant.invoices?.length || 0})</h2>
            {tenant.invoices?.length === 0 ? (
              <p className="text-sm text-slate-500">No active invoices found.</p>
            ) : (
              <ul className="space-y-2">
                {tenant.invoices?.map((invoice: any) => (
                  <li key={invoice.id} className="text-sm text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between">
                    <span>Invoice #{invoice.id}</span>
                    <span className="font-mono text-blue-400">₹{invoice.amount}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}