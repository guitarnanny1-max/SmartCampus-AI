export const revalidate = 0;
export const dynamic = 'force-dynamic';
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SmartFusionEnergyPage() {
  const [reactors, setReactors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reactorCode, setReactorCode] = useState('');
  const [facilityName, setFacilityName] = useState('');
  const [plasmaTempMillionsK, setPlasmaTempMillionsK] = useState('155.0');
  const [magneticConfinementTesla, setMagneticConfinementTesla] = useState('14.0');
  const [energyOutputMegawatts, setEnergyOutputMegawatts] = useState('480.0');
  const [aiInstabilityPrediction, setAiInstabilityPrediction] = useState('MAGNETOHYDRODYNAMIC_FEEDBACK_LOOP');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch('/api/smart-fusion-energy')
      .then(res => res.json())
      .then(data => {
        setReactors(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAddReactor = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);

    try {
      const res = await fetch('/api/smart-fusion-energy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reactorCode, facilityName, plasmaTempMillionsK, magneticConfinementTesla, energyOutputMegawatts, aiInstabilityPrediction }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to register reactor');

      setReactors([data, ...reactors]);
      setReactorCode('');
      setFacilityName('');
      alert('Fusion energy reactor registered successfully.');
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
                SMART FUSION ENERGY & MICROGRID HUB
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Campus Clean Fusion & Plasma Grid</h1>
            <p className="text-xs text-slate-400">Monitor plasma temperature (Millions K), magnetic field strength (Tesla), energy output (MW), and AI stabilization.</p>
          </div>
          <Link 
            href="/?school=dps" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleAddReactor} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>⚡</span> Register Fusion Reactor
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Reactor Code / ID</label>
              <input 
                type="text" 
                placeholder="e.g. FUSION-RX-04" 
                value={reactorCode} 
                onChange={e => setReactorCode(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Facility Name</label>
              <input 
                type="text" 
                placeholder="e.g. Advanced Tokamak Research Wing" 
                value={facilityName} 
                onChange={e => setFacilityName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Plasma Temp (Millions K)</label>
              <input 
                type="number" 
                step="1.0" 
                value={plasmaTempMillionsK} 
                onChange={e => setPlasmaTempMillionsK(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Magnetic Field (Tesla)</label>
              <input 
                type="number" 
                step="0.1" 
                value={magneticConfinementTesla} 
                onChange={e => setMagneticConfinementTesla(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Energy Output (MW)</label>
              <input 
                type="number" 
                step="10.0" 
                value={energyOutputMegawatts} 
                onChange={e => setEnergyOutputMegawatts(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">AI Stabilization Mode</label>
              <select 
                value={aiInstabilityPrediction} 
                onChange={e => setAiInstabilityPrediction(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
              >
                <option value="MAGNETOHYDRODYNAMIC_FEEDBACK_LOOP">Magnetohydrodynamic Feedback Loop</option>
                <option value="NEURAL_EDGE_LOCALIZED_MODE_SUPPRESSION">Neural Edge Localized Mode Suppression</option>
                <option value="DEEP_REINFORCEMENT_PLAZMA_STABILIZATION">Deep Reinforcement Plasma Stabilization</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={adding} 
              className="px-6 py-3 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-all disabled:opacity-50 shadow-lg shadow-amber-500/20"
            >
              {adding ? 'Registering Reactor...' : 'Add Fusion Reactor →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>⚡</span> Active Fusion Reactors ({reactors.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Reactor Code & Name</th>
                  <th className="p-4 font-medium">Plasma Temp & Energy Output</th>
                  <th className="p-4 font-medium">Magnetic Field</th>
                  <th className="p-4 font-medium text-right">AI Stabilization Mode</th>
                </tr>
              </thead>
              <tbody>
                {reactors.map((r: any) => (
                  <tr key={r.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-white">{r.reactorCode}</p>
                      <p className="text-[10px] text-slate-400">{r.facilityName}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-amber-400 font-semibold">{r.plasmaTempMillionsK}M Kelvin Plasma</p>
                      <p className="text-[10px] text-slate-400">{r.energyOutputMegawatts} MW Clean Output</p>
                    </td>
                    <td className="p-4 font-semibold text-slate-300">
                      {r.magneticConfinementTesla} Tesla
                    </td>
                    <td className="p-4 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        r.aiInstabilityPrediction === 'MAGNETOHYDRODYNAMIC_FEEDBACK_LOOP'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/35'
                          : r.aiInstabilityPrediction === 'NEURAL_EDGE_LOCALIZED_MODE_SUPPRESSION'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/35'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/35'
                      }`}>
                        {r.aiInstabilityPrediction}
                      </span>
                    </td>
                  </tr>
                ))}
                {reactors.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-500">
                      No fusion reactors registered.
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
