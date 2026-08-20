'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SmartWastePage() {
  const [facilities, setFacilities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [facilityCode, setFacilityCode] = useState('');
  const [facilityName, setFacilityName] = useState('');
  const [compactionEfficiencyPct, setCompactionEfficiencyPct] = useState('85.0');
  const [energyRecoveryKwh, setEnergyRecoveryKwh] = useState('200.0');
  const [aiSortingOptimizationMode, setAiSortingOptimizationMode] = useState('NEURAL_VISION_MATERIAL_CLASSIFICATION');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch('/api/smart-waste')
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
      const res = await fetch('/api/smart-waste', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ facilityCode, facilityName, compactionEfficiencyPct, energyRecoveryKwh, aiSortingOptimizationMode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to register facility');

      setFacilities([data, ...facilities]);
      setFacilityCode('');
      setFacilityName('');
      alert('Waste facility registered successfully.');
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
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-lime-500/10 text-lime-400 border border-lime-500/35">
                SMART WASTE & CIRCULAR ECONOMY HUB
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Campus Circular Economy & Waste Grid</h1>
            <p className="text-xs text-slate-400">Monitor compaction efficiency (%), energy recovery (kWh), and AI-driven sorting automation.</p>
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
            <span>♻️</span> Register Waste Facility
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Facility Code / ID</label>
              <input 
                type="text" 
                placeholder="e.g. WASTE-FAC-04" 
                value={facilityCode} 
                onChange={e => setFacilityCode(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-lime-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Facility Name</label>
              <input 
                type="text" 
                placeholder="e.g. Advanced Material Recovery Plant" 
                value={facilityName} 
                onChange={e => setFacilityName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-lime-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Compaction Efficiency (%)</label>
              <input 
                type="number" 
                step="0.1" 
                value={compactionEfficiencyPct} 
                onChange={e => setCompactionEfficiencyPct(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-lime-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Energy Recovery (kWh)</label>
              <input 
                type="number" 
                step="1.0" 
                value={energyRecoveryKwh} 
                onChange={e => setEnergyRecoveryKwh(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-lime-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2 col-span-2">
              <label className="block text-xs font-medium text-slate-400">AI Sorting Mode</label>
              <select 
                value={aiSortingOptimizationMode} 
                onChange={e => setAiSortingOptimizationMode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-lime-500 focus:outline-none"
              >
                <option value="NEURAL_VISION_MATERIAL_CLASSIFICATION">Neural Vision Material Classification</option>
                <option value="BIODIGESTION_THERMAL_PREDICTION">Biodigestion Thermal Prediction</option>
                <option value="ROBOTIC_ISOLATION_PROTOCOL">Robotic Isolation Protocol</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={adding} 
              className="px-6 py-3 rounded-xl bg-lime-500 text-slate-950 font-bold text-xs hover:bg-lime-400 transition-all disabled:opacity-50 shadow-lg shadow-lime-500/20"
            >
              {adding ? 'Registering Facility...' : 'Add Waste Facility →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>♻️</span> Active Waste Facilities ({facilities.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Facility Code & Name</th>
                  <th className="p-4 font-medium">Compaction & Energy</th>
                  <th className="p-4 font-medium text-right">AI Sorting Mode</th>
                </tr>
              </thead>
              <tbody>
                {facilities.map((f) => (
                  <tr key={f.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-white">{f.facilityCode}</p>
                      <p className="text-[10px] text-slate-400">{f.facilityName}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-lime-400 font-semibold">{f.compactionEfficiencyPct}% Compaction</p>
                      <p className="text-[10px] text-slate-400">{f.energyRecoveryKwh} kWh Recovered</p>
                    </td>
                    <td className="p-4 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        f.aiSortingOptimizationMode === 'NEURAL_VISION_MATERIAL_CLASSIFICATION'
                          ? 'bg-lime-500/10 text-lime-400 border-lime-500/35'
                          : f.aiSortingOptimizationMode === 'BIODIGESTION_THERMAL_PREDICTION'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/35'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/35'
                      }`}>
                        {f.aiSortingOptimizationMode}
                      </span>
                    </td>
                  </tr>
                ))}
                {facilities.length === 0 && !loading && (
                  <tr>
                    <td colSpan={3} className="p-6 text-center text-slate-500">
                      No waste facilities registered.
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
