'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SmartPaymentExtensionPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [amountPaid, setAmountPaid] = useState('$4,999.00');
  const [extensionPeriod, setExtensionPeriod] = useState('+1 Year');
  const [paymentGateway, setPaymentGateway] = useState('Stripe Webhook API');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetch('/api/smart-payment-extension')
      .then(res => res.json())
      .then(data => {
        setRecords(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSimulatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    try {
      const res = await fetch('/api/smart-payment-extension', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amountPaid, extensionPeriod, paymentGateway }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to process webhook payment');

      setRecords([data, ...records]);
      alert('Payment webhook received successfully. Subscription automatically extended!');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/35">
                SMARTCAMPUS AI AUTOMATED PAYMENT EXTENSION HUB
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Auto-Extension on Payment Received</h1>
            <p className="text-xs text-slate-400">Simulate or receive automated gateway webhooks to instantly extend subscription expiration dates.</p>
          </div>
          <Link 
            href="/smartcampus-ai" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to SmartCampus Portal
          </Link>
        </div>

        <form onSubmit={handleSimulatePayment} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>⚡</span> Simulate Incoming Payment Webhook
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Amount Received</label>
              <input 
                type="text" 
                value={amountPaid} 
                onChange={e => setAmountPaid(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Extension Period</label>
              <select 
                value={extensionPeriod} 
                onChange={e => setExtensionPeriod(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="+1 Year">+1 Year (Annual Renewal)</option>
                <option value="+1 Month">+1 Month (Monthly Renewal)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Payment Gateway</label>
              <select 
                value={paymentGateway} 
                onChange={e => setPaymentGateway(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="Stripe Webhook API">Stripe Webhook API</option>
                <option value="Razorpay Instant Hook">Razorpay Instant Hook</option>
                <option value="Wire Transfer Auto-Verify">Wire Transfer Auto-Verify</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={processing} 
              className="px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-all disabled:opacity-50 shadow-lg shadow-emerald-500/20"
            >
              {processing ? 'Processing Webhook...' : 'Simulate Payment & Auto-Extend License →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>📜</span> Payment Extension Audit Log ({records.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {records.map((r) => (
              <div key={r.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-md relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      {r.invoiceId} • {r.amountPaid}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-2">Extended {r.extensionPeriod}</h4>
                    <p className="text-[11px] text-slate-400">New Renewal Date: <strong className="text-white">{r.newRenewalDate}</strong></p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/35">
                    {r.status}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-800/80 flex justify-between items-center text-[10px] text-slate-400">
                  <span>Gateway: <strong className="text-emerald-400">{r.paymentGateway}</strong></span>
                  <span className="text-emerald-400 font-semibold cursor-pointer hover:underline">Download Invoice PDF ↗</span>
                </div>
              </div>
            ))}
            {records.length === 0 && !loading && (
              <div className="col-span-2 p-6 text-center text-slate-500">
                No payment extension logs found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
