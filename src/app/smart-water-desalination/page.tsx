'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SmartWaterDesalinationPage() {
  const [facilities, setFacilities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [facilityCode, setFacilityCode] = useState('');
  const [facilityName, setFacilityName] = useState('');
  const [waterPurifiedLiters, setWaterPurifiedLiters] = useState('75000.0');
  const [membranePurityPct, setMembranePurityPct] = useState('99.0');
  const [tdsLevelPpm, setTdsLevelPpm] = useState('40.0');
  const [aiFiltrationOptimization, setAiFiltrationOptimization] = useState('REVERSE_OSMOSIS_AI_BACKWASH');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch('/api/smart-water-desalination')
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
      const res = await fetch('/api/smart-water-desalination', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ facilityCode, facilityName, waterPurifiedLiters, membranePurityPct, tdsLevelPpm, aiFiltrationOptimization }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to register facility');

      setFacilities([data, ...facilities]);
      setFacilityCode('');
      setFacilityName('');
      alert('Water desalination facility registered successfully.');
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
                WATER DESALINATION & HARVESTING HUB
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Campus Hydrological & Purification Grid</h1>
            <p className="text-xs text-slate-400">Monitor water purification volume (Liters), membrane purity (%), TDS levels (ppm), and AI filtration modes.</p>
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
            <span>💧</span> Register Water Facility
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Facility Code / ID</label>
              <input 
                type="text" 
                placeholder="e.g. WATER-FAC-04" 
                value={facilityCode} 
                onChange={e => setFacilityCode(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Facility Name</label>
              <input 
                type="text" 
                placeholder="e.g. Student Housing Graywater Plant" 
                value={facilityName} 
                onChange={e => setFacilityName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Water Purified (Liters)</label>
              <input 
                type="number" 
                step="1000" 
                value={waterPurifiedLiters} 
                onChange={e => setWaterPurifiedLiters(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Membrane Purity (%)</label>
              <input 
                type="number" 
                step="0.1" 
                value={membranePurityPct} 
                onChange={e => setMembranePurityPct(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">TDS Level (PPM)</label>
              <input 
                type="number" 
                step="0.1" 
                value={tdsLevelPpm} 
                onChange={e => setTdsLevelPpm(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">AI Filtration Mode</label>
              <select 
                value={aiFiltrationOptimization} 
                onChange={e => setAiFiltrationOptimization(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="REVERSE_OSMOSIS_AI_BACKWASH">Reverse Osmosis AI Backwash</option>
                <option value="UV_BIO_FOULING_PREVENTION">UV Bio-Fouling Prevention</option>
                <option value="ULTRA_PURE_RESIN_REGENERATION">Ultra-Pure Resin Regeneration</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={adding} 
              className="px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all disabled:opacity-50 shadow-lg shadow-cyan-500/20"
            >
              {adding ? 'Registering Facility...' : 'Add Water Facility →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>💧</span> Active Water Facilities ({facilities.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Facility Code & Name</th>
                  <th className="p-4 font-medium">Purified Volume & TDS</th>
                  <th className="p-4 font-medium">Membrane Purity</th>
                  <th className="p-4 font-medium text-right">AI Filtration Mode</th>
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
                      <p className="text-cyan-400 font-semibold">{f.waterPurifiedLiters.toLocaleString()} Liters</p>
                      <p className="text-[10px] text-slate-400">{f.tdsLevelPpm} PPM TDS Level</p>
                    </td>
                    <td className="p-4 font-semibold text-slate-300">
                      {f.membranePurityPct}% Purity
                    </td>
                    <td className="p-4 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        f.aiFiltrationOptimization === 'REVERSE_OSMOSIS_AI_BACKWASH'
                          ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/35'
                          : f.aiFiltrationOptimization === 'UV_BIO_FOULING_PREVENTION'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/35'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/35'
                      }`}>
                        {f.aiFiltrationOptimization}
                      </span>
                    </td>
                  </tr>
                ))}
                {facilities.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-500">
                      No water facilities registered.
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
