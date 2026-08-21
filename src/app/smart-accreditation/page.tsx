export const revalidate = 0;
export const dynamic = 'force-dynamic';
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SmartAccreditationPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [criterionCode, setCriterionCode] = useState('');
  const [criterionTitle, setCriterionTitle] = useState('');
  const [compliancePercent, setCompliancePercent] = useState('90.0');
  const [reviewStatus, setReviewStatus] = useState('IN_PROGRESS');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch('/api/smart-accreditation')
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
      const res = await fetch('/api/smart-accreditation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ criterionCode, criterionTitle, compliancePercent, reviewStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add accreditation record');

      setRecords([data, ...records]);
      setCriterionCode('');
      setCriterionTitle('');
      alert('Accreditation criterion added successfully.');
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
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/35">
                SMARTCAMPUS AI NAAC & NBA ACCREDITATION HUB
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Accreditation & Compliance Dashboard</h1>
            <p className="text-xs text-slate-400">Monitor NAAC criteria compliance scores, evidentiary documentation, and internal audit statuses.</p>
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
            <span>📑</span> Add Accreditation Criterion / Metric
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Criterion Code</label>
              <input 
                type="text" 
                placeholder="e.g. NAAC-C6" 
                value={criterionCode} 
                onChange={e => setCriterionCode(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Criterion Title / Description</label>
              <input 
                type="text" 
                placeholder="e.g. Governance, Leadership & Management" 
                value={criterionTitle} 
                onChange={e => setCriterionTitle(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Compliance Score (%)</label>
              <input 
                type="number" 
                step="0.1" 
                value={compliancePercent} 
                onChange={e => setCompliancePercent(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Audit / Review Status</label>
              <select 
                value={reviewStatus} 
                onChange={e => setReviewStatus(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="IN_PROGRESS">In Progress</option>
                <option value="VERIFIED">Verified & Approved</option>
                <option value="PENDING_AUDIT">Pending External Audit</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={adding} 
              className="px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all disabled:opacity-50 shadow-lg shadow-cyan-500/20"
            >
              {adding ? 'Adding Criterion...' : 'Add Criterion Record →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>📊</span> NAAC & NBA Compliance Benchmarks ({records.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Criterion Code & Description</th>
                  <th className="p-4 font-medium">Compliance Score</th>
                  <th className="p-4 font-medium text-right">Audit Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r: any) => (
                  <tr key={r.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-white">{r.criterionCode}</p>
                      <p className="text-[10px] text-slate-400">{r.criterionTitle}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-cyan-400 font-semibold">{r.compliancePercent}% Compliant</p>
                    </td>
                    <td className="p-4 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        r.reviewStatus === 'VERIFIED'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/35'
                          : r.reviewStatus === 'IN_PROGRESS'
                          ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/35'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/35'
                      }`}>
                        {r.reviewStatus}
                      </span>
                    </td>
                  </tr>
                ))}
                {records.length === 0 && !loading && (
                  <tr>
                    <td colSpan={3} className="p-6 text-center text-slate-500">
                      No accreditation records found.
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
