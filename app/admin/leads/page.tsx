'use client';

import { useState } from "react";

export default function SalesCRMPage() {
  const [leads, setLeads] = useState([
    { id: "L-101", school: "Delhi Public Academy", contact: "Rajesh Sharma", stage: "Qualified", source: "AI Chatbot", demo: "2026-08-25", value: "₹2.5L" },
    { id: "L-102", school: "Apex University", contact: "Sunita Rao", stage: "Demo Scheduled", source: "Referral", demo: "2026-08-27", value: "₹8.0L" },
    { id: "L-103", school: "Global Tech School", contact: "Amit Verma", stage: "New", source: "Direct Web", demo: "-", value: "₹3.0L" },
    { id: "L-104", school: "St. Xavier Junior College", contact: "Priya Mehta", stage: "Proposal", source: "Ads", demo: "2026-08-22", value: "₹4.5L" },
  ]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full font-semibold border border-indigo-500/20">
            SaaS Growth Engine
          </span>
          <h1 className="text-3xl font-extrabold text-white mt-2">Sales CRM</h1>
          <p className="text-slate-400 text-sm mt-1">Manage school onboarding pipeline, demos, and acquisition.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition shadow">
          + Add Manual Lead
        </button>
      </div>

      {/* CRM Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
        {[
          { label: "New Leads", val: "12", color: "text-white" },
          { label: "Demos Scheduled", val: "8", color: "text-indigo-400" },
          { label: "Proposals Sent", val: "5", color: "text-amber-400" },
          { label: "Win Probability", val: "68%", color: "text-emerald-400" },
        ].map((item, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow">
            <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{item.label}</div>
            <div className={`text-3xl font-extrabold ${item.color} mt-2`}>{item.val}</div>
          </div>
        ))}
      </div>

      {/* Leads Pipeline */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 font-bold text-sm text-slate-200">
          Inbound Sales Pipeline
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
                <th className="px-6 py-3 font-semibold">Lead ID</th>
                <th className="px-6 py-3 font-semibold">School Name</th>
                <th className="px-6 py-3 font-semibold">Contact Person</th>
                <th className="px-6 py-3 font-semibold">Stage</th>
                <th className="px-6 py-3 font-semibold">Source</th>
                <th className="px-6 py-3 font-semibold">Demo Date</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs">
              {leads.map((lead: any) => (
                <tr key={lead.id} className="hover:bg-slate-800/40 transition">
                  <td className="px-6 py-4 font-mono text-indigo-400">{lead.id}</td>
                  <td className="px-6 py-4 font-bold text-white">{lead.school}</td>
                  <td className="px-6 py-4 text-slate-300">{lead.contact}</td>
                  <td className="px-6 py-4">
                     <span className="px-2 py-1 bg-slate-800 rounded-lg text-slate-300">{lead.stage}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-400">{lead.source}</td>
                  <td className="px-6 py-4 text-slate-400">{lead.demo}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button className="text-slate-400 hover:text-white font-medium">Email</button>
                    <button className="text-indigo-400 hover:text-indigo-300 font-medium">Update Stage</button>
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
