export const revalidate = 0;
export const dynamic = 'force-dynamic';
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SmartStaffHealthPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [staffName, setStaffName] = useState('');
  const [department, setDepartment] = useState('');
  const [stepsToday, setStepsToday] = useState('8500');
  const [heartRateAvg, setHeartRateAvg] = useState('72 bpm');
  const [wellnessStatus, setWellnessStatus] = useState('EXCELLENT');
  const [socialMediaId, setSocialMediaId] = useState('');
  const [insuranceSuggestion, setInsuranceSuggestion] = useState('Standard Health Plan');
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    fetch('/api/smart-staff-health')
      .then(res => res.json())
      .then(data => { setRecords(Array.isArray(data) ? data : []); setLoading(false); });
  }, []);

  const handleSyncMobileWalk = async (e: React.FormEvent) => {
    e.preventDefault();
    setSyncing(true);
    try {
      const res = await fetch('/api/smart-staff-health', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staffName, department, stepsToday, heartRateAvg, wellnessStatus, socialMediaId, insuranceSuggestion }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setRecords([data, ...records].sort((a, b) => b.stepsToday - a.stepsToday));
      alert('Data synced with insurance profile!');
    } catch (err: any) { alert(err.message); } finally { setSyncing(false); }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h1 className="text-2xl font-extrabold text-white">Staff Health & Insurance Hub</h1>
          <p className="text-xs text-slate-400">Manage wellness, social profiles, and insurance suggestions.</p>
        </div>

        <form onSubmit={handleSyncMobileWalk} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <input type="text" placeholder="Staff Name" value={staffName} onChange={e => setStaffName(e.target.value)} required className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white" />
             <input type="text" placeholder="Social Media ID (@handle)" value={socialMediaId} onChange={e => setSocialMediaId(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white" />
             <input type="text" placeholder="Insurance Suggestion (e.g. Premium Health)" value={insuranceSuggestion} onChange={e => setInsuranceSuggestion(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white" />
          </div>
          <button type="submit" disabled={syncing} className="px-4 py-2 bg-teal-500 rounded-xl text-xs font-bold text-slate-950 hover:bg-teal-400">Sync Data</button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {records.map((r: any) => (
            <div key={r.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-md">
              <h4 className="text-sm font-bold text-white">{r.staffName}</h4>
              <div className="flex gap-2 mt-1">
                 {r.socialMediaId && <span className="text-[10px] text-teal-400">@{r.socialMediaId}</span>}
                 {r.insuranceSuggestion && <span className="text-[10px] text-amber-400">• {r.insuranceSuggestion}</span>}
              </div>
              <p className="text-[11px] text-slate-400 mt-2">{r.stepsToday} Steps • {r.wellnessStatus}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
