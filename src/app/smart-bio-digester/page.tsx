'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SmartBioDigesterPage() {
  const [digesters, setDigesters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [digesterCode, setDigesterCode] = useState('');
  const [facilityName, setFacilityName] = useState('');
  const [methaneCaptureM3, setMethaneCaptureM3] = useState('45.5');
  const [organicFeedstockKg, setOrganicFeedstockKg] = useState('350.0');
  const [microbialHealth, setMicrobialHealth] = useState('OPTIMAL_ACTIVITY');
  const [aiBiogasOptimization, setAiBiogasOptimization] = useState('MAX_YIELD_SCHEDULING');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch('/api/smart-bio-digester')
      .then(res => res.json())
      .then(data => {
        setDigesters(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAddDigester = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);

    try {
      const res = await fetch('/api/smart-bio-digester', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ digesterCode, facilityName, methaneCaptureM3, organicFeedstockKg, microbialHealth, aiBiogasOptimization }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to register bio-digester');

      setDigesters([data, ...digesters]);
      setDigesterCode('');
      setFacilityName('');
      alert('Smart bio-digester registered successfully.');
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
                SMART BIO-DIGESTER & WASTE-TO-ENERGY HUB
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Organic Waste & Biogas Energy</h1>
            <p className="text-xs text-slate-400">Monitor methane capture ($m^3$), organic feedstock (kg), microbial culture health, and AI energy scheduling.</p>
          </div>
          <Link 
            href="/?school=dps" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleAddDigester} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>♻️</span> Register Bio-Digester Station
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Digester Code / ID</label>
              <input 
                type="text" 
                placeholder="e.g. BIO-DIGEST-04" 
                value={digesterCode} 
                onChange={e => setDigesterCode(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Facility Name</label>
              <input 
                type="text" 
                placeholder="e.g. Campus Central Cafeteria Waste Plant" 
                value={facilityName} 
                onChange={e => setFacilityName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Methane Capture ($m^3$)</label>
              <input 
                type="number" 
                step="0.1" 
                value={methaneCaptureM3} 
                onChange={e => setMethaneCaptureM3(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Feedstock (kg)</label>
              <input 
                type="number" 
                step="0.1" 
                value={organicFeedstockKg} 
                onChange={e => setOrganicFeedstockKg(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Microbial Health</label>
              <select 
                value={microbialHealth} 
                onChange={e => setMicrobialHealth(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="OPTIMAL_ACTIVITY">Optimal Activity</option>
                <option value="HIGH_CONVERSION">High Conversion</option>
                <option value="STABLE_CULTURE">Stable Culture</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">AI Optimization</label>
              <select 
                value={aiBiogasOptimization} 
                onChange={e => setAiBiogasOptimization(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="MAX_YIELD_SCHEDULING">Max Yield Scheduling</option>
                <option value="FEEDSTOCK_BALANCING">Feedstock Balancing</option>
                <option value="RAPID_FERMENTATION">Rapid Fermentation</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={adding} 
              className="px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all disabled:opacity-50 shadow-lg shadow-cyan-500/20"
            >
              {adding ? 'Registering Station...' : 'Add Bio-Digester Hub →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>⚡</span> Active Bio-Digester Hubs ({digesters.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Digester Code & Name</th>
                  <th className="p-4 font-medium">Methane & Feedstock</th>
                  <th className="p-4 font-medium">Microbial Health</th>
                  <th className="p-4 font-medium text-right">AI Biogas Mode</th>
                </tr>
              </thead>
              <tbody>
                {digesters.map((d) => (
                  <tr key={d.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-white">{d.digesterCode}</p>
                      <p className="text-[10px] text-slate-400">{d.facilityName}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-cyan-400 font-semibold">{d.methaneCaptureM3} $m^3$ Methane</p>
                      <p className="text-[10px] text-slate-400">{d.organicFeedstockKg} kg Feedstock</p>
                    </td>
                    <td className="p-4 font-semibold text-slate-300">
                      {d.microbialHealth}
                    </td>
                    <td className="p-4 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        d.aiBiogasOptimization === 'MAX_YIELD_SCHEDULING'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/35'
                          : d.aiBiogasOptimization === 'FEEDSTOCK_BALANCING'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/35'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/35'
                      }`}>
                        {d.aiBiogasOptimization}
                      </span>
                    </td>
                  </tr>
                ))}
                {digesters.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-500">
                      No bio-digester stations registered.
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
