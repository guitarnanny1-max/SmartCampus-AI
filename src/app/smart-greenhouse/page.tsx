export const revalidate = 0;
export const dynamic = 'force-dynamic';
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SmartGreenhousePage() {
  const [greenhouses, setGreenhouses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [greenhouseCode, setGreenhouseCode] = useState('');
  const [greenhouseName, setGreenhouseName] = useState('');
  const [soilNutrientPpm, setSoilNutrientPpm] = useState('650.0');
  const [temperatureC, setTemperatureC] = useState('24.5');
  const [humidityPct, setHumidityPct] = useState('75.0');
  const [ledSpectrumMode, setLedSpectrumMode] = useState('FULL_SPECTRUM_GROW');
  const [aiHealthStatus, setAiHealthStatus] = useState('OPTIMIZED');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch('/api/smart-greenhouse')
      .then(res => res.json())
      .then(data => {
        setGreenhouses(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAddGreenhouse = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);

    try {
      const res = await fetch('/api/smart-greenhouse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ greenhouseCode, greenhouseName, soilNutrientPpm, temperatureC, humidityPct, ledSpectrumMode, aiHealthStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to register greenhouse');

      setGreenhouses([data, ...greenhouses]);
      setGreenhouseCode('');
      setGreenhouseName('');
      alert('Smart greenhouse registered successfully.');
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
                SMART GREENHOUSE & BOTANY HUB
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Botanical Research & Climate Automation</h1>
            <p className="text-xs text-slate-400">Monitor N-P-K soil nutrients, greenhouse temperatures, humidity levels, and automated LED grow lights.</p>
          </div>
          <Link 
            href="/?school=dps" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleAddGreenhouse} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🌿</span> Register Greenhouse or Botany Lab
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Greenhouse Code / ID</label>
              <input 
                type="text" 
                placeholder="e.g. GH-AGR-04" 
                value={greenhouseCode} 
                onChange={e => setGreenhouseCode(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Greenhouse Name</label>
              <input 
                type="text" 
                placeholder="e.g. Genetics & Crop Science Greenhouse" 
                value={greenhouseName} 
                onChange={e => setGreenhouseName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Soil Nutrients (PPM)</label>
              <input 
                type="number" 
                step="0.1" 
                value={soilNutrientPpm} 
                onChange={e => setSoilNutrientPpm(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Temp (°C)</label>
              <input 
                type="number" 
                step="0.1" 
                value={temperatureC} 
                onChange={e => setTemperatureC(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Humidity (%)</label>
              <input 
                type="number" 
                step="0.1" 
                value={humidityPct} 
                onChange={e => setHumidityPct(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">LED Spectrum</label>
              <select 
                value={ledSpectrumMode} 
                onChange={e => setLedSpectrumMode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="FULL_SPECTRUM_GROW">Full Spectrum</option>
                <option value="VEGETATIVE_BLUE">Vegetative Blue</option>
                <option value="FLOWERING_RED">Flowering Red</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">AI Health</label>
              <select 
                value={aiHealthStatus} 
                onChange={e => setAiHealthStatus(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="OPTIMIZED">Optimized</option>
                <option value="NUTRIENT_BOOST_NEEDED">Nutrient Boost Needed</option>
                <option value="HUMIDITY_WARNING">Humidity Warning</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={adding} 
              className="px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-all disabled:opacity-50 shadow-lg shadow-emerald-500/20"
            >
              {adding ? 'Registering Greenhouse...' : 'Add Smart Greenhouse →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🌱</span> Active Greenhouses & Botany Labs ({greenhouses.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Code & Name</th>
                  <th className="p-4 font-medium">Nutrients & Climate</th>
                  <th className="p-4 font-medium">LED Spectrum</th>
                  <th className="p-4 font-medium text-right">AI Health Status</th>
                </tr>
              </thead>
              <tbody>
                {greenhouses.map((g: any) => (
                  <tr key={g.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-white">{g.greenhouseCode}</p>
                      <p className="text-[10px] text-slate-400">{g.greenhouseName}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-emerald-400 font-semibold">{g.soilNutrientPpm} PPM Soil</p>
                      <p className="text-[10px] text-slate-400">{g.temperatureC}°C | {g.humidityPct}% Humidity</p>
                    </td>
                    <td className="p-4 font-semibold text-slate-300">
                      {g.ledSpectrumMode}
                    </td>
                    <td className="p-4 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        g.aiHealthStatus === 'OPTIMIZED'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/35'
                          : g.aiHealthStatus === 'NUTRIENT_BOOST_NEEDED'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/35'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/35'
                      }`}>
                        {g.aiHealthStatus}
                      </span>
                    </td>
                  </tr>
                ))}
                {greenhouses.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-500">
                      No greenhouses registered.
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
