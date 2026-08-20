'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SmartSatellitePage() {
  const [stations, setStations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stationCode, setStationCode] = useState('');
  const [stationName, setStationName] = useState('');
  const [downlinkBandwidthGbps, setDownlinkBandwidthGbps] = useState('50.0');
  const [orbitalTrackingArcsec, setOrbitalTrackingArcsec] = useState('0.05');
  const [signalToNoiseDb, setSignalToNoiseDb] = useState('35.0');
  const [aiScintillationMode, setAiScintillationMode] = useState('ADAPTIVE_OPTICS_ATMOSPHERIC_COMPENSATION');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch('/api/smart-satellite')
      .then(res => res.json())
      .then(data => {
        setStations(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAddStation = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);

    try {
      const res = await fetch('/api/smart-satellite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stationCode, stationName, downlinkBandwidthGbps, orbitalTrackingArcsec, signalToNoiseDb, aiScintillationMode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to register station');

      setStations([data, ...stations]);
      setStationCode('');
      setStationName('');
      alert('Satellite ground station registered successfully.');
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
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/35">
                SMART ORBITAL SATELLITE & DEEP SPACE HUB
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Campus Satellite Uplink & Telemetry Grid</h1>
            <p className="text-xs text-slate-400">Monitor downlink bandwidth, orbital tracking accuracy, SNR, and AI scintillation compensation.</p>
          </div>
          <Link 
            href="/?school=dps" 
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleAddStation} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>📡</span> Register Ground Station
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Station Code / ID</label>
              <input 
                type="text" 
                placeholder="e.g. SAT-STATION-04" 
                value={stationCode} 
                onChange={e => setStationCode(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-fuchsia-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Station Name</label>
              <input 
                type="text" 
                placeholder="e.g. Orbital Array Beta" 
                value={stationName} 
                onChange={e => setStationName(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-fuchsia-500 focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Bandwidth (Gbps)</label>
              <input 
                type="number" 
                step="0.5" 
                value={downlinkBandwidthGbps} 
                onChange={e => setDownlinkBandwidthGbps(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-fuchsia-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">Tracking (arcsec)</label>
              <input 
                type="number" 
                step="0.01" 
                value={orbitalTrackingArcsec} 
                onChange={e => setOrbitalTrackingArcsec(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-fuchsia-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">SNR (dB)</label>
              <input 
                type="number" 
                step="0.1" 
                value={signalToNoiseDb} 
                onChange={e => setSignalToNoiseDb(e.target.value)} 
                required 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-fuchsia-500 focus:outline-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-400">AI Scintillation Mode</label>
              <select 
                value={aiScintillationMode} 
                onChange={e => setAiScintillationMode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-fuchsia-500 focus:outline-none"
              >
                <option value="ADAPTIVE_OPTICS_ATMOSPHERIC_COMPENSATION">Adaptive Optics Compensation</option>
                <option value="REAL_TIME_DOPPLER_SHIFT_CORRECTION">Real-Time Doppler Correction</option>
                <option value="QUANTUM_PHASE_NOISE_CANCELLATION">Quantum Phase Noise Cancellation</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={adding} 
              className="px-6 py-3 rounded-xl bg-fuchsia-500 text-slate-950 font-bold text-xs hover:bg-fuchsia-400 transition-all disabled:opacity-50 shadow-lg shadow-fuchsia-500/20"
            >
              {adding ? 'Registering Station...' : 'Add Ground Station →'}
            </button>
          </div>
        </form>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>📡</span> Active Ground Stations ({stations.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                  <th className="p-4 font-medium">Station Code & Name</th>
                  <th className="p-4 font-medium">Bandwidth & Tracking</th>
                  <th className="p-4 font-medium">Signal-to-Noise Ratio</th>
                  <th className="p-4 font-medium text-right">AI Scintillation Mode</th>
                </tr>
              </thead>
              <tbody>
                {stations.map((s) => (
                  <tr key={s.id} className="border-b border-slate-800/50 hover:bg-slate-950/30 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-white">{s.stationCode}</p>
                      <p className="text-[10px] text-slate-400">{s.stationName}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-fuchsia-400 font-semibold">{s.downlinkBandwidthGbps} Gbps Downlink</p>
                      <p className="text-[10px] text-slate-400">{s.orbitalTrackingArcsec} arcsec Tracking</p>
                    </td>
                    <td className="p-4 font-semibold text-slate-300">
                      {s.signalToNoiseDb} dB SNR
                    </td>
                    <td className="p-4 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        s.aiScintillationMode === 'ADAPTIVE_OPTICS_ATMOSPHERIC_COMPENSATION'
                          ? 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/35'
                          : s.aiScintillationMode === 'REAL_TIME_DOPPLER_SHIFT_CORRECTION'
                          ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/35'
                          : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/35'
                      }`}>
                        {s.aiScintillationMode}
                      </span>
                    </td>
                  </tr>
                ))}
                {stations.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-500">
                      No ground stations registered.
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
