export const revalidate = 0;
export const dynamic = 'force-dynamic';
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SmartSubscriptionPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [planName, setPlanName] = useState('');
  const [billingCycle, setBillingCycle] = useState('Annual');
  const [price, setPrice] = useState('$1,999/yr');
  const [renewalDate, setRenewalDate] = useState('August 16, 2027');
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    fetch('/api/smart-subscription')
      .then(res => res.json())
      .then(data => {
        setRecords(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAddSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribing(true);

    try {
      const res = await fetch('/api/smart-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planName, billingCycle, price, renewalDate }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add subscription plan');

      setRecords([data, ...records]);
      setPlanName('');
      setPrice('');
      alert('Subscription plan updated and activated successfully.');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/35">
                SMARTCAMPUS AI SUBSCRIPTION & BILLING HUB
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Subscription Management & Renewals</h1>
            <p className="text-xs text-slate-400">Monitor active tier licenses, schedule automated renewals, and manage institutional billing addons.</p>
          </div>
          <Link 
            href="/smartcampus-ai" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to SmartCampus Portal
          </Link>
        </div>

        <form onSubmit={handleAddSubscription} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>💳</span> Add / Upgrade Subscription Tier
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Plan / Addon Name</label>
              <input 
                type="text" 
                placeholder="e.g. AI Proctoring & Analytics Add-on" 
                value={planName} 
                onChange={e => setPlanName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Billing Cycle</label>
              <select 
                value={billingCycle} 
                onChange={e => setBillingCycle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="Annual">Annual Billing</option>
                <option value="Monthly">Monthly Billing</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Price & Currency</label>
              <input 
                type="text" 
                placeholder="e.g. $1,499/yr" 
                value={price} 
                onChange={e => setPrice(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Next Renewal Date</label>
              <input 
                type="text" 
                placeholder="e.g. August 16, 2027" 
                value={renewalDate} 
                onChange={e => setRenewalDate(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={subscribing} 
              className="px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all disabled:opacity-50 shadow-lg shadow-cyan-500/20"
            >
              {subscribing ? 'Processing Subscription...' : 'Activate Subscription Plan →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>📦</span> Active Subscriptions & Licenses ({records.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {records.map((r: any) => (
              <div key={r.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-md relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                      {r.billingCycle} • {r.price}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-2">{r.planName}</h4>
                    <p className="text-[11px] text-slate-400">Renews on: {r.renewalDate}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/35">
                    {r.status}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-800/80 flex justify-between items-center text-[10px] text-slate-400">
                  <span>Billing Status: <strong className="text-emerald-400">Auto-Renewing</strong></span>
                  <span className="text-cyan-400 font-semibold cursor-pointer hover:underline">Manage Invoice ↗</span>
                </div>
              </div>
            ))}
            {records.length === 0 && !loading && (
              <div className="col-span-2 p-6 text-center text-slate-500">
                No subscription records found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
