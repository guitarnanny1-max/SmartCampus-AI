'use client';

import React, { useState } from 'react';
import { Sparkles, CreditCard, DollarSign, Shield, ArrowLeft, CheckCircle2, Check, Zap, Building } from 'lucide-react';
import Link from 'next/link';

export default function PricingBillingModule() {
  const [billingSuccess, setBillingSuccess] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const plans = [
    { name: 'Starter Campus', price: '$999 / mo', desc: 'Ideal for independent colleges and single-campus schools.', features: ['Up to 2,000 Students', 'Core Attendance & Fee Ledgers', 'Standard Email Support', 'AES-256 Data Security'] },
    { name: 'Professional Multi-Campus', price: '$2,499 / mo', desc: 'Designed for mid-sized universities and multi-branch institutions.', features: ['Up to 10,000 Students', 'AI Proctoring & Exam Vaults', 'WhatsApp & SMS Notifications', 'Priority 24/7 Support', 'Dedicated PostgreSQL Tenant'] },
    { name: 'Enterprise Global OS', price: 'Custom ARR', desc: 'For university networks, state boards, and large-scale groups.', features: ['Unlimited Students', 'Custom LLM Fine-Tuning (GPT-4o)', 'Dedicated DevOps Cluster & SLA', 'On-Premise or Hybrid Cloud Sync', 'Custom API Integrations'] },
  ];

  const activeInvoices = [
    { school: 'St. Xavier International', plan: 'Professional Multi-Campus', amount: '$29,988 / yr', status: 'Paid', date: 'Aug 01, 2026' },
    { school: 'Global Tech Institute', plan: 'Enterprise Global OS', amount: '$54,000 / yr', status: 'Processing', date: 'Aug 14, 2026' },
    { school: 'Cambridge Academy', plan: 'Starter Campus', amount: '$11,988 / yr', status: 'Pending', date: 'Due Sep 01, 2026' },
  ];

  const handleSelectPlan = (planName: string) => {
    setSelectedPlan(planName);
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
            <h1 className="text-sm font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">SmartCampus AI</h1>
            <span className="text-[10px] text-slate-400">www.smartcampusai.in • Billing & Subscription Hub</span>
          </div>
        </div>

        <Link href="/" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Control Center</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-10 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Transparent Enterprise Pricing</h2>
          <p className="text-xs md:text-sm text-slate-400">Choose the ideal SaaS subscription tier for your institution or manage existing school billing cycles.</p>
        </div>

        {billingSuccess && (
          <div className="p-4 bg-cyan-950/40 border border-cyan-500/30 rounded-2xl text-xs text-cyan-300 flex items-center gap-2 max-w-md mx-auto">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Subscription agreement for <strong>{selectedPlan}</strong> successfully initiated! Invoice dispatched.</span>
          </div>
        )}

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((tier, idx) => (
            <div key={idx} className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6 flex flex-col justify-between shadow-2xl relative">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">{tier.name}</h3>
                  {idx === 1 && (
                    <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-full font-bold text-[10px]">
                      Most Popular
                    </span>
                  )}
                </div>
                <div className="text-3xl font-extrabold text-white">{tier.price}</div>
                <p className="text-xs text-slate-400 leading-relaxed">{tier.desc}</p>
                <div className="space-y-2.5 pt-4 border-t border-slate-800 text-xs">
                  {tier.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2 text-slate-300">
                      <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={() => handleSelectPlan(tier.name)}
                className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-cyan-950 cursor-pointer"
              >
                Select {tier.name}
              </button>
            </div>
          ))}
        </div>

        {/* Active Invoices & Billing Ledger */}
        <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-cyan-400" />
              <span>Active School Billing & Invoice Ledger</span>
            </h3>
            <div className="text-xs text-slate-400">Managed by ThomasG Billing Engine</div>
          </div>

          <div className="space-y-3 text-xs">
            {activeInvoices.map((inv, idx) => (
              <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="font-bold text-white text-sm">{inv.school} • <span className="text-cyan-400">{inv.plan}</span></div>
                  <div className="text-slate-400 flex items-center gap-4 text-[11px]">
                    <span>Amount: <strong className="text-emerald-400 font-mono">{inv.amount}</strong></span>
                    <span>Billing Date: <strong className="text-slate-300">{inv.date}</strong></span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full font-bold text-[10px] ${
                    inv.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : inv.status === 'Processing' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  }`}>
                    {inv.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/30 px-6 py-6 text-center text-xs text-slate-500 space-y-1">
        <p>SmartCampus AI • www.smartcampusai.in • Enterprise Subscription & Billing Hub</p>
        <p className="text-[10px] text-cyan-400/80 font-medium">Engineered & Developed by ThomasG Technologies</p>
      </footer>
    </div>
  );
}
