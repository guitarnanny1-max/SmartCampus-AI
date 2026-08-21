export const revalidate = 0;
export const dynamic = 'force-dynamic';
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function EnergyPage() {
  const [grids, setGrids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sectorName, setSectorName] = useState('');
  const [solarOutputKw, setSolarOutputKw] = useState('');
  const [gridDrawKw, setGridDrawKw] = useState('');
  const [batteryLevel, setBatteryLevel] = useState('85');
  const [aiMode, setAiMode] = useState('ECO_PEAK');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch('/api/energy')
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
      const res = await fetch('/api/energy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectorName, solarOutputKw, gridDrawKw, batteryLevel, aiMode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add grid sector');

      setGrids([data, ...grids]);
      setSectorName('');
      setSolarOutputKw('');
      setGridDrawKw('');
      alert('Energy grid sector registered successfully.');
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
                SUSTAINABILITY & SOLAR MICROGRID
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Smart Energy & Grid Portal</h1>
            <p className="text-xs text-slate-400">Monitor campus solar generation, battery storage levels, and AI-driven energy optimization nodes.</p>
          </div>
          <Link 
            href="/?school=dps" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleAddGrid} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>⚡</span> Register Microgrid Sector
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Sector / Building Name</label>
              <input 
                type="text" 
                placeholder="e.g. Sports Complex & Gymnasium" 
                value={sectorName} 
                onChange={e => setSectorName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">AI Optimization Mode</label>
              <select 
                value={aiMode} 
                onChange={e => setAiMode(e.target.value)} 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="ECO_PEAK">Eco Peak Shaving</option>
                <option value="LOAD_BALANCED">Load Balanced</option>
                <option value="MAX_EFFICIENCY">Max Solar Efficiency</option>
                <option value="EMERGENCY_RESERVE">Emergency Reserve</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Solar Output (kW)</label>
              <input 
                type="number" 
                step="0.1" 
                placeholder="e.g. 150.0" 
                value={solarOutputKw} 
                onChange={e => setSolarOutputKw(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Grid Draw (kW)</label>
              <input 
                type="number" 
                step="0.1" 
                placeholder="e.g. 80.5" 
                value={gridDrawKw} 
                onChange={e => setGridDrawKw(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Battery Level (%)</label>
              <input 
                type="number" 
                min="0" 
                max="100" 
                value={batteryLevel} 
                onChange={e => setBatteryLevel(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={adding} 
              className="px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-all disabled:opacity-50 shadow-lg shadow-emerald-500/20"
            >
              {adding ? 'Registering Sector...' : 'Add Energy Sector →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🔋</span> Active Microgrid Sectors ({grids.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Sector Name</th>
                  <th className="p-4 font-medium">Solar Generation</th>
                  <th className="p-4 font-medium">Grid Draw</th>
                  <th className="p-4 font-medium">Battery Storage</th>
                  <th className="p-4 font-medium text-right">AI Mode</th>
                </tr>
              </thead>
              <tbody>
                {grids.map((grid: any) => (
                  <tr key={grid.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-white">{grid.sectorName}</p>
                      <p className="text-[10px] text-emerald-400">{grid.status}</p>
                    </td>
                    <td className="p-4 text-emerald-400 font-mono">+{grid.solarOutputKw} kW</td>
                    <td className="p-4 text-amber-400 font-mono">-{grid.gridDrawKw} kW</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-emerald-400 h-full" style={{ width: `${grid.batteryLevel}%` }}></div>
                        </div>
                        <span className="text-slate-300 font-mono text-[10px]">{grid.batteryLevel}%</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/35">
                        {grid.aiMode}
                      </span>
                    </td>
                  </tr>
                ))}
                {grids.length === 0 && !loading && (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-500">
                      No smart energy sectors registered.
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
