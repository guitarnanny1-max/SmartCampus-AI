export const revalidate = 0;
export const dynamic = 'force-dynamic';
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SmartWindTurbinePage() {
  const [turbines, setTurbines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [turbineCode, setTurbineCode] = useState('');
  const [turbineName, setTurbineName] = useState('');
  const [rotorSpeedRpm, setRotorSpeedRpm] = useState('18.5');
  const [powerOutputKw, setPowerOutputKw] = useState('125.0');
  const [windYawAngleDeg, setWindYawAngleDeg] = useState('45.0');
  const [aiYawOptimization, setAiYawOptimization] = useState('ACTIVE_ALIGNMENT');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch('/api/smart-wind-turbine')
      .then(res => res.json())
      .then(data => {
        setTurbines(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAddTurbine = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);

    try {
      const res = await fetch('/api/smart-wind-turbine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ turbineCode, turbineName, rotorSpeedRpm, powerOutputKw, windYawAngleDeg, aiYawOptimization }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to register turbine');

      setTurbines([data, ...turbines]);
      setTurbineCode('');
      setTurbineName('');
      alert('Smart wind turbine registered successfully.');
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
                SMART MICROGRID & WIND TURBINE HUB
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Renewable Energy & Wind Turbines</h1>
            <p className="text-xs text-slate-400">Monitor rotor velocities, clean power generation (kW), yaw angle alignments, and microgrid synchronization.</p>
          </div>
          <Link 
            href="/?school=dps" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleAddTurbine} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>⚡</span> Register Wind Turbine
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Turbine Code / ID</label>
              <input 
                type="text" 
                placeholder="e.g. WT-SOLAR-04" 
                value={turbineCode} 
                onChange={e => setTurbineCode(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Turbine Name</label>
              <input 
                type="text" 
                placeholder="e.g. Campus Renewable Hub Turbine Delta" 
                value={turbineName} 
                onChange={e => setTurbineName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Rotor Speed (RPM)</label>
              <input 
                type="number" 
                step="0.1" 
                value={rotorSpeedRpm} 
                onChange={e => setRotorSpeedRpm(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Power Output (kW)</label>
              <input 
                type="number" 
                step="0.1" 
                value={powerOutputKw} 
                onChange={e => setPowerOutputKw(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Yaw Angle (°)</label>
              <input 
                type="number" 
                step="0.1" 
                value={windYawAngleDeg} 
                onChange={e => setWindYawAngleDeg(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-xs font-medium text-slate-400">AI Yaw Optimization</label>
              <select 
                value={aiYawOptimization} 
                onChange={e => setAiYawOptimization(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="ACTIVE_ALIGNMENT">Active Alignment</option>
                <option value="STORM_BRAKING">Storm Braking</option>
                <option value="MAINTENANCE_IDLE">Maintenance Idle</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={adding} 
              className="px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all disabled:opacity-50 shadow-lg shadow-cyan-500/20"
            >
              {adding ? 'Registering Turbine...' : 'Add Wind Turbine →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🌪️</span> Active Wind Turbines ({turbines.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Turbine Code & Name</th>
                  <th className="p-4 font-medium">Power & RPM</th>
                  <th className="p-4 font-medium">Yaw Vector</th>
                  <th className="p-4 font-medium text-right">AI Mode</th>
                </tr>
              </thead>
              <tbody>
                {turbines.map((t: any) => (
                  <tr key={t.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-white">{t.turbineCode}</p>
                      <p className="text-[10px] text-slate-400">{t.turbineName}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-cyan-400 font-semibold">{t.powerOutputKw} kW Output</p>
                      <p className="text-[10px] text-slate-400">{t.rotorSpeedRpm} RPM Velocity</p>
                    </td>
                    <td className="p-4 font-semibold text-slate-300">
                      {t.windYawAngleDeg}° angle
                    </td>
                    <td className="p-4 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        t.aiYawOptimization === 'ACTIVE_ALIGNMENT'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/35'
                          : t.aiYawOptimization === 'STORM_BRAKING'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/35'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/35'
                      }`}>
                        {t.aiYawOptimization}
                      </span>
                    </td>
                  </tr>
                ))}
                {turbines.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-500">
                      No wind turbines registered.
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
