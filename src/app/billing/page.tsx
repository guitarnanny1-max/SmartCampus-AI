'use client';

import React, { useState } from 'react';
import { Sparkles, CreditCard, ShieldCheck, Receipt, ArrowLeft, CheckCircle2, Building2, Zap, Download } from 'lucide-react';
import Link from 'next/link';

export default function TenantBillingModule() {
  const [billingSuccess, setBillingSuccess] = useState(false);

  const invoices = [
    { id: 1, invoiceNo: 'INV-2026-08', date: 'August 1, 2026', plan: 'Enterprise Multi-Campus Tier', amount: '₹1,25,000', status: 'Paid' },
    { id: 2, invoiceNo: 'INV-2026-07', date: 'July 1, 2026', plan: 'Enterprise Multi-Campus Tier', amount: '₹1,25,000', status: 'Paid' },
    { id: 3, invoiceNo: 'INV-2026-06', date: 'June 1, 2026', plan: 'Standard Campus Tier', amount: '₹75,000', status: 'Paid' },
  ];

  const handleUpdatePlan = () => {
    setBillingSuccess(true);
    setTimeout(() => setBillingSuccess(false), 3500);
  };

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
            <span className="text-[10px] text-slate-400">Tenant Subscription & Billing Portal</span>
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
            <h2 className="text-2xl font-extrabold tracking-tight">SaaS Subscription & Invoicing</h2>
            <p className="text-xs text-slate-400 mt-1">Manage platform licensing tiers, payment methods, automated Stripe/Razorpay billing, and institutional tax invoices.</p>
          </div>
          <button
            onClick={handleUpdatePlan}
            className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-cyan-950 flex items-center gap-2 cursor-pointer w-fit"
          >
            <Zap className="w-4 h-4" />
            <span>Upgrade Subscription Tier</span>
          </button>
        </div>

        {billingSuccess && (
          <div className="p-4 bg-cyan-950/40 border border-cyan-500/30 rounded-2xl text-xs text-cyan-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Subscription tier upgraded successfully and new multi-tenant compute limits provisioned!</span>
          </div>
        )}

        {/* Subscription KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">Current Plan Tier</div>
            <div className="text-2xl font-extrabold text-cyan-400">Enterprise Multi-Campus</div>
            <div className="text-[10px] text-slate-400">Active Tenant Schema License</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">Next Billing Date</div>
            <div className="text-2xl font-extrabold text-white">September 1, 2026</div>
            <div className="text-[10px] text-cyan-400 font-medium">Auto-debit via Corporate Visa</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">Compute Quota Used</div>
            <div className="text-2xl font-extrabold text-emerald-400">42% of 500GB</div>
            <div className="text-[10px] text-slate-400">Multi-region AWS S3 & Postgres</div>
          </div>
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
            <div className="text-xs text-slate-400">Payment Status</div>
            <div className="text-2xl font-extrabold text-emerald-400">Active & Verified</div>
            <div className="text-[10px] text-slate-400">Zero past-due invoices</div>
          </div>
        </div>

        {/* Invoices Table */}
        <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Receipt className="w-5 h-5 text-cyan-400" />
              <span>Institutional Billing & Invoice History</span>
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            {invoices.map((inv) => (
              <div key={inv.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="font-bold text-white text-sm">{inv.invoiceNo} • <span className="text-cyan-400">{inv.plan}</span></div>
                  <div className="text-slate-400 text-[11px] font-mono">
                    Billing Date: {inv.date}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-extrabold text-emerald-400 text-sm font-mono">{inv.amount}</span>
                  <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full font-bold text-[10px]">
                    {inv.status}
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
