'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SmartHydrogenFuelCellPage() {
  const [fuelCells, setFuelCells] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fuelCellCode, setFuelCellCode] = useState('');
  const [stationName, setStationName] = useState('');
  const [hydrogenPressureBar, setHydrogenPressureBar] = useState('350.0');
  const [powerGenerationKw, setPowerGenerationKw] = useState('75.0');
  const [electrolyzerStatus, setElectrolyzerStatus] = useState('ACTIVE_GENERATION');
  const [aiStorageOptimization, setAiStorageOptimization] = useState('BALANCED_PEAK_SHAVING');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch('/api/smart-hydrogen-fuel-cell')
      .then(res => res.json())
      .then(data => {
        setFuelCells(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAddFuelCell = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);

    try {
      const res = await fetch('/api/smart-hydrogen-fuel-cell', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fuelCellCode, stationName, hydrogenPressureBar, powerGenerationKw, electrolyzerStatus, aiStorageOptimization }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to register hydrogen station');

      setFuelCells([data, ...fuelCells]);
      setFuelCellCode('');
      setStationName('');
      alert('Smart hydrogen fuel cell station registered successfully.');
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
                SMART HYDROGEN & CLEAN ENERGY STORAGE HUB
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Hydrogen Fuel Cells & Energy Reserves</h1>
            <p className="text-xs text-slate-400">Monitor tank pressures (bar), clean generation output (kW), electrolyzer health, and AI storage schedules.</p>
          </div>
          <Link 
            href="/?school=dps" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleAddFuelCell} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🧪</span> Register Hydrogen Fuel Cell Station
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Fuel Cell Code / ID</label>
              <input 
                type="text" 
                placeholder="e.g. H2-STATION-04" 
                value={fuelCellCode} 
                onChange={e => setFuelCellCode(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Station Name</label>
              <input 
                type="text" 
                placeholder="e.g. Bio-Campus Clean Hydrogen Plant" 
                value={stationName} 
                onChange={e => setStationName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Pressure (bar)</label>
              <input 
                type="number" 
                step="0.1" 
                value={hydrogenPressureBar} 
                onChange={e => setHydrogenPressureBar(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Power Output (kW)</label>
              <input 
                type="number" 
                step="0.1" 
                value={powerGenerationKw} 
                onChange={e => setPowerGenerationKw(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Electrolyzer Status</label>
              <select 
                value={electrolyzerStatus} 
                onChange={e => setElectrolyzerStatus(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="ACTIVE_GENERATION">Active Generation</option>
                <option value="STANDBY_RESERVE">Standby Reserve</option>
                <option value="MAINTENANCE_PURGE">Maintenance Purge</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">AI Optimization</label>
              <select 
                value={aiStorageOptimization} 
                onChange={e => setAiStorageOptimization(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="BALANCED_PEAK_SHAVING">Balanced Peak Shaving</option>
                <option value="MAX_CAPACITY_HOLD">Max Capacity Hold</option>
                <option value="RAPID_DISPATCH">Rapid Dispatch</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={adding} 
              className="px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all disabled:opacity-50 shadow-lg shadow-cyan-500/20"
            >
              {adding ? 'Registering Station...' : 'Add Hydrogen Fuel Cell →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🔋</span> Active Hydrogen Fuel Cell Hubs ({fuelCells.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Station Code & Name</th>
                  <th className="p-4 font-medium">Pressure & Power</th>
                  <th className="p-4 font-medium">Electrolyzer Status</th>
                  <th className="p-4 font-medium text-right">AI Storage Mode</th>
                </tr>
              </thead>
              <tbody>
                {fuelCells.map((fc) => (
                  <tr key={fc.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-white">{fc.fuelCellCode}</p>
                      <p className="text-[10px] text-slate-400">{fc.stationName}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-cyan-400 font-semibold">{fc.hydrogenPressureBar} bar pressure</p>
                      <p className="text-[10px] text-slate-400">{fc.powerGenerationKw} kW Generation</p>
                    </td>
                    <td className="p-4 font-semibold text-slate-300">
                      {fc.electrolyzerStatus}
                    </td>
                    <td className="p-4 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        fc.aiStorageOptimization === 'BALANCED_PEAK_SHAVING'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/35'
                          : fc.aiStorageOptimization === 'MAX_CAPACITY_HOLD'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/35'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/35'
                      }`}>
                        {fc.aiStorageOptimization}
                      </span>
                    </td>
                  </tr>
                ))}
                {fuelCells.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-500">
                      No hydrogen fuel cells registered.
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
