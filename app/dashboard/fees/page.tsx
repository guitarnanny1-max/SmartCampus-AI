'use client';

import { useState } from "react";

export default function BursarFeesPage() {
  const [invoices, setInvoices] = useState([
    { id: "INV-2026-001", student: "Aarav Sharma", class: "Grade 10-A", head: "Term 1 Tuition + Lab", amount: 24500, due: "2026-09-10", status: "Paid" },
    { id: "INV-2026-002", student: "Diya Patel", class: "Grade 8-B", head: "Term 1 Tuition", amount: 18000, due: "2026-08-15", status: "Overdue" },
    { id: "INV-2026-003", student: "Kabir Verma", class: "Grade 11-Science", head: "Annual Sports & Library", amount: 6500, due: "2026-09-30", status: "Pending" },
    { id: "INV-2026-004", student: "Ananya Iyer", class: "Grade 6-C", head: "Term 1 Tuition", amount: 15000, due: "2026-09-01", status: "Pending" },
  ]);

  const [filter, setFilter] = useState("All");

  const filteredInvoices = filter === "All" ? invoices : invoices.filter((inv: any) => inv.status === filter);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full font-semibold border border-emerald-500/20">
            Financial & Bursar Operations
          </span>
          <h1 className="text-3xl font-extrabold text-white mt-2">Fee Collections & Invoicing</h1>
          <p className="text-slate-400 text-sm mt-1">Manage school tuition, fee heads, automated reminders, and payment reconciliations.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition shadow">
          + Generate Fee Invoice
        </button>
      </div>

      {/* Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Revenue Expected</div>
          <div className="text-3xl font-extrabold text-white mt-2">₹1.42 Cr</div>
          <div className="text-[11px] text-slate-500 mt-1">Academic Year 2026-27</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Collected to Date</div>
          <div className="text-3xl font-extrabold text-emerald-400 mt-2">₹98.4 Lakhs</div>
          <div className="text-[11px] text-emerald-400 mt-1">69.2% collection rate</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Pending Dues</div>
          <div className="text-3xl font-extrabold text-amber-400 mt-2">₹32.1 Lakhs</div>
          <div className="text-[11px] text-slate-500 mt-1">Across 142 student accounts</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Overdue / Default</div>
          <div className="text-3xl font-extrabold text-rose-400 mt-2">₹11.5 Lakhs</div>
          <div className="text-[11px] text-rose-400 mt-1">Requires WhatsApp reminder</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {["All", "Paid", "Pending", "Overdue"].map((tab: any) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              filter === tab ? "bg-indigo-600 text-white" : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Invoices Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 font-bold text-sm text-slate-200">
          Fee Invoices & Ledger ({filteredInvoices.length})
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
                <th className="px-6 py-3 font-semibold">Invoice ID</th>
                <th className="px-6 py-3 font-semibold">Student Name</th>
                <th className="px-6 py-3 font-semibold">Class</th>
                <th className="px-6 py-3 font-semibold">Fee Head</th>
                <th className="px-6 py-3 font-semibold">Amount</th>
                <th className="px-6 py-3 font-semibold">Due Date</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs">
              {filteredInvoices.map((inv: any) => (
                <tr key={inv.id} className="hover:bg-slate-800/40 transition">
                  <td className="px-6 py-4 font-mono text-slate-400">{inv.id}</td>
                  <td className="px-6 py-4 font-bold text-white">{inv.student}</td>
                  <td className="px-6 py-4 text-slate-300">{inv.class}</td>
                  <td className="px-6 py-4 text-slate-300">{inv.head}</td>
                  <td className="px-6 py-4 font-bold text-white">₹{inv.amount.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 text-slate-400">{inv.due}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      inv.status === "Paid" 
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                        : inv.status === "Overdue"
                        ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button className="text-slate-400 hover:text-white font-medium">Receipt</button>
                    <button className="text-indigo-400 hover:text-indigo-300 font-medium">Remind</button>
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
