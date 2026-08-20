import { prisma } from '@/lib/prisma';
import { provisionTenant } from './actions/provision';

export default async function SuperAdminDashboard() {
  const schools = await prisma.school.findMany({
    include: { students: true, facilities: true, tickets: true, staff: true, fees: true }
  });
  
  const totalStudents = await prisma.student.count();
  const allTickets = schools.flatMap(s => s.tickets);
  
  let totalMRR = 0;
  let enterpriseCount = 0;
  let proCount = 0;
  let trialCount = 0;

  schools.forEach(s => {
    if (s.subscriptionTier === 'ENTERPRISE') {
      totalMRR += 119999;
      enterpriseCount++;
    } else if (s.subscriptionTier === 'PRO') {
      totalMRR += 39999;
      proCount++;
    } else {
      trialCount++;
    }
  });

  const recentStudents = await prisma.student.findMany({
    include: { school: true },
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  return (
    <div className="p-8 bg-slate-950 min-h-screen text-slate-100 font-sans">
      <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full font-semibold border border-blue-500/20">
            Global Hub
          </span>
          <h1 className="text-3xl font-extrabold mt-2 tracking-tight">Super Admin Control Panel</h1>
          <p className="text-slate-400 text-sm mt-1">Multi-tenant infrastructure orchestrator, global revenue telemetry, and billing engine.</p>
        </div>
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-medium text-slate-300">All Systems Operational</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Platform MRR</p>
          <p className="text-3xl font-black mt-2 text-emerald-400">₹{totalMRR.toLocaleString()}/mo</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Active Tenants</p>
          <p className="text-3xl font-black mt-2 text-blue-400">{schools.length} Schools</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Students Enrolled</p>
          <p className="text-3xl font-black mt-2 text-indigo-400">{totalStudents} Students</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Open Support Tickets</p>
          <p className="text-3xl font-black mt-2 text-amber-400">{allTickets.length} Tickets</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl mb-8 shadow-lg">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <span>📊 Global Revenue & Tier Analytics Breakdown</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="text-xs font-semibold text-blue-400 uppercase">Enterprise Tier</div>
            <div className="text-2xl font-bold mt-1">{enterpriseCount} Tenant(s)</div>
            <div className="text-xs text-slate-400 mt-1">Revenue Contribution: ₹{(enterpriseCount * 119999).toLocaleString()}/mo</div>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="text-xs font-semibold text-purple-400 uppercase">Pro Tier</div>
            <div className="text-2xl font-bold mt-1">{proCount} Tenant(s)</div>
            <div className="text-xs text-slate-400 mt-1">Revenue Contribution: ₹{(proCount * 39999).toLocaleString()}/mo</div>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="text-xs font-semibold text-emerald-400 uppercase">Trial / Free Tier</div>
            <div className="text-2xl font-bold mt-1">{trialCount} Tenant(s)</div>
            <div className="text-xs text-slate-400 mt-1">Conversion Pipeline Active</div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-bold mb-4">🏢 Tenant Institutions ({schools.length})</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {schools.map(school => (
            <div key={school.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-xs px-2.5 py-1 bg-blue-500/10 text-blue-400 font-semibold rounded-lg border border-blue-500/20 uppercase">
                      {school.subscriptionTier} PLAN
                    </span>
                    <h4 className="text-xl font-bold mt-3">{school.name}</h4>
                    <p className="text-xs text-slate-400 font-mono mt-1">Subdomain: {school.subdomain}.localhost:3000</p>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2 my-4 bg-slate-950 p-3 rounded-xl border border-slate-800/60 text-center">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-medium">Students</div>
                    <div className="font-bold text-sm mt-0.5">{school.students.length}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-medium">Facilities</div>
                    <div className="font-bold text-sm mt-0.5">{school.facilities.length}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-medium">Staff</div>
                    <div className="font-bold text-sm mt-0.5">{school.staff.length}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-medium">Invoices</div>
                    <div className="font-bold text-sm mt-0.5">{school.fees.length}</div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-slate-800">
                <a 
                  href={`/${school.subdomain}`} 
                  target="_blank" 
                  className="text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl transition shadow"
                >
                  Launch Tenant Portal ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg mb-8">
        <h3 className="text-lg font-bold mb-4">📋 Platform Audit & Activity Stream (Newest First)</h3>
        <div className="space-y-3">
          {recentStudents.map(st => (
            <div key={st.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800/80 flex justify-between items-center">
              <div>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded border border-emerald-500/20">
                  STUDENT ENROLLED
                </span>
                <p className="text-sm font-medium mt-1.5">
                  Enrolled <span className="font-bold text-slate-200">{st.name}</span> (ID: {st.studentId}, GPA: {st.gpa ?? 'N/A'})
                </p>
                <p className="text-xs text-slate-400 mt-0.5">Institution: {st.school?.name}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                  {new Date(st.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          {recentStudents.length === 0 && (
            <p className="text-slate-500 text-center py-4">No recent activity recorded.</p>
          )}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
        <h3 className="text-lg font-bold mb-2">🚀 Onboard Monetized Institution Tenant</h3>
        <p className="text-slate-400 text-sm mb-6">Provision an isolated multi-tenant instance with custom brand colors and INR billing tiers instantly.</p>
        
        <form action={provisionTenant} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input 
            type="text" 
            name="name" 
            placeholder="Institution Name (e.g., Apex Academy)" 
            required 
            className="bg-slate-950 border border-slate-800 px-4 py-3 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-blue-500"
          />
          <input 
            type="text" 
            name="subdomain" 
            placeholder="Subdomain (e.g., apex)" 
            required 
            className="bg-slate-950 border border-slate-800 px-4 py-3 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-blue-500"
          />
          <select 
            name="plan" 
            className="bg-slate-950 border border-slate-800 px-4 py-3 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="ENTERPRISE">Enterprise Tier (₹1,19,999/mo)</option>
            <option value="PRO">Pro Tier (₹39,999/mo)</option>
            <option value="TRIAL">14-Day Free Trial (₹0)</option>
          </select>
          <div className="md:col-span-3">
            <button 
              type="submit" 
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-xl transition shadow-lg shadow-emerald-900/20"
            >
              ⚡ Provision Monetized Tenant Instance
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
