'use client';

import { useState } from "react";

export default function SuperAdminTenantsPage() {
  const [tenants, setTenants] = useState([
    { id: "tenant_a8f9k2", name: "Delhi Public Academy", plan: "School Growth", mrr: 2999, students: 1250, status: "Active", health: "High (98%)" },
    { id: "tenant_b3x1m5", name: "Apex Global University", plan: "AI 360 Enterprise", mrr: 25000, students: 4800, status: "Active", health: "Optimal (99%)" },
    { id: "tenant_c7q4w9", name: "St. Mary High School", plan: "Digital Starter", mrr: 1499, students: 420, status: "Active", health: "Warning (72%)" },
    { id: "tenant_d2z8p1", name: "Greenfield Public", plan: "School Professional", mrr: 5999, students: 2100, status: "Active", health: "High (94%)" },
  ]);

  const totalMRR = tenants.reduce((acc: any, t: any) => acc + t.mrr, 0);
  const totalARR = totalMRR * 12;
  const totalStudents = tenants.reduce((acc: any, t: any) => acc + t.students, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full font-semibold border border-purple-500/20">
            Super Admin Control Center
          </span>
          <h1 className="text-3xl font-extrabold text-white mt-2">Global SaaS Intelligence & Tenants</h1>
          <p className="text-slate-400 text-sm mt-1">Monitor platform-wide MRR, ARR, aggregate student volume, and customer health telemetry.</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-xs font-mono text-purple-400">
          Platform Status: Operational 99.99%
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow">
          <div className="text-xs font-semibold text-slate-400 uppercase">Monthly Recurring Revenue (MRR)</div>
          <div className="text-2xl font-extrabold text-emerald-400 mt-2">₹{totalMRR.toLocaleString("en-IN")}</div>
          <div className="text-[11px] text-slate-500 mt-1">+18.4% from last month</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow">
          <div className="text-xs font-semibold text-slate-400 uppercase">Annual Run Rate (ARR)</div>
          <div className="text-2xl font-extrabold text-indigo-400 mt-2">₹{totalARR.toLocaleString("en-IN")}</div>
          <div className="text-[11px] text-slate-500 mt-1">Projected annualized run rate</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow">
          <div className="text-xs font-semibold text-slate-400 uppercase">Active Tenant Schools</div>
          <div className="text-2xl font-extrabold text-white mt-2">{tenants.length} Organizations</div>
          <div className="text-[11px] text-slate-500 mt-1">100% data-isolated instances</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow">
          <div className="text-xs font-semibold text-slate-400 uppercase">Total Students Managed</div>
          <div className="text-2xl font-extrabold text-amber-400 mt-2">{totalStudents.toLocaleString("en-IN")}</div>
          <div className="text-[11px] text-slate-500 mt-1">Across all school boards</div>
        </div>
      </div>

      {/* Tenant Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 font-bold text-sm text-slate-200 flex justify-between items-center">
          <span>Active Tenant Organizations ({tenants.length})</span>
          <span className="text-xs text-slate-500 font-mono">Global Master Registry</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
                <th className="px-6 py-3 font-semibold">Tenant ID</th>
                <th className="px-6 py-3 font-semibold">Institution Name</th>
                <th className="px-6 py-3 font-semibold">Subscription Plan</th>
                <th className="px-6 py-3 font-semibold">MRR Contribution</th>
                <th className="px-6 py-3 font-semibold">Students</th>
                <th className="px-6 py-3 font-semibold">Customer Health Score</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs">
              {tenants.map((t: any) => (
                <tr key={t.id} className="hover:bg-slate-800/40 transition">
                  <td className="px-6 py-4 font-mono font-bold text-purple-400">{t.id}</td>
                  <td className="px-6 py-4 font-bold text-white">{t.name}</td>
                  <td className="px-6 py-4 text-slate-300 font-medium">{t.plan}</td>
                  <td className="px-6 py-4 font-semibold text-emerald-400">₹{t.mrr.toLocaleString("en-IN")}</td>
                  <td className="px-6 py-4 text-slate-300">{t.students.toLocaleString("en-IN")}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      t.health.includes("Optimal") || t.health.includes("High") 
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}>
                      {t.health}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button className="text-slate-400 hover:text-white font-medium">Impersonate</button>
                    <button className="text-purple-400 hover:text-purple-300 font-medium">Billing</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
