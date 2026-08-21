export const revalidate = 0;
export const dynamic = 'force-dynamic';
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AlumniPage() {
  const [endowments, setEndowments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [donorName, setDonorName] = useState('');
  const [gradYear, setGradYear] = useState('');
  const [amount, setAmount] = useState('');
  const [campaign, setCampaign] = useState('AI & Robotics Research Lab Fund');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch('/api/alumni')
      .then(res => res.json())
      .then(data => {
        setEndowments(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const totalRaised = endowments.reduce((acc: any, e: any) => acc + (e.amount || 0), 0);

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/alumni', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ donorName, gradYear, amount, campaign }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to record contribution');

      setEndowments([data, ...endowments]);
      setDonorName('');
      setGradYear('');
      setAmount('');
      alert('Alumni endowment contribution recorded successfully.');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/35">
                INSTITUTIONAL ADVANCEMENT
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Alumni Network & Capital Endowments</h1>
            <p className="text-xs text-slate-400">Track alumni career achievements, philanthropic donations, and capital fundraising campaigns.</p>
          </div>
          <Link 
            href="/?school=dps" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-2">
          <span className="text-xs font-mono text-slate-400">Total Capital Endowments Raised</span>
          <div className="text-3xl font-extrabold font-mono text-emerald-400">
            ${totalRaised.toLocaleString()} <span className="text-sm font-normal text-slate-400">USD</span>
          </div>
          <p className="text-[11px] text-slate-500">Committed alumni gifts powering research grants and infrastructure modernization.</p>
        </div>

        <form onSubmit={handleDonate} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🎓</span> Record Alumni Endowment / Gift
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Donor Name & Title</label>
              <input 
                type="text" 
                placeholder="e.g. Sarah Connor (CTO, Cyberdyne)" 
                value={donorName} 
                onChange={e => setDonorName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Graduation Year</label>
              <input 
                type="number" 
                placeholder="e.g. 2014" 
                value={gradYear} 
                onChange={e => setGradYear(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Donation Amount ($ USD)</label>
              <input 
                type="number" 
                placeholder="e.g. 75000" 
                value={amount} 
                onChange={e => setAmount(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono text-cyan-400 focus:border-cyan-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-400">Fundraising Campaign</label>
            <input 
              type="text" 
              placeholder="e.g. AI & Robotics Research Lab Fund" 
              value={campaign} 
              onChange={e => setCampaign(e.target.value)} 
              required 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
            />
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={submitting} 
              className="px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all disabled:opacity-50 shadow-lg shadow-cyan-500/20"
            >
              {submitting ? 'Recording Gift...' : 'Record Contribution →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🏛️</span> Endowment Contributions Archive ({endowments.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Donor</th>
                  <th className="p-4 font-medium">Grad Year</th>
                  <th className="p-4 font-medium">Campaign</th>
                  <th className="p-4 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {endowments.map((e: any) => (
                  <tr key={e.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4 font-semibold text-white">{e.donorName}</td>
                    <td className="p-4 font-mono text-cyan-400">{e.gradYear}</td>
                    <td className="p-4 text-slate-300">{e.campaign}</td>
                    <td className="p-4 text-right font-mono font-bold text-emerald-400">${e.amount.toLocaleString()}</td>
                  </tr>
                ))}
                {endowments.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-500">
                      No alumni endowments recorded.
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
