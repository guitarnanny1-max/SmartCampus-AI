'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SmartAlumniPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [alumniName, setAlumniName] = useState('');
  const [graduationYear, setGraduationYear] = useState('2022');
  const [currentDesignation, setCurrentDesignation] = useState('');
  const [endowmentInr, setEndowmentInr] = useState('100000');
  const [networkingStatus, setNetworkingStatus] = useState('ACTIVE');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch('/api/smart-alumni')
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
      const res = await fetch('/api/smart-alumni', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alumniName, graduationYear, currentDesignation, endowmentInr, networkingStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to record alumni entry');

      setRecords([data, ...records]);
      setAlumniName('');
      setCurrentDesignation('');
      alert('Alumni record added successfully.');
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
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/35">
                SMARTCAMPUS AI ALUMNI & ENDOWMENT HUB
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Alumni Network & Endowment Directory</h1>
            <p className="text-xs text-slate-400">Track graduate career trajectories, mentorship rosters, and philanthropic fund contributions in Indian Rupees (₹).</p>
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
            <span>🎓</span> Register Alumni Record & Endowment
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Alumni Full Name</label>
              <input 
                type="text" 
                placeholder="e.g. Natasha Roy" 
                value={alumniName} 
                onChange={e => setAlumniName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Graduation Year</label>
              <input 
                type="number" 
                value={graduationYear} 
                onChange={e => setGraduationYear(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Current Designation & Company</label>
              <input 
                type="text" 
                placeholder="e.g. Engineering Lead at Flipkart" 
                value={currentDesignation} 
                onChange={e => setCurrentDesignation(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Endowment Contribution (₹)</label>
              <input 
                type="number" 
                value={endowmentInr} 
                onChange={e => setEndowmentInr(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Networking & Support Status</label>
              <select 
                value={networkingStatus} 
                onChange={e => setNetworkingStatus(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
              >
                <option value="ACTIVE">Active Alum</option>
                <option value="MENTOR">Campus Mentor</option>
                <option value="BENEFACTOR">Endowment Benefactor</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={adding} 
              className="px-6 py-3 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-all disabled:opacity-50 shadow-lg shadow-amber-500/20"
            >
              {adding ? 'Registering Alum...' : 'Register Alumni Record →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🤝</span> Alumni Directory & Endowments ({records.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Alumnus & Class of</th>
                  <th className="p-4 font-medium">Designation & Endowment</th>
                  <th className="p-4 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-white">{r.alumniName}</p>
                      <p className="text-[10px] text-slate-400">Batch of {r.graduationYear}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-amber-400 font-semibold">₹ {r.endowmentInr.toLocaleString()}</p>
                      <p className="text-[10px] text-slate-400">{r.currentDesignation}</p>
                    </td>
                    <td className="p-4 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        r.networkingStatus === 'BENEFACTOR'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/35'
                          : r.networkingStatus === 'MENTOR'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/35'
                          : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/35'
                      }`}>
                        {r.networkingStatus}
                      </span>
                    </td>
                  </tr>
                ))}
                {records.length === 0 && !loading && (
                  <tr>
                    <td colSpan={3} className="p-6 text-center text-slate-500">
                      No alumni records found.
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
