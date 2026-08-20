'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SmartPlacementPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentName, setStudentName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [packageCpaInLakhs, setPackageCpaInLakhs] = useState('18.0');
  const [jobRole, setJobRole] = useState('');
  const [offerStatus, setOfferStatus] = useState('ACCEPTED');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch('/api/smart-placement')
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
      const res = await fetch('/api/smart-placement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentName, companyName, packageCpaInLakhs, jobRole, offerStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to record placement offer');

      setRecords([data, ...records]);
      setStudentName('');
      setCompanyName('');
      setJobRole('');
      alert('Placement offer registered successfully.');
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
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-pink-500/10 text-pink-400 border border-pink-500/35">
                SMARTCAMPUS AI PLACEMENT & RECRUITMENT HUB
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Campus Corporate Placements & CTC Tracker</h1>
            <p className="text-xs text-slate-400">Monitor top-tier recruitment drives, annual CTC packages in Lakhs (₹), and student job offer statuses.</p>
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
            <span>💼</span> Register Corporate Placement Offer
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Student Full Name</label>
              <input 
                type="text" 
                placeholder="e.g. Tanvi Kulkarni" 
                value={studentName} 
                onChange={e => setStudentName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-pink-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Recruiting Company Name</label>
              <input 
                type="text" 
                placeholder="e.g. Amazon India" 
                value={companyName} 
                onChange={e => setCompanyName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-pink-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Job Role / Designation</label>
              <input 
                type="text" 
                placeholder="e.g. SDE-2 Backend" 
                value={jobRole} 
                onChange={e => setJobRole(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-pink-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">CTC Package (₹ Lakhs)</label>
              <input 
                type="number" 
                step="0.1" 
                value={packageCpaInLakhs} 
                onChange={e => setPackageCpaInLakhs(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-pink-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Offer Status</label>
              <select 
                value={offerStatus} 
                onChange={e => setOfferStatus(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-pink-500 focus:outline-none"
              >
                <option value="ACCEPTED">Offer Accepted</option>
                <option value="OFFERED">Offer Extended</option>
                <option value="INTERVIEWING">Interviewing / Round 3</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={adding} 
              className="px-6 py-3 rounded-xl bg-pink-500 text-slate-950 font-bold text-xs hover:bg-pink-400 transition-all disabled:opacity-50 shadow-lg shadow-pink-500/20"
            >
              {adding ? 'Registering Offer...' : 'Register Placement Offer →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🏆</span> Campus Recruitment & Offer Ledger ({records.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Student & Company</th>
                  <th className="p-4 font-medium">Role & CTC Package</th>
                  <th className="p-4 font-medium text-right">Offer Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-white">{r.studentName}</p>
                      <p className="text-[10px] text-slate-400">{r.companyName}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-pink-400 font-semibold">₹ {r.packageCpaInLakhs} Lakhs CTC</p>
                      <p className="text-[10px] text-slate-400">{r.jobRole}</p>
                    </td>
                    <td className="p-4 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        r.offerStatus === 'ACCEPTED'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/35'
                          : r.offerStatus === 'OFFERED'
                          ? 'bg-pink-500/10 text-pink-400 border-pink-500/35'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/35'
                      }`}>
                        {r.offerStatus}
                      </span>
                    </td>
                  </tr>
                ))}
                {records.length === 0 && !loading && (
                  <tr>
                    <td colSpan={3} className="p-6 text-center text-slate-500">
                      No placement records found.
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
