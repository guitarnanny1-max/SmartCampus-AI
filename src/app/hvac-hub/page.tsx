export const revalidate = 0;
export const dynamic = 'force-dynamic';
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HvacHubPage() {
  const [units, setUnits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [unitCode, setUnitCode] = useState('');
  const [buildingName, setBuildingName] = useState('');
  const [targetTempC, setTargetTempC] = useState('22.5');
  const [currentTempC, setCurrentTempC] = useState('23.0');
  const [co2Ppm, setCo2Ppm] = useState('450');
  const [airQualityIndex, setAirQualityIndex] = useState('EXCELLENT');
  const [status, setStatus] = useState('OPTIMIZED');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch('/api/hvac-hub')
      .then(res => res.json())
      .then(data => {
        setUnits(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAddUnit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);

    try {
      const res = await fetch('/api/hvac-hub', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ unitCode, buildingName, targetTempC, currentTempC, co2Ppm, airQualityIndex, status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to register HVAC unit');

      setUnits([data, ...units]);
      setUnitCode('');
      setBuildingName('');
      alert('Smart HVAC unit registered successfully.');
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
                SMART HVAC & IAQ COMMAND
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Climate & Indoor Air Quality Hub</h1>
            <p className="text-xs text-slate-400">Monitor automated thermostat controls, CO2 ppm telemetry, and IAQ indices across campus buildings.</p>
          </div>
          <Link 
            href="/?school=dps" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleAddUnit} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🌡️</span> Register Smart HVAC Unit
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">HVAC Unit Code</label>
              <input 
                type="text" 
                placeholder="e.g. HVAC-ENG-05" 
                value={unitCode} 
                onChange={e => setUnitCode(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Building / Zone Name</label>
              <input 
                type="text" 
                placeholder="e.g. Engineering Lecture Block B" 
                value={buildingName} 
                onChange={e => setBuildingName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Target Temp (°C)</label>
              <input 
                type="number" 
                step="0.1" 
                value={targetTempC} 
                onChange={e => setTargetTempC(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Current Temp (°C)</label>
              <input 
                type="number" 
                step="0.1" 
                value={currentTempC} 
                onChange={e => setCurrentTempC(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">CO2 Levels (PPM)</label>
              <input 
                type="number" 
                value={co2Ppm} 
                onChange={e => setCo2Ppm(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Air Quality Index</label>
              <select 
                value={airQualityIndex} 
                onChange={e => setAirQualityIndex(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="EXCELLENT">Excellent</option>
                <option value="GOOD">Good</option>
                <option value="MODERATE">Moderate</option>
                <option value="POOR">Poor</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={adding} 
              className="px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all disabled:opacity-50 shadow-lg shadow-cyan-500/20"
            >
              {adding ? 'Registering Unit...' : 'Add HVAC Unit →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>💨</span> Campus Climate & IAQ Network ({units.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Unit Code & Building</th>
                  <th className="p-4 font-medium">Temperature (°C)</th>
                  <th className="p-4 font-medium">CO2 PPM</th>
                  <th className="p-4 font-medium text-right">Air Quality Index</th>
                </tr>
              </thead>
              <tbody>
                {units.map((u: any) => (
                  <tr key={u.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-white">{u.unitCode}</p>
                      <p className="text-[10px] text-slate-400">{u.buildingName}</p>
                    </td>
                    <td className="p-4 font-mono text-slate-300">
                      Target: {u.targetTempC}°C | Actual: <span className="text-white font-bold">{u.currentTempC}°C</span>
                    </td>
                    <td className="p-4 font-mono text-cyan-400 font-bold">
                      {u.co2Ppm} PPM
                    </td>
                    <td className="p-4 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        u.airQualityIndex === 'EXCELLENT'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/35'
                          : u.airQualityIndex === 'GOOD'
                          ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/35'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/35'
                      }`}>
                        {u.airQualityIndex}
                      </span>
                    </td>
                  </tr>
                ))}
                {units.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-500">
                      No HVAC units registered.
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
