'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SmartMicrogridPage() {
  const [nodes, setNodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [gridNodeCode, setGridNodeCode] = useState('');
  const [facilityName, setFacilityName] = useState('');
  const [solarWindMixPct, setSolarWindMixPct] = useState('80.0');
  const [batteryStorageMWh, setBatteryStorageMWh] = useState('10.0');
  const [gridStabilityStatus, setGridStabilityStatus] = useState('OPTIMAL_LOAD_BALANCING');
  const [aiDispatchOptimization, setAiDispatchOptimization] = useState('PREDICTIVE_PEAK_SHAVING');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch('/api/smart-microgrid')
      .then(res => res.json())
      .then(data => {
        setNodes(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAddNode = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);

    try {
      const res = await fetch('/api/smart-microgrid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gridNodeCode, facilityName, solarWindMixPct, batteryStorageMWh, gridStabilityStatus, aiDispatchOptimization }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to register microgrid node');

      setNodes([data, ...nodes]);
      setGridNodeCode('');
      setFacilityName('');
      alert('Smart microgrid node registered successfully.');
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
                SMART MICROGRID & BESS HUB
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Renewable Microgrid & Energy Storage</h1>
            <p className="text-xs text-slate-400">Monitor generation mix (%), battery capacity (MWh), grid stability, and AI power dispatching.</p>
          </div>
          <Link 
            href="/?school=dps" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleAddNode} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>⚡</span> Register Microgrid Node
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Grid Node Code / ID</label>
              <input 
                type="text" 
                placeholder="e.g. GRID-NODE-04" 
                value={gridNodeCode} 
                onChange={e => setGridNodeCode(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Facility Name</label>
              <input 
                type="text" 
                placeholder="e.g. Medical School Substation BESS" 
                value={facilityName} 
                onChange={e => setFacilityName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Solar/Wind Mix (%)</label>
              <input 
                type="number" 
                step="0.1" 
                value={solarWindMixPct} 
                onChange={e => setSolarWindMixPct(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Battery Storage (MWh)</label>
              <input 
                type="number" 
                step="0.1" 
                value={batteryStorageMWh} 
                onChange={e => setBatteryStorageMWh(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Grid Stability Status</label>
              <select 
                value={gridStabilityStatus} 
                onChange={e => setGridStabilityStatus(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
              >
                <option value="OPTIMAL_LOAD_BALANCING">Optimal Load Balancing</option>
                <option value="PEAK_SHAVING_ACTIVE">Peak Shaving Active</option>
                <option value="AUTONOMOUS_ISLANDING">Autonomous Islanding</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">AI Dispatch Mode</label>
              <select 
                value={aiDispatchOptimization} 
                onChange={e => setAiDispatchOptimization(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
              >
                <option value="PREDICTIVE_PEAK_SHAVING">Predictive Peak Shaving</option>
                <option value="ARBITRAGE_DISPATCH">Arbitrage Dispatch</option>
                <option value="EMERGENCY_BACKUP_RESERVE">Emergency Backup Reserve</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={adding} 
              className="px-6 py-3 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-all disabled:opacity-50 shadow-lg shadow-amber-500/20"
            >
              {adding ? 'Registering Node...' : 'Add Microgrid Node →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>⚡</span> Active Microgrid Nodes ({nodes.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Node Code & Name</th>
                  <th className="p-4 font-medium">Solar/Wind Mix & Storage</th>
                  <th className="p-4 font-medium">Grid Stability</th>
                  <th className="p-4 font-medium text-right">AI Dispatch Mode</th>
                </tr>
              </thead>
              <tbody>
                {nodes.map((n) => (
                  <tr key={n.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-white">{n.gridNodeCode}</p>
                      <p className="text-[10px] text-slate-400">{n.facilityName}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-amber-400 font-semibold">{n.solarWindMixPct}% Solar/Wind Mix</p>
                      <p className="text-[10px] text-slate-400">{n.batteryStorageMWh} MWh BESS Capacity</p>
                    </td>
                    <td className="p-4 font-semibold text-slate-300">
                      {n.gridStabilityStatus}
                    </td>
                    <td className="p-4 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        n.aiDispatchOptimization === 'PREDICTIVE_PEAK_SHAVING'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/35'
                          : n.aiDispatchOptimization === 'ARBITRAGE_DISPATCH'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/35'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/35'
                      }`}>
                        {n.aiDispatchOptimization}
                      </span>
                    </td>
                  </tr>
                ))}
                {nodes.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-500">
                      No microgrid nodes registered.
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
