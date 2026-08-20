'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SmartGeothermalEnergyPage() {
  const [plants, setPlants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [plantCode, setPlantCode] = useState('');
  const [plantName, setPlantName] = useState('');
  const [loopTempC, setLoopTempC] = useState('14.5');
  const [flowRateLpm, setFlowRateLpm] = useState('120.0');
  const [efficiencyPct, setEfficiencyPct] = useState('94.5');
  const [aiCirculationMode, setAiCirculationMode] = useState('AUTO_THERMAL_BALANCE');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch('/api/smart-geothermal-energy')
      .then(res => res.json())
      .then(data => {
        setPlants(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAddPlant = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);

    try {
      const res = await fetch('/api/smart-geothermal-energy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plantCode, plantName, loopTempC, flowRateLpm, efficiencyPct, aiCirculationMode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to register geothermal plant');

      setPlants([data, ...plants]);
      setPlantCode('');
      setPlantName('');
      alert('Smart geothermal plant registered successfully.');
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
                SMART GEOTHERMAL & SUBSURFACE HEAT HUB
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Geothermal Energy & Heat Pumps</h1>
            <p className="text-xs text-slate-400">Monitor underground loop temperatures (°C), fluid flow rates (L/min), thermal efficiencies, and AI circulation modes.</p>
          </div>
          <Link 
            href="/?school=dps" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleAddPlant} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🌋</span> Register Geothermal Loop Plant
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Plant Code / ID</label>
              <input 
                type="text" 
                placeholder="e.g. GEO-LOOP-04" 
                value={plantCode} 
                onChange={e => setPlantCode(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Plant Name</label>
              <input 
                type="text" 
                placeholder="e.g. Athletic Complex Subsurface Heat Hub" 
                value={plantName} 
                onChange={e => setPlantName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Loop Temp (°C)</label>
              <input 
                type="number" 
                step="0.1" 
                value={loopTempC} 
                onChange={e => setLoopTempC(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Flow Rate (L/min)</label>
              <input 
                type="number" 
                step="0.1" 
                value={flowRateLpm} 
                onChange={e => setFlowRateLpm(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Efficiency (%)</label>
              <input 
                type="number" 
                step="0.1" 
                value={efficiencyPct} 
                onChange={e => setEfficiencyPct(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">AI Circulation Mode</label>
              <select 
                value={aiCirculationMode} 
                onChange={e => setAiCirculationMode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="AUTO_THERMAL_BALANCE">Auto Thermal Balance</option>
                <option value="DEEP_STAGE_COOLING">Deep Stage Cooling</option>
                <option value="MAX_HEAT_EXTRACTION">Max Heat Extraction</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={adding} 
              className="px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all disabled:opacity-50 shadow-lg shadow-cyan-500/20"
            >
              {adding ? 'Registering Plant...' : 'Add Geothermal Plant →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🌡️</span> Active Geothermal Plants ({plants.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Plant Code & Name</th>
                  <th className="p-4 font-medium">Loop Temp & Flow Rate</th>
                  <th className="p-4 font-medium">Thermal Efficiency</th>
                  <th className="p-4 font-medium text-right">AI Mode</th>
                </tr>
              </thead>
              <tbody>
                {plants.map((p) => (
                  <tr key={p.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-white">{p.plantCode}</p>
                      <p className="text-[10px] text-slate-400">{p.plantName}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-cyan-400 font-semibold">{p.loopTempC}°C Loop Temp</p>
                      <p className="text-[10px] text-slate-400">{p.flowRateLpm} L/min Flow</p>
                    </td>
                    <td className="p-4 font-semibold text-slate-300">
                      {p.efficiencyPct}% Efficiency
                    </td>
                    <td className="p-4 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        p.aiCirculationMode === 'AUTO_THERMAL_BALANCE'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/35'
                          : p.aiCirculationMode === 'DEEP_STAGE_COOLING'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/35'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/35'
                      }`}>
                        {p.aiCirculationMode}
                      </span>
                    </td>
                  </tr>
                ))}
                {plants.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-500">
                      No geothermal energy plants registered.
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
