'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SmartWastewaterReclamationPage() {
  const [plants, setPlants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [plantCode, setPlantCode] = useState('');
  const [facilityName, setFacilityName] = useState('');
  const [recycledVolumeLtrs, setRecycledVolumeLtrs] = useState('15000.0');
  const [filtrationEfficiencyPct, setFiltrationEfficiencyPct] = useState('98.5');
  const [bodCodStatus, setBodCodStatus] = useState('NORMAL_PURIFICATION');
  const [aiReclamationOptimization, setAiReclamationOptimization] = useState('AUTO_MEMBRANE_FLUSHING');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch('/api/smart-wastewater-reclamation')
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
      const res = await fetch('/api/smart-wastewater-reclamation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plantCode, facilityName, recycledVolumeLtrs, filtrationEfficiencyPct, bodCodStatus, aiReclamationOptimization }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to register reclamation plant');

      setPlants([data, ...plants]);
      setPlantCode('');
      setFacilityName('');
      alert('Smart wastewater reclamation plant registered successfully.');
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
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/35">
                SMART WASTEWATER RECLAMATION & ZLD HUB
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Greywater Recycling & Desalination</h1>
            <p className="text-xs text-slate-400">Monitor recycled water volume (Liters), filtration efficiency (%), BOD/COD status, and AI membrane scheduling.</p>
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
            <span>💧</span> Register Reclamation Plant
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Plant Code / ID</label>
              <input 
                type="text" 
                placeholder="e.g. WW-RECLAIM-04" 
                value={plantCode} 
                onChange={e => setPlantCode(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Facility Name</label>
              <input 
                type="text" 
                placeholder="e.g. Campus Engineering Block ZLD Plant" 
                value={facilityName} 
                onChange={e => setFacilityName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Recycled Volume (Ltrs)</label>
              <input 
                type="number" 
                step="100" 
                value={recycledVolumeLtrs} 
                onChange={e => setRecycledVolumeLtrs(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Filtration Efficiency (%)</label>
              <input 
                type="number" 
                step="0.1" 
                value={filtrationEfficiencyPct} 
                onChange={e => setFiltrationEfficiencyPct(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">BOD/COD Status</label>
              <select 
                value={bodCodStatus} 
                onChange={e => setBodCodStatus(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="NORMAL_PURIFICATION">Normal Purification</option>
                <option value="LOW_BOD_EXCELLENT">Low BOD (Excellent)</option>
                <option value="CHEMICAL_NEUTRALIZED">Chemical Neutralized</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">AI Optimization</label>
              <select 
                value={aiReclamationOptimization} 
                onChange={e => setAiReclamationOptimization(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="AUTO_MEMBRANE_FLUSHING">Auto Membrane Flushing</option>
                <option value="UV_STERILIZATION_BOOST">UV Sterilization Boost</option>
                <option value="SEDIMENTATION_BALANCING">Sedimentation Balancing</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={adding} 
              className="px-6 py-3 rounded-xl bg-blue-500 text-slate-950 font-bold text-xs hover:bg-blue-400 transition-all disabled:opacity-50 shadow-lg shadow-blue-500/20"
            >
              {adding ? 'Registering Plant...' : 'Add Reclamation Plant →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🌊</span> Active Reclamation Plants ({plants.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Plant Code & Name</th>
                  <th className="p-4 font-medium">Recycled Volume & Efficiency</th>
                  <th className="p-4 font-medium">BOD/COD Status</th>
                  <th className="p-4 font-medium text-right">AI Reclamation Mode</th>
                </tr>
              </thead>
              <tbody>
                {plants.map((p) => (
                  <tr key={p.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-white">{p.plantCode}</p>
                      <p className="text-[10px] text-slate-400">{p.facilityName}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-blue-400 font-semibold">{p.recycledVolumeLtrs.toLocaleString()} Ltrs Recycled</p>
                      <p className="text-[10px] text-slate-400">{p.filtrationEfficiencyPct}% Filtration Efficiency</p>
                    </td>
                    <td className="p-4 font-semibold text-slate-300">
                      {p.bodCodStatus}
                    </td>
                    <td className="p-4 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        p.aiReclamationOptimization === 'AUTO_MEMBRANE_FLUSHING'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/35'
                          : p.aiReclamationOptimization === 'UV_STERILIZATION_BOOST'
                          ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/35'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/35'
                      }`}>
                        {p.aiReclamationOptimization}
                      </span>
                    </td>
                  </tr>
                ))}
                {plants.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-500">
                      No wastewater reclamation plants registered.
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
