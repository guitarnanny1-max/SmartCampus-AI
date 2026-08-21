export const revalidate = 0;
export const dynamic = 'force-dynamic';
"use client";
import React, { useState } from "react";
import { DollarSign, CreditCard, FileText, CheckCircle2, AlertCircle, ArrowUpRight, ShieldCheck, Receipt } from "lucide-react";
import Link from "next/link";
export default function FinancePortal() {
  const [balanceDue, setBalanceDue] = useState(12500);
  const [payments, setPayments] = useState([
    { id: "INV-2026-01", title: "Fall Semester Tuition Fee", amount: 45000, date: "2026-07-15", status: "Paid" },
    { id: "INV-2026-02", title: "Laboratory & Material Fee", amount: 8500, date: "2026-07-20", status: "Paid" },
    { id: "INV-2026-03", title: "Bus Transport Fee (Q3)", amount: 4000, date: "2026-08-01", status: "Pending" }
  ]);
  const payInvoice = (id: string, amount: number) => {
    setPayments(payments.map((p: any) => p.id === id ? { ...p, status: "Paid" } : p));
    setBalanceDue(Math.max(0, balanceDue - amount));
  };
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
          <div>
            <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono rounded-full uppercase">Portal: Fee Management & Finance</span>
            <h1 className="text-3xl font-extrabold text-white mt-1">Financial Ledger & Billing 💳</h1>
            <p className="text-slate-400 text-sm">Delhi Public School • Tuition, Dues & Secure Payments</p>
          </div>
          <Link href="/dashboard" className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 transition-colors">Master Hub</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
            <div><p className="text-xs text-slate-400 font-mono">Outstanding Dues</p><h3 className="text-2xl font-bold mt-1 text-amber-400">₹{balanceDue}.00</h3></div>
            <AlertCircle className="w-6 h-6 text-amber-400" />
          </div>
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
            <div><p className="text-xs text-slate-400 font-mono">Scholarship Waiver</p><h3 className="text-2xl font-bold mt-1 text-emerald-400">25% Merit</h3></div>
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
          </div>
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
            <div><p className="text-xs text-slate-400 font-mono">Payment Gateway</p><h3 className="text-2xl font-bold mt-1 text-cyan-400">Secure (SSL)</h3></div>
            <CreditCard className="w-6 h-6 text-cyan-400" />
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2"><Receipt className="w-5 h-5 text-indigo-400" /> Invoice Ledger</h2>
          {payments.map((item: any) => (
            <div key={item.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-center text-xs">
              <div><span className="font-mono text-slate-400">{item.id}</span> - <strong className="text-slate-200">{item.title}</strong> (₹{item.amount})</div>
              {item.status === "Pending" ? (
                <button onClick={() => payInvoice(item.id, item.amount)} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white font-bold">Pay Now</button>
              ) : (
                <span className="text-emerald-400 font-bold">Paid</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
