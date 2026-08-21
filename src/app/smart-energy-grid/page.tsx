export const revalidate = 0;
export const dynamic = 'force-dynamic';
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SmartEnergyGridPage() {
  const [grids, setGrids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [gridZone, setGridZone] = useState('');
  const [renewableSource, setRenewableSource] = useState('');
  const [energyOutputKw, setEnergyOutputKw] = useState('500');
  const [carbonOffsetKg, setCarbonOffsetKg] = useState('2000');
  const [gridStatus, setGridStatus] = useState('OPTIMIZED');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch('/api/smart-energy-grid')
      .then(res => res.json())
      .then(data => {
        setGrids(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAddGrid = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);

    try {
      const res = await fetch('/api/smart-energy-grid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gridZone, renewableSource, energyOutputKw, carbonOffsetKg, gridStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to register grid zone');

      setGrids([data, ...grids]);
      setGridZone('');
      setRenewableSource('');
      alert('Energy grid zone registered successfully.');
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
                SMART CAMPUS ENERGY GRID & CARBON OFFSET TRACKER
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Campus Microgrid & Sustainability Grid</h1>
            <p className="text-xs text-slate-400">Monitor renewable energy generation, microgrid power output, and net-zero carbon offsets.</p>
          </div>
          <Link 
            href="/master-command-center" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to Command Center
          </Link>
        </div>

        <form onSubmit={handleAddGrid} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>⚡</span> Register Campus Renewable Energy Zone
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Grid Zone Code</label>
              <input 
                type="text" 
                placeholder="e.g. ZONE-D-BIOMASS" 
                value={gridZone} 
                onChange={e => setGridZone(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Renewable Energy Source</label>
              <input 
                type="text" 
                placeholder="e.g. Organic Biomass Conversion Plant" 
                value={renewableSource} 
                onChange={e => setRenewableSource(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Energy Output (kW)</label>
              <input 
                type="number" 
                step="0.1" 
                value={energyOutputKw} 
                onChange={e => setEnergyOutputKw(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Carbon Offset (kg / day)</label>
              <input 
                type="number" 
                step="0.1" 
                value={carbonOffsetKg} 
                onChange={e => setCarbonOffsetKg(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Grid Status</label>
              <select 
                value={gridStatus} 
                onChange={e => setGridStatus(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="OPTIMIZED">Optimized</option>
                <option value="BALANCING">Balancing Load</option>
                <option value="PEAK_LOAD">Peak Load Warning</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={adding} 
              className="px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-all disabled:opacity-50 shadow-lg shadow-emerald-500/20"
            >
              {adding ? 'Registering Zone...' : 'Add Energy Zone →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🌱</span> Active Microgrid Zones ({grids.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Grid Zone & Source</th>
                  <th className="p-4 font-medium">Energy Output & Carbon Offset</th>
                  <th className="p-4 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {grids.map((g: any) => (
                  <tr key={g.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-white">{g.gridZone}</p>
                      <p className="text-[10px] text-slate-400">{g.renewableSource}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-emerald-400 font-semibold">{g.energyOutputKw} kW Output</p>
                      <p className="text-[10px] text-slate-400">{g.carbonOffsetKg} kg Carbon Offset</p>
                    </td>
                    <td className="p-4 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        g.gridStatus === 'OPTIMIZED'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/35'
                          : g.gridStatus === 'BALANCING'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/35'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/35'
                      }`}>
                        {g.gridStatus}
                      </span>
                    </td>
                  </tr>
                ))}
                {grids.length === 0 && !loading && (
                  <tr>
                    <td colSpan={3} className="p-6 text-center text-slate-500">
                      No energy grid records found.
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
