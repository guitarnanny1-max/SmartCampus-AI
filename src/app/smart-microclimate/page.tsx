export const revalidate = 0;
export const dynamic = 'force-dynamic';
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SmartMicroclimatePage() {
  const [zones, setZones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [zoneCode, setZoneCode] = useState('');
  const [zoneName, setZoneName] = useState('');
  const [humidityPct, setHumidityPct] = useState('50.0');
  const [co2LevelsPpm, setCo2LevelsPpm] = useState('400.0');
  const [tempCelsius, setTempCelsius] = useState('22.0');
  const [aiClimateControlMode, setAiClimateControlMode] = useState('ADAPTIVE_BIOSPHERE_STABILIZATION');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch('/api/smart-microclimate')
      .then(res => res.json())
      .then(data => {
        setZones(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAddZone = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);

    try {
      const res = await fetch('/api/smart-microclimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zoneCode, zoneName, humidityPct, co2LevelsPpm, tempCelsius, aiClimateControlMode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to register zone');

      setZones([data, ...zones]);
      setZoneCode('');
      setZoneName('');
      alert('Climate zone registered successfully.');
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
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/35">
                SMART MICROCLIMATE & ATMOSPHERIC CONTROL HUB
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Campus Atmospheric Control & Weather Grid</h1>
            <p className="text-xs text-slate-400">Monitor humidity, CO2 levels, temperature, and AI-driven weather pattern stabilization.</p>
          </div>
          <Link 
            href="/?school=dps" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleAddZone} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🌦️</span> Register Climate Zone
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Zone Code / ID</label>
              <input 
                type="text" 
                placeholder="e.g. ZONE-CLIM-04" 
                value={zoneCode} 
                onChange={e => setZoneCode(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-sky-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Zone Name</label>
              <input 
                type="text" 
                placeholder="e.g. Tropical Rainforest Research Dome" 
                value={zoneName} 
                onChange={e => setZoneName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-sky-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Humidity (%)</label>
              <input 
                type="number" 
                step="0.1" 
                value={humidityPct} 
                onChange={e => setHumidityPct(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-sky-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">CO2 (ppm)</label>
              <input 
                type="number" 
                step="1.0" 
                value={co2LevelsPpm} 
                onChange={e => setCo2LevelsPpm(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-sky-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Temperature (°C)</label>
              <input 
                type="number" 
                step="0.1" 
                value={tempCelsius} 
                onChange={e => setTempCelsius(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-sky-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">AI Control Mode</label>
              <select 
                value={aiClimateControlMode} 
                onChange={e => setAiClimateControlMode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-sky-500 focus:outline-none"
              >
                <option value="ADAPTIVE_BIOSPHERE_STABILIZATION">Adaptive Biosphere Stabilization</option>
                <option value="PREDICTIVE_WEATHER_SHIELD_DEPLOYMENT">Predictive Weather Shield</option>
                <option value="EXTREME_CONDITIONS_SIMULATION">Extreme Conditions Simulation</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={adding} 
              className="px-6 py-3 rounded-xl bg-sky-500 text-slate-950 font-bold text-xs hover:bg-sky-400 transition-all disabled:opacity-50 shadow-lg shadow-sky-500/20"
            >
              {adding ? 'Registering Zone...' : 'Add Climate Zone →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🌦️</span> Active Climate Zones ({zones.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Zone Code & Name</th>
                  <th className="p-4 font-medium">Atmospheric Metrics</th>
                  <th className="p-4 font-medium text-right">AI Control Mode</th>
                </tr>
              </thead>
              <tbody>
                {zones.map((z: any) => (
                  <tr key={z.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-white">{z.zoneCode}</p>
                      <p className="text-[10px] text-slate-400">{z.zoneName}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-sky-400 font-semibold">{z.tempCelsius}°C @ {z.humidityPct}% Humidity</p>
                      <p className="text-[10px] text-slate-400">{z.co2LevelsPpm} ppm CO2</p>
                    </td>
                    <td className="p-4 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        z.aiClimateControlMode === 'ADAPTIVE_BIOSPHERE_STABILIZATION'
                          ? 'bg-sky-500/10 text-sky-400 border-sky-500/35'
                          : z.aiClimateControlMode === 'PREDICTIVE_WEATHER_SHIELD_DEPLOYMENT'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/35'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/35'
                      }`}>
                        {z.aiClimateControlMode}
                      </span>
                    </td>
                  </tr>
                ))}
                {zones.length === 0 && !loading && (
                  <tr>
                    <td colSpan={3} className="p-6 text-center text-slate-500">
                      No climate zones registered.
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
