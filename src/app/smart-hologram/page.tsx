'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SmartHologramPage() {
  const [pods, setPods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [podCode, setPodCode] = useState('');
  const [podName, setPodName] = useState('');
  const [holographicFps, setHolographicFps] = useState('120.0');
  const [spatialLatencyMs, setSpatialLatencyMs] = useState('2.5');
  const [bandwidthGbps, setBandwidthGbps] = useState('25.0');
  const [aiImmersiveMode, setAiImmersiveMode] = useState('REAL_TIME_VOLUMETRIC_GAUSSIAN_SPLATTING');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch('/api/smart-hologram')
      .then(res => res.json())
      .then(data => {
        setPods(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAddPod = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);

    try {
      const res = await fetch('/api/smart-hologram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ podCode, podName, holographicFps, spatialLatencyMs, bandwidthGbps, aiImmersiveMode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to register pod');

      setPods([data, ...pods]);
      setPodCode('');
      setPodName('');
      alert('Holographic pod registered successfully.');
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
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-pink-500/10 text-pink-400 border border-pink-500/35">
                SMART HOLOGRAPHIC & SPATIAL COMPUTING HUB
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Campus Holographic Telepresence Grid</h1>
            <p className="text-xs text-slate-400">Monitor frame rates, spatial latency, network bandwidth, and AI volumetric rendering modes.</p>
          </div>
          <Link 
            href="/?school=dps" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleAddPod} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🔮</span> Register Holographic Pod
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Pod Code / ID</label>
              <input 
                type="text" 
                placeholder="e.g. HOLO-POD-04" 
                value={podCode} 
                onChange={e => setPodCode(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-pink-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Pod Name</label>
              <input 
                type="text" 
                placeholder="e.g. Quantum Engineering Hologram Chamber" 
                value={podName} 
                onChange={e => setPodName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-pink-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Frame Rate (fps)</label>
              <input 
                type="number" 
                step="1.0" 
                value={holographicFps} 
                onChange={e => setHolographicFps(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-pink-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Latency (ms)</label>
              <input 
                type="number" 
                step="0.1" 
                value={spatialLatencyMs} 
                onChange={e => setSpatialLatencyMs(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-pink-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Bandwidth (Gbps)</label>
              <input 
                type="number" 
                step="0.5" 
                value={bandwidthGbps} 
                onChange={e => setBandwidthGbps(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-pink-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">AI Immersive Mode</label>
              <select 
                value={aiImmersiveMode} 
                onChange={e => setAiImmersiveMode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-pink-500 focus:outline-none"
              >
                <option value="REAL_TIME_VOLUMETRIC_GAUSSIAN_SPLATTING">Volumetric Gaussian Splatting</option>
                <option value="NEURAL_RADIANCE_FIELD_RENDERING">Neural Radiance Field (NeRF)</option>
                <option value="SUBLIMINAL_EYE_TRACKING_FOVEATED_RENDER">Foveated Eye-Tracking Render</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={adding} 
              className="px-6 py-3 rounded-xl bg-pink-500 text-slate-950 font-bold text-xs hover:bg-pink-400 transition-all disabled:opacity-50 shadow-lg shadow-pink-500/20"
            >
              {adding ? 'Registering Pod...' : 'Add Holographic Pod →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🔮</span> Active Holographic Pods ({pods.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Pod Code & Name</th>
                  <th className="p-4 font-medium">Frame Rate & Latency</th>
                  <th className="p-4 font-medium">Bandwidth</th>
                  <th className="p-4 font-medium text-right">AI Immersive Mode</th>
                </tr>
              </thead>
              <tbody>
                {pods.map((p) => (
                  <tr key={p.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-white">{p.podCode}</p>
                      <p className="text-[10px] text-slate-400">{p.podName}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-pink-400 font-semibold">{p.holographicFps} fps</p>
                      <p className="text-[10px] text-slate-400">{p.spatialLatencyMs} ms Latency</p>
                    </td>
                    <td className="p-4 font-semibold text-slate-300">
                      {p.bandwidthGbps} Gbps
                    </td>
                    <td className="p-4 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        p.aiImmersiveMode === 'REAL_TIME_VOLUMETRIC_GAUSSIAN_SPLATTING'
                          ? 'bg-pink-500/10 text-pink-400 border-pink-500/35'
                          : p.aiImmersiveMode === 'NEURAL_RADIANCE_FIELD_RENDERING'
                          ? 'bg-purple-500/10 text-purple-400 border-purple-500/35'
                          : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/35'
                      }`}>
                        {p.aiImmersiveMode}
                      </span>
                    </td>
                  </tr>
                ))}
                {pods.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-500">
                      No holographic pods registered.
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
