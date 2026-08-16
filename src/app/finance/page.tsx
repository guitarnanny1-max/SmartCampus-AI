'use client';

import React, { useState } from 'react';
import { Sparkles, DollarSign, CreditCard, Receipt, Shield, ArrowLeft, CheckCircle2, Search, FileSpreadsheet, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function FinanceModule() {
  const [reconciliationSuccess, setReconciliationSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const feeLedger = [
    { student: 'Rohan Sharma', id: 'APP-2026-9812', program: 'B.Tech Computer Science', amount: '₹ 2,40,000', type: 'Semester Tuition', status: 'Paid in Full' },
    { student: 'Sneha Mukherjee', id: 'APP-2026-8421', program: 'B.Tech AI & Data Science', amount: '₹ 2,40,000', type: 'Semester Tuition', status: 'Paid in Full' },
    { student: 'Kabir Varma', id: 'APP-2026-7350', program: 'B.Tech Electronics (VLSI)', amount: '₹ 1,20,000', type: 'Installment 1 / 2', status: 'Pending Balance' },
    { student: 'Ananya Sen', id: 'APP-2026-6219', program: 'MBA Financial Engineering', amount: '₹ 4,50,000', type: 'Annual Fee', status: 'Scholarship Applied' },
  ];

  const handleRunReconciliation = () => {
    setReconciliationSuccess(true);
    setTimeout(() => setReconciliationSuccess(false), 3500);
  };

  const filteredLedger = feeLedger.filter(item => 
    item.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.program.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 px-6 py-4 flex items-center justify-between backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-xl shadow-lg shadow-cyan-950">
            <Sparkles className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-sm font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">SmartCampus AI</h1>
            <span className="text-[10px] text-slate-400">www.smartcampusai.in • Finance & Bursar Hub</span>
          </div>
        </div>

        <Link href="/" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Control Center</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight">Finance, Bursar & Fee Collection</h2>
            <p className="text-xs text-slate-400 mt-1">Manage institutional tuition receipts, automated scholarship disbursements, payment gateway reconciliation, and financial audit logs.</p>
          </div>
          <button
            onClick={handleRunReconciliation}
            className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-cyan-950 flex items-center gap-2 cursor-pointer w-fit"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Run Daily Bank Reconciliation</span>
          </button>
        </div>

        {reconciliationSuccess && (
          <div className="p-4 bg-cyan-950/40 border border-cyan-500/30 rounded-2xl text-xs text-cyan-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Daily bank reconciliation successful! All payment gateway logs matched with institutional bank accounts with zero discrepancy.</span>
          </div>
        )}

        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1 shadow-xl">
            <div className="text-xs text-slate-400">Total Revenue Collected</div>
            <div className="text-3xl font-extrabold text-emerald-400">₹ 142.5 Cr</div>
            <div className="text-[10px] text-emerald-400 font-medium">98.2% fee collection efficiency</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1 shadow-xl">
            <div className="text-xs text-slate-400">Scholarships Disbursed</div>
            <div className="text-3xl font-extrabold text-white">₹ 28.4 Cr</div>
            <div className="text-[10px] text-slate-400">Merit & need-based student grants</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1 shadow-xl">
            <div className="text-xs text-slate-400">Online Gateway Uptime</div>
            <div className="text-3xl font-extrabold text-cyan-400">99.99%</div>
            <div className="text-[10px] text-slate-400">Secure UPI, NetBanking & Cards</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1 shadow-xl">
            <div className="text-xs text-slate-400">Pending Dues Audit</div>
            <div className="text-3xl font-extrabold text-amber-400">&lt; 1.8%</div>
            <div className="text-[10px] text-slate-400">Automated reminder system active</div>
          </div>
        </div>

        {/* Finance Ledger */}
        <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Receipt className="w-5 h-5 text-cyan-400" />
              <span>Tuition Receipts & Fee Collection Ledger</span>
            </h3>

            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search student, ID, program, status..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div className="space-y-3 text-xs">
            {filteredLedger.map((item, idx) => (
              <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="font-bold text-white text-sm">{item.student} • <span className="text-cyan-400">{item.id}</span></div>
                  <div className="text-slate-400 flex items-center gap-4 text-[11px]">
                    <span>Program: <strong className="text-slate-300">{item.program}</strong></span>
                    <span>Fee Type: <strong className="text-slate-300">{item.type}</strong></span>
                    <span>Amount: <strong className="text-emerald-400 font-mono">{item.amount}</strong></span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full font-bold text-[10px] ${
                    item.status === 'Paid in Full' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                    item.status === 'Scholarship Applied' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' :
                    'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  }`}>
                    {item.status}
                  </span>
                  <button className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-cyan-400 font-medium transition-colors cursor-pointer">
                    View Receipt
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/30 px-6 py-6 text-center text-xs text-slate-500 space-y-1">
        <p>SmartCampus AI • www.smartcampusai.in • Enterprise Finance & Bursar Hub</p>
        <p className="text-[10px] text-cyan-400/80 font-medium">Engineered & Developed by ThomasG Technologies</p>
      </footer>
    </div>
  );
}
