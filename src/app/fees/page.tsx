'use client';

import React, { useState } from 'react';
import { Sparkles, CreditCard, DollarSign, ArrowLeft, CheckCircle2, Search, Receipt, ShieldCheck, Download, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function FeesModule() {
  const [feeSuccess, setFeeSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const transactions = [
    { id: 1, studentName: 'Aarav Sharma', class: 'Grade 11 - Science', category: 'Q2 Tuition & Lab Fee', amount: '₹45,000', gateway: 'Razorpay UPI', status: 'Paid', timestamp: '10 mins ago' },
    { id: 2, studentName: 'Diya Patel', class: 'Grade 10 - General', category: 'Annual Sports & Library Fee', amount: '₹12,500', gateway: 'Stripe Credit Card', status: 'Paid', timestamp: '35 mins ago' },
    { id: 3, studentName: 'Rohan Verma', class: 'Grade 12 - Commerce', category: 'Q2 Tuition Fee', amount: '₹42,000', gateway: 'NetBanking (HDFC)', status: 'Pending', timestamp: 'Due Today' },
    { id: 4, studentName: 'Ananya Iyer', class: 'Grade 9 - General', category: 'Transport & Bus Fee', amount: '₹8,500', gateway: 'Razorpay UPI', status: 'Paid', timestamp: '2 hours ago' },
  ];

  const handleCollectFee = () => {
    setFeeSuccess(true);
    setTimeout(() => setFeeSuccess(false), 3500);
  };

  const filteredTransactions = transactions.filter(tx => 
    tx.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.class.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.category.toLowerCase().includes(searchQuery.toLowerCase())
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
            <h1 className="text-sm font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">SmartCampus SaaS OS</h1>
            <span className="text-[10px] text-slate-400">Fee Management & Payment Gateway Hub</span>
          </div>
        </div>

        <Link href="/" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight">Fee Collection & Gateway Reconciliation</h2>
            <p className="text-xs text-slate-400 mt-1">Manage tuition billing cycles, Razorpay & Stripe gateway webhooks, automated receipt dispatch, and pending dues tracking.</p>
          </div>
          <button
            onClick={handleCollectFee}
            className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-cyan-950 flex items-center gap-2 cursor-pointer w-fit"
          >
            <CreditCard className="w-4 h-4" />
            <span>Process New Payment Gateway Invoice</span>
          </button>
        </div>

        {feeSuccess && (
          <div className="p-4 bg-cyan-950/40 border border-cyan-500/30 rounded-2xl text-xs text-cyan-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Invoice generated successfully and payment link dispatched via SMS & WhatsApp!</span>
          </div>
        )}

        {/* Fee KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">Total Revenue Collected (YTD)</div>
            <div className="text-3xl font-extrabold text-white">₹2.48 Cr</div>
            <div className="text-[10px] text-cyan-400 font-medium">+14.2% vs previous academic year</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">Collection Efficiency Rate</div>
            <div className="text-3xl font-extrabold text-emerald-400">96.8%</div>
            <div className="text-[10px] text-slate-400">Automated reminder engine active</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">Pending Dues Outstanding</div>
            <div className="text-3xl font-extrabold text-amber-400">₹8.2 Lakhs</div>
            <div className="text-[10px] text-slate-400">Notices sent to 38 accounts</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">Payment Gateway Status</div>
            <div className="text-3xl font-extrabold text-emerald-400">Connected</div>
            <div className="text-[10px] text-slate-400">Razorpay & Stripe webhooks secure</div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Receipt className="w-5 h-5 text-cyan-400" />
              <span>Real-Time Fee Transaction Ledger</span>
            </h3>

            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search student, class, category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div className="space-y-3 text-xs">
            {filteredTransactions.map((tx) => (
              <div key={tx.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="font-bold text-white text-sm">{tx.studentName} • <span className="text-cyan-400">{tx.category}</span></div>
                  <div className="text-slate-400 flex items-center gap-4 text-[11px]">
                    <span>Class: <strong className="text-slate-300">{tx.class}</strong></span>
                    <span>Gateway: <strong className="text-slate-300">{tx.gateway}</strong></span>
                    <span className="text-slate-500 font-mono">{tx.timestamp}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-white font-bold text-sm">{tx.amount}</span>
                  <span className={`px-3 py-1 rounded-full font-bold text-[10px] ${
                    tx.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  }`}>
                    {tx.status}
                  </span>
                  <button className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 transition-colors cursor-pointer">
                    <Download className="w-4 h-4 text-cyan-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
