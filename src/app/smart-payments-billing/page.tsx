'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SmartPaymentsBillingPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [payerName, setPayerName] = useState('');
  const [amountInr, setAmountInr] = useState('75000');
  const [paymentGateway, setPaymentGateway] = useState('Razorpay UPI');
  const [billingStatus, setBillingStatus] = useState('SUCCESSFUL');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch('/api/smart-payments-billing')
      .then(res => res.json())
      .then(data => {
        setRecords(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);

    try {
      const res = await fetch('/api/smart-payments-billing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceNumber, payerName, amountInr, paymentGateway, billingStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to record transaction');

      setRecords([data, ...records]);
      setInvoiceNumber('');
      setPayerName('');
      alert('Billing transaction recorded successfully.');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/35">
                SMARTCAMPUS AI PAYMENTS & BILLING HUB
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Institutional Payment & Gateway Ledger</h1>
            <p className="text-xs text-slate-400">Track multi-gateway fee collections, automated invoices, and transaction statuses in Indian Rupees (₹).</p>
          </div>
          <Link 
            href="/smartcampus-ai" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to SmartCampus Portal
          </Link>
        </div>

        <form onSubmit={handleAddRecord} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>💳</span> Record New Payment & Invoice
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Invoice Reference Number</label>
              <input 
                type="text" 
                placeholder="e.g. INV-2026-089" 
                value={invoiceNumber} 
                onChange={e => setInvoiceNumber(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Payer Full Name (Student / Parent)</label>
              <input 
                type="text" 
                placeholder="e.g. Rajesh Sharma" 
                value={payerName} 
                onChange={e => setPayerName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Amount (₹)</label>
              <input 
                type="number" 
                value={amountInr} 
                onChange={e => setAmountInr(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Payment Gateway</label>
              <select 
                value={paymentGateway} 
                onChange={e => setPaymentGateway(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="Razorpay UPI">Razorpay UPI</option>
                <option value="NetBanking (HDFC)">NetBanking (HDFC)</option>
                <option value="Credit Card (Visa)">Credit Card (Visa/Mastercard)</option>
                <option value="Direct Bank Transfer (NEFT)">Direct NEFT Transfer</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Billing Status</label>
              <select 
                value={billingStatus} 
                onChange={e => setBillingStatus(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="SUCCESSFUL">Successful</option>
                <option value="PENDING">Pending Verification</option>
                <option value="FAILED">Failed Transaction</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={adding} 
              className="px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-all disabled:opacity-50 shadow-lg shadow-emerald-500/20"
            >
              {adding ? 'Recording Transaction...' : 'Record Payment →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🧾</span> Institutional Payment Ledgers ({records.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Invoice & Payer</th>
                  <th className="p-4 font-medium">Gateway & Amount</th>
                  <th className="p-4 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-white">{r.invoiceNumber}</p>
                      <p className="text-[10px] text-slate-400">{r.payerName}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-emerald-400 font-semibold">₹ {r.amountInr.toLocaleString()}</p>
                      <p className="text-[10px] text-slate-400">{r.paymentGateway}</p>
                    </td>
                    <td className="p-4 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        r.billingStatus === 'SUCCESSFUL'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/35'
                          : r.billingStatus === 'PENDING'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/35'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/35'
                      }`}>
                        {r.billingStatus}
                      </span>
                    </td>
                  </tr>
                ))}
                {records.length === 0 && !loading && (
                  <tr>
                    <td colSpan={3} className="p-6 text-center text-slate-500">
                      No billing records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
