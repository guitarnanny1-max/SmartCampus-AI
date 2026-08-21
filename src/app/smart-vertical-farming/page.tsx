export const revalidate = 0;
export const dynamic = 'force-dynamic';
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SmartVerticalFarmingPage() {
  const [facilities, setFacilities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [greenhouseCode, setGreenhouseCode] = useState('');
  const [facilityName, setFacilityName] = useState('');
  const [cropYieldKg, setCropYieldKg] = useState('1500.0');
  const [nutrientMistpH, setNutrientMistpH] = useState('5.9');
  const [ledPhotosynthesisPar, setLedPhotosynthesisPar] = useState('460.0');
  const [aiClimateControlMode, setAiClimateControlMode] = useState('DYNAMIC_SPECTRAL_LIGHTING_OPTIMIZATION');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch('/api/smart-vertical-farming')
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
      const res = await fetch('/api/smart-vertical-farming', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ greenhouseCode, facilityName, cropYieldKg, nutrientMistpH, ledPhotosynthesisPar, aiClimateControlMode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to register facility');

      setFacilities([data, ...facilities]);
      setGreenhouseCode('');
      setFacilityName('');
      alert('Vertical farming facility registered successfully.');
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
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-lime-500/10 text-lime-400 border border-lime-500/35">
                VERTICAL FARMING & AEROPONIC GREENHOUSE HUB
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Campus Agrotechnology & Crop Yield Grid</h1>
            <p className="text-xs text-slate-400">Monitor crop harvest yields (Kg), nutrient mist pH, LED PAR ratings, and AI spectral climate control.</p>
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
            <span>🌱</span> Register Greenhouse Facility
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Greenhouse Code / ID</label>
              <input 
                type="text" 
                placeholder="e.g. AGRO-FAC-04" 
                value={greenhouseCode} 
                onChange={e => setGreenhouseCode(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-lime-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Facility Name</label>
              <input 
                type="text" 
                placeholder="e.g. Horticultural Innovation Hydro-Bay" 
                value={facilityName} 
                onChange={e => setFacilityName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-lime-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Crop Yield (Kg)</label>
              <input 
                type="number" 
                step="50" 
                value={cropYieldKg} 
                onChange={e => setCropYieldKg(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-lime-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Nutrient Mist pH</label>
              <input 
                type="number" 
                step="0.1" 
                value={nutrientMistpH} 
                onChange={e => setNutrientMistpH(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-lime-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">LED PAR (μmol/m²/s)</label>
              <input 
                type="number" 
                step="10" 
                value={ledPhotosynthesisPar} 
                onChange={e => setLedPhotosynthesisPar(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-lime-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">AI Climate Mode</label>
              <select 
                value={aiClimateControlMode} 
                onChange={e => setAiClimateControlMode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-lime-500 focus:outline-none"
              >
                <option value="DYNAMIC_SPECTRAL_LIGHTING_OPTIMIZATION">Dynamic Spectral Lighting Optimization</option>
                <option value="PRECISION_ROOT_MIST_SCHEDULING">Precision Root Mist Scheduling</option>
                <option value="AUTONOMOUS_TRANSPIRATION_REGULATION">Autonomous Transpiration Regulation</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={adding} 
              className="px-6 py-3 rounded-xl bg-lime-500 text-slate-950 font-bold text-xs hover:bg-lime-400 transition-all disabled:opacity-50 shadow-lg shadow-lime-500/20"
            >
              {adding ? 'Registering Facility...' : 'Add Greenhouse Facility →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🌱</span> Active Greenhouse Facilities ({facilities.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Greenhouse Code & Name</th>
                  <th className="p-4 font-medium">Yield & Nutrient pH</th>
                  <th className="p-4 font-medium">LED PAR Rating</th>
                  <th className="p-4 font-medium text-right">AI Climate Mode</th>
                </tr>
              </thead>
              <tbody>
                {facilities.map((f: any) => (
                  <tr key={f.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-white">{f.greenhouseCode}</p>
                      <p className="text-[10px] text-slate-400">{f.facilityName}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-lime-400 font-semibold">{f.cropYieldKg} Kg Yield</p>
                      <p className="text-[10px] text-slate-400">pH {f.nutrientMistpH} Nutrient Mist</p>
                    </td>
                    <td className="p-4 font-semibold text-slate-300">
                      {f.ledPhotosynthesisPar} μmol/m²/s
                    </td>
                    <td className="p-4 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        f.aiClimateControlMode === 'DYNAMIC_SPECTRAL_LIGHTING_OPTIMIZATION'
                          ? 'bg-lime-500/10 text-lime-400 border-lime-500/35'
                          : f.aiClimateControlMode === 'PRECISION_ROOT_MIST_SCHEDULING'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/35'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/35'
                      }`}>
                        {f.aiClimateControlMode}
                      </span>
                    </td>
                  </tr>
                ))}
                {facilities.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-500">
                      No greenhouse facilities registered.
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
