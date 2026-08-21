export const revalidate = 0;
export const dynamic = 'force-dynamic';
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SmartCarbonCapturePage() {
  const [facilities, setFacilities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [facilityCode, setFacilityCode] = useState('');
  const [locationName, setLocationName] = useState('');
  const [co2CapturedTons, setCo2CapturedTons] = useState('15.0');
  const [sorbentEfficiencyPct, setSorbentEfficiencyPct] = useState('95.0');
  const [purityLevelPct, setPurityLevelPct] = useState('99.0');
  const [aiCaptureOptimization, setAiCaptureOptimization] = useState('DYNAMIC_SORBENT_REGENERATION');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch('/api/smart-carbon-capture')
      .then(res => res.json())
      .then(data => {
        setFacilities(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAddFacility = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);

    try {
      const res = await fetch('/api/smart-carbon-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ facilityCode, locationName, co2CapturedTons, sorbentEfficiencyPct, purityLevelPct, aiCaptureOptimization }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to register facility');

      setFacilities([data, ...facilities]);
      setFacilityCode('');
      setLocationName('');
      alert('Smart carbon capture facility registered successfully.');
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
                SMART CARBON CAPTURE & DAC HUB
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Direct Air Capture & Sequestration</h1>
            <p className="text-xs text-slate-400">Monitor captured $CO_2$ tonnage, sorbent efficiency (%), gas purity (%), and AI adsorption scheduling.</p>
          </div>
          <Link 
            href="/?school=dps" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleAddFacility} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🌱</span> Register DAC Unit
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Facility Code / ID</label>
              <input 
                type="text" 
                placeholder="e.g. DAC-HUB-04" 
                value={facilityCode} 
                onChange={e => setFacilityCode(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Location Name</label>
              <input 
                type="text" 
                placeholder="e.g. Business School Roof Scrubber" 
                value={locationName} 
                onChange={e => setLocationName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">$CO_2$ Captured (Tons)</label>
              <input 
                type="number" 
                step="0.1" 
                value={co2CapturedTons} 
                onChange={e => setCo2CapturedTons(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Sorbent Efficiency (%)</label>
              <input 
                type="number" 
                step="0.1" 
                value={sorbentEfficiencyPct} 
                onChange={e => setSorbentEfficiencyPct(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Purity Level (%)</label>
              <input 
                type="number" 
                step="0.1" 
                value={purityLevelPct} 
                onChange={e => setPurityLevelPct(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">AI Optimization Mode</label>
              <select 
                value={aiCaptureOptimization} 
                onChange={e => setAiCaptureOptimization(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="DYNAMIC_SORBENT_REGENERATION">Dynamic Sorbent Regeneration</option>
                <option value="WEATHER_SYNCED_AIRFLOW">Weather Synced Airflow</option>
                <option value="PEAK_WIND_CAPTURE">Peak Wind Capture</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={adding} 
              className="px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-all disabled:opacity-50 shadow-lg shadow-emerald-500/20"
            >
              {adding ? 'Registering Facility...' : 'Add DAC Facility →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>⚡</span> Active DAC Facilities ({facilities.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Facility Code & Location</th>
                  <th className="p-4 font-medium">$CO_2$ Captured & Efficiency</th>
                  <th className="p-4 font-medium">Purity Level (%)</th>
                  <th className="p-4 font-medium text-right">AI Capture Mode</th>
                </tr>
              </thead>
              <tbody>
                {facilities.map((f: any) => (
                  <tr key={f.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-white">{f.facilityCode}</p>
                      <p className="text-[10px] text-slate-400">{f.locationName}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-emerald-400 font-semibold">{f.co2CapturedTons} Tons $CO_2$</p>
                      <p className="text-[10px] text-slate-400">{f.sorbentEfficiencyPct}% Sorbent Efficiency</p>
                    </td>
                    <td className="p-4 font-semibold text-slate-300">
                      {f.purityLevelPct}% Purity
                    </td>
                    <td className="p-4 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        f.aiCaptureOptimization === 'DYNAMIC_SORBENT_REGENERATION'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/35'
                          : f.aiCaptureOptimization === 'WEATHER_SYNCED_AIRFLOW'
                          ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/35'
                          : 'bg-blue-500/10 text-blue-400 border-blue-500/35'
                      }`}>
                        {f.aiCaptureOptimization}
                      </span>
                    </td>
                  </tr>
                ))}
                {facilities.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-500">
                      No carbon capture facilities registered.
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
