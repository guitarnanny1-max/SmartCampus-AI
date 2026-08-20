'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SmartGlobalBoardroomPage() {
  const [regions, setRegions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [regionCode, setRegionCode] = useState('');
  const [regionName, setRegionName] = useState('');
  const [totalEnrolledStudents, setTotalEnrolledStudents] = useState('15000');
  const [treasuryRevenueUsd, setTreasuryRevenueUsd] = useState('20000000');
  const [aiComputeEfficiencyPercent, setAiComputeEfficiencyPercent] = useState('98.5');
  const [boardroomStatus, setBoardroomStatus] = useState('GLOBAL_SYNC');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch('/api/smart-global-boardroom')
      .then(res => res.json())
      .then(data => {
        setRegions(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAddRegion = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);

    try {
      const res = await fetch('/api/smart-global-boardroom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ regionCode, regionName, totalEnrolledStudents, treasuryRevenueUsd, aiComputeEfficiencyPercent, boardroomStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to register region');

      setRegions([data, ...regions]);
      setRegionCode('');
      setRegionName('');
      alert('Global regional campus registered successfully.');
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
                FEDERATED MULTI-CAMPUS GLOBAL ANALYTICS & BOARDROOM HUB
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Global Institutional Boardroom Grid</h1>
            <p className="text-xs text-slate-400">Monitor cross-campus enrollments, consolidated treasury revenues, and AI compute efficiency.</p>
          </div>
          <Link 
            href="/?school=dps" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleAddRegion} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🌐</span> Register Global Regional Campus Branch
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Region Code / ID</label>
              <input 
                type="text" 
                placeholder="e.g. LATAM-BRA-04" 
                value={regionCode} 
                onChange={e => setRegionCode(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Regional Branch Name</label>
              <input 
                type="text" 
                placeholder="e.g. South American Tech & Sustainability Campus (São Paulo)" 
                value={regionName} 
                onChange={e => setRegionName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Enrolled Students</label>
              <input 
                type="number" 
                value={totalEnrolledStudents} 
                onChange={e => setTotalEnrolledStudents(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Treasury Revenue (USD)</label>
              <input 
                type="number" 
                value={treasuryRevenueUsd} 
                onChange={e => setTreasuryRevenueUsd(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">AI Efficiency (%)</label>
              <input 
                type="number" 
                step="0.1" 
                value={aiComputeEfficiencyPercent} 
                onChange={e => setAiComputeEfficiencyPercent(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Boardroom Status</label>
              <select 
                value={boardroomStatus} 
                onChange={e => setBoardroomStatus(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="GLOBAL_SYNC">Global Sync Active</option>
                <option value="OPTIMIZING">Optimizing</option>
                <option value="AUDITING">Auditing</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={adding} 
              className="px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-all disabled:opacity-50 shadow-lg shadow-emerald-500/20"
            >
              {adding ? 'Registering Branch...' : 'Add Regional Campus →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🏛️</span> Global Regional Campuses ({regions.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Region Code & Name</th>
                  <th className="p-4 font-medium">Students & Treasury</th>
                  <th className="p-4 font-medium">AI Efficiency</th>
                  <th className="p-4 font-medium text-right">Boardroom Status</th>
                </tr>
              </thead>
              <tbody>
                {regions.map((r) => (
                  <tr key={r.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-white">{r.regionCode}</p>
                      <p className="text-[10px] text-slate-400">{r.regionName}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-emerald-400 font-semibold">{r.totalEnrolledStudents.toLocaleString()} Students</p>
                      <p className="text-[10px] text-slate-400">${r.treasuryRevenueUsd.toLocaleString()} USD</p>
                    </td>
                    <td className="p-4 font-semibold text-slate-300">
                      {r.aiComputeEfficiencyPercent}% Efficiency
                    </td>
                    <td className="p-4 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        r.boardroomStatus === 'GLOBAL_SYNC'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/35'
                          : r.boardroomStatus === 'OPTIMIZING'
                          ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/35'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/35'
                      }`}>
                        {r.boardroomStatus}
                      </span>
                    </td>
                  </tr>
                ))}
                {regions.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-500">
                      No global boardroom regional branches registered.
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
