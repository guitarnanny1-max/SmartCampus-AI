'use client';

import { useState } from "react";

export default function BillingPortalPage() {
  const [subscription, setSubscription] = useState({
    planName: "School Growth",
    planKey: "school-growth",
    status: "ACTIVE",
    cycle: "Monthly",
    renewalDate: "September 25, 2026",
    amount: 2999,
    onboardingPaid: true,
  });

  const [invoices] = useState([
    { id: "INV-2026-0801", date: "Aug 25, 2026", amount: "₹17,999", type: "Subscription + Onboarding", status: "Paid" },
    { id: "INV-2026-0715", date: "Jul 15, 2026", amount: "₹2,999", type: "Monthly Recurring", status: "Paid" },
  ]);

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full font-semibold border border-emerald-500/20">
            SaaS Entitlement & Billing
          </span>
          <h1 className="text-3xl font-extrabold text-white mt-2">Subscription & Invoices</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your institution workspace plan, billing cycle, and payment history.</p>
        </div>
        <button 
          onClick={() => setShowUpgradeModal(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-5 py-3 rounded-xl transition shadow-lg shadow-indigo-600/30"
        >
          Upgrade Plan &rarr;
        </button>
      </div>

      {/* Subscription Status Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Current Active Plan</span>
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-bold">
                {subscription.status}
              </span>
            </div>
            <div className="text-3xl font-extrabold text-white">{subscription.planName}</div>
            <p className="text-slate-400 text-xs mt-2">
              Includes access to Student Management, Fees Ledger, Timetable, Exams, and Admissions CRM.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap justify-between items-center gap-4 text-xs">
            <div>
              <span className="text-slate-500 block">Billing Cycle</span>
              <span className="font-bold text-white text-sm">{subscription.cycle} (₹{subscription.amount.toLocaleString("en-IN")}/mo)</span>
            </div>
            <div>
              <span className="text-slate-500 block">Next Renewal Date</span>
              <span className="font-bold text-white text-sm">{subscription.renewalDate}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Setup Fee Status</span>
              <span className="font-bold text-emerald-400 text-sm">Paid (₹15,000)</span>
            </div>
          </div>
        </div>

        {/* Payment Method Card */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">Payment Method</div>
            <div className="flex items-center gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div className="w-10 h-7 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-[10px] text-white">
                VISA
              </div>
              <div>
                <div className="font-bold text-white text-xs">•••• •••• •••• 4242</div>
                <div className="text-[10px] text-slate-500">Expires 12/28</div>
              </div>
            </div>
          </div>
          <button className="mt-6 w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2.5 rounded-xl text-xs transition border border-slate-700">
            Update Payment Details
          </button>
        </div>

      </div>

      {/* Invoice History Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 font-bold text-sm text-slate-200 flex justify-between items-center">
          <span>Billing & Invoice History</span>
          <span className="text-xs text-slate-500 font-mono">GSTIN Compliant Invoices</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
                <th className="px-6 py-3 font-semibold">Invoice ID</th>
                <th className="px-6 py-3 font-semibold">Date</th>
                <th className="px-6 py-3 font-semibold">Description</th>
                <th className="px-6 py-3 font-semibold">Amount</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold text-right">Download</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs">
              {invoices.map((inv: any) => (
                <tr key={inv.id} className="hover:bg-slate-800/40 transition">
                  <td className="px-6 py-4 font-mono font-bold text-indigo-400">{inv.id}</td>
                  <td className="px-6 py-4 text-slate-300">{inv.date}</td>
                  <td className="px-6 py-4 font-medium text-white">{inv.type}</td>
                  <td className="px-6 py-4 font-bold text-emerald-400">{inv.amount}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-indigo-400 hover:text-indigo-300 font-medium">PDF</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white">Upgrade Your Workspace Tier</h3>
              <button onClick={() => setShowUpgradeModal(false)} className="text-slate-400 hover:text-white font-bold">&times;</button>
            </div>

            <div className="space-y-4">
              {[
                { name: "School Professional", price: "₹5,999/mo", desc: "Adds Transport, Facility Automation, and Advanced Analytics." },
                { name: "AI 360 Enterprise", price: "₹25,000/mo", desc: "Unlocks AI Copilot, AI Chatbot, and Enterprise Autonomous Agents." }
              ].map((tier, idx) => (
                <div key={idx} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex justify-between items-center hover:border-indigo-500 transition cursor-pointer">
                  <div>
                    <div className="font-bold text-white text-sm">{tier.name}</div>
                    <div className="text-slate-400 text-xs mt-1">{tier.desc}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-extrabold text-emerald-400 text-sm">{tier.price}</div>
                    <button className="mt-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-3 py-1.5 rounded-lg text-xs transition">
                      Select
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
              <button 
                onClick={() => setShowUpgradeModal(false)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-4 py-2 rounded-xl text-xs transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
